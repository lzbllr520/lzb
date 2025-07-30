import { doUpdate } from '../class/updater.class'

import { xAxisConfig, yAxisConfig } from '../config'

import { filterNonNumber, deepMerge, mergeSameStackData, drawTexts, drawBreakText, getIndices, px2vp } from '../util'

import { deepClone, getFormatterVal } from '../util/common'
import { drawing } from '@kit.ArkGraphics2D';
const axisConfig = { xAxisConfig, yAxisConfig }

const { min, max, abs, pow } = Math

let callbackSendable = null
let font = new drawing.Font();
export async function axis (chart, option?) {
  // let dataZoom = {
  //   show: false,
  //   start: 0,
  //   end: 0,
  //   num: 1
  // }

  callbackSendable = chart.sendableTestClass || {}
  let { xAxis, yAxis, series } = option
  let allAxis = []
  // dataZoom = chart.dataZoom
  if (xAxis && yAxis && series) {
    allAxis = getAllAxis(xAxis, yAxis)
    allAxis = mergeDefaultAxisConfig(allAxis)
    allAxis = allAxis.filter(({ show }) => show)
    allAxis = mergeDefaultBoundaryGap(allAxis)
    allAxis = calcAxisLinePosition(allAxis, chart)
    allAxis = calcAxisLabelData(allAxis, series, chart)
    allAxis = setAxisPosition(allAxis)
    allAxis = calcAxisTickPosition(allAxis, chart)
    allAxis = calcAxisNamePosition(allAxis, chart)
    allAxis = calcSplitLinePosition(allAxis, chart)
  }


  doUpdate({
    'chart': chart,
    'series': allAxis,
    'key': 'axisLine',
    'getGraphConfig': getLineConfig
  })
  // const time52 = Date.now()
  // console.log('时间5.2', time52-time51)
  doUpdate({
    chart,
    series: allAxis,
    key: 'axisTick',
    getGraphConfig: getTickConfig
  })
  // const time53 = Date.now()
  // console.log('时间5.3', time53-time52)
  doUpdate({
    chart,
    series: allAxis,
    key: 'axisLabel',
    getGraphConfig: getLabelConfig
  })
  // const time54 = Date.now()
  // console.log('时间5.4', time54-time53)
  doUpdate({
    chart,
    series: allAxis,
    key: 'axisName',
    getGraphConfig: getNameConfig
  })
  // const time55 = Date.now()
  // console.log('时间5.5', time55-time54)
  doUpdate({
    chart,
    series: allAxis,
    key: 'splitLine',
    getGraphConfig: getSplitLineConfig
  })

  // await Promise.all([
  //   doUpdate({
  //     'chart': chart,
  //     'series': allAxis,
  //     'key': 'axisLine',
  //     'getGraphConfig': getLineConfig
  //   }),
  //   doUpdate({
  //     chart,
  //     series: allAxis,
  //     key: 'axisTick',
  //     getGraphConfig: getTickConfig
  //   }),
  //   doUpdate({
  //     chart,
  //     series: allAxis,
  //     key: 'axisLabel',
  //     getGraphConfig: getLabelConfig
  //   }),
  //   doUpdate({
  //     chart,
  //     series: allAxis,
  //     key: 'axisName',
  //     getGraphConfig: getNameConfig
  //   }),
  //   doUpdate({
  //     chart,
  //     series: allAxis,
  //     key: 'splitLine',
  //     getGraphConfig: getSplitLineConfig
  //   })
  // ]);
  chart.axisData = allAxis
}

function asyncTask(callBack) {
  return callBack();
}

function getAllAxis (xAxis, yAxis) {
  let [allXAxis, allYAxis] = [[], []]

  if (xAxis instanceof Array) {
    allXAxis.push(...xAxis)
  } else {
    allXAxis.push(xAxis)
  }

  if (yAxis instanceof Array) {
    allYAxis.push(...yAxis)
  } else {
    allYAxis.push(yAxis)
  }

  allXAxis.splice(2)
  allYAxis.splice(2)

  allXAxis = allXAxis.map((axis, i) => ({ ...axis, index: i, axis: 'x' }))
  allYAxis = allYAxis.map((axis, i) => ({ ...axis, index: i, axis: 'y' }))

  return [...allXAxis, ...allYAxis]
}

