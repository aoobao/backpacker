<template>
  <Modal :visible="visible" @close="visible = false" @closed="closedHandle">
    <div class="wrap flex-col">
      <div class="person-item flex-col" v-for="user in userList" :key="user.id">
        <div class="row">
          <span class="person-name">姓名:</span>
          <input class="input-name" type="text" placeholder="请输入姓名" v-model="user.name" />
        </div>
        <div style="margin-top: 16px" class="row flex-row user-select">
          <div class="item flex-row" @click="user.isAI = false">
            <CheckBox :value="!user.isAI" />
            <span class="text-name">玩家</span>
          </div>
          <div class="item flex-row" @click="user.isAI = true">
            <CheckBox :value="user.isAI" />
            <span class="text-name">AI</span>
          </div>
        </div>
      </div>
      <div class="btn-wrap">
        <span class="button" @click="startGame">开始游戏</span>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts">
import { defalutPerson } from '@/assets/setting'
import { defineComponent, reactive, ref } from 'vue'
import Modal from './Modal/Modal.vue'
import CheckBox from './CheckBox/index.vue'
import { PersonType } from '@/assets/types'
import { showMessage } from '@/assets'
// import { Field, CellGroup, Switch, Popup } from 'vant'
export default defineComponent({
  components: { Modal, CheckBox },
  // components: { Field, CellGroup, Switch, Popup },
  setup(props, { emit }) {
    const userList = reactive(defalutPerson)
    let startList: Array<PersonType> | null = null
    const visible = ref(false)

    const show = () => {
      visible.value = true
    }

    const startGame = () => {
      const isNone = userList.some(t => !t.name)

      if (isNone) {
        return showMessage('请输入姓名')
      }

      startList = userList.map(t => {
        return { ...t }
      })

      // emit('start', { list })
      visible.value = false
    }

    const closedHandle = () => {
      if (startList) {
        emit('start', startList)
        startList = null
      }
    }

    return {
      userList,
      visible,
      show,
      startGame,
      closedHandle,
    }
  },
})
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  font-size: 1.8rem;

  .person-item {
    height: 20%;

    .input-name {
      margin-left: 16px;
      width: 50%;
      color: #000;
    }

    .user-select {
      justify-content: center;

      .item {
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
      }
      .text-name {
        margin-left: 16px;
      }
    }
  }

  .btn-wrap {
    margin-top: 16px;
  }
  .button {
    color: #fff;
    text-shadow: orange 0.53333vw 0.53333vw 0.53333vw;
    letter-spacing: 2.66667vw;
    // color: orangered;
    // margin-top: 16px;
    font-size: 2.4rem;
    // letter-spacing: 10px;
    font-weight: bold;
    // border: 1px solid orangered;
    // padding: 6px 24px;
    // border-radius: 16px;
  }
}
</style>
