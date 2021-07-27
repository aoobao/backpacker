import { THREE } from '@/assets/three/lib'

export default class Cube {
  instance: THREE.Mesh
  size = 10
  constructor() {
    const geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff })
    this.instance = new THREE.Mesh(geometry, material)
  }

  destroy() {
    this.instance.geometry.dispose()
    const material = this.instance.material as THREE.Material
    material.dispose()
  }
}
