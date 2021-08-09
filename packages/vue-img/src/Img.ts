import { CSSProperties, defineComponent, h, PropType } from 'vue'

import { ImgContainer } from './ImgContainer'
import { useImg } from './useImg'

import type { ImgSrcTplPropFn } from '@robot-img/utils'

export const imgProps = {
  src: String,
  defaultSrc: String,
  errorSrc: String,
  srcTpl: Function as PropType<ImgSrcTplPropFn>,
  class: String,
  style: Object as PropType<CSSProperties>,
  statusClassNamePrefix: String,
  lazy: String as PropType<'off' | 'scroll' | 'resize'>,
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
  props: imgProps,
  setup(props, { attrs, slots }) {
    const { state, domRef, domProps } = useImg<HTMLDivElement>(props)
    return () => {
      let backgroundImage
      if (state.src) {
        backgroundImage = `url(${state.src})`
      }
      const style = {
        ...props.style,
        backgroundImage,
      }
      return h(
        'div',
        {
          ...attrs,
          ...domProps,
          style,
          ref: domRef,
        },
        slots.default?.()
      )
    }
  },
})
const ImgSpan = defineComponent({
  props: imgProps,
  setup(props, { attrs, slots }) {
    const { state, domRef, domProps } = useImg<HTMLSpanElement>(props)
    return () => {
      let backgroundImage
      if (state.src) {
        backgroundImage = `url(${state.src})`
      }
      const style = {
        ...props.style,
        backgroundImage,
      }
      return h(
        'span',
        {
          ...attrs,
          ...domProps,
          style,
          ref: domRef,
        },
        slots.default?.()
      )
    }
  },
})
const Img = defineComponent({
  props: imgProps,
  setup(props, { attrs }) {
    const { state, domRef, domProps, getDefaultSrc } = useImg<HTMLImageElement>(props)
    return () => {
      const src = state.src ? state.src : getDefaultSrc()
      return h('img', {
        ...attrs,
        ...domProps,
        style: props.style,
        src,
        ref: domRef,
      })
    }
  },
})

Img.Div = ImgDiv
Img.Span = ImgSpan
Img.Container = ImgContainer

export { Img, ImgDiv, ImgSpan, ImgContainer }
