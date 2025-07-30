import { doUpdate } from '../class/updater.class'

import { pieConfig } from '../config/pie'

import { getCircleRadianPoint } from '../cRender/plugin/util'

import { deepMerge, initNeedSeries, mulAdd, getPolylineLength } from '../util'

import { getFormatterVal } from '../util/common'

let callbackSendable = null

export function pie (chart, option) {
  callbackSendable = chart.sendableTestClass || {}

  let { series } = option

  if (!series) series = []

  let pies = initNeedSeries(series, pieConfig, 'pie')

  pies = calcPiesCenter(pies, chart)

  pies = calcPiesRadius(pies, chart)

  pies = calcRosePiesRadius(pies, chart)

  pies = calcPiesPercent(pies)

  pies = calcPiesAngle(pies)

  pies = calcPiesInsideLabelPos(pies)

  pies = calcPiesEdgeCenterPos(pies)

  pies = calcPiesOutSideLabelPos(pies)

  doUpdate({
    chart,
    series: pies,
    key: 'pie',
    getGraphConfig: getPieConfig,
    getStartGraphConfig: getStartPieConfig,
    beforeChange: beforeChangePie
  })

  doUpdate({
    chart,
    series: pies,
    key: 'pieInsideLabel',
    getGraphConfig: getInsideLabelConfig
  })

  doUpdate({
    chart,
    series: pies,
    key: 'pieOutsideLabelLine',
    getGraphConfig: getOutsideLabelLineConfig,
    getStartGraphConfig: getStartOutsideLabelLineConfig
  })

  doUpdate({
    chart,
    series: pies,
    key: 'pieOutsideLabel',
    getGraphConfig: getOutsideLabelConfig,
    getStartGraphConfig: getStartOutsideLabelConfig
  })
}

function calcPiesCenter(pies, chart) {
  const { area } = chart.render

  pies.forEach(pie => {
    let { center } = pie

    center = center.map((pos, i) => {
      if (typeof pos === 'number') return pos

      return parseInt(pos) / 100 * area[i]
    })

    pie.center = center
  })

  return pies
}

function calcPiesRadius (pies, chart) {
  const maxRadius = Math.min(...chart.render.area) / 2

  pies.forEach(pie => {
    let { radius, data } = pie

    radius = getNumberRadius(radius, maxRadius)

    data.forEach(item => {
      let { radius: itemRadius } = item

      if (!itemRadius) itemRadius = radius

      itemRadius = getNumberRadius(itemRadius, maxRadius)

      item.radius = itemRadius
    })

    pie.radius = radius
  })

  return pies
}

function getNumberRadius (radius, maxRadius) {
  if (!(radius instanceof Array)) radius = [0, radius]

  radius = radius.map(r => {
    if (typeof r === 'number') return r

    return parseInt(r) / 100 * maxRadius
  })

  return radius
}

function calcRosePiesRadius (pies, chart) {
  const rosePie = pies.filter(({ roseType }) => roseType)

  rosePie.forEach(pie => {
    let { radius, data, roseSort } = pie

    const roseIncrement = getRoseIncrement(pie)

    const dataCopy = [...data]

    data = sortData(data)

    data.forEach((item, i) => {
      item.radius[1] = radius[1] - roseIncrement * i
    })

    if (roseSort) {
      data.reverse()
    } else {
      pie.data = dataCopy
    }

    pie.roseIncrement = roseIncrement
  })

  return pies
}

function sortData (data) {
  return data.sort(({ value: a }, { value: b }) => {
    if (a === b) return 0
    if (a > b) return -1
    if (a < b) return 1
  })
}

function getRoseIncrement (pie) {
  const { radius, roseIncrement } = pie

  if (typeof roseIncrement === 'number') return roseIncrement

  if (roseIncrement === 'auto') {
    const { data } = pie

    const allRadius = data.reduce((all, { radius }) => [...all, ...radius], [])

    const minRadius = Math.min(...allRadius)
    const maxRadius = Math.max(...allRadius)

    return (maxRadius - minRadius)  * 0.6 / (data.length - 1 || 1)
  }

  return parseInt(roseIncrement) / 100 * radius[1]
}

