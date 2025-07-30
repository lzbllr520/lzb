export const pieConfig = {
  /**
   * @description 是否显示此饼图
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
   * @description 饼图半径
   * @type {String|Number|Array}
   * @default radius = '50%'
   * @example radius = '50%' | 100
   */
  radius: '50%',
  /**
   * @description 饼图中心点
   * @type {Array}
   * @default center = ['50%','50%']
   * @example center = ['50%','50%'] | [100, 100]
   */
  center: ['50%', '50%'],
  /**
   * @description 饼图起始角度
   * @type {Number}
   * @default startAngle = -Math.PI / 2
   * @example startAngle = -Math.PI
   */
  startAngle: -Math.PI / 2,
  /**
   * @description 是否启用玫瑰型
   * @type {Boolean}
   * @default roseType = false
   */
  roseType: false,
  /**
   * @description 玫瑰型自动排序
   * @type {Boolean}
   * @default roseSort = true
   */
  roseSort: true,
  /**
   * @description 玫瑰型半径增加量
   * @type {String|Number}
   * @default roseIncrement = 'auto'
   * @example roseIncrement = 'auto' | '10%' | 10
   */
  roseIncrement: 'auto',
  /**
   * @description 饼图数据
   * @type {Array}
   * @default data = []
   */
  data: [],
  /**
   * @description 饼图内部标签配置
   * @type {Object}
   */
  label: {
    /**
     * @description 是否显示内部标签
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description 标签格式化
     * @type {String|Function}
     * @default formatter = '{percent}%'
     * @example formatter = '${name}-{value}-{percent}%'
     * @example formatter = (dataItem, index) => (dataItem.name)
     */
    formatter: null,
    /**
     * @description 标签字体大小
     * @type {Number}
     * @default fontSize = 18
     */
    fontSize: 28,
    /**
     * @description 标签字体颜色
     * @type {String}
     * @default color = '#333'
     */
    fill: '#333',
    /**
     * @description 标签字体水平对齐
     * @type {String}
     * @default textAlign = 'center'
     * @example textAlign = 'left' ｜ 'right'
     */
    textAlign: 'center',
    /**
     * @description 标签字体垂直对齐
     * @type {String}
     * @default textBaseline = 'middle'
     * @example textBaseline = 'top' ｜ 'bottom'
     */
    textBaseline: 'middle',
    /**
     * @description 轴标签阴影
     * @type {String}
     * @default shadowColor = 'rgba(0, 0, 0, 0)'
     */
    shadowColor: 'rgba(0, 0, 0, 0)',
    /**
     * @description 轴标签阴影大小
     * @type {Number}
     * @default shadowBlur = 0
     */
    shadowBlur: 0,
    /**
     * @description 轴标签阴影X轴方向的偏移
     * @type {Number}
     * @default shadowOffsetX = 0
     */
    shadowOffsetX: 0,
    /**
     * @description 轴标签阴影Y轴方向的偏移
     * @type {Number}
     * @default shadowOffsetY = 0
     */
    shadowOffsetY: 0
  },
  /**
   * @description 饼图外部标签配置
   * @type {Object}
   */
  labelLine: {
    /**
     * @description 是否显示外部标签
     * @type {Boolean}
     * @default show = false
     */
    show: true,
    /**
     * @description 标签格式化
     * @type {String|Function}
     * @default formatter = '{name}'
     * @example formatter = '${name}-{value}-{percent}%'
     * @example formatter = (dataItem, index) => (dataItem.value)
     */
    formatter: '',
    /**
     * @description 标签默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 22,
      /**
       * @description 轴标签阴影
       * @type {String}
       * @default shadowColor = 'rgba(0, 0, 0, 0)'
       */
      shadowColor: 'rgba(0, 0, 0, 0)',
      /**
       * @description 轴标签阴影大小
       * @type {Number}
       * @default shadowBlur = 0
       */
      shadowBlur: 0,
      /**
       * @description 轴标签阴影X轴方向的偏移
       * @type {Number}
       * @default shadowOffsetX = 0
       */
      shadowOffsetX: 0,
      /**
       * @description 轴标签阴影Y轴方向的偏移
       * @type {Number}
       * @default shadowOffsetY = 0
       */
      shadowOffsetY: 0
    },
    /**
     * @description 标签连线弯曲处与饼图的距离
     * @type {String|Number}
     * @default labelLineBendGap = '20%'
     * @example labelLineBendGap = '20%' | 20
     */
    length: '20%',
    /**
     * @description 标签连线末端长度
     * @type {Number}
     * @default labelLineEndLength = 50
     */
    length2: 20,
    /**
     * @description 标签连线默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      width: 1,
      color: '',
      lineDash: null
    },
    /**
     * @description 字体与饼状间距
     * @type {Number}
     * @default distanceToLabelLine = 50
     */
    distanceToLabelLine: 5
  },
  /**
   * @description 饼图默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  pieStyle: {},
  /**
   * @description 百分比小数精度
   * @type {Number}
   * @default percentToFixed = 0
   */
  percentToFixed: 0,
  /**
   * @description 饼图渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = 10
   */
  rLevel: 10,
  /**
   * @description 动画延迟间隔
   * @type {Number}
   * @default animationDelayGap = 60
   */
  animationDelayGap: 60,
  /**
   * @description 饼图动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description 饼图开始动画曲线
   * @type {String}
   * @default startAnimationCurve = 'easeOutBack'
   */
  // startAnimationCurve: 'easeOutBack',
  /**
   * @description 饼图动画帧数
   * @type {Number}
   * @default animationFrame = 30
   */
  animationFrame: 30,
}