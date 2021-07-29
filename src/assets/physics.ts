import CANNON from 'cannon'
import { bus, ACTION } from './bus'
import Cube from './object/Cube'
import { randPM } from '@/assets/index'
// const cubeMaterial = new CANNON.Material('cube')
// cubeMaterial.friction = 0.05
// cubeMaterial.restitution = 0.1

const fixedTimeStep = 1.0 / 60
const maxSubSteps = 3
export interface PhysicsBody {
  cube: Cube
  bodyBox: CANNON.Body
  type: string
  resolve: () => void
  reject: (err?: any) => void
  timer: number
}

export default class PhysicsWorld {
  world: CANNON.World
  bodyGround: CANNON.Body
  bodyList: Array<PhysicsBody> = []

  constructor() {
    this.render = this.render.bind(this)
    this.world = new CANNON.World()

    // this.world.quatNormalizeSkip = 0
    // this.world.quatNormalizeFast = false
    this.world.gravity.set(0, 0, -9.8 * 100)
    this.world.broadphase = new CANNON.NaiveBroadphase()
    this.world.solver.iterations = 5

    // 地面
    this.bodyGround = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0, 1),
      shape: new CANNON.Plane(),
    })

    this.bodyGround.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -Math.PI / 2)
    this.world.addBody(this.bodyGround)

    bus.on(ACTION.RENDER, this.render)
  }

  addBox(cube: Cube, speed = 1) {
    return new Promise<void>((resolve, reject) => {
      const pos = cube.instance.position
      const qua = cube.instance.quaternion
      const size = cube.size
      const halfExtents = new CANNON.Vec3(size / 2, size / 2, size / 2)
      const bodyBox = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(pos.x, pos.y, pos.z),
        shape: new CANNON.Box(halfExtents),
        quaternion: new CANNON.Quaternion(qua.x, qua.y, qua.z, qua.w),
        linearDamping: 0.92,
        angularDamping: 0.1,
      })

      const x = 2
      const y = 2
      const z = 400 + 400 * speed

      bodyBox.velocity.set(x, y, z)
      bodyBox.angularVelocity.set(50 * Math.random() * randPM(), 50 * Math.random() * randPM(), 50 * Math.random() * randPM())

      const box: PhysicsBody = {
        type: 'cube',
        cube,
        bodyBox,
        resolve,
        reject,
        timer: new Date().getTime(),
      }

      this.world.addBody(bodyBox)
      this.bodyList.push(box)
    })
  }

  // updatePhysics
  render(res: any) {
    const delta = res.delta as number
    if (delta) {
      // console.log(delta)
      this.world.step(fixedTimeStep, delta, maxSubSteps)
      for (let i = this.bodyList.length - 1; i >= 0; i--) {
        const box = this.bodyList[i]
        const instance = box.cube.instance
        const pos = box.bodyBox.position
        const quaternion = box.bodyBox.quaternion

        if (this.syncInstanceValue(box)) {
          this.bodyList.splice(i, 1)
          box.resolve()
        }
        // instance.position.set(pos.x, pos.y, pos.z)
        // instance.quaternion.set(quaternion.x, quaternion.y, quaternion.z, quaternion.z)
      }
    }
  }

  syncInstanceValue(box: PhysicsBody): boolean {
    const t = new Date().getTime()
    const newPosition = box.bodyBox.position
    const position = box.cube.instance.position
    // let isSame = true

    const z = box.cube.instance.position.z
    const size = box.cube.size
    // console.log(newPosition, position)
    // if (newPosition.z !== position.z) {
    position.set(newPosition.x, newPosition.y, newPosition.z)
    // isSame = false
    // }
    const newQuaternion = box.bodyBox.quaternion
    const quaternion = box.cube.instance.quaternion
    // if (newQuaternion.x !== quaternion.x || newQuaternion.y !== quaternion.y || newQuaternion.z !== quaternion.z || newQuaternion.w !== quaternion.w) {
    quaternion.set(newQuaternion.x, newQuaternion.y, newQuaternion.z, newQuaternion.w)
    // isSame = false
    // }
    return position.z <= size / 2 + 1 && t - box.timer > 3000
  }

  destroy() {
    bus.off(ACTION.RENDER, this.render)
    this.world.remove(this.bodyGround)
  }
}

// function toVec3(position: CANNON.Vec3) {

// }
