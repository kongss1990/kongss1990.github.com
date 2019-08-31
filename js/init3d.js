if (!Detector.webgl) Detector.addGetWebGLMessage();

var container, scene, camera, renderer, stats;
var dragObjects = [];
var selectionBoxEdage = null;

var layer=0;

var boxL1=[];
var boxL2=[];
var boxL3=[];
var boxL4=[];

function render() {

    if (scene !== undefined) {
        updateEdg();
        //更新性能插件
        stats.update();
        renderer.render(scene, camera);
//            renderer.setPixelRatio(window.devicePixelRatio);
    }

    hitTest();
}
function setEdg(obj){
    if (selectionBoxEdage) {
        scene.remove(selectionBoxEdage);
        selectionBoxEdage = null;
    }
    selectionBoxEdage = new THREE.EdgesHelper(obj, 0xffff00,1);
    selectionBoxEdage.material.depthTest = true;
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
                    // dragObjects[ii].material = new THREE.MeshLambertMaterial({map: texture});
                    dragObjects[ii].material =facematerial
                }else{
                    dragObjects[ii].material =facematerial
                    // dragObjects[ii].material = new THREE.MeshLambertMaterial({map: texture,transparent:true,opacity:0.6});
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

                        // dragObjects[j].material=new THREE.MeshLambertMaterial({map: texture});
                        dragObjects[j].material =facematerial2
                        // vm.tipMessage = '提示：正确位置！';
                        if(dragObjects[j].position.y<dragObjects[j].geometry.parameters.depth){
                            if(boxL1.indexOf(dragObjects[j])==-1)boxL1.push(dragObjects[j]);
                        }else{
                            if(boxL2.indexOf(dragObjects[j])==-1)boxL2.push(dragObjects[j]);
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
            if(dragObjects.length==levelData[vm.level].num&&!success){
                if(okNum==levelData[vm.level].num){
                    layer++;

                    vm.tipMessage = '提示：第'+layer+'层码放完毕进入第'+(layer+1)+'层';
                    success = true;

                }else{
                    vm.tipMessage = '提示：托盘利用率低！'
                }
            }

            // if(okNum==mapMeshs.length &&!success){
            //     success = true;
            //     vm.showAddLayerBtn = true;
            //     vm.$Notice.success({
            //         title: '提示',
            //         desc: '恭喜你，过关了！',
            //         duration: 0
            //     });
            //
            // }
        }
    }

}
function hitTestKey(type,value){

    var tempObj = selectionBoxEdage.userData["target"].clone();
    if(type=='z'){
        tempObj.position.z += value;
    }else{
        tempObj.position.x += value;
    }
    var isOk = true;
    var box1 =  new THREE.Box3().setFromObject(tempObj);
    for(var i=0;i<dragObjects.length;i++){
    if(dragObjects[i]!=selectionBoxEdage.userData["target"]){
            var box2 = new THREE.Box3();
            box2.setFromObject(dragObjects[i]);
            if(box1.intersectsBox(box2)){
                isOk = false;
            }
    }

    }

    if(isOk){
        return true
    }else{
        return false
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
    camera.position.set(90, 150, 90);
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

    // scene.add(light);
    spotlight = light;

    var planeGeometry = new THREE.PlaneBufferGeometry(120, 100);
    planeGeometry.rotateX(-Math.PI / 2);
    var planeMaterial = new THREE.ShadowMaterial({opacity: 0.2});

    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -1;
    plane.receiveShadow = true;
    // scene.add(plane);

    //地板砖
    var planeGeometry1 = new THREE.PlaneBufferGeometry(1500, 1500);
    planeGeometry1.rotateX(-Math.PI / 2);
    var planeMaterial1 = new THREE.MeshBasicMaterial({
//            roughness: 0.8,
//            color: 0xffffff,
//            metalness: 0.2,
//            bumpScale: 0.0005,
        transparent: true,

    });

    var textureLoaderplane = new THREE.TextureLoader();
    textureLoaderplane.load("assets/plane.jpg", function (map) {
           map.wrapS = THREE.RepeatWrapping;
           map.wrapT = THREE.RepeatWrapping;
//            map.anisotropy = 4;
        planeMaterial1.map = map;
           map.repeat.set( 10, 10 );
        planeMaterial1.needsUpdate = true;
    });
    plane1 = new THREE.Mesh(planeGeometry1, planeMaterial1);
    plane1.position.y = -16;
    scene.add(plane1);


    var helper = new THREE.GridHelper(120, 100);
    helper.position.y = -1;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    scene.add(helper);

    stats = new Stats();
    // container.appendChild(stats.dom);

    var axes = new THREE.AxesHelper(120);
    axes.position.set(0, 0, 0);
    // scene.add(axes);



    // orbit.enabled = false;
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

        if(success){
            vm.tipMessage = '提示：第'+layer+'层码放完毕进入第'+(layer+1)+'层';
            while (dragObjects.length){
                dragObjects.pop();
            }
            success = false;

            if(layer==2){
                vm.showAddLayerBtn = true;
                vm.$Message.success('恭喜你，过关了！');
            }
        }

    });
    dragcontrols.addEventListener('drag', function (event) {

        var r = (event.object.rotation.y/(Math.PI*.5)*90)%360;
        if(r==0||r==180){

            var t1 = Math.abs(event.object.position.x)>60-event.object.geometry.parameters.width*.5+2;
            var t2 = Math.abs(event.object.position.z)>50-event.object.geometry.parameters.height*.5+2;
            if(t2||t1){
                // console.error('超出')
                // vm.$Message.destroy();
                // vm.$Message.error('超出20mm');
                vm.tipMessage = '提示：超出20mm'
            }else{
                // vm.$Message.destroy();
                vm.tipMessage = ''
            }

        }else{
            var t3 = Math.abs(event.object.position.x)>60-event.object.geometry.parameters.height*.5+2;
            var t4 = Math.abs(event.object.position.z)>50-event.object.geometry.parameters.width*.5+2;
            if(t3||t4){
                // console.error('超出')
               //  vm.$Message.destroy();
               // vm.$Message.error('超出20mm');
                vm.tipMessage = '提示：超出20mm'
            }else{
                // vm.$Message.destroy();
                vm.tipMessage = ''
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
                    if(hitTestKey('z',-step))selectionBoxEdage.userData["target"].position.z -= step;
                    break;
                case 65: // A
                    if(hitTestKey('x',-step))selectionBoxEdage.userData["target"].position.x -= step;
                    break;
                case 83: // S
                    if(hitTestKey('z',step))selectionBoxEdage.userData["target"].position.z += step;
                    break;
                case 68: // D
                    if(hitTestKey('x',step))selectionBoxEdage.userData["target"].position.x += step;
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


    //底座
    for (var i = 0; i < 8; i++) {
        var geometry = new THREE.BoxBufferGeometry(10, 2, 100);
        var mesh = new THREE.Mesh(geometry, tuopanMat);
        mesh.position.x = i * 15.5 - 55;
        mesh.position.y = -1;
        scene.add(mesh);
    }
    for (var j = 0; j < 4; j++) {
        var geometry = new THREE.BoxBufferGeometry(120, 16, 10);
        var mesh = new THREE.Mesh(geometry, tuopanMat);
        mesh.position.z = j * 30 - 45;
        mesh.position.y = -9;
        scene.add(mesh);
    }
    //底座标尺
    var lineSize = .3;
    var mRular = new THREE.MeshBasicMaterial({color:0x000000});
    var gRularW = new THREE.BoxGeometry(110, lineSize, lineSize);
    var mRularW = new THREE.Mesh(gRularW, mRular);
    mRularW.position.z = 55;
    scene.add(mRularW);

    var w1 = new THREE.Mesh(new THREE.BoxGeometry(lineSize, lineSize,5), mRular);
    w1.position.z = 55;
    w1.position.x = -60;
    scene.add(w1);
    var w2 = new THREE.Mesh(new THREE.BoxGeometry(lineSize, lineSize,5), mRular);
    w2.position.z = 55;
    w2.position.x = 60;
    scene.add(w2);

    var wCone1 = new THREE.ConeGeometry( 2, 5, 5 );
    var wConeMesh1 = new THREE.Mesh( wCone1, mRular );
    wConeMesh1.position.z = 55;
    wConeMesh1.position.x = -57;
    wConeMesh1.rotation.z = Math.PI*.5;
    scene.add( wConeMesh1 );

    var wCone2 = new THREE.ConeGeometry( 2, 5, 5 );
    var wConeMesh2 = new THREE.Mesh( wCone2, mRular );
    wConeMesh2.position.z = 55;
    wConeMesh2.position.x = 57;
    wConeMesh2.rotation.z = -Math.PI*.5;
    scene.add( wConeMesh2 );

    var gRularH = new THREE.BoxGeometry(lineSize, lineSize,90);
    var mRularH = new THREE.Mesh(gRularH, mRular);
    mRularH.position.x =65;
    scene.add(mRularH);

    var h1 = new THREE.Mesh(new THREE.BoxGeometry(5,lineSize, lineSize), mRular);
    h1.position.z = 50;
    h1.position.x = 65;
    scene.add(h1);
    var h2 = new THREE.Mesh(new THREE.BoxGeometry(5,lineSize, lineSize), mRular);
    h2.position.z = -50;
    h2.position.x = 65;
    scene.add(h2);

    var hCone1 = new THREE.ConeGeometry( 2, 5, 5 );
    var hConeMesh1 = new THREE.Mesh( hCone1, mRular );
    hConeMesh1.position.z = -47;
    hConeMesh1.position.x = 65;
    hConeMesh1.rotation.x = -Math.PI*.5;
    scene.add( hConeMesh1 );

    var hCone2 = new THREE.ConeGeometry( 2, 5, 5 );
    var hConeMesh2 = new THREE.Mesh( hCone2, mRular );
    hConeMesh2.position.z = 47;
    hConeMesh2.position.x = 65;
    hConeMesh2.rotation.x = Math.PI*.5;
    scene.add( hConeMesh2 );

    var gRularGG = new THREE.BoxGeometry(lineSize, 16,lineSize);
    var mRularGG = new THREE.Mesh(gRularGG, mRular);
    mRularGG.position.x =65;
    mRularGG.position.z =-50;
    mRularGG.position.y =-8;
    scene.add(mRularGG);

    var gRularGG = new THREE.BoxGeometry(lineSize, 16,lineSize);
    var mRularGG = new THREE.Mesh(gRularGG, mRular);
    mRularGG.position.x =65;
    mRularGG.position.z =-50;
    mRularGG.position.y =-8;
    scene.add(mRularGG);

    var h2 = new THREE.Mesh(new THREE.BoxGeometry(5,lineSize, lineSize), mRular);
    h2.position.z = -50;
    h2.position.x = 65;
    h2.position.y = -16;
    scene.add(h2);

    // var hConegg1 = new THREE.ConeGeometry( 1,2, 10 );
    // var hConeMeshgg1 = new THREE.Mesh( hConegg1, mRular );
    // hConeMeshgg1.position.z = 50;
    // hConeMeshgg1.position.x = 65;
    // hConeMeshgg1.position.y = -3;
    // scene.add( hConeMeshgg1 );
    //
    // var hConegg2 = new THREE.ConeGeometry( 1, 2, 10 );
    // var hConeMeshgg2 = new THREE.Mesh( hConegg2, mRular );
    // hConeMeshgg2.position.z = 50;
    // hConeMeshgg2.position.x = 65;
    // hConeMeshgg2.position.y = -10;
    // hConeMeshgg2.rotation.x = Math.PI;
    // scene.add( hConeMeshgg2 );

    //底座标尺文本
    var loader = new THREE.FontLoader();

    loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {

        var gTextH = new THREE.TextGeometry( '1200mm', {
            font: font,
            size: 3,
            height: .1,
            curveSegments: 10,

        } );
        var mTextW = new THREE.Mesh(gTextH, mRular);
        scene.add(mTextW);
        mTextW.rotation.x=-Math.PI*.5;
        mTextW.position.x = -5;
        mTextW.position.z = 60;


        var gTextH = new THREE.TextGeometry( '1000mm', {
            font: font,
            size: 3,
            height: .1,
            curveSegments: 10,

        } );
        var mTextH = new THREE.Mesh(gTextH, mRular);
        mTextH.rotation.x=-Math.PI*.5;
        mTextH.rotation.z=Math.PI*.5;
        mTextH.position.z = 8;
        mTextH.position.x = 70;
        scene.add(mTextH);

        var gTextD = new THREE.TextGeometry( '160mm', {
            font: font,
            size: 3,
            height: .1,
            curveSegments: 10,

        } );
        var mTextD = new THREE.Mesh(gTextD, mRular);
        // mTextD.rotation.x=-Math.PI*.5;
        // mTextD.rotation.z=Math.PI*.5;
        // mTextD.rotation.y=Math.PI*.25;
        mTextD.position.z = -50;
        mTextD.position.y = -10;
        mTextD.position.x = 65;
        scene.add(mTextD);
    } );

    texture = new THREE.TextureLoader().load('assets/crate.gif', render);
    texture.mapping = THREE.UVMapping;

    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();


    render();


}


var texture
init();

function addLayer(){
    vm.tipMessage = '';
    if(layer==4 ||dragObjects.length==levelData[vm.level].num){
        vm.$Message.error('超出范围');
        return;
    }
    layer++;
    var arr;
    if(layer%2){
       arr=boxL1;
    }else{
        arr=boxL2;
    }
    for(var i=0;i<arr.length;i++){
        var mesh = arr[i].clone();
        var h =Number(levelData[vm.level].size.split('×')[2])*.1*.5;
        mesh.position.y = h+(layer-1)*2*h;
        scene.add(mesh);
        if(layer%2){
            boxL3.push(mesh);
        }else{
            boxL4.push(mesh);
        }
    }
    render();
}
function addBox(e) {
    if(layer==4 ||dragObjects.length==levelData[vm.level].num){
        vm.$Message.error('超出范围');
        return;
    }
    var geometry = new THREE.BoxBufferGeometry(33, 24.5, 24);
    var material = new THREE.MeshLambertMaterial({map: texture,transparent:true,opacity:0.6});
    // var mesh = new THREE.Mesh(geometry, material);

    var mesh = new THREE.Mesh(geometry, facematerial);
    var h =Number(levelData[vm.level].size.split('×')[2])*.1*.5;
    mesh.position.y = h+layer*2*h;

    mesh.position.x = 80;
    mesh.position.z = -70;
    dragObjects.push(mesh);
    scene.add(mesh);
    setEdg(mesh)
    render();
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
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
function deleteBox() {
    if (selectionBoxEdage) {
        dragObjects.remove(selectionBoxEdage.userData["target"]);

        scene.remove(selectionBoxEdage.userData["target"]);
        scene.remove(selectionBoxEdage);
        selectionBoxEdage = null;
    }
    render();
}

function deleteBoxByLayer(index) {
    if(layer==0)return;






    if(layer==1 ){
        while(boxL1.length){
            scene.remove(boxL1[boxL1.length-1])
            boxL1.pop();
        }
        layer=0;
    }
    if(layer==2 ){
        while(boxL2.length){
            scene.remove(boxL2[boxL2.length-1])
            boxL2.pop();
        }
        layer=1;
    }
    if(layer==3 ){
        while(boxL3.length){
            scene.remove(boxL3[boxL3.length-1])
            boxL3.pop();
        }
        layer=2;
    }
    if(layer==4 ){
        while(boxL4.length){
            scene.remove(boxL4[boxL4.length-1])
            boxL4.pop();
        }
        layer=3;
    }
    // if (selectionBoxEdage) {
    //     var arr = dragObjects;
    //     for (var i = 0; i < arr.length; i++) {
    //         scene.remove(arr[i]);
    //     }
    //     dragObjects=[];
    //     scene.remove(selectionBoxEdage);
    //     selectionBoxEdage = null;
    // }
    render();
}
//加载六个面的纹理贴图
var texture1 = THREE.ImageUtils.loadTexture("assets/box/1.png");
var texture2= THREE.ImageUtils.loadTexture("assets/box/2.png");
var texture3 = THREE.ImageUtils.loadTexture("assets/box/3.png");
var texture4= THREE.ImageUtils.loadTexture("assets/box/4.png");
var texture5 = THREE.ImageUtils.loadTexture("assets/box/5.png");
// var texture6 = THREE.ImageUtils.loadTexture("assets/box/6.png");

var texture3_1 = THREE.ImageUtils.loadTexture("assets/box/3_1.png");
var materialArr=[
    //纹理对象赋值给6个材质对象
    new THREE.MeshPhongMaterial({map:texture1}),
    new THREE.MeshPhongMaterial({map:texture2}),
    new THREE.MeshPhongMaterial({map:texture3}),
    new THREE.MeshPhongMaterial({map:texture4}),
    new THREE.MeshPhongMaterial({map:texture5}),
    new THREE.MeshPhongMaterial({map:texture4})
];
//http://www.yanhuangxueyuan.com/Three.js_course/texture.html
//6个材质对象组成的数组赋值给MeshFaceMaterial构造函数
var facematerial=new THREE.MeshFaceMaterial(materialArr);

var materialArr2=[
    //纹理对象赋值给6个材质对象
    new THREE.MeshPhongMaterial({map:texture1}),
    new THREE.MeshPhongMaterial({map:texture2}),
    new THREE.MeshPhongMaterial({map:texture3_1}),
    new THREE.MeshPhongMaterial({map:texture4}),
    new THREE.MeshPhongMaterial({map:texture5}),
    new THREE.MeshPhongMaterial({map:texture4})
];
var facematerial2 = new THREE.MeshFaceMaterial(materialArr2);

var mapMeshs=[];