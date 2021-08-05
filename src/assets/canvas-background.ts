import { rewardTextList } from '@/assets/object.json'
import { getFileById } from './preload'
import { MapAddress } from './types'
import { getCenterRect } from '@/assets/index'
// 创建各种canvas纹理
const FONT_STYLE = 'FangSong'

export function createCityCanvas(m: MapAddress): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const width = m.width * 10
    const height = m.height * 10
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法创建2d 画布')
    const id = `travel-${m.index}`
    // const image = getFile(name) as HTMLImageElement

    ctx.save()
    // 背景
    ctx.fillStyle = m.options.color!
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#fff'

    const borderWidth = width * 0.05

    ctx.fillRect(borderWidth, height * 0.3, width - borderWidth * 2, height * 0.7 - borderWidth)

    ctx.font = `bold ${width * 0.18}px ${FONT_STYLE}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const texts = m.options.texts!
    const areaText = texts[0]
    const country = texts[1]

    ctx.fillText(areaText, width / 2, 0.08 * height)
    ctx.fillText(country, width / 2, 0.2 * height)

    ctx.fillStyle = '#000'
    if (texts.length === 3) {
      ctx.fillText(texts[2], width / 2, 0.4 * height)
    } else {
      ctx.fillText(texts[2], width / 2, 0.36 * height)
      ctx.fillText(texts[3], width / 2, 0.45 * height)
    }

    ctx.restore()

    getFileById(id)
      .then(res => {
        const image = res.object as HTMLImageElement

        const maxHeight = 0.5 * height - borderWidth
        const maxWidth = width - 2 * borderWidth

        const rectRange = getCenterRect(image.width, image.height, maxWidth, maxHeight)

        ctx.drawImage(image, borderWidth + rectRange.x, 0.5 * height + rectRange.y, rectRange.width, rectRange.height)

        // test
        // ctx.fillStyle = 'yellow'
        // ctx.fillRect(borderWidth, 0.5 * height, maxWidth, maxHeight)

        ctx.strokeStyle = '#000'
        ctx.strokeRect(1, 1, width - 2, height - 2)

        resolve(canvas)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 打工地点创建
export function createWorkCanvas(name: string, color: string, imageUrl: string | undefined, width: number, height: number): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('无法创建2d 画布')

    ctx.save()

    // 背景
    ctx.fillStyle = color
    ctx.fillRect(0, 0, width, height)

    ctx.font = `bold ${width * 0.2}px ${FONT_STYLE}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#000'
    ctx.fillText(name, width / 2, height * 0.1)
    const image = new Image()
    image.src = imageUrl || require('@/assets/image/icon/temp.jpg')

    // console.log(width * 0.9, height * 0.7)

    image.onload = () => {
      ctx.drawImage(image, width * 0.05, height * 0.25, width * 0.9, height * 0.7)
      ctx.restore()
      resolve(canvas)
    }

    image.onerror = err => {
      reject(err)
    }
  })
}

