import { MapAddress, PointType, RewardText } from './types'

const player1Rotation = (90 * Math.PI) / 180
const player3Rotation = (-90 * Math.PI) / 180
const player4Rotation = (180 * Math.PI) / 180

const rewards: Array<[number, number, number, number]> = [
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

const asia_color = '#e10b2b' // 亚洲区
const europe_asia_color = '#e666ff' // 欧亚区
const africa_color = '#705438'
const europ_color = '#9ec8da' // 欧洲区
// South America
const south_america_color = '#a0d878'
const nouth_america_color = '#156a1e'
export const travelMapList1: Array<MapAddress> = [
  {
    index: 0,
    width: 50,
    height: 50,
    position: [102, 102, 1],
    type: PointType.START,
    options: {
      playerId: 0,
      // rotation: (225 * Math.PI) / 180,
      rotation: Math.PI,
    },
  },
  {
    index: 1,
    width: 22,
    height: 50,
    position: [102, 66, 1],
    type: PointType.CITY,

    options: {
      playerId: 0,
      name: '万里长城',
      rotation: player1Rotation,
      texts: ['亚洲区', '中国', '万里长城'],
      color: asia_color,
    },
  },
  {
    index: 2,
    width: 22,
    height: 50,
    position: [102, 44, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '南大门',
      rotation: player1Rotation,
      texts: ['亚洲区', '韩国', '南大门'],
      color: asia_color,
    },
  },
  {
    index: 3,
    width: 22,
    height: 50,
    position: [102, 22, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '金阁寺',
      rotation: player1Rotation,
      texts: ['亚洲区', '日本', '金阁寺'],
      color: asia_color,
    },
  },
  {
    index: 4,
    width: 22,
    height: 50,
    position: [102, 0, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '婆罗浮屠',
      rotation: player1Rotation,
      texts: ['亚洲区', '印尼', '婆罗浮屠'],
      color: asia_color,
    },
  },
  {
    index: 5,
    width: 22,
    height: 50,
    position: [102, -22, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '牛车水',
      rotation: player1Rotation,
      texts: ['亚洲区', '新加坡', '牛车水'],
      color: asia_color,
    },
  },
  {
    index: 6,
    width: 22,
    height: 50,
    position: [102, -44, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '芭达雅沙滩',
      rotation: player1Rotation,
      texts: ['亚洲区', '泰国', '芭达雅', '沙滩'],
      color: asia_color,
    },
  },
  {
    index: 7,
    width: 22,
    height: 50,
    position: [102, -66, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '泰姬玛哈陵',
      rotation: player1Rotation,
      texts: ['亚洲区', '印度', '泰姬', '玛哈陵'],
      color: asia_color,
    },
  },
  {
    index: 8,
    width: 50,
    height: 50,
    position: [102, -102, 1],
    type: PointType.BIG_CITY,
    options: {
      playerId: 0,
      name: '石谷马甸沙勒',
      rotation: (90 * Math.PI) / 180,
      texts: ['亚洲区', '沙特阿拉伯', '石谷', '马甸沙勒'],
      color: asia_color,
    },
  },
  {
    index: 9,
    width: 22,
    height: 50,
    position: [66, -102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '哭墙',
      texts: ['亚洲区', '以色列', '哭墙'],
      color: asia_color,
    },
  },
  // europe_asia_color
  {
    index: 10,
    width: 22,
    height: 50,
    position: [44, -102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '卡帕多西亚',
      texts: ['欧亚区', '土耳其', '卡帕', '多西亚'],
      color: europe_asia_color,
    },
  },
  // africa_color
  {
    index: 11,
    width: 22,
    height: 50,
    position: [22, -102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '金字塔',
      texts: ['非洲区', '埃及', '金字塔'],
      color: africa_color,
    },
  },
  {
    index: 12,
    width: 22,
    height: 50,
    position: [0, -102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '拉利贝拉岩石教堂',
      texts: ['非洲区', '伊索比亚', '拉利贝拉', '岩石教堂'],
      color: africa_color,
    },
  },
  {
    index: 13,
    width: 22,
    height: 50,
    position: [-22, -102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '好望角',
      texts: ['非洲区', '南非', '好望角'],
      color: africa_color,
    },
  },
  {
    index: 14,
    width: 22,
    height: 50,
    position: [-44, -102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '佛卢比里斯',
      texts: ['非洲区', '摩洛哥', '佛卢', '比里斯'],
      color: africa_color,
    },
  },
  {
    index: 15,
    width: 22,
    height: 50,
    position: [-66, -102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '阿尔汗布拉宫',
      texts: ['欧洲区', '西班牙', '阿尔汗', '布拉宫'],
      color: africa_color,
    },
  },
  {
    index: 16,
    width: 50,
    height: 50,
    position: [-102, -102, 1],
    type: PointType.START,
    options: {
      playerId: 0,
      // rotation: Math.PI,
    },
  },
  {
    index: 17,
    width: 22,
    height: 50,
    position: [-102, -66, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '埃菲尔铁塔',
      texts: ['欧洲区', '法国', '埃菲尔', '铁塔'],
      color: europ_color,
      rotation: player3Rotation,
    },
  },
  {
    index: 18,
    width: 22,
    height: 50,
    position: [-102, -44, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '白金汉宫',
      texts: ['欧洲区', '英国', '白金汉宫'],
      color: europ_color,
      rotation: player3Rotation,
    },
  },
  {
    index: 19,
    width: 22,
    height: 50,
    position: [-102, -22, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '新天鹅堡',
      texts: ['欧洲区', '德国', '新天鹅堡'],
      color: europ_color,
      rotation: player3Rotation,
    },
  },
  {
    index: 20,
    width: 22,
    height: 50,
    position: [-102, 0, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '罗马竞技场',
      texts: ['欧洲区', '意大利', '罗马', '竞技场'],
      color: europ_color,
      rotation: player3Rotation,
    },
  },
  {
    index: 21,
    width: 22,
    height: 50,
    position: [-102, 22, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '美泉宫',
      texts: ['欧洲区', '奥地利', '美泉宫'],
      color: europ_color,
      rotation: player3Rotation,
    },
  },
  {
    index: 22,
    width: 22,
    height: 50,
    position: [-102, 44, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '圣母圣殿',
      texts: ['欧洲区', '波兰', '圣母圣殿'],
      color: europ_color,
      rotation: player3Rotation,
    },
  },
  {
    index: 23,
    width: 22,
    height: 50,
    position: [-102, 66, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '圣彼得堡',
      texts: ['欧洲区', '俄罗斯', '圣彼得堡'],
      color: europ_color,
      rotation: player3Rotation,
    },
  },
  {
    index: 24,
    width: 50,
    height: 50,
    position: [-102, 102, 1],
    type: PointType.BIG_CITY,
    options: {
      playerId: 0,
      name: '落基山脉',
      color: nouth_america_color,
      texts: ['北美区', '加拿大', '落基山脉'],
      rotation: (-90 * Math.PI) / 180,
    },
  },
  {
    index: 25,
    width: 22,
    height: 50,
    position: [-66, 102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '大峡谷',
      texts: ['北美区', '美国', '大峡谷'],
      color: nouth_america_color,
      rotation: player4Rotation,
    },
  },
  {
    index: 26,
    width: 22,
    height: 50,
    position: [-44, 102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '迪奥狄华肯',
      texts: ['南美区', '墨西哥', '迪奥', '狄华肯'],
      color: south_america_color,
      rotation: player4Rotation,
    },
  },
  {
    index: 27,
    width: 22,
    height: 50,
    position: [-22, 102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '尼加拉瓜湖',
      texts: ['南美区', '尼加拉瓜', '尼加', '拉瓜湖'],
      color: south_america_color,
      rotation: player4Rotation,
    },
  },
  {
    index: 28,
    width: 22,
    height: 50,
    position: [0, 102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '马丘比丘',
      texts: ['南美区', '秘鲁', '马丘比丘'],
      color: south_america_color,
      rotation: player4Rotation,
    },
  },
  {
    index: 29,
    width: 22,
    height: 50,
    position: [22, 102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '巴拉德罗海滩',
      texts: ['南美区', '古巴', '巴拉德罗', '海滩'],
      color: south_america_color,
      rotation: player4Rotation,
    },
  },
  {
    index: 30,
    width: 22,
    height: 50,
    position: [44, 102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '伊瓜苏瀑布',
      texts: ['南美区', '阿根廷', '伊瓜苏', '瀑布'],
      color: south_america_color,
      rotation: player4Rotation,
    },
  },
  {
    index: 31,
    width: 22,
    height: 50,
    position: [66, 102, 1],
    type: PointType.CITY,
    options: {
      playerId: 0,
      name: '大堡礁',
      texts: ['澳洲区', '澳大利亚', '大堡礁'],
      color: '#f08300',
      rotation: player4Rotation,
    },
  },
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
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
      // imageUrl: require('@/assets/image/icon/temp.jpg'),
      rotation: player4Rotation,
      reward: rewards[5],
    },
  },
]
