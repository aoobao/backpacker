<template>
  <span>{{ showValue(realValue) }}</span>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    num: {
      type: Number,
      default: 0,
    },
    formatFun: {
      type: Function,
      default: (val: number) => {
        return Math.round(val)
      },
    },
    localDuration: {
      type: Number,
      default: 3000,
    },
    easingFun: {
      type: Function,
      default: (t: number, b: number, c: number, d: number) => {
        return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
      },
    },
  },
  setup(props) {
    let localStartVal = 0
    const realValue = ref(0)
    let startTime = 0
    let rAf = 0

    const countDown = computed(() => {
      return props.num < realValue.value
    })

    const start = () => {
      if (rAf) {
        window.cancelAnimationFrame(rAf)
        rAf = 0
      }
      localStartVal = realValue.value
      startTime = 0
      rAf = window.requestAnimationFrame(count)
    }

    const showValue = (num: Number) => {
      return props.formatFun(num)
    }

    watch(
      () => props.num,
      (newVal, oldval) => {
        if (newVal !== oldval) {
          start()
        }
      },
    )

    const count = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      // remaining = props.localDuration - progress
      let num = 0
      if (countDown.value) {
        num = localStartVal - props.easingFun(progress, 0, localStartVal - props.num, props.localDuration)
        if (num < props.num) num = props.num
      } else {
        num = props.easingFun(progress, localStartVal, props.num - localStartVal, props.localDuration)
        if (num > props.num) num = props.num
      }

      realValue.value = num
      if (props.num !== realValue.value) {
        rAf = window.requestAnimationFrame(count)
      } else {
        rAf = 0
      }
    }

    start()

    return {
      showValue,
      realValue,
    }
  },
})
</script>
