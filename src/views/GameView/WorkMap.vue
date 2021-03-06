<script lang="ts">
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { defineComponent, ref, onBeforeUnmount, onMounted, watch, watchEffect } from 'vue'
import { THREE } from '@/assets/three/lib'
import { createStar } from '@/assets/index'
import TWEEN, { Tween } from '@tweenjs/tween.js'
import { createAnimation } from '@/assets'
// import { workMapList } from '@/assets/setting'
import { createType0Canvas, createWorkCanvas, createRewardCanvas } from '@/assets/canvas-background'
import { MapAddress, PointType } from '@/assets/types'
import { SETTING } from '@/config'
import { updateMoneyInWorkAddress } from '@/assets/object/utils'
import { GirdType, PlaneGird } from '@/assets/object/PlaneGird'
// import { useStore } from 'vuex'

export default defineComponent({
  name: 'WorkMap',
  setup(props, { emit }) {
    const isLoad = ref(false)
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    const loader = new THREE.TextureLoader()

    const mapGeometry = new THREE.PlaneGeometry(254, 254)
    const mapMaterial = new THREE.MeshBasicMaterial({ color: 0x3f4470, side: THREE.DoubleSide })
    const map = new THREE.Mesh(mapGeometry, mapMaterial)
    map.position.z = -1000
    map.visible = false

    // logo
    const logoGeometry = new THREE.PlaneGeometry(140, 82)
    const logoTexture = loader.load(require('@/assets/image/logo.png'))
    const logoMaterial = new THREE.MeshLambertMaterial({
      map: logoTexture,
      transparent: true,
    })
    const logo = new THREE.Mesh(logoGeometry, logoMaterial)
    logo.position.z = 0.5
    map.add(logo)

    let tween: Tween<object> | null

    watchEffect(() => {
      const val = store.gameState.activeMap
      if (tween) {
        tween.stop()
        tween = null
      }

      if (val === 0) {
        map.visible = true
        const target = { z: SETTING.positionZ }
        const t = Math.abs(map.position.z + target.z)

        // console.log(t)
        tween = createAnimation(map.position, target, t, TWEEN.Easing.Linear.None)
        tween.onComplete(() => {
          tween = null
        })
      } else {
        const target = { z: SETTING.positionZ2 }
        const t = Math.abs(target.z + map.position.z)
        tween = createAnimation(map.position, target, t, TWEEN.Easing.Linear.None)
        tween.onComplete(() => {
          map.visible = false
          tween = null
        })
      }
    })

    // watch(
    //   () => store.gameState.activeMap,
    //   val => {
    //     if (val === 0) {
    //       // map.visible = true
    //     } else {
    //       map.visible = false
    //     }
    //   },
    // )

    const createMaterial = async (m: MapAddress): Promise<THREE.Material> => {
      const player = store?.gameState.players.find(t => t.id === m.options.playerId)
      if (!player) throw new Error('未找到对应玩家')

      if (m.type === PointType.START) {
        const canvas = createType0Canvas(player.name, player.color, m.options?.rotation, m.width * 10, m.height * 10)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        const material = new THREE.MeshBasicMaterial({ map: texture })
        return material
      } else if (m.type === PointType.WORK) {
        // const canvas = await createWorkCanvas(m.options?.name || '未命名', player.color2, m.options?.imageUrl, m.width * 10, m.height * 10)
        const canvas = await createWorkCanvas(m, player.color2)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true

        return new THREE.MeshBasicMaterial({ map: texture })
      } else if (m.type === PointType.REWARD) {
        const canvas = createRewardCanvas(m.options.rewardIndex!, '#8ace57', player.color2, m.width * 10, m.height * 10)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true

        return new THREE.MeshBasicMaterial({ map: texture })
      } else {
        return new THREE.MeshBasicMaterial({ color: 0xff0000 })
      }
    }

    let workAddressCount = 0

    const loadInit = () => {
      workAddressCount++
      if (workAddressCount === store.gameState.workMapList.length) {
        if (isLoad.value) {
          emit('over')
        }
      }
    }

    // 地图棋盘格子
    const workPlaneGirdList = store.gameState.workMapList.map(m => {
      return new PlaneGird({
        mapAddress: m,
        createMaterialFun: createMaterial,
        type: GirdType.Work,
        map,
        init: loadInit,
      })
    })

    const init = () => {
      const env = store.env

      if (!env) {
        // console.warn('three环境未获取')
        throw new Error('three环境未获取')
      }
      // map.rotation.z = -Math.PI * 2
      env.scene.add(map)

      store.setMap0(map)
      isLoad.value = true

      if (workAddressCount === store.gameState.workMapList.length) {
        emit('over')
      }
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      // const env = store?.gameState.env
      const env = store?.env

      // workPlaneGirdList.forEach(t => {
      //   t.destroy()
      // })
      env?.scene.remove(map)
      mapGeometry.dispose()
      mapMaterial.dispose()
    })

    function addStar(address: MapAddress, level: 1 | 2 | 3): Promise<boolean> {
      const addressName = `work-${address.index}`
      const pg = workPlaneGirdList.find(t => t.name === addressName)!

      pg.addStar(level)

      return Promise.resolve(true)

      // const star = createStar()
      // const addressName = `work-${address.index}`
      // const count = level ? level : address.options.level || 1

      // const scale = {
      //   x: 0.15,
      //   y: 0.15,
      // }
      // const x = address.width * 0.3 * count - address.width * 0.6
      // const y = address.height * 0.6
      // star.position.set(x, y, 0.2)
      // const addressMesh = map.children.find(t => t.name === addressName)

      // if (!addressMesh) throw new Error('未找到打工地点:' + addressName)

      // addressMesh.add(star)

      // updateMoneyInWorkAddress(addressMesh, address)

      // const tween = createAnimation(star.scale, scale, 1500, TWEEN.Easing.Quartic.In)

      // return new Promise(resolve => {
      //   // resolve(true)
      //   tween.onComplete(() => {
      //     resolve(true)
      //   })
      // })
    }

    function lookAtPosition(point: THREE.Vector3): void {
      const env = store?.env
      const control = env?.control
      if (control) {
        // const t = Math.sqrt(Math.pow(point.z, 2) + Math.pow(point.x, 2))
        // const polarVec = new THREE.Vector2(-point.y, t)
        // const polarRadian = polarVec.angle()
        const azimuthVec = new THREE.Vector2(point.y, point.x)

        // console.log(azimuthVec.angle())
        let redian = -azimuthVec.angle() + (150 * Math.PI) / 180

        const num = Math.round((control.azimuthAngle - redian) / (2 * Math.PI))
        const azimuthRadian = num * 2 * Math.PI + redian

        control.rotateTo(azimuthRadian, control.polarAngle, true)

        // control.setLookAt(0, 0, 100, position.x, position.y, position.z, true)
        // control.zoomTo(1, true)
      } else {
        throw new Error('control 未初始化')
      }
    }

    return {
      addStar,
      lookAtPosition,
      isLoad,
    }
  },
  render() {
    return null
  },
})
</script>
