<template>
  <transition name="fade">
    <div class="text-wrap pointer-none" v-if="visible">
      {{ text }}
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const visible = ref(false)
    const text = ref('欢迎进入大富翁游戏')
    let tick = 0

    const close = () => {
      tick = 0
      visible.value = false
    }

    const show = (val: string, closeDelay = 0) => {
      if (tick) {
        clearTimeout(tick)
        tick = 0
      }
      text.value = val
      visible.value = true

      if (closeDelay > 0) {
        tick = setTimeout(close, closeDelay)
      }
    }

    return {
      visible,
      text,
      show,
      close,
    }
  },
})
</script>
<style lang="scss" scoped>
.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-leave-active {
  transition: opacity 1s linear;
  // transition-delay: 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.text-wrap {
  z-index: 1002;
  position: fixed;
  top: 20vh;
  font-size: 10vw;
  text-shadow: orange 0.3vw 0.3vw 0.5vw, orange -0.3vw -0.3vw 0.5vw;
  width: 100%;
  text-align: center;
}
</style>
