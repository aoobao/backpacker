<template>
  <div class="container">
    <!-- 游戏页面 -->
    <ThreeWrap>
      <WorkMap @over="map1Init" ref="workMap" />
      <TravelMap @over="map2Init" ref="travelMap" />
      <HandUpDisplay v-if="isFinish" :enabled="enabled" />
      <TouchView ref="touchRef" />
      <NumberView ref="numberRef" />
      <!-- <TextView ref="textRef" /> -->
      <RewardView ref="rewardRef" />
      <StepNumber ref="stepRef" />
      <WinView ref="winRef" />
      <OverView ref="overRef" />
    </ThreeWrap>
  </div>
</template>
<script lang="ts">
// import { PersonType } from '@/assets/types'
import { computed, defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import ThreeWrap from './ThreeWrap.vue'
import WorkMap from './WorkMap.vue'
import TravelMap from './TravelMap.vue'
import HandUpDisplay from './HandUpDisplay.vue'
import { delay, showMessage, confirm, setItem, removeItem, appendMessage } from '@/assets/index'
import { FileItem, getFileById } from '@/assets/preload'
import Player from '@/assets/object/Player'
import { ACTION, bus } from '@/assets/bus'
import Cube from '@/assets/object/Cube'
import TouchView from '@/components/TouchView/index.vue'
import NumberView from '@/components/NumberView/index.vue'
import StepNumber from '@/views/GameView/StepNumber.vue'
import OverView from '@/views/GameView/OverView.vue'
import WinView from '@/components/WinView/index.vue'
import RewardView from '@/views/GameView/Reward/index.vue'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { MapAddress, PersonType, PointType } from '@/assets/types'
import { workMapList } from '@/assets/setting'
import { chooseStartPoint, chooseGoTravel, chooseTravelContinue, getStep } from '@/assets/ai'
export default defineComponent({
  components: { ThreeWrap, WorkMap, TravelMap, HandUpDisplay, TouchView, NumberView, RewardView, StepNumber, WinView, OverView },
  // components: { HandUpDisplay },
  setup(props, { emit }) {
    const numberRef = ref<InstanceType<typeof NumberView>>()
    const workMap = ref<InstanceType<typeof WorkMap>>()
    const travelMap = ref<InstanceType<typeof TravelMap>>()
    const touchRef = ref<InstanceType<typeof TouchView>>()
    // const textRef = ref<InstanceType<typeof TextView>>()
    const winRef = ref<InstanceType<typeof WinView>>()
    const stepRef = ref<InstanceType<typeof StepNumber>>()
    const rewardRef = ref<InstanceType<typeof RewardView>>()
    const overRef = ref<InstanceType<typeof OverView>>()
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    const map1Finish = ref(false)
    const isLoad = ref(false)
    const map2Finish = ref(false)

    const enabled = ref(false)

    let playerFile: FileItem
    let players: Array<Player>
    let cube: Cube
    let cube2: Cube
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
    const map2Init = () => {
      map2Finish.value = true
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
      const env = store.env
      if (!env) throw new Error('threejs 环境未找到')
      players = store.gameState.players.map(p => {
        // const object = playerFile.object.scene as THREE.Scene
        const gltf = playerFile.object as GLTF
        return new Player({
          player: p,
          gltf: gltf,
          map0: store.map0!,
          map1: store.map1!,
        })
      })
      bus.on(ACTION.RENDER, render)
      bus.on(ACTION.CHANGE_POSITION, playerChangePosition)
      bus.on(ACTION.ADD_LEVEL, addLevelByAddressIndex)

      initMapStar()

      // env.control!.setLookAt(0, -245, 170, 0, 0, 0, true)

      // 开场动画
      delay(1).then(() => {
        // 骰子
        cube = new Cube()
        cube2 = new Cube()

        gameLoop()
      })
    }

    const getPlayerById = (playerId: number) => {
      const player = players.find(t => t.player.id === playerId)
      if (!player) throw new Error('人员获取失败,id=' + playerId)
      return player
    }

    const setActiveByPlayerId = (playerId: number) => {
      players.forEach(p => {
        if (p.player.id === playerId) {
          p.setActive(true)
        } else {
          p.setActive(false)
        }
      })
    }

    const gameLoop = async () => {
      const env = store.env
      if (!env) throw new Error('未获取3d环境')

      if (!store.gameState.currentPlayerId) {
        console.log('currentPlayerId异常,结束循环')
        return
      }

      const player = getPlayerById(store.gameState.currentPlayerId)

      setActiveByPlayerId(store.gameState.currentPlayerId)

      // 切换地图
      if (player.player.map !== store.gameState.activeMap) {
        // await toggleMap(player.player.map)
        store.gameState.activeMap = player.player.map
        await delay(2)
      }

      // 聚焦当前玩家
      // workMap.value!.lookAtPosition(player!.instance.position)

      if (!player.player.isAI) enabled.value = true

      appendMessage('游戏进行中', player.player, false)

      // 如果玩家在旅游城市,询问是否返回打工
      if (player.player.map === 1) {
        // 如果小于500元,直接回来打工
        if (player.player.money < 500) {
          appendMessage('金币不足500,回家打工赚钱', player.player)

          const address = workMapList.find(t => t.index === player.player.index)
          if (!address) throw new Error('未找到打工起始地址:index=' + player.player.index)
          store.gameState.activeMap = 0
          await player.changeMap(address, 0)
        } else {
          let travelContinue: boolean
          if (player.player.isAI) {
            travelContinue = chooseTravelContinue(player.player)
          } else {
            travelContinue = await confirm('继续旅游需要扣除500旅费,请问是否继续旅游?', '提示')
          }
          if (!travelContinue) {
            // 不继续旅游
            appendMessage(`结束旅游回来打工赚钱`, player.player)
            const address = workMapList.find(t => t.index === player.player.index)
            if (!address) throw new Error('未找到打工起始地址:index=' + player.player.index)
            store.gameState.activeMap = 0
            await player.changeMap(address, 0)
          }
        }
      }

      // 当前玩家是否最终处在旅游地图
      const isTravel = player.player.map === 1

      if (isTravel) {
        store.changeMoney(player.player.id, -500) // 扣除500旅费
        appendMessage('继续旅游,扣除500旅费', player.player)
      }

      let speed: number
      // 等待用户扔骰子
      if (!player.player.isAI) {
        speed = await touchRef.value!.show()
      } else {
        await delay(1)
        speed = 0.8 * Math.random() + 0.2
      }

      enabled.value = false // 禁止切换地图.

      if (player.player.map !== store.gameState.activeMap) {
        // await toggleMap(player.player.map)
        store.gameState.activeMap = player.player.map
        await delay(2)
      }

      // 等待骰子转动结束
      cube2.hide()
      if (!isTravel) {
        await cube.show(store.physicsWorld!, speed, store.map0!)
      } else {
        await cube.show(store.physicsWorld!, speed, store.map1!, [5, 5, 5])
        await cube2.show(store.physicsWorld!, speed, store.map1!, [-5, -5, 5])
      }

      // 获取骰子点数
      let value = cube.getValue()

      if (isTravel) {
        value += cube2.getValue()
      }
      // just test
      // let value = 1

      // const value = 5
      // 显示骰子点数在屏幕上
      numberRef.value?.show(value)

      appendMessage(`前进${value}格`, player.player, false)

      let isChargeTravel = false
      // 用户在屏幕上行动
      player.beginRun()
      for (let i = 0; i < value; i++) {
        await player.goNext()

        if (!isTravel) {
          const address = store.getCurrentAddress(player)

          if (address.index === player.player.index) {
            // 奖励500元
            appendMessage('路过发薪日,奖励500元', player.player)
            changeMoney(player, 500)
            // 用户到达自己起点的逻辑(是否要去旅游)
            const goTravel = player.player.isAI ? chooseGoTravel(player.player) : await confirm(`是否前往旅游地图?`)

            if (goTravel) {
              isChargeTravel = true

              player.stopAnimate()
              appendMessage(`前往旅游地图`, player.player)

              store.gameState.activeMap = 1

              let startAddress: MapAddress
              if (player.player.isAI) {
                startAddress = chooseStartPoint(store.gameState)
              } else {
                startAddress = await travelMap.value!.chooseStartPoint()
              }
              store.gameState.activeMap = 1
              await player.changeMap(startAddress, 1)

              await delay(0.5)

              break
            }
          }
        }
      }
      // 隐藏骰子点数
      numberRef.value?.close()

      // 如果是旅游状态,可以向前走3步
      if (isTravel) {
        let step: number
        if (player.player.isAI) {
          step = getStep(player.player, travelMap.value!.getPointValue)
          if (step > 0) {
            appendMessage(`花费${step * 500}元,继续前进${step}格`, player.player)
            store.changeMoney(player.player.id, -step * 500)
          }
          await delay(0.5)
        } else {
          step = await stepRef.value!.show(player.player.id)
        }

        for (let i = 0; i < step; i++) {
          await player.goNext()
        }
      }

      if (!isChargeTravel) {
        player.stopAnimate()
        // 处理角色业务逻辑
        if (!isTravel) {
          await detailWorkEvent(player)
        } else {
          await detailTravelEvent(player)
        }
      }
      // 切换下一个玩家
      const needNext = store.toggleNextPlayer()

      if (needNext) {
        setItem('game-status', store.gameState)

        if (player.player.isAI) {
          await delay(2)
        }

        gameLoop()
      } else {
        removeItem('game-status')
        // 游戏结束
        await overRef.value!.show()

        emit('over')
      }
    }

    const render = () => {
      // console.log('render')
    }

    // {player:PersonType,map:0|1,index:number}
    const playerChangePosition = (data: any) => {
      const p = data.player as PersonType
      const index = data.index as number
      const player = players.find(t => t.player.id === p.id)
      const address = store.getAddressByIndex(index, 0)

      player?.changeAddress(address)
    }

    onBeforeUnmount(() => {
      bus.off(ACTION.RENDER, render)
      bus.off(ACTION.CHANGE_POSITION, playerChangePosition)
      bus.off(ACTION.ADD_LEVEL, addLevelByAddressIndex)
    })

    // 处理逻辑 机会/加熟练/其他用户加钱
    const detailWorkEvent = async (player: Player) => {
      const address = store.getCurrentAddress(player)
      if (address.type === PointType.WORK) {
        if (player.player.id === address.options.playerId) {
          // 如果是自己的地盘,加熟练度

          await addLevel(address)
        } else {
          // 当前地址所属玩家
          const workPlayer = getPlayerById(address.options.playerId)
          const level = address.options.level || 0
          const money = address.options.reward![level]
          // 如果对方玩家在打工地图,给对方玩家加钱
          if (workPlayer.isWork()) {
            appendMessage(`路过${address.options.name},${workPlayer.player.name}赚得金钱:${money}`, player.player)

            changeMoney(workPlayer, money)
          } else {
            // 给自己加钱
            appendMessage(`路过${address.options.name},对方未在打工状态,${player.player.name}赚得金钱:${money}`, player.player)

            changeMoney(player, money)
          }
        }
      } else if (address.type === PointType.REWARD) {
        // 机会

        await rewardRef.value?.show(player, address)
      }

      return true
    }

    // 处理旅游状态下的业务逻辑
    const detailTravelEvent = async (player: Player) => {
      const index = player.player.map1Index // 当前用户所在地址
      const hotCity = travelMap.value!.getPointValue(index)

      if (hotCity !== null) {
        appendMessage(`路过热门城市${hotCity.address.options.name},增加${hotCity.point}点积分`, player.player)

        await travelMap.value!.removeHotCity(hotCity)

        const isWin = store.addPoint(player.player.id, hotCity.point)

        if (isWin) {
          bus.emit(ACTION.WIN, player.player.id)
          player.playWin()

          await winRef.value!.show(player.player.id)
        }
      }

      return true
    }

    // 金额变化
    function changeMoney(player: Player, money: number) {
      // player.player.money += money
      const num = store!.changeMoney(player.player.id, money)
      player.player.money = num
    }

    const addLevelByAddressIndex = (data: any) => {
      const index = data.index as number
      const address = store?.getAddressByIndex(index, 0)

      return addLevel(address)
    }

    // 对打工地点增加熟练度
    async function addLevel(address: MapAddress) {
      let level = address.options.level || 0
      const player = players.find(t => t.player.id === address.options.playerId)
      if (level === 3) {
        showMessage(`${player!.player.name}的${address.options.name}已经达到最高等级`, 2000)

        return false
      } else {
        level += 1
        address.options.level = level
        // const cost = address.options.reward![level]
        appendMessage(`路过${address.options.name},熟练度增加:${level}级`, player!.player)
        // 增加星星动画
        await workMap.value?.addStar(address, level)
        // await delay(3)
        // level++
        // address.options.level = level
        // await workMap.value?.addStar(address, level)
        // await delay(3)
        // level++
        // address.options.level = level
        // await workMap.value?.addStar(address, level)
        return true
      }
    }

    function delay(num: number): Promise<void> {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve()
        }, num * 1000)
      })
    }

    const initMapStar = () => {
      store.gameState.workMapList.forEach(w => {
        if (w.type === PointType.WORK) {
          const level = w.options.level!

          if (level > 0) {
            workMap.value?.addStar(w, level)
          }

          // if (level > 0) {
          //   for (let i = 1; i <= level; i++) {
          //     workMap.value?.addStar(w, i)
          //   }
          // }
        }
      })
    }

    return {
      map1Init,
      map2Init,
      gameState: store?.gameState,
      // map1Finish,
      isFinish,
      workMap,
      travelMap,
      touchRef,
      numberRef,
      // textRef,
      stepRef,
      rewardRef,
      winRef,
      overRef,
      enabled,
    }
  },
})
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/image/bg-play.jpg');
  // background-size: 100% 100%;
  background-position: center center;
  background-size: cover;

  .btns {
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
