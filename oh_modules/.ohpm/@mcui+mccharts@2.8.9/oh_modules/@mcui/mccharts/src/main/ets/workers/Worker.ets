import { ErrorEvent, MessageEvents, ThreadWorkerGlobalScope, worker } from '@kit.ArkTS';
import Charts from '../mcCore/index'
import  {
  InterfaceObj
} from '../utils/chartInterface'
import { emitter } from '@kit.BasicServicesKit';

const workerPort: ThreadWorkerGlobalScope = worker.workerPort;
const settings: RenderingContextSettings = new RenderingContextSettings(true)
let drawMcChart: Charts | null = null



workerPort.onmessage = (e: MessageEvents) => {
  if (e.data.requestAnimationFrame) {
    setTimeout(
      () => {
        emitter.emit('animation-' + e.data.chartId)
      }, 1000 / 30);
  }
  if (e.data.myOffCanvas) {
    let offCanvas: OffscreenCanvas = e.data.myOffCanvas
    let offContext = offCanvas.getContext("2d", settings)
    drawMcChart = new Charts(offContext, workerPort, {
      width: e.data.info.width,
      height: e.data.info.height
    }, e.data.sendableTestClass)
    // const option: InterfaceObj = getOptionCallback(JSON.parse(e.data.myOptions), e.data.callbackList)
    drawMcChart.setOption(JSON.parse(e.data.myOptions))
  } else if (drawMcChart) {
    if (e.data.update) {
      drawMcChart.setOption(JSON.parse(e.data.myOptions))
    }

    if (e.data.bindZoom) {
      drawMcChart.bindZoom(e.data.velocity, e.data.chartType === 'hor')
    }

    if (e.data.ctxClick) {
      drawMcChart.ctxClick(e.data.event, (flag: boolean, event: InterfaceObj, tooltipInfo: InterfaceObj = {}) => {
        let eventData: emitter.EventData = {
          data: {
            flag,
            event: JSON.stringify(event),
            tooltipInfo: JSON.stringify(tooltipInfo)
          }
        };
        emitter.emit('showInfo-' + e.data.chartId, eventData)
      })
    }

    if (e.data.bindZoom) {
      drawMcChart.bindZoom(e.data.velocity, e.data.chartTypeFlag)
    }

    if (e.data.bindZoomScale) {
      drawMcChart.bindZoomScale(e.data.scale)
    }

    if (e.data.disappear) {
      drawMcChart.animationTimer()
    }
  }
}

/**
 * Defines the event handler to be called when the worker receives a message that cannot be deserialized.
 * The event handler is executed in the worker thread.
 *
 * @param e message data
 */
workerPort.onmessageerror = (e: MessageEvents) => {
}

/**
 * Defines the event handler to be called when an exception occurs during worker execution.
 * The event handler is executed in the worker thread.
 *
 * @param e error message
 */
workerPort.onerror = (e: ErrorEvent) => {
}