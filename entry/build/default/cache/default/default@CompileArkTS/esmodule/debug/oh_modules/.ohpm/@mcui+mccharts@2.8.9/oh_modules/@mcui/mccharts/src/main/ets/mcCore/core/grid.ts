import { doUpdate } from "@normalized:N&&&@mcui/mccharts/src/main/ets/mcCore/class/updater.class&2.8.9";
import { deepClone } from "@normalized:N&&&@mcui/mccharts/src/main/ets/mcCore/cRender/plugin/util&2.8.9";
import { gridConfig } from "@normalized:N&&&@mcui/mccharts/src/main/ets/mcCore/config/index&2.8.9";
import { deepMerge } from "@normalized:N&&&@mcui/mccharts/src/main/ets/mcCore/util/index&2.8.9";
export async function grid(chart, option) {
    let { grid } = option;
    grid = deepMerge(deepClone(gridConfig, true), grid || {});
    doUpdate({
        chart,
        series: [grid],
        key: 'grid',
        getGraphConfig: getGridConfig
    });
}
function getGridConfig(gridItem, updater) {
    const { animationCurve, animationFrame, rLevel } = gridItem;
    const shape = getGridShape(gridItem, updater);
    const style = getGridStyle(gridItem);
    updater.chart.gridArea = { ...shape };
    return [{
            name: 'rect',
            index: rLevel,
            animationCurve,
            animationFrame,
            shape,
            style
        }];
}
function getGridShape(gridItem, updater) {
    const [w, h] = updater.chart.render.area;
    const left = getNumberValue(gridItem.left, w);
    const right = getNumberValue(gridItem.right, w);
    const top = getNumberValue(gridItem.top, h);
    const bottom = getNumberValue(gridItem.bottom, h);
    const width = w - left - right;
    const height = h - top - bottom;
    return { x: left, y: top, w: width, h: height };
}
function getNumberValue(val, all) {
    if (typeof val === 'number')
        return val;
    if (typeof val !== 'string')
        return 0;
    return all * parseInt(val) / 100;
}
function getGridStyle(gridItem) {
    const { style } = gridItem;
    return {
        fill: style.color
    };
}
