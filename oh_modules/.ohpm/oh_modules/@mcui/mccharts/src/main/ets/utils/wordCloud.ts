interface settingsInterface {
  list: any[];
  fontFamily: string;
  fontWeight: string;
  color: string;
  minSize: number;
  weightFactor: ((pt: number) => number) | number;
  clearCanvas: boolean;
  backgroundColor: string;

  gridSize: number;
  drawOutOfBound: boolean;
  shrinkToFit: boolean;
  origin: null;

  drawMask: boolean;
  maskColor: 'rgba(255,0,0,0.3)';
  maskGapWidth: number;

  wait: number;
  abortThreshold: number;
  abort: () => void;

  minRotation: number;
  maxRotation: number;
  rotationSteps: number;

  shuffle: boolean;
  rotateRatio: number;

  shape: string | ((theta: number) => number);
  ellipticity: number;

  classes: null;

  hover: null | ((item, dimension, evt) => void);
  click: null |  ((item, dimension, evt) => void);
  vp2px: ((number) => number);
}

const isSupported = true

const minFontSize = 0

const getItemExtraData = function (item) {
  if (Array.isArray(item)) {
    const itemCopy = item.slice()
    itemCopy.splice(0, 2)
    return itemCopy
  } else {
    return []
  }
}

const shuffleArray = function shuffleArray (arr) {
  for (let j, x, i = arr.length; i;) {
    j = Math.floor(Math.random() * i)
    x = arr[--i]
    arr[i] = arr[j]
    arr[j] = x
  }
  return arr
}

