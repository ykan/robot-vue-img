import { CSSProperties, defineComponent, PropType } from 'vue'

import { ImgContainer } from './ImgContainer'
import { useImg } from './useImg'

import type { ImgSrcTplPropFn } from '@robot-img/utils'
const props = {
  src: String,
  defaultSrc: String,
  errorSrc: String,
  srcTpl: Function as PropType<ImgSrcTplPropFn>,
  class: String,
  style: Object as PropType<CSSProperties>,
  statusClassNamePrefix: String,
  lazy: [String, Boolean] as PropType<false | 'scroll' | 'resize'>,
  shouldUpdate: Function as PropType<(newRect: DOMRect, oldRect: DOMRect) => boolean>,
  loadingType: String as PropType<'css' | 'src' | 'none'>,
  prepareImg: Function as PropType<
    (
      imgSrc: string,
      crossOrigin?: 'anonymous' | 'use-credentials' | ''
    ) => Promise<HTMLImageElement>
  >,
  crossOrigin: String as PropType<'anonymous' | 'use-credentials' | ''>,
  onError: Function as PropType<(e: string | Event) => void>,
  onLoaded: Function as PropType<(img: HTMLImageElement) => void>,
}
const ImgDiv = defineComponent({
  props,
  setup(props, { attrs, slots }) {
    const { state, imgRef, domProps } = useImg<HTMLDivElement>(props)
    return () => {
      const style = {
        ...props.style,
        backgroundImage: `url(${state.src})`,
      }
      return (
        <div {...attrs} {...domProps} style={style} ref={imgRef}>
          {slots.default}
        </div>
      )
    }
  },
})
const ImgSpan = defineComponent({
  props,
  setup(props, { attrs, slots }) {
    const { state, imgRef, domProps } = useImg<HTMLSpanElement>(props)
    return () => {
      const style = {
        ...props.style,
        backgroundImage: `url(${state.src})`,
      }
      return (
        <span {...attrs} {...domProps} style={style} ref={imgRef}>
          {slots.default}
        </span>
      )
    }
  },
})
const Img = defineComponent({
  props,
  setup(props, { attrs }) {
    const { state, imgRef, domProps, getDefaultSrc } = useImg<HTMLImageElement>(props)
    return () => {
      const src = state.src ? state.src : getDefaultSrc()
      const allOtherProps = {
        ...attrs,
        ...domProps,
        style: props.style,
      }
      return <img {...allOtherProps} src={src} ref={imgRef} />
    }
  },
})

Img.Div = ImgDiv
Img.Span = ImgSpan
Img.Container = ImgContainer

export { Img, ImgDiv, ImgSpan, ImgContainer }
