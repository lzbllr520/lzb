if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface McHorBarChart_Params {
    options?: Options;
    chartOption?: OptionInterface;
    renderType?: string;
    callbackSendableClass?: InterfaceObj;
    click?: Function;
    tooltipClick?: Function;
    customTooltip?: (tooltipInfo: InterfaceObj) => void;
}
import { globalBuilder } from "@normalized:N&&&@mcui/mccharts/src/main/ets/pageView/Tooltip&2.8.9";
import type { InterfaceObj, OptionInterface } from '../../utils/chartInterface';
import { Chart } from "@normalized:N&&&@mcui/mccharts/src/main/ets/pageView/Charts&2.8.9";
import type { Options } from "@normalized:N&&&@mcui/mccharts/src/main/ets/pageView/Charts&2.8.9";
import { deepCopy } from "@normalized:N&&&@mcui/mccharts/src/main/ets/utils/index&2.8.9";
export class McHorBarChart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__options = new SynchedPropertyObjectOneWayPU(params.options, this, "options");
        this.__chartOption = new ObservedPropertyObjectPU({}, this, "chartOption");
        this.__renderType = new ObservedPropertySimplePU('init', this, "renderType");
        this.callbackSendableClass = {};
        this.click = (event: InterfaceObj, params: InterfaceObj) => { };
        this.tooltipClick = (event: InterfaceObj, params: InterfaceObj) => { };
        this.customTooltip = globalBuilder;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("options", this.onCountUpdated);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: McHorBarChart_Params) {
        if (params.chartOption !== undefined) {
            this.chartOption = params.chartOption;
        }
        if (params.renderType !== undefined) {
            this.renderType = params.renderType;
        }
        if (params.callbackSendableClass !== undefined) {
            this.callbackSendableClass = params.callbackSendableClass;
        }
        if (params.click !== undefined) {
            this.click = params.click;
        }
        if (params.tooltipClick !== undefined) {
            this.tooltipClick = params.tooltipClick;
        }
        if (params.customTooltip !== undefined) {
            this.customTooltip = params.customTooltip;
        }
    }
    updateStateVars(params: McHorBarChart_Params) {
        this.__options.reset(params.options);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__options.purgeDependencyOnElmtId(rmElmtId);
        this.__chartOption.purgeDependencyOnElmtId(rmElmtId);
        this.__renderType.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__options.aboutToBeDeleted();
        this.__chartOption.aboutToBeDeleted();
        this.__renderType.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __options: SynchedPropertySimpleOneWayPU<Options>;
    get options() {
        return this.__options.get();
    }
    set options(newValue: Options) {
        this.__options.set(newValue);
    }
    private __chartOption: ObservedPropertyObjectPU<OptionInterface>;
    get chartOption() {
        return this.__chartOption.get();
    }
    set chartOption(newValue: OptionInterface) {
        this.__chartOption.set(newValue);
    }
    private __renderType: ObservedPropertySimplePU<string>;
    get renderType() {
        return this.__renderType.get();
    }
    set renderType(newValue: string) {
        this.__renderType.set(newValue);
    }
    private callbackSendableClass: InterfaceObj;
    private click: Function;
    private tooltipClick: Function;
    private __customTooltip; // 自定义组件
    // @Watch 回调
    onCountUpdated(options: Options): void {
        this.renderType = 'update';
        const newOptions = this.initOption(this.options.options);
        this.chartOption = newOptions;
    }
    aboutToAppear() {
        const options = this.initOption(this.options.options);
        this.chartOption = options;
    }
    initOption(options: InterfaceObj) {
        const xAxis: InterfaceObj = deepCopy(options.xAxis || {});
        const yAxis: InterfaceObj = deepCopy(options.yAxis || {});
        options.xAxis = yAxis;
        options.yAxis = xAxis;
        options.xAxis.type = 'value';
        options.yAxis.type = 'data';
        if (!options.legend) {
            options.legend = {
                show: true
            };
        }
        if (options.series && options.series.length) {
            options.series = options.series.map((item: InterfaceObj): InterfaceObj => {
                item.type = 'bar';
                return item;
            });
        }
        return options;
    }
    initialRender() {
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new Chart(this, {
                        options: this.__chartOption,
                        chartType: 'hor',
                        customTooltip: this.customTooltip,
                        callbackSendableClass: this.callbackSendableClass,
                        renderType: this.__renderType,
                        click: (event: InterfaceObj, params: InterfaceObj) => {
                            this.click(event, params);
                        },
                        tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
                            this.tooltipClick(event, params);
                        }
                    }, undefined, elmtId, () => { }, { page: "oh_modules/.ohpm/@mcui+mccharts@2.8.9/oh_modules/@mcui/mccharts/src/main/ets/components/mainpage/McHorBarChart.ets", line: 91, col: 5 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            options: this.chartOption,
                            chartType: 'hor',
                            customTooltip: this.customTooltip,
                            callbackSendableClass: this.callbackSendableClass,
                            renderType: this.renderType,
                            click: (event: InterfaceObj, params: InterfaceObj) => {
                                this.click(event, params);
                            },
                            tooltipClick: (event: InterfaceObj, params: InterfaceObj) => {
                                this.tooltipClick(event, params);
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "Chart" });
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
}
