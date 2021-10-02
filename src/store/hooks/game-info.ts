import { GameState, MapAddress, PersonType, PointType, ThreeEnvironment } from '@/assets/types'
import { reactive, computed } from 'vue'
import { defalutPerson, workMapList, travelMapList, getOutOrderTravelMapList } from '@/assets/setting'
import { randItemInList } from '@/assets/index'
import { SETTING } from '@/config'
import PhysicsWorld from '@/assets/physics'
import Player from '@/assets/object/Player'
function initGameState(): GameState {
  return {
    players: defalutPerson,
    activeMap: 0,
    workMapList: [],
    travelMapList: [],
    hotCitys: [[], [], [], []],
  }
}

export function GameStateStore() {
  const gameState = reactive<GameState>(initGameState())
  let env: ThreeEnvironment | undefined
  let map0: THREE.Mesh | undefined
  let map1: THREE.Mesh | undefined
  let physicsWorld: PhysicsWorld | undefined

  // 重新开始游戏
  const resetGameState = (players: Array<PersonType>) => {
    gameState.players = players.map(p => {
      return {
        ...p,
        money: SETTING.initMoney,
        map: 0, // TEST
        map0Index: p.index,
        points: 0,
        win: 0,
      }
    })

    gameState.workMapList = workMapList.map(t => {
      const w: MapAddress = {
        ...t,
        options: { ...t.options },
      }
      if (w.type === PointType.WORK) {
        w.options.level = 0
      }
      return w
    })

    gameState.travelMapList = travelMapList.map(t => {
      const w: MapAddress = {
        ...t,
        options: { ...t.options },
      }
      return w
    })

    // 热门景点
    const addressList = getOutOrderTravelMapList()
    const hotList8 = addressList.splice(0, 4)
    const hotList7 = addressList.splice(0, 5)
    const hostList6 = addressList.splice(0, 6)

    gameState.hotCitys = [hotList8, hotList7, hostList6, addressList]

    const playerIds = players.filter(t => !t.isAI).map(t => t.id)
    if (playerIds.length === 0) {
      // 如果全部都是机器人,随机选一个
      const ids = players.map(t => t.id)
      gameState.currentPlayerId = randItemInList(ids)
    } else {
      gameState.currentPlayerId = randItemInList(playerIds)
    }

    // console.log(gameState.hotCitys)
    // gameState.currentPlayerId = 4
    env = undefined
  }

  const setGameState = (gs: GameState) => {
    gameState.players = gs.players
    gameState.workMapList = gs.workMapList
    gameState.travelMapList = gs.travelMapList
    gameState.currentPlayerId = gs.currentPlayerId
    gameState.activeMap = gs.activeMap
    gameState.hotCitys = gs.hotCitys
  }

  const setEnv = (e: ThreeEnvironment) => {
    result.env = e
  }

  const setMap0 = (map: THREE.Mesh) => {
    result.map0 = map
  }

  const setMap1 = (map: THREE.Mesh) => {
    result.map1 = map
  }
  const setPhysicsWorld = (p: PhysicsWorld) => {
    result.physicsWorld = p
  }

  // 获取下一个游戏玩家,如果返回false代表游戏结束
  const toggleNextPlayer = () => {
    // 是否还有玩家没有胜利
    const hasPerson = gameState.players.some(t => t.win === 0 && !t.isAI)
    // 是否至少有一个赢了.
    const hasWin = gameState.players.some(t => t.win > 0)

    // 如果所有玩家都胜利了,并且至少有一个胜利(可能存在4个AI在比赛,比出第一名即可)
    if (!hasPerson && hasWin) {
      gameState.currentPlayerId = 0
      return false
    }

    const playerIndex = gameState.players.findIndex(t => t.id === gameState.currentPlayerId)
    let current = playerIndex + 1 >= gameState.players.length ? 0 : playerIndex + 1
    let c = 0
    while (c <= gameState.players.length) {
      const nextPlayer = gameState.players[current]
      if (nextPlayer.win === 0) {
        gameState.currentPlayerId = nextPlayer.id
        // currentId = nextPlayer.id
        return true
      }
      current++
      if (current >= gameState.players.length) current = 0
      c++
    }

    // 全部都胜利了.
    gameState.currentPlayerId = 0
    return false
  }

  const changeMoney = (playerId: number, money: number) => {
    const player = gameState.players.find(t => t.id === playerId)
    if (!player) throw new Error('未找到对应玩家:' + playerId)
    player.money += money

    return player.money
  }

  const addPoint = (playerId: number, num: number) => {
    const player = findByPlayerId(playerId)
    player.points += num
    // 胜利逻辑
    if (player.points >= SETTING.winPoints) {
      const count = gameState.players.filter(t => t.win > 0).length

      player.win = count + 1
      return true
    } else {
      return false
    }
  }

  const findByPlayerId = (playerId: number): PersonType => {
    const player = gameState.players.find(t => t.id === playerId)
    if (!player) throw new Error('未找到对应玩家:' + playerId)

    return player
  }

  const getAddressByIndex = (index: number, map: 0 | 1 = 0) => {
    const list = map === 0 ? gameState.workMapList : gameState.travelMapList
    const address = list.find(t => t.index === index)

    if (!address) throw new Error('未找到对应地图位置:' + index + ',map=' + map)

    return address
  }

  const getCurrentAddress = (p: Player) => {
    const player = p.player
    const mapIndex = player.map === 0 ? player.map0Index : player.map1Index
    const mapList = player.map === 0 ? gameState.workMapList : gameState.travelMapList

    const address = mapList[mapIndex]

    return address
  }

  // 移除热门城市 index:0 8积分热门城市 1 :7积分,2:6积分 3:5积分
  const removeHotCity = (index: number) => {
    const cityList = gameState.hotCitys[index]

    if (cityList.length > 0) {
      const city = cityList.splice(cityList.length - 1, 1)
      return city
    } else {
      throw new Error('未找到热门城市,index=' + index)
    }
  }

  const hot8 = computed(() => {
    const lists = gameState.hotCitys[0]
    if (lists.length) return lists[lists.length - 1]
    return null
  })

  const hot7 = computed(() => {
    const lists = gameState.hotCitys[1]
    if (lists.length) return lists[lists.length - 1]
    return null
  })

  const hot6 = computed(() => {
    const lists = gameState.hotCitys[2]
    if (lists.length) return lists[lists.length - 1]
    return null
  })

  const hot5 = computed(() => {
    const lists = gameState.hotCitys[3]
    if (lists.length) return lists[lists.length - 1]
    return null
  })

  // const getPointsByCityIndex = (index: number) => {
  //   if(hot8.value?.index)
  // }

  const result = {
    setGameState,
    gameState,
    env,
    map0,
    map1,
    physicsWorld,
    hot8,
    hot7,
    hot6,
    hot5,
    resetGameState,
    setEnv,
    setMap0,
    setMap1,
    setPhysicsWorld,
    toggleNextPlayer,
    changeMoney, // 改变金额
    addPoint, // 增加积分
    findByPlayerId,
    getCurrentAddress, // 获取用户当前所在地址
    getAddressByIndex, // 根据index获取对应地图地址
    removeHotCity, // 移除一个热门城市
  }

  return result
}
