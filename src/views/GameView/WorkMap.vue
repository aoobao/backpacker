<script lang="ts">
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { defineComponent, ref, onBeforeMount, onMounted } from 'vue'
import { THREE } from '@/assets/three/lib'
import { createStar } from '@/assets/index'
import TWEEN from '@tweenjs/tween.js'
import { createAnimation } from '@/assets'
import { workMapList } from '@/assets/setting'
import { createType0Canvas, createWorkCanvas, createRewardCanvas } from '@/assets/canvas-background'
import { MapAddress, PointType } from '@/assets/types'
// import { useStore } from 'vuex'

export default defineComponent({
  name: 'WorkMap',
  setup(props, { emit }) {
    const isLoad = ref(false)
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
    workMapList.forEach(async m => {
      const geometry = new THREE.PlaneGeometry(m.width, m.height)
      const material = await createMaterial(m)
      // 发薪日

      const mesh = new THREE.Mesh(geometry, material)

      mesh.name = `address-${m.index}`

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
      // map.rotation.z = -Math.PI * 2
      env?.scene.add(map)

      setTimeout(() => {
        store?.setMap1(map)
        isLoad.value = true
        emit('over')
      }, 100)

      // const tween = createAnimation(map.rotation, { z: 0 }, 1000)

      // tween.onComplete(() => {
      //   store?.setMap1(map)
      //   isLoad.value = true
      //   emit('over')
      // })
    }

    onMounted(() => {
      init()
    })

    onBeforeMount(() => {
      // const env = store?.gameState.env
      const env = store?.env
      env?.scene.remove(map)
    })

    function addStar(address: MapAddress): Promise<boolean> {
      const star = createStar()
      const addressName = `address-${address.index}`
      const position = address.position
      const count = address.options.level || 1

      const scale = {
        x: 0.15,
        y: 0.15,
        // z: 0.15,
      }
      // star.scale.x = scale.x
      // star.scale.y = scale.y

      // star.scale.set(scale.x, scale.y, scale.z)
      const x = address.width * 0.3 * count - address.width * 0.6
      const y = address.height * 0.6
      star.position.set(x, y, 0.2)
      const addressMesh = map.children.find(t => t.name === addressName)

      if (!addressMesh) throw new Error('未找到打工地点:' + addressName)

      addressMesh.add(star)

      // const tween =
      // createAnimation(star.position, { z: 2 }, 2000, TWEEN.Easing.Linear.None)

      const tween = createAnimation(star.scale, scale, 1500, TWEEN.Easing.Quartic.In)

      return new Promise(resolve => {
        // resolve(true)
        tween.onComplete(() => {
          resolve(true)
        })
      })
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
        let redian = -azimuthVec.angle()
        // console.log(redian, Math.PI, control.azimuthAngle)
        // redian = -redian
        // if (redian < Math.PI) {
        // }
        // if (redian < Math.PI) {
        //   redian = Math.PI - redian
        // } else {
        //   redian += (90 * Math.PI) / 180
        // }

        // let azimuthRadian = redian

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
