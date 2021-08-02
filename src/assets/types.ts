import { THREE, CameraControls } from '@/assets/three/lib'

export interface PersonType {
  id: number
  name: string
  isAI: boolean
  // color: number // 0xc4226a
  color: string
  color2: string
  money: number // 钱
  index: number // 人物所在地图上位置
  map: 0 | 1 // 0 打工地图 1 旅游地图
  map0Index: number // 打工地图位置
  map1Index: number // 旅游地图位置
  points: number // 积分
  win: number // 0:进行中,1 第1名 2:第2名 3:第3名 4:第4名
}

export interface RewardText {
  text: string
  height: number
  color?: string
  fontSize?: number // 宽度百分比
}

export interface Options {
  name?: string
  playerId: number
  rotation?: number
  // color?: string
  imageUrl?: string
  rewardIndex?: number // 机会类型 0 得到1分 1 可以选择和某个人交换位置 2 向所有人收取200元 3 在你的2张打工卡上各放1个经验标记
  reward?: Array<number> // 打工点奖励 [新手 一级 二级 老手]
  level?: number // 当前奖励级别
}

// 0 发薪日 1 打工地址 2 机会 3 旅游城市
// export type PointType = 0 | 1 | 2 | 3
export enum PointType {
  START = 0,
  WORK = 1,
  REWARD = 2,
  CITY = 3,
}

export interface MapAddress {
  index: number // 地图上的位置 0  => 王叔叔发薪日 对应上面人物的初始位置
  width: number
  height: number
  // position: Array<number> // [x,y,z]
  position: [number, number, number]
  type: PointType // 0 发薪日 1 打工地址 2 机会 3 旅游城市
  options: Options // 其他一些属性
}

export interface GameState {
  players: Array<PersonType>
  // workMapList: Array<MapAddress>
  currentPlayerId?: number
  // env?: ThreeEnvironment
}

export interface ThreeEnvironment {
  domElement: HTMLElement
  width: number
  height: number
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  raycaster: THREE.Raycaster
  clock: THREE.Clock
  camera?: THREE.PerspectiveCamera
  control?: CameraControls
}

// 初始化three环境基本参数.
export function createThreeEnvironment(dom: HTMLElement, rendererParameters: THREE.WebGLRendererParameters = { antialias: true, alpha: true }) {
  const env: ThreeEnvironment = {
    domElement: dom,
    width: dom.offsetWidth,
    height: dom.offsetHeight,
    scene: new THREE.Scene(),
    raycaster: new THREE.Raycaster(),
    clock: new THREE.Clock(),
    renderer: new THREE.WebGLRenderer(rendererParameters),
  }

  env.renderer.setSize(dom.offsetWidth, dom.offsetHeight)
  dom.appendChild(env.renderer.domElement)

  // 相机和轨道控制器的设置容易不同,在业务代码中实现创建.
  return env
}
