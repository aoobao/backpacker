<template>
  <div class="container">
    <!-- 游戏页面 -->
    <ThreeWrap>
      <WorkMap @over="map1Init" ref="workMap" />
    </ThreeWrap>
    <HandUpDisplay v-if="map1Finish" />
    <TouchView ref="touchRef" />
    <NumberView ref="numberRef" />
    <TextView ref="textRef" />
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
import { delay, showMessage } from '@/assets/index'
import { FileItem, getFileById } from '@/assets/preload'
import Player from '@/assets/object/Player'
// import { THREE } from '@/assets/three/lib'
// import { Dialog } from 'vant'
import { ACTION, bus } from '@/assets/bus'
import Cube from '@/assets/object/Cube'
import TouchView from '@/components/TouchView/index.vue'
import NumberView from '@/components/NumberView/index.vue'
import TextView from '@/components/TextView.vue'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { MapAddress, PointType } from '@/assets/types'
export default defineComponent({
  components: { ThreeWrap, WorkMap, HandUpDisplay, TouchView, NumberView, TextView },
  setup() {
    const numberRef = ref<InstanceType<typeof NumberView>>()
    const workMap = ref<InstanceType<typeof WorkMap>>()
    const touchRef = ref<InstanceType<typeof TouchView>>()
    const textRef = ref<InstanceType<typeof TextView>>()
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
        // const object = playerFile.object.scene as THREE.Scene
        const gltf = playerFile.object as GLTF
        return new Player({
          player: p,
          gltf: gltf,
          map1: store.map1!,
        })
      })
      bus.on(ACTION.RENDER, render)

      // 开场动画
      delay(1).then(() => {
        // 骰子
        cube = new Cube({ map1: store.map1! })

        gameLoop()
      })
    }

    const getPlayerById = (playerId: number) => {
      const player = players.find(t => t.player.id === playerId)
      if (!player) throw new Error('人员获取失败,id=' + playerId)
      return player
    }

    const gameLoop = async () => {
      if (!store) throw new Error('未获取GameStateStore')

      const env = store.env
      if (!env) throw new Error('未获取3d环境')
      // const currentPlayerId = store?.gameState.currentPlayerId
      // const player = players.find(t => t.player.id === currentPlayerId)

      // if (!player) throw new Error('当前活动人员获取失败')

      const player = getPlayerById(store.gameState.currentPlayerId!)

      textRef.value?.show(`${player.player.name}进行中`)

      // 聚焦当前玩家
      workMap.value!.lookAtPosition(player!.instance.position)

      // 等待用户扔骰子
      const speed = await touchRef.value!.show()

      // 关闭文字
      textRef.value?.close()
      // 等待骰子转动结束
      await cube.show(store.physicsWorld!, speed)
      // 获取骰子点数
      const value = cube.getValue()
      // 显示骰子点数在屏幕上
      numberRef.value?.show(value)
      // 用户在屏幕上行动
      player.beginRun()
      for (let i = 0; i < value; i++) {
        await player.goNext()
        // TODO
        // 用户到达自己起点的逻辑(是否要去旅游)
      }
      player.stopAnimate()

      // numberRef.value?.close()
      // 处理角色业务逻辑
      if (player.isWork()) {
        await detailWorkEvent(player)
      } else {
        await detailTravelEvent(player)
      }

      // 继续下一个玩家
      store.getNextPlayer()

      gameLoop()
    }

    const render = () => {
      // console.log('render')
    }

    onBeforeUnmount(() => {
      bus.off(ACTION.RENDER, render)
    })

    // 处理逻辑 机会/加熟练/其他用户加钱
    async function detailWorkEvent(player: Player) {
      const address = player.getCurrentAddress()
      if (address.type === PointType.WORK) {
        if (player.player.id === address.options.playerId) {
          // 如果是自己的地盘,加熟练度
          await addLevel(address)
        } else {
          const workPlayer = getPlayerById(address.options.playerId) // 当前地址所属玩家
          // 如果对方玩家在打工地图,给对方玩家加钱
          if (workPlayer.isWork()) {
            // TODO
          } else {
            // 给自己加钱
            // TODO
          }
        }
      } else if (address.type === PointType.REWARD) {
        // 机会
        // TODO
      }

      return true
    }

    // 处理旅游状态下的业务逻辑
    async function detailTravelEvent(player: Player) {
      // TODO
    }

    // 增加熟练度
    async function addLevel(address: MapAddress) {
      let level = address.options.level || 0
      const player = players.find(t => t.player.id === address.options.playerId)
      if (level === 3) {
        showMessage(`${player!.player.name}的${address.options.name}已经达到最高等级`, 5000)

        return false
      } else {
        level++
        address.options.level = level
        const cost = address.options.reward![level]

        showMessage(`${address.options.name}熟练度${level}级:${cost}元`, 5000)
      }
    }

    return {
      map1Init,
      gameState: store?.gameState,
      map1Finish,
      workMap,
      touchRef,
      numberRef,
      textRef,
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
