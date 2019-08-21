function loadMap2(v){
    // var gd = 12+24;
    var gd = v;
    var w1=33;
    var h=24+3;
    var g1=24.5;
    var w2=24.5;
    var g2=33;
    var offsize = 3;
    //wireframe:true,
    for(var i=0;i<4;i++){

        var geometry = new THREE.BoxBufferGeometry( w1+offsize,h,g1+offsize);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:0}) );
        mesh.position.z = i*g1-50+0.5*g1;
        mesh.position.x = -60+0.5*w1+2*w2;
        mesh.position.y = gd;
        scene.add( mesh );
        mapMeshs.push(mesh);
    }

    for(var i=0;i<4;i++){
        var geometry = new THREE.BoxBufferGeometry( w1+offsize,h,g1+offsize);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:0}) );
        mesh.position.z = i*g1-50+0.5*g1;
        mesh.position.x = -60+w1+0.5*w1+2*w2;
        mesh.position.y = gd;
        scene.add( mesh );
        mapMeshs.push(mesh);
    }

    for(var i=0;i<3;i++){
        var geometry = new THREE.BoxBufferGeometry( w2+offsize,h,g2+offsize);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:0}) );
        mesh.position.z = i*g2-50+0.5*g2;
        mesh.position.x = -60+w2*.5;
        mesh.position.y = gd;
        scene.add( mesh );
        mapMeshs.push(mesh);
    }
    for(var i=0;i<3;i++){
        var geometry = new THREE.BoxBufferGeometry( w2+offsize,h,g2+offsize);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:0}) );
        mesh.position.z = i*g2-50+0.5*g2;
        mesh.position.x =-60+w2*1.5;
        mesh.position.y = gd;
        scene.add( mesh );
        mapMeshs.push(mesh);
    }

}
