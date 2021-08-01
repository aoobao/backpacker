// 预加载文件
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { THREE } from './three/lib'

export const enum FILE_TYPE {
  IMAGE = 0,
  GLTF = 1,
}

export interface FileItem {
  id: string
  path: string
  type: FILE_TYPE
  object?: any
}

export const FILE_LIST: Array<FileItem> = [
  {
    id: 'player',
    path: './object/RobotExpressive.glb',
    type: FILE_TYPE.GLTF,
  },
  {
    id: 'logo',
    path: require('@/assets/image/logo.png'),
    type: FILE_TYPE.IMAGE,
  },
  // {
  //   id: 'cube-material',
  //   path: require('@/assets/image/material/cube-material.jpg'),
  //   type: FILE_TYPE.IMAGE,
  // },
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
  if (!file) throw new Error('id未找到')

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
    default:
      return Promise.reject(new Error('错误的文件类型:' + file.type))
  }
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
