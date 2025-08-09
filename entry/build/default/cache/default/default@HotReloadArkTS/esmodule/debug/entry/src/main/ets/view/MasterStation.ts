if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MasterStation_Params {
    isLineRunning?: boolean;
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
}
import promptAction from "@ohos:promptAction";
export class MasterStation extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isLineRunning = new SynchedPropertySimpleTwoWayPU(params.isLineRunning, this, "isLineRunning");
        this.addLog = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MasterStation_Params) {
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
    }
    updateStateVars(params: MasterStation_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isLineRunning.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isLineRunning.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isLineRunning: SynchedPropertySimpleTwoWayPU<boolean>;
    get isLineRunning() {
        return this.__isLineRunning.get();
    }
    set isLineRunning(newValue: boolean) {
        this.__isLineRunning.set(newValue);
    }
    private addLog: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    //停止产线函数
    private stopLine() {
        AlertDialog.show({
            title: '操作确认',
            message: '是否停止产线运作',
            autoCancel: true,
            alignment: DialogAlignment.Center,
            buttons: [
                {
                    value: '取消',
                    action: () => {
                        //用户点击取消，不做任何操作
                    }
                },
                {
                    value: '确认',
                    fontColor: Color.Red,
                    action: () => {
                        promptAction.showToast({ message: '关闭成功', bottom: '50%' });
                        this.isLineRunning = false;
                        this.addLog('warning', '停止产线运行', true);
                    }
                }
            ]
        });
    }
    //启动产线函数
    private startLine() {
        AlertDialog.show({
            title: '操作确认',
            message: '是否开启产线运作',
            autoCancel: true,
            alignment: DialogAlignment.Center,
            buttons: [
                {
                    value: '取消',
                    action: () => {
                        //用户点击取消，不做任何操作
                    }
                },
                {
                    value: '确认',
                    fontColor: Color.Red,
                    action: () => {
                        promptAction.showToast({ message: '启动成功!', bottom: '50%' });
                        this.isLineRunning = true;
                        this.addLog('info', '启动产线运行', true);
                    }
                }
            ]
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.margin({ top: 20 });
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceEvenly);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('启动产线运作');
            Button.onClick(() => this.startLine());
            Button.backgroundColor(this.isLineRunning ? Color.Gray : '#28a745');
            Button.enabled(!this.isLineRunning);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('停止产线运作');
            Button.onClick(() => this.stopLine());
            Button.backgroundColor(this.isLineRunning ? '#dc3545' : Color.Gray);
            Button.enabled(this.isLineRunning);
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
