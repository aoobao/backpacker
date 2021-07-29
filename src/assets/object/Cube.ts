import { THREE } from '@/assets/three/lib'
import { createCubeMaterials } from './cube-material'
import PhysicsWorld from '@/assets/physics'
import { randBetween } from '@/assets/index'
export interface CubeOptions {
  map1: THREE.Object3D
  // map2: THREE.Object3D
}

export default class Cube {
  instance: THREE.Mesh
  size = 10
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
    this.instance.position.z = 5

    // 放6个group方便比较哪个朝上
    this.addGroup(1, 0, 0, 50)

    this.addGroup(2, 50, 0, 0)

    this.addGroup(3, 0, 50, 0)

    this.addGroup(4, 0, -50, 0)

    this.addGroup(5, -50, 0, 0)

    this.addGroup(6, 0, 0, -50)
  }

  addGroup(index: number, x: number, y: number, z: number): THREE.Object3D {
    // const geometry = new THREE.BoxGeometry(5, 5, 5)
    // const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    // const group = new THREE.Mesh(geometry, material)
    const group = new THREE.Group()
    group.position.set(x, y, z)
    group.name = index.toString()
    this.instance.add(group)

    return group
  }

  getValue() {
    const list = this.instance.children
    let maxZ = -100
    let maxName = ''

    const position = new THREE.Vector3()
    for (let i = 0; i < list.length; i++) {
      const group = list[i]
      group.getWorldPosition(position)

      if (position.z > maxZ) {
        maxZ = position.z
        maxName = group.name
      }
    }

    // console.log(maxZ, maxName)
    return ~~maxName
  }

  async show(physicsWorld: PhysicsWorld, speed: number) {
    this.instance.position.set(0, 0, 5)

    const x = (randBetween(-360, 360) * Math.PI) / 180
    const y = (randBetween(-360, 360) * Math.PI) / 180
    const z = (randBetween(-360, 360) * Math.PI) / 180

    this.instance.rotation.set(x, y, z)

    this.map1.add(this.instance)
    return physicsWorld.addBox(this, speed)
  }

  destroy() {
    this.instance.geometry.dispose()
    const material = this.instance.material as THREE.Material
    material.dispose()
  }
}
