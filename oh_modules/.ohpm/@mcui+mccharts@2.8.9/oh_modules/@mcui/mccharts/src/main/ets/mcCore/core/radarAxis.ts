import { doUpdate } from '../class/updater.class'

import { radarAxisConfig } from '../config/index'

import { deepClone, getCircleRadianPoint } from '../cRender/plugin/util'

import { deepMerge, getPointToLineDistance, drawTexts, drawBreakText } from '../util'

export function radarAxis (chart, option) {
  let { radar } = option

  let radarAxis = []

  if (radar) {
    radarAxis = mergeRadarAxisDefaultConfig(radar)
  
    radarAxis = calcRadarAxisCenter(radarAxis, chart)
  
    radarAxis = calcRadarAxisRingRadius(radarAxis, chart)
  
    radarAxis = calcRadarAxisLinePosition(radarAxis)
  
    radarAxis = calcRadarAxisAreaRadius(radarAxis)
  
    radarAxis = calcRadarAxisLabelPosition(radarAxis)

    radarAxis = [radarAxis]
  }

  let radarAxisForUpdate = radarAxis

  if (radarAxis.length && !radarAxis[0].show) radarAxisForUpdate = []

  doUpdate({
    chart,
    series: radarAxisForUpdate,
    key: 'radarAxisSplitArea',
    getGraphConfig: getSplitAreaConfig,
    // beforeUpdate: beforeUpdateSplitArea,
    // beforeChange: beforeChangeSplitArea
  })

  doUpdate({
    chart,
    series: radarAxisForUpdate,
    key: 'radarAxisSplitLine',
    getGraphConfig: getSplitLineConfig,
    // beforeUpdate: beforeUpdateSplitLine,
    // beforeChange: beforeChangeSplitLine
  })

  doUpdate({
    chart,
    series: radarAxisForUpdate,
    key: 'radarAxisLine',
    getGraphConfig: getAxisLineConfig,
  })

  doUpdate({
    chart,
    series: radarAxisForUpdate,
    key: 'radarAxisLable',
    getGraphConfig: getAxisLabelConfig
  })

  chart.radarAxis = radarAxis[0]
}

function mergeRadarAxisDefaultConfig (radar) {
  return deepMerge(deepClone(radarAxisConfig), radar)
}

function calcRadarAxisCenter (radarAxis, chart) {
  const { area } = chart.render

  const { center } = radarAxis

  radarAxis.centerPos = center.map((v, i) => {
    if (typeof v === 'number') return v

    return parseInt(v) / 100 * area[i]
  })

  return radarAxis
}

function calcRadarAxisRingRadius (radarAxis, chart) {
  const { area } = chart.render

  let { splitNumber, radius } = radarAxis

  const maxRadius = Math.min(...area) / 2

  if (typeof radius !== 'number') radius = parseInt(radius) / 100 * maxRadius

  const splitGap = radius / splitNumber

  radarAxis.ringRadius = new Array(splitNumber).fill(0)
    .map((foo, i) => splitGap * (i + 1))

  radarAxis.radius = radius

  return radarAxis
}

function calcRadarAxisLinePosition (radarAxis) {
  const { indicator, centerPos, radius, startAngle } = radarAxis

  const fullAngle = Math.PI * 2

  const indicatorNum = indicator.length

  const indicatorGap = fullAngle / indicatorNum

  const angles = new Array(indicatorNum).fill(0)
    .map((foo, i) => indicatorGap * i + startAngle)
  
  radarAxis.axisLineAngles = angles

  radarAxis.axisLinePosition = angles.map(g => {
    return getCircleRadianPoint(centerPos[0], centerPos[1], radius, g)
  })

  return radarAxis
}

function calcRadarAxisAreaRadius (radarAxis) {
  const { ringRadius } = radarAxis

  const subRadius = ringRadius[0] / 2

  radarAxis.areaRadius = ringRadius.map(r => r - subRadius)

  return radarAxis
}

