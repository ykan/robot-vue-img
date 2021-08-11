import { defineComponent, h, onMounted, PropType, provide, ref, watch } from 'vue'

import { createImgPool, ImgPoolGlobals, ImgRect, ImgSrcTplFactoryResult } from '@robot-img/utils'

const ImgContainer = defineComponent({
  props: {
    getContainerRect: Function as PropType<(rect: DOMRect) => ImgRect>,
    tickTime: Number,
    createSrcTpl: Function as PropType<ImgSrcTplFactoryResult>,
    globalVars: Object as PropType<ImgPoolGlobals>,
    name: String,
  },
  setup(props, { attrs, slots }) {
    const containerRef = ref<HTMLDivElement>()
    const pool = createImgPool({
      ...props,
    })
    const resetPoolContainer = () => {
      if (containerRef.value) {
        pool.reset({
          container: containerRef.value,
        })
      }
    }
    onMounted(() => {
      resetPoolContainer()
      watch(
        () => props.getContainerRect,
        () => pool.reset({ getContainerRect: props.getContainerRect })
      )
      watch(
        () => props.name,
        () => pool.reset({ name: props.name })
      )
      watch(
        () => props.tickTime,
        () => pool.reset({ tickTime: props.tickTime })
      )
      watch(
        () => props.globalVars,
        () => pool.reset({ globalVars: props.globalVars })
      )
      watch(
        () => props.createSrcTpl,
        () => pool.reset({ createSrcTpl: props.createSrcTpl })
      )
      watch(containerRef, resetPoolContainer)
    })

    provide('imgPool', pool)
    return () => {
      return h(
        'div',
        {
          ...attrs,
          ref: containerRef,
        },
        slots.default?.()
      )
    }
  },
})

export { ImgContainer }
