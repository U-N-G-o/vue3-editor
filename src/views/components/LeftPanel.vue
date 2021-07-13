<template>
  <div class="content" @dragstart="handleDrag">
    <a-button v-for="(item, index) in clist" :key="index" :data-index="index" draggable="true">
      <template #icon>
        <FontSizeOutlined v-if="item.icon === 'text'" />
        <SelectOutlined v-else-if="item.icon === 'button'" />
        <PictureOutlined v-else-if="item.icon === 'img'" />
        <BorderOutlined v-else />
      </template>
      {{ item.label }}
    </a-button>
  </div>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import {
    FontSizeOutlined,
    SelectOutlined,
    PictureOutlined,
    BorderOutlined
  } from '@ant-design/icons-vue';
  import cstore from '@/components/component-store'

  export default defineComponent({
    name: 'LeftPanel',
    components: {
      FontSizeOutlined,
      SelectOutlined,
      PictureOutlined,
      BorderOutlined
    },
    setup() {
      const clist = ref(cstore)

      const handleDrag = (e) => {
        e.dataTransfer.setData('index', e.target.dataset.index)
      }

      return {
        clist,
        handleDrag
      }
    }
  })
</script>

<style lang="scss">
  .content {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
  }
</style>