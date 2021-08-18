<script lang="ts">
import { defineComponent } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { THREE } from '@/assets/three/lib'
import { createHotCityCard } from '@/assets/canvas-background'
import { createAnimation, delay } from '@/assets/index'
import TWEEN from '@tweenjs/tween.js'
export default defineComponent({
  setup() {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    const map = store.map1!
    const positions = [
      [-20, -30, 1],
      [-20, 30, 1],
      [20, -30, 1],
      [20, 30, 1],
    ]
    const hotCityGroups = store.gameState.hotCitys

    for (let i = 0; i < hotCityGroups.length; i++) {
      const citys = hotCityGroups[i]
      const group = new THREE.Group()
      const pointValue = 8 - i
      group.name = 'hot-' + pointValue
      const pos = positions[i]
      group.position.set(pos[0], pos[1], pos[2])

      for (let s = 0; s < citys.length; s++) {
        const city = citys[s]
        let z = s * 0.5 + 0.5 // 高度
        createHotCityCard(city, pointValue).then(mesh => {
          // name = hot-city-?
          mesh.position.set(0, 0, z)
          group.add(mesh)
        })
      }

      map.add(group)
    }

    const removeHotCity = async (pointValue: number, cityIndex: number): Promise<void> => {
      const name = 'hot-' + pointValue
      const group = map.children.find(t => {
        return t.name === name
      })

      if (!group) {
        throw new Error('未找到对应积分的group:' + pointValue)
      }

      const addressName = `hot-city-${cityIndex}`

      const mesh = group.children.find(t => t.name === addressName)

      if (!mesh) {
        throw new Error('未找到对应热门城市:' + addressName)
      }

      const target = { z: 20 }
      const camera = store.env!.camera!
      const rotation = camera.rotation

      createAnimation(mesh.position, target, 800, TWEEN.Easing.Linear.None)

      createAnimation(mesh.rotation, rotation, 800, TWEEN.Easing.Linear.None)

      await delay(1)

      createAnimation(
        mesh.position,
        {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z + 200,
        },
        1000,
        TWEEN.Easing.Quartic.In,
      )

      await delay(1.2)

      group.remove(mesh)
      return
    }

    return {
      removeHotCity,
    }
  },
  render() {
    return null
  },
})
</script>
