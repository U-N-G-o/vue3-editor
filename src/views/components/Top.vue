<template>
  <section class="toolbar">
    <div class="toolbar-left">
      <a-tooltip placement="bottom" v-for="(tool, index) in leftList" :key="index" color="#108ee9">
        <template #title>
          <span>{{tool.name}}</span>
        </template>
        <a-button v-if="tool.icon === 'lock'" :type="leftList[index].style" @click="tool.todo($event)"
          :disabled="selection ? false : true">
          <template #icon>
            <component :is="tool.component" />
          </template>
        </a-button>
        <a-button v-else :type="leftList[index].style" @click="tool.todo($event)">
          <template #icon>
            <component :is="tool.component" />
          </template>
        </a-button>
      </a-tooltip>
    </div>
    <div class="toolbar-center">
      <label contenteditable="true" @input="handleRename">{{projectName}}</label>
    </div>
    <div class="toolbar-right">
      <span>画布比例</span>
      <a-input-number v-model:value="scaleRt" :min="0" :max="200" :formatter="value => `${value}%`"
        :parser="value => value.replace('%', '')" size="small" />
    </div>
    <Preview v-if="mode === 'preview'" v-model="showPreview" />
    <input type="file" @change="handleUpload" id="upload" hidden />
  </section>
</template>

<script>
  import { defineComponent, ref, computed, watch, onMounted } from 'vue'
  import { useStore } from 'vuex'
  import {
    UndoOutlined,
    RedoOutlined,
    PictureOutlined,
    PlayCircleOutlined,
    SaveOutlined,
    ClearOutlined,
    LockOutlined,
    UnlockOutlined
  } from '@ant-design/icons-vue'
  import Preview from './Preview'
  import cstore from '@/components/component-store'
  import { deepCopy } from '@/utils/utils'
  import generateID from '@/utils/generateID'
  import toast from '@/utils/toast'
  import eventBus from '@/utils/eventBus'

  export default defineComponent({
    name: 'Top',
    components: {
      UndoOutlined,
      RedoOutlined,
      PictureOutlined,
      PlayCircleOutlined,
      SaveOutlined,
      ClearOutlined,
      LockOutlined,
      UnlockOutlined,
      Preview
    },
    setup() {
      const store = useStore()
      const selection = computed(() => store.state.widget.selection)
      const mode = computed(() => store.state.canvas.mode)
      const leftList = ref([
        {
          icon: 'undo',
          component: 'UndoOutlined',
          style: 'default',
          name: '上一步',
          todo: () => {
            store.commit('UNDO')
          }
        },
        {
          icon: 'redo',
          component: 'RedoOutlined',
          style: 'default',
          name: '下一步',
          todo: () => {
            store.commit('REDO')
          }
        },
        {
          icon: 'img',
          component: 'PictureOutlined',
          style: 'default',
          name: '插入图片',
          todo: (e) => {
            const upload = document.querySelector('#upload')
            upload.click(e)
          }
        },
        {
          icon: 'play',
          component: 'PlayCircleOutlined',
          style: 'default',
          name: '预览',
          todo: () => handlePreview
        },
        {
          icon: 'save',
          component: 'SaveOutlined',
          style: 'default',
          name: '保存',
          todo: () => {
            handleSave()
            toast('保存成功')
          }
        },
        {
          icon: 'clear',
          component: 'ClearOutlined',
          style: 'default',
          name: '清空',
          todo: () => {
            clearCanvas()
          }
        },
        {
          icon: 'lock',
          component: computed(() => selection.value?.isLock ? 'UnlockOutlined' : 'LockOutlined'),
          style: 'default',
          name: computed(() => selection.value?.isLock ? '解锁' : '锁定'),
          todo: () => {
            selection.value?.isLock ? store.commit('UNLOCK') : store.commit('LOCK')
            console.log(selection.value?.isLock)
          }
        },
      ])

      const projectName = ref('new project')

      const reName = ref(false)

      const tabindex = ref(-1)

      const scaleRt = ref('100')

      const showPreview = ref(false)

      const handleSelect = (key) => {
        leftList.value.map(item => item.style = 'default')
        leftList.value[key].style = 'primary'
      }

      const handleRename = (e) => {
        projectName.value = e.target.innerHTML
      }

      const handleUpload = (e) => {
        const file = e.target.files[0]

        if (!file.type.includes('image')) {
          console.log('只能插入图片')
          return
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const canvasDom = document.querySelector('.canvas')
          const rect = canvasDom.getBoundingClientRect()

          const img = new Image()
          const component = deepCopy(cstore[2])
          component.propValue = reader.result
          component.style.top = ~~((rect.height - rect.top) / 2)
          component.style.left = ~~((rect.width - rect.left) / 2)
          component.style.height = 'auto'
          component.id = generateID()
          img.onload = () => {
            store.commit('ADD_COMPONENT', { component })
            store.commit('RECORD')
          }
          img.src = reader.result
        }

      }

      const clearCanvas = () => {
        store.commit('SET_LIST', [])
        store.commit('RECORD')
      }

      const handleSave = () => {
        localStorage.setItem('canvasData', JSON.stringify(store.state.canvas.list))
      }

      const handlePreview = () => {
        showPreview.value = true
        store.commit('SET_MODE', 'preview')
      }

      watch(
        () => scaleRt.value,
        value => {
          store.commit('SET_SCALE', ~~value)
        }
      )

      onMounted(() => {
        eventBus.$on('preview', handlePreview)
        eventBus.$on('save', handleSave)
        eventBus.$on('clearCanvas', clearCanvas)
      })

      return {
        selection,
        mode,
        leftList,
        projectName,
        reName,
        scaleRt,
        showPreview,
        handleRename,
        handleUpload
      }
    }
  })
</script>

<style lang="scss">
  .toolbar {
    position: relative;
    height: 48px;
    padding: 0px 20px;
    background: rgb(255, 255, 255);
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    align-items: center;
    box-shadow: rgb(100 100 100 / 20%) 0px 2px 3px 0px;
    z-index: 107;

    .toolbar-left {
      min-width: 240px;
      display: flex;
      justify-content: space-around;
    }

    .toolbar-center {
      min-width: 200px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;

      label {
        min-width: 20px;
        padding: 0 5px;
      }

      textarea {
        height: 24px;
        resize: none;
        overflow: hidden;
        text-align: center;
        transform: translateY(1px);
      }
    }

    .toolbar-right {
      min-width: 160px;
      height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>