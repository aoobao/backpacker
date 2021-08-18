import { createUseStyles } from '@/assets/jss'

const style = {
  point_select: {
    width: 100,
    height: 100,
    backgroundImage: `url('${require('@/components/TouchView/touch.gif')}')`,
    backgroundSize: '100% 100%',
  },
}

export const useStyles = createUseStyles(style)
