import * as THREE from 'three';
import TWEEN from 'three/examples/jsm/libs/tween.module';
import init from './init';
import './style.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const { sizes, camera, scene, canvas, controls, renderer } = init();

camera.position.set(0, 2, 5);

const floor = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshStandardMaterial({
		color: '#444444',
		metalness: 0,
		roughness: 0.5,
	}),
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
scene.add(dirLight);

const loader = new GLTFLoader();
let mixer = null;
loader.load('/models/BrainStem/BrainStem.gltf', (gltf) => {
	console.log(gltf);
	mixer = new THREE.AnimationMixer(gltf.scene);
	const action = mixer.clipAction(gltf.animations[0]);
	action.play();
	// avocado.scale.set(5, 5, 5);
	scene.add(gltf.scene);
});
loader.load('/models/FlightHelmet/FlightHelmet.gltf', (gltf) => {
	console.log(gltf);
	const model = gltf.scene;
	model.position.x = 2;
	model.scale.set(5, 5, 5);
	scene.add(model);
});

const clock = new THREE.Clock();
const render = () => {
	const delta = clock.getDelta();
	controls.update();
	renderer.render(scene, camera);
	if (mixer) {
		mixer.update(delta);
	}
	window.requestAnimationFrame(render);
};
render();

window.addEventListener('resize', () => {
	// Обновляем размеры
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Обновляем соотношение сторон камеры
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Обновляем renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener('dblclick', () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
