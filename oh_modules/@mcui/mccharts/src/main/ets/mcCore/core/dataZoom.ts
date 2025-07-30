// import { doUpdate } from '../class/updater.class'

import { deepClone } from '../cRender/plugin/util'

import { dataZoomConfig } from '../config'

import { deepMerge } from '../util'

export function dataZoom (chart, option) {
  let dataZoom = deepMerge(deepClone(dataZoomConfig, true), option.dataZoom || {})
  // 先找出axis轴线为data的
  let maxLength = 0
  maxLength = getAxisLength(option, 'xAxis', maxLength)
  maxLength = getAxisLength(option, 'yAxis', maxLength)

  dataZoom.num = dataZoom.end - dataZoom.start + 1
  dataZoom = adjustDataZoom(dataZoom, maxLength)
  chart.dataZoom = dataZoom
}

function adjustDataZoom(dataZoom, actualDataLength) {
  // 计算实际的结束位置
  let end = Math.min(dataZoom.end, actualDataLength - 1);
  // 计算实际的开始位置
  let start = dataZoom.start;
  // 调整num以确保它不会超过实际数据长度
  let num = Math.min(end - start + 1, actualDataLength);

  // 如果num为0，则设置合理的默认值
  if (num <= 0) {
    start = 0;
    end = actualDataLength > 0 ? actualDataLength - 1 : 0;
    num = actualDataLength;
  }

  return { end, start, num, show: dataZoom.show };
}


function getAxisLength (option, type, maxLength) {
  if (Array.isArray(option[type])) {
    option[type].forEach(item => {
      if (item.type !== 'data' ) {
        maxLength = Math.max(maxLength, item.data ? item.data.length || 0 : 0)
      }
    })
  } else {
    if (option[type].type !== 'value' ) {
      maxLength = Math.max(maxLength, option[type].data ? option[type].data.length || 0 : 0)
    }
  }

  return maxLength
}