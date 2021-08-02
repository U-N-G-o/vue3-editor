<template>
  <div class="event-list">
    <div class="div-events">
      <a-button v-if="isShowEvent === false" @click="isShowEvent = true">添加事件</a-button>
      <div>
        <a-tag v-for="event in Object.keys(selection.events)" :key="event" closable @close="removeEvent(event)">
          {{ event }}
        </a-tag>
      </div>
      <!-- 选择事件 -->
      <a-tabs v-if="isShowEvent" v-model:activeKey="eventActiveName" size="small">
        <a-tab-pane v-for="item in eventList" :key="item.key" :tab="item.label" style="padding: 0 20px">
          <a-input v-if="item.key == 'redirect'" v-model:value="item.param" placeholder="请输入完整的 URL" />
          <a-input v-if="item.key == 'alert'" v-model:value="item.param" placeholder="请输入要 alert 的内容" />
          <a-button style="margin-top: 20px;" @click="addEvent(item.key, item.param)">确定</a-button>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, computed } from 'vue';
  import { useStore } from 'vuex'

  export default defineComponent({
    setup() {
      const isShowEvent = ref(false)
      const eventURL = ref('')
      const eventActiveName = ref('redirect')
      const events = {
        redirect(url) {
          if (url) {
            window.location.href = url
          }
        },

        alert(msg) {
          if (msg) {
            alert(msg)
          }
        },
      }

      const eventList = ref([
        {
          key: 'redirect',
          label: '跳转事件',
          event: events.redirect,
          param: '',
        },
        {
          key: 'alert',
          label: 'alert 事件',
          event: events.alert,
          param: '',
        },
      ])

      const store = useStore()
      const selection = computed(() => store.state.widget.selection)

      const addEvent = (event, param) => {
        store.commit('SET_EVENT', { event, param })
        isShowEvent.value = false
      }

      const removeEvent = (event) => {
        store.commit('REMOVE_EVENT', event)
      }

      return {
        isShowEvent,
        eventURL,
        eventActiveName,
        eventList,
        selection,
        addEvent,
        removeEvent
      }
    }
  })
</script>

<style lang="scss" scoped>
  .event-list {
    .div-events {
      text-align: center;
      padding: 0 20px;
      width: 268px;
      height: 100%;

      .a-button {
        display: inline-block;
        margin-bottom: 10px;
      }

      .a-tag {
        display: block;
        width: 50%;
        margin: auto;
        margin-bottom: 10px;
      }
    }
  }
</style>