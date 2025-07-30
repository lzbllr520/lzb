import { doUpdate } from '../class/updater.class'

import { deepClone } from '../cRender/plugin/util'

import { legendConfig } from '../config'

import { deepMerge, mulAdd } from '../util'

export function legend (chart, option) {
  let { legend, series } = option

  if (legend) {
    legend = deepMerge(deepClone(legendConfig, true), legend)

    legend = initLegendData(series, legend)
  
    legend = filterInvalidData(legend, option, chart)
  
    legend = calcLegendTextWidth(legend, chart)
  
    legend = calcLegendPosition(legend, chart)

    legend = [legend]
  } else {
    legend = []
  }

  doUpdate({
    chart,
    series: legend,
    key: 'legendIcon',
    getGraphConfig: getIconConfig
  })

  doUpdate({
    chart,
    series: legend,
    key: 'legendText',
    getGraphConfig: getTextConfig
  })
}

function initLegendData (series, legend) {
  const { data } = legend

  if (data.length) {
    legend.data = data.map(item => {
      const itemType = typeof item

      if (itemType === 'string') {
        return { name: item }
      } else if (itemType === 'object') {
        return item
      }

      return { name: '' }
    })
  } else {
    const legendData = []
    series.forEach(item => {
      const itemType = typeof item
      if (itemType === 'string') {
        legendData.push({ name: item })
      } else if (item.type === 'pie') {
        item.data.forEach(li => {
          legendData.push({name: li.name})
        })
      } else if (itemType === 'object') {
        legendData.push({name: item.name})
      }
      legendData.push({name: ''})
    })
    legend.data = legendData.map(item => item)
  }


  return legend
}

function filterInvalidData (legend, option, chart) {
  const { series } = option

  let { legendStatus } = chart

  const data = legend.data.filter(item => {
    const { name } = item

    let result = series.find(({ name: sn }) => name === sn)

    if (!result) {
      // 检查一下是否有饼图
      series.forEach(({ type, data }) => {
        if (type === 'pie') {
          result = data.find(({ name: sn }) => name === sn)
        }
      })
    }

    if (!result) return false

    if (!item.color) {
      item.color = result.color
      if (result.type === 'line' && result.lineStyle && result.lineStyle.color) {
        item.color = result.lineStyle.color
      }
      if (result.type === 'bar' && result.barStyle && result.barStyle.color) {
        item.color = result.barStyle.color
      }
      if (result.type === 'bar' && result.gradient && result.gradient.color.length) {
        item.color = result.gradient.color
      }
    }

    if (!item.icon) item.icon = result.type || 'circle'

    return item
  })

  if (!legendStatus || legendStatus.length !== legend.data.length) legendStatus = new Array(legend.data.length).fill(true)

  data.forEach((item, i) => (item.status = legendStatus[i]))

  legend.data = data

  chart.legendStatus = legendStatus

  return legend
}

function calcLegendTextWidth (legend, chart) {
  const { ctx } = chart.render

  const { data, textStyle, textUnselectedStyle } = legend

  data.forEach(item => {
    const { status, name } = item
    if (name) {
      item.textWidth = getTextWidth(ctx, name, status ? textStyle : textUnselectedStyle).width
      item.textHeight= getTextWidth(ctx, name, status ? textStyle : textUnselectedStyle).height
    } else {
      item.textWidth = 0
      item.textHeight = 0
    }
  })

  return legend
}

function getTextWidth (ctx, text, style) {
  ctx.font = getFontConfig(style)

  return ctx.measureText(text)
}

function getFontConfig (style) {
  const { fontFamily, fontSize } = style

  return `${fontSize}px ${fontFamily}`
}

function calcLegendPosition (legend, chart) {
  const { orient } = legend

  if (orient === 'vertical') {
    calcVerticalPosition(legend, chart)
  } else {
    calcHorizontalPosition(legend, chart)
  }
  
  return legend
}

function calcHorizontalPosition (legend, chart) {
  const { itemHeight, itemGap, align: legendAlign } = legend

  const lines = calcDefaultHorizontalPosition(legend, chart)

  const xOffsets = lines.map(line => getHorizontalXOffset(line, legend, chart))
  const yOffset = getHorizontalYOffset(legend, chart)

  const align = { textAlign: 'left', textBaseline: 'middle' }

  lines.forEach((line, i) => line.forEach(item => {
      const { iconPosition, textPosition } = item

      let xOffset = xOffsets[i]
      const realYOffset = yOffset + i * (itemGap + itemHeight)

      item.iconPosition = mergeOffset(iconPosition, [xOffset, realYOffset])
      item.textPosition = mergeOffset(textPosition, [xOffset, realYOffset])
      item.align = align
    })
  )
}