export function createRewardCanvas(rewardIndex: number, color: string, color1: string, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建2d 画布')
  ctx.save()

  // 背景
  ctx.fillStyle = color
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = color1
  ctx.fillRect(0, 0, width, height * 0.25)

  ctx.font = `bold ${width * 0.2}px ${FONT_STYLE}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.fillStyle = '#000'
  ctx.fillText('机会', width / 2, height * 0.1)

  if (rewardTextList[rewardIndex]) {
    const list = rewardTextList[rewardIndex]
    for (let i = 0; i < list.length; i++) {
      const rewardText = list[i]
      ctx.fillStyle = rewardText.color || '#000'
      const fontSize = width * (rewardText.fontSize || 0.15)
      ctx.font = `bold ${fontSize}px ${FONT_STYLE}`

      ctx.fillText(rewardText.text, width / 2, height * rewardText.height)
    }
  }

  ctx.restore()

  return canvas
}

// 发薪日纹理创建
export function createType0Canvas(name: string, color: string, rotation: number | undefined, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  if (!ctx) throw new Error('无法创建2d 画布')
  ctx.save()

  ctx.fillStyle = '#8ace57' // 背景色
  ctx.fillRect(0, 0, width, height)
  ctx.translate(width / 2, height / 2)
  if (rotation) ctx.rotate(rotation)

  ctx.fillStyle = color
  ctx.fillRect(-width / 2, -height * 0.8, width, height * 0.6)

  const text = name + '发薪日'
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${width * 0.1}px ${FONT_STYLE}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 0, -height * 0.3)

  ctx.font = `bold ${width * 0.1}px ${FONT_STYLE}`
  ctx.fillStyle = '#000'
  ctx.fillText('领取薪资收入500元', 0, -height * 0.05)
  ctx.fillText('可以立即变成', 0, height * 0.1)

  ctx.fillStyle = '#ce3b3b'
  ctx.font = `bold ${width * 0.15}px ${FONT_STYLE}`
  ctx.fillText('旅游状态', 0, height * 0.25)

  ctx.restore()

  return canvas
}

export function createStartPointCanvas(backgroundColor: string, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建2d 画布')
  ctx.save()

  ctx.fillStyle = backgroundColor // 背景色
  ctx.fillRect(0, 0, width, height)

  // 中间白色
  const borderWidth = width * 0.05
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(borderWidth, borderWidth, width - 2 * borderWidth, height - 2 * borderWidth)

  ctx.translate(width / 2, height / 2)
  ctx.rotate((45 * Math.PI) / 180) // 旋转45度

  ctx.fillStyle = backgroundColor
  ctx.fillRect(-width / 2, -height * 0.8, width, height * 0.6)

  ctx.fillStyle = '#ffc428'
  ctx.font = `bold ${width * 0.2}px ${FONT_STYLE}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('起点', 0, 0)

  ctx.restore()

  addStar(ctx, width * 0.8, height * 0.2, width * 0.15, '#fff', (28 * Math.PI) / 180)
  ctx.strokeStyle = '#000'
  ctx.strokeRect(1, 1, width - 2, height - 2)

  return canvas
}

export function createBigCityCanvas(m: MapAddress): Promise<HTMLCanvasElement> {
  const width = m.width * 10
  const height = m.height * 10
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建2d 画布')
  const id = `travel-${m.index}`

  return new Promise((resolve, reject) => {
    getFileById(id).then(res => {
      ctx.save()
      ctx.fillStyle = m.options.color!
      ctx.fillRect(0, 0, width, height)
      const borderWidth = width * 0.05
      ctx.fillStyle = '#fff'
      ctx.fillRect(borderWidth, borderWidth, width - 2 * borderWidth, height - 2 * borderWidth)

      ctx.translate(width / 2, height / 2)
      ctx.rotate((45 * Math.PI) / 180)

      ctx.fillStyle = m.options.color!
      ctx.fillRect(-width / 2, -height * 0.8, width, height * 0.54)

      ctx.font = `bold ${width * 0.1}px ${FONT_STYLE}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const texts = m.options.texts!
      const areaText = texts[0]
      const country = texts[1]
      ctx.fillStyle = '#fff'
      ctx.fillText(areaText, 0, -0.45 * height)
      ctx.fillText(country, 0, -0.35 * height)
      // ctx.fillText(country, width / 2, 0.2 * height)
      ctx.fillStyle = '#000'
      if (texts.length === 3) {
        ctx.fillText(texts[2], 0, -0.15 * height)
      } else {
        ctx.fillText(texts[2], 0, -0.2 * height)
        ctx.fillText(texts[3], 0, -0.1 * height)
      }

      const maxWidth = width * 0.6
      const maxHeight = height * 0.3
      const image = res.object as HTMLImageElement
      const rectRange = getCenterRect(image.width, image.height, maxWidth, maxHeight)

      ctx.drawImage(image, -rectRange.width / 2, rectRange.y, rectRange.width, rectRange.height)

      // ctx.fillStyle = 'yellow'

      // ctx.fillRect(-maxWidth / 2, 0, maxWidth, maxHeight)

      ctx.restore()

      ctx.strokeStyle = '#000'
      ctx.strokeRect(1, 1, width - 2, height - 2)

      resolve(canvas)
    })
  })
}

function addStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, rotation = 0) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotation)
  ctx.fillStyle = color
  ctx.beginPath()
  const r2 = r / 2
  const numPts = 5
  for (let i = 0; i < numPts * 2; i++) {
    const l = i % 2 === 1 ? r2 : r
    const a = (i / numPts) * Math.PI
    const x1 = l * Math.cos(a)
    const y1 = l * Math.sin(a)

    ctx.lineTo(x1, y1)
  }

  ctx.closePath()

  ctx.fill()

  ctx.restore()
}
