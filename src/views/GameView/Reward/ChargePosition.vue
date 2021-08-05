<template>
  <transition name="fade" enter-active-class="animate__animated animate__jackInTheBox" leave-active-class="animate__animated animate__bounceOut" @after-leave="afterLeave">
    <div class="charge-position-wrap flex-col" v-if="visible">
      <!-- <div class="bg"></div> -->
      <div class="title">请选择一个玩家交换位置</div>
      <div class="body flex-row">
        <div v-for="player in selectPlayers" :key="player.id" class="card flex-col" @click="clickHandle(player)">
          <div class="item">
            <span class="name"> 姓名: </span>
            <span class="value">
              {{ player.name }}
            </span>
          </div>
          <div class="item">
            <span class="name">状态: </span>
            <span class="value">
              {{ statusText(player) }}
            </span>
          </div>
        </div>
      </div>
      <div class="btns">
        <!-- <Button type="info" size="large" @click="cancelSelect">我很好,不要换位置</Button> -->
        <span class="btn" @click="cancelSelect">我很好,不想换位置</span>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { PersonType } from '@/assets/types'
import { confirm, showMessage } from '@/assets/index'

export default defineComponent({
  // components: { Button },
  setup() {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    let selectPlayerId = 0

    const visible = ref(false)
    const currentPlayerId = ref(1) // 当前行动的玩家id
    let resolveFun: (playerId: number) => void

    const selectPlayers = computed(() => {
      const players = store.gameState.players.filter(t => {
        return t.id !== currentPlayerId.value
      })

      return players
    })

    const show = (playerId: number) => {
      selectPlayerId = 0 // 重置当前需要更换的玩家id
      currentPlayerId.value = playerId // 更新当前行动玩家id
      visible.value = true
      return new Promise<number>(resolve => {
        resolveFun = resolve
      })
    }

    const clickHandle = async (player: PersonType) => {
      // resolveFun(playerId)
      if (player.win) {
        showMessage(`玩家${player.name}已经胜利,不可更换位置`)
        return false
      }

      if (player.map === 1) {
        showMessage(`玩家${player.name}正在旅游中,不可更换位置`)
        return false
      }

      const isok = await confirm(`确认和${player.name}互换位置吗?`)

      if (isok) {
        selectPlayerId = player.id
        visible.value = false
      }

      return true
    }

    const cancelSelect = () => {
      selectPlayerId = 0
      visible.value = false
      // resolveFun(0)
    }

    const afterLeave = () => {
      resolveFun && resolveFun(selectPlayerId)
    }

    const statusText = (player: PersonType) => {
      if (player.win) {
        return `第${player.win}名`
      } else if (player.map === 1) {
        return '旅游'
      } else {
        return '打工'
      }
    }

    return {
      visible,
      show,
      clickHandle,
      cancelSelect,
      afterLeave,
      selectPlayers,
      statusText,
    }
  },
})
</script>
<style lang="scss" scoped>
.charge-position-wrap {
  // width: 50vw;
  // height: 30rem;
  width: 350px;

  // padding-top: 3rem;
  // padding-bottom: 3rem;
  padding-top: 16px;
  padding-bottom: 16px;
  position: absolute;
  top: 25vh;
  left: 50%;
  margin-left: -175px;
  // left: 25vw;
  // top: 20vh;
  background-image: url('~@/components/Modal/bg.jpg');
  background-size: 100% 100%;
  opacity: 0.9;
  font-size: 12px;
  .title {
    font-size: 18px;
  }

  // .bg {
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   top: 0;
  //   bottom: 0;
  // }

  .body {
    // margin-top: 2rem;
    margin-top: 16px;
    justify-content: space-around;
    font-size: 12px;

    .card {
      // padding: 20px 30px;
      align-items: flex-start;
      // padding-left: 20px;
      // padding-top: 8px;
      // padding-bottom: 8px;
      // width: 25%;
      width: 100px;
      height: 50px;
      border: 1px solid #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      span {
        font-size: 12px;
        margin-left: 5px;
        margin-top: 5px;
        margin-bottom: 5px;
      }
    }
  }
  .btns {
    margin-top: 24px;
  }
  .btn {
    // background-color: #1989fa;
    // padding: 0.5rem 1rem;

    font-size: 24px;
    // color: red;
  }
}
</style>