function calcDefaultHorizontalPosition (legend, chart) {
  const { data, itemWidth, itemTextGap, align } = legend

  const w = chart.render.area[0]

  let startIndex = 0

  const lines = [[]]

  data.forEach((item, i) => {
    let beforeWidth = getBeforeWidth(startIndex, i, legend)

    const endXPos = beforeWidth + itemWidth + 5 + item.textWidth

    if (endXPos >= w) {
      startIndex = i
      beforeWidth = getBeforeWidth(startIndex, i, legend)

      lines.push([])
    }
    if (align === 'right') {
      item.iconPosition = [beforeWidth + itemTextGap + item.textWidth, 0]
      item.textPosition = [beforeWidth, 0]
    } else {
      item.iconPosition = [beforeWidth, 0]
      item.textPosition = [beforeWidth + itemTextGap + itemWidth, 0]
    }

    lines.slice(-1)[0].push(item)
  })

  return lines
}

function getBeforeWidth (startIndex, currentIndex, legend) {
  const { data, itemWidth, itemGap } = legend

  const beforeItem = data.slice(startIndex, currentIndex)

  return mulAdd(beforeItem.map(({ textWidth }) => textWidth)) + (currentIndex - startIndex) * (itemGap + 5 + itemWidth)
}

function getHorizontalXOffset (data, legend, chart) {
  let { left, right, itemWidth, itemGap } = legend

  const w = chart.render.area[0]

  const dataNum = data.length

  const allWidth = mulAdd(data.map(({ textWidth }) => textWidth)) + dataNum * (5 + itemWidth) + (dataNum - 1) * itemGap 

  const horizontal = [left, right].findIndex(pos => pos !== 'auto')

  if (horizontal === -1) {
    return (w - allWidth) / 2
  } else if (horizontal === 0) {
    if (typeof left === 'number') return left

    return parseInt(left) / 100 * w
  } else {
    if (typeof right !== 'number') right = parseInt(right) / 100 * w

    return w - (allWidth + right)
  }
}

function getHorizontalYOffset (legend, chart) {
  let { top, bottom, itemHeight } = legend

  const h = chart.render.area[1]

  const vertical = [top, bottom].findIndex(pos => pos !== 'auto')

  const halfitemHeight = itemHeight / 2

  if (vertical === -1) {
    const { y, h: height } = chart.gridArea

    return y + height + 45 - halfitemHeight
  } else if (vertical === 0) {
    if (typeof top === 'number') return top - halfitemHeight

    return parseInt(top) / 100 * h - halfitemHeight
  } else {
    if (typeof bottom !== 'number') bottom = parseInt(bottom) / 100 * h

    return h - bottom - halfitemHeight
  }
}

function mergeOffset ([x, y], [ox, oy]) {
  return [x + ox, y + oy]
}

function calcVerticalPosition (legend, chart) {

  const [isRight, xOffset] = getVerticalXOffset(legend, chart)
  const yOffset = getVerticalYOffset(legend, chart)

  const lines = calcDefaultVerticalPosition(legend, isRight, chart)

  let align = { textAlign: 'left', textBaseline: 'middle' }
  lines.forEach((line, i) => line.forEach(item => {
    const { iconPosition, textPosition } = item

    item.iconPosition = mergeOffset(iconPosition, [xOffset, yOffset])
    item.textPosition = mergeOffset(textPosition, [xOffset, yOffset])
    item.align = align
  })
  )
}

function getVerticalXOffset (legend, chart) {
  const { left, right, align } = legend

  const w = chart.render.area[1]

  const horizontal = [left, right].findIndex(pos => pos !== 'auto')

  if (horizontal === -1) {
    return [
      align === 'auto' ? true : align === 'right',
      w * 0.8
    ]
  } else {
    let offset = [left, right][horizontal]

    if (typeof offset !== 'number') offset = parseInt(offset) / 100 * w

    if (horizontal === 1) offset = w - offset

    return [
      align === 'auto' ? Boolean(horizontal) : align === 'right',
      offset
    ]
  }
}

function getVerticalYOffset (legend, chart) {
  const { itemHeight, itemGap, data, top, bottom } = legend

  const h = chart.render.area[1]

  const dataNum = data.length

  const allHeight = dataNum * itemHeight + (dataNum - 1) * itemGap

  const vertical = [top, bottom].findIndex(pos => pos !== 'auto')

  if (vertical === -1) {
    return (h - allHeight) / 2
  } else {
    let offset = [top, bottom][vertical]

    if (typeof offset !== 'number') offset = parseInt(offset) / 100 * h

    if (vertical === 1) offset = h - offset - allHeight

    return offset
  }
}

