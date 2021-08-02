<template>
  <div class="container">
    <div class="btns flex-col" v-if="loadingPercent === 1">
      <div class="start" @click="start">新的旅程</div>
      <div class="history">继续征途</div>
    </div>
    <div class="loading-ui">
      <div class="text flex-row">
        <span>{{ loadingPercent === 1 ? '加载完成' : '资源加载中...' }}</span>
        <span>by aoobao</span>
      </div>
      <div class="load" :style="{ width: loadingPercent * 100 + '%' }"></div>
    </div>
    <UserCard @start="startGame" ref="startRef" />
  </div>
</template>

<script lang="ts">
import UserCard from '@/components/UserCard.vue'
import { EmitsOptions, ref, SetupContext } from 'vue'
import { PersonType } from '@/assets/types'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { preLoadAllFile } from '@/assets/preload'
import { Dialog } from 'vant'
export default {
  name: 'GameMenu',
  components: { UserCard },
  setup(props: unknown, ctx: SetupContext<EmitsOptions>) {
    const store = useInjector(GameStateStore)
    // let userList = ref<Array<PersonType>>()
    const startGame = (players: Array<PersonType>) => {
      store?.resetGameState(players)
      ctx.emit('start-new', players)
    }

    const startRef = ref<InstanceType<typeof UserCard>>()
    const start = () => {
      // console.log(startRef.value)
      startRef.value?.show()
    }

    const loadingPercent = ref(0)

    const onprogress = (total: number, finishCount: number) => {
      loadingPercent.value = finishCount / total
    }

    preLoadAllFile(onprogress)
      .then(() => {
        loadingPercent.value = 1
      })
      .catch(err => {
        Dialog.alert({
          title: '错误',
          message: err.message || '加载错误',
        })
      })

    return {
      startGame,
      start,
      startRef,
      loadingPercent,
    }
  },
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  // background-color: red;
  background: url('~@/assets/image/bg.jpg') center center no-repeat;
  background-size: cover;
  $text-shadow: orange 0.3vw 0.3vw 0.5vw, orange -0.3vw -0.3vw 0.5vw;
  .btns {
    position: absolute;
    width: 100%;
    bottom: 15rem;
    justify-content: center;
    color: #fff;
    // font-size: 12rem;
    .start {
      font-size: 14.93333vw;
      text-shadow: $text-shadow;
      letter-spacing: 2.66667vw;
      // color: orange;
    }

    .history {
      margin-top: 3rem;
      font-size: 9.6vw;
      text-shadow: $text-shadow;
    }
  }

  .loading-ui {
    position: absolute;
    bottom: 30px;
    left: 40px;
    right: 40px;
    height: 15px;
    border-radius: 4px;
    background-color: #fff;
    display: flex;
    align-items: center;
    .text {
      font-size: 20px;
      color: #fff;
      position: absolute;
      left: 0;
      top: -40px;
      right: 0;
      justify-content: space-between;
    }
    .load {
      height: 11px;
      background-color: #ffb11a;
      border-radius: 4px;
      transition: width 0.5s;
    }
  }
}
</style>
