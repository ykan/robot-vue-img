import './index.css'

import { createApp, defineComponent, provide } from 'vue'

import {
  checkWebpSupported,
  createImgPool,
  createSrcTplOfAliOss,
  ImgDiv,
  ImgSrcTplPropFn,
} from '@robot-img/vue-img'

async function main() {
  // 判断浏览器是否支持 webp 格式图片
  const webp = await checkWebpSupported()

  // 阿里云，参考：https://help.aliyun.com/document_detail/44688.html
  const imgPoolAliOss = createImgPool({
    createSrcTpl: createSrcTplOfAliOss({
      webp,
    }),
    globalVars: {
      className: 'tpl-img',
    },
  })
  imgPoolAliOss.appendDefaultStyle()

  const App = defineComponent({
    components: {
      'robot-img': ImgDiv,
    },
    setup() {
      provide('imgPool', imgPoolAliOss)
      const srcTpl: ImgSrcTplPropFn = ({ src, ratioWidth, ratioHeight, webp }) =>
        `${src}?x-oss-process=image/resize,m_lfit,w_${ratioWidth},h_${ratioHeight}${
          webp ? '/format,webp' : ''
        }/blur,r_3,s_2`
      return () => (
        <robot-img srcTpl={srcTpl} src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
      )
    },
  })
  createApp(App).mount(document.getElementById('40-tpl')!)
}

main()
