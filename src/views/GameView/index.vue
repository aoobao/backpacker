<template>
  <div class="container">
    <!-- 游戏页面 -->
    <ThreeWrap>
      <WorkMap @over="map1Init" ref="workMap" />
    </ThreeWrap>
    <HandUpDisplay v-if="map1Finish" />
    <!-- <div class="btns">
      <button @click="printCamera">相机</button>
    </div> -->
  </div>
</template>
<script lang="ts">
// import { PersonType } from '@/assets/types'
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import ThreeWrap from './ThreeWrap.vue'
import WorkMap from './WorkMap.vue'
import HandUpDisplay from './hand-up-display.vue'
import { printCamera, getAngle, createAnimation, delay } from '@/assets/index'
import { FileItem, getFileById } from '@/assets/preload'
import Player from '@/assets/object/Player'
import { THREE } from '@/assets/three/lib'
import { ACTION, bus } from '@/assets/bus'
import Cube from '@/assets/object/Cube'
export default defineComponent({
  components: { ThreeWrap, WorkMap, HandUpDisplay },
  setup() {
    const workMap = ref<InstanceType<typeof WorkMap>>()
    const store = useInjector(GameStateStore)
    const map1Finish = ref(false)
    const isLoad = ref(false)
    const map2Finish = ref(true)
    let playerFile: FileItem
    let players: Array<Player>
    let cube: Cube
    // const playerFile = await getFileById('player')
    getFileById('player').then(file => {
      playerFile = file
      isLoad.value = true
    })
    const isFinish = computed(() => {
      return map1Finish.value && isLoad.value && map2Finish.value
    })
    const map1Init = () => {
      map1Finish.value = true
    }
    watch(
      () => isFinish.value,
      val => {
        if (val) {
          init()
        }
      },
    )

    const init = () => {
      if (!store) throw new Error('未获取GameStateStore')

      players = store.gameState.players.map(p => {
        const object = playerFile.object.scene as THREE.Scene
        return new Player({
          player: p,
          object: object,
          map1: store.map1!,
        })
      })
      bus.on(ACTION.RENDER, render)
      gameLoop()
    }

    const gameLoop = async () => {
      if (!store) throw new Error('未获取GameStateStore')

      const env = store.env
      if (!env) throw new Error('未获取3d环境')
      const currentPlayerId = store?.gameState.currentPlayerId
      const currentIndex = players.findIndex(t => t.player.id === currentPlayerId)
      const player = players[currentIndex]

      await delay(1)
      // 聚焦当前玩家
      workMap.value!.lookAtPosition(player.instance.position)

      // 骰子
      cube = new Cube({ map1: store.map1! })
      cube.show()
      // cube = new Cube({ map1: store.map1! })
    }

    const render = () => {
      // console.log('render')
    }

    onBeforeUnmount(() => {
      bus.off(ACTION.RENDER, render)
    })

    return {
      map1Init,
      printCamera,
      gameState: store?.gameState,
      map1Finish,
      workMap,
    }
  },
})
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;

  .btns {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
