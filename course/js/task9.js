/**
 * task9.js
 * @authors Joe Jiang (hijiangtao@gmail.com)
 * @date    2017-05-02 10:18:56
 * @version $Id$
 */

"use strict"

var globj = function(id) {
    var obj = new Object();

    // 创建渲染器
    obj.renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById(id),
        antialias: true
    });
    obj.renderer.setClearColor(0x666666);
    obj.renderer.setSize( window.innerWidth, window.innerHeight );

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
        this.alight = new THREE.AmbientLight(0x666666);
        this.scene.add(this.alight);

        this.dlight = new THREE.DirectionalLight(0x989898); // 添加平行光
        this.dlight.position.set(30, 25, 20); // 设置平行光光源位置
        this.scene.add(this.dlight);
    }

    obj.generateCar = function() {
        var carsize = [40, 20, 20],
            tssize = [4, 1.5, 14, 20],
            carbody = new THREE.Mesh(new THREE.BoxGeometry(...carsize),
                new THREE.MeshPhongMaterial({
                    color: 0xffffff
                })),
            carcircle = [];
        carbody.position.set(0, carsize[1] * 0.25, 0)
        for (var i = 0; i < 4; i++) {
            carcircle.push(new THREE.Mesh(new THREE.TorusGeometry(...tssize),
                new THREE.MeshPhongMaterial({
                    color: 0xffffff
                })));
            carcircle[i].position.set(i % 2 === 0 ? carsize[0] * 0.3 : -carsize[0] * 0.3, -carsize[1] * 0.25, i < 2 ? carsize[2] * 0.5 : -carsize[2] * 0.5);
            this.scene.add(carcircle[i]);
        }

        this.scene.add(carbody);
    }

    obj.add = function(m) {
        obj.scene.add(m);
    }

    obj.render = function() {
        this.renderer.render(this.scene, this.camera);
    }

    obj.clear = function() {
        this.scene = new THREE.Scene();
    }

    return obj;
}

var init = function() {
    var id = 'mainCanvas',
        canvas = document.getElementById(id);
    if (!(canvas.getContext && canvas.getContext('experimental-webgl'))) {
        alert('Your browser does not support WebGL.');
        return;
    }

    var obj = new globj(id),
        cube = new THREE.Mesh(new THREE.CubeGeometry(1, 2, 3),
            new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
        ),
        wfcube = new THREE.Mesh(new THREE.CubeGeometry(6, 6, 6),
            new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            })
        );

    document.getElementsByTagName('select')[0].addEventListener('click', draw);

    function draw(e) {
        var mode = e.target || null,
            modeVal = mode.options[mode.selectedIndex].value || 'carmodel',
            wwidth = window.innerWidth,
            wheight = window.innerHeight;

        obj.clear();
        switch (modeVal) {
            case 'ortho':
                obj.setCamera('ortho', [-wwidth / 100, wwidth / 100, wheight / 100, -wheight / 100, 1, 100], [8, -6, 10]);
                obj.add(wfcube);
                break;
            case 'perspective':
                obj.setCamera('perspective', [60, wwidth / wheight, 1, 100], [0, 0, 16]);
                obj.add(wfcube);
                break;
            case 'carmodel':
                obj.setCamera('perspective', [60, wwidth / wheight, 1, 1000], [30, 20, 30]);
                obj.generateCar();
                obj.setLight();
                break;
            default:
                obj.setCamera('perspective', [45, wwidth / wheight, 1, 100], [0, 0, 5]);
                obj.add(cube);
                break;
        };

        obj.render();
    }

    // init
    draw({
        'target': document.getElementsByTagName('select')[0]
    });
};

document.addEventListener("DOMContentLoaded", init);
