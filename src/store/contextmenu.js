const contextmenu = {
  state: () => ({
    menuTop: 0,
    menuLeft: 0,
    showMenu: false
  }),
  mutations: {
    SHOW_CONTEXTMENU(state, { top, left }) {
      state.showMenu = true
      state.menuTop = top
      state.menuLeft = left
    },

    HIDE_CONTEXTMENU(state) {
      state.showMenu = false
    }
  }
}

export default contextmenu