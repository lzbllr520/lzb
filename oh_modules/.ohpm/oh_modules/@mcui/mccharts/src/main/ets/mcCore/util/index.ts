import { deepClone } from '../cRender/plugin/util'
import display from '@ohos.display';
import { drawing } from '@kit.ArkGraphics2D';

export function filterNonNumber (array) {
  const newArray = []
  array.forEach(n => {
    if (n instanceof Object) {
      newArray.push(Number(n.value || 0))
    } else {
      newArray.push(Number(n || 0))
    }
  })
  return newArray
}

export function deepMerge (target, merged, flag?) {
  for (var key in merged) {
    if (key === 'data') {
      target[key] = deepClone(merged[key], false)
      continue
    }

    if (target[key] && typeof target[key] === 'object' && !flag) {
      deepMerge(target[key], merged[key], false)

      continue
    }

    if (typeof merged[key] === 'object') {
      target[key] = deepClone(merged[key], true)

      continue
    }
    if (![undefined, null, ''].includes(merged[key])) {
      target[key] = merged[key]
    }
  }

  return target
}

export function mulAdd (nums) {
  nums = filterNonNumber(nums)

  return nums.reduce((all, num) => (all || 0) + (num || 0), 0)
}

export function mergeSameStackData (item, series) {
  const stack = item.stack

  if (!stack) return item.data

  const stacks = series.filter(({ stack: s }) => s === stack)

  const index = stacks.findIndex(({ name }) => name === item.name)

  const datas = stacks.splice(0, index + 1).map(({ data }) => data)

  const dataLength = datas[0].length

  return new Array(dataLength)
    .fill(0)
    .map((foo, i) => mulAdd(datas.map(d => d[i])))
}

export function getTwoPointDistance (pointOne, pointTwo) {
  const minusX = Math.abs(pointOne[0] - pointTwo[0])

  const minusY = Math.abs(pointOne[1] - pointTwo[1])

  return Math.sqrt(minusX * minusX + minusY * minusY)
}

// 这里需要配置一下旋转角度
export function getLinearGradientColor (ctx, begin, end, color) {
  if (!ctx || !begin || !end || !color.length) return

  let colors = color

  typeof colors === 'string' && (colors = [color, color])

  const linearGradientColor = ctx.createLinearGradient(...begin, ...end)

  const colorGap = 1 / (colors.length - 1)

  colors.forEach((c, i) => linearGradientColor.addColorStop(colorGap * i, c))

  return linearGradientColor
}

export function getPolylineLength (points) {
  const lineSegments = new Array(points.length - 1)
    .fill(0)
    .map((foo, i) => [points[i], points[i + 1]])

  const lengths = lineSegments.map(item => getTwoPointDistance(item[0], item[1]))

  return mulAdd(lengths)
}

export function getPointToLineDistance (point, linePointOne, linePointTwo) {
  const a = getTwoPointDistance(point, linePointOne)
  const b = getTwoPointDistance(point, linePointTwo)
  const c = getTwoPointDistance(linePointOne, linePointTwo)

  return 0.5 * Math.sqrt((a + b + c) * (a + b - c) * (a + c - b) * (b + c - a)) / c
}

export function initNeedSeries (series, config, type, legendStatus = []) {
  series = series.filter(({ type: st }) => st === type)

  series = series.map(item => deepMerge(deepClone(config, true), item))

  if (type === 'pie') {
    const pieSeries = []
    series.forEach((item) => {
      if (item.data && item.data.length) {
        item.data = item.data.filter(({ show }, index) => (legendStatus.length ? legendStatus[index] : true) && (show === undefined ? true : show))
        if (item.data.length) {
          pieSeries.push(item)
        }
      }
    })
    return pieSeries
  } else {
    return series.filter(({ show, data }, index) => (legendStatus.length ? legendStatus[index] : true) && show && data && data.length)
  }
}

export function radianToAngle (radian) {
  return radian / Math.PI * 180
}


// 文本超长截取处理
export function drawTexts(font, text, maxWidth) {
  let currentWidth = 0;
  let textI = text.length
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];
    currentWidth += px2vp(font.measureText(letter, drawing.TextEncoding.TEXT_ENCODING_UTF8))
    if (currentWidth > maxWidth) {
      textI = i
      break; // 退出循环
    }
  }
  return textI;
}

