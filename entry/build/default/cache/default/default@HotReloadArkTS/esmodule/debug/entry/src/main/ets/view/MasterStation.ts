if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MasterStation_Params {
    isLineRunning?: boolean;
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    conveyorData1?: ConveyorState;
    conveyorData2?: ConveyorState;
    dollyData?: DollyState;
    robot1Data?: RobotArmState;
    robot2Data?: RobotArmState;
    robot3Data?: RobotArmState;
}
import type { ConveyorState } from '../model/ConveyorState';
import type { DollyState } from '../model/DollyState';
import type { RobotArmState } from '../model/RobotArmState';
import promptAction from "@ohos:promptAction";
export class MasterStation extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isLineRunning = new SynchedPropertySimpleTwoWayPU(params.isLineRunning, this, "isLineRunning");
        this.addLog = () => { };
        this.__conveyorData1 = new SynchedPropertyObjectTwoWayPU(params.conveyorData1, this, "conveyorData1");
        this.__conveyorData2 = new SynchedPropertyObjectTwoWayPU(params.conveyorData2, this, "conveyorData2");
        this.__dollyData = new SynchedPropertyObjectTwoWayPU(params.dollyData, this, "dollyData");
        this.__robot1Data = new SynchedPropertyObjectTwoWayPU(params.robot1Data, this, "robot1Data");
        this.__robot2Data = new SynchedPropertyObjectTwoWayPU(params.robot2Data, this, "robot2Data");
        this.__robot3Data = new SynchedPropertyObjectTwoWayPU(params.robot3Data, this, "robot3Data");
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
        this.__conveyorData1.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData2.purgeDependencyOnElmtId(rmElmtId);
        this.__dollyData.purgeDependencyOnElmtId(rmElmtId);
        this.__robot1Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot2Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot3Data.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isLineRunning.aboutToBeDeleted();
        this.__conveyorData1.aboutToBeDeleted();
        this.__conveyorData2.aboutToBeDeleted();
        this.__dollyData.aboutToBeDeleted();
        this.__robot1Data.aboutToBeDeleted();
        this.__robot2Data.aboutToBeDeleted();
        this.__robot3Data.aboutToBeDeleted();
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
    private __conveyorData1: SynchedPropertySimpleOneWayPU<ConveyorState>;
    get conveyorData1() {
        return this.__conveyorData1.get();
    }
    set conveyorData1(newValue: ConveyorState) {
        this.__conveyorData1.set(newValue);
    }
    private __conveyorData2: SynchedPropertySimpleOneWayPU<ConveyorState>;
    get conveyorData2() {
        return this.__conveyorData2.get();
    }
    set conveyorData2(newValue: ConveyorState) {
        this.__conveyorData2.set(newValue);
    }
    private __dollyData: SynchedPropertySimpleOneWayPU<DollyState>;
    get dollyData() {
        return this.__dollyData.get();
    }
    set dollyData(newValue: DollyState) {
        this.__dollyData.set(newValue);
    }
    private __robot1Data: SynchedPropertySimpleOneWayPU<RobotArmState>;
    get robot1Data() {
        return this.__robot1Data.get();
    }
    set robot1Data(newValue: RobotArmState) {
        this.__robot1Data.set(newValue);
    }
    private __robot2Data: SynchedPropertySimpleOneWayPU<RobotArmState>;
    get robot2Data() {
        return this.__robot2Data.get();
    }
    set robot2Data(newValue: RobotArmState) {
        this.__robot2Data.set(newValue);
    }
    private __robot3Data: SynchedPropertySimpleOneWayPU<RobotArmState>;
    get robot3Data() {
        return this.__robot3Data.get();
    }
    set robot3Data(newValue: RobotArmState) {
        this.__robot3Data.set(newValue);
    }
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
