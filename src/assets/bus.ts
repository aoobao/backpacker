import mitt from 'mitt'

export const bus = mitt()

export const ACTION = {
  WINDOW_RESIZE: 'window resize', // 屏幕大小发生变化
  RENDER: 'render', // 屏幕渲染
  WIN: 'win',
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
