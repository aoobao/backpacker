<template>
  <transition name="fade">
    <div class="number-wrap pointer-none" v-if="visible">
      {{ num }}
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const visible = ref(false)
    const num = ref(1)
    let tick = 0

    const close = () => {
      tick = 0
      visible.value = false
    }

    const show = (val: number, closeDelay = 8000) => {
      if (tick) {
        clearTimeout(tick)
        tick = 0
      }
      num.value = val
      visible.value = true

      tick = setTimeout(close, closeDelay)
    }

    return {
      visible,
      num,
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
  transition: opacity 1.5s linear;
  // transition-delay: 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.number-wrap {
  z-index: 1001;
  position: fixed;
  top: 40vh;
  font-size: 24vw;
  text-shadow: orange 0.3vw 0.3vw 0.5vw, orange -0.3vw -0.3vw 0.5vw;
  width: 100%;
  text-align: center;
}
</style>
