var tuopanMat = new THREE.MeshBasicMaterial( {
//            roughness: 0.8,
//            color: 0xffffff,
//            metalness: 0.2,
//            bumpScale: 0.0005,
    transparent: true
});
var textureLoader = new THREE.TextureLoader();
textureLoader.load( "assets/tp.jpg", function( map ) {
//            map.wrapS = THREE.RepeatWrapping;
//            map.wrapT = THREE.RepeatWrapping;

//            map.anisotropy = 4;
    tuopanMat.map = map;
           // map.repeat.set( 10, 24 );
//            tuopanMat.map.generateMipmaps = false;
//            tuopanMat.map.magFilter = THREE.LinearFilter;
    tuopanMat.needsUpdate = true;
} );
function creatTuoPan(){
    // for(var i=0;i<11;i++){
    //     var geometry = new THREE.BoxBufferGeometry( 10, 2, 200 );
    //     var mesh = new THREE.Mesh( geometry, tuopanMat );
    //     mesh.position.x = i*20-100;
    //     mesh.position.y = -2;
    //     scene.add( mesh );
    // }
    // for(var j=0;j<3;j++){
    //     var geometry = new THREE.BoxBufferGeometry( 220, 2, 10 );
    //     var mesh = new THREE.Mesh( geometry, tuopanMat );
    //     mesh.position.z = j*100-100;
    //     mesh.position.y = -4;
    //     scene.add( mesh );
    // }

//
    var meshs=[];
    var g1 = new THREE.BoxBufferGeometry( 120, 1, 100 );
    var m1 = new THREE.Mesh( g1, tuopanMat );
    m1.position.y = -1;
    scene.add( m1 );


    var g2 = new THREE.BoxBufferGeometry( 20, 1, 100 );
    var m2 = new THREE.Mesh( g2, tuopanMat );
    m2.position.x = -50;
    m2.position.y = m1.position.y-11;
    scene.add( m2 );

    var g3 = new THREE.BoxBufferGeometry( 20, 1, 100 );
    var m3 = new THREE.Mesh( g3, tuopanMat );
    m3.position.x = 50;
    m3.position.y = m1.position.y-11;
    scene.add( m3 );

    //|||||||||||||||||||||||||||||||||||||
    var g4 = new THREE.BoxBufferGeometry( 30, 11, 100 );
    var m4 = new THREE.Mesh( g4, tuopanMat );
    m4.position.y = m1.position.y-5.5;
    scene.add( m4 );

    // var g5 = new THREE.BoxBufferGeometry( 10, 11, 100 );
    // var m5 = new THREE.Mesh( g5, tuopanMat );
    // m5.position.y = m1.position.y-5.5;
    // m5.position.x = 25;
    // scene.add( m5 );
    //
    // var g6 = new THREE.BoxBufferGeometry( 10, 11, 100 );
    // var m6 = new THREE.Mesh( g6, tuopanMat );
    // m6.position.y = m1.position.y-5.5;
    // m6.position.x = -25;
    // scene.add( m6 );

    //----------------------------------------
    var g7 = new THREE.BoxBufferGeometry( 120, 11, 10 );
    var m7 = new THREE.Mesh( g7, tuopanMat );
    m7.position.y = m1.position.y-5.5;
    scene.add( m7 );

    var g8 = new THREE.BoxBufferGeometry( 20, 11, 20 );
    var m8 = new THREE.Mesh( g8, tuopanMat );
    m8.position.y = m1.position.y-5.5;
    m8.position.z = -40;
    m8.position.x = 50;
    scene.add( m8 );


    var g9 = new THREE.BoxBufferGeometry( 20, 11, 20 );
    var m9 = new THREE.Mesh( g9, tuopanMat );
    m9.position.y = m1.position.y-5.5;
    m9.position.z = +40;
    m9.position.x = 50;
    scene.add( m9 );

    var g10 = new THREE.BoxBufferGeometry( 20, 11, 20 );
    var m10 = new THREE.Mesh( g10, tuopanMat );
    m10.position.y = m1.position.y-5.5;
    m10.position.z = -40;
    m10.position.x = -50;
    scene.add( m10 );


    var g11 = new THREE.BoxBufferGeometry( 20, 11, 20 );
    var m11 = new THREE.Mesh( g11, tuopanMat );
    m11.position.y = m1.position.y-5.5;
    m11.position.z = +40;
    m11.position.x = -50;
    scene.add( m11 );


    meshs.push(m1);
    meshs.push(m2);
    meshs.push(m3);
    meshs.push(m4);
    // meshs.push(m5);
    // meshs.push(m6);
    meshs.push(m7);
    meshs.push(m8);
    meshs.push(m9);
    meshs.push(m10);
    meshs.push(m11);


    for(var i=0;i<meshs.length;i++){
        meshs[i].castShadow = true;//开启投影
        meshs[i].receiveShadow = true;//接收阴影
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
    var box=new THREE.BoxGeometry(6,5,4);//长宽高尺寸70,255,480
    var mesh=new THREE.Mesh(box,facematerial);//
    // scene.add(mesh);


}