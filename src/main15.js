import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')
bakedShadow.colorSpace = THREE.SRGBColorSpace
simpleShadow.colorSpace = THREE.SRGBColorSpace

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001).name('ambientLightIntensity')
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 5
directionalLight.shadow.camera.left = - 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = - 2
directionalLight.shadow.radius = 10
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001).name('directionalLightIntensity')
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name('directionalLightX')
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name('directionalLightY')
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name('directionalLightZ')
scene.add(directionalLight)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
gui.add(directionalLightCameraHelper, 'visible').name('directionalLightCameraHelper')
scene.add(directionalLightCameraHelper)


const spotLight = new THREE.SpotLight(0xffffff, 0, 10, Math.PI * 0.3)
spotLight.position.set(- 1, 2, 1)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 6
spotLight.shadow.camera.fov = 30
gui.add(spotLight, 'intensity').min(0).max(10).step(0.001).name('spotLightIntensity')
gui.add(spotLight.position, 'x').min(- 5).max(5).step(0.001).name('spotLightX')
gui.add(spotLight.position, 'y').min(- 5).max(5).step(0.001).name('spotLightY')
gui.add(spotLight.position, 'z').min(- 5).max(5).step(0.001).name('spotLightZ')
scene.add(spotLight)

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
spotLightCameraHelper.visible = false
gui.add(spotLightCameraHelper, 'visible').name('spotLightCameraHelper')
scene.add(spotLightCameraHelper)


const pointLight = new THREE.PointLight(0xffffff, 2.7, 10)
pointLight.position.set(-1, 1, 0)
pointLight.castShadow = true
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 5
gui.add(pointLight, 'intensity').min(0).max(10).step(0.001).name('pointLightIntensity')
gui.add(pointLight.position, 'x').min(- 5).max(5).step(0.001).name('pointLightX')
gui.add(pointLight.position, 'y').min(- 5).max(5).step(0.001).name('pointLightY')
gui.add(pointLight.position, 'z').min(- 5).max(5).step(0.001).name('pointLightZ')
scene.add(pointLight)

const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
pointLightCameraHelper.visible = false
gui.add(pointLightCameraHelper, 'visible').name('pointLightCameraHelper')
scene.add(pointLightCameraHelper)

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.castShadow = true

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.receiveShadow = true
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

scene.add(sphere, plane)

const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        alphaMap: simpleShadow,
        transparent: true,
        color: 0x000000
    })
)
sphereShadow.rotation.x = - Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.01
scene.add(sphereShadow)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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
renderer.shadowMap.enabled = false
renderer.shadowMap.type = THREE.VSMShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = (1 - sphere.position.y) * 0.7

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()