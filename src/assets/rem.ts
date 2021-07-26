import { SCREEN_WIDTH, REM_SIZE } from '@/config'
import { ACTION, bus } from './bus'

const resizeScale = () => {
  const width = document.body.offsetWidth
  const rem = (width * REM_SIZE) / SCREEN_WIDTH

  document.documentElement.style.fontSize = rem + 'px'
}

resizeScale()

bus.on(ACTION.WINDOW_RESIZE, resizeScale)
