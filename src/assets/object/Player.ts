import { MapAddress, PersonType } from '../types'
import { workMapList, travelMapList, getNextAddress } from '../setting'
import { createAnimation, getAngle } from '@/assets/index'
import TWEEN from '@tweenjs/tween.js'
import { THREE } from '@/assets/three/lib'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { getFile } from '@/assets/preload'
// import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { bus, ACTION } from '@/assets/bus'

const ARROW_POSITION_Y = 11
export interface PlayerOptions {
  player: PersonType
  gltf: GLTF
  map1: THREE.Object3D
  map0: THREE.Object3D
}

export interface ActionType {
  clip: THREE.AnimationClip
  action: THREE.AnimationAction
}

export interface Offset {
  x: number
  y: number
}

export default class Player {
  instance: THREE.Object3D
  player: PersonType
  map0: THREE.Object3D
  map1: THREE.Object3D
  mixer: THREE.AnimationMixer
  actions: Array<ActionType> = []
  gltf: GLTF
  material: any
  isActive: boolean

  previousAction?: THREE.AnimationAction
  activeAction?: THREE.AnimationAction

  arrow: THREE.Group

  // store = useInjector(GameStateStore)
  constructor(opts: PlayerOptions) {
    this.render = this.render.bind(this)
    this.gltf = opts.gltf
    this.instance = opts.gltf.scene.clone()

    const arrow = getFile('arrow').clone() as THREE.Group
    arrow.scale.set(5, -5, 5)
    arrow.position.y = ARROW_POSITION_Y
    arrow.visible = false

    this.arrow = arrow
    this.isActive = false

    // arrow.position.z = 100

    this.instance.add(arrow)

    // console.log(arrow)
    // debugger

    this.mixer = new THREE.AnimationMixer(this.instance)
    const scaleNumber = 4
    this.instance.scale.set(scaleNumber, scaleNumber, scaleNumber)
    this.instance.rotateX((90 * Math.PI) / 180)
    this.map0 = opts.map0
    this.map1 = opts.map1
    // this.player = { ...opts.player }
    this.player = opts.player

    bus.on(ACTION.RENDER, this.render)

    // const color = stringToNumberColor(this.player.color)
    const color = new THREE.Color(this.player.color)

    this.instance.traverse(object => {
      // Foot
      if (object instanceof THREE.Mesh) {
        // console.log(object.name)
        if (object.name.includes('Torso') || object.name.includes('Foot') || object.name.includes('Leg') || object.name.includes('Head_3')) {
          if (!this.material) {
            this.material = object.material.clone() as any
            this.material.color = new THREE.Color(color)
          }
          object.material = this.material
        }
      }
    })

    // this.instance

    this.init()

    this.initAction()
  }

  private init(): Promise<void> {
    return new Promise(resolve => {
      const map = this.player.map === 0 ? this.map0 : this.map1
      const mapList = this.player.map === 0 ? workMapList : travelMapList
      const index = this.player.map === 0 ? this.player.map0Index : this.player.map1Index
      if (!map) throw new Error('未找到地图对象')
      // const mapAddress = MapList.find(t=> t.index === this.player.index)
      const mapAddress = mapList[index]

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

  playWin() {
    this.fadeToAction('Dance', 0.5)
  }

  private initAction() {
    const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing']
    const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp']
    const actions = this.actions
    const animations = this.gltf.animations

    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i]
      const action = this.mixer.clipAction(clip)

      const type: ActionType = {
        clip,
        action,
      }

      actions.push(type)

      if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
      }
    }
  }

  setActive(active: boolean) {
    if (this.isActive !== active) {
      this.isActive = active
      // this.arrow.visible = active
      if (!active) {
        this.arrow.visible = active
      }
    }
  }

  fadeToAction(name: string, duration = 0.5) {
    const actionType = this.actions.find(t => t.clip.name === name)
    if (!actionType) throw new Error('未找到动作名称:' + name)

    this.previousAction = this.activeAction
    this.activeAction = actionType.action
    if (this.previousAction && this.previousAction !== this.activeAction) {
      this.previousAction.fadeOut(duration)
    }

    this.activeAction.reset().setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(duration).play()
  }

