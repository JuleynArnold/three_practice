import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'


function createParticleArray(count, radius, branches, spin, randomness, randomnessPower) {
    const positions = new Float32Array(count * 3)

    for(let i = 0; i < count; i++)
    {
        const i3 = i * 3
        const randomRadius = Math.random() * radius
        const branchAngle = (i % branches) / branches * Math.PI * 2
        const spinAngle = randomRadius * spin

        const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * randomRadius
        const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * randomRadius
        const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * randomRadius
        
        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * randomRadius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * randomRadius + randomZ
    }
    return positions
}
function colorParticleArray(count, insideColor, outsideColor, radius) {
    const colors = new Float32Array(count * 3)

    const colorOutside = new THREE.Color(outsideColor)
    const colorInside = new THREE.Color(insideColor)

    for(let i = 0; i < count * 3; i++)
    {
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, Math.random() * radius / radius)
        const i3 = i * 3
        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] =  mixedColor.b
    }
    return colors
}

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameters = {
    count: 1000,
    size: 0.02,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
}
let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    if (points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }

    geometry = new THREE.BufferGeometry()
    const positions = createParticleArray(parameters.count, parameters.radius, parameters.branches, parameters.spin, parameters.randomness, parameters.randomnessPower)
    const colors = colorParticleArray(parameters.count, parameters.insideColor, parameters.outsideColor, parameters.radius)
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

gui.add(parameters, 'count').min(100).max(100000).step(100).onChange(generateGalaxy)
gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001).onChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onChange(generateGalaxy)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(1).onChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onChange(generateGalaxy)

generateGalaxy()


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
camera.position.x = 3
camera.position.y = 3
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