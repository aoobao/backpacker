<template>
  <div class="reward-wrap">
    <WinView ref="winRef" />
  </div>
</template>
<script lang="ts">
import { showMessage } from '@/assets'
import Player from '@/assets/object/Player'
import { MapAddress } from '@/assets/types'
import { defineComponent, ref } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { bus, ACTION } from '@/assets/bus'
import WinView from '@/components/WinView/index.vue'
export default defineComponent({
  components: { WinView },
  setup() {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')

    const winRef = ref<InstanceType<typeof WinView>>()

    const show = async (player: Player, address: MapAddress) => {
      const index = address.options.rewardIndex!

      switch (index) {
        case 0:
          // 得到1分
          return addPoints(player, 1)
        case 1:
          // 选择一个人交换位置
          break
        case 2:
          // 向所有人收取200元
          break
        case 3:
          // 在你的2张打工卡上各放1个经验标记
          break

        default:
          throw new Error('错误机会rewardIndex:' + index)
      }

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
    }
  },
})
</script>
<style lang="scss" scoped></style>
