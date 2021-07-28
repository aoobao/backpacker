import { THREE } from '@/assets/three/lib'
import { createCubeMaterials } from './cube-material'

export interface CubeOptions {
  map1: THREE.Object3D
  // map2: THREE.Object3D
}

const one = [new THREE.Vector2(0, 0.666), new THREE.Vector2(0.5, 0.666), new THREE.Vector2(0.5, 1), new THREE.Vector2(0, 1)]

export default class Cube {
  instance: THREE.Mesh
  size = 30
  map1: THREE.Object3D
  constructor(opts: CubeOptions) {
    this.map1 = opts.map1

    const geometry = new THREE.BoxGeometry(this.size, this.size, this.size)

    const materials = createCubeMaterials()
    // const texture = new THREE.TextureLoader().load(require('@/assets/image/material/cube-material.jpg'))

    // const material = new THREE.MeshLambertMaterial({
    //   color: 0xffffff,
    //   map: texture,
    // })

    this.instance = new THREE.Mesh(geometry, materials)
    this.instance.position.z = 100

    // 放6个group方便比较哪个朝上
    const group1 = new THREE.Group()
    group1.name = '1'
    group1.position.z = 1
    this.instance.add(group1)
    const group6 = new THREE.Group()
    group6.name = '6'
    group6.position.z = -1
    this.instance.add(group6)
    // TODO

  }

  show() {
    this.map1.add(this.instance)
  }

  destroy() {
    this.instance.geometry.dispose()
    const material = this.instance.material as THREE.Material
    material.dispose()
  }
}
