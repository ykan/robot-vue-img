import { createApp, defineComponent, h, nextTick, provide, reactive } from 'vue'

import { useImg } from './useImg'

import type { ImgPool } from '@robot-img/utils'

import type { ImgProps } from './types'
type HookResult = ReturnType<typeof useImg>

interface Instance {
  result?: HookResult
  props?: ImgProps
}

interface SetupOptions {
  props?: ImgProps
  imgPool?: ImgPool
}
// function waitTime(ms: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms)
//   })
// }
function renderHook(hookFn: (props: ImgProps) => HookResult, setupOptions: SetupOptions = {}) {
  const instance: Instance = {}
  const Img = defineComponent({
    setup() {
      const props = reactive<ImgProps>(setupOptions.props || {})
      if (setupOptions.imgPool) {
        provide('imgPool', setupOptions.imgPool)
      }
      const r = hookFn(props)
      instance.result = r
      instance.props = props

      return () => {
        return h('div', {
          ...r.domProps,
          ...r.state,
          ref: r.domRef,
        })
      }
    },
  })
  const app = createApp(Img)
  app.mount('body')

  return {
    get result() {
      return instance.result
    },
    get props() {
      return instance.props
    },
    app,
  }
}

describe('组件渲染', () => {
  test('render hook', async () => {
    const { result, props, app } = renderHook(useImg, {
      props: {
        src: 'ssss',
        lazy: 'off',
      },
    })
    expect(result!.domRef).toBeDefined()
    expect(result!.state.src).toBe('ssss')
    expect(result!.state.originSrc).toBe('ssss')
    expect(result!.state.status).toBe('loaded')

    props!.class = 'test'
    await nextTick()

    expect(result!.domProps.class).toBe('test')
    props!.src = ''
    await nextTick()
    expect(result!.state.src).toBe('')
    expect(result!.state.status).toBe('blank')
    app.unmount()
    // expect(getResult()!.domProps.class).toBe('test-img')
  })
})

describe('load img async', () => {
  test('load img succes', async () => {
    const { result, app } = renderHook(useImg, {
      props: {
        src: 'ssss',
        loadingType: 'src',
        prepareImg: jest.fn(() => Promise.resolve(new Image())),
      },
    })

    expect(result!.state.status).toBe('loading')
    await nextTick()
    expect(result!.state.status).toBe('loaded')
    app.unmount()
  })
  test('load img fail', async () => {
    const { result, app } = renderHook(useImg, {
      props: {
        src: 'ssss',
        loadingType: 'src',
        prepareImg: jest.fn(() => Promise.reject(new Error('error'))),
      },
    })

    expect(result!.state.status).toBe('loading')
    await nextTick()
    expect(result!.state.status).toBe('error')
    app.unmount()
  })
})
