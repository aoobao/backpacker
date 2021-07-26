import { PersonType } from '../types'
import { MapList } from '../setting'
import { createAnimation, getAngle } from '@/assets/index'
import TWEEN from '@tweenjs/tween.js'
import { THREE } from '@/assets/three/lib'
export interface PlayerOptions {
  player: PersonType
  object: THREE.Object3D
  map1: THREE.Object3D
}

export default class Player {
  instance: THREE.Object3D
  player: PersonType
  map1: THREE.Object3D
  // store = useInjector(GameStateStore)
  constructor(opts: PlayerOptions) {
    this.instance = opts.object.clone()
    const scaleNumber = 8
    this.instance.scale.set(scaleNumber, scaleNumber, scaleNumber)
    this.instance.rotateX((90 * Math.PI) / 180)
    this.map1 = opts.map1
    this.player = { ...opts.player }

    // const color = stringToNumberColor(this.player.color)
    const color = new THREE.Color(this.player.color)

    this.instance.traverse(object => {
      // Foot
      if (object instanceof THREE.Mesh) {
        if (object.name.includes('Torso') || object.name.includes('Foot') || object.name.includes('Leg')) {
          object.material = object.material.clone()
          object.material.color = new THREE.Color(color)
        }
      }
    })

    // this.instance

    this.init()
  }

  init(): Promise<void> {
    return new Promise(resolve => {
      const map = this.map1
      if (!map) throw new Error('未找到地图对象')
      // const mapAddress = MapList.find(t=> t.index === this.player.index)
      const mapAddress = MapList[this.player.index]

      this.instance.position.set(...mapAddress.position)

      map.add(this.instance)

      this.fixLookat()

      // 下落效果
      const z = this.instance.position.z
      this.instance.position.z += 20

      const tween = createAnimation(this.instance.position, { z }, 500, TWEEN.Easing.Quartic.In)

      tween.onComplete(() => {
        resolve()
      })
    })
  }

  // 修正人物的方向
  fixLookat(duration = 500): Promise<void> {
    return new Promise(resolve => {
      const address = this.getNextAddress()
      const position = address.position
      const p = this.instance.position
      const rotation = this.instance.rotation

      const angle = getAngle(p.x, p.y, position[0], position[1]) + 90
      // console.log('人物位置:', p.x, p.y, p.z, '目标地点:', ...position, '人物当前旋转:', rotation.x, rotation.y, rotation.z, angle)

      const rotationY = (angle * Math.PI) / 180
      // this.instance.rotation.y =
      if (!duration) {
        this.instance.rotation.y = rotationY
      } else {
        const tween = createAnimation(this.instance.rotation, { y: rotationY }, duration, TWEEN.Easing.Quartic.In)
        tween.onComplete(() => {
          resolve()
        })
      }
    })
  }

  // 人物下一个地点
  getNextAddress() {
    let index = this.player.map0Index + 1
    if (index === MapList.length) index = 0
    const MapAddress = MapList[index]

    return MapAddress
  }
}
