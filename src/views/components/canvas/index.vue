<template>
  <div class="canvas" ref="canvasDom" @drop="handleDrop" @dragover="handleDragOver" @mousedown="handleMouseDown"
    :style="handleStyle">
    <Grid />
    <ContextMenu />
    <div v-if="componentData.length !== 0">
      <BoxBorder v-for="(item, index) in componentData" :key="item.id" :defaultStyle="item.style"
        :style="getShapeStyle(item.style)" :active="item === selection" :element="item" :index="index"
        :class="{ lock: item.isLock }">
        <component v-if="item.component != 'v-text'" class="component" :is="item.component"
          :style="getComponentStyle(item.style)" :propValue="item.propValue" :element="item"
          :id="'component' + item.id" />
        <component v-else class="component" :is="item.component" :style="getComponentStyle(item.style)"
          :propValue="item.propValue" :input="handleInput" :element="item" :id="'component' + item.id" />
      </BoxBorder>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
  import { useStore } from 'vuex'
  import Grid from './Grid'
  import BoxBorder from './BoxBorder'
  import ContextMenu from './ContextMenu'
  import { deepCopy } from '@/utils/utils'
  import { getStyle } from '@/utils/style'
  import generateID from '@/utils/generateID'
  import cstore from '@/components/component-store'

  export default defineComponent({
    name: 'Canvas',
    components: {
      Grid,
      BoxBorder,
      ContextMenu
    },
    setup() {
      const store = useStore()
      const componentData = computed(() => { return store.state.canvas.list })
      const selection = computed(() => { return store.state.widget.selection })
      const canvasScale = computed(() => { return store.state.canvas.scale })
      const canvasStyle = computed(() => store.state.canvas.style)
      const offset = computed(() => store.state.canvas.offset)
      const copyData = computed(() => store.state.copy.copyData)
      const canvasDom = ref()
      const isCtrlDown = ref(false)

      const handleStyle = computed(() => {
        const ratio = canvasScale.value / 100
        const { width, height } = canvasStyle.value
        return {
          width: width + 'px',
          height: height + 'px',
          transform: `translate(${offset.value.x}px, ${offset.value.y}px) scale(${ratio})`
        }
      })

      const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const list = e.dataTransfer.files

        // 组件栏拖拽
        if (list.length === 0) {
          const component = deepCopy(cstore[e.dataTransfer.getData('index')])
          component.style.top = e.offsetY - component.style.height / 2
          component.style.left = e.offsetX - component.style.width / 2
          component.id = generateID()
          store.commit('ADD_COMPONENT', { component })
          store.commit('RECORD')
        } else {
          // 本地图片拖拽
          Array.from(list).map(item => {

            const reader = new FileReader();
            reader.readAsDataURL(item);

            if (item.type.includes('image')) {
              reader.onload = () => {
                const img = new Image()
                const component = deepCopy(cstore[2])
                component.propValue = reader.result
                component.style.top = e.offsetY - component.style.height / 2
                component.style.left = e.offsetX - component.style.width / 2
                component.style.height = 'auto'
                component.id = generateID()
                img.onload = () => {
                  store.commit('ADD_COMPONENT', { component })
                  store.commit('RECORD')
                }
                img.src = reader.result
              }
            }
          })
        }
      }

      const handleDragOver = (e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      }

      const handleMouseDown = (e) => {
        e.preventDefault()
        if (e.button === 0) {
          store.commit('SET_SELECTION', { component: null, index: null })
          store.commit('HIDE_CONTEXTMENU')
        }

        if (e.button === 1) {
          const startX = e.clientX
          const startY = e.clientY

          const offsetX = offset.value.x
          const offsetY = offset.value.y

          const move = (moveEvent) => {
            const x = moveEvent.clientX - startX + offsetX
            const y = moveEvent.clientY - startY + offsetY
            store.commit('SET_OFFSET', { x, y })
          }

          const up = () => {
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', up)
          }

          document.addEventListener('mousemove', move)
          document.addEventListener('mouseup', up)
        }

        if (e.button === 2 && (!!selection.value || !!copyData.value)) {
          if (e.target.localName === 'section') return

          let top = e.clientY
          let left = e.clientX

          if (window.innerHeight - top < 330 && selection.value) {
            top = e.clientY - 320
          } else if (window.innerHeight - top < 60) {
            top = e.clientY - 48
          }

          store.commit('SHOW_CONTEXTMENU', { top, left })
        }
      }

      const getShapeStyle = (style) => {
        const result = {};
        ['width', 'height', 'top', 'left', 'rotate'].forEach(attr => {
          if (attr != 'rotate') {
            result[attr] = style[attr] + 'px'
          } else {
            result.transform = 'rotate(' + style[attr] + 'deg)'
          }
        })

        return result
      }

      const getComponentStyle = (style) => {
        return getStyle(style, ['top', 'left', 'width', 'height', 'rotate'])
      }

      const handleInput = (element, value) => {
        // 根据文本组件高度调整 shape 高度
        console.log(element, value)
      }

      const resetID = (data) => {
        data.forEach(item => {
          item.id = generateID()
        })

        return data
      }

      const restore = () => {
        // 用保存的数据恢复画布
        if (localStorage.getItem('canvasData')) {
          store.commit('SET_LIST', resetID(JSON.parse(localStorage.getItem('canvasData'))))
        }

        // if (localStorage.getItem('canvasStyle')) {
        //     store.commit('setCanvasStyle', JSON.parse(localStorage.getItem('canvasStyle')))
        // }
        store.commit('RECORD')
      }

      const onOffsetChange = (x, y) => {
        store.commit('SET_OFFSET', { x, y })
      }

      const onScaleChange = (scale) => {
        store.commit('SET_SCALE', scale)
      }

      const onZoom = (nextScale, originX, originY) => {
        const scale = canvasScale.value
        const { x, y } = offset.value
        nextScale = Math.min(Math.max(nextScale, 20), 400)
        const scaleD = nextScale / scale
        if (scaleD === 1) return
        const newX = originX + scaleD * (x - originX)
        const newY = originY + scaleD * (y - originY)
        onOffsetChange(newX, newY)
        onScaleChange(nextScale)
      }

      const handleWheel = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isCtrlDown.value) {
          const scale = canvasScale.value
          const delta = Math.max(-1, Math.min(e.deltaY, 1))
          const { top, left, right, bottom } = canvasDom.value.getBoundingClientRect()
          const centerX = (left + right) / 2
          const centerY = (top + bottom) / 2

          const nextScale = scale <= 100 ? scale - delta * 5 : scale - scale * delta * 0.05
          const originX = e.pageX - centerX
          const originY = e.pageY - centerY
          onZoom(nextScale, originX, originY)
        } else {
          onOffsetChange(offset.value.x - e.deltaX, offset.value.y - e.deltaY)
        }
      }

      const keyDown = (e) => {
        if (e.keyCode == 17) {
          isCtrlDown.value = true
        }
      }

      const keyUp = (e) => {
        if (e.keyCode == 17) {
          isCtrlDown.value = false
        }
      }

      onMounted(() => {
        restore()
        window.addEventListener('contextmenu', handleMouseDown)
        window.addEventListener('keydown', keyDown)
        window.addEventListener('keyup', keyUp)
        canvasDom.value.addEventListener('wheel', handleWheel, { passive: false })
      })

      onUnmounted(() => {
        window.removeEventListener('contextmenu', handleMouseDown)
        window.removeEventListener('keydown', keyDown)
        window.removeEventListener('keyup', keyUp)
        canvasDom.value.removeEventListener('wheel', handleWheel, { passive: false })
      })

      return {
        canvasDom,
        componentData,
        selection,
        handleStyle,
        handleDrop,
        handleDragOver,
        getShapeStyle,
        getComponentStyle,
        handleInput,
        handleMouseDown
      }
    }
  })
</script>

<style lang="scss">
  .canvas {
    position: relative;
    background-color: #fff;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .lock {
      opacity: .5;
    }

    .component {
      outline: none;
      width: 100%;
      height: 100%;
    }
  }
</style>