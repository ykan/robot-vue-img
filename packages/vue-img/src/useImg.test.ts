import { createApp, defineComponent, h, nextTick, reactive } from 'vue'

import { createImgPool, ImgPool } from '@robot-img/utils'

import { useImg } from './useImg'

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
  if (setupOptions.imgPool) {
    app.provide('imgPool', setupOptions.imgPool)
  }
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
    const prepareImg = jest.fn(() => Promise.resolve(new Image()))
    const onLoaded = jest.fn()
    const { result, app } = renderHook(useImg, {
      props: {
        src: 'ssss',
        loadingType: 'src',
        prepareImg,
        onLoaded,
      },
    })

    expect(result!.state.status).toBe('loading')
    await nextTick()
    expect(result!.state.status).toBe('loaded')

    prepareImg.mockClear()
    onLoaded.mockClear()

    const fakeRect = {}
    result!.loadImg(fakeRect as DOMRect)
    result!.loadImg(fakeRect as DOMRect)

    await nextTick()

    expect(onLoaded).toBeCalledTimes(1)
    expect(prepareImg).toBeCalledTimes(2)

    app.unmount()
  })
  test('load img fail', async () => {
    const prepareImg = jest.fn(() => Promise.reject(new Error('error')))
    const onError = jest.fn()
    const { result, app } = renderHook(useImg, {
      props: {
        src: 'ssss',
        loadingType: 'src',
        prepareImg,
        onError,
      },
    })

    expect(result!.state.status).toBe('loading')
    await nextTick()
    expect(result!.state.status).toBe('error')

    prepareImg.mockClear()
    onError.mockClear()
    const fakeRect = {}
    result!.loadImg(fakeRect as DOMRect)
    result!.loadImg(fakeRect as DOMRect)

    await nextTick()

    expect(onError).toBeCalledTimes(1)
    expect(prepareImg).toBeCalledTimes(2)
    app.unmount()
  })
})

describe('test lazy check', () => {
  test('scroll check', async () => {
    const pool = createImgPool({ name: 'test' }, false)
    const overlap = jest.spyOn(pool, 'overlap')
    overlap.mockReturnValue(false)
    const { result } = renderHook(useImg, {
      props: {
        src: 'ssss',
      },
      imgPool: pool,
    })
    pool.occur('scroll')
    pool.update()
    expect(overlap).toBeCalledTimes(2)

    overlap.mockReturnValue(true)

    pool.occur('scroll')
    pool.update()
    await nextTick()
    expect(result!.state.status).toBe('loaded')
  })
  test('resize check', async () => {
    const pool = createImgPool({ name: 'test' }, false)
    const overlap = jest.spyOn(pool, 'overlap')
    overlap.mockReturnValue(true)
    const shouldUpdate = jest.fn((newRect: DOMRect, oldRect: DOMRect) => {
      return true
    })
    renderHook(useImg, {
      props: {
        src: 'ssss',
        lazy: 'resize',
        shouldUpdate,
      },
      imgPool: pool,
    })
    pool.update()
    expect(overlap).toBeCalledTimes(1)

    await nextTick()
    pool.update()
    await nextTick()
    overlap.mockReturnValue(false)
    await nextTick()
    pool.update()
    await nextTick()
    expect(shouldUpdate).toBeCalledTimes(1)
  })
})

describe('test dom class', () => {
  test('statusPrefix', async () => {
    const { result, props } = renderHook(useImg, {
      props: {
        src: 'ssss',
      },
    })
    props!.statusClassNamePrefix = 'test-'
    await nextTick()

    expect(result?.domProps.class).toBe('test-loaded')
  })
  test('global class', async () => {
    const pool = createImgPool({ globalVars: { className: 'test-img' } }, false)
    const { result } = renderHook(useImg, {
      props: {
        src: 'ssss',
      },
      imgPool: pool,
    })

    expect(result?.domProps.class).toBe('test-img')
  })
})
