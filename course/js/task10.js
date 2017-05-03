/**
 * task10.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-05-03 15:56:27
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

    /**
     * 创建照相机
     * @PerspectiveCamera https://threejs.org/docs/index.html#api/cameras/PerspectiveCamera
     * @OrthographicCamera https://threejs.org/docs/index.html#api/cameras/OrthographicCamera
     */
    obj.setCamera = function(type, props, position) {
        if (type === 'perspective') {
            this.camera = new THREE.PerspectiveCamera(...props);
            this.camera.position.set(...position);
        } else {
            this.camera = new THREE.OrthographicCamera(...props);
            this.camera.position.set(...position);

        }

        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.camera);
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
        this.slight = new THREE.SpotLight(0xffffff, 1.5, 100);
        
        this.slight.position.set(-25, 40, 30);
        this.slight.target = this.carbody;
        // this.slight.shadow.camera.position.set(-25, 25, 55);
        this.slight.castShadow = true;

        this.slight.shadowDarkness = 0.5;
        // this.slight.shadow.camera.near = 1;
        // this.slight.shadow.camera.far = 100;
        // this.slight.shadow.camera.fov = 30;
        this.slight.shadow.mapSize.width = 1024; //阴影精度
        this.slight.shadow.mapSize.height = 1024; //阴影精度
        // this.slight.shadow.camera.visible = true
        // this.slight.shadowCameraVisible = true;
        
        this.scene.add(this.slight);

        // 添加阴影
        var helper = new THREE.CameraHelper( this.slight.shadow.camera );
        console.log(this.slight.shadow.camera);
        this.scene.add(helper);
        this.scene.add(new THREE.SpotLightHelper(this.slight))

    }

    obj.generateCar = function() {
        let carsize = [40, 20, 20],
            tssize = [4, 1.5, 14, 20],
            carcircle = [];

        this.carbody = new THREE.Mesh(new THREE.BoxGeometry(...carsize),
            new THREE.MeshStandardMaterial({
                color: 0xffffff
            }));
        this.carbody.position.set(0, carsize[1] * 0.25, 0);
        this.carbody.castShadow = true;
        // this.carbody.receiveShadow = true;

        for (let i = 0; i < 4; i++) {
            carcircle.push(new THREE.Mesh(new THREE.TorusGeometry(...tssize),
                new THREE.MeshStandardMaterial({
                    color: 0xffffff
                })));
            carcircle[i].position.set(i % 2 === 0 ? carsize[0] * 0.3 : -carsize[0] * 0.3, -carsize[1] * 0.25, i < 2 ? carsize[2] * 0.5 : -carsize[2] * 0.5);
            carcircle[i].castShadow = true;
            // carcircle[i].receiveShadow = true;
            this.scene.add(carcircle[i]);
        }

        this.scene.add(this.carbody);
    }

    obj.generatePlane = function() {
        let width = 150,
            height = 150;

        this.plane = new THREE.Mesh(new THREE.PlaneGeometry(width, height, 32, 32),
            new THREE.MeshLambertMaterial({
                color: 0x4a9a5a
            }));
        this.plane.rotation.x = -Math.PI * 0.5;
        this.plane.position.set(0, -10.5, 20);
        this.plane.receiveShadow = true;

        this.scene.add(this.plane);
    }

    obj.render = function() {
        let axes = new THREE.AxisHelper(30);
        this.scene.add(axes);

        this.renderer.render(this.scene, this.camera);
    }

    obj.clear = function() {
        this.scene = new THREE.Scene();
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

    obj.setCamera('ortho', [-wwidth * 0.04, wwidth * 0.04, wheight * 0.04, -wheight * 0.04, 1, 1000], [30, 15, 25]);
    obj.generateCar();
    obj.generatePlane();
    obj.setLight();

    obj.render();

};

document.addEventListener("DOMContentLoaded", init);