function mergeDefaultAxisConfig (allAxis) {
  let xAxis = allAxis.filter(({ axis }) => axis === 'x')
  let yAxis = allAxis.filter(({ axis }) => axis === 'y')

  xAxis = xAxis.map(axis => deepMerge(deepClone(xAxisConfig), axis))
  yAxis = yAxis.map(axis => deepMerge(deepClone(yAxisConfig), axis))

  return [...xAxis, ...yAxis]
}

function mergeDefaultBoundaryGap (allAxis) {
  const valueAxis = allAxis.filter(({ type }) => type === 'value')
  const labelAxis = allAxis.filter(({ type }) => type !== 'value')

  valueAxis.forEach(axis => {
    if (typeof axis.boundaryGap === 'boolean') return

    axis.boundaryGap = false
  })
  labelAxis.forEach(axis => {
    if (typeof axis.boundaryGap === 'boolean') return

    axis.boundaryGap = true
  })

  return [...valueAxis, ...labelAxis]
}

function calcAxisLabelData (allAxis, series, chart) {
  const { dataZoom } = chart
  let valueAxis = allAxis.filter(({ type }) => type === 'value')
  let labelAxis = allAxis.filter(({ data }) => data instanceof Array)

  valueAxis = calcValueAxisLabelData(valueAxis, series, dataZoom)
  labelAxis = calcLabelAxisLabelData(labelAxis, dataZoom)
  return [...valueAxis, ...labelAxis]
}

function calcValueAxisLabelData (valueAxis, series, dataZoom) {
  return valueAxis.map(axis => {

    const minMaxValue = getValueAxisMaxMinValue(axis, series, dataZoom)
    const [min, max] = getTrueMinMax(axis, minMaxValue)
    const interval = getValueInterval(min, max, axis)
    const { axisLabel: { formatter } } = axis

    let label = []

    if (min < 0 && max > 0) {
      label = getValueAxisLabelFromZero(min, max, interval, axis)
    } else {
      label = getValueAxisLabelFromMin(min, max, interval)
    }

    label = label.map(l => parseFloat(l.toFixed(2)))
    return {
      ...axis,
      labelData: label,
      maxValue: label.slice(-1)[0],
      minValue: label[0],
      label: getAfterFormatterLabel(dataZoom, label, formatter)
    }
  })
}

// // 来计算给定数组中每对连续元素之间的差值
// function calculateDifferences(arr) {
//   let differences = [];
//   for (let i = 0; i < arr.length - 1; i++) {
//     differences.push(Number(arr[i + 1]) - Number(arr[i]));
//   }
//   return differences;
// }


function getValueAxisMaxMinValue (axis, series, dataZoom) {
  series = series.filter(({ show, type }) => {
    if (show === false) return false

    if (type === 'pie') return false

    return true
  })

  if (series.length === 0) return [0, 0]
  
  const { index, axis: axisType } = axis

  series = mergeStackData(series, dataZoom)

  const axisName = axisType + 'Axis'

  let valueSeries = series.filter(s => s[axisName] === index)

  if (!valueSeries.length) valueSeries = series

  return getSeriesMinMaxValue(valueSeries, dataZoom)
}

function getSeriesMinMaxValue (series, dataZoom) {
  if (!series) return

  const dataZoomValue = function (data) {
    if (dataZoom && dataZoom.show) {
      data = data.filter((item, i) => (i >= dataZoom.start && i <= dataZoom.end))
    }
    return data
  }

  let seriesData = []
  series
    .map(({ data }) => {
      if (data && data.length) {
        // data = dataZoomValue(data)
        seriesData = [...seriesData, ...filterNonNumber(data)]
      } else {
        seriesData = [...seriesData, 0]
      }
    })
  const minValue = Math.min(...seriesData, 0)

  const maxValue = Math.max(...seriesData, 10)

  return [minValue, maxValue]
}

