import { MapAddress, PersonType } from './types'
import { player1MapList, player2MapList, player3MapList, player4MapList } from './object.json'


export const defalutPerson: Array<PersonType> = [
  createPerson(1, '王叔叔', false, '#ff441a', 0, '#d3d37c'),
  createPerson(2, '王妈妈', false, '#a07dbc', 8),
  createPerson(3, '王亚湾', true, '#7090c1', 16),
  createPerson(4, '大雄', true, '#4a6755', 24),
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
  }
  return person
}

export const MapList: Array<MapAddress> = [...player1MapList, ...player2MapList, ...player3MapList, ...player4MapList]
