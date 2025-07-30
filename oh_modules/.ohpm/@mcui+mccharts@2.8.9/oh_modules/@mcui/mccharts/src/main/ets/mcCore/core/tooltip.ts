import { doUpdate } from '../class/updater.class'

import { deepClone } from '../cRender/plugin/util'

import { tooltipConfig } from '../config'

import { deepMerge } from '../util'

export function tooltip (chart, option) {
  let tooltip = deepMerge(deepClone(tooltipConfig, true), option.tooltip || {})

  doUpdate({
    chart,
    series: [tooltip],
    key: 'tooltip',
    getGraphConfig: getTooltipConfig
  })
  chart.tooltip.series = tooltip
}

function getTooltipConfig (tooltip) {
  const {
    axisPointer: {
      type
    },
    visible = false
  } = tooltip
  return [{
    name: getGraphName(type),
    index: 14,
    visible,
    shape: type === 'line' ? getLineAndAreaShape(tooltip) : getNormalBarShape(tooltip),
    style: type === 'line' ? getLineStyle(tooltip) : getBarStyle(tooltip)
  }]
}


function getLineAndAreaShape (tooltipItem) {
  const { linePosition = [[0, 0], [0, 0]] } = tooltipItem

  return {
    points: linePosition
  }
}


function getLineStyle (tooltipItem) {
  const { axisPointer: { lineStyle } } = tooltipItem
  const { color = '#DDE2EB', width = 1} = lineStyle

  return deepMerge({
    stroke: color,
  }, {
    lineWidth: width
  })
}

function getNormalBarShape (barItem) {
  const { linePosition = [[0, 0], [0, 0]] } = barItem

  const [[startX, startY], [endX, endY]] = linePosition

  // const valueAxis = barItem.valueAxis.axis

  const shape = {
    x: 0,
    y: 0,
    w: 0,
    h: 0
  }

  shape.x = startX
  shape.y = endY
  shape.w = endX - startX
  shape.h = startY - endY

  // if (valueAxis === 'x') {
  //
  // } else {
  //   // shape.x = labelAxisPos - barWidth / 2
  //   // shape.y = end
  //   // shape.w = barWidth
  //   // shape.h = start - end
  // }

  return shape
}


function getBarStyle (barItem) {
  const { axisPointer: { shadowStyle } } = barItem

  return deepMerge({
    fill: shadowStyle.color
  }, {
    lineWidth: shadowStyle.borderWidth,
    stroke: shadowStyle.borderColor
  })
}


function getGraphName (type) {
  return type === 'line' ? 'polyline' : 'rect'
}