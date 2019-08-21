if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, scene, camera, renderer, stats;
var dragObjects = [];
var selectionBoxEdage = null;

var level=0;

var boxL1=[];
var boxL2=[];

function render() {

    if (scene !== undefined) {

        //更新性能插件
        stats.update();
        renderer.render(scene, camera);
//            renderer.setPixelRatio(window.devicePixelRatio);
    }
    updateEdg();
    hitTest();
}
function setEdg(obj){
    if (selectionBoxEdage) {
        scene.remove(selectionBoxEdage);
        selectionBoxEdage = null;
    }
    selectionBoxEdage = new THREE.EdgesHelper(obj, 0xffff00);
    selectionBoxEdage.material.depthTest = false;
    selectionBoxEdage.material.transparent = true;
    selectionBoxEdage.position.x = obj.position.x;
    selectionBoxEdage.position.y = obj.position.y;
    selectionBoxEdage.position.z = obj.position.z;
    selectionBoxEdage.applyMatrix(obj.matrix);

    selectionBoxEdage.userData["target"] = obj;
    scene.add(selectionBoxEdage);
}
function updateEdg(){
    if(selectionBoxEdage){
        selectionBoxEdage.position.x = selectionBoxEdage.userData["target"].position.x;
        selectionBoxEdage.position.y = selectionBoxEdage.userData["target"].position.y;
        selectionBoxEdage.position.z = selectionBoxEdage.userData["target"].position.z;
    }
}
function hitTest(){
    if(mapMeshs){
        boxL1=[];
        boxL2=[];
        var okNum=0;
        for(var ii=0;ii<dragObjects.length;ii++){

                var box11 = new THREE.Box3();
                box11.setFromObject(dragObjects[ii]);
                var isOk2 = false;
                for(var jj=0;jj<mapMeshs.length;jj++){
                    var box22 = new THREE.Box3();
                    box22.setFromObject(mapMeshs[jj]);
                    if(box11.containsBox(box22)){
                        isOk2 = true;
                    }
                }
                if(isOk2){
                    dragObjects[ii].material = new THREE.MeshLambertMaterial({map: texture});
                    // dragObjects[ii].material =facematerial
                }else{
                    // dragObjects[ii].material =facematerial
                    dragObjects[ii].material = new THREE.MeshLambertMaterial({map: texture,transparent:true,opacity:0.6});
                }


        }

        for(var i=0;i<mapMeshs.length;i++){
            if(dragObjects.length){
                var box1 = new THREE.Box3();
                box1.setFromObject(mapMeshs[i]);
                var isOk = false;
                for(var j=0;j<dragObjects.length;j++){
                    var box2 = new THREE.Box3();
                    box2.setFromObject(dragObjects[j]);
                    if(box1.containsBox(box2)){
                        isOk = true;

                        dragObjects[j].material=new THREE.MeshLambertMaterial({map: texture});
                        if(dragObjects[j].position.y<dragObjects[j].geometry.parameters.depth){
                            boxL1.push(dragObjects[j]);
                        }else{
                            boxL2.push(dragObjects[j]);
                        }
                    }
                }
                if(isOk){
                    okNum++;
                    // mapMeshs[i].visible = true;
                    // mapMeshs[i].material = new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true}) ;

                }else{
                    mapMeshs[i].visible = false;
                    mapMeshs[i].material = new THREE.MeshBasicMaterial({opacity: 0, transparent: true}) ;
                }


            }
            if(dragObjects.length>=mapMeshs.length*.5 && okNum==mapMeshs.length*.5 &&!success){
                    level=1;
                    // loadMap2();
            }
            if(okNum==mapMeshs.length &&!success){
                success = true;
                vm.showAddLayerBtn = true;
                vm.$Notice.success({
                    title: '提示',
                    desc: '恭喜你，过关了！',
                    duration: 0
                });

            }
        }
    }

}
var success = false;
function onWindowResize() {

    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    render();

}

var plane;
var orbit;

