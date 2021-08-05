<template>
  <Modal :visible="visible" :showClose="false">
    <div class="wrap flex-col">
      <!-- <div class="header flex-row"> -->
      <span class="title"> 选择要增加经验的打工卡 </span>
      <!-- </div> -->
      <div class="remark">{{ selectIds.length }}/{{ count }}</div>
      <div class="body flex-row">
        <div class="card flex-col" :class="{ active: selectIds.includes(address.index) }" v-for="address in workAddressList" :key="address.index" @click="selectAddress(address)">
          <div class="header">
            {{ address.options.name }}
          </div>
          <div class="image" :style="{ backgroundImage: `url(${address.options.imageUrl})` }"></div>
          <!-- <img class="image" :src="address.options.imageUrl" alt="" /> -->
          <div class="star-wrap">
            <div class="star" v-for="index in address.options.level" :key="index"></div>
            <!-- <div class="star"></div> -->
            <!-- <div class="star"></div> -->
          </div>
        </div>
      </div>

      <div class="btn" @click="submit">确定</div>
    </div>
  </Modal>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import Modal from '@/components/Modal/Modal.vue'
import { MapAddress, PointType } from '@/assets/types'
import { confirm, showMessage } from '@/assets/index'
// import { workMapList } from '@/assets/setting'
export default defineComponent({
  components: { Modal },
  props: {
    count: {
      type: Number,
      default: 2,
    },
  },
  setup(props) {
    const store = useInjector(GameStateStore)
    if (!store) throw new Error('未获取GameStateStore')
    const visible = ref(false)
    const currentPlayerId = ref(1) // 当前接受奖励的用户id
    const selectIds = ref<Array<number>>([])

    let resolveFun: (selectIds: Array<number>) => void

    // 当前接受奖励的用户对应的打工地址
    const workAddressList = computed(() => {
      const list: Array<MapAddress> = store.gameState.workMapList.filter(t => {
        return t.type === PointType.WORK && t.options.playerId === currentPlayerId.value
      })

      return list
    })

    const selectAddress = (address: MapAddress) => {
      const index = selectIds.value.findIndex(t => t === address.index)

      if (index > -1) {
        // 删除
        selectIds.value.splice(index, 1)
      } else {
        if (address.options.level! >= 3) {
          return showMessage(`${address.options.name}已经达到最高水准,无法再提高了`)
        }

        if (selectIds.value.length < props.count) {
          selectIds.value.push(address.index)
        } else {
          showMessage(`只能选${props.count}张,太贪心了哦`)
        }
      }
    }

    const show = (playerId: number) => {
      currentPlayerId.value = playerId
      selectIds.value = []
      visible.value = true

      return new Promise<Array<number>>(resolve => {
        resolveFun = resolve
      })
    }

    const submit = async () => {
      if (selectIds.value.length < props.count) {
        const isok = await confirm('确认提交?')
        if (!isok) return
      }

      resolveFun(selectIds.value)

      visible.value = false
    }

    return {
      visible,
      selectIds,
      workAddressList,
      show,
      selectAddress,
      submit,
    }
  },
})
</script>
<style lang="scss" scoped>
.remark {
  margin-top: 16px;
}
.wrap {
  font-size: 14px;
}
.body {
  margin: 8px auto 0;
  // width: 35rem;
  width: 350px;
  flex-wrap: wrap;
  justify-content: space-around;

  align-items: center;
  .card {
    margin-top: 16px;
    width: 100px;
    height: 160px;
    border: 1px solid #fff;
    font-size: 18px;
    position: relative;
    .header {
      margin-top: 4px;
      flex-shrink: 0;
    }
    .image {
      flex-grow: 1;
      margin-top: 8px;
      background-size: 100% 100%;

      // background-color: red;
    }

    .star-wrap {
      position: absolute;
      bottom: 15px;
      right: 0;

      .star {
        float: right;
        width: 20px;
        height: 20px;
        background-image: url('~@/assets/image/star.png');
        background-size: 100% 100%;
        margin-right: 4px;
      }
    }

    &.active {
      box-shadow: 0px 0px 5px 8px #ed6a0c;
    }
  }
}
.btn {
  margin-top: 16px;
  font-size: 24px;
}
</style>
