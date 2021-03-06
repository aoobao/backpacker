import CANNON from 'cannon'
import { bus, ACTION } from './bus'
import Cube from './object/Cube'
import { randPM } from '@/assets/index'
const WIDTH = 254
const cubeMaterial = new CANNON.Material('cube')
// cubeMaterial.friction = 0.5
// cubeMaterial.restitution = 0.7

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
  bodyGround: Array<CANNON.Body> = []
  bodyList: Array<PhysicsBody> = []

  constructor() {
    this.render = this.render.bind(this)
    this.world = new CANNON.World()
    // this.world.quatNormalizeSkip = 0
    // this.world.quatNormalizeFast = false
    this.world.gravity.set(0, 0, -9.8 * 70)

    // const solver = new CANNON.GSSolver()
    // this.world.defaultContactMaterial.contactEquationStiffness = 1e9
    // this.world.defaultContactMaterial.contactEquationRelaxation = 4
    // solver.iterations = 10
    // solver.tolerance = 0.1
    // this.world.solver = new CANNON.SplitSolver(solver)

    this.world.broadphase = new CANNON.NaiveBroadphase()

    // this.world.solver.iterations = 10
    const material = new CANNON.Material('ground')

    const wallMaterial = new CANNON.Material('wall')

    // 地面
    const bodyGround = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, 0, 0.1),
      shape: new CANNON.Plane(),
      material: material,
    })

    // bodyGround.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), -Math.PI / 2)

    const wall1 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(WIDTH / 2, 0, 0),
      shape: new CANNON.Plane(),
      material: wallMaterial,
    })

    wall1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)

    const wall2 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(-WIDTH / 2, 0, 0),
      shape: new CANNON.Plane(),
      material: wallMaterial,
    })

    wall2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)

    const wall3 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, WIDTH / 2, 0),
      shape: new CANNON.Plane(),
      material: wallMaterial,
    })

    wall3.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)

    const wall4 = new CANNON.Body({
      mass: 0,
      position: new CANNON.Vec3(0, -WIDTH / 2, 0),
      shape: new CANNON.Plane(),
      material: wallMaterial,
    })

    wall4.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

    const groundContactMaterial = new CANNON.ContactMaterial(material, cubeMaterial, {
      friction: 0.1,
      restitution: 0.5,
    })

    const wallContactMaterial = new CANNON.ContactMaterial(wallMaterial, cubeMaterial, {
      friction: 0,
      restitution: 1,
    })

    this.world.addContactMaterial(groundContactMaterial)
    this.world.addContactMaterial(wallContactMaterial)

    this.world.addBody(bodyGround)
    this.world.addBody(wall1)
    this.world.addBody(wall2)
    this.world.addBody(wall3)
    this.world.addBody(wall4)

    this.bodyGround.push(bodyGround)

    this.bodyGround.push(wall1, wall2, wall3, wall4)

    bus.on(ACTION.RENDER, this.render)
  }

  addBox(cube: Cube, speed = 1) {
    return new Promise<void>((resolve, reject) => {
      const pos = cube.instance.position
      const qua = cube.instance.quaternion
      const size = cube.size
      const halfExtents = new CANNON.Vec3(size / 2, size / 2, size / 2)
      const bodyBox = new CANNON.Body({
        mass: 5,
        position: new CANNON.Vec3(pos.x, pos.y, pos.z),
        shape: new CANNON.Box(halfExtents),
        quaternion: new CANNON.Quaternion(qua.x, qua.y, qua.z, qua.w),
        linearDamping: 0.01,
        angularDamping: 0.05,
        material: cubeMaterial,
      })

      const x = 500 * speed * randPM()
      const y = 500 * speed * randPM()
      const z = 300 + 300 * speed

      bodyBox.velocity.set(x, y, z)
      bodyBox.angularVelocity.set(rendAngular(), rendAngular(), (50 + 50 * Math.random()) * randPM())

      function rendAngular() {
        return (10 + 10 * Math.random()) * randPM()
      }

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
        // const instance = box.cube.instance
        // const pos = box.bodyBox.position
        // const quaternion = box.bodyBox.quaternion

        if (this.syncInstanceValue(box)) {
          this.bodyList.splice(i, 1)

          // 延迟去除,多个骰子
          setTimeout(() => {
            this.world.remove(box.bodyBox)
          }, 5000)
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
    const velocity = box.bodyBox.velocity
    const speed = Math.abs(velocity.x + velocity.y + velocity.z)

    // console.log(speed)

    // console.log(position.z, size, speed)
    return position.z <= size / 2 + 1 && speed < 1
  }

  destroy() {
    bus.off(ACTION.RENDER, this.render)
    for (let i = 0; i < this.bodyGround.length; i++) {
      const body = this.bodyGround[i]
      this.world.remove(body)
      this.bodyGround = []
    }
  }
}

// function toVec3(position: CANNON.Vec3) {

// }
