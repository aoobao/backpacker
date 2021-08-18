<template>
  <Modal :visible="visible" :mask="false" height="300px" :showClose="false">
    <div class="wrap flex-col">
      <span class="title">游戏结束</span>
      <table class="girdtable">
        <thead>
          <tr>
            <th>序号</th>
            <th>玩家</th>
            <th>积分</th>
            <th>名次</th>
          </tr>
        </thead>
        <tr v-for="(p, index) in players" :key="p.id">
          <td>{{ index + 1 }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.points }}</td>
          <td>{{ p.win > 0 ? `第${p.win}名` : '未完成' }}</td>
        </tr>
      </table>
      <div class="btns">
        <span class="btn pointer" @click="close">回到菜单</span>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Modal from '@/components/Modal/Modal.vue'

import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
export default defineComponent({
  components: { Modal },
  setup() {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    const visible = ref(false)
    let resolveFun: () => void
    const show = (): Promise<void> => {
      visible.value = true
      return new Promise(resolve => {
        resolveFun = resolve
      })
    }

    const close = () => {
      visible.value = false
      resolveFun()
    }

    const players = computed(() => {
      const list = [...store.gameState.players]

      list.sort((a, b) => {
        const winA = a.win || 99
        const winB = b.win || 99

        const z = winA - winB

        if (z !== 0) return z

        return b.points - a.points
      })

      return list
    })

    return {
      visible,
      show,
      close,
      players,
    }
  },
})
</script>
<style lang="scss" scoped>
.wrap {
  font-size: 14px;

  .title {
    font-size: 22px;
  }

  .btn {
    font-size: 18px;
  }
}
.girdtable {
  border-collapse: collapse;
  margin: 24px auto;
  text-align: center;
  font-size: 14px;
  color: #fff;
  td,
  th {
    // border: 1px solid #cad9ea;
    height: 30px;
  }

  thead th {
    // background-color: rgba($color: #cce8eb, $alpha: 0.3);
    width: 100px;
  }
  // tr:nth-child(odd) {
  //   // background: rgba($color: #fff, $alpha: 0.3);
  // }
  // tr:nth-child(even) {
  //   // background: #f5fafa;
  //   // background: rgba($color: #f5fafa, $alpha: 0.3);
  // }
}
</style>
