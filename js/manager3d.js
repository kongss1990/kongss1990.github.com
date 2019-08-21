'use strict';

Physijs.scripts.worker = 'js/physijs_worker.js';
Physijs.scripts.ammo = 'ammo.js';

var initScene, initEventHandling, render, createTower, loader, transformControl, vvv,
    renderer, render_stats, physics_stats, scene, dir_light, am_light, camera,
    table, blocks = [], table_material, block_material, intersect_plane,
    selected_block = null, mouse_position = new THREE.Vector3, block_offset = new THREE.Vector3, _i,
    _v3 = new THREE.Vector3;
var dragObjects = [];
var tempBlock = null;
var isKeyDown = false;
var isMouseDown = false;
var oldRotation = [];
var selectionBoxEdage = null;


initScene = function () {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    document.getElementById('viewport').appendChild(renderer.domElement);

    render_stats = new Stats();
    render_stats.domElement.style.position = 'absolute';
    render_stats.domElement.style.top = '1px';
    render_stats.domElement.style.zIndex = 100;
    // document.getElementById( 'viewport' ).appendChild( render_stats.domElement );

    physics_stats = new Stats();
    physics_stats.domElement.style.position = 'absolute';
    physics_stats.domElement.style.top = '50px';
    physics_stats.domElement.style.zIndex = 100;
    // document.getElementById( 'viewport' ).appendChild( physics_stats.domElement );

    scene = new Physijs.Scene({fixedTimeStep: 1 / 120});
    scene.setGravity(new THREE.Vector3(0, -30, 0));
    scene.background = new THREE.Color(0xf0f0f0);

    var axes = new THREE.AxesHelper(100);
    axes.position.set(0, 0, 0);
    scene.add(axes);
    scene.addEventListener(
        'update',
        function () {


            if (selected_block !== null) {
                // for(var k=0;k<blocks.length;k++){
                //     if(blocks[k]!=selected_block){
                //         blocks[k].mass=0;
                //     }
                // }
                _v3.copy(mouse_position).add(block_offset).sub(selected_block.position).multiplyScalar(5);
//                        _v3.y = 0;
                _v3.x += 1;
                selected_block.setLinearVelocity(_v3);

                // Reactivate all of the blocks
                _v3.set(0, 0, 0);
                for (_i = 0; _i < blocks.length; _i++) {
                    blocks[_i].applyCentralImpulse(_v3);
                }


            }
            if (isMouseDown) {

                for (var i = 0; i < dragObjects.length; i++) {
                    dragObjects[i].rotation.y = oldRotation[i];
                    dragObjects[i].__dirtyRotation = true;
                }
            }

            if (isKeyDown && selectionBoxEdage) {

                // for(var k=0;k<blocks.length;k++){
                //     if(blocks[k]!=selected_block){
                //         blocks[k].mass=0;
                //     }
                // }
                var step = 0.2;
                switch (isKeyDown) {
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
                }
                selectionBoxEdage.userData["target"].__dirtyPosition = true;
                selectionBoxEdage.position.x = selectionBoxEdage.userData["target"].position.x;
                selectionBoxEdage.position.z = selectionBoxEdage.userData["target"].position.z;
                selectionBoxEdage.rotation.y = -selectionBoxEdage.userData["target"].rotation.y
            }


            scene.simulate(undefined, 1);
            physics_stats.update();
        }
    );


    //为width/height,通常设置为canvas元素的高宽比。
    var aspect = window.innerWidth / window.innerHeight;

    camera = new THREE.PerspectiveCamera(70, aspect, 1, 10000);
    camera.position.set(0, 90, 90);
    scene.add(camera);

    var orbit = new THREE.OrbitControls(camera, renderer.domElement);
//            orbit.minPolarAngle = -Math.PI*.5; // radians
//            orbit.maxPolarAngle = Math.PI; // radians
//            orbit.addEventListener('change', render);

    orbit.addEventListener('start', function () {

        cancelHideTransorm();

    });

    orbit.addEventListener('end', function () {

        delayHideTransform();

    });
    transformControl = new THREE.TransformControls(camera, renderer.domElement);
    transformControl.axis = "XZ";
//            transformControl.addEventListener('change', render);
    scene.add(transformControl);

    // Hiding transform situation is a little in a mess :()
    transformControl.addEventListener('change', function (e) {
//                console.log('down',e);
        cancelHideTransorm();
        if (selected_block !== null) {
            mouse_position.copy(e.target.position);
        }


    });

    transformControl.addEventListener('mouseDown', function (e) {
        isMouseDown = true;
        oldRotation = [];
        for (var i = 0; i < dragObjects.length; i++) {
            oldRotation.push(dragObjects[i].rotation.y);
        }
        selected_block = tempBlock;


        cancelHideTransorm();
        var v = new THREE.Vector3(0, 0, 0);
        selected_block.setAngularFactor(v);
        selected_block.setAngularVelocity(v);
        selected_block.setLinearFactor(v);
        selected_block.setLinearVelocity(v);

        mouse_position.copy(e.target.position);
        block_offset.subVectors(selected_block.position, mouse_position);

        intersect_plane.position.y = mouse_position.y;

    });

    transformControl.addEventListener('mouseUp', function (e) {

        isMouseDown = false;
        delayHideTransform();

        var obj = selected_block;
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

        if (selected_block !== null) {
            var v = new THREE.Vector3(1, 1, 1);
            selected_block.setAngularFactor(v);
            selected_block.setLinearFactor(v);
            selected_block = null;
//                    tempBlock = null;
        }
    });

    transformControl.addEventListener('objectChange', function (e) {


    });

    var dragcontrols = new THREE.DragControls(dragObjects, camera, renderer.domElement); //
    dragcontrols.enabled = false;
    dragcontrols.addEventListener('hoveron', function (event) {
        tempBlock = event.object;
        transformControl.attach(event.object);
//                render();
        cancelHideTransorm();

    });
    dragcontrols.addEventListener('dragstart', function (event) {


        var obj = event.object;
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

    });


    dragcontrols.addEventListener('hoveroff', function (event) {

        delayHideTransform();

    });

    var hiding;

    function delayHideTransform() {

        cancelHideTransorm();
        hideTransform();

    }

    function hideTransform() {

        hiding = setTimeout(function () {

            transformControl.detach(transformControl.object);

        }, 2500)

    }

    function cancelHideTransorm() {

        if (hiding) clearTimeout(hiding);

    }


    // ambient light
    am_light = new THREE.AmbientLight(0x444444);
    scene.add(am_light);

    // directional light
    dir_light = new THREE.DirectionalLight(0xFFFFFF);
    dir_light.position.set(20, 30, -5);
    dir_light.target.position.copy(scene.position);
    dir_light.castShadow = true;
    dir_light.shadowCameraLeft = -30;
    dir_light.shadowCameraTop = -30;
    dir_light.shadowCameraRight = 30;
    dir_light.shadowCameraBottom = 30;
    dir_light.shadowCameraNear = 20;
    dir_light.shadowCameraFar = 200;
    dir_light.shadowBias = -.001
    dir_light.shadowMapWidth = dir_light.shadowMapHeight = 2048;
    dir_light.shadowDarkness = .5;
    scene.add(dir_light);

    // Loader
    loader = new THREE.TextureLoader();

    // Materials
    table_material = Physijs.createMaterial(
        new THREE.MeshBasicMaterial({opacity: 0, transparent: true}),
        // new THREE.MeshLambertMaterial({ map: loader.load('assets/FloorsCheckerboard_S_Diffuse.jpg')}),
        .9, // high friction
        .0 // low restitution
    );
    // table_material.map.wrapS = table_material.map.wrapT = THREE.RepeatWrapping;
    // table_material.map.repeat.set( 5, 5 );

    block_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({map: loader.load('assets/crate.gif')}),
        .9, // medium friction
        .0 // medium restitution
    );

    block_material.map.wrapS = block_material.map.wrapT = THREE.RepeatWrapping;
    block_material.map.repeat.set(1, .5);

    // Table
    table = new Physijs.BoxMesh(
        new THREE.BoxGeometry(1200, 1, 1000),
        table_material,
        0, // mass
        {restitution: .0, friction: 50.8}
    );
    table.position.y = -.5;
    table.receiveShadow = true;
    scene.add(table);

    creatTuoPan();

    createTower();

    intersect_plane = new THREE.Mesh(
        new THREE.PlaneGeometry(120, 100),
        new THREE.MeshBasicMaterial({opacity: 0, transparent: true})
    );
    intersect_plane.rotation.x = Math.PI / -2;
    scene.add(intersect_plane);


    requestAnimationFrame(render);
    scene.simulate();
};

