<template>
  <div :class="{ 'md-overlay': show }">
    <!-- 
animate__animated 
      animate__swing
     -->
    <transition name="fade" enter-active-class="animate__animated animate__jackInTheBox" leave-active-class="animate__animated animate__bounceOut" @after-leave="afterLeave">
      <div v-if="visible" @click.stop="() => {}" :style="modalStyle" class="md-modal flex-col">
        <div class="md-header flex-row" v-if="title">
          {{ title }}
        </div>
        <div class="md-contents">
          <slot></slot>
        </div>
        <div class="md-back" @click="close" v-if="showClose"></div>
      </div>
    </transition>

    <div class="preload"></div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'
// const bgImage = require('./bg.jpg')
// 预先加载一下背景图
// const image = new Image()
// image.src = bgImage
// image.onload = () => {
//   console.log('image loaded')
// }

export default defineComponent({
  props: {
    width: {
      type: String,
      default: '85vw',
    },
    height: {
      type: String,
      default: '70vh',
    },
    visible: {
      type: Boolean,
      defalut: true,
    },
    title: {
      type: String,
      default: null,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    // const visible = ref(false)

    const close = () => {
      emit('close')
    }

    const show = ref(props.visible)
    watchEffect(() => {
      if (props.visible) {
        show.value = true
      }
    })

    const modalStyle = computed(() => {
      return {
        width: props.width,
        height: props.height,
        perspective: '1300px',
        // backgroundImage: `url(${bgImage})`,
      }
    })

    const afterLeave = () => {
      show.value = false

      emit('closed')
    }

    return {
      // visible,
      close,
      modalStyle,
      show,
      afterLeave,
    }
  },
})
</script>
<style lang="scss" scoped>
.preload {
  background-image: url('./bg.jpg');
  // position: absolute;
  // right: -5000px;
  // width: 10px;
  // height: 10px;
  // display: none;
  opacity: 0;
  pointer-events: none;
}
.md-modal {
  width: 50%;
  height: 50%;
  transform-origin: center center;

  background-image: url('./bg.jpg');
  background-size: 100% 100%;

  position: relative;

  .md-back {
    position: absolute;
    right: -1rem;
    top: -7rem;
    width: 8rem;
    height: 8rem;
    background-image: url('./back.png');
    background-size: 100% 100%;
  }
}

.md-overlay {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  // background-color: #555;
}

.md-header {
  justify-content: center;
  letter-spacing: 10px;
  margin-top: 8px;
  margin-bottom: 8px;
}
.md-contents {
  margin-top: 24px;
  flex-grow: 1;
}
</style>
