import './index.css'

import { createApp, defineComponent } from 'vue'

import { checkWebpSupported, createSrcTplOfAliOss, ImgContainer, ImgDiv } from '@robot-img/vue-img'

async function main() {
  // 判断浏览器是否支持 webp 格式图片
  const webp = await checkWebpSupported()

  const App = defineComponent({
    components: {
      'robot-img': ImgDiv,
      container: ImgContainer,
    },
    setup() {
      const createSrcTpl = createSrcTplOfAliOss({
        webp,
      })
      const globalVars = {
        className: 'container-img',
      }
      return () => (
        <container class="demo-container" createSrcTpl={createSrcTpl} globalVars={globalVars}>
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
          <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
        </container>
      )
    },
  })
  createApp(App).mount(document.getElementById('50-container')!)
}

main()
