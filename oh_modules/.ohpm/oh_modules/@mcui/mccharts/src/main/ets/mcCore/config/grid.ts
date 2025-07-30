export const gridConfig = {
  // 需要把旧的初始化到这里
  /**
   * @description 网格左边距
   * @type {String|Number}
   * @default left = '10%'
   * @example left = '10%' | 10
   */
  left: '10%',
  /**
   * @description 网格右边距
   * @type {String|Number}
   * @default right = '10%'
   * @example right = '10%' | 10
   */
  right: '8%',
  /**
   * @description 网格顶部边距
   * @type {String|Number}
   * @default top = 60
   * @example top = '10%' | 60
   */
  top: 40,
  /**
   * @description 网格底部边距
   * @type {String|Number}
   * @default bottom = 60
   * @example bottom = '10%' | 60
   */
  bottom: 30,
  /**
   * @description 网格默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  style: {
    color: 'rgba(0, 0, 0, 0)'
  },
  /**
   * @description 网格渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = -30
   */
  rLevel: -30,
  /**
   * @description 网格动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'linear',
  /**
   * @description 网格动画帧数
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame:  0
}