render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    render_stats.update();
    if(hitTest)hitTest();
};

createTower = (function () {
    var block_length = 24.5, block_height = 24.5, block_width =33, block_offset = 33,
        block_geometry = new THREE.BoxGeometry(block_length, block_height, block_width);


    return function () {
        var i, j, rows = 1,
            block;

        for (i = 0; i < rows; i++) {
            for (j = 0; j < 1; j++) {
                block = new Physijs.BoxMesh(block_geometry, block_material);

                dragObjects.push(block);
                block.position.y = (block_height / 2) + block_height * i + 10;
                if (i % 2 === 0) {
                    // block.rotation.y = Math.PI / 2.01; // #TODO: There's a bug somewhere when this is to close to 2
                    block.position.x = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
                } else {
                    block.position.z = block_offset * j - ( block_offset * 3 / 2 - block_offset / 2 );
                }
                block.receiveShadow = true;
                block.castShadow = true;
                scene.add(block);
                blocks.push(block);
            }
        }
    }
})();


window.onload = initScene;
window.addEventListener('keydown', function (event) {

    isKeyDown = event.keyCode;
    // console.log(event.keyCode);
    return
    switch (event.keyCode) {
        case 87: // W
            break;
        case 65: // A
            break;
        case 83: // R
            break;
        case 68: // R
            break;
        case 187:
        case 107: // +, =, num+
            transformControl.setSize(transformControl.size + 0.1);
            break;

        case 189:
        case 109: // -, _, num-
            transformControl.setSize(Math.max(transformControl.size - 0.1, 0.1));
            break;

    }

});

window.addEventListener('keyup', function (event) {
    isKeyDown = false;
    switch (event.keyCode) {

        case 17: // Ctrl
            transformControl.setTranslationSnap(null);
            transformControl.setRotationSnap(null);
            break;

    }

});


function rotate90() {
    if (selectionBoxEdage) {
        selectionBoxEdage.userData["target"].rotation.y = selectionBoxEdage.userData["target"].rotation.y + Math.PI / 2;
        selectionBoxEdage.userData["target"].__dirtyRotation = true;

        selectionBoxEdage.rotation.y = selectionBoxEdage.userData["target"].rotation.y;
    }
}

function deleteBox() {
    if (selectionBoxEdage) {
        scene.remove(selectionBoxEdage.userData["target"]);
        scene.remove(selectionBoxEdage);
        selectionBoxEdage = null;
    }
}

function deleteBoxByLayer(index) {

    if (selectionBoxEdage) {
        var arr = blocks;
        for (var i = 0; i < arr.length; i++) {
            scene.remove(arr[i]);
        }
        scene.remove(selectionBoxEdage);
        selectionBoxEdage = null;
    }
}