function init() {

    container = document.getElementById('viewport');

    renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, precision: 'highp'});
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    renderer.shadowMap.enabled = true;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);



    //为width/height,通常设置为canvas元素的高宽比。
    var aspect = window.innerWidth / window.innerHeight;


    camera = new THREE.PerspectiveCamera(70, aspect, 1, 10000);
    camera.position.set(0, 90, 90);
    scene.add(camera);

    orbit = new THREE.OrbitControls(camera, container);
    orbit.addEventListener('change', render);

    var target = new THREE.Vector3(0, 1, 0);
    camera.lookAt(target);
    orbit.target = target;

    window.addEventListener('resize', onWindowResize, false);


    scene.add(new THREE.AmbientLight(0xf0f0f0));
    var light = new THREE.SpotLight(0xffffff, 1.5);
    light.position.set(0, 1500, 200);
    light.castShadow = true;
    light.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 200, 2000));
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
//        scene.add(light);
    spotlight = light;

    var planeGeometry = new THREE.PlaneBufferGeometry(120, 100);
    planeGeometry.rotateX(-Math.PI / 2);
    var planeMaterial = new THREE.ShadowMaterial({opacity: 0.2});

    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -1;
    plane.receiveShadow = true;
//        scene.add(plane);

    var helper = new THREE.GridHelper(120, 100);
    helper.position.y = -1;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    stats = new Stats();
    // container.appendChild(stats.dom);

    var axes = new THREE.AxesHelper(120);
    axes.position.set(0, 0, 0);
    scene.add(axes);



    orbit.addEventListener('start', function () {

    });

    orbit.addEventListener('end', function () {

    });

    var dragcontrols = new THREE.DragControls(dragObjects, camera, renderer.domElement); //
//        dragcontrols.enabled = false;
    dragcontrols.addEventListener('hoveron', function (event) {
        // render();
    });

    dragcontrols.addEventListener('hoveroff', function (event) {
        render();
    });
    dragcontrols.addEventListener('dragstart', function (event) {
        orbit.enabled = false;
        render();

        setEdg(event.object)

    });
    dragcontrols.addEventListener('dragend', function (event) {
        orbit.enabled = true;
        render();


    });
    dragcontrols.addEventListener('drag', function (event) {

        var r = (event.object.rotation.y/(Math.PI*.5)*90)%360;
        if(r==0||r==180){

            var t1 = Math.abs(event.object.position.x)>60-event.object.geometry.parameters.width*.5+2;
            var t2 = Math.abs(event.object.position.z)>50-event.object.geometry.parameters.height*.5+2;
            if(t2||t1){
                // console.error('超出')
                vm.$Message.error('超出20mm');
            }

        }else{
            var t3 = Math.abs(event.object.position.x)>60-event.object.geometry.parameters.height*.5+2;
            var t4 = Math.abs(event.object.position.z)>50-event.object.geometry.parameters.width*.5+2;
            if(t3||t4){
                // console.error('超出')
                vm.$Message.error('超出20mm');
            }
        }


        // console.log(event.object.geometry.parameters.width,event.object.geometry.parameters.height);
        render();
    });


    window.addEventListener('keydown', function (event) {

        if(selectionBoxEdage){
            var step = 0.5;
            switch (event.keyCode) {
                case 87: // W
                    selectionBoxEdage.userData["target"].position.z -= step;
                    break;
                case 65: // A
                    selectionBoxEdage.userData["target"].position.x -= step;
                    break;
                case 83: // S
                    selectionBoxEdage.userData["target"].position.z += step;
                    break;
                case 68: // D
                    selectionBoxEdage.userData["target"].position.x += step;
                    break;
                case 82: //R
                case 69: //E
                    rotate90();
                    break;
                case 81: //Q
                    addBox();
                    break;
                case 46: //DELETE
                    deleteBox();
                    break;
            }


            render();
        }


    });

    window.addEventListener('keyup', function (event) {

        switch (event.keyCode) {

            case 17: // Ctrl

                break;

        }

    });




    var tuopanMat = new THREE.MeshBasicMaterial({
//            roughness: 0.8,
//            color: 0xffffff,
//            metalness: 0.2,
//            bumpScale: 0.0005,
        transparent: true,

    });
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load("assets/mutou.jpg", function (map) {
//            map.wrapS = THREE.RepeatWrapping;
//            map.wrapT = THREE.RepeatWrapping;

//            map.anisotropy = 4;
        tuopanMat.map = map;
//            map.repeat.set( 10, 24 );
//            tuopanMat.map.generateMipmaps = false;
//            tuopanMat.map.magFilter = THREE.LinearFilter;
        tuopanMat.needsUpdate = true;
    });


    for (var i = 0; i < 8; i++) {
        var geometry = new THREE.BoxBufferGeometry(10, 2, 100);
        var mesh = new THREE.Mesh(geometry, tuopanMat);
        mesh.position.x = i * 15.5 - 55;
        mesh.position.y = -1;
        scene.add(mesh);
    }
    for (var j = 0; j < 4; j++) {
        var geometry = new THREE.BoxBufferGeometry(120, 2, 10);
        var mesh = new THREE.Mesh(geometry, tuopanMat);
        mesh.position.z = j * 30 - 45;
        mesh.position.y = -3;
        scene.add(mesh);
    }

    texture = new THREE.TextureLoader().load('assets/crate.gif', render);
    texture.mapping = THREE.UVMapping;

    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();


    render();


}


