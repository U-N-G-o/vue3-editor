import store from './index'

const defaultWidth = 1920
const defaultHeight = 1080
const maxScale = 200
const minScale = 50

const canvas = {
  state: () => ({
    mode: 'edit',
    style: { width: defaultWidth, height: defaultHeight },
    offset: { x: 0, y: 0 },
    scale: 100,
    list: [],
  }),
  mutations: {
    SET_MODE(state, value) {
      state.mode = value
    },
    SET_SCALE(state, value) {
      let nextScale = value
      if (value < minScale) {
        nextScale = minScale
      } else if (value > maxScale) {
        nextScale = maxScale
      }
      state.scale = nextScale
    },
    SET_OFFSET(state, { x, y }) {
      state.offset.x = x
      state.offset.y = y
    },
    SET_STYLE(state, { width, height }) {
      state.style.width = width
      state.style.height = height
    },
    SET_LIST(state, componentData = []) {
      state.list = componentData
    },
    ADD_COMPONENT(state, { component, index }) {
      if (index !== undefined) {
        state.list.splice(index, 0, component)
      } else {
        state.list.push(component)
      }
    },
    DEL_COMPONENT(state, index) {
      if (index === undefined) {
        index = store.state.widget.selectionIndex
      }

      if (index === store.state.widget.selectionIndex) {
        store.commit('SET_SELECTION', { component: null, index: null })
      }

      state.list.splice(index, 1)
    },
  }
}

export default canvas