import { doUpdate } from '../class/updater.class'

import { deepClone } from '../cRender/plugin/util'

import { titleConfig } from '../config'

import { deepMerge, getTextWidth } from '../util'

export function title (chart, option) {
  let title = []
  // if ((!option.title || !option.title.show) || (!option.title.text && !option.title.subtext)) return
  title[0] = deepMerge(deepClone(titleConfig, true), option.title || {})

  title = initTitleData(title, chart)

  doUpdate({
    chart,
    series: title,
    key: 'title',
    getGraphConfig: getTitleConfig
  })

  doUpdate({
    chart,
    series: title,
    key: 'subTitle',
    getGraphConfig: getSubTitleConfig
  })
}

function initTitleData (title, chart) {
  const { ctx } = chart.render
  const titleWidth = title[0].text ? getTextWidth(ctx, title[0].text, title[0].textStyle) : 0
  const subTitleWidth = title[0].subtext ? getTextWidth(ctx, title[0].subtext, title[0].textStyle) : {}
  title[0].titleWidth = titleWidth.width
  title[0].titleHeight = titleWidth.height

  title[0].subTitleWidth = subTitleWidth.width || 0
  title[0].subTitleHeight = subTitleWidth.height || 0
  return title
}



function getTitleConfig (titleItem, updater) {
  const { animationCurve, animationFrame, rLevel } = titleConfig

  const shape = getTitleShape(titleItem, updater)
  const style = getTitleStyle(titleItem, 'textStyle')

  return [{
    name: 'text',
    index: rLevel,
    visible: titleItem.show && titleItem.text,
    animationCurve,
    animationFrame,
    shape,
    style
  }]
}

function getSubTitleConfig (titleItem, updater) {
  const { animationCurve, animationFrame, rLevel } = titleConfig

  const shape = getSubTitleShape(titleItem, updater)
  const style = getTitleStyle(titleItem, 'subtextStyle')

  return [{
    name: 'text',
    index: rLevel,
    visible: titleItem.show && titleItem.subtext,
    animationCurve,
    animationFrame,
    shape,
    style
  }]
}

function getTitleShape (titleItem, updater) {
  const { offset, text, top, left, right, bottom } = titleItem
  const { x, y, w } = updater.chart.gridArea
  let titleX = getXOffset(titleItem, updater.chart)
  let titleY = getYOffset(titleItem, updater.chart)
  return {
    content: text,
    position: [titleX, titleY]
  }
}

function getXOffset (itemData, chart) {
  let { left, right, titleWidth, subTitleWidth } = itemData

  const w = chart.render.area[0]

  const horizontal = [left, right].findIndex(pos => pos !== 'auto')

  if (horizontal === -1) {
    return w / 2
  } else if (horizontal === 0) {
    if (typeof left === 'number') return left
    return parseInt(left) / 100 * w
  } else {
    if (typeof right !== 'number') right = parseInt(right) / 100 * w

    return w - (Math.max(titleWidth, subTitleWidth) / 2 + right)
  }
}

function getYOffset (itemData, chart) {
  let { top, bottom } = itemData

  const h = chart.render.area[1]

  const vertical = [top, bottom].findIndex(pos => pos !== 'auto')

  if (vertical === -1) {
    return h / 2
  } else if (vertical === 0) {
    if (typeof top === 'number') return top
    return parseInt(top) / 100 * h
  } else {
    if (typeof bottom !== 'number') bottom = parseInt(bottom) / 100 * h
    return h - bottom
  }
}

function getSubTitleShape (titleItem, updater) {
  const { offset, subtext, itemGap, titleHeight } = titleItem
  const { x, y, w } = updater.chart.gridArea
  let titleX = getXOffset(titleItem, updater.chart)
  let titleY = getYOffset(titleItem, updater.chart)
  return {
    content: subtext,
    position: [titleX, titleY + (titleHeight / 2) + itemGap]
  }
}

function getTitleStyle (titleItem, type) {
  const style = {
    fill: titleItem[type].color,
    ...titleItem[type]
  }
  delete style.color
  return style
}
