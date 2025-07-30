import { doUpdate } from '../class/updater.class'

import { lineConfig } from '../config'

import bezierCurve from '../bezierCurve/index'

import { deepMerge, initNeedSeries, mergeSameStackData, getPolylineLength } from '../util'

const { polylineToBezierCurve, getBezierCurveLength } = bezierCurve

import { getFormatterVal } from '../util/common'

let callbackSendable = null

export function line (chart, option) {
  const { xAxis, yAxis, series } = option

  callbackSendable = chart.sendableTestClass || {}

  let lines = []
  if (xAxis && yAxis && series) {
    lines = initNeedSeries(series, lineConfig, 'line', chart.legendStatus || [])
    lines = calcLinesPosition(lines, chart)
  }

  doUpdate({
    chart,
    series: lines,
    key: 'lineArea',
    getGraphConfig: getLineAreaConfig,
    getStartGraphConfig: getStartLineAreaConfig,
    beforeUpdate: beforeUpdateLineAndArea,
    beforeChange: beforeChangeLineAndArea
  })

  doUpdate({
    chart,
    series: lines,
    key: 'line',
    getGraphConfig: getLineConfig,
    getStartGraphConfig: getStartLineConfig,
    beforeUpdate: beforeUpdateLineAndArea,
    beforeChange: beforeChangeLineAndArea
  })

  // const linePoint = lines.filter(item => item.itemStyle && (item.itemStyle.show))
  doUpdate({
    chart,
    series: lines,
    key: 'linePoint',
    getGraphConfig: getPointConfig,
    getStartGraphConfig: getStartPointConfig
  })

  doUpdate({
    chart,
    series: lines,
    key: 'lineEndLabel',
    getGraphConfig: getEndLabelConfig,
    // getStartGraphConfig: getStartEndLabelConfig
  })

  doUpdate({
    chart,
    series: lines,
    key: 'lineLabel',
    getGraphConfig: getLabelConfig
  })
}

function calcLinesPosition (lines, chart) {
  const { axisData } = chart

  return lines.map(lineItem => {
    let lineData = mergeSameStackData(lineItem, lines)
    const lineAxis = getLineAxis(lineItem, axisData)
    lineData = mergeNonNumber(lineItem, lineData, lineAxis)
    const linePosition = getLinePosition(lineData, lineAxis, lineItem)
    const lineFillBottomPos = getLineFillBottomPos(lineAxis)
    return {
      ...lineItem,
      linePosition: linePosition.filter(p => p),
      lineFillBottomPos
    }
  })
}

function mergeNonNumber (lineItem, lineData, lineAxis) {
  // const { data } = lineItem
  const valueAxisIndex = lineAxis.findIndex(({ type }) => type === 'value')

  // const valueAxis = lineAxis[valueAxisIndex]
  const labelAxis = lineAxis[1 - valueAxisIndex]

  const { dataZoom } = labelAxis
  if (dataZoom && dataZoom.show) {
    lineData = lineData.slice(dataZoom.start, dataZoom.end + 1)
  }

  return lineData.map((v, i) => v instanceof Object ? Number(v.value) : Number(v))
}

function getLineAxis (line, axisData) {
  const { xAxisIndex, yAxisIndex } = line

  const xAxis = axisData.find(({ axis, index }) => axis === 'x' && index === xAxisIndex)
  const yAxis = axisData.find(({ axis, index }) => axis === 'y' && index === yAxisIndex)

  return [xAxis, yAxis]
}

