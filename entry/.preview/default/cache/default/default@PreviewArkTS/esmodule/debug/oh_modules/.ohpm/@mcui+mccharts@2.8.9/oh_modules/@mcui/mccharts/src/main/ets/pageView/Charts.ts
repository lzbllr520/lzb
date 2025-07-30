if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Chart_Params {
    chartId?: string;
    settings?: RenderingContextSettings;
    context?: CanvasRenderingContext2D;
    offContext?: OffscreenCanvasRenderingContext2D | null;
    drawMcChart?: Charts | null;
    callbackSendableClass?: InterfaceObj;
    timer?: number | null;
    click?: Function;
    tooltipClick?: Function;
    chartType?: string;
    startY?: number;
    velocity?: number;
    acceleration?: number;
    friction?: number;
    options?: OptionInterface;
    renderType?: string;
    isTooltipShow?: boolean;
    isZoom?: boolean;
    isScale?: boolean;
    tooltipInfo?: InterfaceObj;
    panOption?: PanGestureOptions;
    customTooltip?: (tooltipInfo: InterfaceObj) => void;
    myWorker?: null;
    isWorker?: boolean;
}
import type { InterfaceObj, LegendInterface, TooltipInterface, SeriesInterface, AxisInterface, DataZoomInterface, RadarInterface, OptionInterface } from '../utils/chartInterface';
import emitter from "@ohos:events.emitter";
import { deepCopy, assign, getId } from "@normalized:N&&&@mcui/mccharts/src/main/ets/utils/index&2.8.9";
import { Tooltip, globalBuilder } from "@normalized:N&&&@mcui/mccharts/src/main/ets/pageView/Tooltip&2.8.9";
import Charts from "@normalized:N&&&@mcui/mccharts/src/main/ets/mcCore/index&2.8.9";
export class Options {
    options: OptionInterface = {
        grid: {}
    };
    cPaddingT: number = 30;
    cPaddingB: number = 30;
    cPaddingL: number = 30;
    cPaddingR: number = 20;
    color: Array<string> = ['#296DFF', '#ff5495fd', '#ff1acffd', '#ff72e4fd', '#7B72F7', '#F85758', '#FFBF29', '#D1E9F9', '#F5FAFC', '#5A657A'];
    title: InterfaceObj = {};
    legend: LegendInterface = {};
    dataZoom: DataZoomInterface = {};
    tooltip: TooltipInterface = {};
    radar: RadarInterface = {};
    xAxis: AxisInterface = {};
    yAxis: AxisInterface | AxisInterface[] = {};
    series: Array<SeriesInterface> = [];
    animation: boolean = true;
    constructor(options: OptionInterface) {
        this.setVal(options);
    }
    setVal(options: OptionInterface) {
        const oldOptions: OptionInterface = deepCopy(this.options);
        const keys = ['grid', 'cPaddingT', 'cPaddingB', 'cPaddingL', 'cPaddingR', 'color', 'title', 'legend', 'xAxis', 'yAxis', 'tooltip', 'radar', 'dataZoom', 'animation', 'series'];
        for (let i = 0; i < keys.length; i++) {
            const item = keys[i];
            if (options[item] === undefined)
                continue;
            switch (item) {
                case 'grid':
                    oldOptions.grid = assign(oldOptions.grid, options[item]);
                    break;
                case 'cPaddingT':
                    if (oldOptions.grid) {
                        oldOptions.grid.top = options[item];
                    }
                    break;
                case 'cPaddingB':
                    if (oldOptions.grid) {
                        oldOptions.grid.bottom = options[item];
                    }
                    break;
                case 'cPaddingL':
                    if (oldOptions.grid) {
                        oldOptions.grid.left = options[item];
                    }
                    break;
                case 'cPaddingR':
                    if (oldOptions.grid) {
                        oldOptions.grid.right = options[item];
                    }
                    break;
                case 'tooltip':
                    oldOptions.tooltip = assign(oldOptions.tooltip, options[item]);
                    break;
                case 'title':
                    oldOptions.title = assign(oldOptions.title, options[item]);
                    break;
                case 'color':
                    oldOptions.color = options[item];
                    break;
                case 'legend':
                    oldOptions.legend = assign(oldOptions.legend, options[item]);
                    break;
                case 'xAxis':
                    oldOptions.xAxis = assign(oldOptions.xAxis, options[item]);
                    break;
                case 'yAxis':
                    oldOptions.yAxis = assign(oldOptions.yAxis, options[item]);
                    break;
                case 'dataZoom':
                    oldOptions.dataZoom = options[item];
                    break;
                case 'radar':
                    oldOptions.radar = assign(oldOptions.radar, options[item]);
                    break;
                case 'animation':
                    oldOptions.animation = options[item];
                    break;
                case 'series':
                    const seriesData: SeriesInterface[] | undefined = options[item];
                    if (oldOptions.series && seriesData) {
                        if (oldOptions.series.length === seriesData.length) {
                            oldOptions.series = oldOptions.series.map((item: SeriesInterface, index): SeriesInterface => {
                                item = assign(item, seriesData[index]);
                                return item;
                            });
                        }
                        else {
                            oldOptions.series = options[item];
                        }
                    }
                    else {
                        oldOptions.series = options[item];
                    }
                    break;
            }
        }
        this.options = oldOptions;
    }
}
export class Chart extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.chartId = getId();
        this.settings = new RenderingContextSettings(true);
        this.context = new CanvasRenderingContext2D(this.settings);
        this.offContext = null;
        this.drawMcChart = null;
        this.callbackSendableClass = {};
        this.timer = null;
        this.click = () => { };
        this.tooltipClick = () => { };
        this.chartType = 'line';
        this.startY = 0;
        this.velocity = 0;
        this.acceleration = 0.05;
        this.friction = 0.4;
        this.__options = new SynchedPropertyObjectTwoWayPU(params.options, this, "options");
        this.__renderType = new SynchedPropertySimpleTwoWayPU(params.renderType, this, "renderType");
        this.__isTooltipShow = new ObservedPropertySimplePU(false, this, "isTooltipShow");
        this.__isZoom = new ObservedPropertySimplePU(false, this, "isZoom");
        this.__isScale = new ObservedPropertySimplePU(false, this, "isScale");
        this.__tooltipInfo = new ObservedPropertyObjectPU({}, this, "tooltipInfo");
        this.panOption = new PanGestureOptions({ direction: PanDirection.None, distance: 1 });
        this.customTooltip = globalBuilder;
        this.myWorker = null;
        this.isWorker = false;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("options", this.onCountUpdated);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Chart_Params) {
        if (params.chartId !== undefined) {
            this.chartId = params.chartId;
        }
        if (params.settings !== undefined) {
            this.settings = params.settings;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.offContext !== undefined) {
            this.offContext = params.offContext;
        }
        if (params.drawMcChart !== undefined) {
            this.drawMcChart = params.drawMcChart;
        }
        if (params.callbackSendableClass !== undefined) {
            this.callbackSendableClass = params.callbackSendableClass;
        }
        if (params.timer !== undefined) {
            this.timer = params.timer;
        }
        if (params.click !== undefined) {
            this.click = params.click;
        }
        if (params.tooltipClick !== undefined) {
            this.tooltipClick = params.tooltipClick;
        }
        if (params.chartType !== undefined) {
            this.chartType = params.chartType;
        }
        if (params.startY !== undefined) {
            this.startY = params.startY;
        }
        if (params.velocity !== undefined) {
            this.velocity = params.velocity;
        }
        if (params.acceleration !== undefined) {
            this.acceleration = params.acceleration;
        }
        if (params.friction !== undefined) {
            this.friction = params.friction;
        }
        if (params.isTooltipShow !== undefined) {
            this.isTooltipShow = params.isTooltipShow;
        }
        if (params.isZoom !== undefined) {
            this.isZoom = params.isZoom;
        }
        if (params.isScale !== undefined) {
            this.isScale = params.isScale;
        }
        if (params.tooltipInfo !== undefined) {
            this.tooltipInfo = params.tooltipInfo;
        }
        if (params.panOption !== undefined) {
            this.panOption = params.panOption;
        }
        if (params.customTooltip !== undefined) {
            this.customTooltip = params.customTooltip;
        }
        if (params.myWorker !== undefined) {
            this.myWorker = params.myWorker;
        }
        if (params.isWorker !== undefined) {
            this.isWorker = params.isWorker;
        }
    }
    updateStateVars(params: Chart_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__options.purgeDependencyOnElmtId(rmElmtId);
        this.__renderType.purgeDependencyOnElmtId(rmElmtId);
        this.__isTooltipShow.purgeDependencyOnElmtId(rmElmtId);
        this.__isZoom.purgeDependencyOnElmtId(rmElmtId);
        this.__isScale.purgeDependencyOnElmtId(rmElmtId);
        this.__tooltipInfo.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__options.aboutToBeDeleted();
        this.__renderType.aboutToBeDeleted();
        this.__isTooltipShow.aboutToBeDeleted();
        this.__isZoom.aboutToBeDeleted();
        this.__isScale.aboutToBeDeleted();
        this.__tooltipInfo.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private chartId: string;
    private settings: RenderingContextSettings;
    private context: CanvasRenderingContext2D;
    private offContext: OffscreenCanvasRenderingContext2D | null;
    private drawMcChart: Charts | null;
    private callbackSendableClass: InterfaceObj;
    private timer: number | null;
    private click: Function;
    private tooltipClick: Function;
    private chartType: string;
    private startY: number;
    private velocity: number;
    private acceleration: number; // 加速度
    private friction: number; // 阻力系数
    private __options: SynchedPropertySimpleOneWayPU<OptionInterface>;
    get options() {
        return this.__options.get();
    }
    set options(newValue: OptionInterface) {
        this.__options.set(newValue);
    }
    private __renderType: SynchedPropertySimpleTwoWayPU<string>;
    get renderType() {
        return this.__renderType.get();
    }
    set renderType(newValue: string) {
        this.__renderType.set(newValue);
    }
    private __isTooltipShow: ObservedPropertySimplePU<boolean>;
    get isTooltipShow() {
        return this.__isTooltipShow.get();
    }
    set isTooltipShow(newValue: boolean) {
        this.__isTooltipShow.set(newValue);
    }
    private __isZoom: ObservedPropertySimplePU<boolean>;
    get isZoom() {
        return this.__isZoom.get();
    }
    set isZoom(newValue: boolean) {
        this.__isZoom.set(newValue);
    }
    private __isScale: ObservedPropertySimplePU<boolean>;
    get isScale() {
        return this.__isScale.get();
    }
    set isScale(newValue: boolean) {
        this.__isScale.set(newValue);
    }
    private __tooltipInfo: ObservedPropertyObjectPU<InterfaceObj>;
    get tooltipInfo() {
        return this.__tooltipInfo.get();
    }
    set tooltipInfo(newValue: InterfaceObj) {
        this.__tooltipInfo.set(newValue);
    }
    private panOption: PanGestureOptions;
    private __customTooltip; // 自定义组件
    private myWorker: null;
    private isWorker: boolean;
    onCountUpdated(options: Options): void {
        // this.isTooltipShow = false
        // if (!this.offContext) {
        //   const offCanvas: OffscreenCanvas = new OffscreenCanvas(this.context.width, this.context.height)
        //   this.offContext = offCanvas.getContext("2d", this.settings)
        // }
        this.isTooltipShow = false;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.setDirection();
        this.timer = setTimeout(() => {
            if (this.isWorker) {
                // this.myWorker && this.myWorker.postMessageWithSharedSendable({ update: true, myOptions: JSON.stringify(this.options) });
            }
            else {
                this.drawMcChart && this.drawMcChart.setOption(this.options);
            }
        }, 300);
    }
    aboutToAppear(): void {
        try {
            if (this.isWorker) {
                // this.myWorker = new worker.ThreadWorker('../workers/Worker.ets', {
                //   name: this.chartId
                // });
                // 收到eventId为"eventId"的事件后执行回调函数
                emitter.on('showInfo-' + this.chartId, (eventData: emitter.EventData) => {
                    const param = eventData.data as InterfaceObj;
                    this.showInfo(param.flag, JSON.parse(param.event), JSON.parse(param.tooltipInfo));
                });
            }
        }
        catch (e) {
            console.log('版本太低，无法使用多线程');
            this.myWorker = null;
            this.isWorker = false;
        }
    }
    aboutToDisappear(): void {
        // this.myWorker && this.myWorker.postMessageWithSharedSendable({disappear: true})
        // this.myWorker && this.myWorker.terminate()
    }
    setDirection() {
        if (this.options.dataZoom && this.options.dataZoom.show) {
            this.panOption.setDirection(this.chartType === 'hor' ? PanDirection.Vertical : PanDirection.Horizontal);
        }
    }
    showInfo(flag: boolean, event: InterfaceObj, tooltipInfo: InterfaceObj = {}) {
        // const {show, type = 'default'} = tooltipInfo || {}
        this.click && this.click(event, flag ? tooltipInfo : {});
        if (!tooltipInfo.show) {
            this.isTooltipShow = false;
            return;
        }
        this.isTooltipShow = flag;
        // if (tooltipInfo.type !== 'default') {
        //   this.tooltipClick && this.tooltipClick(event, flag ? tooltipInfo : {})
        // }
        // if (!tooltipInfo.show || tooltipInfo.type !== 'default') return;
        if (this.isTooltipShow) {
            this.tooltipInfo = tooltipInfo;
            const keys = Object.keys(tooltipInfo);
            keys.forEach(item => {
                this.tooltipInfo[item] = tooltipInfo[item];
            });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("oh_modules/.ohpm/@mcui+mccharts@2.8.9/oh_modules/@mcui/mccharts/src/main/ets/pageView/Charts.ets(236:5)", "@mcui/mccharts");
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.context);
            Canvas.debugLine("oh_modules/.ohpm/@mcui+mccharts@2.8.9/oh_modules/@mcui/mccharts/src/main/ets/pageView/Charts.ets(237:7)", "@mcui/mccharts");
            Canvas.width('100%');
            Canvas.height('100%');
            Canvas.onReady(() => {
                const offCanvas: OffscreenCanvas = new OffscreenCanvas(this.context.width, this.context.height);
                // this.offContext = offCanvas.getContext("2d", this.settings)
                // setOptions.Init(this.options)
                this.setDirection();
                if (this.isWorker && this.myWorker) {
                    // this.myWorker.postMessageWithSharedSendable({ myOffCanvas: offCanvas, myOptions: JSON.stringify(this.options), info: {
                    //   width: this.context.width,
                    //   height: this.context.height
                    // }, sendableTestClass: this.callbackSendableClass});
                    // this.myWorker.onmessage = (e): void => {
                    //   if (e.data.myImage) {
                    //     try {
                    //       let image: ImageBitmap = e.data.myImage
                    //       this.context.clearRect(0, 0, this.context.width, this.context.height)
                    //       this.context.transferFromImageBitmap(image)
                    //     } catch (e) {
                    //       console.log('渲染异常')
                    //     }
                    //   }
                    //   // if (e.data.terminate) {
                    //   //   this.myWorker && this.myWorker.terminate()
                    //   // }
                    // }
                }
                else {
                    this.drawMcChart = new Charts(this.context, undefined, undefined, this.callbackSendableClass, this.chartId);
                    setTimeout(() => {
                        this.drawMcChart && this.drawMcChart.setOption(ObservedObject.GetRawObject(this.options));
                    }, 10);
                }
            });
            Canvas.onClick((event: ClickEvent) => {
                if (this.drawMcChart) {
                    this.drawMcChart.ctxClick(event, (flag: boolean, event: ClickEvent, tooltipInfo: InterfaceObj = {}) => {
                        this.showInfo(flag, event, tooltipInfo);
                    });
                }
                else {
                    // this.myWorker && this.myWorker.postMessageWithSharedSendable({ ctxClick: true, event: {x: event.x, y: event.y}, chartId: this.chartId});
                }
            });
            Gesture.create(GesturePriority.Low);
            PanGesture.create(this.panOption);
            PanGesture.onActionStart((event: GestureEvent) => {
                // console.info('Pan start')
                this.isTooltipShow = false;
                this.startY = this.chartType === 'hor' ? event.offsetY : event.offsetX;
            });
            PanGesture.onActionUpdate((event: GestureEvent) => {
                if (event && !this.isScale) {
                    // this.drawMcChart &&
                    if (this.options.dataZoom && this.options.dataZoom.show) {
                        const currentY = this.chartType === 'hor' ? -event.offsetY : event.offsetX;
                        const deltaY = currentY - this.startY;
                        // 计算速度
                        this.velocity += deltaY * this.acceleration;
                        // 应用阻力
                        this.velocity *= this.friction;
                        if (this.isWorker && this.myWorker) {
                            // this.myWorker.postMessageWithSharedSendable({ bindZoom: true, velocity: this.velocity, chartTypeFlag: this.chartType === 'hor'});
                        }
                        else {
                            this.drawMcChart && this.drawMcChart.bindZoom(this.velocity, this.chartType === 'hor');
                        }
                    }
                }
            });
            PanGesture.onActionEnd(() => {
            });
            PanGesture.tag("mccharts.pan");
            PanGesture.pop();
            Gesture.pop();
            Gesture.create(GesturePriority.Low);
            PinchGesture.create({ fingers: 2, distance: 1 });
            PinchGesture.onActionStart((event: GestureEvent) => {
                this.isScale = true;
                this.isTooltipShow = false;
            });
            PinchGesture.onActionUpdate((event: GestureEvent) => {
                if (event) {
                    if (this.options.dataZoom && this.options.dataZoom.show) {
                        if (this.drawMcChart) {
                            this.drawMcChart.bindZoomScale(event.scale);
                        }
                        else {
                            // this.myWorker && this.myWorker.postMessageWithSharedSendable({ bindZoomScale: true, scale: event.scale});
                        }
                    }
                }
            });
            PinchGesture.onActionEnd((event: GestureEvent) => {
                this.isScale = false;
            });
            PinchGesture.tag("mccharts.pan");
            PinchGesture.pop();
            Gesture.pop();
        }, Canvas);
        Canvas.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isTooltipShow) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Tooltip(this, {
                                    tooltipInfo: this.__tooltipInfo,
                                    customTooltip: this.customTooltip,
                                    ctxWidth: this.context.width,
                                    ctxHeight: this.context.height
                                }, undefined, elmtId, () => { }, { page: "oh_modules/.ohpm/@mcui+mccharts@2.8.9/oh_modules/@mcui/mccharts/src/main/ets/pageView/Charts.ets", line: 332, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        tooltipInfo: this.tooltipInfo,
                                        customTooltip: this.customTooltip,
                                        ctxWidth: this.context.width,
                                        ctxHeight: this.context.height
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    ctxWidth: this.context.width,
                                    ctxHeight: this.context.height
                                });
                            }
                        }, { name: "Tooltip" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
