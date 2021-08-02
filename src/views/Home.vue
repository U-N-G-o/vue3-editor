<template>
  <Top />
  <main>
    <section class="left">
      <LeftPanel />
    </section>
    <section class="center" @mousewheel="handleWheel">
      <Canvas />
    </section>
    <section class="right">
      <RightPanel />
    </section>
  </main>
</template>

<script>
  import { defineComponent, computed, onMounted } from 'vue';
  import { useStore } from 'vuex'
  import Top from './components/Top.vue';
  import LeftPanel from './components/LeftPanel.vue';
  import RightPanel from './components/RightPanel.vue';
  import Canvas from './components/canvas';
  import { listenGlobalKeyDown } from '@/utils/shortcutKey'

  export default defineComponent({
    name: 'Home',
    components: {
      Top,
      LeftPanel,
      RightPanel,
      Canvas
    },
    setup() {
      const store = useStore()
      const offset = computed(() => store.state.canvas.offset)

      const handleWheel = (e) => {
        const x = offset.value.x - e.deltaX
        const y = offset.value.y - e.deltaY
        store.commit('SET_OFFSET', { x, y })
      }

      onMounted(() => listenGlobalKeyDown())

      return {
        handleWheel
      }
    }
  })
</script>

<style lang="scss">
  main {
    height: calc(100% - 48px);
    position: relative;

    .left {
      position: absolute;
      top: 0;
      left: 0;
      width: 230px;
      height: 100%;
      background-color: #fff;
      padding: 20px 10px;
      box-shadow: rgb(100 100 100 / 20%) 0px 0px 3px 3px;
      z-index: 1;
    }

    .center {
      position: absolute;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: #efefef;
      overflow: hidden;
    }

    .right {
      position: absolute;
      top: 0;
      right: 0;
      width: 268px;
      height: 100%;
      background-color: #fff;
      box-shadow: rgb(100 100 100 / 20%) 0px 0px 3px 3px;
      overflow: auto;
    }
  }
</style>