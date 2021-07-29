import './index.css'

import { createApp, defineComponent, provide } from 'vue'

import {
  checkWebpSupported,
  createImgPool,
  createSrcTplFactory,
  createSrcTplOfAliOss,
  createSrcTplOfKSYunKS3,
  createSrcTplOfTencent,
  ImgDiv,
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
      className: 'cloud-img',
    },
  })
  // 可以用这个方法加一个默认样式，当然自行增加也是 OK 的
  /**
   * 根据 globalVars.className 设置一个全局默认样式
   * 默认样式为：
   * ```
   * .${globalVars.className} {
   *  transition: background-image .3s;
   *  background-size: cover;
   *  background-position: center;
   *  background-repeat: no-repeat;
   * }
   * span.${globalVars.className} {
   *  display: inline-block;
   * }
   * ```
   */
  imgPoolAliOss.appendDefaultStyle()

  const ExampleAliOss = defineComponent({
    components: {
      'robot-img': ImgDiv,
    },
    setup() {
      provide('imgPool', imgPoolAliOss)
      return () => <robot-img src="//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg" />
    },
  })
  // 金山云，详见：https://docs.ksyun.com/documents/886
  const imgPoolK3S = createImgPool({
    createSrcTpl: createSrcTplOfKSYunKS3({
      webp,
    }),
    globalVars: {
      className: 'cloud-img',
    },
  })
  const ExampleK3S = defineComponent({
    components: {
      'robot-img': ImgDiv,
    },
    setup() {
      provide('imgPool', imgPoolK3S)
      return () => <robot-img src="//ks3-cn-beijing.ksyun.com/ks3-resources/suiyi.jpg" />
    },
  })
  // 腾讯云，详见：https://cloud.tencent.com/document/product/460/36541
  const imgPoolTencent = createImgPool({
    createSrcTpl: createSrcTplOfTencent({
      webp,
    }),
    globalVars: {
      className: 'cloud-img',
    },
  })
  const ExampleTencent = defineComponent({
    components: {
      'robot-img': ImgDiv,
    },
    setup() {
      provide('imgPool', imgPoolTencent)
      return () => (
        <robot-img src="//examples-1251000004.cos.ap-shanghai.myqcloud.com/sample.jpeg" />
      )
    },
  })
  // 自定义，以腾讯云为基础，比如自定义 webp 格式的质量
  const createCustomSrcTpl = createSrcTplFactory((globalVars) => ({ rect, src }) => {
    const configs: string[] = []
    if (rect.width && rect.height) {
      const w = Math.floor(globalVars.ratio * rect.width)
      const h = Math.floor(globalVars.ratio * rect.height)
      configs.push(`1/w/${w}/h/${h}`)
    }
    if (globalVars.webp) {
      configs.push('format/webp/quality/90')
    }
    if (configs.length < 1) {
      return src
    }

    return `${src}?imageView2/${configs.join('/')}`
  })
  const imgPoolCustom = createImgPool({
    createSrcTpl: createCustomSrcTpl({
      webp,
    }),
    globalVars: {
      className: 'cloud-img',
    },
  })

  const ExampleCustom = defineComponent({
    components: {
      'robot-img': ImgDiv,
    },
    setup() {
      provide('imgPool', imgPoolCustom)
      return () => (
        <robot-img src="//examples-1251000004.cos.ap-shanghai.myqcloud.com/sample.jpeg" />
      )
    },
  })

  const App = defineComponent({
    components: {
      'example-ali-oss': ExampleAliOss,
      'example-k3s': ExampleK3S,
      'example-tencent': ExampleTencent,
      'example-custom': ExampleCustom,
    },
    render() {
      return (
        <div>
          <p>阿里云：</p>
          <example-ali-oss />
          <p>金山云：</p>
          <example-k3s />
          <p>腾讯云：</p>
          <example-tencent />
          <p>自定义：</p>
          <example-custom />
        </div>
      )
    },
  })
  createApp(App).mount(document.getElementById('10-recommend')!)
}

main()
