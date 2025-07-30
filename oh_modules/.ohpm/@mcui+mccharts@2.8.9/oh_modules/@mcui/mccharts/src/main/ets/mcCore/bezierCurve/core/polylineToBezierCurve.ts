/**
 * @description 将由 N 个点构成的折线抽象成一组贝塞尔曲线
 * @param {Array} polyline 构成折线的一组点
 * @param {Boolean} close 是否闭合曲线
 * @param {Number} offsetA 平滑度
 * @param {Number} offsetB 平滑度
 * @return {Array|Boolean} 一组贝塞尔曲线（无效输入将返回 false）
 */
function polylineToBezierCurve (polyline, close = false, offsetA = 0.25, offsetB = 0.25) {
  if (!(polyline instanceof Array)) {
    console.error('polylineToBezierCurve: Parameter polyline must be an array!')

    return false
  }

  if (polyline.length <= 2) {
    console.error('polylineToBezierCurve: Converting to a curve requires at least 3 points!')

    return false
  }

  const startPoint = polyline[0]

  const bezierCurveLineNum = polyline.length - 1

  const bezierCurvePoints = new Array(bezierCurveLineNum).fill(0).map((foo, i) =>
    [...getBezierCurveLineControlPoints(polyline, i, close, offsetA, offsetB), polyline[i + 1]])

  if (close) closeBezierCurve(bezierCurvePoints, startPoint)

  bezierCurvePoints.unshift(polyline[0])

  return clipBezierPointsToBounds(polyline, bezierCurvePoints)
}

/**
 * @description 获取一组坐标点中的最小和最大 x, y 值
 * @param {Array<Array<number>>} coordinates 一组坐标点
 * @returns {Object} 包含最小和最大 x, y 值的对象
 */
function findMinMaxCoordinates(coordinates) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // 遍历所有坐标点以找到最大和最小值
  coordinates.forEach(point => {
    if (point[0] < minX) minX = point[0];
    if (point[0] > maxX) maxX = point[0];
    if (point[1] < minY) minY = point[1];
    if (point[1] > maxY) maxY = point[1];
  });

  return { minX, maxX, minY, maxY };
}

/**
 * @description 根据原始坐标点的边界调整贝塞尔曲线的控制点
 * @param {Array<Array<number>>} originalPoints 原始坐标点
 * @param {Array<Array<Array<number>|Array<Array<number>>>>} bezierPoints 贝塞尔曲线的控制点
 * @returns {Array<Array<Array<number>|Array<Array<number>>>>} 调整后的贝塞尔曲线控制点
 */
function clipBezierPointsToBounds(originalPoints, bezierPoints) {
  const bounds = findMinMaxCoordinates(originalPoints);

  // 检查并调整贝塞尔曲线的所有控制点以确保它们在边界内
  const clippedBezierPoints = bezierPoints.map((controlPoint, index) => {
    if (index !== 0) {
      // 如果是数组，则遍历每个控制点并调整
      return controlPoint.map(p => {
        const x = Math.max(bounds.minX, Math.min(bounds.maxX, p[0]));
        const y = Math.max(bounds.minY, Math.min(bounds.maxY, p[1]));
        return [x, y];
      });
    } else {
      // 如果不是数组，则直接调整单个点
      const x = Math.max(bounds.minX, Math.min(bounds.maxX, controlPoint[0]));
      const y = Math.max(bounds.minY, Math.min(bounds.maxY, controlPoint[1]));
      return [x, y];
    }
  });

  return clippedBezierPoints;
}

/**
 * @description Get the control points of the Bezier curve
 * @param {Array} polyline A set of points that make up a polyline
 * @param {Number} index   The index of which get controls points's point in polyline
 * @param {Boolean} close  Closed curve
 * @param {Number} offsetA Smoothness
 * @param {Number} offsetB Smoothness
 * @return {Array} Control points
 */
function getBezierCurveLineControlPoints (polyline, index, close = false, offsetA = 0.25, offsetB = 0.25) {
  const pointNum = polyline.length

  if (pointNum < 3 || index >= pointNum) return

  let beforePointIndex = index - 1
  if (beforePointIndex < 0) beforePointIndex = (close ? pointNum + beforePointIndex : 0)

  let afterPointIndex = index + 1
  if (afterPointIndex >= pointNum) afterPointIndex = (close ? afterPointIndex - pointNum : pointNum - 1)

  let afterNextPointIndex = index + 2
  if (afterNextPointIndex >= pointNum) afterNextPointIndex = (close ? afterNextPointIndex - pointNum : pointNum - 1)

  const pointBefore = polyline[beforePointIndex]
  const pointMiddle = polyline[index]
  const pointAfter = polyline[afterPointIndex]
  const pointAfterNext = polyline[afterNextPointIndex]

  return [
    [
      pointMiddle[0] + offsetA * (pointAfter[0] - pointBefore[0]),
      pointMiddle[1] + offsetA * (pointAfter[1] - pointBefore[1])
    ],
    [
      pointAfter[0] - offsetB * (pointAfterNext[0] - pointMiddle[0]),
      pointAfter[1] - offsetB * (pointAfterNext[1] - pointMiddle[1])
    ]
  ]
}

/**
 * @description Get the last curve of the closure
 * @param {Array} bezierCurve A set of sub-curve
 * @param {Array} startPoint  Start point
 * @return {Array} The last curve for closure
 */
function closeBezierCurve (bezierCurve, startPoint) {
  const firstSubCurve = bezierCurve[0]
  const lastSubCurve = bezierCurve.slice(-1)[0]

  bezierCurve.push([
    getSymmetryPoint(lastSubCurve[1], lastSubCurve[2]),
    getSymmetryPoint(firstSubCurve[0], startPoint),
    startPoint
  ])

  return bezierCurve
}

/**
 * @description Get the symmetry point
 * @param {Array} point       Symmetric point
 * @param {Array} centerPoint Symmetric center
 * @return {Array} Symmetric point
 */
function getSymmetryPoint (point, centerPoint) {
  const [px, py] = point
  const [cx, cy] = centerPoint

  const minusX = cx - px
  const minusY = cy - py

  return [cx + minusX, cy + minusY]
}

export default polylineToBezierCurve
