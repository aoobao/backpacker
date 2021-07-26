import { MapAddress, PointType, RewardText } from './types'

const player1Rotation = (90 * Math.PI) / 180
const player3Rotation = (-90 * Math.PI) / 180
const player4Rotation = (180 * Math.PI) / 180

const rewards = [
  [400, 700, 1200, 2500],
  [300, 600, 1100, 2000],
  [200, 400, 800, 1500],
  [200, 400, 800, 1500],
  [100, 300, 700, 1200],
  [100, 300, 700, 1200],
]

export const rewardTextList: Array<Array<RewardText>> = [
  [
    {
      text: '得到一分',
      height: 0.7,
      fontSize: 0.25,
    },
  ],
  [
    {
      text: '和一个',
      height: 0.4,
    },
    {
      text: '打工状态',
      height: 0.55,
      color: '#f52443',
      fontSize: 0.2,
    },
    {
      text: '的人交换位置',
      height: 0.7,
    },
  ],
  [
    {
      text: '向每个人',
      height: 0.55,
      fontSize: 0.2,
    },
    {
      text: '收取200元',
      height: 0.75,
      fontSize: 0.2,
    },
  ],
  [
    {
      text: '在你的2张',
      height: 0.4,
    },
    {
      text: '打工卡上各',
      height: 0.55,
    },
    {
      text: '放1个经验',
      height: 0.7,
    },
    {
      text: '标记',
      height: 0.85,
    },
  ],
]

export const player1MapList: Array<MapAddress> = [
  {
    index: 0,
    width: 50,
    height: 50,
    position: [102, 102, 1],
    type: PointType.START,
    options: {
      playerId: 1,
      rotation: (225 * Math.PI) / 180,
    },
  },
  {
    index: 1,
    width: 22,
    height: 40,
    position: [107, 66, 1],
    type: PointType.WORK,
    options: {
      playerId: 1,
      name: '随身保镖',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      // rotation: (180 * Math.PI) / 180,
      rotation: player1Rotation,
      reward: rewards[0],
    },
  },
  {
    index: 2,
    width: 22,
    height: 40,
    position: [107, 44, 1],
    type: PointType.WORK,
    options: {
      playerId: 1,
      name: '工地搬运',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player1Rotation,
      reward: rewards[1],
    },
  },
  {
    index: 3,
    width: 22,
    height: 40,
    position: [107, 22, 1],
    type: PointType.WORK,
    options: {
      playerId: 1,
      name: '社区警卫',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player1Rotation,
      reward: rewards[2],
    },
  },
  {
    index: 4,
    width: 22,
    height: 40,
    position: [107, 0, 1],
    type: PointType.WORK,
    options: {
      playerId: 1,
      name: '搬家公司',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player1Rotation,
      reward: rewards[3],
    },
  },
  {
    index: 5,
    width: 22,
    height: 40,
    position: [107, -22, 1],
    type: PointType.REWARD,
    options: {
      playerId: 1,
      rotation: player1Rotation,
      rewardIndex: 0, // 得到1分
    },
  },
  {
    index: 6,
    width: 22,
    height: 40,
    position: [107, -44, 1],
    type: PointType.WORK,
    options: {
      playerId: 1,
      name: '整理仓库',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player1Rotation,
      reward: rewards[4],
    },
  },
  {
    index: 7,
    width: 22,
    height: 40,
    position: [107, -66, 1],
    type: PointType.WORK,
    options: {
      playerId: 1,
      name: '清洁街道',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player1Rotation,
      reward: rewards[5],
    },
  },
]

export const player2MapList: Array<MapAddress> = [
  {
    index: 8,
    width: 50,
    height: 50,
    position: [102, -102, 1],
    type: PointType.START,
    options: {
      playerId: 2,
      rotation: (-45 * Math.PI) / 180,
    },
  },
  {
    index: 9,
    width: 22,
    height: 40,
    position: [66, -107, 1],
    type: PointType.WORK,
    options: {
      playerId: 2,
      name: '主持活动',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      // rotation: (-90 * Math.PI) / 180,
      reward: rewards[0],
    },
  },
  {
    index: 10,
    width: 22,
    height: 40,
    position: [44, -107, 1],
    type: PointType.WORK,
    options: {
      playerId: 2,
      name: '临时演员',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      // rotation: (-90 * Math.PI) / 180,
      reward: rewards[1],
    },
  },
  {
    index: 11,
    width: 22,
    height: 40,
    position: [22, -107, 1],
    type: PointType.WORK,
    options: {
      playerId: 2,
      name: '街头演奏',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      // rotation: (-90 * Math.PI) / 180,
      reward: rewards[2],
    },
  },
  {
    index: 12,
    width: 22,
    height: 40,
    position: [0, -107, 1],
    type: PointType.WORK,
    options: {
      playerId: 2,
      name: '素描人像',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      // rotation: (-90 * Math.PI) / 180,
      reward: rewards[3],
    },
  },
  {
    index: 13,
    width: 22,
    height: 40,
    position: [-22, -107, 1],
    type: PointType.REWARD,
    options: {
      playerId: 2,
      // rotation: (-90 * Math.PI) / 180,
      rewardIndex: 1, // 交换位置
    },
  },
  {
    index: 14,
    width: 22,
    height: 40,
    position: [-44, -107, 1],
    type: PointType.WORK,
    options: {
      playerId: 2,
      name: '扮装人偶',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      // rotation: (-90 * Math.PI) / 180,
      reward: rewards[4],
    },
  },
  {
    index: 15,
    width: 22,
    height: 40,
    position: [-66, -107, 1],
    type: PointType.WORK,
    options: {
      playerId: 2,
      name: '地摊兜售',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      // rotation: (-90 * Math.PI) / 180,
      reward: rewards[5],
    },
  },
]