function calcRadarAxisLabelPosition (radarAxis) {
  let { axisLineAngles, centerPos, radius, nameGap } = radarAxis

  radius += nameGap

  radarAxis.axisLabelPosition = axisLineAngles.map(angle => 
    getCircleRadianPoint(centerPos[0], centerPos[1], radius, angle))

  return radarAxis
}

function getSplitAreaConfig (radarAxis) {
  const { areaRadius, polygon, animationCurve, animationFrame, rLevel } = radarAxis

  const name = polygon ? 'regPolygon' : 'ring'

  return areaRadius.map((foo, i) => ({
    name,
    index: rLevel,
    visible: radarAxis.splitArea.show,
    animationCurve,
    animationFrame,
    shape: getSplitAreaShape(radarAxis, i),
    style: getSplitAreaStyle(radarAxis, i)
  }))
}

function getSplitAreaShape (radarAxis, i) {
  const { polygon, areaRadius, indicator, centerPos, startAngle } = radarAxis
  // [[193.84615384615384,139.5],[202.93942058589045,144.75],[202.93942058589045,155.25],[193.84615384615384,160.5],[184.75288710641723,155.25],[184.75288710641723,144.75]]
  const indicatorNum = indicator.length

  let shape = {
    rx: centerPos[0],
    ry: centerPos[1],
    r: areaRadius[i],
    side: null,
    startAngle: polygon ? startAngle : 0
  }

  if (polygon) shape.side = indicatorNum

  return shape
}

function getSplitAreaStyle (radarAxis, i) {
  const { splitArea, ringRadius, axisLineAngles, polygon, centerPos } = radarAxis

  let { areaStyle: {colors: color}, style } = splitArea

  style = {
    fill: 'rgba(0, 0, 0, 0)',
    ...style
  }

  let lineWidth = ringRadius[0] - 0

  if (polygon) {
    const point1 = getCircleRadianPoint(centerPos[0], centerPos[1], ringRadius[0], axisLineAngles[0])
    const point2 = getCircleRadianPoint(centerPos[0], centerPos[1], ringRadius[0], axisLineAngles[1])

    lineWidth = getPointToLineDistance(centerPos, point1, point2)
  }

  style = deepMerge(deepClone(style, true), { lineWidth })

  if (!color.length) return style

  const colorNum = color.length

  return deepMerge(style, { stroke: color[i % colorNum] })
}

function beforeUpdateSplitArea (graphs, radarAxis, i, updater) {
  const cache = graphs[i]

  if (!cache || !cache[0]) return

  const { render } = updater.chart

  const { polygon } = radarAxis

  const { name } = cache[0]

  const currentName = polygon ? 'regPolygon' : 'ring'

  const delAll = currentName !== name

  if (!delAll) return

  cache.forEach(g => render.delGraph(g))

  graphs[i] = null
}

function beforeChangeSplitArea (graph, config) {
  const side = config.shape.side

  if (typeof side !== 'number') return

  graph.shape.side = side
}

function getSplitLineConfig (radarAxis) {
  const { ringRadius, polygon, animationCurve, animationFrame, rLevel } = radarAxis

  const name = polygon ? 'regPolygon' : 'ring'

  return ringRadius.map((foo, i) => ({
    name,
    index: rLevel,
    animationCurve,
    animationFrame,
    visible: radarAxis.splitLine.show,
    shape: getSplitLineShape(radarAxis, i),
    style: getSplitLineStyle(radarAxis, i)
  }))
}

function getSplitLineShape (radarAxis, i) {
  const { ringRadius, centerPos, indicator, polygon, startAngle } = radarAxis

  const shape = {
    rx: centerPos[0],
    ry: centerPos[1],
    r: ringRadius[i],
    side: null,
    startAngle: polygon ? startAngle : 0
  }

  const indicatorNum = indicator.length

  if (polygon) shape.side = indicatorNum

  return shape
}

