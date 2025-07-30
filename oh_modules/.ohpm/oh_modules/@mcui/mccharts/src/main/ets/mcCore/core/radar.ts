import { doUpdate } from '../class/updater.class'

import { radarConfig } from '../config/index'

import { getCircleRadianPoint } from '../cRender/plugin/util'

import { getColorFromRgbValue, getRgbaValue } from '../util/color'

import { deepMerge, initNeedSeries } from '../util'

import { getFormatterVal } from '../util/common'

let callbackSendable = null

export function radar (chart, option) {
  callbackSendable = chart.sendableTestClass || {}

  let { series } = option

  if (!series) series = []

  let radars = initNeedSeries(series, radarConfig, 'radar')

  radars = calcRadarPosition(radars, chart)

  radars = calcRadarLabelPosition(radars, chart)

  radars = calcRadarLabelAlign(radars, chart)

  doUpdate({
    chart,
    series: radars,
    key: 'radar',
    getGraphConfig: getRadarConfig,
    getStartGraphConfig: getStartRadarConfig,
    beforeChange: beforeChangeRadar
  })

  doUpdate({
    chart,
    series: radars,
    key: 'radarPoint',
    getGraphConfig: getPointConfig,
    getStartGraphConfig: getStartPointConfig,
  })

  doUpdate({
    chart,
    series: radars,
    key: 'radarLabel',
    getGraphConfig: getLabelConfig
  })
}

function calcRadarPosition (radars, chart) {
  const { radarAxis } = chart

  if (!radarAxis) return []

  const { indicator, axisLineAngles, radius, centerPos } = radarAxis

  radars.forEach(radarItem => {
    const { data } = radarItem
    const vals = data.map(d => d instanceof Object ? d.value : d)
    const maxVal = Math.max(...vals)
    radarItem.dataRadius = []

    radarItem.radarPosition = indicator.map(({ max, min }, i) => {
      let v = data[i] instanceof Object ? data[i].value : data[i]

      if (typeof max !== 'number') max = maxVal
      if (typeof min !== 'number') min = 0
      if (typeof v !== 'number') v = min

      const dataRadius = (v - min) / (max - min) * radius

      radarItem.dataRadius[i] = dataRadius

      return getCircleRadianPoint(centerPos[0], centerPos[1], dataRadius, axisLineAngles[i])
    })
  })

  return radars
}

function calcRadarLabelPosition (radars, chart) {
  const { radarAxis } = chart

  if (!radarAxis) return []

  const { centerPos, axisLineAngles } = radarAxis

  radars.forEach(radarItem => {
    const { dataRadius, label } = radarItem

    const { labelGap } = label

    radarItem.labelPosition = dataRadius.map((r, i) => {
      return getCircleRadianPoint(centerPos[0], centerPos[1], r + labelGap, axisLineAngles[i])
    })
  })

  return radars
}

function calcRadarLabelAlign (radars, chart) {
  const { radarAxis } = chart

  if (!radarAxis) return []

  const { centerPos: [x, y] } = radarAxis

  radars.forEach(radarItem => {
    const { labelPosition } = radarItem

    const labelAlign = labelPosition.map(([lx, ly]) => {
      const textAlign = lx > x ? 'left' : 'right'
      const textBaseline = ly > y ? 'top' : 'bottom'
      
      return {
        textAlign,
        textBaseline
      }
    })

    radarItem.labelAlign = labelAlign
  })

  return radars
}

function getRadarConfig (radarItem, updater) {
  const { animationCurve, animationFrame, rLevel } = radarItem

  return [{
    name: 'polyline',
    index: rLevel,
    animationCurve,
    animationFrame,
    shape: getRadarShape(radarItem),
    style: getRadarStyle(radarItem, updater)
  }]
}

function getStartRadarConfig (radarItem, updater) {
  const { radarAxis: { centerPos } } = updater.chart

  const config = getRadarConfig(radarItem, updater)[0]

  const pointNum = config.shape.points.length

  const points = new Array(pointNum).fill(0).map(foo => [...centerPos])

  config.shape.points = points

  return [config]
}

function getRadarShape (radarItem) {
  const { radarPosition } = radarItem

  return {
    points: radarPosition,
    close: true
  }
}