export const player3MapList: Array<MapAddress> = [
  {
    index: 16,
    width: 50,
    height: 50,
    position: [-102, -102, 1],
    type: PointType.START,
    options: {
      playerId: 3,
      rotation: (45 * Math.PI) / 180,
    },
  },
  {
    index: 17,
    width: 22,
    height: 40,
    position: [-107, -66, 1],
    type: PointType.WORK,
    options: {
      playerId: 3,
      name: '展场导览',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player3Rotation,
      reward: rewards[0],
    },
  },
  {
    index: 18,
    width: 22,
    height: 40,
    position: [-107, -44, 1],
    type: PointType.WORK,
    options: {
      playerId: 3,
      name: '随行口译',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player3Rotation,
      reward: rewards[1],
    },
  },
  {
    index: 19,
    width: 22,
    height: 40,
    position: [-107, -22, 1],
    type: PointType.WORK,
    options: {
      playerId: 3,
      name: '摄影助理',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player3Rotation,
      reward: rewards[2],
    },
  },
  {
    index: 20,
    width: 22,
    height: 40,
    position: [-107, 0, 1],
    type: PointType.WORK,
    options: {
      playerId: 3,
      name: '专栏写作',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player3Rotation,
      reward: rewards[3],
    },
  },
  {
    index: 21,
    width: 22,
    height: 40,
    position: [-107, 22, 1],
    type: PointType.REWARD,
    options: {
      playerId: 3,
      rotation: player3Rotation,
      rewardIndex: 2,
    },
  },
  {
    index: 22,
    width: 22,
    height: 40,
    position: [-107, 44, 1],
    type: PointType.WORK,
    options: {
      playerId: 3,
      name: '卖场销售',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player3Rotation,
      reward: rewards[4],
    },
  },
  {
    index: 23,
    width: 22,
    height: 40,
    position: [-107, 66, 1],
    type: PointType.WORK,
    options: {
      playerId: 3,
      name: '问卷访谈',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player3Rotation,
      reward: rewards[5],
    },
  },
]

export const player4MapList: Array<MapAddress> = [
  {
    index: 24,
    width: 50,
    height: 50,
    position: [-102, 102, 1],
    type: PointType.START,
    options: {
      playerId: 4,
      rotation: (135 * Math.PI) / 180,
    },
  },
  {
    index: 25,
    width: 22,
    height: 40,
    position: [-66, 107, 1],
    type: PointType.WORK,
    options: {
      playerId: 4,
      name: '清洁招牌',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player4Rotation,
      reward: rewards[0],
    },
  },
  {
    index: 26,
    width: 22,
    height: 40,
    position: [-44, 107, 1],
    type: PointType.WORK,
    options: {
      playerId: 4,
      name: '餐厅外送',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player4Rotation,
      reward: rewards[1],
    },
  },
  {
    index: 27,
    width: 22,
    height: 40,
    position: [-22, 107, 1],
    type: PointType.WORK,
    options: {
      playerId: 4,
      name: '厨房杂役',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player4Rotation,
      reward: rewards[2],
    },
  },
  {
    index: 28,
    width: 22,
    height: 40,
    position: [0, 107, 1],
    type: PointType.WORK,
    options: {
      playerId: 4,
      name: '发送传单',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player4Rotation,
      reward: rewards[3],
    },
  },
  {
    index: 29,
    width: 22,
    height: 40,
    position: [22, 107, 1],
    type: PointType.REWARD,
    options: {
      playerId: 4,
      rotation: player4Rotation,
      rewardIndex: 3,
    },
  },
  {
    index: 30,
    width: 22,
    height: 40,
    position: [44, 107, 1],
    type: PointType.WORK,
    options: {
      playerId: 4,
      name: '派送牛奶',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player4Rotation,
      reward: rewards[4],
    },
  },
  {
    index: 31,
    width: 22,
    height: 40,
    position: [66, 107, 1],
    type: PointType.WORK,
    options: {
      playerId: 4,
      name: '派送报纸',
      imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player4Rotation,
      reward: rewards[5],
    },
  },
]
