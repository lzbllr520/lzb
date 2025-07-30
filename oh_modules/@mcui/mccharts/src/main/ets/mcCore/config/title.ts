export const titleConfig = {
  /**
   * @description 是否显示标题
   * @type {Boolean}
   * @default show = true
   */
  show: false,
  /**
   * @description 标题文本
   * @type {String}
   * @default text = ''
   */
  text: '',
  /**
   * @description 副标题文本
   * @type {String}
   * @default subtext = ''
   */
  subtext: '',
  /**
   * @description 主副标题排版。
   * @type {String}
   * @default direction = 'column'
   * @example direction = 'column'(垂直) | 'row'(水平)
   */
  direction: 'column',
  /**
   * @description 主副标题之间的间距。
   * @type {Number}
   * @default direction = 5
   */
  itemGap: 5,
  /**
   * @description 标题左侧位置
   * @type {String|Number}
   * @default left = 'auto'
   * @example left = 'auto' | '10%' | 10
   */
  left: 'auto',
  /**
   * @description 标题右侧位置
   * @type {String|Number}
   * @default right = 'auto'
   * @example right = 'auto' | '10%' | 10
   */
  right: 'auto',
  /**
   * @description 标题顶部位置
   * @type {String|Number}
   * @default top = 'auto'
   * @example top = 'auto' | '10%' | 10
   */
  top: 'auto',
  /**
   * @description 标题底部位置
   * @type {String|Number}
   * @default bottom = 'auto'
   * @example bottom = 'auto' | '10%' | 10
   */
  bottom: 'auto',
  /**
   * @description 标题偏移量
   * @type {Array}
   * @default offset = [0, -20]
   */
  offset: [0, -20],
  /**
   * @description 标题默认样式配置
   * @type {Object}
   * @default style = {样式类配置}
   */
  textStyle: {
    color: '#333',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'sans-serif	',
    textAlign: 'center',
    textBaseline: 'bottom'
  },
  /**
   * @description 副标题默认样式配置
   * @type {Object}
   * @default style = {样式类配置}
   */
  subtextStyle: {
    color: 'red',
    fontSize: 28,
    fontWeight: '400',
    fontFamily: 'sans-serif	',
    textAlign: 'center',
    textBaseline: 'bottom'
  },
  /**
   * @description 标题渲染层级
   * 渲染优先级高
   * @type {Number}
   * @default rLevel = 20
   */
  rLevel: 20,
  /**
   * @description 标题动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description 标题动画帧数
   * @type {Number}
   * @default animationFrame = 30
   */
  animationFrame:  0
}