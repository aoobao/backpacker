import { rewardTextList } from '@/assets/object.json'
// 创建各种canvas纹理
const FONT_STYLE = 'FangSong'

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