  beginRun() {
    this.fadeToAction('Running', 0.2)
  }

  stopAnimate() {
    this.fadeToAction('Standing', 1)
  }

  goNext() {
    return new Promise<MapAddress>(resolve => {
      const address = getNextAddress(this)
      const targetPos = address.position

      const offset = this.getOffset(address)

      // 目标位置
      const target = {
        x: targetPos[0] + offset.x, // 重叠的时候稍微分开一点
        y: targetPos[1] + offset.y,
        z: targetPos[2],
      }

      const tween = createAnimation(this.instance.position, target, 500, TWEEN.Easing.Linear.None)

      tween.onComplete(() => {
        // 打工地图
        if (this.player.map === 0) {
          this.player.map0Index = address.index
        } else {
          this.player.map1Index = address.index
        }

        this.fixLookat(50)

        resolve(address)
      })
    })
  }

  // 更换位置.
  changeAddress(address: MapAddress) {
    const targetPos = address.position
    // 目标位置

    const offset = this.getOffset(address)
    const target = {
      x: targetPos[0] + offset.x,
      y: targetPos[1] + offset.y,
      z: targetPos[2],
    }

    const tween = createAnimation(this.instance.position, target, 1000, TWEEN.Easing.Linear.None)
    return new Promise<void>(resolve => {
      tween.onComplete(() => {
        if (this.player.map === 0) {
          this.player.map0Index = address.index
        } else {
          this.player.map1Index = address.index
        }

        this.fixLookat(50)
        resolve()
      })
    })
  }

  changeMap(address: MapAddress, map: 0 | 1): Promise<void> {
    return new Promise(resolve => {
      const offset = this.getOffset(address)
      this.player.map = map
      this.instance.parent?.remove(this.instance)
      const group = map === 0 ? this.map0 : this.map1
      if (map === 0) {
        this.player.map0Index = address.index
      } else {
        this.player.map1Index = address.index
      }
      this.instance.position.set(...address.position)
      group.add(this.instance)

      // 下落效果
      const z = this.instance.position.z
      this.instance.position.z += 20

      this.instance.position.x += offset.x
      this.instance.position.y += offset.y

      const tween = createAnimation(this.instance.position, { z }, 500, TWEEN.Easing.Quartic.In)

      tween.onComplete(() => {
        this.fixLookat(50)
        resolve()
      })
    })
  }

  // 修正人物的方向
  fixLookat(duration = 500): Promise<void> {
    return new Promise(resolve => {
      // const address = this.getNextAddress()
      const address = getNextAddress(this)
      const offset = this.getOffset(address)

      const position = address.position
      const p = this.instance.position
      // const rotation = this.instance.rotation

      const angle = getAngle(p.x, p.y, position[0] + offset.x, position[1] + offset.y) + 90
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

  // 当前玩家是否在打工状态
  isWork() {
    return this.player.map === 0 && !this.player.win
  }

  private render(e: any) {
    const delta = e.delta as number
    this.mixer.update(delta)

    if (this.isActive) {
      const cycleTime = 1000
      const MIN_POSITION_Y = 9.5
      const timer = e.timer as number
      const t = timer % cycleTime // [0,1000)
      //  x [-1,1)
      const x = (t - cycleTime / 2) / (cycleTime / 2)
      // 1 - pow(abs(x),1)
      const deltaY = (1 - Math.abs(x)) * (MIN_POSITION_Y - ARROW_POSITION_Y)

      this.arrow.position.y = ARROW_POSITION_Y + deltaY

      this.arrow.visible = true
    }
  }

  getOffset(address: MapAddress): Offset {
    const x = address.position[0]
    const y = address.position[1]

    const offset: Offset = {
      x: 0,
      y: 0,
    }

    const index = this.player.id - 1
    const offsets = [-7.5, -2.5, 2.5, 7.5]
    const num = offsets[index]

    if (Math.abs(x) >= Math.abs(y)) {
      offset.x = num
    } else {
      offset.y = num
    }

    return offset
  }

  destroy() {
    if (this.material) {
      this.material.destroy()
    }
    bus.off(ACTION.RENDER, this.render)
  }
}