const timer = {};
const WordCloud = function WordCloud (elements, offCanvas, options) {
  if (!isSupported) {
    return
  }
  const fcanvas = offCanvas

  const timerId = Math.floor(Math.random() * Date.now())

  if (!Array.isArray(elements)) {
    elements = [elements]
  }

  const settings: settingsInterface = {
    list: [],
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    color: 'random-dark',
    minSize: 0,
    weightFactor: 2,
    clearCanvas: true,
    backgroundColor: '#fff',

    gridSize: 12,
    drawOutOfBound: false,
    shrinkToFit: false,
    origin: null,

    drawMask: false,
    maskColor: 'rgba(255,0,0,0.3)',
    maskGapWidth: 0.3,

    wait: 0,
    abortThreshold: 0,
    abort: function noop () {},

    minRotation: -Math.PI / 2,
    maxRotation: Math.PI / 2 ,
    rotationSteps: 2,

    shuffle: true,
    rotateRatio: 0.5,

    shape: 'circle',
    ellipticity: 0.65,

    classes: null,

    hover: () => {},
    click: null,
    vp2px: (num: number) => {return num}
  }

  if (options) {
    for (const key in options) {
      if (key in settings) {
        settings[key] = options[key]
      }
    }
  }

  if (typeof settings.weightFactor !== 'function') {
    const factor = settings.weightFactor
    settings.weightFactor  = (pt: number) => {
      var r = false ? 10 : 1 / 10;
      var a = (36 - 10) / (Math.pow(100, r) - Math.pow(2, r));
      var b = 36 - a * Math.pow(100, r);
      return Math.ceil(a * Math.pow(pt, r) + b);
    }
  }

  /* Convert shape into a function */
  if (typeof settings.shape !== 'function') {
    switch (settings.shape) {
      case 'circle':
    /* falls through */
      default:
      // 'circle' is the default and a shortcut in the code loop.
        settings.shape = 'circle'
        break

      case 'cardioid':
        settings.shape = function shapeCardioid (theta: number) {
          return 1 - Math.sin(theta)
        }
        break

      case 'diamond':
        settings.shape = function shapeSquare (theta) {
          const thetaPrime = theta % (2 * Math.PI / 4)
          return 1 / (Math.cos(thetaPrime) + Math.sin(thetaPrime))
        }
        break

      case 'square':
      // http://www.wolframalpha.com/input/?i=plot+r+%3D+min(1%2Fabs(cos(t
      // )),1%2Fabs(sin(t)))),+t+%3D+0+..+2*PI
        settings.shape = function shapeSquare (theta) {
          return Math.min(
            1 / Math.abs(Math.cos(theta)),
            1 / Math.abs(Math.sin(theta))
          )
        }
        break

      case 'triangle-forward':
      // http://www.wolframalpha.com/input/?i=plot+r+%3D+1%2F%28cos%28mod+
      // %28t%2C+2*PI%2F3%29%29%2Bsqrt%283%29sin%28mod+%28t%2C+2*PI%2F3%29
      // %29%29%2C+t+%3D+0+..+2*PI
        settings.shape = function shapeTriangle (theta) {
          const thetaPrime = theta % (2 * Math.PI / 3)
          return 1 / (Math.cos(thetaPrime) +
            Math.sqrt(3) * Math.sin(thetaPrime))
        }
        break

      case 'triangle':
      case 'triangle-upright':
        settings.shape = function shapeTriangle (theta) {
          const thetaPrime = (theta + Math.PI * 3 / 2 ) % (2 * Math.PI / 3)
          return 1 / (Math.cos(thetaPrime) +
            Math.sqrt(3) * Math.sin(thetaPrime))
        }
        break

      case 'pentagon':
        settings.shape = function shapePentagon (theta) {
          const thetaPrime = (theta + 0.955) % (2 * Math.PI / 5)
          return 1 / (Math.cos(thetaPrime) +
            0.726543 * Math.sin(thetaPrime))
        }
        break

      case 'star':
        settings.shape = function shapeStar (theta) {
          const thetaPrime = (theta + 0.955) % (2 * Math.PI / 10)
          if ((theta + 0.955) % (2 * Math.PI / 5) - (2 * Math.PI / 10) >= 0) {
            return 1 / (Math.cos((2 * Math.PI / 10) - thetaPrime) +
              3.07768 * Math.sin((2 * Math.PI / 10) - thetaPrime))
          } else {
            return 1 / (Math.cos(thetaPrime) +
              3.07768 * Math.sin(thetaPrime))
          }
        }
        break
    }
  }

  /* Make sure gridSize is a whole number and is not smaller than 4px */
  settings.gridSize = Math.max(Math.floor(settings.gridSize), 4)

  /* shorthand */
  const g = settings.gridSize
  const maskRectWidth = g - settings.maskGapWidth

  /* normalize rotation settings */
  const rotationRange = Math.abs(settings.maxRotation - settings.minRotation)
  const rotationSteps = Math.abs(Math.floor(settings.rotationSteps))
  const minRotation = Math.min(settings.maxRotation, settings.minRotation)

  let grid,
    ngx, ngy,
    center,
    maxRadius

  let escapeTime

  let getTextColor
  function randomHslColor (min, max) {
    return 'hsl(' +
    (Math.random() * 360).toFixed() + ',' +
    (Math.random() * 30 + 70).toFixed() + '%,' +
    (Math.random() * (max - min) + min).toFixed() + '%)'
  }
  switch (settings.color) {
    case 'random-dark':
      getTextColor = function getRandomDarkColor () {
        return randomHslColor(10, 50)
      }
      break

    case 'random-light':
      getTextColor = function getRandomLightColor () {
        return randomHslColor(50, 90)
      }
      break

    default:
      if (typeof settings.color === 'function') {
        getTextColor = settings.color
      }
      break
  }

  let getTextFontWeight
  if (typeof settings.fontWeight === 'function') {
    getTextFontWeight = settings.fontWeight
  }

  let getTextClasses = null
  if (typeof settings.classes === 'function') {
    getTextClasses = settings.classes
  }

  /* Interactive */
  let interactive = false
  const infoGrid = []
  let hovered

  const getInfoGridFromMouseTouchEvent =
    function getInfoGridFromMouseTouchEvent (evt) {
      const canvas = evt.currentTarget
      const rect = canvas.getBoundingClientRect()
      let clientX
      let clientY
      if (evt.touches) {
        clientX = evt.touches[0].clientX
        clientY = evt.touches[0].clientY
      } else {
        clientX = evt.clientX
        clientY = evt.clientY
      }
      const eventX = clientX - rect.left
      const eventY = clientY - rect.top

      const x = Math.floor(eventX * ((canvas.width / rect.width) || 1) / g)
      const y = Math.floor(eventY * ((canvas.height / rect.height) || 1) / g)

      if (!infoGrid[x]) {
        return null
      }

      return infoGrid[x][y]
    }

  const wordcloudhover = function wordcloudhover (evt) {
    const info = getInfoGridFromMouseTouchEvent(evt)

    if (hovered === info) {
      return
    }

    hovered = info
    if (!info) {
      settings.hover(undefined, undefined, evt)
      return
    }
    settings.hover(info.item, info.dimension, evt)
  }

  const wordcloudclick = function wordcloudclick (evt) {
    const info = getInfoGridFromMouseTouchEvent(evt)
    if (!info) {
      return
    }

    settings.click(info.item, info.dimension, evt)
    evt.preventDefault()
  }

  /* Get points on the grid for a given radius away from the center */
  const pointsAtRadius = []
  const getPointsAtRadius = function getPointsAtRadius (radius) {
    if (pointsAtRadius[radius]) {
      return pointsAtRadius[radius]
    }

    // Look for these number of points on each radius
    const T = radius * 8

    // Getting all the points at this radius
    let t = T
    const points = []

    if (radius === 0) {
      points.push([center[0], center[1], 0])
    }

    while (t--) {
      // distort the radius to put the cloud in shape
      let rx = 1
      if (settings.shape !== 'circle' && typeof settings.shape == 'function') {
        rx = settings.shape(t / T * 2 * Math.PI) // 0 to 1
      }

      // Push [x, y, t] t is used solely for getTextColor()
      points.push([
        center[0] + radius * rx * Math.cos(-t / T * 2 * Math.PI),
        center[1] + radius * rx * Math.sin(-t / T * 2 * Math.PI) *
        settings.ellipticity,
        t / T * 2 * Math.PI])
    }

    pointsAtRadius[radius] = points
    return points
  }

  /* Return true if we had spent too much time */
  const exceedTime = function exceedTime () {
    return ((settings.abortThreshold > 0) &&
      ((new Date()).getTime() - escapeTime > settings.abortThreshold))
  }

  /* Get the deg of rotation according to settings, and luck. */
  const getRotateDeg = function getRotateDeg () {
    if (settings.rotateRatio === 0) {
      return 0
    }

    if (Math.random() > settings.rotateRatio) {
      return 0
    }

    if (rotationRange === 0) {
      return minRotation
    }

    if (rotationSteps > 0) {
      // Min rotation + zero or more steps * span of one step
      return minRotation +
        Math.floor(Math.random() * rotationSteps) *
          rotationRange / (rotationSteps - 1)
    } else {
      return minRotation + Math.random() * rotationRange
    }
  }

  const getTextInfo = function getTextInfo (word, weight, rotateDeg, extraDataArray) {
    // calculate the acutal font size
    // fontSize === 0 means weightFactor function wants the text skipped,
    // and size < minSize means we cannot draw the text.
    const debug = false
    const fontSize: number = typeof settings.weightFactor == 'function' ?  settings.weightFactor(weight) : 0
    if (fontSize <= settings.minSize) {
      return false
    }

    // Scale factor here is to make sure fillText is not limited by
    // the minium font size set by browser.
    // It will always be 1 or 2n.
    let mu = 1
    if (fontSize < minFontSize) {
      mu = (function calculateScaleFactor () {
        let mu = 2
        while (mu * fontSize < minFontSize) {
          mu += 2
        }
        return mu
      })()
    }

    // Get fontWeight that will be used to set fctx.font
    let fontWeight
    if (getTextFontWeight) {
      fontWeight = getTextFontWeight(word, weight, fontSize, extraDataArray)
    } else {
      fontWeight = settings.fontWeight
    }

    const fctx = fcanvas

    fctx.font = fontWeight + ' ' +
    (fontSize * mu).toString() + 'px ' + settings.fontFamily

    const fw = fctx.measureText(word).width / mu
    const fh = Math.max(fontSize * mu, fctx.measureText('m').width, fctx.measureText('\uFF37').width) / mu
    // const fh = fctx.measureText(word).height / mu

    // Create a boundary box that is larger than our estimates,
    // so text don't get cut of (it sill might)
    let boxWidth = fw * 3
    let boxHeight = fh * 3
    const fgw = Math.ceil(boxWidth / g)
    const fgh = Math.ceil(boxHeight / g)
    boxWidth = fgw * g
    boxHeight = fgh * g

    // Calculate the proper offsets to make the text centered at
    // the preferred position.

    // This is simply half of the width.
    const fillTextOffsetX = -fw / 2
    // Instead of moving the box to the exact middle of the preferred
    // position, for Y-offset we move 0.4 instead, so Latin alphabets look
    // vertical centered.
    const fillTextOffsetY = -fh / 2

    // Calculate the actual dimension of the canvas, considering the rotation.
    const cgh = Math.ceil((boxWidth * Math.abs(Math.sin(rotateDeg)) +
      boxHeight * Math.abs(Math.cos(rotateDeg))) / g)
    const cgw = Math.ceil((boxWidth * Math.abs(Math.cos(rotateDeg)) +
      boxHeight * Math.abs(Math.sin(rotateDeg))) / g)
    const width = cgw * g
    const height = cgh * g

    // fcanvas.setAttribute('width', width)
    // fcanvas.setAttribute('height', height)

    if (debug) {
      // Attach fcanvas to the DOM
      // document.body.appendChild(fcanvas)
      // Save it's state so that we could restore and draw the grid correctly.
      fctx.save()
    }

    // Scale the canvas with |mu|.
    fctx.scale(1 / mu, 1 / mu)
    fctx.translate(width * mu / 2 , height * mu / 2 )
    fctx.rotate(-rotateDeg)

    // Once the width/height is set, ctx info will be reset.
    // Set it again here.
    fctx.font = fontWeight + ' ' +
    (fontSize * mu).toString() + 'px ' + settings.fontFamily

    // Fill the text into the fcanvas.
    // XXX: We cannot because textBaseline = 'top' here because
    // Firefox and Chrome uses different default line-height for canvas.
    // Please read https://bugzil.la/737852#c6.
    // Here, we use textBaseline = 'middle' and draw the text at exactly
    // 0.5 * fontSize lower.
    fctx.fillStyle = '#000'
    fctx.textBaseline = 'middle'
    fctx.fillText(
      word, fillTextOffsetX * mu,
      (fillTextOffsetY + fontSize * 0.5) * mu
    )

    // Get the pixels of the text
    const imageData = fctx.getImageData(0, 0, width, height).data

    if (exceedTime()) {
      return false
    }

    if (debug) {
      // Draw the box of the original estimation
      fctx.strokeRect(
        fillTextOffsetX * mu,
        fillTextOffsetY, fw * mu, fh * mu
      )
      fctx.restore()
    }

    // Read the pixels and save the information to the occupied array
    const occupied = []
    let gx = cgw
    let gy, x, y
    const bounds = [cgh / 2, cgw / 2, cgh / 2, cgw / 2]
    while (gx--) {
      gy = cgh
      while (gy--) {
        y = g
        /* eslint no-labels: ["error", { "allowLoop": true }] */
        singleGridLoop: while (y--) {
          x = g
          while (x--) {
            if (imageData[((gy * g + y) * width +
              (gx * g + x)) * 4 + 3]) {
              occupied.push([gx, gy])

              if (gx < bounds[3]) {
                bounds[3] = gx
              }
              if (gx > bounds[1]) {
                bounds[1] = gx
              }
              if (gy < bounds[0]) {
                bounds[0] = gy
              }
              if (gy > bounds[2]) {
                bounds[2] = gy
              }

              if (debug) {
                fctx.fillStyle = 'rgba(255, 0, 0, 0.5)'
                fctx.fillRect(gx * g, gy * g, g - 0.5, g - 0.5)
              }
              break singleGridLoop
            }
          }
        }
        if (debug) {
          fctx.fillStyle = 'rgba(0, 0, 255, 0.5)'
          fctx.fillRect(gx * g, gy * g, g - 0.5, g - 0.5)
        }
      }
    }

    if (debug) {
      fctx.fillStyle = 'rgba(0, 255, 0, 0.5)'
      fctx.fillRect(
        bounds[3] * g,
        bounds[0] * g,
        (bounds[1] - bounds[3] + 1) * g,
        (bounds[2] - bounds[0] + 1) * g
      )
    }

    // Return information needed to create the text on the real canvas
    return {
      mu: mu,
      occupied: occupied,
      bounds: bounds,
      gw: cgw,
      gh: cgh,
      fillTextOffsetX: fillTextOffsetX,
      fillTextOffsetY: fillTextOffsetY,
      fillTextWidth: fw,
      fillTextHeight: fh,
      fontSize: fontSize
    }
  }

  /* Determine if there is room available in the given dimension */
  const canFitText = function canFitText (gx, gy, gw, gh, occupied) {
    // Go through the occupied points,
    // return false if the space is not available.
    let i = occupied.length
    while (i--) {
      const px = gx + occupied[i][0]
      const py = gy + occupied[i][1]

      if (px >= ngx || py >= ngy || px < 0 || py < 0) {
        if (!settings.drawOutOfBound) {
          return false
        }
        continue
      }

      if (!grid[px][py]) {
        return false
      }
    }
    return true
  }

  /* Actually draw the text on the grid */
  const drawText = function drawText (gx, gy, info, word, weight, distance, theta, rotateDeg, attributes, extraDataArray) {
    const fontSize = info.fontSize
    let color
    if (getTextColor) {
      color = getTextColor(word, weight, fontSize, distance, theta, extraDataArray)
    } else {
      color = settings.color
    }

    // get fontWeight that will be used to set ctx.font and font style rule
    let fontWeight
    if (getTextFontWeight) {
      fontWeight = getTextFontWeight(word, weight, fontSize, extraDataArray)
    } else {
      fontWeight = settings.fontWeight
    }

    let classes
    if (getTextClasses) {
      classes = getTextClasses(word, weight, fontSize, extraDataArray)
    } else {
      classes = settings.classes
    }

    elements.forEach(function (el) {
      const ctx = el
      const mu = info.mu

      ctx.save()
      ctx.scale(1 / mu, 1 / mu)

      ctx.font = fontWeight + ' ' +
      (fontSize * mu).toString() + 'px ' + settings.fontFamily
      ctx.fillStyle = color

      ctx.translate(
        (gx + info.gw / 2) * g * mu,
        (gy + info.gh / 2) * g * mu
      )

      if (rotateDeg !== 0) {
        ctx.rotate(-rotateDeg)
      }

      ctx.textBaseline = 'middle'
      ctx.fillText(
        word, info.fillTextOffsetX * mu,
        (info.fillTextOffsetY + fontSize * 0.5) * mu
      )

      ctx.restore()
    })
  }

  /* Help function to updateGrid */
  const fillGridAt = function fillGridAt (x, y, drawMask, dimension, item) {
    if (x >= ngx || y >= ngy || x < 0 || y < 0) {
      return
    }

    grid[x][y] = false

    if (drawMask) {
      const ctx = elements[0]
      ctx.fillRect(x * g, y * g, maskRectWidth, maskRectWidth)
    }

    if (interactive) {
      infoGrid[x][y] = { item: item, dimension: dimension }
    }
  }

  /* Update the filling information of the given space with occupied points.
     Draw the mask on the canvas if necessary. */
  const updateGrid = function updateGrid (gx, gy, gw, gh, info, item) {
    const occupied = info.occupied
    const drawMask = settings.drawMask
    let ctx
    if (drawMask) {
      ctx = elements[0]
      ctx.save()
      ctx.fillStyle = settings.maskColor
    }

    let dimension
    if (interactive) {
      const bounds = info.bounds
      dimension = {
        x: (gx + bounds[3]) * g,
        y: (gy + bounds[0]) * g,
        w: (bounds[1] - bounds[3] + 1) * g,
        h: (bounds[2] - bounds[0] + 1) * g
      }
    }

    let i = occupied.length
    while (i--) {
      const px = gx + occupied[i][0]
      const py = gy + occupied[i][1]

      if (px >= ngx || py >= ngy || px < 0 || py < 0) {
        continue
      }

      fillGridAt(px, py, drawMask, dimension, item)
    }

    if (drawMask) {
      ctx.restore()
    }
  }

  /* putWord() processes each item on the list,
     calculate it's size and determine it's position, and actually
     put it on the canvas. */
  const putWord = function putWord (item) {
    let word, weight, attributes
    if (Array.isArray(item)) {
      word = item[0]
      weight = item[1]
    } else {
      word = item.word
      weight = item.weight
      attributes = item.attributes
    }
    const rotateDeg = getRotateDeg()

    const extraDataArray = getItemExtraData(item)

    // get info needed to put the text onto the canvas
    const info = getTextInfo(word, weight, rotateDeg, extraDataArray)

    // not getting the info means we shouldn't be drawing this one.
    if (!info) {
      return false
    }

    if (exceedTime()) {
      return false
    }

    // If drawOutOfBound is set to false,
    // skip the loop if we have already know the bounding box of
    // word is larger than the canvas.
    if (!settings.drawOutOfBound && !settings.shrinkToFit) {
      const bounds = info.bounds;
      if ((bounds[1] - bounds[3] + 1) > ngx ||
        (bounds[2] - bounds[0] + 1) > ngy) {
        return false
      }
    }

    // Determine the position to put the text by
    // start looking for the nearest points
    let r = maxRadius + 1

    const tryToPutWordAtPoint = function (gxy) {
      const gx = Math.floor(gxy[0] - info.gw / 2)
      const gy = Math.floor(gxy[1] - info.gh / 2)
      const gw = info.gw
      const gh = info.gh

      // If we cannot fit the text at this position, return false
      // and go to the next position.
      if (!canFitText(gx, gy, gw, gh, info.occupied)) {
        return false
      }

      // Actually put the text on the canvas
      drawText(gx, gy, info, word, weight,
        (maxRadius - r), gxy[2], rotateDeg, attributes, extraDataArray)

      // Mark the spaces on the grid as filled
      updateGrid(gx, gy, gw, gh, info, item)

      // Return true so some() will stop and also return true.
      return true
    }

    while (r--) {
      let points = getPointsAtRadius(maxRadius - r)

      if (settings.shuffle) {
        points = [].concat(points)
        shuffleArray(points)
      }

      // Try to fit the words by looking at each point.
      // array.some() will stop and return true
      // when putWordAtPoint() returns true.
      // If all the points returns false, array.some() returns false.
      const drawn = points.some(tryToPutWordAtPoint)

      if (drawn) {
        // leave putWord() and return true
        return true
      }
    }
    if (settings.shrinkToFit) {
      if (Array.isArray(item)) {
        item[1] = item[1] * 3 / 4
      } else {
        item.weight = item.weight * 3 / 4
      }
      return putWord(item)
    }
    // we tried all distances but text won't fit, return false
    return false
  }

  /* Send DOM event to all elements. Will stop sending event and return
     if the previous one is canceled (for cancelable events). */
  const sendEvent = function sendEvent (type, cancelable, details) {
    if (cancelable) {
      return !elements.some(function (el) {
        // const event = new CustomEvent(type, {
        //   detail: details || {}
        // })
        // return !el.dispatchEvent(event)
      }, this)
    } else {
      elements.forEach(function (el) {
        // const event = new CustomEvent(type, {
        //   detail: details || {}
        // })
        // el.dispatchEvent(event)
      }, this)
    }
  }

  /* Start drawing on a canvas */
  const start = function start () {
    // For dimensions, clearCanvas etc.,
    // we only care about the first element.
    const canvas = elements[0]

    ngx = Math.ceil(canvas.width / g)
    ngy = Math.ceil(canvas.height / g)
    console.log('ngx', ngx, ngy)
    // if (canvas.getContext) {
    //
    // } else {
    //   const rect = canvas.getBoundingClientRect()
    //   ngx = Math.ceil(rect.width / g)
    //   ngy = Math.ceil(rect.height / g)
    // }

    // 绑定事件
    // if (!sendEvent('wordcloudstart', true)) {
    //   return
    // }

    // Determine the center of the word cloud
    center = (settings.origin)
      ? [settings.origin[0] / g, settings.origin[1] / g]
      : [ngx / 2, ngy / 2]

    // Maxium radius to look for space
    maxRadius = Math.floor(Math.sqrt(ngx * ngx + ngy * ngy))

    /* Clear the canvas only if the clearCanvas is set,
       if not, update the grid to the current canvas state */
    grid = []

    let gx, gy, i
    let bctx = fcanvas

    bctx.fillStyle = settings.backgroundColor
    bctx.fillRect(0, 0, 1, 1)
    let bgPixel = bctx.getImageData(0, 0, 1, 1).data

    let imageData =
      canvas.getImageData(0, 0, ngx * g, ngy * g).data

    gx = ngx
    let x, y
    elements.forEach(function (el) {
      var ctx = el
      ctx.fillStyle = settings.backgroundColor
      ctx.clearRect(0, 0, ngx * (g + 1), ngy * (g + 1))
      ctx.fillRect(0, 0, ngx * (g + 1), ngy * (g + 1))
    })

    /* fill the grid with empty state */
    gx = ngx
    while (gx--) {
      grid[gx] = []
      gy = ngy
      while (gy--) {
        grid[gx][gy] = true
      }
    }

    // fill the infoGrid with empty state if we need it
    if (settings.hover || settings.click) {
      interactive = true

      /* fill the grid with empty state */
      gx = ngx + 1
      while (gx--) {
        infoGrid[gx] = []
      }
      // 悬浮
      // if (settings.hover) {
      //   canvas.addEventListener('mousemove', wordcloudhover)
      // }

      // 点击
      // if (settings.click) {
      //   canvas.addEventListener('click', wordcloudclick)
      //   canvas.style.webkitTapHighlightColor = 'rgba(0, 0, 0, 0)'
      // }

      // 初始化
      // canvas.addEventListener('wordcloudstart', function stopInteraction () {
      //   canvas.removeEventListener('wordcloudstart', stopInteraction)
      //   canvas.removeEventListener('mousemove', wordcloudhover)
      //   canvas.removeEventListener('click', wordcloudclick)
      // })
    }

    i = 0
    let loopingFunction, stoppingFunction
    // if (settings.wait !== 0) {
    //
    // } else {
    //   loopingFunction = setInterval
    //   stoppingFunction = clearInterval
    // }
    loopingFunction = setTimeout
    stoppingFunction = clearTimeout

    const addEventListener = function addEventListener (type, listener) {
      // elements.forEach(function (el) {
      //   el.addEventListener(type, listener)
      // }, this)
    }

    const removeEventListener = function removeEventListener (type, listener) {
      // elements.forEach(function (el) {
      //   el.removeEventListener(type, listener)
      // }, this)
    }

    const anotherWordCloudStart = function anotherWordCloudStart () {
      removeEventListener('wordcloudstart', anotherWordCloudStart)
      stoppingFunction(timer[timerId])
    }

    addEventListener('wordcloudstart', anotherWordCloudStart)
    timer[timerId] = loopingFunction(function loop () {
      if (i >= settings.list.length) {
        stoppingFunction(timer[timerId])
        // sendEvent('wordcloudstop', false)
        removeEventListener('wordcloudstart', anotherWordCloudStart)
        delete timer[timerId];
        return
      }
      escapeTime = (new Date()).getTime()
      const drawn = putWord(settings.list[i])
      const canceled = !sendEvent('wordclouddrawn', true, {
        item: settings.list[i],
        drawn: drawn
      })
      if (exceedTime() || canceled) {
        stoppingFunction(timer[timerId])
        settings.abort()
        // sendEvent('wordcloudabort', false)
        // sendEvent('wordcloudstop', false)
        removeEventListener('wordcloudstart', anotherWordCloudStart)
        delete timer[timerId]
        return
      }
      i++
      timer[timerId] = loopingFunction(loop, settings.wait)
    }, settings.wait)
  }

  // All set, start the drawing
  start()
}

WordCloud.isSupported = isSupported
WordCloud.minFontSize = minFontSize
WordCloud.stop = function stop () {
  if (timer) {
    for (const timerId in timer) {
      clearInterval(timer[timerId])
    }
  }
}

export {
  WordCloud
}