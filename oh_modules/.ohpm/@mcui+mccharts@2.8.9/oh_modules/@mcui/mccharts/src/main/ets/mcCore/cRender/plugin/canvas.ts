/**
 * @description Draw a polyline path
 * @param {Object} ctx        Canvas 2d context
 * @param {Array} points      The points that makes up a polyline
 * @param {Boolean} beginPath Whether to execute beginPath
 * @param {Boolean} closePath Whether to execute closePath
 * @return {Undefined} Void
 */
export function drawPolylinePath (ctx, points, beginPath = false, closePath = false) {
  if (!ctx || points.length < 2) return false

  if (beginPath) ctx.beginPath()

  ctx.lineJoin = 'bevel'

  points.forEach((point, i) =>
    point && (i === 0 ? ctx.moveTo(...point) : ctx.lineTo(...point)))

  if (closePath) ctx.closePath()
}

/**
 * @description Draw a bezier curve path
 * @param {Object} ctx        Canvas 2d context
 * @param {Array} points      The points that makes up a bezier curve
 * @param {Array} moveTo      The point need to excute moveTo
 * @param {Boolean} beginPath Whether to execute beginPath
 * @param {Boolean} closePath Whether to execute closePath
 * @return {Undefined} Void
 */
export function drawBezierCurvePath (ctx, points, moveTo = false, beginPath = false, closePath = false) {
  if (!ctx || !points) return false

  if (beginPath) ctx.beginPath()

  ctx.lineJoin = 'bevel'

  if (moveTo) ctx.moveTo(moveTo[0], moveTo[1])

  points.forEach(item => {
    (item && ctx.bezierCurveTo(...item[0], ...item[1], ...item[2]))
  })

  if (closePath) {
    ctx.closePath()
  }
}

function manuallyFlattenTo2D(array) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      result.push(array[i][j]);
    }
  }
  return result;
}

function getIndexForFrame(dataCount, frameCountTotal, currentFrame) {
  // 计算每个数据点的基础帧数和额外帧数
  const baseFramesPerData = Math.floor(frameCountTotal / dataCount);
  const extraFrames = frameCountTotal % dataCount;

  // 判断当前帧是否属于额外帧部分
  let currentIndex;
  if (currentFrame <= extraFrames * (baseFramesPerData + 1)) {
    // 属于额外帧部分
    currentIndex = Math.ceil(currentFrame / (baseFramesPerData + 1)) - 1;
  } else {
    // 不属于额外帧部分
    const remainingFrames = currentFrame - extraFrames * (baseFramesPerData + 1);
    currentIndex = extraFrames + Math.ceil(remainingFrames / baseFramesPerData) - 1;
  }

  // 确保索引不超过数据数量
  return currentIndex % dataCount;
}

export default {
  drawPolylinePath,
  drawBezierCurvePath
}
