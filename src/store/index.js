import { createStore } from 'vuex'
import canvas from './canvas'
import widget from './widget'
import snapshot from './snapshot'
import contextmenu from './contextmenu'
import copy from './copy'

export default createStore({
  modules: {
    canvas,
    widget,
    snapshot,
    contextmenu,
    copy
  }
})
