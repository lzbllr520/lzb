if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NetError_Params {
    bgOpacity?: number;
}
import type common from "@ohos:app.ability.common";
import promptAction from "@ohos:promptAction";
class NetError extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__bgOpacity = new ObservedPropertySimplePU(0, this, "bgOpacity");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NetError_Params) {
        if (params.bgOpacity !== undefined) {
            this.bgOpacity = params.bgOpacity;
        }
    }
    updateStateVars(params: NetError_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__bgOpacity.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__bgOpacity.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __bgOpacity: ObservedPropertySimplePU<number>;
    get bgOpacity() {
        return this.__bgOpacity.get();
    }
    set bgOpacity(newValue: number) {
        this.__bgOpacity.set(newValue);
    }
    //退出应用确认和执行函数
    private showExitDialog() {
        // 获取UIAbility的上下文，用于调用terminateSelf方法
        const context = getContext(this) as common.UIAbilityContext;
        //操作确认弹出框
        AlertDialog.show({
            title: '操作确认',
            message: '是否退出应用',
            autoCancel: true,
            alignment: DialogAlignment.Center,
            buttons: [
                {
                    value: '取消',
                    action: () => {
                        // 用户点击取消，不做任何事
                    }
                },
                {
                    value: '确认',
                    fontColor: Color.Red,
                    action: () => {
                        context.terminateSelf();
                    }
                }
            ]
        });
    }
    async aboutToAppear() {
        try {
            //控制背景缓慢显示动画
            Context.animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
                this.bgOpacity = 1;
            });
        }
        catch (exception) {
            promptAction.showToast({ message: '页面初始化函数执行失败', bottom: '50%', duration: 1000 });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.debugLine("entry/src/main/ets/pages/NetError.ets(50:5)", "entry");
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor('#0E1307');
            Gesture.create(GesturePriority.Low);
            LongPressGesture.create();
            LongPressGesture.onAction(() => {
                // 触发长按后，调用显示弹窗的函数，确认退出应用
                this.showExitDialog();
            });
            LongPressGesture.pop();
            Gesture.pop();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/NetError.ets(51:7)", "entry");
            Image.width('100%');
            Image.height('100%');
            Image.objectFit(ImageFit.Cover);
            Image.opacity(this.bgOpacity);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.debugLine("entry/src/main/ets/pages/NetError.ets(56:7)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 20 });
            Row.debugLine("entry/src/main/ets/pages/NetError.ets(57:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777234, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/NetError.ets(58:11)", "entry");
            Image.width(100);
            Image.height(100);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('与服务器连接失败！');
            Text.debugLine("entry/src/main/ets/pages/NetError.ets(61:11)", "entry");
            Text.fontSize(30);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/NetError.ets(66:9)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('可进行的操作：点击任意位置刷新 或 长按退出应用');
            Text.debugLine("entry/src/main/ets/pages/NetError.ets(67:11)", "entry");
            Text.fontSize(15);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        Row.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "NetError";
    }
}
registerNamedRoute(() => new NetError(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/NetError", pageFullPath: "entry/src/main/ets/pages/NetError", integratedHsp: "false", moduleType: "followWithHap" });
