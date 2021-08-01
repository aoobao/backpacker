import { MapAddress, PersonType } from '../types'
import { workMapList, getNextAddress, getCurrentAddress } from '../setting'
import { createAnimation, getAngle } from '@/assets/index'
import TWEEN from '@tweenjs/tween.js'
import { THREE } from '@/assets/three/lib'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { bus, ACTION } from '@/assets/bus'
export interface PlayerOptions {
  player: PersonType
  gltf: GLTF
  map1: THREE.Object3D
}

export interface ActionType {
  clip: THREE.AnimationClip
  action: THREE.AnimationAction
}

export default class Player {
  instance: THREE.Object3D
  player: PersonType
  map1: THREE.Object3D
  mixer: THREE.AnimationMixer
  actions: Array<ActionType> = []
  gltf: GLTF
  material: any

  previousAction?: THREE.AnimationAction
  activeAction?: THREE.AnimationAction

  // store = useInjector(GameStateStore)
  constructor(opts: PlayerOptions) {
    this.render = this.render.bind(this)
    this.gltf = opts.gltf
    this.instance = opts.gltf.scene.clone()
    this.mixer = new THREE.AnimationMixer(this.instance)
    const scaleNumber = 8
    this.instance.scale.set(scaleNumber, scaleNumber, scaleNumber)
    this.instance.rotateX((90 * Math.PI) / 180)
    this.map1 = opts.map1
    this.player = { ...opts.player }

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
          // object.material = object.material.clone()
          // object.material.color = new THREE.Color(color)
        }
      }
    })

    // this.instance

    this.init()

    this.initAction()
  }

  private init(): Promise<void> {
    return new Promise(resolve => {
      // FIX:
      const map = this.map1
      if (!map) throw new Error('未找到地图对象')
      // const mapAddress = MapList.find(t=> t.index === this.player.index)
      const mapAddress = workMapList[this.player.index]

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
    this.fadeToAction('Running', 0.5)
  }

  stopAnimate() {
    this.fadeToAction('Standing', 1)
  }

  goNext() {
    return new Promise<MapAddress>(resolve => {
      const address = getNextAddress(this)
      const targetPos = address.position
      // 目标位置
      const target = {
        x: targetPos[0],
        y: targetPos[1],
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

  // 修正人物的方向
  fixLookat(duration = 500): Promise<void> {
    return new Promise(resolve => {
      // const address = this.getNextAddress()
      const address = getNextAddress(this)
      const position = address.position
      const p = this.instance.position
      // const rotation = this.instance.rotation

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

  // 当前玩家是否在打工状态
  isWork() {
    return this.player.map === 0
  }

  // 人物当前所在地点地点
  getCurrentAddress(): MapAddress {
    const address = getCurrentAddress(this)
    return address
  }

  private render(e: any) {
    const delta = e.delta as number

    this.mixer.update(delta)
  }

  destroy() {
    if (this.material) {
      this.material.destroy()
    }
    bus.off(ACTION.RENDER, this.render)
  }
}