function mergeStackData (series, dataZoom) {

  const seriesCloned = JSON.parse(JSON.stringify(series))

  seriesCloned.forEach((item, i) => {
    if (dataZoom && dataZoom.show) {
      item.data = item.data.slice(dataZoom.start, dataZoom.end + 1)
    }
    const data = mergeSameStackData(item, series)
    item.data = data
  })

  return seriesCloned
}

function getTrueMinMax (axisJson, minMaxValue) {
  let { min, max, axis, splitNumber } = axisJson
  let  [minValue, maxValue] = minMaxValue
  if (min === null) {
    min = '20%'
  }
  if (max === null) {
    max = '20%'
  }
  let [minType, maxType] = [typeof min, typeof max]
  if (!testMinMaxType(min)) {
    min = axisConfig[axis + 'AxisConfig'].min
    minType = 'string'
  }

  if (!testMinMaxType(max)) {
    max = axisConfig[axis + 'AxisConfig'].max
    maxType = 'string'
  }

  if (minType === 'string') {
    min = Number(String(minValue - abs(minValue * parseFloat(min) / 100)))

    const lever = getValueLever(min)

    min = Math.min(parseFloat((min / lever).toFixed(1)) * lever, 0)

    min = Math.floor(min / splitNumber) * splitNumber;
  }

  if (maxType === 'string') {
    max = Number(maxValue + abs(maxValue * parseFloat(max) / 100))

    const lever = getValueLever(max)

    max = parseFloat((max / lever).toFixed(1)) * lever

    max = Math.ceil(max / splitNumber) * splitNumber;
  }

  return [min, max]
}

function getValueLever (value) {
  const valueString = abs(parseInt(value)).toString()

  const valueLength = valueString.length

  const firstZeroIndex = valueString.replace(/0*$/g, '').indexOf('0')

  let pow10Num = valueLength - 1

  if (firstZeroIndex !== -1) pow10Num -= firstZeroIndex

  return pow(10, pow10Num)
}

function testMinMaxType (val) {
  const valType = typeof val

  const isValidString = (valType === 'string' && /^\d+%$/.test(val))
  const isValidNumber = valType === 'number'

  return isValidString || isValidNumber
}

function getValueAxisLabelFromZero (min, max, interval, axis) {
  let [negative, positive] = [[], []]
  let [currentNegative, currentPositive] = [0, 0]

  do {
    currentNegative -= interval
    if (axis.min) {
      currentNegative = Math.max(min, currentNegative)
    }
    negative.push(currentNegative)
  } while (currentNegative > min)

  do {
    currentPositive += interval
    if (axis.max) {
      currentPositive = Math.min(max, currentPositive)
    }
    positive.push(currentPositive)
  } while (currentPositive < max)

  return [...negative.reverse(), 0, ...positive]
}

function getValueAxisLabelFromMin (min, max, interval) {
  let [label, currentValue] = [[min], min]

  do {
    currentValue += interval
    label.push(Math.min(currentValue, max))
  } while (currentValue < max)

  return label
}

function getAfterFormatterLabel (dataZoom, label, formatter, type = 'val') {

  if (!formatter) {
    return getDataZoomLabel(type, label, dataZoom)
  }

  label = getDataZoomLabel(type, label, dataZoom)

  if (typeof formatter === 'string') label = label.map(l => getFormatterVal(callbackSendable, formatter, l))
  if (typeof formatter === 'function') label = label.map((value, index) => formatter(value, dataZoom && dataZoom.show ? dataZoom.start + index : index))

  return label
}

function getDataZoomLabel (type, label, dataZoom) {
  if (dataZoom && dataZoom.show && type === 'label') {
    label = label.slice(dataZoom.start, dataZoom.end + 1)
  }
  return label
}

function calcLabelAxisLabelData (labelAxis, dataZoom) {
  return labelAxis.map(axis => {
    const { data, axisLabel: { formatter } } = axis

    return Object.assign({}, axis, { label: getAfterFormatterLabel(dataZoom, data, formatter, 'label') })
  })
}

