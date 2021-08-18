import { MapAddress, PersonType, PointType } from './types'
import { player1MapList, player2MapList, player3MapList, player4MapList } from './object.json'
import Player from './object/Player'
import { travelMapList1 } from '@/assets/object.json'
import { randBetween } from './index'
export const defalutPerson: Array<PersonType> = [
  createPerson(1, '王叔叔', false, '#ff441a', 0, '#ff441a'), // '#d3d37c'
  createPerson(2, '王妈妈', true, '#a07dbc', 8, '#a07dbc'),
  createPerson(3, '王亚湾', true, '#7090c1', 16, '#7090c1'),
  createPerson(4, '大雄', true, '#4a6755', 24, '#4a6755'),
]

function createPerson(id: number, name: string, isAI: boolean, color: string, index: number, color2?: string, addressIndex?: number): PersonType {
  const person: PersonType = {
    id,
    name,
    isAI,
    color,
    color2: color2 || color,
    money: 0,
    index,
    map: 0,
    map0Index: addressIndex === undefined ? index : addressIndex,
    map1Index: 0,
    points: 0,
    win: 0,
  }
  return person
}

// 打工地图
export const workMapList: Array<MapAddress> = [...player1MapList, ...player2MapList, ...player3MapList, ...player4MapList]

// 旅游地图
export const travelMapList: Array<MapAddress> = [...travelMapList1]

export function getNextAddress(p: Player) {
  const player = p.player
  let mapIndex = player.map === 0 ? player.map0Index : player.map1Index
  const mapList = player.map === 0 ? workMapList : travelMapList

  mapIndex++
  if (mapIndex === mapList.length) mapIndex = 0

  const address = mapList[mapIndex]

  return address
}

export function getOutOrderTravelMapList() {
  const list = travelMapList
    .filter(t => t.type === PointType.CITY || t.type === PointType.BIG_CITY)
    .map(t => {
      return {
        ...t,
        width: 30,
        height: 50,
      }
    })
  for (let i = 0; i < list.length; i++) {
    const z = randBetween(0, list.length - 1)
    const temp = list[i]
    list[i] = list[z]
    list[z] = temp
  }

  return list
}
