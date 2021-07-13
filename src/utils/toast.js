import { message } from 'ant-design-vue'

export default function toast(info) {
    message.config({
        top: '50px',
        duration: 2,
        maxCount: 3,
    })
    message.info(info)
}