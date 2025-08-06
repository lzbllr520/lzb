if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MasterStation_Params {
    currentIndex?: number;
    servers?: Server[];
    controller?: TabsController;
    isLineRunning?: boolean;
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    conveyorData1?: ConveyorState;
    conveyorData2?: ConveyorState;
    dollyData?: DollyState;
    robot1Data?: RobotArmState;
    robot2Data?: RobotArmState;
    robot3Data?: RobotArmState;
}
import { ServerInfoView } from "@normalized:N&&&entry/src/main/ets/components/ServerInfoView&";
import type { Server } from '../model/ServerState';
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
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.__servers = new SynchedPropertyObjectOneWayPU(params.servers, this, "servers");
        this.controller = new TabsController();
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
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
        if (params.servers === undefined) {
            this.__servers.set([]);
        }
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
    }
    updateStateVars(params: MasterStation_Params) {
        this.__servers.reset(params.servers);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__servers.purgeDependencyOnElmtId(rmElmtId);
        this.__isLineRunning.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData1.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData2.purgeDependencyOnElmtId(rmElmtId);
        this.__dollyData.purgeDependencyOnElmtId(rmElmtId);
        this.__robot1Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot2Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot3Data.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__servers.aboutToBeDeleted();
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
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __servers: SynchedPropertySimpleOneWayPU<Server[]>;
    get servers() {
        return this.__servers.get();
    }
    set servers(newValue: Server[]) {
        this.__servers.set(newValue);
    }
    private controller: TabsController;
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isLineRunning) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (!this.servers || this.servers.length === 0) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Column.create();
                                    Column.width('100%');
                                    Column.height('100%');
                                    Column.justifyContent(FlexAlign.Center);
                                }, Column);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('暂无服务器');
                                    Text.fontColor(Color.White);
                                    Text.fontWeight(FontWeight.Bolder);
                                    Text.fontSize(30);
                                    Text.opacity(0.8);
                                }, Text);
                                Text.pop();
                                Column.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Row.create();
                                    Row.width('100%');
                                    Row.layoutWeight(1);
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Tabs.create({
                                        controller: this.controller,
                                        barPosition: BarPosition.Start,
                                        index: this.currentIndex
                                    });
                                    Tabs.margin({ left: 10 });
                                    Tabs.vertical(true);
                                    Tabs.barMode(BarMode.Fixed);
                                    Tabs.barWidth(60);
                                    Tabs.animationDuration(300);
                                    Tabs.onChange((index: number) => {
                                        this.currentIndex = index;
                                    });
                                    Tabs.layoutWeight(1);
                                }, Tabs);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, index: number) => {
                                        const server = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            TabContent.create(() => {
                                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                    Column.create();
                                                    Column.width('100%');
                                                    Column.height('100%');
                                                }, Column);
                                                {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        if (isInitialRender) {
                                                            let componentCall = new ServerInfoView(this, { server: server }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/MasterStation.ets", line: 121, col: 23 });
                                                            ViewPU.create(componentCall);
                                                            let paramsLambda = () => {
                                                                return {
                                                                    server: server
                                                                };
                                                            };
                                                            componentCall.paramsGenerator_ = paramsLambda;
                                                        }
                                                        else {
                                                            this.updateStateVarsOfChildByElmtId(elmtId, {
                                                                server: server
                                                            });
                                                        }
                                                    }, { name: "ServerInfoView" });
                                                }
                                                Column.pop();
                                            });
                                            TabContent.tabBar({ builder: () => {
                                                    this.buildTabBar.call(this, { "id": 16777280, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, index);
                                                } });
                                        }, TabContent);
                                        TabContent.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.servers, forEachItemGenFunction, (server: Server) => server.id, true, false);
                                }, ForEach);
                                ForEach.pop();
                                Tabs.pop();
                                Row.pop();
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('未启动产线，无法获取数据信息');
                        Text.fontColor(Color.White);
                        Text.fontWeight(FontWeight.Bolder);
                        Text.fontSize(30);
                        Text.opacity(0.8);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    private buildTabBar(icon: Resource, index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation({ duration: 200, curve: Curve.EaseInOut });
            Column.width('90%');
            Column.aspectRatio(1);
            Column.justifyContent(FlexAlign.Center);
            Column.backgroundColor(this.currentIndex === index ? 'rgba(255, 255, 255, 0.25)' : Color.Transparent);
            Column.scale(this.currentIndex === index ? { x: 1.1, y: 1.1 } : { x: 1.0, y: 1.0 });
            Column.borderRadius(12);
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(icon);
            Image.width(18);
            Image.height(18);
            Image.fillColor(Color.White);
            Image.objectFit(ImageFit.Contain);
        }, Image);
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
