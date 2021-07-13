// 公共样式
export const commonStyle = {
  rotate: 0,
  opacity: 1,
}

export const commonAttr = {
  animations: [],
  events: {},
  groupStyle: {}, // 当一个组件成为 Group 的子组件时使用
  isLock: false, // 是否锁定组件
}

// 编辑器左侧组件列表
const cstore = [
  {
    component: 'v-text',
    label: '文字',
    propValue: '双击编辑文字',
    icon: 'text',
    style: {
      width: 200,
      height: 22,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: '#000000',
    },
  },
  {
    component: 'v-button',
    label: '按钮',
    propValue: '按钮',
    icon: 'button',
    style: {
      width: 100,
      height: 34,
      borderWidth: 1,
      borderColor: '#000000',
      borderRadius: '',
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: '',
      color: '#000000',
      backgroundColor: '#ffffff',
    },
  },
  {
    component: 'v-img',
    label: '图片',
    icon: 'img',
    propValue: require('../assets/logo.png'),
    style: {
      width: 300,
      height: 200,
      borderRadius: '',
    },
  },
  {
    component: 'v-rect',
    label: '矩形',
    propValue: '&nbsp;',
    icon: 'rect',
    style: {
      width: 200,
      height: 200,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '',
      letterSpacing: 0,
      textAlign: 'center',
      color: '#000000',
      borderColor: '#000000',
      borderWidth: 1,
      backgroundColor: '#ffffff',
      borderStyle: 'solid',
      verticalAlign: 'middle',
    },
  },
]

for (let i = 0, len = cstore.length; i < len; i++) {
  const item = cstore[i]
  item.style = { ...commonStyle, ...item.style }
  cstore[i] = { ...commonAttr, ...item }
}

export default cstore