function getSplitLineStyle (radarAxis, i) {
  const { splitLine } = radarAxis

  let { color, lineStyle } = splitLine

  const style = {
    fill: 'rgba(0, 0, 0, 0)',
    stroke: lineStyle.color,
    lineWidth: lineStyle.width
  }

  if (!color.length) return style

  const colorNum = color.length

  return deepMerge(style, { stroke: color[i % colorNum] })
}

function beforeUpdateSplitLine (graphs, radarAxis, i, updater) {
  const cache = graphs[i]

  if (!cache) return

  const { render } = updater.chart

  const { polygon } = radarAxis

  const { name } = cache[0]

  const currenName = polygon ? 'regPolygon' : 'ring'

  const delAll = currenName !== name

  if (!delAll) return

  cache.forEach(g => render.delGraph(g))

  graphs[i] = null
}

function beforeChangeSplitLine (graph, config) {
  const side = config.shape.side

  if (typeof side !== 'number') return

  graph.shape.side = side
}

function getAxisLineConfig (radarAxis) {
  const { axisLinePosition, animationCurve, animationFrame, rLevel } = radarAxis

  return axisLinePosition.map((foo, i) => ({
    name: 'polyline',
    index: rLevel,
    visible: radarAxis.axisLine.show,
    animationCurve,
    animationFrame,
    shape: getAxisLineShape(radarAxis, i),
    style: getAxisLineStyle(radarAxis, i)
  }))
}

function getAxisLineShape (radarAxis, i) {
  const { centerPos, axisLinePosition } = radarAxis

  const points = [centerPos, axisLinePosition[i]]

  return { points }
}

function getAxisLineStyle (radarAxis, i) {
  const { axisLine } = radarAxis

  const { color, lineStyle: {color: stroke, width} } = axisLine

  const style = {
    stroke: stroke,
    lineWidth: width
  }

  if (!color.length) return style

  const colorNum = color.length

  return deepMerge(style, { stroke: color[i % colorNum] })
}

function getAxisLabelConfig (radarAxis, updater) {
  const { axisLabelPosition, animationCurve, animationFrame, rLevel } = radarAxis
  
  return axisLabelPosition.map((foo, i) => ({
    name: 'text',
    index: rLevel,
    visible: radarAxis.axisName.show,
    animationCurve,
    animationFrame,
    shape: getAxisLableShape(radarAxis, i, updater.chart),
    style: getAxisLableStyle(radarAxis, i)
  }))
}

function getAxisLableShape (radarAxis, i, chart) {
  const { axisLabelPosition, indicator, axisName } = radarAxis
  const { ctx } = chart.render
  const {width, overflow, fontSize, fontFamily, fontWeight} = axisName
  let content = indicator[i].name
  if (overflow && overflow !== 'none') {
    let overflowW = width
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
    let textI = content.length
    if (overflow === 'truncate') {
      textI = drawTexts(ctx, content, overflowW)
      content = content.substring(0, textI) + (textI !== content.length ? '...' : '')
    } else if (overflow === 'breakAll') {
      content = drawBreakText(ctx, content, overflowW)
    }
  }
  return {
    content,
    position: axisLabelPosition[i]
  }
}

function getAxisLableStyle (radarAxis, i) {
  const { axisName: axisLabel, centerPos: [x, y], axisLabelPosition } = radarAxis

  // let { color } = axisLabel

  const [labelXpos, labelYPos] = axisLabelPosition[i]

  const textAlign = labelXpos === x ? 'center' : labelXpos > x ? 'left' : 'right'
  const textBaseline = labelYPos === y ? 'middle' : labelYPos > y ? 'top' : 'bottom'

  const style = deepMerge({
    textAlign,
    textBaseline
  }, {
    fill: axisLabel.color,
    fontWeight: axisLabel.fontWeight,
    fontFamily: axisLabel.fontFamily,
    fontSize: axisLabel.fontSize
  })

  return style
  // if (!color.length) return style
  //
  // const colorNum = color.length
  //
  // return deepMerge(style, { fill: color[i % colorNum] })
}