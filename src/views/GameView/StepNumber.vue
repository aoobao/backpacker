<template>
  <Modal :visible="visible" width="250px" height="300px" :showClose="false" :mask="false">
    <div class="wrap flex-col">
      <span class="title">选择前进步数</span>
      <div class="body flex-row pointer">
        <div class="card flex-col" @click="selectStep(1)">
          <div class="icon"></div>
          <span class="text"> 花费500元,前进1步 </span>
        </div>
        <div class="card flex-col pointer" @click="selectStep(2)">
          <div class="icon"></div>
          <span class="text"> 花费1000元,前进2步 </span>
        </div>
        <div class="card flex-col pointer" @click="selectStep(3)">
          <div class="icon"></div>
          <span class="text"> 花费1500元,前进3步 </span>
        </div>
        <div class="card flex-col pointer" @click="selectStep(0)">
          <div class="icon"></div>
          <span class="text"> 这里很好,就呆在原地</span>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Modal from '@/components/Modal/Modal.vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { showMessage, appendMessage } from '@/assets'
export default defineComponent({
  components: { Modal },
  setup() {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    const visible = ref(false)
    const currentPlayerId = ref(1) // 当前用户

    const playerStatus = computed(() => {
      const p = store.gameState.players.find(t => t.id === currentPlayerId.value)

      return p!
    })

    let resolveFun: (val: number) => void
    const show = (playerId: number) => {
      currentPlayerId.value = playerId

      visible.value = true

      return new Promise<number>(resolve => {
        resolveFun = resolve
      })
    }

    const selectStep = (val: number) => {
      const cost = val * 500 // 每步500元
      if (playerStatus.value.money < cost) {
        showMessage('金币看起来不够喽,请重新选择')
      } else {
        if (val > 0) {
          store.changeMoney(currentPlayerId.value, -cost)
          appendMessage(`花费${cost}金币,继续前进${val}格`, playerStatus.value)
        }
        visible.value = false
        resolveFun(val)
      }
    }

    return {
      visible,
      show,
      selectStep,
    }
  },
})
</script>
<style lang="scss" scoped>
.wrap {
  font-size: 14px;
  .body {
    margin: 8px auto 0;

    justify-content: space-around;
    align-items: center;

    flex-wrap: wrap;

    .card {
      width: 40%;
      height: 100px;
      border: 1px solid #fff;
      font-size: 18px;
      margin-top: 16px;

      align-items: center;
      .icon {
        margin-top: 16px;
        width: 40px;
        height: 40px;
        // background-color: red;
        background-image: url('~@/assets/image/icon/temp.jpg');
        background-size: 100% 100%;
      }
      .text {
        margin-top: 16px;
        font-size: 14px;
      }
    }
  }
}
</style>
