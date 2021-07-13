import store from '@/store'
import eventBus from '@/utils/eventBus'

const ctrlKey = 17,
  vKey = 86, // 粘贴
  cKey = 67, // 复制
  xKey = 88, // 剪切

  yKey = 89, // 重做
  zKey = 90, // 撤销

  gKey = 71, // 组合
  bKey = 66, // 拆分

  lKey = 76, // 锁定
  uKey = 85, // 解锁

  sKey = 83, // 保存
  pKey = 80, // 预览
  dKey = 68, // 删除
  deleteKey = 46, // 删除
  eKey = 69 // 清空画布

export const keycodes = [66, 67, 68, 69, 71, 76, 80, 83, 85, 86, 88, 89, 90]

// 与组件状态无关的操作
const basemap = {
  [vKey]: paste,
  [yKey]: redo,
  [zKey]: undo,
  [sKey]: save,
  [pKey]: preview,
  [eKey]: clearCanvas,
}

// 组件锁定状态下可以执行的操作
const lockMap = {
  ...basemap,
  [uKey]: unlock,
}

// 组件未锁定状态下可以执行的操作
const unlockMap = {
  ...basemap,
  [cKey]: copy,
  [xKey]: cut,
  [gKey]: compose,
  [bKey]: decompose,
  [dKey]: deleteComponent,
  [deleteKey]: deleteComponent,
  [lKey]: lock,
}

let isCtrlDown = false
// 全局监听按键操作并执行相应命令
export function listenGlobalKeyDown() {
  window.onkeydown = (e) => {
    const { selection } = store.state
    if (e.keyCode == ctrlKey) {
      isCtrlDown = true
    } else if (e.keyCode == deleteKey && selection) {
      store.commit('DEL_COMPONENT')
      store.commit('RECORD')
    } else if (isCtrlDown) {
      if (!selection || !selection.isLock) {
        e.preventDefault()
        unlockMap[e.keyCode] && unlockMap[e.keyCode]()
      } else if (selection && selection.isLock) {
        e.preventDefault()
        lockMap[e.keyCode] && lockMap[e.keyCode]()
      }
    }
  }

  window.onkeyup = (e) => {
    if (e.keyCode == ctrlKey) {
      isCtrlDown = false
    }
  }
}

function copy() {
  store.commit('COPY')
}

function paste() {
  store.commit('PASTE')
  store.commit('RECORD')
}

function cut() {
  store.commit('CUT')
}

function redo() {
  store.commit('REDO')
}

function undo() {
  store.commit('UNDO')
}

function compose() {
  if (store.state.areaData.components.length) {
    store.commit('compose')
    store.commit('RECORD')
  }
}

function decompose() {
  const selection = store.state.selection
  if (selection && !selection.isLock && selection.component == 'Group') {
    store.commit('decompose')
    store.commit('RECORD')
  }
}

function save() {
  eventBus.$emit('save')
}

function preview() {
  eventBus.$emit('preview')
}

function deleteComponent() {
  if (store.state.selection) {
    store.commit('DEL_COMPONENT')
    store.commit('RECORD')
  }
}

function clearCanvas() {
  eventBus.$emit('clearCanvas')
}

function lock() {
  store.commit('LOCK')
}

function unlock() {
  store.commit('UNLOCK')
}
