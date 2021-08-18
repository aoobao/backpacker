import { THREE } from '@/assets/three/lib'
import { ThreeEnvironment } from '@/assets/types'
// import './index.scss'
import { useStyles } from './index.style'
import { bus, ACTION } from '@/assets/bus'

const material = new THREE.MeshBasicMaterial({
  transparent: true,
  color: 0xff0000,
  opacity: 0,
})

export interface BaseOptions {
  position?: [number, number, number]
  target: THREE.Object3D
  isTop?: boolean
  env: ThreeEnvironment
  extData?: any
  show?: boolean
  offset?: [number, number]
}

export class BaseElement {
  private target: THREE.Object3D
  env: ThreeEnvironment
  private isTop: boolean
  private extData: any
  private offset: [number, number]
  private position: [number, number, number]
  private instance: THREE.Mesh
  private isShow = false

  private el: HTMLElement
  private element?: HTMLElement
  private tick?: number

  constructor(opt: BaseOptions) {
    this.render = this.render.bind(this)

    this.target = opt.target
    this.isTop = opt.isTop === undefined ? true : opt.isTop
    this.env = opt.env
    this.extData = opt.extData
    this.offset = opt.offset || [0, 0]
    this.position = opt.position || [0, 0, 0]
    // create mesh
    const width = 0.2
    const geometry = new THREE.BoxGeometry(width, width, width)
    this.instance = new THREE.Mesh(geometry, material)

    if (opt.position) this.instance.position.set(...opt.position)

    // create base element
    const div = document.createElement('div')
    // div.className = '__base_element_body'
    div.className = useStyles.base_element_body
    div.style.display = 'none'
    this.el = div

    if (opt.show !== false) {
      this.show()
    }

    // bus.on(ACTION.RENDER, this.render)
  }

  updateElement(element: HTMLElement) {
    element.style.position = 'absolute'
    element.style.left = this.offset[0] + 'px'
    element.style.top = this.offset[1] + 'px'

    this.element = element
    this.el.innerHTML = ''
    this.el.appendChild(element)
  }

  getElement() {
    return this.element || null
  }

  setOffset(offset: [number, number]) {
    this.offset = offset
    if (this.element) {
      this.element.style.left = this.offset[0] + 'px'
      this.element.style.top = this.offset[1] + 'px'
    }
  }

  setPosition(position: [number, number, number]) {
    this.position = position
    this.instance.position.set(...this.position)
  }

  getPosition() {
    return [...this.position]
  }

  getExtData() {
    return this.extData
  }

  setExtData(data: any) {
    this.extData = data
  }

  getIsTop() {
    return this.isTop
  }
  setIsTop(top: boolean) {
    this.isTop = top
  }
  show() {
    if (!this.isShow) {
      this.isShow = true

      this.env.domElement.appendChild(this.el)
      this.target.add(this.instance)

      bus.on(ACTION.RENDER, this.render)
      return true
    } else {
      return false
    }
  }

  hide() {
    if (this.isShow) {
      this.isShow = false
      this.target.remove(this.instance)
      this.env.domElement.removeChild(this.el)

      bus.off(ACTION.RENDER, this.render)

      return true
    } else {
      return false
    }
  }

  render() {
    if (this.isShow) {
      const tempV = new THREE.Vector3()
      this.instance.updateWorldMatrix(true, false)
      this.instance.getWorldPosition(tempV)
      const camera = this.env.camera!
      tempV.project(camera)

      let show = true
      if (!this.isTop) {
        const raycaster = this.env.raycaster
        raycaster.setFromCamera(tempV, camera)
        const intersectedObjects = raycaster.intersectObjects(this.env.scene.children)
        show = intersectedObjects.length > 0 && this.instance === intersectedObjects[0].object
      }

      const x = (tempV.x * 0.5 + 0.5) * this.env.width
      const y = (tempV.y * -0.5 + 0.5) * this.env.height
      this.el.style.left = `${x}px`
      this.el.style.top = `${y}px`

      if (show) {
        if (this.tick) {
          clearTimeout(this.tick)
          this.tick = undefined
        }
        this.el.style.display = 'block'
      } else {
        if (!this.tick && this.el.style.display !== 'none') {
          this.tick = setTimeout(() => {
            this.tick = undefined
            this.el.style.display = 'none'
          }, 500)
        }
      }
    }
  }

  destroy() {
    this.hide()
    this.instance.geometry.dispose()
  }
}
