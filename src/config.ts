export const SCREEN_WIDTH = 400

export const REM_SIZE = 100
const money = process.env.VUE_APP_ENV === 'development' ? 20000 : 1000
export const SETTING = {
  winPoints: 40, // 胜利条件:40积分
  initMoney: money, // 初始资金:1000元
  positionZ: -50,
  positionZ2: -1000,
}

export const PREFIX = 'backpacker_'
