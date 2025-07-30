export const radarAxisConfig = {
  /**
   * @description 是否显示此雷达图轴
   * @type {Boolean}
   * @default show = true
   */
  show: true,
  /**
   * @description 雷达图轴的中心点
   * @type {Array}
   * @default center = ['50%','50%']
   * @example center = ['50%','50%'] | [100, 100]
   */
  center: ['50%', '50%'],
  /**
   * @description 雷达图轴的半径
   * @type {String|Number}
   * @default radius = '65%'
   * @example radius = '65%' | 100
   */
  radius: '65%',
  /**
   * @description 雷达图轴的起始角度
   * @type {Number}
   * @default startAngle = -Math.PI / 2
   * @example startAngle = -Math.PI
   */
  startAngle: -Math.PI / 2,
  /**
   * @description 雷达图轴的分割数量
   * @type {Number}
   * @default splitNumber = 5
   */
  splitNumber: 5,
  /**
   * @description 标签与雷达图轴之间的间隙
   * @type {Number}
   * @default splitNum = 10
   */
  nameGap: 10,
  /**
   * @description 是否启用多边形雷达图轴
   * @type {Boolean}
   * @default polygon = true
   */
  polygon: true,
  /**
   * @description 轴标签配置
   * @type {Object}
   * axisLabel
   */
  axisName: {
    /**
     * @description 是否显示轴标签
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 标签颜色（十六进制|RGB|RGBA），将覆盖style.fill
     * @type {string}
     * @default color = ''
     */
    color: '#999',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: 22,
    width: 100,
    overflow: 'breakAll' // 轴标签文本长度超出的处理， none（无）， truncate（截断），breakAll（换行）
  },
  /**
   * @description 轴线配置
   * @type {Object}
   */
  axisLine: {
    /**
     * @description 是否显示轴线
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 线条颜色（十六进制|RGB|RGBA），将覆盖style.stroke
     * @type {Array}
     * @default color = []
     */
    color: [],
    /**
     * @description 轴线默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      color: '#DBDBDB',
      width: 1
    }
  },
  /**
   * @description 分割线配置
   * @type {Object}
   */
  splitLine: {
    /**
     * @description 是否显示分割线
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 线条颜色（十六进制|RGB|RGBA），将覆盖style.stroke
     * @type {Array}
     * @default color = []
     */
    color: [],
    /**
     * @description 分割线默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      color: '#DBDBDB',
      width: 1
    }
  },
  /**
   * @description 分割区域配置
   * @type {Object}
   */
  splitArea: {
    /**
     * @description 是否显示分割区域
     * @type {Boolean}
     * @default show = false
     */
    show: true,
    /**
     * @description 区域颜色（十六进制|RGB|RGBA），将覆盖style.stroke
     * @type {Array}
     * @default color = ['#f5f5f5', '#e6e6e6']
     */
    areaStyle: {
      colors: ['#fff','rgba(200,200,200,0.2)'],
    },
    /**
     * @description 分割区域默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {}
  },
  /**
   * @description 雷达图轴渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = -10
   */
  rLevel: -10,
  /**
   * @description 雷达图轴动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description 雷达图轴动画帧数
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame:  0
}