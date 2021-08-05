import { GameState, MapAddress, PersonType, PointType, ThreeEnvironment } from '@/assets/types'
import { reactive } from 'vue'
import { defalutPerson, workMapList, travelMapList } from '@/assets/setting'
import { randBetween } from '@/assets/index'
import { SETTING } from '@/config'
import PhysicsWorld from '@/assets/physics'
import Player from '@/assets/object/Player'
function initGameState(): GameState {
  return {
    players: defalutPerson,
    activeMap: 0,
    workMapList: [],
    travelMapList: [],
  }
}

export function GameStateStore() {
  const gameState = reactive<GameState>(initGameState())
  let env: ThreeEnvironment | undefined
  let map1: THREE.Mesh | undefined
  let map2: THREE.Mesh | undefined
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
    // resetMapList()
    gameState.currentPlayerId = randBetween(1, 4)
    // gameState.currentPlayerId = 4
    env = undefined
  }

  const setEnv = (e: ThreeEnvironment) => {
    result.env = e
  }

  const setMap1 = (map: THREE.Mesh) => {
    result.map1 = map
  }

  const setMap2 = (map: THREE.Mesh) => {
    result.map2 = map
  }
  const setPhysicsWorld = (p: PhysicsWorld) => {
    result.physicsWorld = p
  }

  // 获取下一个游戏玩家,如果返回false代表游戏结束
  const toggleNextPlayer = () => {
    const playerIndex = gameState.players.findIndex(t => t.id === gameState.currentPlayerId)
    let current = playerIndex + 1 >= gameState.players.length ? 0 : playerIndex + 1

    while (playerIndex !== current) {
      const nextPlayer = gameState.players[current]
      if (nextPlayer.win === 0) {
        gameState.currentPlayerId = nextPlayer.id
        return true
      }
      current++
      if (current >= gameState.players.length) current = 0
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
      player.win =
        gameState.players.reduce((acc, cur) => {
          return acc + cur.win ? 1 : 0
        }, 0) + 1
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

  const result = {
    gameState,
    env,
    map1,
    map2,
    physicsWorld,
    resetGameState,
    setEnv,
    setMap1,
    setMap2,
    setPhysicsWorld,
    toggleNextPlayer,
    changeMoney, // 改变金额
    addPoint, // 增加积分
    findByPlayerId,
    getCurrentAddress, // 获取用户当前所在地址
    getAddressByIndex, // 根据index获取对应地图地址
  }

  return result
}