function calcPiesPercent (pies) {
  pies.forEach(pie => {
    const { data, percentToFixed } = pie

    let sum = getDataSum(data)
    if (sum === 0) {
      sum = 1
      const defVal = 1 / data.length
      data.forEach(item => {
        const { value } = item

        item.percent = defVal / sum * 100
        item.percentForLabel = toFixedNoCeil(defVal / sum * 100, percentToFixed)
      })
    } else {
      data.forEach(item => {
        const { value } = item

        item.percent = value / sum * 100
        item.percentForLabel = toFixedNoCeil(value / sum * 100, percentToFixed)
      })
    }


    const percentSumNoLast = mulAdd(data.slice(0, -1).map(({ percent }) => percent))

    data.slice(-1)[0].percent = 100 - percentSumNoLast
    data.slice(-1)[0].percentForLabel = toFixedNoCeil(100 - percentSumNoLast, percentToFixed)
  })

  return pies
}

function toFixedNoCeil (number, toFixed = 0) {
  const stringNumber = number.toString()

  const splitedNumber = stringNumber.split('.')
  const decimal = splitedNumber[1] || '0'
  const fixedDecimal = decimal.slice(0, toFixed)

  splitedNumber[1] = fixedDecimal

  return parseFloat(splitedNumber.join('.'))
}

function getDataSum (data) {
  return mulAdd(data.map(({ value }) => value))
}

function calcPiesAngle (pies) {
  pies.forEach(pie => {
    const { startAngle: start, data } = pie

    data.forEach((item, i) => {
      const [startAngle, endAngle] = getDataAngle(data, i)

      item.startAngle = start + startAngle
      item.endAngle = start + endAngle
    })
  })

  return pies
}

function getDataAngle (data, i) {
  const fullAngle = Math.PI * 2

  const needAddData = data.slice(0, i + 1)

  const percentSum = mulAdd(needAddData.map(({ percent }) => percent))

  const { percent } = data[i]

  const startPercent = percentSum - percent

  return [fullAngle * startPercent / 100, fullAngle * percentSum / 100]
}

function calcPiesInsideLabelPos (pies) {
  pies.forEach(pieItem => {
    const { data } = pieItem

    data.forEach(item => {
      item.insideLabelPos = getPieInsideLabelPos(pieItem, item)
    })
  })

  return pies
}

function avoidLabelOverlap(labels) {
  labels.forEach((label, index) => {
    for (let i = 0; i < labels.length; i++) {
      if (i !== index) {
        let labelA = labels[i].insideLabelPos;
        let labelB = label.insideLabelPos;

        // 简单碰撞检测
        if (Math.abs(labelA[0] - labelB[0]) < 10 && Math.abs(labelA[1] - labelB[1]) < 10) {
          // 如果发现重叠，移动标签B
          // 这里可以根据实际需求调整偏移量
          labels[i].insideLabelPos = [labelA[0], labelA[1] + 100];
        }
      }
    }
  })
  return labels
}

function getPieInsideLabelPos (pieItem, dataItem) {
  const { center } = pieItem

  const { startAngle, endAngle, radius: [ir, or] } = dataItem

  const radius = (ir + or) / 2
  const angle = (startAngle + endAngle) / 2

  return getCircleRadianPoint(center[0], center[1], radius, angle)
}

function calcPiesEdgeCenterPos(pies) {
  pies.forEach(pie => {
    const { data, center } = pie

    data.forEach(item => {
      const { startAngle, endAngle, radius } = item

      const centerAngle = (startAngle + endAngle) / 2

      const pos = getCircleRadianPoint(center[0], center[1], radius[1], centerAngle)

      item.edgeCenterPos = pos
    })
  })

  return pies
}

