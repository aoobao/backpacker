import TWEEN from '@tweenjs/tween.js'
import { Toast, ToastPosition } from 'vant'
import { THREE } from '@/assets/three/lib'
import { useInjector } from '@/store/hook'
import { GameStateStore } from '@/store/hooks/game-info'

export function numberToRgb(number: number) {
  const r = ~~(number / 0xff00)
  const g = ~~((number - r * 0x10000) / 0xff)
  const b = number - r * 0x10000 - g * 0x100

  return [r, g, b]
}

export function stringToNumberColor(color: string): number {
  const number = parseInt(color.slice(1), 16)
  return number
}

export function createAnimation(from: object, to: object, duration?: number, easing: (amount: number) => number = TWEEN.Easing.Quadratic.Out) {
  const tween = new TWEEN.Tween(from)

  tween.to(to, duration).easing(easing)

  tween.start()

  return tween
}

export function showMessage(msg: string, duration = 2000, position: ToastPosition = 'bottom') {
  Toast({
    message: msg,
    duration,
    position,
  })
}

export function randBetween(min: number, max: number) {
  const num = Math.floor((max - min + 1) * Math.random())

  return min + num
}
// 返回1 or -1
export function randPM() {
  return Math.random() > 0.5 ? 1 : -1
}

export function delay(second: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, second * 1000)
  })
}

export function printCamera() {
  const store = useInjector(GameStateStore)
  const camera = store?.env?.camera
  if (!camera) {
    console.warn('未实例化照相机')
  }
  console.log(`${camera?.position.x},${camera?.position.y},${camera?.position.z}`)
}

export function getAngle(px: number, py: number, mx: number, my: number) {
  const x = Math.abs(px - mx)
  const y = Math.abs(py - my)
  const z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  if (z == 0) return 0
  const cos = y / z
  const radian = Math.acos(cos) //用反三角函数求弧度

  let angle = (180 * radian) / Math.PI //将弧度转换成角度
  //因为算出来的值是[0,90),需要转成[0,360)
  if (mx >= px) {
    if (my >= py) {
      angle = 90 - angle
    } else {
      angle = 270 + angle
    }
  } else {
    if (my >= py) {
      angle = 90 + angle
    } else {
      angle = 270 - angle
    }
  }
  return angle
}

// const _pts: Array<THREE.Vector2> = []
let starGeometry: THREE.ExtrudeGeometry
let starMaterial: THREE.Material

export function createStar() {
  if (!starGeometry) {
    const pts: Array<THREE.Vector2> = []
    const numPts = 5
    for (let i = 0; i < numPts * 2; i++) {
      const l = i % 2 == 1 ? 10 : 20

      const a = (i / numPts) * Math.PI

      pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l))
    }

    const shape = new THREE.Shape(pts)

    const randomPoints = []

    for (let i = 0; i < 10; i++) {
      randomPoints.push(new THREE.Vector3((i - 4.5) * 50, THREE.MathUtils.randFloat(-50, 50), THREE.MathUtils.randFloat(-50, 50)))
    }
    const extrudeSettings = {
      // steps: 2,
      bevelEnabled: false,
      depth: 0.5,
    }

    starGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
    starMaterial = new THREE.MeshLambertMaterial({
      color: 0xff8000,
      wireframe: false,
    })
  }

  const star = new THREE.Mesh(starGeometry, starMaterial)

  return star
}
