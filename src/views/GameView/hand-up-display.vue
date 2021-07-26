<template>
  <div class="ui pointer-none" v-if="gameState">
    <div class="player-status">
      <div class="title">玩家信息</div>
      <div class="player-item flex-row" :class="{ active: gameState.currentPlayerId === player.id }" v-for="player in gameState.players" :key="player.id" :style="getStyle(player)">
        <div class="active-status" v-if="gameState.currentPlayerId === player.id">→</div>
        <span class="name">姓名: {{ player.name }}</span>
        <span class="money"
          >金币:
          <!-- <span class="led number">{{ player.money }}</span> -->
          <CountUp class="led number" :num="player.money" />
        </span>

        <span class="money">
          积分:
          <!-- <span class="led number">{{ player.points }}</span> -->
          <CountUp class="led number" :num="player.points" />
        </span>
        <span class="status">状态: {{ statusText(player.map) }}</span>

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

    const statusText = (map: 0 | 1) => {
      return map === 0 ? '打工' : '旅游'
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
  font-size: 1.8rem;

  .title {
    margin-top: 10px;
    margin-left: 10px;
    font-size: 2.2rem;
    text-align: left;
  }

  .player-status {
    position: absolute;
    left: 0;
    top: 0;
    .player-item {
      padding-left: 65px;
      align-items: center;
      height: 3rem;
      position: relative;
      &.active {
        font-size: 2.2rem;
      }

      .money {
        margin-left: 10px;
      }
      .status {
        margin-left: 10px;
      }

      .active-status {
        position: absolute;
        left: 5px;
        font-size: 2.5rem;
        animation: move 1s infinite;
      }
    }
  }

  .number {
    font-size: 2.5rem;
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
