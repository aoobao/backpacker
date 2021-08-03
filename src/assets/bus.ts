import mitt from 'mitt'

export const bus = mitt()

export const ACTION = {
  WINDOW_RESIZE: 'window resize', // 屏幕大小发生变化
  RENDER: 'render', // 屏幕渲染
  WIN: 'win',
  CHANGE_POSITION: 'change position', // 玩家更换位置 {player:PersonType,map:0|1,index:number}
  ADD_LEVEL: 'add level', // 增加熟练度 { index }
}

window.addEventListener('resize', () => {
  const width = document.body.offsetWidth
  const height = document.body.offsetHeight

  bus.emit(ACTION.WINDOW_RESIZE, { width, height })
})

window.addEventListener('orientationchange', () => {
  const width = document.body.offsetWidth
  const height = document.body.offsetHeight
  bus.emit(ACTION.WINDOW_RESIZE, { width, height, orientation: window.orientation })
})
