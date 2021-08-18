<template>
  <HotCityView v-if="isLoad" ref="hotCityRef" />
</template>
<script lang="ts">
import HotCityView from './HotCityView.vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { defineComponent, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { createStar, showMessage } from '@/assets/index'
import { THREE } from '@/assets/three/lib'
import TWEEN, { Tween } from '@tweenjs/tween.js'
import { createAnimation } from '@/assets'
import { HotCity, MapAddress, PointType } from '@/assets/types'
import { createBigCityCanvas, createCityCanvas, createStartPointCanvas } from '@/assets/canvas-background'
import PointSelect from '@/assets/three/PointSelect/index'



export default defineComponent({
  name: 'TravelMap',
  components: { HotCityView },
  setup(props, { emit }) {
    const isLoad = ref(false)
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')

    const hotCityRef = ref<InstanceType<typeof HotCityView>>()

    const mapGeometry = new THREE.PlaneGeometry(254, 254)
    const mapMaterial = new THREE.MeshBasicMaterial({ color: 0x3f4470, side: THREE.DoubleSide })
    const map = new THREE.Mesh(mapGeometry, mapMaterial)
    map.position.z = -1000
    map.visible = false

    const getPointValue = (index: number): HotCity | null => {
      if (store.hot8.value && index === store.hot8.value.index)
        return {
          address: store.hot8.value,
          point: 8,
        }
      if (store.hot7.value && store.hot7.value.index === index)
        return {
          address: store.hot7.value,
          point: 7,
        }
      if (store.hot6.value && store.hot6.value.index === index)
        return {
          address: store.hot6.value,
          point: 6,
        }
      if (store.hot5.value && store.hot5.value.index === index)
        return {
          address: store.hot5.value,
          point: 5,
        }
      return null
    }

    const createMaterial = async (m: MapAddress): Promise<THREE.Material> => {
      if (m.type === PointType.START) {
        const canvas = createStartPointCanvas('#ffc428', m.width * 10, m.height * 10)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        const material = new THREE.MeshBasicMaterial({ map: texture })
        return material
      } else if (m.type === PointType.CITY) {
        // const value = getPointValue(m.index)
        const canvas = await createCityCanvas(m)
        const texture = new THREE.CanvasTexture(canvas)
        texture.needsUpdate = true
        const material = new THREE.MeshBasicMaterial({ map: texture })
        return material
      } else if (m.type === PointType.BIG_CITY) {
        // const value = getPointValue(m.index)
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

    const star8 = createStar()
    const star7 = createStar()
    const star6 = createStar()
    const star5 = createStar()

    const initPosition = (star: THREE.Mesh, hot: MapAddress | null, scale: number) => {
      if (hot === null) {
        star.parent?.remove(star)
      } else {
        const position = hot.position
        let x = position[0]
        let y = position[1]
        const offset = 16

        if (Math.abs(x) >= Math.abs(y)) {
          if (x > 0) {
            x += offset
            y += 5
          } else if (x < 0) {
            x -= offset
            y -= 5
          }
        } else {
          if (y > 0) {
            y += offset
            x -= 5
          } else {
            y -= offset
            x += 5
          }
        }

        star.position.set(x, y, 2)

        star.scale.set(scale, scale, scale)
        if (!star.parent) {
          map.add(star)
        }
      }
    }

    watchEffect(() => {
      initPosition(star8, store.hot8.value, 0.3)
    })
    watchEffect(() => {
      initPosition(star7, store.hot7.value, 0.25)
    })
    watchEffect(() => {
      initPosition(star6, store.hot6.value, 0.2)
    })
    watchEffect(() => {
      initPosition(star5, store.hot5.value, 0.15)
    })

    let tween: Tween<object> | null

    watchEffect(() => {
      const val = store.gameState.activeMap
      if (tween) {
        tween.stop()
        tween = null
      }
      // console.log('travel map ' + val)
      if (val === 1) {
        map.visible = true
        const target = { z: -30 }
        const t = Math.abs(map.position.z + target.z)

        tween = createAnimation(map.position, target, t, TWEEN.Easing.Linear.None)
        tween.onComplete(() => {
          tween = null
        })
      } else {
        const target = { z: -1000 }

        const t = Math.abs(target.z + map.position.z)

        tween = createAnimation(map.position, target, t, TWEEN.Easing.Linear.None)

        tween.onComplete(() => {
          map.visible = false
          tween = null
        })
      }
    })

    const init = () => {
      const env = store.env
      if (!env) throw new Error('three环境未获取')

      env.scene.add(map)

      setTimeout(() => {
        store.setMap1(map)
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

    const chooseStartPoint = (): Promise<MapAddress> => {
      return new Promise(resolve => {
        // console.log('choose')
        const env = store.env!

        const startPoints = store.gameState.travelMapList.filter(t => t.type === PointType.START)

        const selectPoints = startPoints.map(p => {
          const index = p.index
          const name = `travel-${index}`
          const target = map.children.find(t => t.name === name)

          if (!target) throw new Error('未找到起点对象,name:' + name)

          const point = new PointSelect({ target, env, extData: p, show: true, click })

          return point
        })

        showMessage('请玩家选择起点')

        function click(data: MapAddress) {
          selectPoints.forEach(sp => {
            sp.destroy()
          })
          resolve(data)
        }
      })
    }

    const removeHotCity = async (hotCity: HotCity) => {
      await hotCityRef.value!.removeHotCity(hotCity.point, hotCity.address.index)

      const index = 8 - hotCity.point
      store.removeHotCity(index)
    }

    return {
      chooseStartPoint,
      getPointValue,
      removeHotCity,
      isLoad,
      hotCityRef,
    }
  },
})
</script>
