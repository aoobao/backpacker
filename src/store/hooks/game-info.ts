import { GameState, PersonType, ThreeEnvironment } from '@/assets/types'
import { reactive } from 'vue'
import { defalutPerson, resetMapList } from '@/assets/setting'
import { randBetween } from '@/assets/index'
import { SETTING } from '@/config'
import PhysicsWorld from '@/assets/physics'
function initGameState(): GameState {
  return {
    players: defalutPerson,
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
        map: 0,
        map0Index: p.index,
        points: 0,
      }
    })

    resetMapList()
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

  const getNextPlayer = () => {
    // let current = (gameState.currentPlayerId || 0) + 1
    // if (current > gameState.players.length) current = 1
    let current = gameState.players.findIndex(t => t.id === gameState.currentPlayerId)
    current++
    if (current >= gameState.players.length) current = 0
    const nextPlayer = gameState.players[current]

    gameState.currentPlayerId = nextPlayer.id
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
    getNextPlayer,
  }

  return result
}
