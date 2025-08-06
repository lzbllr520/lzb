if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ValueCard_Params {
    icon?: Resource;
    title?: string;
    value?: string;
    unit?: string;
}
export class ValueCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.icon = undefined;
        this.title = '标题';
        this.value = '0.0';
        this.unit = '单位';
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ValueCard_Params) {
        if (params.icon !== undefined) {
            this.icon = params.icon;
        }
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.value !== undefined) {
            this.value = params.value;
        }
        if (params.unit !== undefined) {
            this.unit = params.unit;
        }
    }
    updateStateVars(params: ValueCard_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private icon?: Resource;
    private title: string;
    private value: string;
    private unit: string;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.height(150);
            Column.padding(10);
            Column.backdropBlur(12);
            Column.backgroundColor('rgba(10, 10, 15, 0.3)');
            Column.borderRadius(16);
            Column.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            Column.shadow({
                radius: 30,
                color: 'rgba(173, 216, 230, 0.2)',
                offsetX: 0,
                offsetY: 0
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.icon);
            Image.width(20);
            Image.height(20);
            Image.fillColor('rgba(255, 255, 255, 0.9)');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('rgba(255, 255, 255, 0.8)');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.value);
            Text.fontSize(25);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.unit);
            Text.fontSize(15);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor('rgba(255, 255, 255, 0.85)');
            Text.margin({ left: 8 });
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
