// 预加载文件
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { THREE } from './three/lib'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

export const enum FILE_TYPE {
  IMAGE = 0,
  GLTF = 1,
  FBX = 2,
  FONT = 3,
}

export interface FileItem {
  id: string
  path: string
  type: FILE_TYPE
  object?: any
}

export const FILE_LIST: Array<FileItem> = [
  {
    id: 'font',
    path: './font/helvetiker_regular.typeface.json',
    type: FILE_TYPE.FONT,
  },
  {
    id: 'player',
    path: './object/RobotExpressive.glb',
    type: FILE_TYPE.GLTF,
  },
  {
    id: 'arrow',
    path: './object/arrow/Arrow.fbx',
    type: FILE_TYPE.FBX,
  },
  {
    id: 'logo',
    path: require('@/assets/image/logo.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-1',
    path: require('@/assets/image/work/1.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-2',
    path: require('@/assets/image/work/2.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-3',
    path: require('@/assets/image/work/3.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-4',
    path: require('@/assets/image/work/4.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-6',
    path: require('@/assets/image/work/6.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-7',
    path: require('@/assets/image/work/7.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-9',
    path: require('@/assets/image/work/9.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-10',
    path: require('@/assets/image/work/10.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-11',
    path: require('@/assets/image/work/11.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-12',
    path: require('@/assets/image/work/12.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-14',
    path: require('@/assets/image/work/14.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-15',
    path: require('@/assets/image/work/15.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-17',
    path: require('@/assets/image/work/17.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-18',
    path: require('@/assets/image/work/18.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-19',
    path: require('@/assets/image/work/19.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-20',
    path: require('@/assets/image/work/20.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-22',
    path: require('@/assets/image/work/22.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-23',
    path: require('@/assets/image/work/23.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-25',
    path: require('@/assets/image/work/25.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-26',
    path: require('@/assets/image/work/26.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-27',
    path: require('@/assets/image/work/27.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-28',
    path: require('@/assets/image/work/28.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-30',
    path: require('@/assets/image/work/30.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'work-31',
    path: require('@/assets/image/work/31.png'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-1',
    path: require('@/assets/image/travel/1.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-2',
    path: require('@/assets/image/travel/2.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-3',
    path: require('@/assets/image/travel/3.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-4',
    path: require('@/assets/image/travel/4.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-5',
    path: require('@/assets/image/travel/5.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-6',
    path: require('@/assets/image/travel/6.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-7',
    path: require('@/assets/image/travel/7.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-8',
    path: require('@/assets/image/travel/8.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-9',
    path: require('@/assets/image/travel/9.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-10',
    path: require('@/assets/image/travel/10.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-11',
    path: require('@/assets/image/travel/11.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-12',
    path: require('@/assets/image/travel/12.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-13',
    path: require('@/assets/image/travel/13.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-14',
    path: require('@/assets/image/travel/14.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-15',
    path: require('@/assets/image/travel/15.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-17',
    path: require('@/assets/image/travel/17.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-18',
    path: require('@/assets/image/travel/18.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-19',
    path: require('@/assets/image/travel/19.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-20',
    path: require('@/assets/image/travel/20.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-21',
    path: require('@/assets/image/travel/21.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-22',
    path: require('@/assets/image/travel/22.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-23',
    path: require('@/assets/image/travel/23.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-24',
    path: require('@/assets/image/travel/24.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-25',
    path: require('@/assets/image/travel/25.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-26',
    path: require('@/assets/image/travel/26.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-27',
    path: require('@/assets/image/travel/27.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-28',
    path: require('@/assets/image/travel/28.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-29',
    path: require('@/assets/image/travel/29.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-30',
    path: require('@/assets/image/travel/30.jpg'),
    type: FILE_TYPE.IMAGE,
  },
  {
    id: 'travel-31',
    path: require('@/assets/image/travel/31.jpg'),
    type: FILE_TYPE.IMAGE,
  },
]

export function preLoadAllFile(onProgress?: (total: number, finishCount: number) => void) {
  return new Promise((resolve, reject) => {
    const list = FILE_LIST
    const total = list.length
    const result: Array<FileItem> = []
    let isError = false
    const func = () => {
      if (isError) return
      if (result.length < total) {
        onProgress && onProgress(total, result.length)
      } else {
        resolve(result)
      }
    }

    for (let i = 0; i < list.length; i++) {
      const fileItem = list[i]
      loadFile(fileItem)
        .then(obj => {
          const file = FILE_LIST.find(t => t.id === fileItem.id)
          if (file) {
            file.object = obj
          }

          result.push({ ...fileItem, object: obj })
          func()
        })
        .catch(err => {
          isError = true
          reject(err)
        })
    }
  })
}

export function getFile(id: string) {
  const file = FILE_LIST.find(t => t.id === id)
  if (!file) throw new Error('id未找到,id=' + id)

  if (!file.object) throw new Error('未预加载文件')

  return file.object
}

export function getFileById(id: string): Promise<FileItem> {
  return new Promise((resolve, reject) => {
    const file = FILE_LIST.find(t => t.id === id)
    if (!file) {
      reject(new Error('id未找到:' + id))
      return
    }
    // 已经加载过了.
    if (file.object) resolve(file)

    loadFile(file)
      .then(obj => {
        file.object = obj
        resolve({ ...file })
      })
      .catch(err => {
        reject(err)
      })
  })
}

function loadFile(file: FileItem) {
  switch (file.type) {
    case FILE_TYPE.IMAGE:
      return loadImage(file)
    case FILE_TYPE.GLTF:
      return loadGltf(file)
    case FILE_TYPE.FBX:
      return loadFbx(file)
    case FILE_TYPE.FONT:
      return loadFont(file)
    default:
      return Promise.reject(new Error('错误的文件类型:' + file.type))
  }
}

function loadFont(file: FileItem) {
  return new Promise<THREE.Font>((resolve, reject) => {
    const loader = new THREE.FontLoader()
    loader.load(
      file.path,
      font => {
        resolve(font)
      },
      undefined,
      err => {
        reject(err)
      },
    )
  })
}

function loadFbx(file: FileItem) {
  return new Promise<THREE.Group>((resolve, reject) => {
    const loader = new FBXLoader()
    loader.load(
      file.path,
      object => {
        resolve(object)
      },
      undefined,
      err => {
        reject(err)
      },
    )
  })
}

function loadGltf(file: FileItem) {
  return new Promise<GLTF>((resolve, reject) => {
    const loader = new GLTFLoader()

    loader.load(
      file.path,
      gltf => {
        resolve(gltf)
      },
      undefined,
      err => {
        reject(err)
      },
    )
  })
}

function loadImage(file: FileItem) {
  return new Promise((resolve, reject) => {
    const loader = new THREE.ImageLoader()
    loader.load(
      file.path,
      image => {
        resolve(image)
      },
      undefined,
      err => {
        reject(err)
      },
    )
  })
}
