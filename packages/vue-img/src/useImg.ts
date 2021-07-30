import {
  inject,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  reactive,
  ref,
  watch,
} from 'vue'

import { ImgItem, ImgPool, waitImgLoaded } from '@robot-img/utils'

import { imgPool as defaultImgPool } from './imgPool'

import type { ImgProps, ImgState } from './types'

function defaultShouldUpdate(newRect: DOMRect, oldRect: DOMRect) {
  const newArea = newRect.width * newRect.height
  const oldArea = oldRect.width * oldRect.height

  // 当面积变大 20% 时，才更新图片
  return newArea > oldArea * 1.2
}

export function useImg<T extends HTMLElement = HTMLElement>(props: ImgProps) {
  const imgRef = ref<T>()
  // const handleRef = useForkRef(ref, imgRef)
  // 要保障整个生命周期只有一个引用
  const imgItemRef = ref<ImgItem>({
    shouldCheck: false,
    onChecked: () => {},
  })
  const imgPool = inject<ImgPool>('imgPool', defaultImgPool)
  const poolRef = ref<ImgPool>(imgPool)
  const state = reactive<ImgState>({
    src: '',
    originSrc: '',
    status: 'blank',
  })
  const loadImgSync = (rect: DOMRect) => {
    const imgSrc = props.src || ''
    const imgSrcTpl = poolRef.value.srcTpl(props.srcTpl)
    state.src = imgSrcTpl({ rect, src: imgSrc })
    state.originSrc = imgSrc
    state.rect = rect
  }
  let currentRunningPromise: Promise<HTMLImageElement>
  const getDefaultSrc = () => props.defaultSrc || poolRef.value.globalVars.defaultSrc || ''
  const loadImgAsync = (rect: DOMRect) => {
    const imgSrc = props.src || ''
    const imgSrcTpl = poolRef.value.srcTpl(props.srcTpl)
    const innerPrepareImg = props.prepareImg || waitImgLoaded
    const innerLoadingType = props.loadingType || poolRef.value.globalVars.loadingType || 'none'
    const finalSrc = imgSrcTpl({ rect, src: imgSrc })
    state.originSrc = imgSrc
    state.rect = rect
    state.status = 'loading'
    if (innerLoadingType === 'src') {
      state.src = getDefaultSrc()
    } else {
      state.src = ''
    }
    const runningPromise = innerPrepareImg(finalSrc, props.crossOrigin)
    currentRunningPromise = runningPromise
    runningPromise.then(
      (img) => {
        if (currentRunningPromise !== runningPromise) {
          return
        }
        state.src = finalSrc
        state.status = 'loaded'
        props.onLoaded?.(img)
      },
      (reason) => {
        if (currentRunningPromise !== runningPromise) {
          return
        }
        if (innerLoadingType === 'src') {
          state.src = props.errorSrc || poolRef.value.globalVars.errorSrc || ''
        } else {
          state.src = ''
        }
        state.status = 'error'
        props.onError?.(reason)
      }
    )
  }
  const loadImg = (rect: DOMRect) => {
    const innerLoadingType = props.loadingType || poolRef.value.globalVars.loadingType || 'none'
    if (innerLoadingType === 'none') {
      return loadImgSync(rect)
    }
    return loadImgAsync(rect)
  }
  const lazyCheckFn = () => {
    imgItemRef.value.shouldCheck = false
    // 额外保障，逻辑正常的话，不应该会走到这
    /* istanbul ignore next */
    if (!imgRef.value) {
      return
    }
    const rect = imgRef.value.getBoundingClientRect()
    if (poolRef.value.overlap(rect)) {
      loadImg(rect)
    } else {
      imgItemRef.value.shouldCheck = true
    }
  }
  const updateCheckFn = () => {
    // 根据心跳函数做判断，节点的 DOMRect 有没有发生变化
    if (state.rect && imgRef.value && poolRef.value.isOverlapWindow) {
      const rect = imgRef.value.getBoundingClientRect()
      // 不在容器内，也不更新
      if (!poolRef.value.overlap(rect)) {
        return
      }
      const innerShouldUpdate = props.shouldUpdate || defaultShouldUpdate
      if (innerShouldUpdate(rect, state.rect)) {
        loadImg(rect)
      }
    }
  }

  const updateWhenSrcChange = () => {
    if (!imgRef.value) {
      return
    }
    if (props.src === '') {
      state.status = 'blank'
      state.originSrc = ''
      state.src = ''
      state.rect = undefined
    }
    const rect = imgRef.value.getBoundingClientRect()
    if (!props.lazy) {
      loadImg(rect)
    }

    // 执行第一次检测，如果不在容器区域范围内，等待下一次检测事件发生
    // 这里不需要考虑 lazy="resize" 的情况，没加载必然都要进行检测
    if (!poolRef.value.overlap(rect)) {
      imgItemRef.value.shouldCheck = true
      imgItemRef.value.onChecked = lazyCheckFn
      return
    }

    loadImg(rect)
  }
  const getDomClass = () => {
    const statusPrefix = props.statusClassNamePrefix || imgPool.globalVars.statusClassNamePrefix
    const classes = []
    if (props.class) {
      classes.push(props.class)
    }
    if (statusPrefix) {
      classes.push(`${statusPrefix}${state.status}`)
    }
    const globalClassName = imgPool.globalVars.className
    if (globalClassName) {
      classes.push(globalClassName)
    }
    return classes.join(' ')
  }

  const domProps = reactive<Pick<ImgProps, 'class' | 'crossOrigin'>>({
    class: getDomClass(),
    crossOrigin: props.crossOrigin,
  })
  onMounted(() => {
    poolRef.value.imgs.add(imgItemRef.value)
    updateWhenSrcChange()

    // 这些值变了，会触发组件更新
    watch(() => props.src, updateWhenSrcChange)
    watch(() => props.srcTpl, updateWhenSrcChange)
    watch(poolRef, updateWhenSrcChange)
    watch(imgRef, updateWhenSrcChange)
  })
  onBeforeUpdate(() => {
    const currentPool = inject<ImgPool>('imgPool', defaultImgPool)
    if (poolRef.value !== currentPool) {
      poolRef.value.imgs.delete(imgItemRef.value)
      poolRef.value = currentPool
      poolRef.value.imgs.add(imgItemRef.value)
    }
  })
  onUpdated(() => {
    if (props.lazy === 'resize' && state.status === 'loaded') {
      imgItemRef.value.onUpdate = updateCheckFn
    } else {
      imgItemRef.value.onUpdate = undefined
    }
  })
  onUnmounted(() => {
    poolRef.value.imgs.delete(imgItemRef.value)
  })

  watch(
    () =>
      `${props.class}${state.status}${poolRef.value.globalVars.className}${poolRef.value.globalVars.statusClassNamePrefix}`,
    () => {
      domProps.class = getDomClass()
    }
  )

  return {
    imgRef,
    domProps,
    state,
    imgPool: poolRef,
    getDefaultSrc,
  }
}
