import { randBetween } from '.'
import { GameState, HotCity, MapAddress, PersonType, PointType } from './types'
import { travelMapList } from './setting'
// 选择旅游起点
export function chooseStartPoint(gameState: GameState): MapAddress {
  const startPoints = gameState.travelMapList.filter(t => t.type === PointType.START)

  const index = randBetween(0, startPoints.length - 1)

  return startPoints[index]
}

export function chooseGoTravel(player: PersonType) {
  if (player.money > 8000) {
    return true
  } else if (player.money < 2000) {
    return false
  }
  return Math.random() > 0.5
}

// 是否继续旅游
export function chooseTravelContinue(player: PersonType) {
  // 大于3000元永远选择继续旅游
  // 小于1000元用于选择回来打工
  if (player.money > 3000) {
    return true
  } else if (player.money < 1000) {
    return false
  } else {
    return Math.random() > 0.5
  }
}

export function getStep(p: PersonType, getPointValue: (index: number) => HotCity | null) {
  let maxPoints = 0
  let bestStep = 0
  for (let i = 0; i <= 3; i++) {
    const cost = i * 500
    if (p.money < cost) break
    let index = p.map1Index + i

    if (index >= travelMapList.length) {
      index -= travelMapList.length
    }

    const hotCity = getPointValue(index)
    if (hotCity) {
      if (maxPoints < hotCity.point) {
        maxPoints = hotCity.point
        bestStep = i
      }
    }
  }
  return bestStep
}