function getValueInterval (min, max, axis) {
  let { interval, minInterval, maxInterval, splitNumber, axis: axisType } = axis

  const config = axisConfig[axisType + 'AxisConfig']

  if (typeof interval !== 'number') interval = config.interval
  if (typeof minInterval !== 'number') minInterval = config.minInterval
  if (typeof maxInterval !== 'number') maxInterval = config.maxInterval
  if (typeof splitNumber !== 'number') splitNumber = config.splitNumber

  if (typeof interval === 'number') return interval

  let valueInterval = parseInt(String((max - min) / (splitNumber)))

  // if (valueInterval.toString().length > 1) valueInterval = parseInt(valueInterval.toString().replace(/\d$/, '0'))

  if (valueInterval === 0) valueInterval = 1

  if (typeof minInterval === 'number' && valueInterval < minInterval) return minInterval

  if (typeof maxInterval === 'number' && valueInterval > maxInterval) return maxInterval

  return valueInterval
}

function setAxisPosition (allAxis) {
  const xAxis = allAxis.filter(({ axis }) => axis === 'x')
  const yAxis = allAxis.filter(({ axis }) => axis === 'y')

  if (xAxis[0] && !xAxis[0].position) xAxis[0].position = xAxisConfig.position
  if (xAxis[1] && !xAxis[1].position) {
    xAxis[1].position = xAxis[0].position === 'bottom' ? 'top' : 'bottom'
  }

  if (yAxis[0] && !yAxis[0].position) yAxis[0].position = yAxisConfig.position
  if (yAxis[1] && !yAxis[1].position) {
    yAxis[1].position = yAxis[0].position === 'left' ? 'right' : 'left'
  }

  return [...xAxis, ...yAxis]
}

function calcAxisLinePosition (allAxis, chart) {
  const { x, y, w, h } = chart.gridArea

  allAxis = allAxis.map(axis => {
    const { position } = axis

    let linePosition = []

    if (position === 'left') {
      linePosition = [[x, y], [x, y + h]].reverse()
    } else if (position === 'right') {
      linePosition = [[x + w, y], [x + w, y + h]].reverse()
    } else if (position === 'top') {
      linePosition = [[x, y], [x + w, y]]
    } else if (position === 'bottom') {
      linePosition = [[x, y + h], [x + w, y + h]]
    }

    return {
      ...axis,
      linePosition
    }
  })

  return allAxis
}

