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

    textGeometry.center()
    textGeometry.computeBoundingBox()

    const boundingBox = textGeometry.boundingBox // Box3

    const textMaterial = new THREE.MeshMatcapMaterial({
        matcap: textMatcapTexture
     })
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    // --- Donuts ---
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.15, 20, 40)
    const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: textMatcapTexture })

    function isOutsideTextBox(x: number, y: number, z: number): boolean {
        const padding = 1.5 // safe distance around text
        return (
            x < boundingBox!.min.x - padding || x > boundingBox!.max.x + padding ||
            y < boundingBox!.min.y - padding || y > boundingBox!.max.y + padding ||
            z < boundingBox!.min.z - padding || z > boundingBox!.max.z + padding
        )
    }

    let donutsCreated = 0
    const targetCount = 500

    while (donutsCreated < targetCount) {
        const x = (Math.random() - 0.5) * 20
        const y = (Math.random() - 0.5) * 20
        const z = (Math.random() - 0.5) * 20

        if (isOutsideTextBox(x, y, z)) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            donut.position.set(x, y, z)

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)

            scene.add(donut)
            donutsCreated++
        }
    }
})

// --- Camera Setup ---
const camera = new THREE.PerspectiveCamera(100,window.innerWidth / window.innerHeight, 0.001, 1000);
camera.position.z = 5
camera.position.x = -1
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
