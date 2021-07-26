<template>
  <router-view />
</template>
<script lang="ts">
import { useProviders } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import { defineComponent, onUnmounted } from 'vue'

export default defineComponent({
  setup() {
    useProviders(GameStateStore)
  },
})
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: FangSong NSimSun SimSun;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff;
  font-size: 3rem;
}
</style>
