<script lang="ts">
import { defineComponent } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { Dialog } from 'vant'
import { delay, showMessage } from '@/assets'
export default defineComponent({
  setup() {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    const show = (playerId: number) => {
      const player = store.gameState.players.find(t => t.id === playerId)
      return new Promise(resolve => {
        if (!player) throw new Error('未找到对应玩家')

        if (player.isAI) {
          showMessage(`${player.name}获得了胜利`)
          delay(1).then(() => {
            resolve(true)
          })
        } else {
          Dialog.alert({
            title: '恭喜你',
            message: `玩家${player.name}获得了胜利!`,
          }).then(() => {
            resolve(true)
          })
        }
      })
    }
    return {
      show,
    }
  },
  render() {
    return null
  },
})
</script>
