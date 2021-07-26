<template>
  <div class="three-container" ref="wrap">
    <template v-if="isComplete">
      <slot></slot>
    </template>
  </div>
</template>
<script lang="ts">
import TWEEN from '@tweenjs/tween.js'
import { createThreeEnvironment, ThreeEnvironment } from '@/assets/types'
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { bus, ACTION } from '@/assets/bus'
import { THREE, CameraControls } from '@/assets/three/lib'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
// import { cameraJSON } from '@/assets/object.json'
export default defineComponent({
  setup() {
    const store = useInjector(GameStateStore)
    const wrap = ref<HTMLElement>()
    const isComplete = ref(false)
    let directionalLight: THREE.DirectionalLight

    let tick = 0
    let env: ThreeEnvironment

    const initCameraAndControls = () => {
      env.camera = new THREE.PerspectiveCamera(60, env.width / env.height, 0.1, 1000)
      env.camera.position.set(0, 0, 800)
      env.camera.up.set(0, 0, 1)

      env.control = new CameraControls(env.camera!, env.renderer!.domElement)

      env.control.maxDistance = 700
      env.control.mouseButtons.right = CameraControls.ACTION.NONE
      env.control.dollySpeed = 0.2
      // env.control.minPolarAngle = (0 * Math.PI) / 180
      // env.control.maxPolarAngle = (70 * Math.PI) / 180

      env.control.minAzimuthAngle = (-50 * Math.PI) / 180
      env.control.maxAzimuthAngle = (50 * Math.PI) / 180

      env.control.setLookAt(0.94201531069342, -248.2782624512877, 117.75268152579949, 0, 0, 0, true)
    }

    const initLight = () => {
      // 环境光
      const light = new THREE.AmbientLight(0x404040, 0.5)
      light.name = 'ambient-light'

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
      hemiLight.position.set(0, 20, 0)

      directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      if (env.camera) {
        const { x, y, z } = env.camera!.position
        directionalLight.position.set(x, y, z)
      }

      env.scene.add(light, hemiLight, directionalLight)
    }

    const resetSize = () => {
      const dom = wrap.value
      if (!dom || !env) return
      env.width = dom.offsetWidth
      env.height = dom.offsetHeight

      env.renderer.setSize(env.width, env.height)
    }

    const render = (timer?: number) => {
      const delta = env.clock.getDelta()
      TWEEN.update(timer)
      bus.emit(ACTION.RENDER, { delta })

      if (env.control && env.camera) {
        const camera = env.camera
        const hasUpdated = env.control.update(delta)
        if (hasUpdated) {
          if (directionalLight) {
            const { x, y, z } = camera.position
            directionalLight.position.set(x, y, z)
          }
        }
        env.renderer?.render(env.scene, camera)
      }
      tick = requestAnimationFrame(render)
    }

    onMounted(() => {
      env = createThreeEnvironment(wrap.value!, {
        antialias: true,
        alpha: true,
      })

      initCameraAndControls()
      initLight()

      store?.setEnv(env)

      bus.on(ACTION.WINDOW_RESIZE, resetSize)
      isComplete.value = true

      // env.control?.moveTo(0, 0, -700, true)

      // test
      // const axesHelper = new THREE.AxesHelper(500)
      // env.scene.add(axesHelper)

      render()
    })

    onBeforeUnmount(() => {
      cancelAnimationFrame(tick)
      tick = 0
      if (env) {
        env.scene.clear()
        if (wrap.value) {
          wrap.value.removeChild(env.renderer.domElement)
        }
      }

      bus.off(ACTION.WINDOW_RESIZE, resetSize)
    })

    return {
      wrap,
      isComplete,
    }
  },
})
</script>
<style lang="scss" scoped>
.three-container {
  width: 100%;
  height: 100%;
}
</style>
