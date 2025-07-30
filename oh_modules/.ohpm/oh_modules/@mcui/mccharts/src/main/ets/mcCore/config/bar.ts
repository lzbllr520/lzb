export const barConfig = {
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
   * @description 柱状图形状类型
   * @type {String}
   * @default shapeType = 'normal'
   * @example shapeType = 'normal' | 'leftEchelon' | 'rightEchelon'
   */
  shapeType: 'normal',
  /**
   * @description 阶梯状柱状图锐度偏移量
   * @type {Number}
   * @default echelonOffset = 10
   */
  echelonOffset: 10,

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
   * @example data = [100, 200, {value: 100, color: 'red'}]
   */
  data: [],
  /**
   * @description 背景柱状图配置
   * @type {Object}
   */
  backgroundStyle: {
    /**
     * @description 是否显示背景柱状图
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description 背景柱状图宽度
     * @type {String|Number}
     * @default width = 'auto'
     * @example width = 'auto' | '30%' | 30
     */
    width: 'auto',
    /**
     * @description 背景柱状颜色
     * @type {String}
     * @default color = 'rgba(200, 200, 200, .4)'
     */
    color: 'rgba(180, 180, 180, 0.2)'
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
  /**
   * @description 柱状图渐变效果配置
   * @type {Object}
   */
  gradient: {
    /**
     * @description 渐变颜色（Hex|rgb|rgba）
     * @type {Array}
     * @default color = []
     */
    color: [],
    /**
     * @description 局部渐变
     * @type {Boolean}
     * @default local = true
     */
    local: true
  },
  /**
   * @description 柱状图样式默认配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  barStyle: {
    /**
     * @description 柱状图宽度
     * 此属性应设置在该坐标系下的最后一个 'bar' 类型序列上才能生效，并且将对这个坐标系下的所有 'bar' 类型序列生效
     * @type {String|Number}
     * @default barWidth = 'auto'
     * @example barWidth = 'auto' | '10%' | 20
     */
    width: 'auto',
    /**
     * @description 柱状图间隙
     * 此属性应设置在该坐标系下的最后一个 'bar' 类型序列上才能生效，并且将对这个坐标系下的所有 'bar' 类型序列生效
     * @type {String|Number}
     * @default barGap = '30%'
     * @example barGap = '30%' | 30
     */
    barGap: '30%',
    /**
     * @description 柱状图分类间隙
     * 此属性应设置在该坐标系下的最后一个 'bar' 类型序列上才能生效，并且将对这个坐标系下的所有 'bar' 类型序列生效
     * @type {String|Number}
     * @default barCategoryGap = '20%'
     * @example barCategoryGap = '20%' | 20
     */
    barCategoryGap: '20%',
    /**
     * @description 柱状图颜色
     * @type {String|Array<String>}
     * @default color = ''
     */
    color: '',
    /**
     * @description 柱状图边框颜色
     * @type {String}
     * @default stroke = ''
     */
    stroke: '',
    /**
     * @description 是否显示圆角半径
     * @type {Boolean | Number | Number[]}
     * @default borderRadius = false
     */
    borderRadius: null
  },
  /**
   * @description 柱状图渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = 0
   */
  rLevel: 0,
  /**
   * @description 柱状图动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description 柱状图动画帧数
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame:  30
}