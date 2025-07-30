export class Updater {
  graphs
  beforeUpdate
  chart

  constructor (config, series) {
    const { chart, key, getGraphConfig } = config

    if (typeof getGraphConfig !== 'function') {
      console.warn('Updater need function getGraphConfig!')

      return
    }

    if (!chart[key]) this.graphs = chart[key] = []

    Object.assign(this, config)

    this.update(series, chart)
  }

  update(series, chart) {

    this.chart = chart

    const { graphs, beforeUpdate } = this

    this.delRedundanceGraph(this, series)

    if (!series.length) return

    const beforeUpdateType = typeof beforeUpdate
    series.forEach((seriesItem, i) => {
      if (beforeUpdateType === 'function') beforeUpdate(graphs, seriesItem, i, this)

      const cache = graphs[i]

      if (cache && cache.length) {
        this.changeGraphs(cache, seriesItem, i, this)
      } else {
        this.addGraphs(graphs, seriesItem, i, this)
      }
    })
  }

  // 只更新部分的key值
  updateKey (series, configKey) {
    const { graphs, beforeUpdate } = this

    this.delRedundanceGraph(this, series)

    if (!series.length) return

    const beforeUpdateType = typeof beforeUpdate

    series.forEach((seriesItem, i) => {
      if (beforeUpdateType === 'function') beforeUpdate(graphs, seriesItem, i, this)

      const cache = graphs[i]

      this.changeGraphs(cache, seriesItem, i, this, configKey)
    })
  }

  delRedundanceGraph (updater, series) {
    const { graphs, chart: { render } } = updater

    const cacheGraphNum = graphs.length
    const needGraphNum = series.length

    if (cacheGraphNum > needGraphNum) {
      const needDelGraphs = graphs.splice(needGraphNum)

      needDelGraphs.forEach(item => item.forEach(g => render.delGraph(g)))
    }
  }

  changeGraphs (cache, seriesItem, i, updater, configKey = null) {
    const { getGraphConfig, chart: { render }, beforeChange } = updater

    const configs = getGraphConfig(seriesItem, updater)

    this.balanceGraphsNum(cache, configs, render)

    cache.forEach((graph, j) => {
      if (graph) {
        const config = configs[j]

        if (typeof beforeChange === 'function') beforeChange(graph, config)
        if (configKey) {
          this.updateConfigByKey(graph, config, configKey)
        } else {
          this.updateGraphConfigByKey(graph, config, render)
        }
      }
    })
  }

  balanceGraphsNum (graphs, graphConfig, render) {
    const cacheGraphNum = graphs.length
    const needGraphNum = graphConfig.length

    if (needGraphNum > cacheGraphNum) {
      const lastCacheGraph = graphs.slice(-1)[0]
      if (!lastCacheGraph) return
      const needAddGraphNum = needGraphNum - cacheGraphNum

      const needAddGraphs = new Array(needAddGraphNum).fill(0).map(foo => render.clone(lastCacheGraph))

      graphs.push(...needAddGraphs)
    } else if (needGraphNum < cacheGraphNum) {
      const needDelCache = graphs.splice(needGraphNum)

      needDelCache.forEach(g => render.delGraph(g))
    }
  }

  addGraphs (graphs, seriesItem, i, updater) {
    const { getGraphConfig, getStartGraphConfig, chart } = updater

    const { render } = chart

    let startConfigs = null

    if (typeof getStartGraphConfig === 'function') startConfigs = getStartGraphConfig(seriesItem, updater)
    // console.log('添加渲染时间', new Date().getTime())
    const configs = getGraphConfig(seriesItem, updater)
    if (!configs.length) return
    // const time51 = Date.now()
    if (startConfigs) {
      const graphsItem = startConfigs.map(config => render.add(config))
      if (graphsItem) {
        graphs[i] = graphsItem

        graphs[i].forEach((graph, i) => {
          const config = configs[i]
          if (graph) {
            this.updateGraphConfigByKey(graph, config, render)
          }
        })
        // const time56 = Date.now()
        // console.log('时间5.6', time56-time51, graphs[i].length)
      }
    } else {
      const graphsItem = []
      for (let i = 0; i < configs.length; i++) {
        graphsItem.push(render.add(configs[i]))
      }

      if (graphsItem) {
        graphs[i] = graphsItem
      }
    }

    const { afterAddGraph } = updater

    if (typeof afterAddGraph === 'function') afterAddGraph(graphs[i])
    // console.log('添加结束渲染时间', new Date().getTime())
  }

  updateGraphConfigByKey (graph, config, render) {
    const keys = Object.keys(config)

    keys.forEach(key => {
      if ((key === 'shape' || key === 'style')) {
        graph.animation && graph.animation(key, config[key], true, config.animationFrame === 0 ? false : render.animation)
      } else {
        graph[key] = config[key]
      }
    })
  }

  updateConfigByKey (graph, config, configKeys) {
    configKeys.forEach(key => {
      graph[key] = config[key]
    })
  }
}

export async function doUpdate (updateObj) {
  const {
    chart,
    series,
    key,
    getGraphConfig,
    getStartGraphConfig,
    beforeChange,
    beforeUpdate,
    afterAddGraph
  } = updateObj
  if (chart[key]) {
    chart[key].update(series, chart)
  } else {
    chart[key] = new Updater({
      chart,
      key,
      getGraphConfig,
      getStartGraphConfig,
      beforeChange,
      beforeUpdate,
      afterAddGraph
    }, series)
  }
  // // 模拟异步操作
  // return new Promise((resolve, reject) => {
  //   try {
  //     // 执行更新逻辑...
  //
  //     resolve({ success: true });
  //   } catch (error) {
  //     reject(error);
  //   }
  // });
}