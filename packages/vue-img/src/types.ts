import type { ImgSrcTplPropFn, ImgPool, ImgPoolOptions } from '@robot-img/utils'
import type { CSSProperties, DefineComponent, Ref } from 'vue'

export interface ImgProps {
  /** 类名 */
  class?: string
  /** 样式 */
  style?: CSSProperties
  /** 图片地址 */
  src?: string

  /**
   * 图片默认地址
   * @default imgPool.globalVars.defaultSrc 如果不设置取全局默认值
   */
  defaultSrc?: string
  /**
   * 出错的时候的图片地址
   * @default imgPool.globalVars.errorSrc 如果不设置取全局默认值
   */
  errorSrc?: string

  /**
   * 可以单个组件自定义，比如
   * ```
   * <RobotImg srcTpl={(attrs) => `${attrs.src}?some_img_params_w=${artts.ratioWidth}`} />
   * ```
   */
  srcTpl?: ImgSrcTplPropFn

  /**
   * 图片不同状态下的样式名前缀
   * @default imgPool.globalVars.statusClassNamePrefix 如果不设置取全局默认值
   */
  statusClassNamePrefix?: string

  /**
   * 懒加载模式
   * @default 'scroll' 默认检测滚动
   */
  lazy?: false | 'scroll' | 'resize'

  /**
   * 当 lazy === 'resize' 时，判断是否要更新图片
   * 默认当面积变大至少20%，才更新图片
   */
  shouldUpdate?: (newRect: DOMRect, oldRect: DOMRect) => boolean

  /**
   * 设置图片为异步加载
   * 这个时候，useImg 返回的 state.status 可能会 blank -> loading -> loaded 或者 blank -> loading -> error
   * 当 loadingType === 'src' 时，状态会体现在 state.src 上，
   *    - state.status === 'loading' 使用 defaultSrc
   *    - state.status === 'error' 使用 errorSrc
   * 当 loadingType === 'css' 时，
   *    - state.status === 'loading' ， state.src = ''
   *    - state.status === 'error'  ， state.src = ''
   * 此时需要根据不同状态下的样式来体现
   * @default imgPool.globalVars.loadingType || 'none' 如果不设置取全局默认值
   */
  loadingType?: 'src' | 'css' | 'none'

  /**
   * 预处理图片
   * 注意当 `loadingType === 'src' || loadingType === 'css'` 存在时，该属性才会生效
   * 默认处理方式：
   * ```ts
   * const img: HTMLImageElement = new Image()
   * if (crossOrigin) {
   *   img.crossOrigin = crossOrigin
   * }
   * img.src = imgSrc
   * ```
   */
  prepareImg?: (
    imgSrc: string,
    crossOrigin?: 'anonymous' | 'use-credentials' | ''
  ) => Promise<HTMLImageElement>

  /**
   * 注意当 `loadingType === 'src' || loadingType === 'css'` 存在时，该属性才会生效
   */
  crossOrigin?: 'anonymous' | 'use-credentials' | ''
  /**
   * 加载失败时调用
   * 注意当 `loadingType === 'src' || loadingType === 'css'` 存在时，该属性才会生效
   */
  onError?: (e: string | Event) => void
  /**
   * 加载成功时调用
   * 注意当 `loadingType === 'src' || loadingType === 'css'` 存在时，该属性才会生效
   */
  onLoaded?: (img: HTMLImageElement) => void
}

export interface ImgState {
  /** 真实使用的 src */
  src: string
  /** 未处理前的 src */
  originSrc: string
  /**
   * 当前状态
   */
  status: 'blank' | 'loading' | 'error' | 'loaded'
  /** 图片节点的 DOMRect */
  rect?: DOMRect
}

/**
 * useImg 返回值
 */
export interface ImgHookResult<T extends HTMLElement = HTMLElement> {
  /** 获取节点 DOM ref */
  imgRef: Ref<T>
  /** 组件状态 */
  state: ImgState
  /** 当前使用的 imgPool */
  imgPool: Ref<ImgPool>
  /** 处理后的 DOM 节点属性 */
  domProps: Pick<ImgProps, 'class' | 'crossOrigin'>
  /** 获取默认图片 */
  getDefaultSrc: () => string
}

// 手写的 ts 类型，用于 ts 类型打包优化
export declare const ImgDiv: DefineComponent<ImgProps>
export declare const ImgSpan: DefineComponent<ImgProps>
export declare const ImgContainer: DefineComponent<Omit<ImgPoolOptions, 'container'>>
export declare const Img: DefineComponent<ImgProps> & {
  Div: typeof ImgDiv
  Span: typeof ImgSpan
  Container: typeof ImgContainer
}
export declare const useImg: <T extends HTMLElement>(props: ImgProps) => ImgHookResult<T>
export declare const imgPool: ImgPool
export * from '@robot-img/utils'
