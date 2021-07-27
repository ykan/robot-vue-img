import Vue from 'vue'

import { imgPool as defaultImgPool } from './imgPool'

import type { ImgItem, ImgPool } from '@robot-img/utils'

import type { ImgProps, ImgState } from './types'

function defaultShouldUpdate(newRect: DOMRect, oldRect: DOMRect) {
  const newArea = newRect.width * newRect.height
  const oldArea = oldRect.width * oldRect.height

  // 当面积变大 20% 时，才更新图片
  return newArea > oldArea * 1.2
}

export function useImg<
  P extends Vue.HTMLAttributes = Vue.HTMLAttributes,
  T extends HTMLElement = HTMLElement
>(props: ImgProps<P>) {
  const {
    src = '',
    srcTpl,
    defaultSrc,
    errorSrc,
    lazy = 'scroll',
    class: className,
    statusClassNamePrefix,
    loadingType,
    crossOrigin,
    onError,
    onLoaded,
    shouldUpdate = defaultShouldUpdate,
    prepareImg,
    ...othersProps
  } = props
  const imgRef = Vue.ref<T>()
  // const handleRef = useForkRef(ref, imgRef)
  // 要保障整个生命周期只有一个引用
  const imgItemRef = Vue.ref<ImgItem>({
    shouldCheck: false,
    onChecked: () => {},
  })
  const imgPool = Vue.inject<ImgPool>('imgPool', defaultImgPool)
  const poolRef = Vue.ref<ImgPool>(imgPool)
  const state = Vue.reactive<ImgState>({
    src: '',
    originSrc: '',
    status: 'blank',
  })
  Vue.onMounted(() => {
    poolRef.value.imgs.add(imgItemRef.value)
  })
  Vue.onBeforeUpdate(() => {
    const currentPool = Vue.inject<ImgPool>('imgPool', defaultImgPool)
    if (poolRef.value !== currentPool) {
      poolRef.value.imgs.delete(imgItemRef.value)
      poolRef.value = currentPool
      poolRef.value.imgs.add(imgItemRef.value)
    }
  })
  Vue.onUnmounted(() => {
    poolRef.value.imgs.delete(imgItemRef.value)
  })
  Vue.onMounted(() => {
    if (!imgRef.value) {
      return
    }
  })

  return {
    ref: imgRef,
    state,
    domProps: othersProps,
  }
}