function getLinePosition (lineData, lineAxis, lineItem) {
  const valueAxisIndex = lineAxis.findIndex(({ type }) => type === 'value')

  const valueAxis = lineAxis[valueAxisIndex]
  const labelAxis = lineAxis[1 - valueAxisIndex]

  const { linePosition, axis } = valueAxis
  const { tickPosition, dataZoom, data } = labelAxis
  lineData = lineData.filter((item, i) => ((dataZoom && dataZoom.show ? (dataZoom.start + i) : i) < data.length))
  // lineData = lineItem.data
  let tickNum = tickPosition.length
  if (dataZoom && dataZoom.show) {
    tickNum = Math.min(dataZoom.num, tickNum)
    lineItem.data = lineData
    // lineItem.data = lineItem.data.slice(dataZoom.start, dataZoom.end + 1)
    // lineData = lineItem.data
  }
  const valueAxisPosIndex = axis === 'x' ? 0 : 1

  const valueAxisStartPos = linePosition[0][valueAxisPosIndex]
  const valueAxisEndPos = linePosition[1][valueAxisPosIndex]
  const valueAxisPosMinus = valueAxisEndPos - valueAxisStartPos
  const { maxValue, minValue } = valueAxis
  const valueMinus = maxValue - minValue

  const position = []
  new Array(tickNum).fill(0)
    .forEach((foo, i) => {
      let v = lineData[i]
      if (![undefined, null].includes(v) && typeof v === 'object') {
        v = v.value
      }
      // if (typeof v !== 'number') return null
      v = Number(v < minValue ? minValue : v > maxValue ? maxValue : v)

      let valuePercent = (v - minValue) / valueMinus

      if (valueMinus === 0) valuePercent = 0

      const ps =  valuePercent * valueAxisPosMinus + valueAxisStartPos
      if (!isNaN(ps)) {
        position.push(ps)
      }
    })

  return position.map((vPos, i) => {
    if (i >= tickNum || typeof vPos !== 'number') return null

    const pos = [vPos, tickPosition[i][1 - valueAxisPosIndex]]

    if (valueAxisPosIndex === 0) return pos

    pos.reverse()

    return pos
  })
}

function getLineFillBottomPos (lineAxis) {
  const valueAxis = lineAxis.find(({ type }) => type === 'value')

  const { axis, linePosition, minValue, maxValue } = valueAxis

  const changeIndex = axis === 'x' ? 0 : 1

  let changeValue = linePosition[0][changeIndex]

  if (minValue < 0 && maxValue > 0) {
    const valueMinus = maxValue - minValue
    const posMinus = Math.abs(linePosition[0][changeIndex] - linePosition[1][changeIndex])
    let offset = Math.abs(minValue) / valueMinus * posMinus
    if (axis === 'y') offset *= -1
    changeValue += offset
  }

  return {
    changeIndex,
    changeValue
  }
}

function getLineAreaConfig (lineItem) {
  const { animationCurve, animationFrame, lineFillBottomPos, rLevel } = lineItem

  return [{
    name: getLineGraphName(lineItem),
    index: rLevel,
    animationCurve,
    animationFrame,
    visible: lineItem.areaStyle.color ? true : lineItem.areaStyle.show,
    lineFillBottomPos,
    shape: getLineAndAreaShape(lineItem),
    style: getLineAreaStyle(lineItem),
    drawed: lineAreaDrawed
  }]
}

function getLineAndAreaShape (lineItem) {
  const { linePosition } = lineItem

  return {
    points: linePosition
  }
}

function getLineAreaStyle (lineItem) {
  const { areaStyle, color } = lineItem

  let { gradient, style, color: areaStyleColor } = areaStyle

  let isOldAreaStyle = areaStyleColor ? typeof areaStyleColor : null // 判断是否是旧的使用方式

  if (isOldAreaStyle === 'string') {
    gradient = [areaStyleColor]
  } else if (isOldAreaStyle === 'object' && !Array.isArray(areaStyleColor)) {
    gradient = areaStyleColor.colors.map(item => item.color)
  }

  const fillColor = [style.fill || color]

  const gradientColor = deepMerge(fillColor, gradient)

  if (gradientColor.length === 1) gradientColor.push(gradientColor[0])

  const gradientParams = getGradientParams(lineItem)

  style = { ...style, stroke: 'rgba(0, 0, 0, 0)' }

  return deepMerge({
    gradientColor,
    gradientParams,
    gradientType: 'linear',
    gradientWith: 'fill',
  }, style)
}

function getGradientParams (lineItem) {
  const { lineFillBottomPos, linePosition } = lineItem

  const { changeIndex, changeValue } = lineFillBottomPos

  const mainPos = linePosition.map(p => p[changeIndex])
  const maxPos = Math.max(...mainPos)
  const minPos = Math.min(...mainPos)

  let beginPos = maxPos
  if (changeIndex === 1) beginPos = minPos

  if (changeIndex === 1) {
    return [0, beginPos, 0, changeValue]
  } else {
    return [beginPos, 0, changeValue, 0]
  }
}

