

function loadMap15_1(){
    var level =15;
    var state = 1;
    var w = Number(levelData[String(level)].size.split('×')[0])*.1;
    var d = Number(levelData[String(level)].size.split('×')[1])*.1;
    var h = Number(levelData[String(level)].size.split('×')[2])*.1;
    var offsize = 2;
    var gd = arguments[0] ? arguments[0] : (h*.5);//设置参数a的默认值为1




    var box1 =  new THREE.BoxBufferGeometry(d+offsize,h+offsize, w+offsize);
    var box2 =  new THREE.BoxBufferGeometry( w+offsize,h+offsize,d+offsize);




    setPos(box1,0.5*d,0.5*w);
    setPos(box2,d+0.5*w,0.5*d);
    setPos(box2,d+1.5*w,0.5*d);

    setPos(box2,0.5*w,0.5*d+w);
    setPos(box1,1*w+0.5*d,1*d+0.5*w);
    setPos(box2,0.5*w+w+d,1.5*d);

    setPos(box2,0.5*w,0.5*d+w+d);
    setPos(box2,1.5*w,0.5*d+w+d);
    setPos(box1,2*w+0.5*d,0.5*w+2*d);

    function setPos(box,x,z){
        var mesh = new THREE.Mesh( box.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+z;
        mesh.position.x = -60+x;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }

}

