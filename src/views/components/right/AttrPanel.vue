<!-- TODO: 这个页面后续将用 JSX 重构 -->
<template>
  <div class="attr-list">
    <a-form layout="vertical">
      <a-form-item :label="map[key]" v-for="key in styleKeys" :key="key">
        <input type="color" v-if="key === 'borderColor'" v-model="selection.style[key]">
        <input type="color" v-else-if="key === 'color'" v-model="selection.style[key]">
        <input type="color" v-else-if="key === 'backgroundColor'" v-model="selection.style[key]">
        <a-select v-else-if="selectKey.includes(key)" v-model:value="selection.style[key]">
          <template v-if="key == 'textAlign'">
            <a-select-option v-for="item in textAlignOptions" :key="item.value" :value="item.value">
              {{item.label}}
            </a-select-option>
          </template>
          <template v-else-if="key == 'borderStyle'">
            <a-select-option v-for="item in borderStyleOptions" :key="item.value" :value="item.value">
              {{item.label}}
            </a-select-option>
          </template>
          <template v-else>
            <a-select-option v-for="item in verticalAlignOptions" :key="item.value" :value="item.value">
              {{item.label}}
            </a-select-option>
          </template>
        </a-select>
        <a-input-number v-else-if="key === 'opacity'" v-model:value="selection.style[key]" :min="0" :max="1.0"
          :step="0.1" />
        <a-input-number v-else v-model:value="selection.style[key]" :min="0" />
      </a-form-item>
      <a-form-item label="内容" v-if="selection && !excludes.includes(selection.component)">
        <a-textarea v-model:value="selection.propValue" showCount :maxlength="100" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { defineComponent, computed } from 'vue';
  import { useStore } from 'vuex'
  export default defineComponent({
    setup() {
      const excludes = ['v-img', 'Group'],
        textAlignOptions = [
          {
            label: '左对齐',
            value: 'left',
          },
          {
            label: '居中',
            value: 'center',
          },
          {
            label: '右对齐',
            value: 'right',
          },
        ],
        borderStyleOptions = [
          {
            label: '实线',
            value: 'solid',
          },
          {
            label: '虚线',
            value: 'dashed',
          },
        ],
        verticalAlignOptions = [
          {
            label: '上对齐',
            value: 'top',
          },
          {
            label: '居中对齐',
            value: 'middle',
          },
          {
            label: '下对齐',
            value: 'bottom',
          },
        ],
        selectKey = ['textAlign', 'borderStyle', 'verticalAlign'],
        map = {
          left: 'x 坐标',
          top: 'y 坐标',
          height: '高',
          width: '宽',
          color: '字颜色',
          backgroundColor: '背景色',
          borderStyle: '边框风格',
          borderWidth: '边框宽度',
          borderColor: '边框颜色',
          borderRadius: '边框半径',
          fontSize: '字体大小',
          fontWeight: '字体粗细',
          lineHeight: '行高',
          letterSpacing: '字间距',
          opacity: '透明度',
          textAlign: '左右对齐',
          verticalAlign: '上下对齐',
        }

      const store = useStore()
      const selection = computed(() => store.state.widget.selection)
      const styleKeys = computed(() =>
        Object.keys(selection.value.style).filter(item => item !== 'rotate') || []
      )

      return {
        excludes,
        textAlignOptions,
        borderStyleOptions,
        verticalAlignOptions,
        selectKey,
        map,
        selection,
        styleKeys
      }
    }
  })
</script>

<style lang="scss" scoped>
  .attr-list {
    overflow: auto;
    padding: 20px;
    padding-top: 0;
    height: 100%;
    font-size: 24px;

    input {
      width: 100%;
      height: 32px;
    }

    .ant-input-number {
      margin-right: 10px;
      width: 100%;
      height: 32px;
    }
  }
</style>