function lineAreaDrawed ({ lineFillBottomPos, shape }, { ctx }) {
  const { points } = shape

  const { changeIndex, changeValue } = lineFillBottomPos

  const linePoint1 = [...points[points.length - 1]]
  const linePoint2 = [...points[0]]

  linePoint1[changeIndex] = changeValue
  linePoint2[changeIndex] = changeValue

  ctx.lineTo(...linePoint1)
  ctx.lineTo(...linePoint2)

  ctx.closePath()

  ctx.fill()
}

function getStartLineAreaConfig (lineItem) {
  const config = getLineAreaConfig(lineItem)[0]

  const style = { ...config.style }

  style.opacity = 0

  config.style = style

  return [config]
}

function beforeUpdateLineAndArea (graphs, lineItem, i, updater) {
  const cache = graphs[i]

  if (!cache) return

  const currentName = getLineGraphName(lineItem)

  const { render } = updater.chart

  const { name } = cache[0]

  const delAll = currentName !== name

  if (!delAll) return

  cache.forEach(g => render.delGraph(g))

  graphs[i] = null
}

function beforeChangeLineAndArea (graph, config) {
  const { points } = config.shape

  const graphPoints = graph.shape.points

  const graphPointsNum = graphPoints.length
  const pointsNum = points.length

  if (pointsNum > graphPointsNum) {
    const lastPoint = graphPoints.slice(-1)[0]

    const newAddPoints = new Array(pointsNum - graphPointsNum)
    .fill(0).map(foo => ([...lastPoint]))

    graphPoints.push(...newAddPoints)
  } else if (pointsNum < graphPointsNum) {
    graphPoints.splice(pointsNum)
  }
}

function getLineConfig (lineItem) {
  const { animationCurve, animationFrame, rLevel } = lineItem

  return [{
    name: getLineGraphName(lineItem),
    index: rLevel + 1,
    animationCurve,
    animationFrame,
    shape: getLineAndAreaShape(lineItem),
    style: getLineStyle(lineItem)
  }]
}

function getLineGraphName (lineItem) {
  const { smooth } = lineItem

  return smooth ? 'smoothline' : 'polyline'
}

function getLineStyle (lineItem) {
  const { lineStyle, color, smooth, linePosition } = lineItem
  const { lineDash } = lineStyle
  const lineLength = getLineLength(linePosition, smooth)

  return deepMerge({
    stroke: lineStyle.color || color,
    lineDash: lineDash && lineDash.length ? lineDash : [lineLength, 0]
  }, {
    lineWidth: lineStyle.width
  })
}

function getLineLength (points, smooth = false) {
  if (!smooth) return getPolylineLength(points)

  const curve = polylineToBezierCurve(points)

  return getBezierCurveLength(curve)
}

function getStartLineConfig (lineItem) {
  const { lineDash } = lineItem.lineStyle

  const config = getLineConfig(lineItem)[0]

  let realLineDash = config.style.lineDash || []

  if (lineDash) {
    realLineDash = [0,0]
  } else {
    realLineDash = [...realLineDash].reverse()
  }

  config.style.lineDash = realLineDash

  return [config]
}

function getStartEndLabelConfig (lineItem) {

  const config = getEndLabelConfig(lineItem)[0]

  return [config]
}

function getPointConfig (lineItem) {
  const { animationCurve, animationFrame, rLevel } = lineItem

  const shapes = getPointShapes(lineItem)

  const style = getPointStyle(lineItem)

  return shapes.map(shape => ({
    name: 'circle',
    index: rLevel + 2,
    visible: lineItem.itemStyle.show,
    animationCurve,
    animationFrame: 0,
    shape,
    style
  }))
}

function getPointShapes (lineItem) {
  const { linePosition, itemStyle: { symbolSize } } = lineItem

  return linePosition.map(([rx, ry]) => ({
    r: symbolSize,
    rx,
    ry
  }))
}

function getPointStyle (lineItem) {
  let { color, itemStyle: { symbolColor, borderWidth, borderColor }, lineStyle: {color: lineColor} } = lineItem

  return deepMerge({ stroke: borderColor || lineColor || color }, {
    fill: symbolColor || lineColor || color,
    lineWidth: borderWidth
  })
}

function getStartPointConfig (lineItem) {
  const configs = getPointConfig(lineItem)

  configs.forEach(config => {
    config.shape.r = 0.1
  })

  return configs
}

