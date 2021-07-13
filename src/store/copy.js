import store from './index'
import toast from '@/utils/toast'
import generateID from '@/utils/generateID'
import { deepCopy } from '@/utils/utils'

const copy = {
  state: {
    copyData: null, // 复制粘贴剪切
    isCut: false,
  },
  mutations: {
    COPY(state) {
      if (!store.state.widget.selection) return
      state.copyData = {
        data: deepCopy(store.state.widget.selection),
        index: store.state.widget.selectionIndex,
      }

      state.isCut = false
    },

    PASTE(state, isMouse) {
      if (!state.copyData) {
        toast('请选择组件')
        return
      }

      const data = state.copyData.data

      if (isMouse) {
        data.style.top = store.state.contextmenu.menuTop - store.state.canvas.offset.y - 48
        data.style.left = store.state.contextmenu.menuLeft - store.state.canvas.offset.x
      } else {
        data.style.top += 10
        data.style.left += 10
      }

      data.id = generateID()
      store.commit('ADD_COMPONENT', { component: deepCopy(data) })
      if (state.isCut) {
        state.copyData = null
      }
    },

    CUT(state) {
      if (!store.state.widget.selection) {
        toast('请选择组件')
        return
      }

      if (state.copyData) {
        const data = deepCopy(state.copyData.data)
        const index = state.copyData.index
        data.id = generateID()
        store.commit('ADD_COMPONENT', { component: data, index })
        if (store.state.widget.selectionIndex >= index) {
          // 如果当前组件索引大于等于插入索引，需要加一，因为当前组件往后移了一位
          store.state.widget.selectionIndex++
        }
      }

      store.commit('COPY')
      store.commit('DEL_COMPONENT', store.state.widget.selectionIndex)
      state.isCut = true
    },
  },
}

export default copy