import { getFile } from '../preload'
import { MapAddress } from '../types'
import { THREE } from '@/assets/three/lib'
import { Material } from 'cannon'

let fontMaterial: THREE.Material | undefined
const FONT_NUMBER_NAME = 'MONEY'

// 更新打工地址的金额
export const updateMoneyInWorkAddress = (mesh: THREE.Object3D, address: MapAddress) => {
  const oldFont = mesh.children.find(t => t.name === FONT_NUMBER_NAME)
  if (oldFont) mesh.remove(oldFont)
  const font = getFile('font') as THREE.Font
  const numberText = String(address.options.reward![address.options.level!])
  const textGeometry = new THREE.TextGeometry(numberText, {
    font,
    size: 7,
    height: 1,
    curveSegments: 2,
    bevelThickness: 1,
    bevelSize: 0.7,
    bevelEnabled: true,
  })

  if (!fontMaterial) {
    fontMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true })
  }

  textGeometry.computeBoundingBox()
  const centerOffset = -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x)

  const textMesh = new THREE.Mesh(textGeometry, fontMaterial)
  textMesh.name = FONT_NUMBER_NAME
  textMesh.position.set(centerOffset, 21, 1)
  textMesh.rotation.y = Math.PI * 2

  mesh.add(textMesh)
}

export const createPoints = (p1: [number, number], p2: [number, number], dis: number) => {
  const distance = Math.pow(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2), 0.5)
  const count = Math.ceil(distance / dis) // 总共中间生成的点位数量
  const points = []
  points.push(p1)
  for (let i = 1; i < count; i++) {
    const disX = ((p2[0] - p1[0]) / count) * i
    const disY = ((p2[1] - p1[1]) / count) * i
    const p = [p1[0] + disX, p1[1] + disY]
    points.push(p)
  }
  points.push(p2)
  return points
}
