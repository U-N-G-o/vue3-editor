import store from './index'
import { swap } from '@/utils/utils'
import toast from '@/utils/toast'

const widget = {
  state: () => ({
    selection: null,
    selectionIndex: null,
  }),
  mutations: {
    LOCK({ selection }) {
      selection.isLock = true
    },
    UNLOCK({ selection }) {
      selection.isLock = false
    },
    SET_SELECTION(state, { component, index }) {
      state.selection = component
      state.selectionIndex = index
    },

    SET_SELECTION_DOM(state, dom) {
      state.selection.dom = dom
    },

    SET_POSITION({ selection }, { top, left, width, height, rotate }) {
      if (top) selection.style.top = top
      if (left) selection.style.left = left
      if (width) selection.style.width = width
      if (height) selection.style.height = height
      if (rotate) selection.style.rotate = rotate
    },

    SET_EVENT({ selection }, { event, param }) {
      selection.events[event] = param
    },

    REMOVE_EVENT({ selection }, event) {
      delete selection.events[event]
    },

    SET_ANIM({ selection }, animation) {
      selection.animations.push(animation)
    },

    REMOVE_ANIM({ selection }, index) {
      selection.animations.splice(index)
    },

    UP_SELECTION({ selectionIndex }) {
      const componentData = store.state.canvas.list
      // 上移图层 index，表示元素在数组中越往后
      if (selectionIndex < componentData.length - 1) {
        swap(componentData, selectionIndex, selectionIndex + 1)
        store.commit('SET_LIST', componentData)
      } else {
        toast('已经到顶了')
      }
    },

    DOWN_SELECTION({ selectionIndex }) {
      const componentData = store.state.canvas.list
      // 下移图层 index，表示元素在数组中越往前
      if (selectionIndex > 0) {
        swap(componentData, selectionIndex, selectionIndex - 1)
        store.commit('SET_LIST', componentData)
      } else {
        toast('已经到底了')
      }
    },

    TOP_SELECTION({ selectionIndex }) {
      const componentData = store.state.canvas.list
      const data = componentData[selectionIndex]
      // 置顶
      if (selectionIndex < componentData.length - 1) {
        componentData.splice(selectionIndex, 1)
        componentData.push(data)
        store.commit('SET_LIST', componentData)
      } else {
        toast('已经到顶了')
      }
    },

    BOTTOM_SELECTION({ selectionIndex }) {
      const componentData = store.state.canvas.list
      const data = componentData[selectionIndex]
      // 置底
      if (selectionIndex > 0) {
        componentData.splice(selectionIndex, 1)
        componentData.unshift(data)
        store.commit('SET_LIST', componentData)
      } else {
        toast('已经到底了')
      }
    },
  }
}

export default widget