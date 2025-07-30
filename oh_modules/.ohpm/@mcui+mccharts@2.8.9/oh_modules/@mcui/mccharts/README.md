# mcCharts

## 简介

mcCharts(莓创图表)是McUI提供的一款开箱即用的图表工具库。作为HarmonyOS一款开源的图表组件库，组件库将会提供以下图表：折线图、柱状图、饼图、散点图、雷达图等等。
并提供了配套的设计资源，充分满足可定制化的需求。

## 官方文档地址

[mcCharts官方文档，快速跳转](http://meichuangit.net.cn/GettingStarted)


## 联系我们

[打开扫码加入QQ交流群](http://meichuangit.net.cn/QQ.png)



[扫码加入QQ管理员加入QQ交流群](http://meichuangit.net.cn/wx.jpg)


## 安装教程

```shell
 ohpm install @mcui/mccharts
```

# 使用案例

## 1、折线图

### 引入折线图组件

```javascript
 import { McLineChart, Options } from '@mcui/mccharts'
```

### 使用

```ArkTs
@Entry
@Component
struct Index {
    // 初始化数据
    @State seriesOption: Options = new Options({
      xAxis:{
        data:['周一','周二','周三','周四','周五','周六','周日']
      },
      yAxis:{
        name:'温度'
      },
      series:[
        {
          name:'最高气温',
          data:[11, 11, 15, 13, 12, 130, 10]
        },
        {
          name:'最低气温',
          data:[1, -20, 2, 5, 3, 2, 0]
        }
      ]
    })
    // 动态修改数据
    aboutToAppear() {
        setTimeout(() => {
          // 传递需要修改的属性与数值，不需要全部传
          this.seriesOption.setVal({
            series:[
                {
                  name:'最高气温',
                  data:[110, 110, 150, 130, 120, 190, 100]
                }
            ]
          })
        }, 2000)
    }
    build() {
        Row() {
          McLineChart({
            options: this.seriesOption
          })
        }
        .height('50%')
    }
}
```

### `options` 基础参数介绍

| 参数名 | 类型  | 必填  | 说明                                          |
| ----  | ----  |-----|---------------------------------------------|
| xAxis | xAxis | 非必填 | 绘画直角坐标系 grid 中的 Y 轴。支持设置刻度、文本标签等功能以及样式。     |
| yAxis | yAxis | 非必填 | 绘画直角坐标系 grid 中的 Y 轴。支持设置刻度、文本标签、分割线等功能以及样式。 |
| series | series | 必填  | 用折线将各个数据点标志连接起来的图表，用于展现数据的变化趋势。             |


### `xAxis` 属性参数介绍
| 参数名       | 类型        | 必填  | 说明            |
|-----------|-----------|-----|---------------|
| axisLine  | axisLine  | 非必填 | 坐标轴轴线相关设置。    |
| axisTick  | axisTick  | 非必填 | 坐标轴刻度相关设置。    |
| axisLabel | axisLabel | 非必填 | 坐标轴刻度标签的相关设置。 |
| data      | array     | 必填  | 坐标轴的类目数据。     |


### `yAxis` 属性参数介绍
| 参数名           | 类型            | 必填  | 说明                             |
|---------------|---------------|-----|--------------------------------|
| name          | string        | 非必填 | 坐标轴名称。                     |
| nameTextStyle | nameTextStyle | 非必填 | 坐标轴名称的文字样式。                     |
| axisLine      | axisLine      | 非必填 | 坐标轴轴线相关设置。                     |
| axisTick      | axisTick      | 非必填 | 坐标轴刻度相关设置。                     |
| axisLabel     | axisLabel     | 非必填  | 坐标轴刻度标签的相关设置。 |

### `series` 属性参数介绍
| 参数名       | 类型        | 必填    | 说明                  |
|-----------|-----------|-------|---------------------|
| name      | string    | 必填    | 系列名称，用于tooltip的显示，legend 的图例筛选，在 setOption<br/> 更新数据和配置项时用于指定对应的系列。          |
| lineStyle | lineStyle | 非必填   | 坐标轴名称的文字样式。          |
| axisLine  | axisLine  | 非必填   | 线条样式。               |
| label     | label     | 非必填   | 图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等。       |
| itemStyle | itemStyle | 非必填   | 折线拐点标志的样式。 |
| data      | array     | 必填    | 系列中的数据内容数组。数组项通常为具体的数据项。 |


### `axisLine` 公共属性参数介绍
| 参数名        | 类型        | 必填  | 说明            | 默认值    |
|------------|-----------|-----|---------------|--------|
| show       | boolean       | 非必填 | 是否显示坐标轴轴线。    | true   |
| lineStyle  | lineStyle  | 非必填 | 坐标轴线样式相关设置。   | {}     |
| axisLabel.color  | Color | 非必填  | 坐标轴线线的颜色。 | '#333' |