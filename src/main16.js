import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// texture loader
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const floorAlphaTexture = textureLoader.load('/textures/floor/alpha.jpg')
const floorDiffuseTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg')
floorDiffuseTexture.wrapS = THREE.RepeatWrapping
floorDiffuseTexture.wrapT = THREE.RepeatWrapping
floorDiffuseTexture.repeat.set(8, 8)
floorDiffuseTexture.colorSpace = THREE.SRGBColorSpace
const floorDisplacementTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg')
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping
floorDisplacementTexture.repeat.set(8, 8)
const floorNormalTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg')
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping
floorNormalTexture.repeat.set(8, 8)
const floorARMTexture = textureLoader.load('/textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg')
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping
floorARMTexture.repeat.set(8, 8)

const wallDiffuseTexture = textureLoader.load('/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg')
wallDiffuseTexture.wrapS = THREE.RepeatWrapping
wallDiffuseTexture.wrapT = THREE.RepeatWrapping
wallDiffuseTexture.repeat.set(1, 1)
wallDiffuseTexture.colorSpace = THREE.SRGBColorSpace
const wallNormalTexture = textureLoader.load('/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg')
wallNormalTexture.wrapS = THREE.RepeatWrapping
wallNormalTexture.wrapT = THREE.RepeatWrapping
wallNormalTexture.repeat.set(1, 1)
const wallARMTexture = textureLoader.load('/textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg')
wallARMTexture.wrapS = THREE.RepeatWrapping
wallARMTexture.wrapT = THREE.RepeatWrapping
wallARMTexture.repeat.set(1, 1)

const roofDiffuseTexture = textureLoader.load('/textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg')
roofDiffuseTexture.wrapS = THREE.RepeatWrapping
roofDiffuseTexture.wrapT = THREE.RepeatWrapping
roofDiffuseTexture.repeat.set(3, 1)
roofDiffuseTexture.colorSpace = THREE.SRGBColorSpace
const roofNormalTexture = textureLoader.load('/textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg')
roofNormalTexture.wrapS = THREE.RepeatWrapping
roofNormalTexture.wrapT = THREE.RepeatWrapping
roofNormalTexture.repeat.set(3, 1)
const roofARMTexture = textureLoader.load('/textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg')
roofARMTexture.wrapS = THREE.RepeatWrapping
roofARMTexture.wrapT = THREE.RepeatWrapping
roofARMTexture.repeat.set(3, 1)

const bushDiffuseTexture = textureLoader.load('/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg')
bushDiffuseTexture.wrapS = THREE.RepeatWrapping
bushDiffuseTexture.wrapT = THREE.RepeatWrapping
bushDiffuseTexture.repeat.set(2, 1)
bushDiffuseTexture.colorSpace = THREE.SRGBColorSpace
const bushNormalTexture = textureLoader.load('/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg')
bushNormalTexture.wrapS = THREE.RepeatWrapping
bushNormalTexture.wrapT = THREE.RepeatWrapping
bushNormalTexture.repeat.set(2, 1)
const bushARMTexture = textureLoader.load('/textures/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg')
bushARMTexture.wrapS = THREE.RepeatWrapping
bushARMTexture.wrapT = THREE.RepeatWrapping
bushARMTexture.repeat.set(2, 1)

const graveDiffuseTexture = textureLoader.load('/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg')
graveDiffuseTexture.wrapS = THREE.RepeatWrapping
graveDiffuseTexture.wrapT = THREE.RepeatWrapping
graveDiffuseTexture.repeat.set(1, 1)
graveDiffuseTexture.colorSpace = THREE.SRGBColorSpace
const graveNormalTexture = textureLoader.load('/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg')
graveNormalTexture.wrapS = THREE.RepeatWrapping
graveNormalTexture.wrapT = THREE.RepeatWrapping
graveNormalTexture.repeat.set(1, 1)
const graveARMTexture = textureLoader.load('/textures/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg')
graveARMTexture.wrapS = THREE.RepeatWrapping
graveARMTexture.wrapT = THREE.RepeatWrapping
graveARMTexture.repeat.set(1, 1)

/**
 * House
 */
