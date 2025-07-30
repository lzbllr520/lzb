export const lineConfig = {
  /**
   * @description 是否显示此折线图
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
   * @description 数据堆叠
   * 相同堆栈的系列元素的数据值将会叠加（后一个值会叠加在前一个值之上）
   * @type {String}
   * @default stack = ''
   */
  stack: '',
  /**
   * @description 平滑线
   * @type {Boolean}
   * @default smooth = false
   */
  smooth: false,
  /**
   * @description 线条的X轴索引
   * @type {Number}
   * @default xAxisIndex = 0
   * @example xAxisIndex = 0 | 1
   */
  xAxisIndex: 0,
  /**
   * @description 线条的Y轴索引
   * @type {Number}
   * @default yAxisIndex = 0
   * @example yAxisIndex = 0 | 1
   */
  yAxisIndex: 0,
  /**
   * @description 折线图数据
   * @type {Array}
   * @default data = []
   * @example data = [100, 200, {value: 100}]
   */
  data: [],
  /**
   * @description 线条默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  lineStyle: {
    /**
     * @description 线条宽度
     * @type Number
     * @default width = 2
     */
    width: 2,
    /**
     * @description 线条颜色
     * @type String
     * @default color = ''
     */
    color: '',
    lineDash: null
  },
  /**
   * @description 线条拐点配置
   * @type {Object}
   */
  itemStyle: {
    /**
     * @description 是否显示线条点
     * @type {Boolean}
     * @default show = true
     */
    show: false,
    /**
     * @description 线条点半径
     * @type {Number}
     * @default radius = 2
     */
    symbolSize: 2,
    /**
     * @description 拐点颜色
     * @type {String}
     * @default symbolColor = ''
     */
    symbolColor: '',
    /**
     * @description 拐点边框宽度
     * @type {Number}
     * @default borderWidth = 1
     */
    borderWidth: 0,
    /**
     * @description 拐点边框颜色
     * @type {Number}
     * @default borderWidth = 1
     */
    borderColor: ''
  },
  /**
   * @description 线条区域填充样式配置
   * @type {Object}
   * 这里旧的写法就不要了，记得到时候打点更新一下，需要把旧的迁移一下
   */
  areaStyle: {
    /**
     * @description 是否显示线条区域
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description 线条区域渐变颜色（Hex|rgb|rgba）
     * @type {Array}
     * @default gradient = []
     */
    gradient: [],
    /**
     * @description 线条区域样式默认配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      opacity: 0.5
    }
  },
  /**
   * @description 线条标签配置
   * @type {Object}
   * 后面加一个富文本模式
   */
  label: {
    /**
     * @description 是否显示线条标签
     * @type {Boolean}
     * @default show = false
     */
    show: true,
    /**
     * @description 线条标签位置
     * @type {String}
     * @default position = 'top'
     * @example position = 'top' | 'center' | 'bottom'
     */
    position: 'top',
    /**
     * @description 线条标签偏移量
     * @type {Array}
     * @default offset = [0, -10]
     */
    offset: [0, -10],
    /**
     * @description 线条标签格式化
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,
    /**
     * @description 线条标签字体颜色
     * @type {String}
     * @default color = '#999'
     */
    color: '#999',
    /**
     * @description 线条标签字体大小
     * @type {Number}
     * @default fontSize = 24
     */
    fontSize: 24
  },
  /*
   * @description 折线端点的标签。
   * @type {Object}
   * */
  endLabel: {
    /**
     * @description 是否显示标签。
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description 距离图形元素的距离
     * @type {Number}
     * @default offset = 5
     */
    distance: 10,
    /**
     * @description 轴标签文本旋转角度
     * @type {Number}
     * @default rotate = 0
     */
    rotate: 0,
    /**
     * @description 线条标签偏移量
     * @type {Array}
     * @default offset = [0, 0]
     */
    offset: [0, 0],
    /**
     * @description 线条标签格式化
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,
    /**
     * @description 线条标签字体颜色
     * @type {String}
     * @default color = '#999'
     */
    color: '#999',
    /**
     * @description 线条标签字体大小
     * @type {Number}
     * @default fontSize = 24
     */
    fontSize: 24
  },
  /**
   * @description 柱状图渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = 10
   */
  rLevel: 10,
  /**
   * @description 柱状图动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description 柱状图动画帧数
   * @type {Number}
   * @default animationFrame = 30
   */
  animationFrame: 30
}