function calcAxisTickPosition (allAxis, chart) {
  const { render, dataZoom } = chart
  return allAxis.map((axisItem) => {
    let {
      type,
      axis,
      linePosition,
      position,
      label,
      labelData,
      max,
      min,
      boundaryGap,
      axisTick,
      minValue,
      maxValue,
      axisLabel: {
        formatter,
        style,
        interval,
        overflow,
        fontSize,
        width
      }
    } = axisItem
    if (typeof boundaryGap !== 'boolean') boundaryGap = axisConfig[axis + 'AxisConfig'].boundaryGap

    let labelNum = label.length

    const [[startX, startY], [endX, endY]] = linePosition

    const gapLength = axis === 'x' ? endX - startX : endY - startY

    let gap = gapLength / Math.max((boundaryGap ? labelNum : labelNum - 1), 1)

    const ratio = (maxValue - minValue) === 0 ? (abs(gapLength) / (maxValue - minValue)) : 0;

    // 如果是滚动模式, 且x轴
    if (type === 'data' && dataZoom && dataZoom.show) {
      labelNum = Math.min(dataZoom.num, labelNum)
      gap = gapLength / Math.max((boundaryGap ? labelNum : labelNum - 1), 1)
      axisItem.dataZoom = dataZoom
    } else {
      axisItem.dataZoom = {}
    }

    const tickPosition = new Array(labelNum)
      .fill(0)
      .map((foo, i) => {
        if (axis === 'x') {
          if (type === 'data') {
            return [startX + gap * (boundaryGap ? (i + 0.5) : i), startY]
          } else {
            return [startX +  (labelData[i] - minValue) * ratio, startY]
          }
        }
        if (type === 'data') {
          return [startX, startY + gap * (boundaryGap ? (i + 0.5) : i)]
        } else {
          if (min !== null || max !== null) {
            return [startX, startY - (labelData[i] - minValue) * ratio]
          } else {
            return [startX, startY + gap * (boundaryGap ? (i + 0.5) : i)]
          }
        }
      })
    if (type === 'data') {
      if (overflow && overflow !== 'none') {
        let overflowW = width ? width : axis === 'x' ? gap : startX
        // 计算当前文本是否需要设置自动换行或者截取
        axisItem.label = label.map((labelItem, index) => {
          // ctx.font = `${fontSize}px`;
          font.setSize(fontSize);
          labelItem = String(formatter ? getFormatterVal(callbackSendable, formatter, labelItem, index) : labelItem)
          let textI = labelItem.length
          if (overflow === 'truncate') {
            textI = drawTexts(font, labelItem, overflowW)
            labelItem = labelItem.substring(0, textI) + (textI !== labelItem.length ? '...' : '')
          } else if (overflow === 'breakAll') {
            labelItem = drawBreakText(font, labelItem, overflowW)
          }
          return labelItem
        })
      }

      // 计算是否需要间隔显示
      interval = interval === null ? 'auto' : interval
      if (interval === 'auto') {
        let labelTotalW = 0
        let maxNum = 0
        let maxText = ''
        axisItem.label.forEach((labelItem, index) => {
          labelItem = String(formatter ? getFormatterVal(callbackSendable, formatter, labelItem, index) : labelItem)
          if (labelItem.length > maxNum) {
            maxNum = labelItem.length
            maxText = labelItem
          }
        })
        font.setSize(fontSize);
        const txtW = px2vp(font.measureText(String(maxText), drawing.TextEncoding.TEXT_ENCODING_UTF8))
        labelTotalW = txtW * axisItem.label.length
        let flag = (txtW > gap) || (labelTotalW > gapLength)
        // axisItem.label.forEach((labelItem, index) => {
        //   ctx.font = `${fontSize}px`;
        //   labelItem = String(formatter ? getFormatterVal(callbackSendable, formatter, labelItem, index) : labelItem)
        //   // const txtW = ctx.measureText(labelItem).width; // 获取文字的长度
        //   // const txtW = MeasureText.measureText({ // 建议使用 this.getUIContext().getMeasureUtils().measureText()接口
        //   //   textContent: labelItem,
        //   //   fontSize: `${fontSize}px`
        //   // }); // 获取文字的长度
        //   font.setSize(fontSize);
        //   const txtW = px2vp(font.measureText(labelItem, drawing.TextEncoding.TEXT_ENCODING_UTF8))
        //   // console.log('txtW', px2vp(txtW))
        //   if (txtW > gap) {
        //     flag = true
        //   }
        //   labelTotalW += txtW
        // })
        // return result;
        if (flag) {
          interval = Math.max(Math.round(labelTotalW / (gapLength)), 1)
        }
      }
    }
    // console.log('interval', interval)
    if (!isNaN(interval)) {
      let indices = getIndices(0, axisItem.label.length, interval)
      // if (dataZoom.show && type === 'data' &&  axis === 'x') {
      //   indices = getIndices(dataZoom.start, dataZoom.num, interval)
      // }
      // console.log('indicesindices1', JSON.stringify(indices), axis, JSON.stringify(axisItem.label))
      axisItem.label = axisItem.label.map((item, index) => {
        if (!indices.includes(index)) {
          item = ''
        }
        return item
      })
    }


    const tickLinePosition = getTickLinePosition(axis, boundaryGap, position, tickPosition, gap, axisTick)

    return {
      ...axisItem,
      tickPosition,
      tickLinePosition,
      tickGap: gap
    }
  })
}

function getTickLinePosition (axisType, boundaryGap, position, tickPosition, gap, axisTick) {
  let index = axisType === 'x' ? 1 : 0
  let {length: plus = 5} = axisTick
  // let plus = 10

  if (axisType === 'x' && position === 'top') plus = -5
  if (axisType === 'y' && position === 'left') plus = -5

  let tickLinePosition = tickPosition.map(lineStart => {
    const lineEnd = deepClone(lineStart)

    lineEnd[index] += plus

    return [deepClone(lineStart), lineEnd]
  })

  if (!boundaryGap) return tickLinePosition

  index = axisType === 'x' ? 0 : 1
  plus = gap / 2

  tickLinePosition.forEach(([lineStart, lineEnd]) => {
    lineStart[index] += plus
    lineEnd[index] += plus
  })

  return tickLinePosition
}

