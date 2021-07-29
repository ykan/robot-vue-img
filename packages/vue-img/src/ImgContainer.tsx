import { defineComponent, onMounted, PropType, provide, ref, watch } from 'vue'

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
    const pool = createImgPool()
    const resetPool = () => {
      if (containerRef.value) {
        const { getContainerRect, tickTime, createSrcTpl, globalVars, name } = props
        pool.reset({
          container: containerRef.value,
          getContainerRect,
          tickTime,
          createSrcTpl,
          globalVars,
          name,
        })
      }
    }
    onMounted(resetPool)
    watch(props, resetPool)
    watch(containerRef, resetPool)
    provide('imgPool', pool)
    return () => (
      <div {...attrs} ref={containerRef}>
        {slots.default}
      </div>
    )
  },
})

export { ImgContainer }
