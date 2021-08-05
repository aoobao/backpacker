<script lang="ts">
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { THREE } from '@/assets/three/lib'
import { MapAddress, PointType } from '@/assets/types'
import { createBigCityCanvas, createCityCanvas, createStartPointCanvas } from '@/assets/canvas-background'
export default defineComponent({
  name: 'TravelMap',
  setup(props, { emit }) {
    const isLoad = ref(false)
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')

    const mapGeometry = new THREE.PlaneGeometry(254, 254)
    const mapMaterial = new THREE.MeshBasicMaterial({ color: 0x3f4470, side: THREE.DoubleSide })
    const map = new THREE.Mesh(mapGeometry, mapMaterial)
    if (store.gameState.activeMap === 0) map.visible = false

    const createMaterial = async (m: MapAddress): Promise<THREE.Material> => {
      if (m.type === PointType.START) {
        const canvas = createStartPointCanvas('#ffc428', m.width * 10, m.height * 10)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        const material = new THREE.MeshBasicMaterial({ map: texture })
        return material
      } else if (m.type === PointType.CITY) {
        const canvas = await createCityCanvas(m)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        const material = new THREE.MeshBasicMaterial({ map: texture })
        return material
      } else if (m.type === PointType.BIG_CITY) {
        const canvas = await createBigCityCanvas(m)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        const material = new THREE.MeshBasicMaterial({ map: texture })
        return material
      }

      return new THREE.MeshBasicMaterial({ color: 0xff0000 })
    }

    store.gameState.travelMapList.forEach(async m => {
      const geometry = new THREE.PlaneGeometry(m.width, m.height)
      const material = await createMaterial(m)

      const mesh = new THREE.Mesh(geometry, material)
      mesh.name = `travel-${m.index}`

      mesh.position.set(...m.position)

      if (m.options.rotation) {
        mesh.rotation.z = m.options.rotation
      }

      map.add(mesh)
    })

    const geometry8 = new THREE.PlaneGeometry(30, 50)
    const material8 = new THREE.MeshBasicMaterial({ color: 0xff0000 })

    const mesh = new THREE.Mesh(geometry8, material8)
    mesh.name = 'hot-8'
    mesh.position.set(-30, -30, 1)

    map.add(mesh)

    watch(
      () => store.gameState.activeMap,
      val => {
        console.log(val, 'travelmap')
        if (val === 1) {
          map.visible = true
        } else {
          map.visible = false
        }
      },
    )

    const init = () => {
      const env = store.env
      if (!env) throw new Error('three环境未获取')

      map.position.z = -1030
      env.scene.add(map)

      setTimeout(() => {
        store.setMap2(map)
        isLoad.value = true
        emit('over')
      }, 100)
    }

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      const env = store.env
      env?.scene.remove(map)
      mapGeometry.dispose()
      mapMaterial.dispose()
    })
  },
  render() {
    return null
  },
})
</script>
