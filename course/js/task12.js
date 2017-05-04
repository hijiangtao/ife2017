/**
 * task12.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-05-04 11:33:54
 * @version $Id$
 */

"use strict"

let globj = function(id) {
    let obj = new Object();

    // 创建渲染器
    obj.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById(id),
        antialias: true
    });
    obj.renderer.setClearColor(0x666666);
    obj.renderer.setSize(window.innerWidth, window.innerHeight);
    obj.renderer.shadowMap.enabled = true;
    obj.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 创建场景
    obj.scene = new THREE.Scene();

    obj.setCamera = function(type, props, position) {
        if (type === 'perspective') {
            this.camera = new THREE.PerspectiveCamera(...props);
            this.camera.position.set(...position);
        } else {
            this.camera = new THREE.OrthographicCamera(...props);
            this.camera.position.set(...position);

        }

        // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        // this.scene.add(this.camera);

        // axis helper
        let axes = new THREE.AxisHelper(30);
        this.scene.add(axes);

        // set trackballthis.controls
        this.controls = new THREE.TrackballControls(this.camera);

        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;

        this.controls.noZoom = false;
        this.controls.noPan = false;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.addEventListener('change', this.render);
    }

    obj.setLight = function() {
        // 环境光, 一般设置为白色或者灰色
        this.alight = new THREE.AmbientLight(0x666666);
        this.scene.add(this.alight);

        // 点光源
        // this.plight = new THREE.PointLight(0xff0000, 1.5, 100);
        // this.plight.position.set(30, 25, 20);
        // this.scene.add(this.plight);

        // 平行光, 例如太阳光, 平行光将以给定矢量的方向照射到所有平面
        // this.dlight = new THREE.DirectionalLight(0x989898);
        // this.dlight.position.set(-1, 1.8, 1);
        // this.scene.add(this.dlight);

        // 聚光灯
        this.slight = new THREE.SpotLight(0xffffff, 1.8, 150);

        this.slight.position.set(-30, 25, 38);
        this.slight.target = this.carbody;
        this.slight.castShadow = true;

        // this.slight.shadow.camera.near = 1;
        // this.slight.shadow.camera.far = 100;
        // this.slight.shadow.camera.fov = 30;
        this.slight.shadow.mapSize.width = 1024; //阴影精度
        this.slight.shadow.mapSize.height = 1024; //阴影精度

        this.slight.shadow.update(this.slight);
        this.scene.add(this.slight);

        // 添加阴影
        var helper = new THREE.CameraHelper(this.slight.shadow.camera);

        this.scene.add(helper);
        this.scene.add(new THREE.SpotLightHelper(this.slight));
    }

    obj.generateCar = function() {
        let carsize = [40, 20, 20],
            tssize = [4, 1.5, 18, 24];

        this.carcircle = [];
        this.carbody = new THREE.Mesh(new THREE.BoxGeometry(...carsize));
        this.carbody.position.set(0, carsize[1] * 0.25, 0);
        this.carbody.material.needsUpdate = true;
        this.carbody.castShadow = true;

        for (let i = 0; i < 4; i++) {
            this.carcircle.push(new THREE.Mesh(new THREE.TorusGeometry(...tssize)));
            this.carcircle[i].position.set(i % 2 === 0 ? carsize[0] * 0.3 : -carsize[0] * 0.3, -carsize[1] * 0.25, i < 2 ? carsize[2] * 0.5 : -carsize[2] * 0.5);
            this.carcircle[i].castShadow = true;
            this.carcircle[i].material.needsUpdate = true;
            this.scene.add(this.carcircle[i]);
        }

        this.scene.add(this.carbody);
    }

    obj.generatePlane = function() {
        let width = 150,
            height = 150;

        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 32, 32));
        this.plane.rotation.x = -Math.PI * 0.5;
        this.plane.position.set(0, -10.5, 20);
        this.plane.receiveShadow = true;
        this.plane.material.needsUpdate = true;

        this.scene.add(this.plane);
    }

    obj.addMaterial = function() {
        let loader = new THREE.TextureLoader();

        loader.load(
            '/course/img/box.jpg',
            function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(5, 5);
                obj.cartxture = new THREE.MeshLambertMaterial({ map: texture });
                obj.carbody.material = obj.cartxture;
                obj.render();
            }, {}, {}
        );
        loader.load(
            '/course/img/road.jpg',
            function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(5, 5);
                obj.roadtxture = new THREE.MeshLambertMaterial({ map: texture });
                obj.plane.material = obj.roadtxture;
                obj.render();
            }, {}, {}
        );
        loader.load(
            '/course/img/bg.jpg',
            function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(20, 20);
                obj.tyretxture = new THREE.MeshLambertMaterial({ map: texture });
                for (let i = 0, len = obj.carcircle.length; i < len; i++) {
                    obj.carcircle[i].material = obj.tyretxture;
                }
                obj.render();
            }, {}, {}
        );
    }

    obj.animate = function() {
        requestAnimationFrame(obj.animate);
        obj.controls.update();
    }

    obj.render = function() {
        obj.renderer.render(obj.scene, obj.camera);
    }

    obj.clear = function() {
        this.scene = new THREE.Scene();
    }

    obj.onWindowResize = function() {

        obj.camera.aspect = window.innerWidth / window.innerHeight;
        obj.camera.updateProjectionMatrix();

        obj.renderer.setSize(window.innerWidth, window.innerHeight);

        obj.controls.handleResize();

        obj.render();

    }

    return obj;
}

let init = function() {
    let id = 'mainCanvas',
        canvas = document.getElementById(id);
    if (!(canvas.getContext && canvas.getContext('experimental-webgl'))) {
        alert('Your browser does not support WebGL.');
        return;
    }

    let obj = new globj(id),
        wwidth = window.innerWidth,
        wheight = window.innerHeight,
        ratio = wwidth / wheight;

    // window.addEventListener('resize', obj.onWindowResize, false);
    obj.setCamera('perspective', [60, wwidth / wheight, 1, 1000], [35, 18, 32]);
    obj.addMaterial();
    obj.generateCar();
    obj.generatePlane();
    obj.setLight();
    obj.animate();

};

document.addEventListener("DOMContentLoaded", init);
