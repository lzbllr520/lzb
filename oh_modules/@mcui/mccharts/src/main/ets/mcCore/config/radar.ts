export const radarConfig = {
  /**
   * @description 是否显示此雷达图
   * @type {Boolean}
   * @default show = true
   */
  show: true,
  /**
   * @description 图例名称
   * @type {String}
   * @default name = ''
   */
  name: '',
  /**
   * @description 雷达图数据
   * @type {Array}
   * @default data = []
   * @example data = [100, 200, 300]
   */
  data: [],
  /**
   * @description 雷达图默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  radarStyle: {
    lineWidth: 1
  },
  /**
   * @description 雷达图点配置
   * @type {Object}
   */
  point: {
    /**
     * @description 是否显示雷达图点
     * @type {Boolean}
     * @default show = true
     */
    show: false,
    /**
     * @description 点的半径
     * @type {Number}
     * @default radius = 2
     */
    radius: 2,
    /**
     * @description 雷达图点默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      color: '#fff',
      borderWidth: 1,
      borderColor: ''
    }
  },
  /**
   * @description 雷达图标签配置
   * @type {Object}
   */
  label: {
    /**
     * @description 是否显示雷达图标签
     * @type {Boolean}
     * @default show = true
     */
    show: false,
    /**
     * @description 标签位置偏移
     * @type {Array}
     * @default offset = [0, 0]
     */
    offset: [0, 0],
    /**
     * @description 标签与雷达图之间的间隙
     * @type {Number}
     * @default labelGap = 5
     */
    labelGap: 5,
    /**
     * @description 标签格式化
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = 'Score-{value}'
     * @example formatter = (label) => (label)
     */
    formatter: null,
    /**
     * @description 雷达图标签默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 20,
      color: ''
    }
  },
  /**
   * @description 区域填充样式
   * @type {Object}
   */
  areaStyle: {
    /**
     * @description 是否显示雷达图区域填充
     * @type {Boolean}
     * @default show = true
     */
    show: false,
    /**
     * @description 填充的颜色
     * @type {String|Array}
     * @default color = ''
     */
    color: null
  },

  /**
   * @description 雷达图渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = 10
   */
  rLevel: 10,
  /**
   * @description 雷达图动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description 雷达图动画帧数
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame:  30
}