<template>
  <div class="check-box-container flex-row" :style="divStyle" @click="checkChange">
    {{ value ? '√' : null }}
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: '30px',
    },
    fontSize: {
      type: String,
      default: '48px',
    },
  },
  setup(props, { emit }) {
    const divStyle = computed(() => {
      const size = props.size
      return {
        width: size,
        height: size,
        fontSize: props.fontSize,
      }
    })

    const checkChange = () => {
      const value = !props.value
      emit('input', value)
    }

    return { divStyle, checkChange }
  },
})
</script>
<style lang="scss" scoped>
.check-box-container {
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  color: #f50f0e;
}
</style>
