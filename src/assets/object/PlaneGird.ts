import { THREE } from '@/assets/three/lib'
import { MapAddress, PointType } from '../types'
import { createPoints, updateMoneyInWorkAddress } from '@/assets/object/utils'
import { bus, ACTION } from '@/assets/bus'

export enum GirdType {
  Work = 0,
  Travel = 1,
}

export interface Line {
  points: Array<THREE.Vector3>
  currentPos: number
  color: THREE.ColorRepresentation
  visible: Boolean
}

export interface PlaneGirdOptions {
  mapAddress: MapAddress
  createMaterialFun: (m: MapAddress) => Promise<THREE.Material>
  type: GirdType
  map: THREE.Object3D
  init?: () => void
}

const travellingParticlesVertexShader = `
attribute float aOpacity;

uniform float uSize;
varying float vOpacity;

void main(){
    gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uSize;
    vOpacity=aOpacity;
}
`

const travellingParticlesFragmentShader = `
varying float vOpacity;
uniform vec3 uColor;

void main(){
  vec4 color=vec4(uColor * uColor,vOpacity);
  gl_FragColor=color;
}
`

const SPEED = 240
const MAX_POINT_COUNT = 80
const DISTANCE = 0.5

// 棋盘上的格子
export class PlaneGird {
  public mesh?: THREE.Mesh
  public name!: string
  public m: MapAddress
  public map: THREE.Object3D
  public line?: Line
  private positions?: Float32Array
  private opacitys?: Float32Array
  private geometry?: THREE.BufferGeometry
  private type: GirdType

  private material?: THREE.ShaderMaterial
  constructor(opt: PlaneGirdOptions) {
    this.render = this.render.bind(this)
    const m = opt.mapAddress
    this.m = m
    this.map = opt.map
    this.type = opt.type

    const func = opt.type === GirdType.Work ? this.initWork : this.initTravel

    func.call(this, opt.createMaterialFun).then(() => {
      opt.init && opt.init()
    })

    bus.on(ACTION.RENDER, this.render)
  }

  async initTravel(createMaterialFun: (m: MapAddress) => Promise<THREE.Material>): Promise<void> {
    const m = this.m
    this.name = `travel-${m.index}`
    const geometry = new THREE.PlaneGeometry(m.width, m.height)
    const material = await createMaterialFun(m)

    const mesh = new THREE.Mesh(geometry, material)
    this.mesh = mesh
    mesh.name = this.name
    mesh.position.set(...m.position)

    if (m.options.rotation) {
      mesh.rotation.z = m.options.rotation
    }

    this.map.add(mesh)
  }

  async initWork(createMaterialFun: (m: MapAddress) => Promise<THREE.Material>): Promise<void> {
    const m = this.m
    this.name = `work-${m.index}`
    const geometry = new THREE.PlaneGeometry(m.width, m.height)
    const material = await createMaterialFun(m)

    const mesh = new THREE.Mesh(geometry, material)
    this.mesh = mesh
    mesh.name = this.name
    mesh.position.set(m.position[0], m.position[1], m.position[2])

    if (m.type !== PointType.START && m.options?.rotation) {
      mesh.rotation.z = m.options.rotation
    }

    if (m.type === PointType.WORK) {
      this.updateMoneyInWorkAddress()
    }

    this.map.add(mesh)
  }

  initLine() {
    const width = this.m.width
    const height = this.m.height

    // const list = [
    //   // [0, 0],
    //   [-width / 2, -height / 2],
    //   [width / 2, -height / 2],
    //   [width / 2, height / 2],
    //   [-width / 2, height / 2],
    // ]
    const dis = DISTANCE
    const p1 = createPoints([-width / 2, -height / 2], [width / 2, -height / 2], dis) // 底边
    const p2 = createPoints([width / 2, -height / 2], [width / 2, height / 2], dis) // 右边
    const p3 = createPoints([width / 2, height / 2], [-width / 2, height / 2], dis) // 上边
    const p4 = createPoints([-width / 2, height / 2], [-width / 2, -height / 2], dis) // 右边

    const points = [p1, p2, p3, p4].flat(1)

    this.line = {
      points: points.map(t => new THREE.Vector3(t[0], t[1], 0.5)),
      currentPos: 0,
      // color: 0x4ec0e9,
      color: 0x4ec0e9,
      visible: false,
    }
  }

  updateMoneyInWorkAddress() {
    if (this.mesh && this.type === GirdType.Work) {
      updateMoneyInWorkAddress(this.mesh, this.m)
    }
  }

  addStar(level: 0 | 1 | 2 | 3 | 4) {
    // if (this.type === GirdType.Work) {
    //   debugger
    // }
    if (!this.mesh) {
      // 因为地图中的图片是异步加载的,所以旅游地图存在还没创建mesh,初始化热门景点的问题,这里延迟100毫秒再继续创建
      setTimeout(() => {
        this.addStar(level)
      }, 100)
      return
    }
    // const colors = [0x4ec0e9, 0x558b2f, 0xe65100, 0xb71c1c]
    const colors = {
      1: 0x4ec0e9,
      2: 0x558b2f,
      3: 0xe65100,
      4: 0xb71c1c,
    }
    this.updateMoneyInWorkAddress()

    if (level !== 0) {
      if (!this.line) {
        this.initLine() // 初始化线段

        this.line!.color = colors[level]

        this.positions = new Float32Array(MAX_POINT_COUNT * 3)
        this.opacitys = new Float32Array(MAX_POINT_COUNT).map((v, i) => {
          return (MAX_POINT_COUNT - i) / MAX_POINT_COUNT
        })

        const geometry = new THREE.BufferGeometry()

        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        geometry.setAttribute('aOpacity', new THREE.BufferAttribute(this.opacitys, 1))

        this.geometry = geometry
        this.material = new THREE.ShaderMaterial({
          vertexShader: travellingParticlesVertexShader,
          fragmentShader: travellingParticlesFragmentShader,
          uniforms: {
            uSize: {
              value: level * 2 + 1,
            },
            uColor: {
              value: new THREE.Color(this.line!.color),
            },
          },
        })
        const point = new THREE.Points(geometry, this.material)
        point.name = 'star-point'

        this.mesh.add(point)
      } else {
        this.line!.color = colors[level]
        this.material!.uniforms.uSize.value = level * 2 + 1
        this.material!.uniforms.uColor.value = new THREE.Color(this.line!.color)
      }
    } else {
      // 销毁线段对象
      this.destroyLine()
    }
  }

  render(e: any) {
    if (!this.line) return
    const delta = e.delta as number // 0.17
    const line = this.line
    const step = Math.round(delta * SPEED)
    line.currentPos += step

    const points = []
    for (let i = 0; i < MAX_POINT_COUNT; i++) {
      const currentIndex = (line.currentPos + i) % line.points.length
      const point = line.points[currentIndex]
      points.push(point.x, point.y, point.z)
      // opacitys.push(0.8)
    }

    this.positions!.set(points)
    // this.opacitys!.set(opacitys)

    this.geometry!.attributes.position.needsUpdate = true
  }

  destroyLine() {
    if (!this.line || !this.mesh) return
    const point = this.mesh.children.find(p => p.name === 'star-point')
    if (point) this.mesh.remove(point)
    this.geometry?.dispose()
    this.geometry = undefined
    this.material?.dispose()
    this.material = undefined
    this.line = undefined
  }

  destroy() {
    this.destroyLine()
    if (this.mesh) {
      const material = this.mesh.material as THREE.Material
      material.dispose()
      this.mesh.geometry.dispose()
      this.mesh = undefined
    }

    bus.off(ACTION.RENDER, this.render)
  }
}
