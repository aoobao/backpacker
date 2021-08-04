<template>
  <div class="ui pointer-none" v-if="gameState">
    <div class="player-status">
      <div class="title">玩家信息</div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { PersonType } from '@/assets/types'
import CountUp from '@/components/CountUp.vue'

export default defineComponent({
  components: { CountUp },
  setup() {
    const store = useInjector(GameStateStore)
    const gameState = store?.gameState

    const getStyle = (player: PersonType) => {
      return {
        color: player.color,
      }
    }

    const statusText = (player: PersonType) => {
      // return map === 0 ? '打工' : '旅游'
      if (player.win) {
        return `第${player.win}名`
      }

      return player.map === 0 ? '打工' : '旅游'
    }

    return {
      gameState,
      getStyle,
      statusText,
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

  .number {
    font-size: 18px;
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
