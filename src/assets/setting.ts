import { MapAddress, PersonType, PointType } from './types'
import { player1MapList, player2MapList, player3MapList, player4MapList } from './object.json'
import Player from './object/Player'
import { travelMapList1 } from '@/assets/object.json'
export const defalutPerson: Array<PersonType> = [
  createPerson(1, '王叔叔', false, '#ff441a', 0), // '#d3d37c'
  createPerson(2, '王妈妈', false, '#a07dbc', 8),
  createPerson(3, '王亚湾', false, '#7090c1', 16),
  createPerson(4, '大雄', false, '#4a6755', 24),
]

function createPerson(id: number, name: string, isAI: boolean, color: string, index: number, color2?: string): PersonType {
  const person: PersonType = {
    id,
    name,
    isAI,
    color,
    color2: color2 || color,
    money: 0,
    index,
    map: 0,
    map0Index: index,
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

// export function getCurrentAddress(p: Player) {
//   const player = p.player
//   const mapIndex = player.map === 0 ? player.map0Index : player.map1Index
//   const mapList = player.map === 0 ? workMapList : travelMapList

//   const address = mapList[mapIndex]

//   return address
// }

// export function resetMapList() {
//   workMapList.forEach(w => {
//     if (w.type === PointType.WORK) {
//       w.options.level = 0
//     }
//   })
// }

// export function getAddressByIndex(index: number, map: 0 | 1 = 0) {
//   const list = map === 0 ? workMapList : travelMapList
//   const address = list.find(t => t.index === index)

//   if (!address) throw new Error('未找到对应地图位置:' + index + ',map=' + map)

//   return address
// }
