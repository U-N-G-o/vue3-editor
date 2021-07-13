import store from './index'
import { deepCopy } from '@/utils/utils'

const snapshot = {
  state: () => ({
    snapshotData: [], // 编辑器快照数据
    snapshotIndex: -1,
  }),
  mutations: {
    UNDO(state) {
      if (state.snapshotIndex >= 0) {
        state.snapshotIndex--
        store.commit('SET_LIST', deepCopy(state.snapshotData[state.snapshotIndex]))
      }
    },
    REDO(state) {
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotIndex++
        store.commit('SET_LIST', deepCopy(state.snapshotData[state.snapshotIndex]))
      }
    },
    RECORD(state) {
      // 添加新的快照
      state.snapshotData[++state.snapshotIndex] = deepCopy(store.state.canvas.list)
      // 在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
      if (state.snapshotIndex < state.snapshotData.length - 1) {
        state.snapshotData = state.snapshotData.slice(0, state.snapshotIndex + 1)
      }
    },
  }
}

export default snapshot