const houseGroup = new THREE.Group()
scene.add(houseGroup)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 20, 20),
    new THREE.MeshStandardMaterial({
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorDiffuseTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: - 0.3,
        normalMap: floorNormalTexture,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
    })
)
floor.rotation.x = - Math.PI * 0.5
houseGroup.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001).name('floor displacement scale')
gui.add(floor.material, 'displacementBias').min(0).max(1).step(0.001).name('floor displacement bias')

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        map: wallDiffuseTexture,
        normalMap: wallNormalTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
    })
)
walls.position.y = 1.25
houseGroup.add(walls)

const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3, 2, 4),
    new THREE.MeshStandardMaterial({
        map: roofDiffuseTexture,
        normalMap: roofNormalTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
    })
)
roof.position.y = 3.5
roof.rotation.y = Math.PI * 0.25
houseGroup.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 2.5, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.25,
        displacementBias: - 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        transparent: true
    })
)
door.position.y = 1.1
door.position.z = 2.01
houseGroup.add(door)

gui.add(door.material, 'displacementScale').min(0).max(1).step(0.001).name('door displacement scale')
gui.add(door.material, 'displacementBias').min(0).max(1).step(0.001).name('door displacement bias')

const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
    map: bushDiffuseTexture,
    normalMap: bushNormalTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(3, 0.2, 2.2)
bush1.rotation.x -= 0.75
houseGroup.add(bush1)

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(-2.4, 0.1, 2.1)
bush2.rotation.x -= 0.75
houseGroup.add(bush2)

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 3)
bush3.rotation.x -= 0.75
houseGroup.add(bush3)

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 6)
bush4.rotation.x -= 0.75
houseGroup.add(bush4)

const graves = new THREE.Group()
houseGroup.add(graves)

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveDiffuseTexture,
    normalMap: graveNormalTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
})

for(let i = 0; i < 50; i++)
{
    const angle = Math.random() * Math.PI * 2
    const radius = 3 + Math.random() * 6
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.set(x, 0.3, z)
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    graves.add(grave)
    grave.castShadow = true
    grave.receiveShadow = true
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#2b8a8a', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#479dac', 1.5)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

//Door light
const doorLight = new THREE.PointLight('#ff7b00', 1, 7)
doorLight.position.set(0, 2.2, 2.7)
houseGroup.add(doorLight)

const rotatingLight1 = new THREE.PointLight('#ff0000', 0.5, 10)
houseGroup.add(rotatingLight1)

const rotatingLight2 = new THREE.PointLight('#00ff00', 0.5, 10)
houseGroup.add(rotatingLight2)

const rotatingLight3 = new THREE.PointLight('#0000ff', 0.5, 10)
houseGroup.add(rotatingLight3)

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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
directionalLight.castShadow = true
doorLight.castShadow = true
rotatingLight1.castShadow = true
rotatingLight2.castShadow = true
rotatingLight3.castShadow = true

walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true
bush1.castShadow = true
bush2.castShadow = true
bush3.castShadow = true
bush4.castShadow = true


// Mapping
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.bottom = -8

// Sky
const sky = new Sky()
sky.scale.set(100, 100, 100)
scene.add(sky)
sky.material.uniforms.turbidity.value = 20
sky.material.uniforms.rayleigh.value = 1
sky.material.uniforms.mieCoefficient.value = 0.005
sky.material.uniforms.mieDirectionalG.value = 0.95
sky.material.uniforms.sunPosition.value.set(0.3, -0.038, -0.95)


// Fog
//scene.fog = new THREE.Fog('#74686b', 10, 15)
scene.fog = new THREE.FogExp2('#74686b', 0.05)


/**
 * Animate
 */
const timer = new THREE.Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()
    rotatingLight1.position.x = Math.cos(elapsedTime) * 4
    rotatingLight1.position.z = Math.sin(elapsedTime) * 4
    rotatingLight1.position.y = Math.sin(elapsedTime) * Math.sin(elapsedTime * 2.34) * Math.sin(elapsedTime * 3.45)

    rotatingLight2.position.x = Math.cos(elapsedTime + Math.PI * 2 / 3) * 4
    rotatingLight2.position.z = Math.sin(elapsedTime + Math.PI * 2 / 3) * 4

    rotatingLight3.position.x = Math.cos(elapsedTime + Math.PI * 4 / 3) * 4
    rotatingLight3.position.z = Math.sin(elapsedTime + Math.PI * 4 / 3) * 4

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()