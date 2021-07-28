import { THREE } from '@/assets/three/lib'
const size = 200
function createCanvas() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = size
  canvas.height = size

  const grd = ctx?.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size * 2)
  grd!.addColorStop(0, '#fff')

  grd!.addColorStop(1, '#999')

  ctx!.fillStyle = grd!

  ctx?.fillRect(0, 0, size * 2, size * 2)

  return {
    canvas,
    ctx,
  }
}

function createCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x * size, y * size, size * radius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.restore()
}

function create1() {
  const { canvas, ctx } = createCanvas()

  createCircle(ctx!, 0.5, 0.5, 0.25, 'red')

  return canvas
}

function create2() {
  const { canvas, ctx } = createCanvas()

  createCircle(ctx!, 1 / 3, 0.5, 0.1, '#000')
  createCircle(ctx!, 2 / 3, 0.5, 0.1, '#000')

  return canvas
}

function create3() {
  const { canvas, ctx } = createCanvas()

  createCircle(ctx!, 1 / 4, 1 / 4, 0.1, '#000')
  createCircle(ctx!, 1 / 2, 1 / 2, 0.1, '#000')
  createCircle(ctx!, 3 / 4, 3 / 4, 0.1, '#000')

  return canvas
}

function create4() {
  const { canvas, ctx } = createCanvas()

  createCircle(ctx!, 1 / 3, 1 / 3, 0.1, 'red')
  createCircle(ctx!, 2 / 3, 1 / 3, 0.1, 'red')
  createCircle(ctx!, 1 / 3, 2 / 3, 0.1, 'red')
  createCircle(ctx!, 2 / 3, 2 / 3, 0.1, 'red')

  return canvas
}

function create5() {
  const { canvas, ctx } = createCanvas()

  createCircle(ctx!, 1 / 4, 1 / 4, 0.1, '#000')
  createCircle(ctx!, 3 / 4, 1 / 4, 0.1, '#000')
  createCircle(ctx!, 1 / 2, 1 / 2, 0.1, '#000')
  createCircle(ctx!, 1 / 4, 3 / 4, 0.1, '#000')
  createCircle(ctx!, 3 / 4, 3 / 4, 0.1, '#000')

  return canvas
}

function create6() {
  const { canvas, ctx } = createCanvas()

  createCircle(ctx!, 1 / 3, 1 / 4, 0.1, '#000')
  createCircle(ctx!, 2 / 3, 1 / 4, 0.1, '#000')
  createCircle(ctx!, 1 / 3, 1 / 2, 0.1, '#000')
  createCircle(ctx!, 2 / 3, 1 / 2, 0.1, '#000')
  createCircle(ctx!, 1 / 3, 3 / 4, 0.1, '#000')
  createCircle(ctx!, 2 / 3, 3 / 4, 0.1, '#000')

  return canvas
}

function cm(canvas: HTMLCanvasElement) {
  const texture = new THREE.Texture()
  texture.image = canvas
  texture.needsUpdate = true

  const material = new THREE.MeshBasicMaterial({ map: texture })
  // const material = new THREE.MeshLambertMaterial({ map: texture })
  // const material = new THREE.MeshPhongMaterial({ map: texture })
  return material
}

let materials: Array<THREE.Material> = []

export const createCubeMaterials = () => {
  if (!materials.length) {
    materials = [cm(create2()), cm(create5()), cm(create3()), cm(create4()), cm(create1()), cm(create6())]
  }
  return materials
}
