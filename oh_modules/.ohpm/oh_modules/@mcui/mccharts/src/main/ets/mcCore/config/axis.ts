export const xAxisConfig = {
  type: 'data',
  /**
   * @description 轴名称
   * @type {String}
   * @default name = ''
   */
  name: '',
  /**
   * @description 是否显示这个轴
   * @type {Boolean}
   * @default show = true
   */
  show: true,
  /**
   * @description 轴位置
   * @type {String}
   * @default position = 'bottom'
   * @example position = 'bottom' | 'top'
   */
  position: 'bottom',
  /**
   * @description 名称间隙
   * @type {Number}
   * @default nameGap = 15
   */
  nameGap: 5,
  /**
   * @description 名称位置
   * @type {String}
   * @default nameLocation = 'end'
   * @example nameLocation = 'end' | 'center' | 'start'
   */
  nameLocation: 'end',
  /**
   * @description 名称默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  nameTextStyle: {
    color: '#999',
    fontSize: 22,
    fontWeight: 'normal',
    fontFamily: 'sans-serif'
  },
  /**
   * @description 轴最小值
   * @type {String|Number}
   * @default min = 0
   * @example min = 0
   */
  min: null,
  /**
   * @description 轴最大值
   * @type {String|Number}
   * @default max = '10%'
   * @example max = '10%' | 0
   */
  max: null,
  /**
   * @description 轴值间隔
   * @type {Number}
   * @default interval = null
   * @example interval = 100
   */
  interval: null,
  /**
   * @description 最小间隔
   * @type {Number}
   * @default minInterval = null
   * @example minInterval = 1
   */
  minInterval: null,
  /**
   * @description 最大间隔
   * @type {Number}
   * @default maxInterval = null
   * @example maxInterval = 100
   */
  maxInterval: null,
  /**
   * @description 边界间隙, 两边是否留白机制
   * * @type {Boolean}
   * @default boundaryGap = null
   * @example boundaryGap = true
   */
  boundaryGap: null,
  /**
   * @description Axis split number
   * @type {Number}
   * @default splitNumber = 5
   */
  splitNumber: 5,
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
     * @description 轴线默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      color: '#DDE2EB',
      width: 1,
      lineDash: null
    }
  },
  /**
   * @description 轴刻度配置
   * @type {Object}
   */
  axisTick: {
    /**
     * @description 是否显示轴刻度
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 轴刻度默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      color: '#DDE2EB',
      width: 1,
      lineDash: null
    },
    /**
     * @description 轴刻度与文本的间隔
     * @type {Number}
     * @default interval = 4
     */
    interval: 4,
    /**
     * @description 轴刻度本身的长度
     * @type {Number}
     * @default length = 5
     */
    length: 5
  },
  /**
   * @description 轴标签配置
   * @type {Object}
   */
  axisLabel: {
    /**
     * @description 是否显示轴标签
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 轴标签格式化
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,
    /**
     * @description 轴标签默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    // style: {
    //   fill: '#999999',
    //   fontSize: 22,
    //   rotate: 0
    // },
    /**
     * @description 轴标签文本颜色
     * @type {String}
     * @default color = '#999999'
     */
    color: '#999999',
    /**
     * @description 轴标签文本大小
     * @type {Number}
     * @default color = 22
     */
    fontSize: 22,
    /**
     * @description 轴标签文本粗细
     * @type {Number}
     * @default fontWeight = 400
     */
    fontWeight: 400,
    /**
     * @description 轴标签文本样式
     * @type {String}
     * @default fontFamily = 'sans-serif'
     */
    fontFamily: 'sans-serif',
    /**
     * @description 轴标签文本旋转角度
     * @type {Number}
     * @default rotate = 0
     */
    rotate: 0,
    /**
     * @description 轴标签间隔显示
     * @type {String|Number}
     * @default interval = null
     * @example interval = 'auto'
     */
    interval: null,
    /**
     * @description 轴标签文本宽度，可以用配置长度超出的处理
     * @type {Number ｜ null}
     * @default width = null
     */
    width: null,
    /**
     * @description 轴标签本长度超出的处理
     * @type {String}
     * @default overflow = 'none'
     * @example overflow = 'none'（无）| 'truncate'（截断）| 'breakAll'（换行）
     */
    overflow: 'none',
    /**
     * @description 轴标签与刻度之间的距离
     * @type {Number}
     * @default margin = 5
     */
    margin: 5,
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
   * @description 轴分割线配置
   * @type {Object}
   */
  splitLine: {
    /**
     * @description 是否显示轴分割线
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description 轴分割线默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      color: '#DDE2EB',
      width: 1,
      lineDash: null
    }
  },
  /**
   * @description X轴渲染数据
   * @type {Array}
   * @default data = []
   */
  data: [],
  /**
   * @description X轴渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = -20
   */
  rLevel: -20,
  /**
   * @description X轴动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description X轴动画帧数
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame:  30
}

export const yAxisConfig = {
  type: 'value',
  /**
   * @description 轴名称
   * @type {String}
   * @default name = ''
   */
  name: '',
  /**
   * @description 是否显示Y轴
   * @type {Boolean}
   * @default show = true
   */
  show: true,
  /**
   * @description 轴位置
   * @type {String}
   * @default position = 'left'
   * @example position = 'left' | 'right'
   */
  position: 'left',
  /**
   * @description 名称间隙
   * @type {Number}
   * @default nameGap = 15
   */
  nameGap: 5,
  /**
   * @description 名称位置
   * @type {String}
   * @default nameLocation = 'end'
   * @example nameLocation = 'end' | 'center' | 'start'
   */
  nameLocation: 'end',
  /**
   * @description 名称默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  nameTextStyle: {
    color: '#999999',
    fontSize: 22,
    fontWeight: 'normal',
    fontFamily: 'sans-serif'
  },
  /**
   * @description 轴最小值
   * @type {String|Number}
   * @default min = '20%'
   * @example min = '20%' | 0
   */
  min: null,
  /**
   * @description 轴最大值
   * @type {String|Number}
   * @default max = '20%'
   * @example max = '20%' | 0
   */
  max: null,
  /**
   * @description 轴值间隔
   * @type {Number}
   * @default interval = null
   * @example interval = 100
   */
  interval: null,
  /**
   * @description 最小间隔
   * @type {Number}
   * @default minInterval = null
   * @example minInterval = 1
   */
  minInterval: null,
  /**
   * @description 最大间隔
   * @type {Number}
   * @default maxInterval = null
   * @example maxInterval = 100
   */
  maxInterval: null,
  /**
   * @description 边界间隙
   * @type {Boolean}
   * @default boundaryGap = null
   * @example boundaryGap = true
   */
  boundaryGap: null,
  /**
   * @description 轴分割数量
   * @type {Number}
   * @default splitNumber = 5
   */
  splitNumber: 5,
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
     * @description 轴线默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      color: '#DDE2EB',
      width: 1,
      lineDash: null
    }
  },
  /**
   * @description 轴刻度配置
   * @type {Object}
   */
  axisTick: {
    /**
     * @description 是否显示轴刻度
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 轴刻度默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      color: '#DDE2EB',
      width: 1,
      lineDash: null
    },
    /**
     * @description 轴刻度与文本的间隔
     * @type {Number}
     * @default interval = 4
     */
    interval: 4,
    /**
     * @description 轴刻度本身的长度
     * @type {Number}
     * @default length = 5
     */
    length: 5
  },
  /**
   * @description 轴标签配置
   * @type {Object}
   */
  axisLabel: {
    /**
     * @description 是否显示轴标签
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 轴标签格式化
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,
    /**
     * @description 轴标签默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    // style: {
    //   fill: '#999999',
    //   fontSize: 22,
    //   rotate: 0
    // },
    /**
     * @description 轴标签文本颜色
     * @type {String}
     * @default color = '#999999'
     */
    color: '#999999',
    /**
     * @description 轴标签文本大小
     * @type {Number}
     * @default color = 22
     */
    fontSize: 22,
    /**
     * @description 轴标签文本粗细
     * @type {Number}
     * @default fontWeight = 400
     */
    fontWeight: 400,
    /**
     * @description 轴标签文本样式
     * @type {String}
     * @default fontFamily = 'sans-serif'
     */
    fontFamily: 'sans-serif',
    /**
     * @description 轴标签文本旋转角度
     * @type {Number}
     * @default color = 0
     */
    rotate: 0,
    /**
     * @description 轴标签间隔显示
     * @type {String|Number}
     * @default interval = null
     * @example interval = 'auto'
     */
    interval: 0,
    /**
     * @description 轴标签文本宽度，可以用配置长度超出的处理
     * @type {Number ｜ null}
     * @default width = null
     */
    width: null,
    /**
     * @description 轴标签本长度超出的处理
     * @type {String}
     * @default overflow = 'none'
     * @example overflow = 'none'（无）| 'truncate'（截断）| 'breakAll'（换行）
     */
    overflow: 'none',
    /**
     * @description 轴标签与刻度之间的距离
     * @type {Number}
     * @default margin = 5
     */
    margin: 5,
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
   * @description 轴分割线配置
   * @type {Object}
   */
  splitLine: {
    /**
     * @description 是否显示轴分割线
     * @type {Boolean}
     * @default show = false
     */
    show: true,
    /**
     * @description 轴分割线默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    lineStyle: {
      color: '#DDE2EB',
      width: 1,
      lineDash: null
    }
  },
  /**
   * @description X轴渲染数据
   * @type {Array}
   * @default data = []
   */
  data: [],
  /**
   * @description X轴渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = -20
   */
  rLevel: -20,
  /**
   * @description X轴动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'linear',
  /**
   * @description X轴动画帧数
   * @type {Number}
   * @default animationFrame = 30
   */
  animationFrame: 0
}