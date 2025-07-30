export const legendConfig = {
  /**
   * @description 是否显示图例
   * @type {Boolean}
   * @default show = true
   */
  show: true,
  /**
   * @description 图例的方向
   * @type {String}
   * @default orient = 'horizontal'
   * @example orient = 'horizontal' | 'vertical'
   */
  orient: 'horizontal',
  /**
   * @description 图例左侧位置
   * @type {String|Number}
   * @default left = 'auto'
   * @example left = 'auto' | '10%' | 10
   */
  left: 'auto',
  /**
   * @description 图例右侧位置
   * @type {String|Number}
   * @default right = 'auto'
   * @example right = 'auto' | '10%' | 10
   */
  right: 'auto',
  /**
   * @description 图例顶部位置
   * @type {String|Number}
   * @default top = 'auto'
   * @example top = 'auto' | '10%' | 10
   */
  top: '6%',
  /**
   * @description 图例底部位置
   * @type {String|Number}
   * @default bottom = 'auto'
   * @example bottom = 'auto' | '10%' | 10
   */
  bottom: 'auto',
  /**
   * @description 图例项的icon。
   * @type {String}
   * @default icon = 'roundRect'
   * @example icon = 'rect' | 'circle' ｜'roundRect'
   */
  icon: 'roundRect',
  /**
   * @description 图例项的icon的圆角，只针对icon为roundRect。
   * @type {Number}
   * @default iconRadian = 2
   */
  iconRadian: 2,
  /**
   * @description 图例项之间的间距
   * @type {Number}
   * @default itemGap = 10
   */
  itemGap: 10,
  /**
   * @description 图形与文本的距离
   * @type {Number}
   * @default itemTextGap = 5
   */
  itemTextGap: 5,
  /**
   * @description 图例标记和文本的对齐
   * 纵向布局的图例标记和文本的对齐。默认自动，根据组件的位置和 orient 决定，当组件的 left 值为 'right' 以及纵向布局（orient 为 'vertical'）的时候为右对齐，即为 'right'。
   * @type {String}
   * @default align = 'auto'
   * @example align = 'left' | 'right'
   */
  align: 'auto',
  /**
   * @description 图标宽度
   * @type {Number}
   * @default iconWidth = 25
   */
  itemWidth: 8,
  /**
   * @description 图标高度
   * @type {Number}
   * @default iconHeight = 10
   */
  itemHeight: 8,
  /**
   * @description 图例项是否可选
   * @type {Boolean}
   * @default selectAble = true
   */
  selectAble: true,
  /**
   * @description 图例数据
   * @type {Array}
   * @default data = []
   */
  data: [],
  /**
   * @description 图例文字默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  textStyle: {
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    fontSize: 30,
    color: '#333',
    /**
     * @description 图例文字格式化
     * @type {String|Function}
     * @default formatter = null
     * @example formatter = '{value}件'
     * @example formatter = (name, index) => (string)
     */
    formatter: null
  },
  /**
   * @description 图例图标默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  iconStyle: {},
  /**
   * @description 图例未选中状态的文字默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  textUnselectedStyle: {
    fontFamily: 'sans-serif',
    fontSize: 30,
    color: '#999'
  },
  /**
   * @description 图例未选中状态的图标默认样式配置
   * @type {Object}
   * @default style = {Configuration Of Class Style}
   */
  iconUnselectedStyle: {
    color: '#999'
  },
  /**
   * @description 图例渲染级别
   * 优先级高的渲染级别
   * @type {Number}
   * @default rLevel = 20
   */
  rLevel: 20,
  /**
   * @description 图例动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description 图例动画帧数
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame:  0
}