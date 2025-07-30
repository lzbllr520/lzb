export const gaugeConfig = {
  /**
   * @description 是否显示仪表盘
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
   * @description 仪表盘半径
   * @type {String|Number}
   * @default radius = '60%'
   * @example radius = '60%' | 100
   */
  radius: '60%',
  /**
   * @description 仪表盘中心点
   * @type {Array}
   * @default center = ['50%', '50%']
   * @example center = ['50%', '50%'] | [100, 100]
   */
  center: ['50%', '50%'],
  /**
   * @description 仪表盘起始角度
   * @type {Number}
   * @default startAngle = -(Math.PI / 4) * 5
   * @example startAngle = -Math.PI
   */
  startAngle: -(Math.PI / 4) * 5,
  /**
   * @description 仪表盘结束角度
   * @type {Number}
   * @default endAngle = Math.PI / 4
   * @example endAngle = 0
   */
  endAngle: Math.PI / 4,
  /**
   * @description 仪表盘最小值
   * @type {Number}
   * @default min = 0
   */
  min: 0,
  /**
   * @description 仪表盘最大值
   * @type {Number}
   * @default max = 100
   */
  max: 100,
  /**
   * @description 仪表盘分割数量
   * @type {Number}
   * @default splitNum = 5
   */
  splitNum: 5,
  /**
   * @description 仪表盘图表数据
   * @type {Array}
   * @default data = []
   */
  data: [],
  /**
   * @description 数据项弧线默认样式配置
   * @type {Object}
   * @default dataItemStyle = {Configuration Of Class Style}
   */
  dataItemStyle: {
    /**
     * @description 仪表盘弧线宽度
     * @type {Number}
     * @default arcLineWidth = 15
     */
    arcLineWidth: 15,
    /**
     * @description 仪表盘弧线颜色
     * @type {String}
     * @default color = ''
     */
    color: '',
    /**
     * @description 仪表盘弧线指定线段末端的绘制方式
     * @type {String}
     * @default lineCap = 'butt'
     * @example lineCap = "round" | "square"
     */
    lineCap: 'butt'
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
     * @description 轴刻度长度
     * @type {Number}
     * @default tickLength = 6
     */
    tickLength: 6,
    /**
     * @description 轴刻度默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      /**
       * @description 轴刻度颜色
       * @type {String}
       * @default color = '#999'
       */
      color: '#999',
      /**
       * @description 轴刻度宽度
       * @type {Number}
       * @default width = 1
       */
      width: 1
    }
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
     * @description 轴标签数据（可以自动计算）
     * @type {Array}
     * @default data = [Number...]
     */
    data: [],
    /**
     * @description 轴标签格式化
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}%'
     * @example formatter = (labelItem) => (labelItem.value)
     */
    formatter: null,
    /**
     * @description 标签与轴刻度之间的间距
     * @type {String|Function}
     * @default labelGap = 5
     */
    labelGap: 5,
    /**
     * @description 轴标签默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      /**
       * @description 轴标签字体颜色
       * @type {String}
       * @default color = '#999'
       */
      color: '#999',
      /**
       * @description 轴标签字体大小
       * @type {Number}
       * @default fontSize = 24
       */
      fontSize: 24
    }
  },
  /**
   * @description 指针配置
   * @type {Object}
   */
  pointer: {
    /**
     * @description 是否显示指针
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 指针对应的数据值索引
     * @type {Number}
     * @default valueIndex = 0 (pointer.value = data[0].value)
     */
    valueIndex: 0,
    /**
     * @description 指针默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      /**
       * @description 指针缩放大小
       * @type {Array<Number>}
       * @default scale = [1, 1]
       */
      scale: [1, 1],
      /**
       * @description 指针颜色
       * @type {String}
       * @default color = '#FF4647'
       */
      color: '#FF4647'
    }
  },
  /**
   * @description 数据项弧线细节配置
   * @type {Object}
   */
  details: {
    /**
     * @description 是否显示细节
     * @type {Boolean}
     * @default show = false
     */
    show: false,
    /**
     * @description 细节格式化
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}%'
     * @example formatter = '{name}%'
     * @example formatter = (dataItem) => (dataItem.value)
     */
    formatter: null,
    /**
     * @description 细节位置偏移
     * @type {Array}
     * @default offset = [0, 0]
     * @example offset = [10, 10]
     */
    offset: [0, 0],
    /**
     * @description 值的小数精度
     * @type {Number}
     * @default valueToFixed = 0
     */
    valueToFixed: 0,
    /**
     * @description 细节位置
     * @type {String}
     * @default position = 'center'
     * @example position = 'start' | 'center' | 'end'
     */
    position: 'center',
    /**
     * @description 细节默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      textBaseline: 'middle',
      color: ''
    }
  },
  /**
   * @description 仪表盘背景弧线配置
   * @type {Object}
   */
  backgroundArc: {
    /**
     * @description 是否显示背景弧线
     * @type {Boolean}
     * @default show = true
     */
    show: true,
    /**
     * @description 背景弧线默认样式配置
     * @type {Object}
     * @default style = {Configuration Of Class Style}
     */
    style: {
      color: '#e0e0e0'
    }
  },
  /**
   * @description 仪表盘图表渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = 10
   */
  rLevel: 10,
  /**
   * @description 仪表盘动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeInOutBack',
  /**
   * @description 仪表盘动画帧数
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame:  30
}