function calcPiesOutSideLabelPos (pies) {
  pies.forEach(pieItem => {
    let leftPieDataItems = getLeftOrRightPieDataItems(pieItem)
    let rightPieDataItems = getLeftOrRightPieDataItems(pieItem, false)

    leftPieDataItems = sortPiesFromTopToBottom(leftPieDataItems)
    rightPieDataItems = sortPiesFromTopToBottom(rightPieDataItems)

    addLabelLineAndAlign(leftPieDataItems, pieItem)
    addLabelLineAndAlign(rightPieDataItems, pieItem, false)
  })

  return pies
}

function getLabelLineBendRadius (pieItem) {
  let { length } = pieItem.labelLine

  const maxRadius = getPieMaxRadius(pieItem)

  if (typeof length !== 'number') {
    length = parseInt(length) / 100 * maxRadius
  }

  return length + maxRadius
}

function getPieMaxRadius(pieItem) {
  const { data } = pieItem

  const radius = data.map(({ radius: [foo, r] }) => r)

  return Math.max(...radius)
}

function getLeftOrRightPieDataItems (pieItem, left = true) {
  const { data, center } = pieItem

  const centerXPos = center[0]

  return data.filter((item) => {
    const { edgeCenterPos } = item
    const xPos = edgeCenterPos[0]

    if (left) {
      return xPos <= centerXPos
    }

    return xPos > centerXPos
  })
}

function sortPiesFromTopToBottom (dataItem) {
  dataItem.sort(({ edgeCenterPos: [t, ay] }, { edgeCenterPos: [tt, by] }) => {
    if (ay > by) return 1
    if (ay < by) return -1
    if (ay === by) return 0
  })

  return dataItem
}

function decomposePolyline(polyline) {
  const segments = [];
  for (let i = 0; i < polyline.length - 1; i++) {
    segments.push([polyline[i], polyline[i + 1]]);
  }
  return segments;
}

