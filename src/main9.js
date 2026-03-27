import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'
import { debug } from 'three/tsl'

const gui = new GUI({
    width: 300,
    title: 'Kocia TCG',
    closeFolders: false
})

window.addEventListener('keydown', (event) => {
    if (event.key === 'h') {
        if (gui._hidden) {
            gui.show()
        } else {
            gui.hide()
        }
    }
})

const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObject.color = '#dbbea0'
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('elevation')
gui.add(mesh.position, 'x').min(-3).max(3).step(0.01).name('lateral')
gui.add(mesh.position, 'z').min(-3).max(3).step(0.01).name('depth')
gui.add(mesh, 'visible').name('visible')
gui.add(mesh.material, 'wireframe').name('wireframe')
gui.addColor(debugObject, 'color').onChange((value) => {
    material.color.set(value)

}).name('color')

debugObject.spin = () => {
    gsap.to(mesh.rotation, { duration: 0.5, y: mesh.rotation.y + Math.PI * 2 })
}
gui.add(debugObject, 'spin').name('spin')

debugObject.subdivisions = 2
gui.add(debugObject, 'subdivisions').min(0).max(20).step(1).onFinishChange((value) => {
    mesh.geometry.dispose()
    mesh.geometry = new THREE.BoxGeometry(1, 1, 1, value, value, value)
}).name('subdivisions')

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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()