<template>
  <transition name="fade">
    <div class="touch-wrap flex-row pointer-none" v-if="visible">
      <div class="explain flex-col pointer" @click.stop="clickHandle">
        <div class="icon"></div>
        <div class="text">点击<br />摇骰子</div>
      </div>
      <div class="bar" :style="{ height: maxHeight * nowHeightPercent + 'px' }">
        <div class="bg-bar" :style="{ height: maxHeight + 'px' }"></div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, ref } from 'vue'
import { bus, ACTION } from '@/assets/bus'
export default defineComponent({
  setup() {
    const visible = ref(false)
    let isWaiting = false
    let toResolve: (speed: number) => void

    // 最高高度500
    const maxHeight = ref(300)
    const minHeightPercent = 0.2
    let isUp = true // 是否增加值.
    const nowHeightPercent = ref(minHeightPercent)
    const step = 0.05
    const render = () => {
      if (isWaiting) {
        if (isUp) {
          let value = (nowHeightPercent.value += step)
          if (value >= 1) {
            isUp = false
            value = 1
          }
          nowHeightPercent.value = value
        } else {
          let value = (nowHeightPercent.value -= step)
          if (value <= minHeightPercent) {
            isUp = true
            value = minHeightPercent
          }
          nowHeightPercent.value = value
        }
      }
    }

    const show = () => {
      return new Promise<number>(resolve => {
        visible.value = true
        isWaiting = true
        toResolve = resolve
      })
    }

    const clickHandle = () => {
      isWaiting = false
      setTimeout(() => {
        toResolve(nowHeightPercent.value)
        visible.value = false
      }, 300)
    }

    bus.on(ACTION.RENDER, render)

    onBeforeUnmount(() => {
      bus.off(ACTION.RENDER, render)
    })
    return {
      visible,
      show,
      clickHandle,
      maxHeight,
      nowHeightPercent,
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
  transition-delay: 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.touch-wrap {
  z-index: 1000;
  position: fixed;
  right: 0;
  bottom: 20px;
  width: 100px;
  font-size: 16px;
  // height: 40%;

  // align-items: center;
  align-items: flex-end;
  justify-content: center;
  .explain {
    width: 50%;
    // height: 100%;
    justify-content: flex-end;
    .text {
      color: red;
      text-shadow: orange 2px 2px 2px, orange -2px -2px 2px;
    }
    .icon {
      width: 40px;
      height: 40px;
      background-image: url('./touch.gif');
      background-size: 100% 100%;
    }
  }
  .bar {
    width: 15px;
    // height: 500px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    overflow: hidden;
    position: relative;
    .bg-bar {
      position: absolute;
      bottom: 0;
      width: 100%;
      // height: 500px;
      background: linear-gradient(to bottom, red, orange, green);
    }
  }
}
</style>
