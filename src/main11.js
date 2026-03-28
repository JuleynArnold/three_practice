import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js'

const gui = new GUI()

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Textures
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const textureUrls = [
    '/textures/door/color.jpg',
    '/textures/door/ambientOcclusion.jpg',
    '/textures/door/alpha.jpg',
    '/textures/door/height.jpg',
    '/textures/door/normal.jpg',
    '/textures/door/metalness.jpg',
    '/textures/door/roughness.jpg',
    '/textures/matcaps/1.png',
    '/textures/matcaps/2.png',
    '/textures/matcaps/3.png',
    '/textures/matcaps/4.png',
    '/textures/matcaps/5.png',
    '/textures/matcaps/6.png',
    '/textures/matcaps/7.png',
    '/textures/matcaps/8.png',
    '/textures/gradients/5.jpg',
];

const textures = textureUrls.map(url => textureLoader.load(url));
textures.forEach(texture => { 
    texture.colorSpace = THREE.SRGBColorSpace;
});

// Objects
const sphere = new THREE.SphereGeometry(0.5, 32, 32)
const plane = new THREE.PlaneGeometry(1, 1)
const torus = new THREE.TorusGeometry(0.3, 0.2, 32, 64)
/*const material = new THREE.MeshBasicMaterial({
    map: textures[0], 
    color: 'yellow',
    //opacity: 0.1,
    alphaMap: textures[1],
    transparent: true,
    side: THREE.DoubleSide
})*/
//const material = new THREE.MeshNormalMaterial()
//material.flatShading = true
//const material = new THREE.MeshMatcapMaterial({ 
//    matcap: textures[10]
//})
//const material = new THREE.MeshDepthMaterial()
//const material = new THREE.MeshLambertMaterial({})
/*const material = new THREE.MeshPhongMaterial({
    color: 'orangered',
    shininess: 100,
    specular: 'white'
})*/
/*textures[14].minFilter = THREE.NearestFilter;
textures[14].magFilter = THREE.NearestFilter;
const material = new THREE.MeshToonMaterial({
    gradientMap: textures[14]
})*/
const material = new THREE.MeshStandardMaterial({
    metalness: 0.2,
    roughness: 0.2,
    map: textures[0],
    aoMap: textures[1],
    aoMapIntensity: 1,
    displacementMap: textures[3],
    displacementScale: 0.01,
    normalMap: textures[4],
    normalScale: new THREE.Vector2(1, 1),
    metalnessMap: textures[5],
    roughnessMap: textures[6],
    alphaMap: textures[2],
    transparent: true,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    sheen: 1,
    sheenRoughness: 0.1,
    sheenColor: 'orangered',
    iridescence: 1,
    iridescenceIOR: 1.5,
    iridescenceThicknessRange: [0.1, 1],
    transmission: 1,
    ior: 1.5,
    thickness: 0.1
})

gui.add(material, 'metalness').min(0).max(1).step(0.0001)
gui.add(material, 'roughness').min(0).max(1).step(0.0001)
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001)
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001)
gui.add(material.normalScale, 'x').min(0).max(2).step(0.0001).name('normalScaleX')
gui.add(material.normalScale, 'y').min(0).max(2).step(0.0001).name('normalScaleY')
gui.add(material, 'transparent')
//gui.add(material, 'clearcoat').min(0).max(1).step(0.0001)
//gui.add(material, 'clearcoatRoughness').min(0).max(1).step(0.0001)
//gui.add(material, 'sheen').min(0).max(1).step(0.0001)
//gui.add(material, 'sheenRoughness').min(0).max(1).step(0.0001)
//gui.addColor(material, 'sheenColor')
//gui.add(material, 'iridescence').min(0).max(2.333).step(0.0001)
//gui.add(material, 'iridescenceIOR').min(0).max(1000).step(0.0001)
//gui.add(material, 'iridescenceThicknessRange').min(1000).max(2).step(0.0001)
//gui.add(material, 'transmission').min(0).max(1).step(0.0001)
//gui.add(material, 'ior').min(0).max(10).step(0.0001)
//gui.add(material, 'thickness').min(0).max(1).step(0.0001)

const sphereMesh = new THREE.Mesh(sphere, material)
const planeMesh = new THREE.Mesh(plane, material)
const torusMesh = new THREE.Mesh(torus, material)
sphereMesh.position.x = -2
torusMesh.position.x = 2
scene.add(sphereMesh, planeMesh, torusMesh)

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 1
pointLight.position.y = 1
pointLight.position.z = 1
scene.add(pointLight)

// Environment map
const hdrLoader = new HDRLoader()
hdrLoader.load('/textures/environmentMap/2k.hdr', function (environmentMap) {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.environment = environmentMap
    scene.background = environmentMap
})


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    /*sphereMesh.rotation.y = 0.1 * elapsedTime
    planeMesh.rotation.y = 0.1 * elapsedTime
    torusMesh.rotation.y = 0.1 * elapsedTime

    sphereMesh.rotation.x = - 0.15 * elapsedTime
    planeMesh.rotation.x = - 0.15 * elapsedTime
    torusMesh.rotation.x = - 0.15 * elapsedTime*/

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()