function getLabelConfig (lineItem) {
  const { animationCurve, animationFrame, rLevel } = lineItem

  const shapes = getLabelShapes(lineItem)
  const style = getLabelStyle(lineItem)

  return shapes.map((shape, i) => ({
    name: 'text',
    index: rLevel + 3,
    visible: lineItem.label.show,
    animationCurve,
    animationFrame: 0,
    shape,
    style
  }))
}

function getEndLabelConfig (lineItem) {
  const { animationCurve, animationFrame, rLevel } = lineItem

  const shape = getEndLabelShapes(lineItem)
  const style = getEndLabelStyle(lineItem)

  return [
    {
      name: 'text',
      index: rLevel + 3,
      visible: lineItem.endLabel.show,
      animationCurve,
      animationFrame,
      shape,
      style
    }
  ]
}

function getLabelShapes (lineItem) {
  const contents = formatterLabel(lineItem)
  const position = getLabelPosition(lineItem)

  return position.map((position, i) => ({
    content: contents[i],
    position
  }))
}


function getEndLabelShapes (lineItem) {
  const contents = formatterEndLabel(lineItem)
  const position = getLabelEndPosition(lineItem)

  return {
    content: contents[contents.length - 1],
    position: position[contents.length - 1]
  }
}

function getLabelPosition (lineItem) {
  const { linePosition, lineFillBottomPos, label } = lineItem

  let { position, offset } = label

  let { changeIndex, changeValue } = lineFillBottomPos

  return linePosition.map(pos => {
    if (position === 'bottom') {
      pos = [...pos]
      pos[changeIndex] = changeValue
    }

    if (position === 'center') {
      const bottom = [...pos]
      bottom[changeIndex] = changeValue

      pos = getCenterLabelPoint(pos, bottom)
    }

    return getOffsetedPoint(pos, offset)
  })
}

function getLabelEndPosition (lineItem) {
  const { linePosition, lineFillBottomPos, endLabel } = lineItem

  let { offset, distance } = endLabel

  let { changeIndex, changeValue } = lineFillBottomPos

  return linePosition.map(pos => {
    const bottom = [...pos]
    bottom[changeIndex] = changeValue

    // pos = getCenterLabelPoint(pos, bottom)
    const x = pos[0] + distance
    const y = pos[1]
    return getOffsetedPoint([x, y], offset)
  })
}

function getOffsetedPoint ([x, y], [ox, oy]) {
  return [x + ox, y + oy]
}

function getCenterLabelPoint(pos, bottom) {
  const [[ax, ay], [bx, by]] = [pos, bottom]
  return [
    (ax + bx) / 2,
    (ay + by) / 2
  ]
}

function formatterLabel (lineItem) {
  let { data, label: { formatter } } = lineItem
  // const newData = []
  // data = data.filter(d => typeof d === 'number').map(d => d.toString())

  let labelData = data.map(d => (d instanceof Object ? d.value : d).toString())

  if (!formatter) return labelData

  const type = typeof formatter

  if (type === 'string') return data.map((d, i) => getFormatterVal(callbackSendable, formatter, d instanceof Object ? {name: d.value, ...d} : {name: d}, i))

  if (type === 'function') return data.map((d, i) => String(formatter(d instanceof Object ? {name: d.value, ...d} : {name: d}, i)))

  return labelData
}

function formatterEndLabel (lineItem) {
  let { data, endLabel: { formatter } } = lineItem
  // const newData = []
  // data = data.filter(d => typeof d === 'number').map(d => d.toString())

  let labelData = data.map(d => (d instanceof Object ? d.value : d).toString())

  if (!formatter) return labelData

  const type = typeof formatter

  if (type === 'string') return data.map((d, i) => getFormatterVal(callbackSendable, formatter, d instanceof Object ? {name: d.value, ...d} : {name: d}, i))

  if (type === 'function') return data.map((d, i) => String(formatter(d instanceof Object ? {name: d.value, ...d} : {name: d}, i)))

  return labelData
}

function getLabelStyle (lineItem) {
  const { color: lineColor, label: { fontSize, color } } = lineItem

  return deepMerge({ fill: color || lineColor }, {fontSize})
}

function getEndLabelStyle (lineItem) {
  const { color: lineColor, endLabel: { fontSize, color } } = lineItem

  return deepMerge({ fill: color || lineColor }, {fontSize})
}
