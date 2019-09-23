function GUI() {
}

//选取对象
GUI.targetObject = function () {
    this.type = ["AmbientLight", "PointLight", "SpotLight", "DirectionLight"]
    this.intensity = 0.8;
    this.distance = 1;
    this.castShadow = false;
    this.visible = false;
    this.color = "#ffae23"; // CSS string
    //this.color1 = [0,0,0]; // RGB array
    //this.color2 = [ 0, 128, 255, 0.3 ]; // RGB with alpha
    //this.color3 = { h: 350, s: 0.9, v: 0.3 }; // Hue, saturation, value
    this.creat = function () {

        // LIGHTS
        hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 50, 0);
        scene.add(hemiLight);
        hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
        scene.add(hemiLightHelper);
        //
        dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-1, 1.75, 1);
        dirLight.position.multiplyScalar(30);
        scene.add(dirLight);
        dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
        scene.add(dirLightHeper);

    }
}
//灯光
GUI.Linght = function () {
    this.type = ["PointLight", "SpotLight", "DirectionLight","HemisphereLight"];
    this.intensity = 0.8;
    this.distance = 1;
    this.castShadow = false;
    this.visible = false;
    this.color = "#ffae23"; // CSS string
    //this.color1 = [0,0,0]; // RGB array
    //this.color2 = [ 0, 128, 255, 0.3 ]; // RGB with alpha
    //this.color3 = { h: 350, s: 0.9, v: 0.3 }; // Hue, saturation, value
    this.creat = function () {

        var geometry = new THREE.SphereBufferGeometry(5, 5, 5 );
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000, visible: false } );
        var picker = new THREE.Mesh( geometry, material );
        picker.name = 'picker';


        switch (this.type) {
            case "AmbientLight" :

                break;
            case "PointLight" :
                var pointLight = new THREE.PointLight( 0xff0040, 2, 50 );
                var pointHelper = new THREE.PointLightHelper(pointLight);
                scene.add( pointHelper );

                picker.userData.object = pointLight;
                pointHelper.add( picker );
                pointLight.castShadow = true;
            case "SpotLight" :

                var spotLight = new THREE.SpotLight(0xffffff, 1.5);
                spotLight.position.set(0, 1500, 200);
                spotLight.castShadow = true;
                spotLight.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(70, 1, 200, 2000));
                spotLight.shadow.bias = -0.000222;
                spotLight.shadow.mapSize.width = 1024;
                spotLight.shadow.mapSize.height = 1024;
                var helper = new THREE.CameraHelper(spotLight.shadow.camera );
                scene.add(helper);

                scene.add( spotLight );

                var spotLightHelper = new THREE.SpotLightHelper( spotLight );
                scene.add( spotLightHelper );

                picker.userData.object = spotLight;
                spotLightHelper.add( picker );

                break;
            case "DirectionLight" :
                var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
                dirLight.color.setHSL( 0.1, 1, 0.95 );
                dirLight.position.set( -1, 1.75, 1 );
                dirLight.position.multiplyScalar( 30 );
                scene.add( dirLight );

                dirLight.castShadow = true;
                dirLight.shadow.mapSize.width = 2048;
                dirLight.shadow.mapSize.height = 2048;

                var d = 50;

                dirLight.shadow.camera.left = -d;
                dirLight.shadow.camera.right = d;
                dirLight.shadow.camera.top = d;
                dirLight.shadow.camera.bottom = -d;

                dirLight.shadow.camera.far = 3500;
                dirLight.shadow.bias = -0.0001;

                dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
                scene.add( dirLightHeper );

                picker.userData.object = dirLight;
                dirLightHeper.add( picker );
                break;
            case "HemisphereLight" :
                var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
                hemiLight.color.setHSL( 0.6, 1, 0.6 );
                hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
                hemiLight.position.set( 0, 50, 0 );
                scene.add( hemiLight );

                var hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
                scene.add( hemiLightHelper );

                picker.userData.object = hemiLight;
                hemiLightHelper.add( picker );

                break;
        }

        dragObjects.push(picker);
        render();
    }
}

//几何体
GUI.Geometry = function () {
    this.type = ["SphereBufferGeometry","IcosahedronBufferGeometry","OctahedronBufferGeometry","TetrahedronBufferGeometry","PlaneBufferGeometry","BoxBufferGeometry","CircleBufferGeometry","RingBufferGeometry","CylinderBufferGeometry","LatheBufferGeometry","TorusBufferGeometry","TorusKnotBufferGeometry"];
    this.wireframe = false;
    this.intensity = 0.8;
    this.distance = 1;
    this.castShadow = false;
    this.color = "#ffae23"; // CSS string
    //this.color1 = [0,0,0]; // RGB array
    //this.color2 = [ 0, 128, 255, 0.3 ]; // RGB with alpha
    //this.color3 = { h: 350, s: 0.9, v: 0.3 }; // Hue, saturation, value
    this.creat = function () {

        var material = new THREE.MeshBasicMaterial( { color: this.color, wireframe: this.wireframe });
        switch (this.type) {
            case "SphereBufferGeometry" :
                object = new THREE.Mesh(new THREE.SphereBufferGeometry(75, 20, 10), material);
                break;
            case "IcosahedronBufferGeometry" :
                object = new THREE.Mesh(new THREE.IcosahedronBufferGeometry(75, 1), material);
            case "OctahedronBufferGeometry" :
                object = new THREE.Mesh(new THREE.OctahedronBufferGeometry(75, 2), material);
                break;
            case "TetrahedronBufferGeometry" :
                object = new THREE.Mesh(new THREE.TetrahedronBufferGeometry(75, 0), material);
                break;
            case "PlaneBufferGeometry" :
                object = new THREE.Mesh(new THREE.PlaneBufferGeometry(100, 100, 4, 4), material);
            case "BoxBufferGeometry" :
                object = new THREE.Mesh(new THREE.BoxBufferGeometry(100, 100, 100, 4, 4, 4), material);
                break;
            case "CircleBufferGeometry" :
                object = new THREE.Mesh(new THREE.CircleBufferGeometry(50, 20, 0, Math.PI * 2), material);
                break;
            case "RingBufferGeometry" :
                object = new THREE.Mesh(new THREE.RingBufferGeometry(10, 50, 20, 5, 0, Math.PI * 2), material);
                break;
            case "CylinderBufferGeometry" :
                object = new THREE.Mesh(new THREE.CylinderBufferGeometry(25, 75, 100, 40, 5), material);
                break;
            case "LatheBufferGeometry" :
                var points = [];
                for (var i = 0; i < 50; i++) {
                    points.push(new THREE.Vector2(Math.sin(i * 0.2) * Math.sin(i * 0.1) * 15 + 50, ( i - 5 ) * 2));
                }
                object = new THREE.Mesh(new THREE.LatheBufferGeometry(points, 20), material);
            case "TorusBufferGeometry" :
                object = new THREE.Mesh(new THREE.TorusBufferGeometry(50, 20, 20, 20), material);
                break;
            case "TorusKnotBufferGeometry" :
                object = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(50, 10, 50, 20), material);
                break;
        }

        object.position.set((Math.random()*2-1)*500, 0, (Math.random()*2-1)*500);
        scene.add(object);
        object.castShadow = true;
        object.receiveShadow = true;
        dragObjects.push(object);
        render();

    }
    this.visible = false;
}

