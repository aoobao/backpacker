<template>
  <WinView ref="winRef" />
  <ChargePosition ref="chargeRef" />
  <AddLevel :count="2" ref="levelRef" />
</template>
<script lang="ts">
import { showMessage, delay, randBetween } from '@/assets'
import Player from '@/assets/object/Player'
import { MapAddress } from '@/assets/types'
import { defineComponent, ref } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { bus, ACTION } from '@/assets/bus'
import WinView from '@/components/WinView/index.vue'
import ChargePosition from '@/views/GameView/Reward/ChargePosition.vue'
import AddLevel from './AddLevel.vue'
export default defineComponent({
  components: { WinView, ChargePosition, AddLevel },
  setup() {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')

    const winRef = ref<InstanceType<typeof WinView>>()
    const chargeRef = ref<InstanceType<typeof ChargePosition>>()
    const levelRef = ref<InstanceType<typeof AddLevel>>()

    const show = async (player: Player, address: MapAddress) => {
      const index = address.options.rewardIndex!

      switch (index) {
        case 0:
          // 得到1分
          return addPoints(player, 1)
        case 1:
          // 选择一个人交换位置
          // chargeRef.value?.show(player.player.id)
          return changePosition(player)
        case 2:
          // 向所有人收取200元
          return chargeMoney(player, 200)
        case 3:
          // 在你的2张打工卡上各放1个经验标记
          // break
          return addLevels(player)

        default:
          throw new Error('错误机会rewardIndex:' + index)
      }
    }

    const addLevels = async (player: Player) => {
      const addressList = store.gameState.workMapList.filter(t => t.options.playerId === player.player.id)
      if (addressList.some(t => t.options.level! < 3)) {
        if (player.player.isAI) {
          const ids = []
          for (let i = 0; i < addressList.length; i++) {
            const address = addressList[i]
            if (address.options.level! < 3) {
              ids.push(address.index)

              if (ids.length === 2) {
                break
              }
            }
          }
          if (ids.length) {
            ids.forEach(index => {
              bus.emit(ACTION.ADD_LEVEL, { index })
            })

            await delay(2)
          }
        } else {
          const addressIds = await levelRef.value!.show(player.player.id)
          // console.log(addressIds)
          addressIds.forEach(index => {
            bus.emit(ACTION.ADD_LEVEL, { index })
          })

          await delay(2)
        }

        return true
      } else {
        showMessage(`玩家${player.player.name}所有技能已达到顶级水准,无法再提升了`)

        return false
      }
    }

    const changePosition = async (player: Player) => {
      const change = (otherPlayerId: number) => {
        const otherPlayer = store.findByPlayerId(otherPlayerId)
        showMessage(`玩家${player.player.name}选择和${otherPlayer.name}交换位置`)

        const currentIndex = player.player.map0Index
        const targetIndex = otherPlayer.map0Index

        bus.emit(ACTION.CHANGE_POSITION, {
          player: player.player,
          map: 0,
          index: targetIndex,
        })

        bus.emit(ACTION.CHANGE_POSITION, {
          player: otherPlayer,
          map: 0,
          index: currentIndex,
        })
      }

      if (player.player.isAI) {
        // 自动交换位置
        // 随便取某个玩家,如果符合条件就换,不符合就不交换
        const index = randBetween(0, store.gameState.players.length - 1)
        const targetPlayer = store.gameState.players[index]

        if (targetPlayer.id !== player.player.id) {
          if (!targetPlayer.win && targetPlayer.map === 0) {
            change(targetPlayer.id)

            await delay(2)

            return true
          }
        }

        showMessage(`玩家${player.player.name}不打算交换位置`)
        return false
      } else {
        const changeId = await chargeRef.value!.show(player.player.id)
        if (changeId === 0) {
          showMessage(`玩家${player.player.name}不打算交换位置`)

          return false
        } else {
          change(changeId)

          await delay(2)

          return true
        }
      }
    }

    const chargeMoney = async (player: Player, num: number) => {
      showMessage(`${player.player.name}向每个人收取200元钱`)
      let sum = 0
      store.gameState.players.forEach(p => {
        if (p.id === player.player.id) return
        if (p.win) return
        // 扣去200元
        p.money -= 200
        sum += 200
      })
      const p = store.findByPlayerId(player.player.id)
      p.money += sum

      return true
    }

    const addPoints = async (player: Player, num: number) => {
      showMessage(`${player.player.name}获得奖励:得到1点积分点`)
      const isWin = store.addPoint(player.player.id, num)

      if (isWin) {
        bus.emit(ACTION.WIN, player.player.id)
        player.playWin()
        await winRef.value?.show(player.player.id)
      }
      // console.log(player.player)

      return true
    }
    return {
      show,
      winRef,
      chargeRef,
      levelRef,
    }
  },
})
</script>
<style lang="scss" scoped></style>
