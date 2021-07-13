<template>
  <div class="animation-list">
    <div class="div-animation">
      <a-button @click="isShowAnimation = true">添加动画</a-button>
      <a-button @click="previewAnimate">预览动画</a-button>
      <div style="margin-top: 5px;">
        <a-tag v-for="(tag, i) in selection.animations" :key="i" closable @close="removeAnimation(i)"
          class="animate-tag">
          {{ tag.label }}
        </a-tag>
      </div>
      <!-- 选择动画 -->
      <a-tabs v-if="isShowAnimation" v-model="animationActiveName" size="small">
        <a-tab-pane v-for="item in animationClassData" :key="item.label" :tab="item.label" class="animation-box">
          <div class="animate" v-for="(animate, index) in item.children" :key="index"
            @mouseover="hoverPreviewAnimate = animate.value" @click="addAnimation(animate)">
            <div :class="[hoverPreviewAnimate === animate.value && animate.value + ' animated']">
              {{ animate.label }}
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, computed } from 'vue';
  import { useStore } from 'vuex'
  import animationClassData from '@/utils/animationClassData'
  import runAnimation from '@/utils/runAnimation'

  export default defineComponent({
    setup() {
      const isShowAnimation = ref(false)
      const showAnimatePanel = ref(false)
      const hoverPreviewAnimate = ref('')
      const animationActiveName = ref('进入')

      const store = useStore()
      const selection = computed(() => store.state.widget.selection)
      const selectionIndex = computed(() => store.state.widget.selectionIndex)

      const addAnimation = (animate) => {
        store.commit('SET_ANIM', animate)
      }

      const previewAnimate = () => {
        const id = selectionIndex.value
        const activeDom = document.querySelector(`#component${id}`).parentNode
        runAnimation(activeDom, selection.value.animations)
      }

      const removeAnimation = (index) => {
        store.commit('REMOVE_ANIM', index)
      }

      return {
        isShowAnimation,
        showAnimatePanel,
        hoverPreviewAnimate,
        animationActiveName,
        selection,
        addAnimation,
        previewAnimate,
        removeAnimation,
        animationClassData
      }
    }
  })
</script>

<style lang="scss">
  .animation-list {

    .ant-tabs {
      height: 100%;
    }


    .animation-box {
      display: grid;
      padding: 0 5px;
      grid-template-columns: repeat(3, 1fr);
      justify-content: flex-start;
      row-gap: 10px;
      column-gap: 5px;
      overflow: hidden;

      .animate {
        font-size: 12px;
        cursor: pointer;


        >div {
          border: 1px solid #ececec;
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
</style>