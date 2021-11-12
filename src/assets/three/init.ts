import { ThreeEnvironment } from '../types'
import { THREE, CameraControls } from '@/assets/three/lib'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'

export const initCameraAndControls = (env: ThreeEnvironment) => {
  env.camera = new THREE.PerspectiveCamera(60, env.width / env.height, 0.1, 1000)

  // const aspect = window.innerWidth / window.innerHeight
  // env.camera = new THREE.OrthographicCamera((frustumSize * aspect) / -2, (frustumSize * aspect) / 2, frustumSize / 2, frustumSize / -2, 1, 1000)
  // -183.24351447782382,-203.67707488871974,117.73896367214361
  // env.camera.position.set(183, -203, 117)
  env.camera.up.set(0, 0, 1)

  env.control = new CameraControls(env.camera!, env.renderer!.domElement)

  env.control.maxDistance = 700

  env.control.mouseButtons.wheel = CameraControls.ACTION.ZOOM
  env.control.mouseButtons.right = CameraControls.ACTION.NONE

  env.control.touches.two = CameraControls.ACTION.TOUCH_ZOOM
  env.control.touches.three = CameraControls.ACTION.TOUCH_ZOOM_TRUCK

  // env.control.dollySpeed = 0.8
  // const polarAngle = 45
  // env.control.rotatePolarTo((polarAngle * Math.PI) / 180, false)

  // env.control.minPolarAngle = (polarAngle * Math.PI) / 180
  // env.control.maxPolarAngle = (polarAngle * Math.PI) / 180

  // env.control.minAzimuthAngle = (-50 * Math.PI) / 180
  // env.control.maxAzimuthAngle = (50 * Math.PI) / 180

  env.control.setLookAt(0, -245, 170, 0, 0, 0, false)

  if (process.env.VUE_APP_ENV === 'production') {
    env.control.minPolarAngle = env.control.polarAngle
    env.control.maxPolarAngle = env.control.polarAngle

    env.control.minZoom = 0.7
    env.control.maxZoom = 2
  }

  // console.log(env.control.polarAngle)

  // env.control.rotateTo(0, env.control.polarAngle, false)

  // console.log(env.control.azimuthAngle)
}

export const initEffectComposer = (env: ThreeEnvironment) => {
  const composer = new EffectComposer(env.renderer)
  const renderPass = new RenderPass(env.scene, env.camera!)

  composer.addPass(renderPass)

  env.composer = composer
}