// 文本超长换行处理
export function drawBreakText(font, text, maxWidth) {
  let currentWidth = 0;
  let lineHeight = 0;
  let textI = text.length
  // let x = position.x; // 初始x坐标
  // let y = position.y; // 初始y坐标
  let startIndex = 0
  const newText = []
  for (let i = 0; i < text.length; i++) {
    const letter = text[i];
    currentWidth += px2vp(font.measureText(letter, drawing.TextEncoding.TEXT_ENCODING_UTF8))
    // lineHeight = px2vp(font.measureText(letter, drawing.TextEncoding.TEXT_ENCODING_UTF8))
    if (currentWidth > maxWidth * 0.6) {
      // 绘制当前行的文本（不包含当前单词）
      newText.push(text.substring(startIndex, i + 1))
      // 重置当前行的宽度和y坐标
      startIndex = i + 1
      currentWidth = 0;
      // y += lineHeight;
    }
    // 如果是最后一个单词，或者遍历完所有单词，则绘制最后一行
    if (i === text.length - 1 && startIndex !== text.length) {
      newText.push(text.substring(startIndex, i + 1))
      // y += lineHeight;
      text = ''; // 重置文本以开始新段落（如果需要）
      currentWidth = 0; // 重置当前行宽度
    }
  }
  return newText.join('\n')
}


/**
 * 查找给定点 (x, y) 最接近的坐标点及其索引。
 *
 * @param {Array<Array<number>>} points - 包含多个坐标的数组，每个坐标是一个包含两个元素的数组 [x, y]。
 * @param {number} x - 给定的点击点的 x 坐标。
 * @param {number} y - 给定的点击点的 y 坐标。
 * @returns {number} - 返回最接近点的索引，如果没有任何点在 10 像素范围内，则返回 -1。
 */
export function findNearestPointIndex(points, x, y) {
  let minDistance = Infinity;
  let nearestPointIndex = -1;

  for (let i = 0; i < points.length; i++) {
    const [px, py] = points[i];
    // 计算两点之间的欧几里得距离
    const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);

    if (distance < minDistance) {
      minDistance = distance;
      nearestPointIndex = i;
    }
  }

  // 判断是否在10像素范围内
  if (minDistance <= 10) {
    return nearestPointIndex;
  } else {
    return -1; // 如果没有找到足够近的点，返回-1
  }
}


export function isPointInSector(pointX, pointY, centerX, centerY, radius, startAngle, endAngle) {
  // 计算给定坐标与扇形圆心的距离
  let distance = Math.sqrt(Math.pow(pointX - centerX, 2) + Math.pow(pointY - centerY, 2));
  // 计算给定坐标与扇形圆心的角度
  let angle = Math.atan2(pointY - centerY, pointX - centerX);
  // 将角度转换为正值（0到360度）
  if (angle < -Math.PI / 2) {
    angle += Math.PI * 2;
  }
  // 检查给定坐标是否在扇形的半径范围内，并且角度在起始角度和结束角度之间
  if (distance <= radius && angle >= startAngle && angle <= endAngle) {
    return true;
  }

  return false;
}


export function getIndices(startIndex, length, interval) {
  if (length <= 0) {
    return []; // 如果长度小于等于0，返回空数组
  }

  const indices = [startIndex]; // 始终包含起始索引

  // 计算中间的索引
  for (let i = startIndex + interval + 1; i <= startIndex + length - 1; i += interval + 1) {
    indices.push(i);
  }

  if (interval === 0) {
    indices.push(startIndex + length - 1); // 始终包含结束索引
  }

  return indices;
}


export function getTextWidth (ctx, text, style) {
  ctx.font = getFontConfig(style)

  return ctx.measureText(text)
}

export function getFontConfig (style) {
  const { fontFamily, fontSize } = style

  return `${fontSize}px ${fontFamily}`
}

export function px2vp (pxNum) {
  // 获取当前显示设备的密度像素
  let displayDensityPixels: number = display.getDisplayByIdSync(0).densityPixels || 3.25;

  // 将像素转换为视觉像素
  return pxNum / displayDensityPixels;
}

export function asyncTask(callBack) {
  return new Promise((resolve, reject) => {
    callBack()
    resolve({})
  });
}