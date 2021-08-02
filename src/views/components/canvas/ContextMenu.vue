<template>
  <teleport to="body">
    <div class="contextmenu" v-show="showMenu" :style="{ top: menuTop + 'px', left: menuLeft + 'px' }">
      <ul>
        <template v-if="selection">
          <template v-if="!selection.isLock">
            <li @click="copy">复制</li>
            <li @click="paste">粘贴</li>
            <li @click="cut">剪切</li>
            <li @click="deleteComponent">删除</li>
            <li @click="lock">锁定</li>
            <li @click="topComponent">置顶</li>
            <li @click="bottomComponent">置底</li>
            <li @click="upComponent">上移</li>
            <li @click="downComponent">下移</li>
          </template>
          <li v-else @click="unlock">解锁</li>
        </template>
        <li v-else @click="paste">粘贴</li>
      </ul>
    </div>
  </teleport>
</template>

<script>
  import { defineComponent, computed } from 'vue'
  import { useStore } from 'vuex'

  export default defineComponent({
    setup() {
      const store = useStore()
      const selection = computed(() => store.state.widget.selection)
      const showMenu = computed(() => store.state.contextmenu.showMenu)
      const menuTop = computed(() => store.state.contextmenu.menuTop)
      const menuLeft = computed(() => store.state.contextmenu.menuLeft)
      const copyData = computed(() => store.state.copy.copyData)

      const lock = () => {
        store.commit('LOCK')
        store.commit('HIDE_CONTEXTMENU')
      }

      const unlock = () => {
        store.commit('UNLOCK')
        store.commit('HIDE_CONTEXTMENU')
      }

      const cut = () => {
        store.commit('CUT')
        store.commit('HIDE_CONTEXTMENU')
      }

      const copy = () => {
        store.commit('COPY')
        store.commit('SET_SELECTION', { component: null, index: null })
        store.commit('HIDE_CONTEXTMENU')
      }

      const paste = () => {
        store.commit('PASTE', true)
        store.commit('RECORD')
        store.commit('HIDE_CONTEXTMENU')
      }

      const deleteComponent = () => {
        store.commit('DEL_COMPONENT')
        store.commit('RECORD')
        store.commit('HIDE_CONTEXTMENU')
      }

      const upComponent = () => {
        store.commit('UP_SELECTION')
        store.commit('RECORD')
        store.commit('HIDE_CONTEXTMENU')
      }

      const downComponent = () => {
        store.commit('DOWN_SELECTION')
        store.commit('RECORD')
        store.commit('HIDE_CONTEXTMENU')
      }

      const topComponent = () => {
        store.commit('TOP_SELECTION')
        store.commit('RECORD')
        store.commit('HIDE_CONTEXTMENU')
      }

      const bottomComponent = () => {
        store.commit('BOTTOM_SELECTION')
        store.commit('RECORD')
        store.commit('HIDE_CONTEXTMENU')
      }
      return {
        selection, showMenu, menuLeft, menuTop, copyData, lock, unlock, cut, copy, paste, deleteComponent, upComponent, downComponent, topComponent, bottomComponent
      }
    }
  })
</script>

<style lang="scss" scoped>
  .contextmenu {
    position: absolute;
    z-index: 1000;

    ul {
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      box-sizing: border-box;
      margin: 5px 0;
      padding: 6px 0;

      li {
        font-size: 14px;
        padding: 0 20px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #606266;
        height: 34px;
        line-height: 34px;
        box-sizing: border-box;
        cursor: pointer;

        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
  }
</style>