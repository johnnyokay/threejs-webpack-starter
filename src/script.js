import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import map from '../earth.jpg'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.SphereBufferGeometry(1, 30, 30);

// Materials

const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(map)
})

//material.color = new THREE.Color(0xff0000)

// Mesh
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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

function calcPosFromLatLonRad(lat, lon) {
    var phi = (90 - lat) * (Math.PI / 180)
    var theta = (lon + 180) * (Math.PI / 180)

    let x = -(Math.sin(phi) * Math.cos(theta))
    let z = (Math.sin(phi) * Math.sin(theta))
    let y = (Math.cos(phi))

    return { x, y, z }
}

function convertLatLngToCartesian(p) {
    let lat = (90 - p.lat) * Math.PI / 180
    let lng = (180 + p.lng) * Math.PI / 180

    let x = -Math.sin(lat) * Math.cos(lng)
    let y = Math.sin(lat) * Math.sin(lng)
    let z = Math.cos(lat)

    return { x, y, z }
}

//red markers
let mesh = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.01, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

let point1 = {
    lat: 50.4501,
    lng: 30.5234
}

let mexico = {
    lat: 32.1656,
    lng: -82.9001
}

//let pos = convertLatLngToCartesian(point1)
let pos = calcPosFromLatLonRad(mexico.lat, mexico.lng)

console.log(pos.x)
mesh.position.set(pos.x, pos.y, pos.z)

//mesh.position.set(1, 0, 0)

scene.add(mesh)

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    //sphere.rotation.y = .5 * elapsedTime

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()