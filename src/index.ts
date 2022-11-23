// use three.js to render a simple scene to the canvas with id "canvas"
import * as THREE from 'three';
import { degToRad } from 'three/src/math/MathUtils';
import Fire from './Fire'
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

addEventListener('keypress', (event) => {});



const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 2000)
camera.position.z = 1;
let dx = degToRad(0);
let dy = degToRad(0);

onkeydown = function ( event ) {

    switch ( event.code ) {
        case 'KeyW': 
        camera.rotateX(dx*-1);
        camera.translateZ(-.1);
        camera.rotateX(dx);
        break;

        case 'KeyA': 
        camera.translateX(-.1);
        break;

        case 'KeyS': 
        camera.rotateX(dx*-1);
        camera.translateZ(.1);
        camera.rotateX(dx);
        break;

        case 'KeyD': 
        camera.translateX(.1);
        break;

        case 'KeyE': 
        camera.rotateX(dx*-1);
        camera.rotateY(degToRad(-5));
        camera.rotateX(dx);
        dy-=degToRad(5);
        break;

        case 'KeyQ': 
        camera.rotateX(dx*-1);
        camera.rotateY(degToRad(5));
        camera.rotateX(dx);
        dy+=degToRad(5);
        break;

        case 'KeyU': 
        camera.rotateX(degToRad(5));
        dx+=degToRad(5);
        break;

        case 'KeyY': 
        camera.rotateX(degToRad(-5));
        dx-=degToRad(5);
        break;

    }

};



const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
const material = new THREE.MeshNormalMaterial();

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const geometry2 = new THREE.PlaneGeometry( 0.5, 0.5 );
const fire = new Fire(geometry2, scene)
scene.add(fire.getMesh())

let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( '/textures/isu.jpeg');
let texture_bk = new THREE.TextureLoader().load( '/textures/isu.jpeg');
let texture_up = new THREE.TextureLoader().load( '/textures/isu.jpeg');
let texture_dn = new THREE.TextureLoader().load( '/textures/isu.jpeg');
let texture_rt = new THREE.TextureLoader().load( '/textures/isu.jpeg');
let texture_lf = new THREE.TextureLoader().load( '/textures/isu.jpeg');
  
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { color: 0x6a9dd2 }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
   
for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;
   
let skyboxGeo = new THREE.BoxGeometry( 400, 100, 400);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );

scene.add( skybox );

// FLOOR
const floorTexture = new THREE.TextureLoader().load( 'textures/check64.png' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 2000, 2000 );
const floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
const floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
floor.rotation.x = Math.PI / 2;
scene.add(floor);

const renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvas } );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animation );
// animation

function animation( time:any ) {

	mesh.rotation.x = time / 2000;
	mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

