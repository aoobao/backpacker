<template>
  <div class="container">
    <GameMenu v-if="status === 0" @start-new="startNewGame" />
    <GameView v-if="status === 1" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import GameMenu from './GameMenu.vue'
import GameView from './GameView/index.vue'
export default defineComponent({
  components: { GameMenu, GameView },
  setup() {
    // 0 游戏菜单 1 游戏进行中 4 游戏结束
    const status = ref(0)

    const startNewGame = () => {
      // console.log('start')
      status.value = 1
    }

    return {
      status,
      startNewGame,
    }
  },
})
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