function getRadarStyle(radarItem, updater) {
  const { radarAxis: { centerPos } } = updater.chart
  let { radarStyle, color, areaStyle: {show, color: areaColor} } = radarItem

  let radarDefaultColor = {
    stroke: color,
    fill: 'rgba(0,0,0,0)',
    lineWidth: radarStyle.lineWidth
  }

  let gradientColor = []

  if (show || areaColor instanceof Object) {
    color = areaColor || color
    if (typeof color === 'string') {
      const colorRgbaValue = getRgbaValue(color)
      colorRgbaValue[3] = 0.5
      radarDefaultColor.fill = getColorFromRgbValue(colorRgbaValue)
      return radarDefaultColor
    } else if (color instanceof Array) {
      gradientColor = color
    } else if (color instanceof Object) {
      gradientColor = color.colors.map(item => item.color)
    }

    if (gradientColor.length === 1) gradientColor.push(gradientColor[0])

    const gradientParams = getGradientParams(radarItem, centerPos)
    // const newRadarStyle = deepMerge(, radarStyle)
    // console.log(JSON.stringify(newRadarStyle))
    return deepMerge({
      gradientColor,
      gradientParams,
      gradientType: 'radial',
      gradientWith: 'fill',
    }, radarDefaultColor)
  }

  return radarDefaultColor
}

function calculateCentroid(points) {
  let n = points.length;
  let area = 0;
  let cx = 0, cy = 0;

  for (let i = 0; i < n; i++) {
    let x1 = points[i][0], y1 = points[i][1];
    let x2 = points[(i + 1) % n][0], y2 = points[(i + 1) % n][1];

    let crossProduct = x1 * y2 - x2 * y1;
    area += crossProduct;
    cx += (x1 + x2) * crossProduct;
    cy += (y1 + y2) * crossProduct;
  }

  area /= 2;
  cx /= 6 * area;
  cy /= 6 * area;

  return { cx, cy };
}

function getGradientParams (radarItem, centerPos) {
  const {radarPosition} = radarItem
  // 计算中心点
  const {cx, cy} = calculateCentroid(radarPosition);

  // 计算到中心点的最大距离
  let maxRadius = 0;
  radarPosition.forEach(point => {
    let distance = Math.sqrt(Math.pow(cx - point[0], 2) + Math.pow(cy - point[1], 2));
    if (distance > maxRadius) maxRadius = distance;
  });
  return [cx, cy, 0, cx, cy, maxRadius]
}


function beforeChangeRadar (graph, { shape }) {
  const graphPoints = graph.shape.points

  const graphPointsNum = graphPoints.length
  const pointsNum = shape.points.length

  if (pointsNum > graphPointsNum) {
    const lastPoint = graphPoints.slice(-1)[0]

    const newAddPoints = new Array(pointsNum - graphPointsNum)
    .fill(0).map(foo => ([...lastPoint]))

    graphPoints.push(...newAddPoints)
  } else if (pointsNum < graphPointsNum) {
    graphPoints.splice(pointsNum)
  }
}

function getPointConfig (radarItem) {
  const { radarPosition, animationCurve, animationFrame, rLevel } = radarItem

  return radarPosition.map((foo, i) => ({
    name: 'circle',
    index: rLevel,
    animationCurve,
    animationFrame,
    visible: radarItem.point.show,
    shape: getPointShape(radarItem, i),
    style: getPointStyle(radarItem, i),
  }))
}

function getStartPointConfig (radarItem) {
  const configs = getPointConfig(radarItem)

  configs.forEach(config => config.shape.r = 0.01)

  return configs
}

function getPointShape (radarItem, i) {
  const { radarPosition, point } = radarItem

  const { radius } = point

  const position = radarPosition[i]

  return {
    rx: position[0],
    ry: position[1],
    r: radius
  }
}

function getPointStyle (radarItem, i) {
  const { point, color } = radarItem

  const { style } = point

  return deepMerge({ stroke: style.borderColor || color }, {
    fill: style.color,
    lineWidth: style.borderWidth
  })
}

function getLabelConfig (radarItem) {
  const { labelPosition, animationCurve, animationFrame, rLevel } = radarItem

  return labelPosition.map((foo, i) => ({
    name: 'text',
    index: rLevel,
    visible: radarItem.label.show,
    animationCurve,
    animationFrame,
    shape: getLabelShape(radarItem, i),
    style: getLabelStyle(radarItem, i)
  }))
}

function getLabelShape (radarItem, i) {
  const { labelPosition, label, data } = radarItem

  const { offset, formatter } = label

  const position = mergePointOffset(labelPosition[i], offset)

  let labelText = data[i] ? String(data[i] instanceof Object ? (data[i].value || 0) : (data[i] || 0)) : '0'

  const formatterType = typeof formatter

  if (formatterType === 'string') labelText = getFormatterVal(callbackSendable, formatter, {name: labelText}, i)

  if (formatterType === 'function') labelText = formatter({name: labelText}, i)

  return {
    content: labelText,
    position
  }
}

function mergePointOffset ([x, y], [ox, oy]) {
  return [x + ox, y + oy]
}

function getLabelStyle (radarItem, i) {
  const { label, color, labelAlign } = radarItem

  const { style } = label

  const defaultColorAndAlign = {
    fill: style.color || color,
    ...labelAlign[i]
  }

  return deepMerge(defaultColorAndAlign, {
    fontSize: style.fontSize
  })
}