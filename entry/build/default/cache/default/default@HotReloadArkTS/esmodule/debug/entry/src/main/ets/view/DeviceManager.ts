if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DeviceManager_Params {
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    currentIndex?: number;
    conveyorData1?: ConveyorState;
    conveyorData2?: ConveyorState;
    dollyData?: DollyState;
    robot1Data?: RobotArmState;
    robot2Data?: RobotArmState;
    robot3Data?: RobotArmState;
    conveyorAvatar?: Resource;
    dollyAvatar?: Resource;
    robotArmAvatar?: Resource;
    tabArray?: string[];
    normalFontSize?: number;
    selectedFontSize?: number;
    normalColor?: string;
    selectedColor?: string;
    pressedTabIndex?: number;
    onIndexChange?: (index: number) => void;
    servers?: Server[] | null;
    data1?: Data;
    data2?: Data;
    data3?: Data;
    data4?: Data;
    data5?: Data;
}
import type { ConveyorState } from '../model/ConveyorState';
import type { DollyState } from '../model/DollyState';
import type { RobotArmState } from '../model/RobotArmState';
import { Conveyor1 } from "@normalized:N&&&entry/src/main/ets/view/device/Conveyor1&";
import { Conveyor2 } from "@normalized:N&&&entry/src/main/ets/view/device/Conveyor2&";
import { Dolly } from "@normalized:N&&&entry/src/main/ets/view/device/Dolly&";
import { RobotArm1 } from "@normalized:N&&&entry/src/main/ets/view/device/RobotArm1&";
import { RobotArm2 } from "@normalized:N&&&entry/src/main/ets/view/device/RobotArm2&";
import { RobotArm3 } from "@normalized:N&&&entry/src/main/ets/view/device/RobotArm3&";
import type { Server, Node, Data } from '../model/ServerState';
import { getNodeOther, getNodeStart } from "@normalized:N&&&entry/src/main/ets/service/Request&";
export class DeviceManager extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.addLog = () => { };
        this.__currentIndex = new SynchedPropertySimpleTwoWayPU(params.currentIndex, this, "currentIndex");
        this.__conveyorData1 = new SynchedPropertyObjectTwoWayPU(params.conveyorData1, this, "conveyorData1");
        this.__conveyorData2 = new SynchedPropertyObjectTwoWayPU(params.conveyorData2, this, "conveyorData2");
        this.__dollyData = new SynchedPropertyObjectTwoWayPU(params.dollyData, this, "dollyData");
        this.__robot1Data = new SynchedPropertyObjectTwoWayPU(params.robot1Data, this, "robot1Data");
        this.__robot2Data = new SynchedPropertyObjectTwoWayPU(params.robot2Data, this, "robot2Data");
        this.__robot3Data = new SynchedPropertyObjectTwoWayPU(params.robot3Data, this, "robot3Data");
        this.__conveyorAvatar = new SynchedPropertyObjectTwoWayPU(params.conveyorAvatar, this, "conveyorAvatar");
        this.__dollyAvatar = new SynchedPropertyObjectTwoWayPU(params.dollyAvatar, this, "dollyAvatar");
        this.__robotArmAvatar = new SynchedPropertyObjectTwoWayPU(params.robotArmAvatar, this, "robotArmAvatar");
        this.tabArray = ['小车', '传送带1', '传送带2', '机械臂1', '机械臂2', '机械臂3'];
        this.normalFontSize = 15;
        this.selectedFontSize = 22;
        this.normalColor = '#E6FFFFFF';
        this.selectedColor = '#FFFFFF';
        this.__pressedTabIndex = new ObservedPropertySimplePU(-1, this, "pressedTabIndex");
        this.onIndexChange = () => { };
        this.__servers = new SynchedPropertyObjectOneWayPU(params.servers, this, "servers");
        this.__data1 = new ObservedPropertyObjectPU({ id: '', node_id: '' }
        //传送带2
        , this, "data1");
        this.__data2 = new ObservedPropertyObjectPU({ id: '', node_id: '' }
        //机械臂1
        , this, "data2");
        this.__data3 = new ObservedPropertyObjectPU({ id: '', node_id: '' }
        //机械臂2
        , this, "data3");
        this.__data4 = new ObservedPropertyObjectPU({ id: '', node_id: '' }
        //机械臂3
        , this, "data4");
        this.__data5 = new ObservedPropertyObjectPU({ id: '', node_id: '' }, this, "data5");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("servers", this.onServersChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DeviceManager_Params) {
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
        if (params.tabArray !== undefined) {
            this.tabArray = params.tabArray;
        }
        if (params.normalFontSize !== undefined) {
            this.normalFontSize = params.normalFontSize;
        }
        if (params.selectedFontSize !== undefined) {
            this.selectedFontSize = params.selectedFontSize;
        }
        if (params.normalColor !== undefined) {
            this.normalColor = params.normalColor;
        }
        if (params.selectedColor !== undefined) {
            this.selectedColor = params.selectedColor;
        }
        if (params.pressedTabIndex !== undefined) {
            this.pressedTabIndex = params.pressedTabIndex;
        }
        if (params.onIndexChange !== undefined) {
            this.onIndexChange = params.onIndexChange;
        }
        if (params.servers === undefined) {
            this.__servers.set([]
            //传送带1
            );
        }
        if (params.data1 !== undefined) {
            this.data1 = params.data1;
        }
        if (params.data2 !== undefined) {
            this.data2 = params.data2;
        }
        if (params.data3 !== undefined) {
            this.data3 = params.data3;
        }
        if (params.data4 !== undefined) {
            this.data4 = params.data4;
        }
        if (params.data5 !== undefined) {
            this.data5 = params.data5;
        }
    }
    updateStateVars(params: DeviceManager_Params) {
        this.__servers.reset(params.servers);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData1.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData2.purgeDependencyOnElmtId(rmElmtId);
        this.__dollyData.purgeDependencyOnElmtId(rmElmtId);
        this.__robot1Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot2Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot3Data.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__dollyAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__robotArmAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__pressedTabIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__servers.purgeDependencyOnElmtId(rmElmtId);
        this.__data1.purgeDependencyOnElmtId(rmElmtId);
        this.__data2.purgeDependencyOnElmtId(rmElmtId);
        this.__data3.purgeDependencyOnElmtId(rmElmtId);
        this.__data4.purgeDependencyOnElmtId(rmElmtId);
        this.__data5.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__conveyorData1.aboutToBeDeleted();
        this.__conveyorData2.aboutToBeDeleted();
        this.__dollyData.aboutToBeDeleted();
        this.__robot1Data.aboutToBeDeleted();
        this.__robot2Data.aboutToBeDeleted();
        this.__robot3Data.aboutToBeDeleted();
        this.__conveyorAvatar.aboutToBeDeleted();
        this.__dollyAvatar.aboutToBeDeleted();
        this.__robotArmAvatar.aboutToBeDeleted();
        this.__pressedTabIndex.aboutToBeDeleted();
        this.__servers.aboutToBeDeleted();
        this.__data1.aboutToBeDeleted();
        this.__data2.aboutToBeDeleted();
        this.__data3.aboutToBeDeleted();
        this.__data4.aboutToBeDeleted();
        this.__data5.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private addLog: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    private __currentIndex: SynchedPropertySimpleTwoWayPU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
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
    private __conveyorAvatar: SynchedPropertySimpleOneWayPU<Resource>;
    get conveyorAvatar() {
        return this.__conveyorAvatar.get();
    }
    set conveyorAvatar(newValue: Resource) {
        this.__conveyorAvatar.set(newValue);
    }
    private __dollyAvatar: SynchedPropertySimpleOneWayPU<Resource>;
    get dollyAvatar() {
        return this.__dollyAvatar.get();
    }
    set dollyAvatar(newValue: Resource) {
        this.__dollyAvatar.set(newValue);
    }
    private __robotArmAvatar: SynchedPropertySimpleOneWayPU<Resource>;
    get robotArmAvatar() {
        return this.__robotArmAvatar.get();
    }
    set robotArmAvatar(newValue: Resource) {
        this.__robotArmAvatar.set(newValue);
    }
    private tabArray: string[];
    private normalFontSize: number;
    private selectedFontSize: number;
    private normalColor: string;
    private selectedColor: string;
    private __pressedTabIndex: ObservedPropertySimplePU<number>;
    get pressedTabIndex() {
        return this.__pressedTabIndex.get();
    }
    set pressedTabIndex(newValue: number) {
        this.__pressedTabIndex.set(newValue);
    }
    private onIndexChange: (index: number) => void;
    private __servers: SynchedPropertySimpleOneWayPU<Server[] | null>;
    get servers() {
        return this.__servers.get();
    }
    set servers(newValue: Server[] | null) {
        this.__servers.set(newValue);
    }
    //传送带1
    private __data1: ObservedPropertyObjectPU<Data>;
    get data1() {
        return this.__data1.get();
    }
    set data1(newValue: Data) {
        this.__data1.set(newValue);
    }
    //传送带2
    private __data2: ObservedPropertyObjectPU<Data>;
    get data2() {
        return this.__data2.get();
    }
    set data2(newValue: Data) {
        this.__data2.set(newValue);
    }
    //机械臂1
    private __data3: ObservedPropertyObjectPU<Data>;
    get data3() {
        return this.__data3.get();
    }
    set data3(newValue: Data) {
        this.__data3.set(newValue);
    }
    //机械臂2
    private __data4: ObservedPropertyObjectPU<Data>;
    get data4() {
        return this.__data4.get();
    }
    set data4(newValue: Data) {
        this.__data4.set(newValue);
    }
    //机械臂3
    private __data5: ObservedPropertyObjectPU<Data>;
    get data5() {
        return this.__data5.get();
    }
    set data5(newValue: Data) {
        this.__data5.set(newValue);
    }
    async onServersChange(): Promise<void> {
        if (this.servers && this.servers.length > 0) {
            this.servers.forEach(async (item: Server) => {
                if (item.id === 'server2') {
                    const nodes1: Node[] | null = await getNodeStart(item.id);
                    if (nodes1 && nodes1.length > 0) {
                        const nodes2: Node[] | null = await getNodeOther(item.id, nodes1[3].node_id);
                        if (nodes2 && nodes2.length > 0) {
                            this.data1 = {
                                id: item.id,
                                node_id: nodes2[3].node_id
                            };
                        }
                    }
                }
                else if (item.id === 'server5') {
                    const nodes1: Node[] | null = await getNodeStart(item.id);
                    if (nodes1 && nodes1.length > 0) {
                        const nodes2: Node[] | null = await getNodeOther(item.id, nodes1[3].node_id);
                        if (nodes2 && nodes2.length > 0) {
                            this.data2 = {
                                id: item.id,
                                node_id: nodes2[3].node_id
                            };
                        }
                    }
                }
                else if (item.id === 'server1') {
                    const nodes1: Node[] | null = await getNodeStart(item.id);
                    if (nodes1 && nodes1.length > 0) {
                        const nodes2: Node[] | null = await getNodeOther(item.id, nodes1[3].node_id);
                        if (nodes2 && nodes2.length > 0) {
                            this.data3 = {
                                id: item.id,
                                node_id: nodes2[2].node_id
                            };
                        }
                    }
                }
                else if (item.id === 'server3') {
                    const nodes1: Node[] | null = await getNodeStart(item.id);
                    if (nodes1 && nodes1.length > 0) {
                        const nodes2: Node[] | null = await getNodeOther(item.id, nodes1[3].node_id);
                        if (nodes2 && nodes2.length > 0) {
                            this.data4 = {
                                id: item.id,
                                node_id: nodes2[2].node_id
                            };
                        }
                    }
                }
                else if (item.id === 'server4') {
                    const nodes1: Node[] | null = await getNodeStart(item.id);
                    if (nodes1 && nodes1.length > 0) {
                        const nodes2: Node[] | null = await getNodeOther(item.id, nodes1[3].node_id);
                        if (nodes2 && nodes2.length > 0) {
                            this.data5 = {
                                id: item.id,
                                node_id: nodes2[2].node_id
                            };
                        }
                    }
                }
            });
        }
    }
    aboutToAppear(): void {
        this.onServersChange();
    }
    handleTabChange(targetIndex: number) {
        let canSwitch = true;
        let alertMessage = '';
        switch (targetIndex) {
            case 1:
                if (!this.data1.id || !this.data1.node_id) {
                    canSwitch = false;
                    alertMessage = '没有一号传送带对应的服务可使用';
                }
                break;
            case 2:
                if (!this.data2.id || !this.data2.node_id) {
                    canSwitch = false;
                    alertMessage = '没有二号传送带对应的服务可使用';
                }
                break;
            case 3:
                if (!this.data3.id || !this.data3.node_id) {
                    canSwitch = false;
                    alertMessage = '没有一号机械臂对应的服务可使用';
                }
                break;
            case 4:
                if (!this.data4.id || !this.data4.node_id) {
                    canSwitch = false;
                    alertMessage = '没有二号机械臂对应的服务可使用';
                }
                break;
            case 5:
                if (!this.data5.id || !this.data5.node_id) {
                    canSwitch = false;
                    alertMessage = '没有三号机械臂对应的服务可使用';
                }
                break;
        }
        if (canSwitch) {
            this.currentIndex = targetIndex;
            this.onIndexChange(targetIndex);
        }
        else {
            AlertDialog.show({
                title: '操作提示',
                message: alertMessage,
                alignment: DialogAlignment.Center,
                autoCancel: true,
                buttons: [
                    {
                        value: '确定',
                        action: () => { }
                    }
                ]
            });
        }
    }
    // @Builder deviceContent 已被移除
    tabBuilder(title: string, targetIndex: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation({ duration: 100, curve: Curve.EaseOut });
            Column.justifyContent(FlexAlign.Center);
            Column.width('auto');
            Column.height('100%');
            Column.padding({ left: 16, right: 16 });
            Column.margin({ left: 15, right: 15 });
            Column.scale({ x: this.pressedTabIndex === targetIndex ? 0.95 : 1.0, y: this.pressedTabIndex === targetIndex ? 0.95 : 1.0 });
            Column.opacity(this.pressedTabIndex === targetIndex ? 0.6 : 1.0);
            Context.animation(null);
            Column.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.pressedTabIndex = targetIndex;
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.pressedTabIndex = -1;
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(title);
            Context.animation({ duration: 100, curve: Curve.EaseInOut });
            Text.fontSize(this.currentIndex === targetIndex ? this.selectedFontSize : this.normalFontSize);
            Text.fontColor(this.currentIndex === targetIndex ? this.selectedColor : this.normalColor);
            Text.fontWeight(this.currentIndex === targetIndex ? FontWeight.Bold : FontWeight.Normal);
            Context.animation(null);
        }, Text);
        Text.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 0 });
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height('8%');
            Row.backgroundEffect({
                radius: 40,
                saturation: 1.8,
                color: 'rgba(10, 10, 10, 0.25)'
            });
            Row.border({
                width: { bottom: 1 },
                color: 'rgba(255, 255, 255, 0.2)'
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Tabs.create({ index: this.currentIndex });
            Tabs.barMode(BarMode.Scrollable);
            Tabs.onChange((index: number) => {
                this.handleTabChange(index);
            });
            Tabs.barHeight(56);
            Tabs.width('100%');
        }, Tabs);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    TabContent.create();
                    TabContent.tabBar({ builder: () => {
                            this.tabBuilder.call(this, item, this.tabArray.indexOf(item));
                        } });
                }, TabContent);
                TabContent.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabArray, forEachItemGenFunction, (item: string) => item, false, false);
        }, ForEach);
        ForEach.pop();
        Tabs.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域：直接使用 if/else if 结构，不再通过 @Builder 调用
            Column.create();
            Context.animation({ duration: 300, curve: Curve.Ease });
            // 内容区域：直接使用 if/else if 结构，不再通过 @Builder 调用
            Column.width('100%');
            // 内容区域：直接使用 if/else if 结构，不再通过 @Builder 调用
            Column.height('100%');
            // 内容区域：直接使用 if/else if 结构，不再通过 @Builder 调用
            Column.justifyContent(FlexAlign.Center);
            // 内容区域：直接使用 if/else if 结构，不再通过 @Builder 调用
            Column.layoutWeight(1);
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentIndex === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Dolly(this, {
                                    data: this.__dollyData,
                                    addLog: this.addLog,
                                    avatar: this.__dollyAvatar
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 235, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.dollyData,
                                        addLog: this.addLog,
                                        avatar: this.dollyAvatar
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "Dolly" });
                    }
                });
            }
            else if (this.currentIndex === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Conveyor1(this, {
                                    data: this.__conveyorData1,
                                    addLog: this.addLog,
                                    avatar: this.__conveyorAvatar,
                                    // 因为只有在 currentIndex === 1 时才会渲染，所以 isActive 恒为 true
                                    isActive: true,
                                    node: this.data1
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 241, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.conveyorData1,
                                        addLog: this.addLog,
                                        avatar: this.conveyorAvatar,
                                        // 因为只有在 currentIndex === 1 时才会渲染，所以 isActive 恒为 true
                                        isActive: true,
                                        node: this.data1
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    // 因为只有在 currentIndex === 1 时才会渲染，所以 isActive 恒为 true
                                    isActive: true,
                                    node: this.data1
                                });
                            }
                        }, { name: "Conveyor1" });
                    }
                });
            }
            else if (this.currentIndex === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Conveyor2(this, {
                                    data: this.__conveyorData2,
                                    addLog: this.addLog,
                                    avatar: this.__conveyorAvatar,
                                    // 因为只有在 currentIndex === 2 时才会渲染，所以 isActive 恒为 true
                                    isActive: true,
                                    node: this.data2
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 250, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.conveyorData2,
                                        addLog: this.addLog,
                                        avatar: this.conveyorAvatar,
                                        // 因为只有在 currentIndex === 2 时才会渲染，所以 isActive 恒为 true
                                        isActive: true,
                                        node: this.data2
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    // 因为只有在 currentIndex === 2 时才会渲染，所以 isActive 恒为 true
                                    isActive: true,
                                    node: this.data2
                                });
                            }
                        }, { name: "Conveyor2" });
                    }
                });
            }
            else if (this.currentIndex === 3) {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RobotArm1(this, {
                                    data: this.__robot1Data,
                                    addLog: this.addLog,
                                    avatar: this.__robotArmAvatar,
                                    node: this.data3
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 259, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.robot1Data,
                                        addLog: this.addLog,
                                        avatar: this.robotArmAvatar,
                                        node: this.data3
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    node: this.data3
                                });
                            }
                        }, { name: "RobotArm1" });
                    }
                });
            }
            else if (this.currentIndex === 4) {
                this.ifElseBranchUpdateFunction(4, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RobotArm2(this, {
                                    data: this.__robot2Data,
                                    addLog: this.addLog,
                                    avatar: this.__robotArmAvatar,
                                    node: this.data4
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 266, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.robot2Data,
                                        addLog: this.addLog,
                                        avatar: this.robotArmAvatar,
                                        node: this.data4
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    node: this.data4
                                });
                            }
                        }, { name: "RobotArm2" });
                    }
                });
            }
            else if (this.currentIndex === 5) {
                this.ifElseBranchUpdateFunction(5, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RobotArm3(this, {
                                    data: this.__robot3Data,
                                    addLog: this.addLog,
                                    avatar: this.__robotArmAvatar,
                                    node: this.data5
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 273, col: 11 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.robot3Data,
                                        addLog: this.addLog,
                                        avatar: this.robotArmAvatar,
                                        node: this.data5
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    node: this.data5
                                });
                            }
                        }, { name: "RobotArm3" });
                    }
                });
            }
            else // 合并了原有的两层Column的全部修饰符，以保证布局不变
             {
                this.ifElseBranchUpdateFunction(6, () => {
                });
            }
        }, If);
        If.pop();
        // 内容区域：直接使用 if/else if 结构，不再通过 @Builder 调用
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
