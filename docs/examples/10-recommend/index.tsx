import './index.css'

import { createApp, defineComponent } from 'vue'

import { checkWebpSupported, createSrcTplOfAliOss, ImgDiv, imgPool } from '@robot-img/vue-img'

const App = defineComponent({
  components: {
    'robot-img': ImgDiv,
  },
  render() {
    return <robot-img class="img" src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
  },
})

async function main() {
  // 判断浏览器是否支持 webp 格式图片
  const webp = await checkWebpSupported()
  // 根据云厂商来设置全局图片后缀，获取最适合的图片
  // 这里使用的阿里云的图片处理作为案例
  imgPool.reset({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
    }),
    globalVars: {
      className: 'robot-img',
    },
  })
  // 根据 globalVars.className 设置默认样式
  imgPool.appendDefaultStyle()
  createApp(App).mount(document.getElementById('10-recommend')!)
}

main()
