<template>
  <div class="ui pointer-none" v-if="gameState">
    <div class="player-status">
      <div class="title" v-if="currentPlayer">{{ currentPlayer.name }}进行中...</div>
      <div class="player-item flex-row" :class="{ active: gameState.currentPlayerId === player.id }" v-for="player in gameState.players" :key="player.id" :style="getStyle(player)">
        <!-- <div class="active-status" v-if="gameState.currentPlayerId === player.id">→</div> -->
        <span class="name text">姓名: {{ player.name }}</span>
        <span class="text"
          >金币:
          <CountUp class="led number" :num="player.money" />
        </span>

        <span class="text">
          积分:
          <CountUp class="led number" :num="player.points" />
        </span>
        <span class="text">状态: {{ statusText(player) }}</span>

        <!-- <span v-if="gameState.currentPlayerId === player.id" class="active-text">玩家进行中</span> -->
      </div>
    </div>

    <div class="text-message-box pointer" ref="message">
      <div class="scroll" ref="scroll">
        <div class="message" v-for="(message, index) in messageList" :key="index">
          {{ message }}
        </div>
      </div>
    </div>

    <div class="toggle pointer">
      <div class="work card" v-if="gameState.activeMap === 0" @click="changeActiveMap(1)"></div>
      <div class="travel card" v-if="gameState.activeMap === 1" @click="changeActiveMap(0)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, ref } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { PersonType } from '@/assets/types'
import CountUp from '@/components/CountUp.vue'
import { showMessage } from '@/assets'
import { bus, ACTION } from '@/assets/bus'

export default defineComponent({
  components: { CountUp },
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    const message = ref<HTMLElement>()
    const scroll = ref<HTMLElement>()
    let tick = 0
    const step = 10

    const messageList = ref<Array<string>>([])

    const gameState = store.gameState

    const getStyle = (player: PersonType) => {
      return {
        color: player.color,
      }
    }

    const scrollTopValue = () => {
      const messageHeight = message.value!.offsetHeight
      const scrollHeight = scroll.value!.offsetHeight
      const top = scrollHeight - messageHeight + 10

      return Math.max(top, 0)
    }

    const stepScrollTop = (val: number) => {
      let value = message.value!.scrollTop + step
      if (value > val) value = val
      message.value!.scrollTop = value

      if (value < val) {
        tick = setTimeout(() => {
          stepScrollTop(val)
        }, 1000 / 60)
      }
    }

    const scrollToBottom = () => {
      nextTick(() => {
        const value = scrollTopValue()

        if (value > 0) {
          if (tick) {
            clearTimeout(tick)
            tick = 0
          }

          stepScrollTop(value)

          // message.value!.scrollTop = value
        }
      })
    }

    const appendText = (data: any) => {
      const message = data.message as string
      const player = data.player as PersonType

      const text = `[${player.name}] ${message}`

      messageList.value.push(text)

      scrollToBottom()
    }

    const statusText = (player: PersonType) => {
      // return map === 0 ? '打工' : '旅游'
      if (player.win) {
        return `第${player.win}名`
      }

      return player.map === 0 ? '打工' : '旅游'
    }

    const currentPlayer = computed(() => {
      const currentId = store.gameState.currentPlayerId
      if (!currentId) return null
      const player = store.gameState.players.find(t => t.id === currentId)
      return player || null
    })

    const changeActiveMap = (val: 0 | 1) => {
      if (!props.enabled) {
        showMessage('当前阶段不能切换地图哦')
      } else {
        store.gameState.activeMap = val
      }
    }

    bus.on(ACTION.APPEND_MESSAGE, appendText)

    onBeforeUnmount(() => {
      bus.off(ACTION.APPEND_MESSAGE, appendText)

      if (tick) {
        clearTimeout(tick)
        tick = 0
      }
    })

    return {
      gameState,
      currentPlayer,
      getStyle,
      statusText,
      changeActiveMap,
      message,
      scroll,
      messageList,
    }
  },
})
</script>
<style lang="scss" scoped>
.ui {
  width: 100%;
  height: 100%;
  // position: relative;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  color: #000;
  font-size: 14px;

  .title {
    margin-top: 10px;
    margin-left: 10px;
    font-size: 18px;
    text-align: left;
  }

  .player-status {
    position: absolute;
    left: 0;
    top: 0;
    .player-item {
      margin-left: 4px;
      // padding-left: 16px;
      align-items: center;
      height: 30px;
      position: relative;
      &.active {
        font-size: 16px;
        border-bottom: 1px solid #f08300;
      }

      .text {
        margin-left: 4px;
        font-size: 12px;
      }

      .active-status {
        position: absolute;
        left: 5px;
        font-size: 18px;
        animation: move 1s infinite;
      }
    }
  }

  .text-message-box {
    width: 30%;
    height: 30%;
    position: absolute;
    bottom: 0;
    left: 0;
    background-color: rgba($color: #777, $alpha: 0.5);
    border-top-right-radius: 4px;
    overflow: auto;
    padding-bottom: 4px;
    .scroll {
      margin-left: 4px;
    }
    .message {
      text-align: left;
      color: #fff;
      font-size: 12px;
      // margin-left: 4px;
      margin-top: 4px;
      line-height: 16px;
    }
  }

  .toggle {
    position: absolute;
    right: 10px;
    top: 10px;
    // transform-style: preserve-3d;
    // perspective: 800px;
    // $unit: 50px;
    // width: 15px;
    // height: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    .card {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-size: 100% 100%;
      // animation: rotation 3s infinite linear;
    }
    .work {
      background-image: url('~@/assets/image/work.png');
    }

    .travel {
      background-image: url('~@/assets/image/travel.png');
    }
  }

  .number {
    font-size: 18px;
  }
}

@keyframes rotation {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes move {
  0% {
    transform: translate(0);
  }

  100% {
    transform: translate(15px);
  }
}
</style>
