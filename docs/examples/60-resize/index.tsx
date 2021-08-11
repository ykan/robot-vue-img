import './index.css'

import { createApp, defineComponent, reactive } from 'vue'

import {
  checkWebpSupported,
  createImgPool,
  createSrcTplOfAliOss,
  ImgProps,
  useImg,
} from '@robot-img/vue-img'

async function main() {
  // 阿里云，参考：https://help.aliyun.com/document_detail/44688.html
  const imgPoolAliOss = createImgPool({
    createSrcTpl: createSrcTplOfAliOss({
      webp: await checkWebpSupported(),
    }),
    globalVars: {
      className: 'resize-img-example',
    },
  })

  const ImgDiv = defineComponent({
    setup() {
      const props = reactive<ImgProps>({
        src: '//image-demo.oss-cn-hangzhou.aliyuncs.com/example.jpg',
        lazy: 'resize',
      })
      const { state, domRef, domProps } = useImg<HTMLDivElement>(props)

      const ratio = reactive({
        value: 1,
      })
      const handleAdd = () => {
        ratio.value = Math.min(3, ratio.value * 1.05)
      }
      const handleCut = () => {
        ratio.value = ratio.value * 0.95
      }

      return () => {
        let backgroundImage
        if (state.src) {
          backgroundImage = `url(${state.src})`
        }
        const style = {
          backgroundImage,
          width: `${100 * ratio.value}px`,
          height: `${80 * ratio.value}px`,
        }
        return (
          <>
            <p>
              <button onClick={handleAdd}>宽高变大10%</button>
              <button onClick={handleCut}>宽高变小10%</button>
            </p>
            <div {...domProps} ref={domRef} style={style} />
            <p>current src: ${state.src}</p>
          </>
        )
      }
    },
  })

  const App = defineComponent({
    components: {
      'robot-img': ImgDiv,
    },
    provide: {
      imgPool: imgPoolAliOss,
    },
    setup() {
      return () => (
        <div class="example-resize">
          <robot-img />
        </div>
      )
    },
  })
  createApp(App).mount(document.getElementById('60-resize')!)
}

main()
