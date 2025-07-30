export const tooltipConfig = {
  /**
   * @description 是否显示提示层
   * @type {Boolean}
   * @default show = true
   */
  show: true,
  /**
   * @description 提示框内部边距
   * @type {Number}
   * @default padding = 10
   */
  padding: 10,
  /**
   * @description 提示框背景颜色
   * @type {String}
   * @default backgroundColor = 'rgba(0,0,0,0.7)'
   */
  backgroundColor: 'rgba(0,0,0,0.7)',
  /**
   * @description 提示框边框宽度
   * @type {Number}
   * @default borderWidth = 0
   */
  borderWidth: 0,
  /**
   * @description 提示框边框颜色
   * @type {String}
   * @default backgroundColor = 'rgba(0,0,0,0.7)'
   */
  borderColor: 'rgba(0,0,0,0.7)',
  /**
   * @description 指示线的配置
   * @type {Object}
   * @default axisPointer = {Configuration Of Class AxisPointer}
   */
  axisPointer: {
    type: 'line', // shadow
    lineStyle: {
      width: 1,
      type: 'solid',
      color: '#DDE2EB'
    },
    shadowStyle: { // 提示背景
      color: 'rgba(150,150,150,0.2)',
      borderWidth: 0,
      borderColor: 'rgba(150,150,150,0.2)'
    }
  },
  /**
   * @description 指示框字体样式配置
   * @type {Object}
   * @default textStyle = {Configuration Of Class TextStyle}
   */
  textStyle: {
    color: '#fff',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: 14
  },
  /**
   * @description 提示框动画曲线
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description 提示框动画时间
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame:  0
}