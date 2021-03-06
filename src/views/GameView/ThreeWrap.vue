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
import { THREE } from '@/assets/three/lib'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'
import Stats from 'stats.js'
import PhysicsWorld from '@/assets/physics'
import { initCameraAndControls, initEffectComposer } from '@/assets/three/init'

// import CANNON from 'cannon'
// import { cameraJSON } from '@/assets/object.json'
export default defineComponent({
  setup() {
    const store = useInjector(GameStateStore)
    const wrap = ref<HTMLElement>()
    const isComplete = ref(false)
    let directionalLight: THREE.DirectionalLight

    let tick = 0
    let env: ThreeEnvironment
    let stats: Stats
    // const frustumSize = 300

    const initLight = () => {
      // 环境光
      const light = new THREE.AmbientLight(0x404040, 0.5)
      light.name = 'ambient-light'

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
      hemiLight.position.set(0, 20, 0)

      directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
      if (env.camera) {
        const { x, y, z } = env.camera!.position
        directionalLight.position.set(x, y, z)
      }

      env.scene.add(light, hemiLight, directionalLight)
    }

    const initPhysicsWorld = () => {
      const physicsWorld = new PhysicsWorld()
      store!.setPhysicsWorld(physicsWorld)
    }

    const resetSize = () => {
      const dom = wrap.value
      if (!dom || !env) return
      env.width = dom.offsetWidth
      env.height = dom.offsetHeight

      if (env.camera) {
        env.camera.aspect = env.width / env.height
        env.camera.updateProjectionMatrix()
      }

      env.renderer.setSize(env.width, env.height)
      env.composer && env.composer.setSize(env.width, env.height)

      console.log('resize')
    }

    onMounted(() => {
      env = createThreeEnvironment(wrap.value!, {
        antialias: true,
        alpha: true,
      })

      // 初始化相机和轨道控制器
      initCameraAndControls(env)

      // 初始化后处理
      initEffectComposer(env)

      initLight()
      initPhysicsWorld()

      store?.setEnv(env)

      bus.on(ACTION.WINDOW_RESIZE, resetSize)
      isComplete.value = true

      // env.control?.moveTo(0, 0, -700, true)

      // test
      if (process.env.VUE_APP_ENV === 'development') {
        const axesHelper = new THREE.AxesHelper(500)
        env.scene.add(axesHelper)

        stats = new Stats()
        stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(stats.dom)
      }

      tick = requestAnimationFrame(animate)

      function animate(timer: number) {
        stats && stats.begin()
        render(timer)
        stats && stats.end()
        tick = requestAnimationFrame(animate)
      }

      function render(timer: number) {
        const delta = env.clock.getDelta()
        TWEEN.update(timer)
        bus.emit(ACTION.RENDER, { delta, timer })

        if (env.control && env.camera) {
          const camera = env.camera
          const hasUpdated = env.control.update(delta)
          if (hasUpdated) {
            if (directionalLight) {
              const { x, y, z } = camera.position
              directionalLight.position.set(x, y, z)
            }

            // console.log(`${camera.position.x},${camera.position.y},${camera.position.z}`)
          }

          if (env.composer) {
            env.composer.render(delta)
          } else {
            env.renderer?.render(env.scene, camera)
          }
        }
      }
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
  overflow: hidden;
}
</style>
