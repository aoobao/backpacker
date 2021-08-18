import { BaseOptions, BaseElement } from '../BaseElement'
// import './index.scss'
import { useStyles } from './index.style'

interface Options extends BaseOptions {
  click: (extData: any) => void
}

export default class PointSelect extends BaseElement {
  private click: (extData: any) => void
  constructor(opts: Options) {
    super({
      ...opts,
      offset: [-50, -30],
    })

    this.clickHandle = this.clickHandle.bind(this)

    this.click = opts.click

    this.createElement()
  }

  private createElement() {
    const div = document.createElement('div')
    // div.className = '__point_select_container'
    div.className = useStyles.point_select
    div.addEventListener('click', this.clickHandle, false)

    super.updateElement(div)
  }

  private clickHandle() {
    const data = super.getExtData()

    this.click(data)
  }

  destroy() {
    super.destroy()
  }
}
