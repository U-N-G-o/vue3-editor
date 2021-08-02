<template>
  <div class="bg">
    <a-button @click="close" class="close">关闭</a-button>
    <div class="canvas-container">
      <div class="canvas" style="width: 100%; height: 100%;">
        <component v-for="item in componentData" :key="item.id" :id="'preview' + item.id" class="component"
          :is="item.component" :style="getStyle(item.style)" :propValue="item.propValue" :element="item"
          @click="handleClick(item.events)" />
      </div>
    </div>
  </div>
</template>

<script>
  import { defineComponent, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import { getStyle } from '@/utils/style'
  import runAnimation from '@/utils/runAnimation'
  import { events } from '@/utils/events'

  export default defineComponent({
    props: {
      show: {
        type: Boolean,
        default: false,
      },
    },
    setup() {
      const store = useStore()
      const componentData = computed(() => store.state.canvas.list)
      const close = () => {
        store.commit('SET_MODE', 'edit')
      }

      onMounted(() => {
        componentData.value.map(component => {
          const activeDom = document.querySelector(`#preview${component.id}`)
          runAnimation(activeDom, component.animations)
        })
      })

      const handleClick = (eventsList) => {
        Object.keys(eventsList).forEach(event => {
          events[event](eventsList[event])
        })
      }

      return {
        componentData,
        getStyle,
        close,
        handleClick
      }
    }
  })
</script>

<style lang="scss" scoped>
  .bg {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    position: fixed;
    background: rgb(0, 0, 0, .5);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
    padding: 20px;

    .canvas-container {
      width: calc(100% - 40px);
      height: calc(100% - 120px);
      overflow: auto;

      .canvas {
        background: #fff;
        position: relative;
        margin: auto;
        position: relative;
        overflow: hidden;

        .component {
          position: absolute;
        }
      }
    }

    .close {
      position: absolute;
      right: 20px;
      top: 20px;
    }
  }
</style>