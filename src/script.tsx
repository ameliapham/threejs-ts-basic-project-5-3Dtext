import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

console.log("Hello, Three.js with TypeScript!");

// --- Canvas Setup ---
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// --- Scene Setup ---
const scene = new THREE.Scene();

// --- Setup Axes Helper ---
//const axesHelper = new THREE.AxesHelper(2)
//scene.add(axesHelper)

// --- Texture Loader ---
const textureLoader = new THREE.TextureLoader

// --- Load matcap texture ---
const matcapTextures = ["rose.png", "salmon.png"].map(filename => {
    const texture = textureLoader.load(`textures/matcaps/${filename}`)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
})

const [ objectMatcapTexture, textMatcapTexture] = matcapTextures

// --- Fonts ---
const fontLoader = new FontLoader()

fontLoader.load('fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry('Amelia', {
        font: font,
        size: 2,
        height: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    })
    const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: textMatcapTexture
     })
    const text = new THREE.Mesh(textGeometry, textMaterial)
    textGeometry.center() 
    scene.add(text)
})

// --- Objects Setup ---
for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.15, 20, 40),
        new THREE.MeshMatcapMaterial({ matcap: textMatcapTexture})
    )
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)


    scene.add(donut)
}

// --- Camera Setup ---
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight);
camera.position.z = 3
scene.add(camera)

// --- Controls ---
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// --- Renderer Setup ---
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// --- Resize ---
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// --- Render Loop ---
function animate(){
    controls.update()
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate)
}
animate()
