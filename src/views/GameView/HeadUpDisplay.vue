<template>
  <div class="ui pointer-none" v-if="gameState">
    <div class="player-status" :class="{ 'show-more': showMore }">
      <table class="gridtable">
        <thead>
          <tr>
            <th>姓名</th>
            <th>金币</th>
            <th>积分</th>
            <th>状态</th>
          </tr>
        </thead>
        <tr :class="{ active: gameState.currentPlayerId === player.id }" v-for="player in gameState.players" :key="player.id">
          <td>{{ player.name }}</td>
          <td><CountUp class="led number" :num="player.money" /></td>
          <td style="width: 40px"><CountUp class="led number" :num="player.points" /></td>
          <td class="pointer" style="width: 60px" @click="testAdd(player)">{{ statusText(player) }}</td>
        </tr>
      </table>
      <div class="text-message-box pointer" ref="message">
        <div class="scroll" ref="scroll">
          <div class="message" v-for="(message, index) in messageList" :key="index">
            {{ message }}
          </div>
        </div>
      </div>
      <div class="show-arrow pointer" @click="toggleShowMore">
        {{ showMore ? '收缩' : '展开' }}
      </div>
    </div>

    <div class="toggle pointer">
      <div class="work card" v-if="gameState.activeMap === 0" @click="changeActiveMap(1)">切换到旅游地图</div>
      <div class="travel card" v-if="gameState.activeMap === 1" @click="changeActiveMap(0)">切换到打工地图</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, ref } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { PersonType } from '@/assets/types'
import CountUp from '@/components/CountUp.vue'
import { appendMessage, showMessage } from '@/assets'
import { bus, ACTION } from '@/assets/bus'
import Player from '@/assets/object/Player'

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

    const showMore = ref(false)

    const toggleShowMore = () => {
      showMore.value = !showMore.value
      setTimeout(() => {
        scrollToBottom()
      }, 300)
    }
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

    // 连续点状态5次,增加金币1W
    let testPlayerId: number
    let testClickCount = 0
    let addMoneyTick = 0
    const addMoney = () => {
      if (testClickCount !== 5) {
        testPlayerId = 0
        testClickCount = 0
        return
      }
      store!.changeMoney(testPlayerId, 10000)
      const p = gameState.players.find(t => t.id === testPlayerId)!
      appendMessage(`玩家使用金手指,增加${p.name}金币10000`, p)
    }

    const testAdd = (p: PersonType) => {
      if (testPlayerId !== p.id) {
        testPlayerId = p.id
        testClickCount = 0
      }
      testClickCount++

      if (addMoneyTick) {
        clearTimeout(addMoneyTick)
        addMoneyTick = 0
      }

      addMoneyTick = setTimeout(addMoney, 300)
    }

    return {
      gameState,
      currentPlayer,
      getStyle,
      statusText,
      changeActiveMap,
      message,
      scroll,
      messageList,
      showMore,
      toggleShowMore,
      testAdd,
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
    width: 400px;
    padding-bottom: 8px;
    // min-height: 200px;
    background-color: rgba($color: #777, $alpha: 0.5);
    border-bottom-right-radius: 4px;
    color: #fff;
    .gridtable {
      $borderColor: #fff;
      width: 100%;
      border-collapse: collapse;
      border: 1px solid $borderColor;
      th {
        border-width: 1px;
        padding: 3px;
        border-style: solid;
        border-color: $borderColor;
      }
      td {
        border-width: 1px;
        padding: 3px;
        border-style: solid;
        border-color: $borderColor;
      }

      .active {
        td {
          color: #f08300;
          background-color: paleturquoise;
        }
      }
    }

    .text-message-box {
      // width: 30%;
      width: 100%;
      height: 50px;
      // border-top-right-radius: 4px;
      overflow: auto;
      padding-bottom: 4px;

      transition: height 0.3s linear;
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
    &.show-more {
      .text-message-box {
        height: 300px;
      }
    }
  }

  @media (max-width: 500px) {
    .player-status {
      width: 70%;
    }
  }

  .toggle {
    position: absolute;
    left: 10px;
    bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    .card {
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      // width: 50px;
      // height: 50px;
      // border-radius: 50%;
      // background-size: 100% 100%;
    }
    // .work {
    //   background-image: url('~@/assets/image/work.png');
    // }

    // .travel {
    //   background-image: url('~@/assets/image/travel.png');
    // }
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