function calcAxisNamePosition (allAxis, chart) {
  return allAxis.map(axisItem => {
    let { nameGap, nameLocation, position, linePosition } = axisItem

    const [lineStart, lineEnd] = linePosition

    let namePosition = [...lineStart]

    if (nameLocation === 'end') namePosition = [...lineEnd]

    if (nameLocation === 'center') {
      namePosition[0] = (lineStart[0] + lineEnd[0]) / 2
      namePosition[1] = (lineStart[1] + lineEnd[1]) / 2
    }

    let index = 0

    if (position === 'top' && nameLocation === 'center') index = 1
    if (position === 'bottom' && nameLocation === 'center') index = 1
    if (position === 'left' && nameLocation !== 'center') index = 1
    if (position === 'right' && nameLocation !== 'center') index = 1

    let plus = nameGap

    if (position === 'top' && nameLocation !== 'end') plus *= -1
    if (position === 'left' && nameLocation !== 'start') plus *= -1
    if (position === 'bottom' && nameLocation === 'start') plus *= -1
    if (position === 'right' && nameLocation === 'end') plus *= -1

    namePosition[index] += plus

    return {
      ...axisItem,
      namePosition
    }
  })
}

function calcSplitLinePosition (allAxis, chart) {
  const { w, h } = chart.gridArea

  return allAxis.map(axisItem => {
    const { tickLinePosition, position, boundaryGap } = axisItem

    let [index, plus] = [0, w]

    if (position === 'top' || position === 'bottom') index = 1

    if (position === 'top' || position === 'bottom') plus = h

    if (position === 'right' || position === 'bottom') plus *= -1

    const splitLinePosition = tickLinePosition.map(([startPoint]) => {
      const endPoint = [...startPoint]
      endPoint[index] += plus

      return [[...startPoint], endPoint]
    })

    if (!boundaryGap) splitLinePosition.shift()

    return {
      ...axisItem,
      splitLinePosition
    }
  })
}

function getLineConfig (axisItem) {
  const { animationCurve, animationFrame, rLevel } = axisItem

  return [{
    name: 'polyline',
    index: rLevel,
    visible: axisItem.axisLine.show,
    animationCurve,
    animationFrame: 0,
    shape: getLineShape(axisItem),
    style: getLineStyle(axisItem)
  }]
}

function getLineShape (axisItem) {
  const { linePosition } = axisItem

  return {
    points: linePosition
  }
}

function getLineStyle (axisItem) {
  setLineWidth(axisItem.axisLine.lineStyle)
  return axisItem.axisLine.lineStyle
}

function getTickConfig (axisItem) {
  const { animationCurve, animationFrame, rLevel } = axisItem
  const shapes = getTickShapes(axisItem)
  const style = getTickStyle(axisItem)
  return shapes.map(shape => ({
    name: 'polyline',
    index: rLevel,
    visible: axisItem.axisTick.show,
    animationCurve,
    animationFrame: 0,
    shape,
    style
  }))
}

function getTickShapes (axisItem) {
  const { tickLinePosition } = axisItem

  return tickLinePosition.map(points => ({ points }))
}

function getTickStyle (axisItem) {
  setLineWidth(axisItem.axisTick.lineStyle)
  return axisItem.axisTick.lineStyle
}

function getLabelConfig (axisItem) {
  const { animationCurve, animationFrame, rLevel, axis, dataZoom } = axisItem

  const shapes = getLabelShapes(axisItem)
  const styles = getLabelStyle(axisItem, shapes)

  return shapes.map((shape, i) => {
    let visible = shape.content && axisItem.axisLabel.show
    // if (dataZoom.show) {
    //   visible = i >= dataZoom.start && i <= dataZoom.end
    // }
    return {
      name: 'text',
      index: rLevel,
      visible,
      animationCurve,
      animationFrame: 0,
      shape,
      style: styles[i],
      setGraphCenter: () => (void 0)
    }
  })
}

