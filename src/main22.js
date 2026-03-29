import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/Addons.js'

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)
object1.updateMatrixWorld()
object2.updateMatrixWorld()
object3.updateMatrixWorld()

//Load GLTF model
const gltfLoader = new GLTFLoader()
let model = null
gltfLoader.load('/models/Duck/glTF/Duck.gltf', (gltf) =>
{
    model = gltf.scene
    model.scale.set(0.5, 0.5, 0.5)
    model.position.set(0, -1, 0)
    scene.add(model)
    model.updateMatrixWorld()
})


// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
scene.add(ambientLight)

// Raycaster
const raycaster = new THREE.Raycaster()
const raycast = (rayOrigin, rayDirection) => {
    rayOrigin = new THREE.Vector3(- 3, 0, 0)
    rayDirection = new THREE.Vector3(10, 0, 0)
    rayDirection.normalize()
    raycaster.set(rayOrigin, rayDirection)
    const intersects = raycaster.intersectObjects(scene.children)
    if (scene.children) {
        scene.children.forEach(child => {
            if (child.material)
            child.material.color.set(new THREE.Color('#ff0000') );
        })
    }
    for (const intersect of intersects)
    {
        intersect.object.material.color.set(0xffffff)
    }
}

gui.add({ raycast }, 'raycast').name('Raycast')

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
camera.position.z = 3
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

const cursor = new THREE.Vector2()
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / sizes.width * 2 - 1
    cursor.y = - (event.clientY / sizes.height * 2 - 1)
})

let currentIntersect = null

window.addEventListener('click', () =>
{
    if (currentIntersect)
    {
        console.log('click on an object')
    }
})

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    //raycast()

    raycaster.setFromCamera(cursor, camera)
    const intersects = raycaster.intersectObjects(scene.children)
    if (scene.children) {
        scene.children.forEach(child => {
            if (child.material)
            child.material.color.set(new THREE.Color('#ff0000') );
            if (child.scale.x > 1)
                child.scale.set(1, 1, 1)
        })
    }
    for (const intersect of intersects)
    {
        intersect.object.material.color.set(0xffffff)
        intersect.object.scale.set(1.5, 1.5, 1.5);
    }
    if (intersects.length) {
        currentIntersect = intersects[0]
    } else {
        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()