function calcDefaultVerticalPosition (legend, isRight, chart) {

  const { data, itemWidth, itemHeight, itemTextGap, itemGap } = legend

  const halfitemHeight = itemHeight / 2

  const h = chart.render.area[1]

  let startIndex = 0

  let maxLeft = 0

  let beforeWidth = 0

  const lines = [[]]

  data.forEach((item, i) => {
    const { textWidth, textHeight } = item

    let yPos = (Math.max(textHeight, itemHeight) + itemGap) * startIndex + (textHeight > itemHeight ? itemHeight / 2 : halfitemHeight)

    if (yPos >= h) {
      startIndex = 0

      yPos = (Math.max(textHeight, itemHeight) + itemGap) * startIndex + (textHeight > itemHeight ? itemHeight / 2 : halfitemHeight)

      beforeWidth += maxLeft

      lines.push([])
    }


    const iconXPos = isRight ? (0 - itemWidth) : 0
    const textXpos = isRight ? (iconXPos - 10 - itemTextGap - textWidth) : (itemWidth + itemTextGap)

    item.iconPosition = [beforeWidth + iconXPos, yPos]
    item.textPosition = [beforeWidth + textXpos, yPos]
    lines.slice(-1)[0].push(item)
    startIndex++
    maxLeft = Math.max(maxLeft, textWidth + itemWidth + itemTextGap)
  })

  return lines
}

function getIconConfig (legendItem, updater) {
  const { icon, data, selectAble, animationCurve, animationFrame, rLevel } = legendItem
  //lineIcon
  return data.map((item, i) => ({
    name: icon || (item.icon === 'line' ? 'circle' : 'rect'),
    index: rLevel,
    visible: legendItem.show,
    hover: selectAble,
    click: selectAble || createClickCallBack(legendItem, i, updater),
    animationCurve,
    animationFrame,
    shape: getIconShape(legendItem, i),
    style: getIconStyle(legendItem, i)
  }))
}

function getIconShape (legendItem, i) {
  const { data, itemWidth, itemHeight, icon, iconRadian } = legendItem

  const [x, y] = data[i].iconPosition

  const halfitemHeight = itemHeight / 2

  const shape = {
    rx: x,
    ry: y,
    x,
    y: y - halfitemHeight,
    w: itemWidth,
    h: itemHeight,
    r: 0
  }

  if (icon === 'circle') {
    shape.r = itemWidth / 2
  }

  if (icon === 'roundRect') {
    shape.r = iconRadian
  }
  return shape
}

function getIconStyle (legendItem, i) {
  const { data, itemWidth, itemHeight, icon, iconRadian, iconStyle, iconUnselectedStyle } = legendItem
  const [x, y] = data[i].iconPosition


  const { status, color } = data[i]

  const fillColor = status ? color : iconUnselectedStyle.color

  let gradientColor = Array.isArray(fillColor) ? fillColor : [fillColor]


  if (gradientColor.length === 1) gradientColor.push(gradientColor[0])

  const gradientParams = [x, y, x + itemWidth, y + itemHeight]

  return deepMerge({
    gradientColor,
    gradientParams,
    gradientType: 'linear',
    gradientWith: 'fill'
  }, {})

  // return deepMerge({ fill: color }, style)
}

function getTextConfig (legendItem, updater) {
  const { data, selectAble, animationCurve, animationFrame, rLevel } = legendItem

  return data.map((foo, i) => ({
    name: 'text',
    index: rLevel,
    visible: legendItem.show,
    hover: selectAble,
    animationCurve,
    animationFrame,
    hoverRect: getTextHoverRect(legendItem, i),
    shape: getTextShape(legendItem, i),
    style: getTextStyle(legendItem, i),
    click: createClickCallBack(legendItem, i, updater)
  }))
}

function getTextShape (legendItem, i) {
  const { textStyle: { formatter } } = legendItem
  const { textPosition, name } = legendItem.data[i]
  let content = name

  if (typeof formatter === 'string') {
    content = formatter.replace('{value}', content)
  }

  if (typeof formatter === 'function') {
    content = String(formatter(content, i))
  }
  return {
    content,
    position: textPosition
  }
}

function getTextStyle (legendItem, i) {
  const { textStyle, textUnselectedStyle } = legendItem

  const { status, align } = legendItem.data[i]
  const style = status ? {...textStyle} : {...textUnselectedStyle}
  style.fill = style.color || '#333'
  delete style.color
  return deepMerge(deepClone(style, true), align)
}

function getTextHoverRect (legendItem, i) {
  const { textStyle, textUnselectedStyle } = legendItem

  const { status, textPosition: [x, y], textWidth } = legendItem.data[i]

  const style = status ? textStyle : textUnselectedStyle

  const { fontSize } = style

  return [x, y - (fontSize / 2), textWidth, fontSize]
}

function createClickCallBack (legendItem, index, updater) {
  const { name } = legendItem.data[index]

  return () => {
    const { legendStatus, option } = updater.chart

    const status = !legendStatus[index]

    let oldAnimation = option.animation

    for (let i = 0; i < option.series.length; i++) {
      const seriesItem = option.series[i]
      if (seriesItem.type === 'pie' && seriesItem.data && seriesItem.data.length) {
        const change = seriesItem.data.find(({ name: sn }) => sn === name)
        if (change) {
          change.show = status

          legendStatus[index] = status
          // option.animation = false
          updater.chart.setOption(option)
          break;
        }
      } else if (seriesItem.name == name) {
        seriesItem.show = status

        legendStatus[index] = status
        // option.animation = false
        updater.chart.setOption(option)

        break;
      }
    }

  }
}