var texture
init();

function addLayer(){

    var arr;
    if(level%2){
       arr=boxL1;
    }else{
        arr=boxL2;
    }
    for(var i=0;i<arr.length;i++){
        var mesh = arr[i].clone();
        mesh.position.y = 12+(level+1)*24;
        scene.add(mesh);
    }
    level++;
    render();
}
function addBox(e) {

    var geometry = new THREE.BoxBufferGeometry(33, 24.5, 24);
    var material = new THREE.MeshLambertMaterial({map: texture,transparent:true,opacity:0.6});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 12+level*24;
    dragObjects.push(mesh);
    scene.add(mesh);
    setEdg(mesh)
    render();
}
function rotate90() {
    if (selectionBoxEdage) {
        selectionBoxEdage.userData["target"].rotation.y = selectionBoxEdage.userData["target"].rotation.y + Math.PI / 2;
        selectionBoxEdage.userData["target"].__dirtyRotation = true;

        selectionBoxEdage.rotation.y = selectionBoxEdage.userData["target"].rotation.y;
    }
    render();
}

function deleteBox() {
    if (selectionBoxEdage) {
        scene.remove(selectionBoxEdage.userData["target"]);
        scene.remove(selectionBoxEdage);
        selectionBoxEdage = null;
    }
    render();
}

function deleteBoxByLayer(index) {

    if (selectionBoxEdage) {
        var arr = dragObjects;
        for (var i = 0; i < arr.length; i++) {
            scene.remove(arr[i]);
        }
        scene.remove(selectionBoxEdage);
        selectionBoxEdage = null;
    }
    render();
}
//加载六个面的纹理贴图
var texture1 = THREE.ImageUtils.loadTexture("assets/1.png");
var texture2= THREE.ImageUtils.loadTexture("assets/2.png");
var texture3 = THREE.ImageUtils.loadTexture("assets/3.png");
var texture4= THREE.ImageUtils.loadTexture("assets/4.png");
var texture5 = THREE.ImageUtils.loadTexture("assets/2.png");
var texture6 = THREE.ImageUtils.loadTexture("assets/2.png");
var materialArr=[
    //纹理对象赋值给6个材质对象
    new THREE.MeshPhongMaterial({map:texture1}),
    new THREE.MeshPhongMaterial({map:texture2}),
    new THREE.MeshPhongMaterial({map:texture3}),
    new THREE.MeshPhongMaterial({map:texture4}),
    new THREE.MeshPhongMaterial({map:texture5}),
    new THREE.MeshPhongMaterial({map:texture6})
];
//http://www.yanhuangxueyuan.com/Three.js_course/texture.html
//6个材质对象组成的数组赋值给MeshFaceMaterial构造函数
var facematerial=new THREE.MeshFaceMaterial(materialArr);

var mapMeshs=[];