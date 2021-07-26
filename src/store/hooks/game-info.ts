import { GameState, PersonType, ThreeEnvironment } from '@/assets/types'
import { reactive } from 'vue'
import { defalutPerson } from '@/assets/setting'
import { randBetween } from '@/assets/index'
import { SETTING } from '@/config'
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

    gameState.currentPlayerId = randBetween(1, 4)
    // gameState.currentPlayerId = 2

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

  const result = {
    gameState,
    env,
    map1,
    map2,
    resetGameState,
    setEnv,
    setMap1,
    setMap2,
  }

  return result
}
