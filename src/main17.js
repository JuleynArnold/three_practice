import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { vertexColor } from 'three/tsl'


function createParticleArray(count) {
    const positions = new Float32Array(count * 3)

    for(let i = 0; i < count * 3; i++)
    {
        positions[i] = (Math.random() - 0.5) * 8
    }
    return positions
}
function colorParticleArray(count) {
    const colors = new Float32Array(count * 3)

    for(let i = 0; i < count * 3; i++)
    {
        colors[i] = Math.random()
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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')
let count = 10000;

gui.add({ count }, 'count').min(100).max(20000).step(100).onChange(value => {
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(createParticleArray(value), 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorParticleArray(value), 3))
})

// Particles
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(createParticleArray(count), 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorParticleArray(count), 3))
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    alphaMap: particleTexture,
    transparent: true,
    //alphaTest: 0.001
    //depthTest: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


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
camera.position.set(3, 0, 0)
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

    //update particles
    //particles.rotation.x = - elapsedTime * 0.02
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = x + Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()