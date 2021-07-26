import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { onBeforeMount } from 'vue'
import { onMounted } from 'vue'
import { defineComponent } from 'vue'
import { THREE } from '@/assets/three/lib'

import { createAnimation } from '@/assets'
import { MapList } from '@/assets/setting'
import { createType0Canvas, createWorkCanvas, createRewardCanvas } from '@/assets/canvas-background'
import { MapAddress, PointType } from '@/assets/types'
// import { useStore } from 'vuex'

export default defineComponent({
  name: 'WorkMap',
  props: {},
  setup(props, { emit }) {
    const store = useInjector(GameStateStore)
    const loader = new THREE.TextureLoader()

    const mapGeometry = new THREE.PlaneGeometry(254, 254)
    const mapMaterial = new THREE.MeshBasicMaterial({ color: 0x3f4470, side: THREE.DoubleSide })
    const map = new THREE.Mesh(mapGeometry, mapMaterial)

    // logo
    const logoGeometry = new THREE.PlaneGeometry(140, 82)
    const logoTexture = loader.load(require('@/assets/image/logo.png'))
    const logoMaterial = new THREE.MeshLambertMaterial({
      map: logoTexture,
    })
    const logo = new THREE.Mesh(logoGeometry, logoMaterial)
    logo.position.z = 0.5
    map.add(logo)

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
        const canvas = await createWorkCanvas(m.options?.name || '未命名', player.color2, m.options?.imageUrl, m.width * 10, m.height * 10)
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

    // 地图棋盘格子
    MapList.forEach(async m => {
      const geometry = new THREE.PlaneGeometry(m.width, m.height)
      const material = await createMaterial(m)
      // 发薪日

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.set(m.position[0], m.position[1], m.position[2])

      if (m.type !== PointType.START && m.options?.rotation) {
        mesh.rotation.z = m.options.rotation
      }

      map.add(mesh)
    })

    const init = () => {
      const env = store?.env

      if (!env) {
        console.warn('three环境未获取')
      }
      map.position.z = -30
      map.rotation.z = -Math.PI * 2
      env?.scene.add(map)

      const tween = createAnimation(map.rotation, { z: 0 }, 1000)

      tween.onComplete(() => {
        store?.setMap1(map)
        emit('over')
      })
    }

    onMounted(() => {
      init()
    })

    onBeforeMount(() => {
      // const env = store?.gameState.env
      const env = store?.env
      env?.scene.remove(map)
    })

    // const store = useStore()
    return () => {
      return null
    }
  },
})
