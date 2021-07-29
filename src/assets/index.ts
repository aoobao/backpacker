import TWEEN from '@tweenjs/tween.js'
import { Toast } from 'vant'

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

export function showMessage(msg: string, duration = 2000) {
  Toast({
    message: msg,
    duration,
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
