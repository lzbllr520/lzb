interface InterfaceObj {
  [key: string]: any,
}

// 图表数据的特征接口
interface interface_data {
  name: string | number,
  value: string | number,
  [key: string]: any,
}

// 图表的特征接口
interface interface_option {
  cWidth?: string | number,
  cHeight?: string | number,
  backgroundColor?: string,
  fontSize?: string | number,
  color?: string,
  cSpace?: number | Array<Number>,
  data?: InterfaceObj[],
  [key: string]: any,
}

// 坐标轴的特征接口
interface AxisInterface {
  show?: boolean,
  type?: string,
  name?: string,
  nameTextStyle?: InterfaceObj,
  nameGap?: number,
  nameLocation?: string,
  position?: string,
  min?: number,
  max?: number,
  splitNumber?: number,
  interval?: number,
  boundaryGap?: boolean,
  axisLine?: InterfaceObj,
  axisTick?: InterfaceObj,
  axisLabel?: InterfaceObj,
  data?: Array<string | number>,
  splitLine?: InterfaceObj,
  formatter?: Function | null | string
}


// 图例的特征接口
interface LegendInterface {
  show?: boolean,
  selectAble?: boolean,
  left?: string | number,
  top?: string | number,
  right?: string | number,
  bottom?: string | number,
  orient?: string,
  horizontal?: string,
  align?: string,
  icon?: string,
  iconRadian?: number,
  itemGap?: number,
  itemTextGap?: number,
  itemWidth?: number,
  itemHeight?: number,
  textStyle?: InterfaceObj,
  textUnselectedStyle?: InterfaceObj,
  iconUnselectedStyle?: InterfaceObj
}

// 提示层的特征接口
interface TooltipInterface {
  show?: boolean,
  type?: string,
  axisPointer?: InterfaceObj,
  backgroundColor?: string,
  borderColor?: string,
  borderWidth?: number,
  padding?: number,
  textStyle?: InterfaceObj
}

// 数据层的特征接口
interface SeriesInterface {
  [key: string]: any,
  type?: string,
  name?: string,
  show?: boolean,
  color?: string,
  shapeType?: string,
  lineStyle?: InterfaceObj,
  backgroundStyle?: InterfaceObj,
  barStyle?: InterfaceObj,
  label?: InterfaceObj,
  endLabel?: InterfaceObj,
  itemStyle?: InterfaceObj,
  areaStyle?: InterfaceObj,
  labelLine?: InterfaceObj,
  emphasis?: InterfaceObj,
  axisLabel?: InterfaceObj,
  stack?: string,
  symbolSize?: Number | Function,
  yAxisIndex?: Number,
  padAngle?: Number
  radius?: string[] | string,
  center?: string[],
  smooth?: boolean,
  roseType?: boolean,
  animationCurve?: string,
  rLevel?: number,
  animationFrame?: number,
  startAngle?: number,
  endAngle?: number,
  insideLabel?: InterfaceObj,
  gradient?: InterfaceObj,
  details?: InterfaceObj,
  pointer?: InterfaceObj,
  arcLineWidth?: number,
  data?: Array<string | number | InterfaceObj | null | undefined>
}

// 缩放的特征接口
interface DataZoomInterface {
  show?: boolean,
  num?: number,
  start?: number,
  end?: number
}

// 动画相关属性
interface AnimationInterface {
  show?: boolean,
  duration?: number | ((idx: number) => number), // 初始动画的时长，支持回调函数，可以通过每个数据返回不同的时长实现更戏剧的初始动画效果
  delay?: number | ((idx: number) => number), // 初始动画的延迟, 支持回调函数，可以通过每个数据返回不同的 delay 时间实现更戏剧的初始动画效果。
  durationUpdate?: number | ((idx: number) => number), // 数据更新动画的时长
}

// 雷达图的特征接口
interface RadarInterface {
  indicator?: InterfaceObj[],
  center?: Array<string | number>,
  radius?: number | string,
  polygon?: boolean,
  startAngle?: number,
  nameGap ?: number,
  splitNumber ?: number,
  axisLine?: InterfaceObj,
  axisName?: InterfaceObj,
  splitLine?: InterfaceObj,
  splitArea?: InterfaceObj
}

interface OptionInterface {
  cPaddingT?: number | string,
  cPaddingB?: number | string,
  cPaddingL?: number | string,
  cPaddingR?: number | string,
  color?: Array<string>,
  title?: InterfaceObj,
  grid?: InterfaceObj,
  legend?: LegendInterface,
  dataZoom?: DataZoomInterface,
  tooltip?: TooltipInterface,
  radar?: RadarInterface,
  xAxis?: AxisInterface,
  yAxis?: AxisInterface | AxisInterface[],
  series?: Array<SeriesInterface>,
  animation?: boolean
}


export {
  AxisInterface,
  InterfaceObj,
  LegendInterface,
  TooltipInterface,
  SeriesInterface,
  DataZoomInterface,
  OptionInterface,
  RadarInterface,
  AnimationInterface
}