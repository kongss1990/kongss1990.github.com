

function loadMap(v){
    // var gd = 12;
    var gd =v;
    var w1=33;
    var h=24+3;
    var g1=24.5;
    var w2=24.5;
    var g2=33;
    var offsize = 3;
    for(var i=0;i<4;i++){

        var geometry = new THREE.BoxBufferGeometry( w1+offsize,h,g1+offsize);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:0}) );
        mesh.position.z = i*g1-50+0.5*g1;
        mesh.position.x = -60+0.5*w1;
        mesh.position.y = gd;
        scene.add( mesh );
        mapMeshs.push(mesh);
    }

    for(var i=0;i<4;i++){
        var geometry = new THREE.BoxBufferGeometry( w1+offsize,h,g1+offsize);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:0}) );
        mesh.position.z = i*g1-50+0.5*g1;
        mesh.position.x = -60+w1+0.5*w1;
        mesh.position.y = gd;
        scene.add( mesh );
        mapMeshs.push(mesh);
    }

    for(var i=0;i<3;i++){
        var geometry = new THREE.BoxBufferGeometry( w2+offsize,h,g2+offsize);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:0}) );
        mesh.position.z = i*g2-50+0.5*g2;
        mesh.position.x = -60+w1*2+0.5*w2;
        mesh.position.y = gd;
        scene.add( mesh );
        mapMeshs.push(mesh);
    }
    for(var i=0;i<3;i++){
        var geometry = new THREE.BoxBufferGeometry( w2+offsize,h,g2+offsize);
        var mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial({color:Math.random()*0xffffff,transparent:true,opacity:0}) );
        mesh.position.z = i*g2-50+0.5*g2;
        mesh.position.x = -60+w1*2+0.5*w2+w2;
        mesh.position.y = gd;
        scene.add( mesh );
        mapMeshs.push(mesh);
    }

}
// setTimeout(loadMap,1000);

function hitTest1(){
    for(var i=0;i<blocks.length;i++){
        blocks[i].geometry.computeBoundingBox();
        var box3dBlock = new THREE.Box3(
            blocks[i].geometry.boundingBox.min,
            blocks[i].geometry.boundingBox.max
        );
        var temp = blocks[i].clone();
        // box3dBlock.setFromObject(temp);
        for(var j=0;j<mapMeshs.length;j++){
            mapMeshs[j].geometry.computeBoundingBox();

            var box3dMap = new THREE.Box3(
                mapMeshs[j].geometry.boundingBox.min,
                mapMeshs[j].geometry.boundingBox.max
            );
            // box3dMap.setFromObject(mapMeshs[j]);
            if(box3dMap.containsBox(box3dBlock)){
               console.log(12);
            }

            var x = mapMeshs[j].position.x - blocks[i].position.x;
            var y = mapMeshs[j].position.z - blocks[i].position.z;
            var len= Math.sqrt(Math.pow(x,2)+Math.pow(y,2));

            console.log(len);
        }
    }
}