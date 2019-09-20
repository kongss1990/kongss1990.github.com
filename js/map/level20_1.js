

function loadMap20_1(){
    var level = 20;
    var state = 1;
    var w = Number(levelData[String(level)].size.split('×')[0])*.1;
    var d = Number(levelData[String(level)].size.split('×')[1])*.1;
    var h = Number(levelData[String(level)].size.split('×')[2])*.1;
    var offsize = 2;
    var gd = arguments[0] ? arguments[0] : (h*.5);//设置参数a的默认值为1




    var box1 =  new THREE.BoxBufferGeometry(d+offsize,h+offsize, w+offsize);
    var box2 =  new THREE.BoxBufferGeometry( w+offsize,h+offsize,d+offsize);






    for(var i=0;i<4;i++){
        var mesh = new THREE.Mesh( box2.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+.5*d;
        mesh.position.x = -60+0.5*w+w*i;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }
    for(var i=0;i<4;i++){
        var mesh = new THREE.Mesh( box2.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+1.5*d;
        mesh.position.x = -60+0.5*w+w*i;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }
    for(var i=0;i<4;i++){
        var mesh = new THREE.Mesh( box2.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+2.5*d;
        mesh.position.x = -60+0.5*w+w*i;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }
    for(var i=0;i<4;i++){
        var mesh = new THREE.Mesh( box2.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+3.5*d;
        mesh.position.x = -60+0.5*w+w*i;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }
    for(var i=0;i<2;i++){
        var mesh = new THREE.Mesh( box1.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+0.5*w;
        mesh.position.x = -60+4*w+0.5*d+d*i;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }
    for(var i=0;i<2;i++){
        var mesh = new THREE.Mesh( box1.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+1.5*w;
        mesh.position.x = -60+4*w+0.5*d+d*i;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }
    for(var i=0;i<4;i++){
        var mesh = new THREE.Mesh( box2.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+2*w+0.5*d+d*i;
        mesh.position.x = -60+7*d+.5*w;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }

    for(var i=0;i<7;i++){
        var mesh = new THREE.Mesh( box1.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+4*d+0.5*w;
        mesh.position.x = -60+0.5*d+d*i;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }
    for(var i=0;i<7;i++){
        var mesh = new THREE.Mesh( box1.clone(), new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:1,wireframe:true}) );
        mesh.position.z = -50+4*d+1.5*w;
        mesh.position.x = -60+0.5*d+d*i;
        mesh.position.y = gd;
        scene.add( mesh );
        mesh.state=state;
        mapMeshs.push(mesh);
    }

}

