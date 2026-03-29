import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import CANNON from 'cannon'
import { debug } from 'three/tsl'


/**
 * Debug
 */
const gui = new GUI()


// Physics World
let gravity = -9.82

const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, gravity, 0)

gui.add({ gravity }, 'gravity', -20, 0, 0.1).onChange((value) =>
{
    gravity = value
    world.gravity.set(0, gravity, 0)
})

//const concreteMaterial = new CANNON.Material('concrete')
//const plasticMaterial = new CANNON.Material('plastic')

/*const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7,
        bounce: 0.7
    }
)

world.addContactMaterial(concretePlasticContactMaterial)*/

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const hitSound = new Audio('/sounds/hit.mp3')

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Test sphere
 */
const spheres = []
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture
})
const sphereGeometry =  new THREE.SphereGeometry(1, 32, 32)
const createSphere = (radius, position) =>
{
    // Three.js mesh
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    if (!radius) radius = Math.random() * 0.5 + 0.5
    sphere.scale.set(radius, radius, radius)
    sphere.castShadow = true
    if (!position) position = {x: (Math.random() - 0.5) * 5, y: 3, z: (Math.random() - 0.5) * 5}
    sphere.position.copy(position)
    scene.add(sphere)

    // Cannon.js body
    const sphereShape = new CANNON.Sphere(radius)
    const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: sphereShape,
        material: defaultMaterial
    })
    sphereBody.addEventListener('collide', (event) =>
    {
        const impactStrength = event.contact.getImpactVelocityAlongNormal()

        if (impactStrength > 1.5)
        {
            hitSound.currentTime = 0
            hitSound.volume = Math.random()
            hitSound.play()
        }
    })
    world.addBody(sphereBody)

    spheres.push({ sphere, sphereBody })
}

gui.add({ createSphere }, 'createSphere').name('Create Sphere')


const boxes = []
const createBox = (width, height, depth, position) =>
{
    // Three.js mesh
    if (!width) width = Math.random() * 0.5 + 0.5
    if (!height) height = Math.random() * 0.5 + 0.5
    if (!depth) depth = Math.random() * 0.5 + 0.5
    if (!position) position = {x: (Math.random() - 0.5) * 5, y: 3, z: (Math.random() - 0.5) * 5}
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        sphereMaterial
    )
    box.position.copy(position)
    box.castShadow = true
    scene.add(box)

    // Cannon.js body
    const boxShape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))
    const boxBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: boxShape,
        material: defaultMaterial
    })
    boxBody.addEventListener('collide', (event) =>
    {
        const impactStrength = event.contact.getImpactVelocityAlongNormal()

        if (impactStrength > 1.5)
        {
            hitSound.currentTime = 0
            hitSound.volume = Math.random()
            hitSound.play()
        }
    })
    world.addBody(boxBody)
    boxes.push({ box, boxBody })
}

gui.add({ createBox }, 'createBox').name('Create Box')

const reset = () => {
    // Remove spheres
    spheres.forEach(({ sphere, sphereBody }) =>
    {
        // Remove body
        world.removeBody(sphereBody)
        // Remove mesh
        scene.remove(sphere)
    })
    spheres.splice(0, spheres.length)

    // Remove boxes
    boxes.forEach(({ box, boxBody }) =>
    {
        // Remove body
        world.removeBody(boxBody)
        // Remove mesh
        scene.remove(box)
    })
    boxes.splice(0, boxes.length) 
}
gui.add({ reset }, 'reset').name('Reset')

/**
 * Floor
 */
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape
})
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(- 3, 3, 3)
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Timer()

const tick = () =>
{
    const elapsedTime = clock.getElapsed()

    // Update physics world
    world.step(1 / 60, clock.getDelta(), 3)
    // Update spheres
    spheres.forEach(({ sphere, sphereBody }) =>
    {
        sphere.position.copy(sphereBody.position)
        sphere.quaternion.copy(sphereBody.quaternion)
    })
    boxes.forEach(({ box, boxBody }) =>
    {
        box.position.copy(boxBody.position)
        box.quaternion.copy(boxBody.quaternion)
    })

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()