if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Tooltip_Params {
    tooltipInfo?: InterfaceObj;
    x?: number;
    y?: number;
    ctxWidth?: number;
    ctxHeight?: number;
    customTooltip?: (tooltipInfo: InterfaceObj) => void;
}
import type { InterfaceObj } from '../utils/chartInterface';
function globalBuilder($$: InterfaceObj, parent = null) {
    const __$$__ = $$;
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
        Column.create();
        Column.debugLine("oh_modules/.ohpm/@mcui+mccharts@2.8.9/oh_modules/@mcui/mccharts/src/main/ets/pageView/Tooltip.ets(4:3)", "@mcui/mccharts");
        Column.alignItems(HorizontalAlign.Start);
        Column.padding($$.tooltipInfo.padding);
        Column.backgroundColor($$.tooltipInfo.backgroundColor);
        Column.borderColor($$.tooltipInfo.borderColor);
        Column.borderWidth($$.tooltipInfo.borderWidth);
        Column.borderRadius(10);
    }, Column);
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
        If.create();
        if ($$.tooltipInfo.title) {
            (parent ? parent : this).ifElseBranchUpdateFunction(0, () => {
                (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
                    Text.create($$.tooltipInfo.title);
                    Text.debugLine("oh_modules/.ohpm/@mcui+mccharts@2.8.9/oh_modules/@mcui/mccharts/src/main/ets/pageView/Tooltip.ets(6:7)", "@mcui/mccharts");
                    __Text__fancy($$.tooltipInfo);
                    Text.margin({
                        bottom: 8
                    });
                }, Text);
                Text.pop();
            });
        }
        else {
            this.ifElseBranchUpdateFunction(1, () => {
            });
        }
    }, If);
    If.pop();
    (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
        ForEach.create();
        const forEachItemGenFunction = (_item, index) => {
            const item = _item;
            (parent ? parent : this).observeComponentCreation2((elmtId, isInitialRender, $$ = __$$__) => {
                Text.create((item.name ? item.name + '：' : '') + item.num);
                Text.debugLine("oh_modules/.ohpm/@mcui+mccharts@2.8.9/oh_modules/@mcui/mccharts/src/main/ets/pageView/Tooltip.ets(13:7)", "@mcui/mccharts");
                __Text__fancy($$.tooltipInfo);
            }, Text);
            Text.pop();
        };
        (parent ? parent : this).forEachUpdateFunction(elmtId, $$.tooltipInfo.data, forEachItemGenFunction, undefined, true, false);
    }, ForEach);
    ForEach.pop();
    Column.pop();
}
function __Text__fancy(tooltipInfo: InterfaceObj): void {
    Text.fontSize(tooltipInfo.textStyle.fontSize || 14);
    Text.fontColor(tooltipInfo.textStyle.color || '#fff');
    Text.fontWeight(tooltipInfo.textStyle.fontWeight || 'normal');
    Text.fontFamily(tooltipInfo.textStyle.fontFamily || 'sans-serif');
}
export { globalBuilder };
export class Tooltip extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__tooltipInfo = new SynchedPropertyObjectTwoWayPU(params.tooltipInfo, this, "tooltipInfo");
        this.__x = new ObservedPropertySimplePU(-1000, this, "x");
        this.__y = new ObservedPropertySimplePU(-1000, this, "y");
        this.__ctxWidth = new SynchedPropertySimpleOneWayPU(params.ctxWidth, this, "ctxWidth");
        this.__ctxHeight = new SynchedPropertySimpleOneWayPU(params.ctxHeight, this, "ctxHeight");
        this.customTooltip = globalBuilder;
        this.setInitiallyProvidedValue(params);
        this.declareWatch("tooltipInfo", this.onTooltipInfoUpdated);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Tooltip_Params) {
        if (params.x !== undefined) {
            this.x = params.x;
        }
        if (params.y !== undefined) {
            this.y = params.y;
        }
        if (params.ctxWidth === undefined) {
            this.__ctxWidth.set(0);
        }
        if (params.ctxHeight === undefined) {
            this.__ctxHeight.set(0);
        }
        if (params.customTooltip !== undefined) {
            this.customTooltip = params.customTooltip;
        }
    }
    updateStateVars(params: Tooltip_Params) {
        this.__ctxWidth.reset(params.ctxWidth);
        this.__ctxHeight.reset(params.ctxHeight);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tooltipInfo.purgeDependencyOnElmtId(rmElmtId);
        this.__x.purgeDependencyOnElmtId(rmElmtId);
        this.__y.purgeDependencyOnElmtId(rmElmtId);
        this.__ctxWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__ctxHeight.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tooltipInfo.aboutToBeDeleted();
        this.__x.aboutToBeDeleted();
        this.__y.aboutToBeDeleted();
        this.__ctxWidth.aboutToBeDeleted();
        this.__ctxHeight.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __tooltipInfo: SynchedPropertySimpleOneWayPU<InterfaceObj>;
    get tooltipInfo() {
        return this.__tooltipInfo.get();
    }
    set tooltipInfo(newValue: InterfaceObj) {
        this.__tooltipInfo.set(newValue);
    }
    private __x: ObservedPropertySimplePU<number>;
    get x() {
        return this.__x.get();
    }
    set x(newValue: number) {
        this.__x.set(newValue);
    }
    private __y: ObservedPropertySimplePU<number>;
    get y() {
        return this.__y.get();
    }
    set y(newValue: number) {
        this.__y.set(newValue);
    }
    private __ctxWidth: SynchedPropertySimpleOneWayPU<number>;
    get ctxWidth() {
        return this.__ctxWidth.get();
    }
    set ctxWidth(newValue: number) {
        this.__ctxWidth.set(newValue);
    }
    private __ctxHeight: SynchedPropertySimpleOneWayPU<number>;
    get ctxHeight() {
        return this.__ctxHeight.get();
    }
    set ctxHeight(newValue: number) {
        this.__ctxHeight.set(newValue);
    }
    // 自定义提示组件
    private __customTooltip;
    onTooltipInfoUpdated(): void {
        const pos: InterfaceObj = this.tooltipInfo;
        const x: number = pos.x;
        if (x + 40 !== this.x) {
            this.x = -10000;
            this.y = -10000;
        }
    }
    getPos(rect: InterfaceObj) {
        const pos: InterfaceObj = this.tooltipInfo;
        const W: number = this.ctxWidth;
        const H: number = this.ctxHeight;
        const width: number = rect.width;
        const height: number = rect.height;
        const x: number = pos.x;
        const y: number = pos.y;
        if (x + 40 + width > W - 10) {
            this.x = Math.max(W - width - 10, 10);
        }
        else {
            this.x = x + 10;
        }
        if (y !== undefined) {
            if (y + 40 + height > H - 10) {
                this.y = y - height + 10;
            }
            else {
                this.y = (pos.y > H / 2 ? y + 20 : y);
            }
        }
        else {
            this.y = H / 2 - height / 2;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("oh_modules/.ohpm/@mcui+mccharts@2.8.9/oh_modules/@mcui/mccharts/src/main/ets/pageView/Tooltip.ets(78:5)", "@mcui/mccharts");
            Column.alignItems(HorizontalAlign.Start);
            Column.position({
                x: this.x,
                y: this.y
            });
            Column.onAreaChange((oldValue: Area, newValue: Area) => {
                this.getPos(newValue);
            });
        }, Column);
        this.customTooltip.bind(this)(makeBuilderParameterProxy("customTooltip", { tooltipInfo: () => (this["__tooltipInfo"] ? this["__tooltipInfo"] : this["tooltipInfo"]) }));
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