function distancePointToSegment(point, segment) {
  const [p1, p2] = segment;
  const [x, y] = point;
  const [x1, y1] = p1;
  const [x2, y2] = p2;

  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const len_sq = C * C + D * D;
  const param = len_sq !== 0 ? dot / len_sq : -1;

  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

function distanceSegmentToSegment(segment1, segment2) {
  const [p1, p2] = segment1;
  const [p3, p4] = segment2;

  let minDist = Infinity;

  // Check distances from each endpoint to the other segment
  minDist = Math.min(minDist, distancePointToSegment(p1, segment2));
  minDist = Math.min(minDist, distancePointToSegment(p2, segment2));
  minDist = Math.min(minDist, distancePointToSegment(p3, segment1));
  minDist = Math.min(minDist, distancePointToSegment(p4, segment1));

  return minDist;
}

function arePolylinesClose(polyline1, polyline2, threshold = 5) {
  const segments1 = decomposePolyline(polyline1);
  const segments2 = decomposePolyline(polyline2);

  for (let segment1 of segments1) {
    for (let segment2 of segments2) {
      if (distanceSegmentToSegment(segment1, segment2) < threshold) {
        return true;
      }
    }
  }

  return false;
}


function adjustPosition(line, lines, threshold, {center, length2, radius}) {
  // 尝试调整line的位置，直到不再与lines中的其他线段重叠
  let angleAdjustment = 0.1; // 角度调整步长
  while (lines.some(otherLine => otherLine !== line && arePolylinesClose(line.labelLine, otherLine.labelLine, threshold))) {
    // 调整角度
    const newAngle = line.angle + angleAdjustment;
    const newBendPoint = getCircleRadianPoint(center[0], center[1], radius, newAngle);
    const newEndPoint = [...newBendPoint];
    newEndPoint[0] += length2 * (line.left ? -1 : 1);

    line.labelLine = [line.edgeCenterPos, newBendPoint, newEndPoint];
    line.angle = newAngle; // 更新角度
    angleAdjustment *= -1; // 换方向调整
  }
  line.labelLineLength = getPolylineLength(line.labelLine);
}

function addLabelLineAndAlign (dataItem, pieItem, left = true) {
  const { center, labelLine } = pieItem

  const radius = getLabelLineBendRadius(pieItem)
  const threshold = 10; // 重叠检测阈值

  for (let i = 0; i < dataItem.length; i++) {
    const item = dataItem[i]
    const { edgeCenterPos, startAngle, endAngle } = item

    const { length2 } = labelLine

    const angle = (startAngle + endAngle) / 2

    const bendPoint = getCircleRadianPoint(center[0], center[1], radius, angle)

    let endPoint = [...bendPoint]
    endPoint[0] += length2 * (left ? -1 : 1)

    // 检查重叠
    let isOverlap = false;
    for (let j = 0; j < i; j++) {
      const otherItem = dataItem[j];
      const distance = getDistance(endPoint, otherItem.labelLine[2]);
      if (distance < threshold) {
        // isOverlap = true;
        endPoint[0] = otherItem.labelLine[2][0] + threshold * (left ? -1 : 1);
        endPoint[1] = otherItem.labelLine[2][1] + threshold * (left ? -1 : 1);
      }
    }

    if (isOverlap) {
      // 调整 endPoint 的位置

    }

    item.labelLine = [edgeCenterPos, bendPoint, endPoint]
    item.labelLineLength = getPolylineLength(item.labelLine)
    item.align = { textAlign: 'left', textBaseline: 'middle' }
    if (left) item.align.textAlign = 'right'
    // 调整位置以避免重叠
    // if (i !== 0) {
    //   adjustPosition(item, dataItem.slice(0, i), 5, {center, length2, radius}); // 仅检查之前的线段
    // }
  }
  // dataItem.forEach(item => {
  //
  // })
}

// 辅助函数：计算两点之间的距离
function getDistance(point1, point2) {
  const dx = point2[0] - point1[0];
  const dy = point2[1] - point1[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function getPieConfig (pieItem) {
  const { data, animationCurve, animationFrame, rLevel } = pieItem

  return data.map((foo, i) => ({
    name: 'pie',
    index: rLevel,
    animationCurve,
    animationFrame,
    shape: getPieShape(pieItem, i),
    style: getPieStyle(pieItem, i)
  }))
}

function getStartPieConfig (pieItem) {
  const { animationDelayGap, startAnimationCurve } = pieItem

  const configs = getPieConfig(pieItem)

  configs.forEach((config, i) => {
    config.animationCurve = startAnimationCurve
    config.animationDelay = i * animationDelayGap

    config.shape.or = config.shape.ir
  })

  return configs
}

function beforeChangePie (graph) {
  graph.animationDelay = 0
}

function getPieShape (pieItem, i) {
  const { center, data } = pieItem

  const dataItem = data[i]

  const { radius, startAngle, endAngle } = dataItem

  return {
    startAngle,
    endAngle: startAngle === endAngle ? endAngle + 0.00000001 : endAngle,
    ir: radius[0],
    or: radius[1],
    rx: center[0],
    ry: center[1]
  }
}

function getPieStyle (pieItem, i) {
  const { pieStyle, data } = pieItem

  const dataItem = data[i]
  const { color } = dataItem

  return deepMerge({ fill: color, shadowColor: 'rgba(0,0,0,0.5)' }, pieStyle)
}

function getInsideLabelConfig (pieItem) {
  const { animationCurve, animationFrame, data, rLevel } = pieItem

  return data.map((foo, i) => ({
    name: 'text',
    index: rLevel,
    visible: pieItem.label.show,
    animationCurve,
    animationFrame,
    shape: getInsideLabelShape(pieItem, i),
    style: getInsideLabelStyle(pieItem, i)
  }))
}

function getInsideLabelShape (pieItem, i) {
  const { label: insideLabel, data } = pieItem

  const { formatter } = insideLabel

  const dataItem = data[i]

  const formatterType = typeof formatter

  let label = dataItem.value

  if (formatterType === 'string') {
    label = formatter.replace('{name}', dataItem.name)
    label = label.replace('{percent}', dataItem.percentForLabel)
    label = getFormatterVal(callbackSendable, label, {name: dataItem.value, ...dataItem}, i)
  }

  if (formatterType === 'function') {
    label = formatter({...dataItem}, i)
  }
  return {
    content: String(label),
    position: dataItem.insideLabelPos
  }
}

function getInsideLabelStyle (pieItem, i) {
  const { label: { color, fontSize, textAlign, textBaseline, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY } } = pieItem

  return {
    fill: color,
    fontSize,
    textAlign,
    textBaseline,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY
  }
}

function getOutsideLabelLineConfig (pieItem) {
  const { animationCurve, animationFrame, data, rLevel, labelLine } = pieItem

  return data.map((foo, i) => {
    const label = getOutsideLabelShape(pieItem, i)
    return {
      name: 'polyline',
      index: rLevel,
      visible: pieItem.labelLine.show && label.content,
      animationCurve,
      animationFrame,
      shape: getOutsideLabelLineShape(pieItem, i),
      style: getOutsideLabelLineStyle(pieItem, i)
    }
  })
}

function getStartOutsideLabelLineConfig (pieItem) {
  const { data } = pieItem

  const configs = getOutsideLabelLineConfig(pieItem)

  configs.forEach((config, i) => {
    config.style.lineDash = [0, data[i].labelLineLength]
  })

  return configs
}

function getOutsideLabelLineShape (pieItem, i) {
  const { data } = pieItem

  const dataItem = data[i]

  return {
    points: dataItem.labelLine
  }
}

function getOutsideLabelLineStyle (pieItem, i) {
  const { labelLine, data } = pieItem

  const { lineStyle } = labelLine

  const { color } = data[i]

  return deepMerge({ stroke: lineStyle.color || color, lineDash: [data[i].labelLineLength, 0] }, {
    lineWidth: lineStyle.width,
    lineDash: lineStyle.lineDash
  })
}

function getOutsideLabelConfig (pieItem) {
  const { animationCurve, animationFrame, data, rLevel } = pieItem

  return data.map((foo, i) => ({
    name: 'text',
    index: rLevel,
    visible: pieItem.labelLine.show,
    animationCurve,
    animationFrame,
    shape: getOutsideLabelShape(pieItem, i),
    style: getOutsideLabelStyle(pieItem, i)
  }))
}

function getStartOutsideLabelConfig (pieItem) {
  const { data } = pieItem

  const configs = getOutsideLabelConfig(pieItem)

  configs.forEach((config, i) => {
    config.shape.position = data[i].labelLine[1]
  })

  return configs
}

function getOutsideLabelShape (pieItem, i) {
  const { labelLine: outsideLabel, data } = pieItem

  const { formatter, distanceToLabelLine } = outsideLabel

  const { labelLine, name, percentForLabel, value, align } = data[i]

  const formatterType = typeof formatter

  let label = name

  if (formatterType === 'string') {
    label = formatter.replace('{name}', name)
    label = label.replace('{percent}', percentForLabel)
    label = getFormatterVal(callbackSendable, label, {name: value}, i)
  }

  if (formatterType === 'function') {
    label = formatter({name: data[i]}, i)
  }

  return {
    content: label,
    position: [labelLine[2][0] + ((align.textAlign === 'left' ? 1 : -1) * distanceToLabelLine), labelLine[2][1]],
  }
}

function getOutsideLabelStyle (pieItem, i) {
  const { labelLine: outsideLabel, data } = pieItem

  const { color, align } = data[i]

  const { style } = outsideLabel

  return deepMerge({ fill: color, ...align }, style)
}
