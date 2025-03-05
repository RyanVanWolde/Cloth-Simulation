import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { InitNet } from './InitNet.js';


let renderer, scene, camera, controls;
let clock;
let vertexInstances, shapeGeometry, shape, sticks;
let order;
let spotLight;


// black net
let color = '#000000';
let scale = 0.1;
const width = 45;
const height = 30;


function init() {

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild( renderer.domElement );

    var camOffset = 2;
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set((width * scale) + camOffset, 2, (height * scale) + camOffset);

    scene = new THREE.Scene();

    const hemisphereLight = new THREE.HemisphereLight(0xc4dce5, 0x080820, 4);
    scene.add(hemisphereLight);

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;

    spotLight = new THREE.SpotLight(0xc4dce5, 4);
    spotLight.castShadow = true;
    spotLight.shadow.bias = -0.0001;
    spotLight.shadow.mapSize = new THREE.Vector2(1024*4,1024*4);
    scene.add(spotLight)
}


function initObjects() {
 
    var obj = InitNet(width, height);
    vertexInstances = obj[0];
    sticks = obj[1];

    var pos = []
    order = []

    // number of squares
    var squares = (width - 1) * (height - 1);
    var vertices = vertexInstances.vertices;

    for (let i = 0; i < (vertices.length + 0); i++) {

        if ((i + 1) < squares + (height - 1)) {
            if (((i + 1) % width) != 0) {
                pos.push(vertices[i].position);
                pos.push(vertices[i + 1].position);
                pos.push(vertices[i + width].position);

                order.push(i);
                order.push(i + 1);
                order.push(i + width);

                pos.push(vertices[i + 1].position);
                pos.push(vertices[i + width].position);
                pos.push(vertices[i + width + 1].position);

                order.push(i + 1);
                order.push(i + width);
                order.push(i + width + 1);
            }
        }
    }

    shapeGeometry = new THREE.BufferGeometry().setFromPoints(pos);

    shapeGeometry.computeVertexNormals();
    shapeGeometry.computeBoundingBox();
    

    var base =
        [
            // top left
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,

            // bottom right
            1.0, 0.0,
            0.0, 1.0,
            1.0, 1.0
            
        ];

    var quad_uvs = []

    for (let i = 0 ; i < ((width-1)*(height-1)) ; i++) {
        base.forEach(function (q) {
            quad_uvs.push(q)
        });
    }

    var uvs = new Float32Array( quad_uvs);

    shapeGeometry.setAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

    var material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        color: color,
        wireframe: true,

        normalScale: new THREE.Vector2(0.5,0.5),
        bumpScale: 1,
        roughness: 1,

    });


    shape = new THREE.Mesh(shapeGeometry, material);


    shape.castShadow = true;
    shape.receiveShadow = true;

    scene.add(shape);

}

function initControls() {

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set( (width * scale) / 2, 0, (height * scale) / 2 );

    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;

    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.0;

    controls.update();
}


function draw() {

    let timedelta = clock.getDelta();

    // if less than 5 fps pause to stop glitches
    if (timedelta > 1 / 5) {
        timedelta = 0;
    }

    vertexInstances.updatePoints(timedelta);
    for (let i = 0; i < 3; i++) {
        sticks.forEach(function (stick) {
            stick.updateStick(timedelta);
        });
    }


    for (let i = 0; i < order.length; i++) {

        var index = order[i]

        var pos = vertexInstances.vertices[index].position;

        shapeGeometry.attributes.position.setXYZ(i, pos.x, pos.y, pos.z);

    }

    shapeGeometry.attributes.position.needsUpdate = true;

    shapeGeometry.scale(scale, scale, scale)

    // No need to update normals because Three.js does that automatically

    spotLight.position.set(
        camera.position.x + 1,
        camera.position.y + 1,
        camera.position.z + 1,
    );

    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(draw);

}


// Event Listener 
// Changes the direction of gravity on click
// ------------------------------------------------------
window.addEventListener('click', function(e){
    vertexInstances.gravity = vertexInstances.gravity * -1;
});

// -------------------------------------------------------


init();
initObjects();
initControls();

draw();

// -----------------------------------------------------