function getLabelShapes (axisItem) {
  const { label, tickPosition, position, axisLabel, axisTick } = axisItem

  return tickPosition.map((point, i) => ({
    position: getLabelRealPosition(point, position, axisLabel, axisTick),
    content: label[i].toString(),
  }))
}

function getLabelRealPosition (points, position, axisLabel, axisTick) {
  let {margin: plus = 10} = axisLabel
  let { length } = axisTick
  let index = 0

  if (position === 'top' || position === 'bottom') index = 1
  if (position === 'top' || position === 'left') plus *= -1
  if (position === 'top' || position === 'left') length *= -1

  points = deepClone(points)
  points[index] += (plus + length)

  return points
}

function getLabelStyle (axisItem, shapes) {
  const { position } = axisItem

  let { color, fontSize, rotate, fontWeight, fontFamily, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY } = axisItem.axisLabel
  let style = {
    fill: color,
    fontSize,
    rotate,
    fontWeight,
    fontFamily,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY
  }
  const align = getAxisLabelRealAlign(position)

  style = deepMerge(align, style)

  const styles = shapes.map(({ position }) => ({
    ...style,
    graphCenter: position
  }))

  return styles
}

function getAxisLabelRealAlign (position) {
  if (position === 'left') return {
    textAlign: 'right',
    textBaseline: 'middle'
  }

  if (position === 'right') return {
    textAlign: 'left',
    textBaseline: 'middle'
  }

  if (position === 'top') return {
    textAlign: 'center',
    textBaseline: 'bottom'
  }

  if (position === 'bottom') return {
    textAlign: 'center',
    textBaseline: 'top'
  }
}

function getNameConfig (axisItem) {
  const { animationCurve, animationFrame, rLevel } = axisItem

  return [{
    name: 'text',
    index: rLevel,
    animationCurve,
    animationFrame: 0,
    shape: getNameShape(axisItem),
    style: getNameStyle(axisItem)
  }]
}

function getNameShape (axisItem) {
  const { name, namePosition } = axisItem

  return {
    content: name,
    position: namePosition
  }
}

function getNameStyle (axisItem) {
  const { nameLocation, position, nameTextStyle: style } = axisItem

  const align = getNameRealAlign(position, nameLocation)
  // style.fill = style.color
  return deepMerge(align, {
    fill: style.color,
    fontWeight: style.fontWeight,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize
  })
}

function getNameRealAlign (position, location) {
  if (
    (position === 'top' && location === 'start') ||
    (position === 'bottom' && location === 'start') ||
    (position === 'left' && location === 'center')
  ) return {
    textAlign: 'right',
    textBaseline: 'middle'
  }

  if (
    (position === 'top' && location === 'end') ||
    (position === 'bottom' && location === 'end') ||
    (position === 'right' && location === 'center')
  ) return {
    textAlign: 'left',
    textBaseline: 'middle'
  }

  if (
    (position === 'top' && location === 'center') ||
    (position === 'left' && location === 'end') ||
    (position === 'right' && location === 'end')
  ) return {
    textAlign: 'center',
    textBaseline: 'bottom'
  }

  if (
    (position === 'bottom' && location === 'center') ||
    (position === 'left' && location === 'start') ||
    (position === 'right' && location === 'start')
  ) return {
    textAlign: 'center',
    textBaseline: 'top'
  }
}

function getSplitLineConfig (axisItem) {
  const { animationCurve, animationFrame, rLevel } = axisItem

  const shapes = getSplitLineShapes(axisItem)
  const style = getSplitLineStyle(axisItem)

  return shapes.map(shape => ({
    name: 'polyline',
    index: rLevel,
    visible: axisItem.splitLine.show,
    animationCurve,
    animationFrame: 0,
    shape,
    style
  }))
}

function getSplitLineShapes (axisItem) {
  const { splitLinePosition } = axisItem

  return splitLinePosition.map(points => ({ points }))
}

function getSplitLineStyle (axisItem) {
  setLineWidth(axisItem.splitLine.lineStyle)
  return axisItem.splitLine.lineStyle
}

function setLineWidth (data) {
  data.lineWidth = data.width
}
