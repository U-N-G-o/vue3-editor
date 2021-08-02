<template>
  <div v-if="true" class="v-text" @keydown="handleKeydown" @keyup="handleKeyup">
    <!-- tabindex >= 0 使得双击时聚集该元素 -->
    <div :contenteditable="canEdit" :class="{ canEdit }" @dblclick="setEdit" :tabindex="element.id" @paste="clearStyle"
      @mousedown="handleMousedown" @blur="handleBlur" ref="text" v-html="element.propValue" :input="$emit('input')"
      :style="{ verticalAlign: element.style.verticalAlign }"></div>
  </div>
  <div v-else class="v-text preview">
    <div v-html="element.propValue" :style="{ verticalAlign: element.style.verticalAlign }"></div>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue'
  import { keycodes } from '@/utils/shortcutKey'
  import { selectText } from '@/utils/utils'

  export default defineComponent({
    props: {
      propValue: {
        type: String,
        require: true,
      },
      element: {
        type: Object,
      },
    },
    emit: [],
    setup(props, context) {
      const canEdit = ref(false)
      const isCtrlDown = ref(false)
      const text = ref(null)

      const handleInput = (e) => {
        context.emit('input', props.element, e.target.innerHTML)
      }

      const handleKeydown = (e) => {
        if (e.keyCode == 17) {
          isCtrlDown.value = true
        } else if (isCtrlDown.value && canEdit.value && keycodes.includes(e.keyCode)) {
          e.stopPropagation()
        } else if (e.keyCode == 46) { // deleteKey
          e.stopPropagation()
        }
      }

      const handleKeyup = (e) => {
        if (e.keyCode == 17) {
          isCtrlDown.value = false
        }
      }

      const handleMousedown = (e) => {
        if (canEdit.value) {
          e.stopPropagation()
        }
      }

      const clearStyle = (e) => {
        e.preventDefault()
        const clp = e.clipboardData
        const text = clp.getData('text/plain') || ''
        if (text !== '') {
          document.execCommand('insertText', false, text)
        }

        context.emit('input', props.element, e.target.innerHTML)
      }

      const handleBlur = () => {
        // props.propValue = e.target.innerHTML || '&nbsp;'
        canEdit.value = false
      }

      const setEdit = () => {
        canEdit.value = true
        // 全选
        selectText(text.value)
      }


      return {
        canEdit,
        text,
        handleInput,
        handleKeydown,
        handleKeyup,
        handleMousedown,
        clearStyle,
        handleBlur,
        setEdit
      }
    }
  })
</script>

<style lang="scss" scoped>
  .v-text {
    width: 100%;
    height: 100%;
    display: table;

    div {
      display: table-cell;
      width: 100%;
      height: 100%;
      outline: none;
    }

    .canEdit {
      cursor: text;
      height: 100%;
    }
  }

  .preview {
    user-select: none;
  }
</style>