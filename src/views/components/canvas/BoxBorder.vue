<template>
  <div class="shape" ref="border" :class="{active}" @click="selectCurComponent" @mousedown="handleMouseDownOnShape">
    <span class="icon-rotate" v-show="active && !element.isLock" @mousedown="handleRotate">
      <RedoOutlined />
    </span>
    <span class="iconfont icon-lock" v-show="element.isLock">
      <LockOutlined />
    </span>
    <div class="shape-point" v-for="item in (active && !element.isLock ? pointList : [])" :key="item"
      :style="getPointStyle(item)" @mousedown="handleMouseDownOnPoint(item, $event)">
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import { defineComponent, ref, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import calculateShape from '@/utils/calculateShape'
  import { mod360 } from '@/utils/translate'
  import { RedoOutlined, LockOutlined } from '@ant-design/icons-vue'

  export default defineComponent({
    props: {
      active: {
        type: Boolean,
        default: false,
      },
      element: {
        require: true,
        type: Object,
      },
      defaultStyle: {
        require: true,
        type: Object,
      },
      index: {
        require: true,
        type: [Number, String],
      },
    },
    components: {
      RedoOutlined,
      LockOutlined
    },
    setup(props) {
      const store = useStore()
      const editMode = ref(false)
      const pointList = ref(['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'])
      const initialAngle = { // 每个点对应的初始角度
        nw: 0,
        n: 45,
        ne: 90,
        e: 135,
        se: 180,
        s: 225,
        sw: 270,
        w: 315,
      }
      const angleToCursor = [ // 每个范围的角度对应的光标
        { start: 338, end: 23, cursor: 'nw' },
        { start: 23, end: 68, cursor: 'n' },
        { start: 68, end: 113, cursor: 'ne' },
        { start: 113, end: 158, cursor: 'e' },
        { start: 158, end: 203, cursor: 'se' },
        { start: 203, end: 248, cursor: 's' },
        { start: 248, end: 293, cursor: 'sw' },
        { start: 293, end: 338, cursor: 'w' },
      ]
      const cursors = ref({})
      const border = ref(null)
      const position = { ...props.defaultStyle }

      const selectCurComponent = (e) => {
        e.stopPropagation()
        e.preventDefault()
        editMode.value = !editMode.value
      }

      const getPointStyle = (point) => {
        const { width, height } = props.defaultStyle
        const hasN = /n/.test(point)
        const hasS = /s/.test(point)
        const hasE = /e/.test(point)
        const hasW = /w/.test(point)
        let newLeft = 0
        let newTop = 0

        // 四个角的点
        if (point.length === 2) {
          newLeft = hasW ? 0 : width
          newTop = hasN ? 0 : height
        } else {
          // 上下两点的点，宽度居中
          if (hasN || hasS) {
            newLeft = width / 2
            newTop = hasN ? 0 : height
          }

          // 左右两边的点，高度居中
          if (hasW || hasE) {
            newLeft = hasW ? 0 : width
            newTop = Math.floor(height / 2)
          }
        }

        const style = {
          marginLeft: '-4px',
          marginTop: '-4px',
          left: `${newLeft}px`,
          top: `${newTop}px`,
          cursor: cursors.value[point],
        }

        return style
      }

      const getCursor = () => {
        const rotate = mod360(position.rotate) // 取余 360
        const result = {}
        let lastMatchIndex = -1 // 从上一个命中的角度的索引开始匹配下一个，降低时间复杂度

        pointList.value.forEach(point => {
          const angle = mod360(initialAngle[point] + rotate)
          const len = angleToCursor.length
          while (point) {
            lastMatchIndex = (lastMatchIndex + 1) % len
            const angleLimit = angleToCursor[lastMatchIndex]
            if (angle < 23 || angle >= 338) {
              result[point] = 'nw-resize'
              return
            }
            if (angleLimit.start <= angle && angle < angleLimit.end) {
              result[point] = angleLimit.cursor + '-resize'
              return
            }
          }
        })

        return result
      }

      onMounted(() => cursors.value = getCursor())

      const handleMouseDownOnShape = (e) => {

        if (e.button === 1) {
          return
        } else {
          e.preventDefault()
          e.stopPropagation()
          store.commit('SET_SELECTION', { component: props.element, index: props.index })
          if (e.button === 0 && !props.element.isLock) {
            const startX = e.clientX
            const startY = e.clientY

            const startLeft = position.left
            const startTop = position.top

            let hasMove = false

            const move = (moveEvent) => {
              hasMove = true
              position.left = moveEvent.clientX - startX + startLeft
              position.top = moveEvent.clientY - startY + startTop
              store.commit('SET_POSITION', { left: position.left, top: position.top })
            }

            const up = () => {
              hasMove && store.commit('RECORD')
              document.removeEventListener('mousemove', move)
              document.removeEventListener('mouseup', up)
            }

            document.addEventListener('mousemove', move)
            document.addEventListener('mouseup', up)
          }
        }
      }

      const handleMouseDownOnPoint = (pointName, e) => {
        e.stopPropagation()
        e.preventDefault()

        // 中心点位置
        const center = {
          x: position.left + position.width / 2,
          y: position.top + position.height / 2,
        }

        const pointRect = e.target.getBoundingClientRect()
        const canvasRect = document.querySelector('.canvas').getBoundingClientRect()
        // 点击的点相对于画布的位置，即点在画布上的坐标
        const pointPosition = {
          x: pointRect.left - canvasRect.left + 0.5 * pointRect.width,
          y: pointRect.top - canvasRect.top + 0.5 * pointRect.height
        }

        // 对称点坐标
        const symmetricPoint = {
          x: center.x + (center.x - pointPosition.x),
          y: center.y + (center.y - pointPosition.y)
        }

        // 防止第一次点击误触发移动
        let hasMove = false

        const move = (moveEvent) => {
          if (!hasMove) {
            hasMove = true
            return
          }

          const curPosition = {
            x: moveEvent.clientX - canvasRect.left,
            y: moveEvent.clientY - canvasRect.top,
          }

          calculateShape(pointName, position, curPosition, symmetricPoint)

          store.commit('SET_POSITION', position)
        }
        const up = () => {
            document.removeEventListener('mousemove', move)
            document.removeEventListener('mouseup', up)
            hasMove && store.commit('RECORD')
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
      }

      const handleRotate = (e) => {
        e.preventDefault()
        e.stopPropagation()

        const rect = border.value.getBoundingClientRect()

        const startX = e.clientX
        const startY = e.clientY
        const startR = position.rotate

        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.width / 2

        const preRotate = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180)

        let hasMove = false

        const move = (moveEvent) => {
          hasMove = true
          const curX = moveEvent.clientX
          const curY = moveEvent.clientY

          const curRotate = Math.atan2(curY - centerY, curX - centerX) / (Math.PI / 180)

          position.rotate = Math.floor(startR + curRotate - preRotate)
          store.commit('SET_POSITION', position)
        }

        const up = () => {
          hasMove && store.commit('RECORD')
          document.removeEventListener('mousemove', move)
          document.removeEventListener('mouseup', up)
          cursors.value = getCursor()
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('mouseup', up)
      }

      return {
        editMode,
        pointList,
        border,
        getPointStyle,
        selectCurComponent,
        handleMouseDownOnShape,
        handleMouseDownOnPoint,
        handleRotate
      }
    }
  })
</script>

<style lang="scss" scoped>
  .shape {
    position: absolute;

    &:hover {
      cursor: move;
    }
  }

  .active {
    outline: 1px solid #70c0ff;
    user-select: none;
  }

  .shape-point {
    position: absolute;
    background: #fff;
    border: 1px solid #59c7f9;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    z-index: 1;
  }

  .icon-rotate {
    position: absolute;
    top: -34px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 16px;
    font-weight: 600;
    cursor: grab;
    color: #59c7f9;
    font-size: 20px;
    font-weight: 600;

    &:active {
      cursor: grabbing;
    }
  }

  .icon-lock {
    position: absolute;
    top: 0;
    right: 2px;
  }
</style>