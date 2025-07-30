if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MasterStation_Params {
    deviceList?: DeviceStatus[];
    conveyorData1?: ConveyorState;
    conveyorData2?: ConveyorState;
    dollyData?: DollyState;
    robot1Data?: RobotArmState;
    robot2Data?: RobotArmState;
    robot3Data?: RobotArmState;
    isLineRunning?: boolean;
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
}
import { DeviceInfoCard } from "@normalized:N&&&entry/src/main/ets/components/DeviceInfoCard&";
import type { ConveyorState } from '../model/ConveyorState';
import type { DollyState } from '../model/DollyState';
import type { RobotArmState } from '../model/RobotArmState';
// 定义一个简单的数据模型，实际开发中这些数据应通过ViewModel从后端或传感器获取
// 定义一个简单的数据模型
class DeviceStatus {
    //在类的顶层明确声明所有属性
    name: string;
    icon: Resource;
    temp: number;
    humidity: number;
    noise: number;
    vibration: boolean;
    status: string;
    //constructor 只负责接收参数并为已声明的属性赋值
    constructor(name: string, icon: Resource, temp: number, humidity: number, noise: number, vibration: boolean, status: string) {
        this.name = name;
        this.icon = icon;
        this.temp = temp;
        this.humidity = humidity;
        this.noise = noise;
        this.vibration = vibration;
        this.status = status;
    }
}
export class MasterStation extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__deviceList = new ObservedPropertyObjectPU([
            new DeviceStatus("传送带 #1", { "id": 16777258, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, 32, 45, 55, false, '离线中'),
            new DeviceStatus("传送带 #2", { "id": 16777258, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, 35, 48, 58, false, '离线中'),
            new DeviceStatus("小车 #1", { "id": 16777266, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, 41, 50, 40, false, '离线中'),
            new DeviceStatus("机械臂 #1", { "id": 16777273, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, 58, 65, 68, false, '离线中'),
            new DeviceStatus("机械臂 #2", { "id": 16777273, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, 62, 66, 71, false, '离线中'),
            new DeviceStatus("机械臂 #3", { "id": 16777273, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }, 55, 63, 65, false, '离线中')
        ], this, "deviceList");
        this.__conveyorData1 = new SynchedPropertyObjectTwoWayPU(params.conveyorData1, this, "conveyorData1");
        this.__conveyorData2 = new SynchedPropertyObjectTwoWayPU(params.conveyorData2, this, "conveyorData2");
        this.__dollyData = new SynchedPropertyObjectTwoWayPU(params.dollyData, this, "dollyData");
        this.__robot1Data = new SynchedPropertyObjectTwoWayPU(params.robot1Data, this, "robot1Data");
        this.__robot2Data = new SynchedPropertyObjectTwoWayPU(params.robot2Data, this, "robot2Data");
        this.__robot3Data = new SynchedPropertyObjectTwoWayPU(params.robot3Data, this, "robot3Data");
        this.__isLineRunning = new SynchedPropertySimpleTwoWayPU(params.isLineRunning, this, "isLineRunning");
        this.addLog = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MasterStation_Params) {
        if (params.deviceList !== undefined) {
            this.deviceList = params.deviceList;
        }
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
    }
    updateStateVars(params: MasterStation_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__deviceList.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData1.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData2.purgeDependencyOnElmtId(rmElmtId);
        this.__dollyData.purgeDependencyOnElmtId(rmElmtId);
        this.__robot1Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot2Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot3Data.purgeDependencyOnElmtId(rmElmtId);
        this.__isLineRunning.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__deviceList.aboutToBeDeleted();
        this.__conveyorData1.aboutToBeDeleted();
        this.__conveyorData2.aboutToBeDeleted();
        this.__dollyData.aboutToBeDeleted();
        this.__robot1Data.aboutToBeDeleted();
        this.__robot2Data.aboutToBeDeleted();
        this.__robot3Data.aboutToBeDeleted();
        this.__isLineRunning.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 使用@State装饰器使数据成为响应式的，当数据改变时UI会自动更新
    private __deviceList: ObservedPropertyObjectPU<DeviceStatus[]>;
    get deviceList() {
        return this.__deviceList.get();
    }
    set deviceList(newValue: DeviceStatus[]) {
        this.__deviceList.set(newValue);
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
                        this.isLineRunning = false;
                        // 重置所有设备状态为空闲
                        this.conveyorData1.statusText = '离线中';
                        this.conveyorData2.statusText = '离线中';
                        this.dollyData.statusText = '离线中';
                        this.robot1Data.statusText = '离线中';
                        this.robot2Data.statusText = '离线中';
                        this.robot3Data.statusText = '离线中';
                        this.deviceList[0].status = '离线中';
                        this.deviceList[1].status = '离线中';
                        this.deviceList[2].status = '离线中';
                        this.deviceList[3].status = '离线中';
                        this.deviceList[4].status = '离线中';
                        this.deviceList[5].status = '离线中';
                        //强制进行页面刷新
                        this.deviceList = [...this.deviceList];
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
                        //将所有独立的 @Link 状态文本放入一个数组中
                        const allDeviceStatuses = [
                            this.conveyorData1.statusText,
                            this.conveyorData2.statusText,
                            this.dollyData.statusText,
                            this.robot1Data.statusText,
                            this.robot2Data.statusText,
                            this.robot3Data.statusText
                        ];
                        //检查这个数组中是否有任何一个状态不是“离线中”
                        const isAnyDeviceNotOffline = allDeviceStatuses.some(status => status !== '离线中');
                        if (isAnyDeviceNotOffline) {
                            //有设备未进入离线状态，无法进入产线运作
                            //进行弹窗提示
                            AlertDialog.show({
                                title: '操作提示',
                                message: '有设备未进入离线状态，请前往设备管理界面中停止设备运作。',
                                alignment: DialogAlignment.Center,
                                autoCancel: true,
                                buttons: [
                                    {
                                        value: '确定',
                                        action: () => {
                                            //无需做任何操作
                                        }
                                    }
                                ]
                            });
                        }
                        else {
                            this.isLineRunning = true;
                            // 重置所有设备状态为空闲
                            this.conveyorData1.statusText = '运行中';
                            this.conveyorData2.statusText = '运行中';
                            this.dollyData.statusText = '运行中';
                            this.robot1Data.statusText = '运行中';
                            this.robot2Data.statusText = '运行中';
                            this.robot3Data.statusText = '运行中';
                            this.deviceList[0].status = '运行中';
                            this.deviceList[1].status = '运行中';
                            this.deviceList[2].status = '运行中';
                            this.deviceList[3].status = '运行中';
                            this.deviceList[4].status = '运行中';
                            this.deviceList[5].status = '运行中';
                            //强制进行页面刷新
                            this.deviceList = [...this.deviceList];
                            this.addLog('info', '启动产线运行', true);
                        }
                    }
                }
            ]
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/MasterStation.ets(176:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.justifyContent(FlexAlign.Start);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/MasterStation.ets(177:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceEvenly);
            Row.margin({ top: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('启动产线运作');
            Button.debugLine("entry/src/main/ets/view/MasterStation.ets(178:9)", "entry");
            Button.onClick(() => this.startLine());
            Button.backgroundColor(this.isLineRunning ? Color.Gray : '#28a745');
            Button.enabled(!this.isLineRunning);
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('停止产线运作');
            Button.debugLine("entry/src/main/ets/view/MasterStation.ets(183:9)", "entry");
            Button.onClick(() => this.stopLine());
            Button.backgroundColor(this.isLineRunning ? '#dc3545' : Color.Gray);
            Button.enabled(this.isLineRunning);
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //使用Grid布局来展示所有设备卡片
            Grid.create();
            Grid.debugLine("entry/src/main/ets/view/MasterStation.ets(193:7)", "entry");
            //使用Grid布局来展示所有设备卡片
            Grid.columnsTemplate('1fr 1fr');
            //使用Grid布局来展示所有设备卡片
            Grid.rowsTemplate('1fr 1fr 1fr');
            //使用Grid布局来展示所有设备卡片
            Grid.columnsGap(20);
            //使用Grid布局来展示所有设备卡片
            Grid.rowsGap(20);
            //使用Grid布局来展示所有设备卡片
            Grid.padding(20);
            //使用Grid布局来展示所有设备卡片
            Grid.width('95%');
            //使用Grid布局来展示所有设备卡片
            Grid.height('85%');
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 循环渲染设备列表
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.debugLine("entry/src/main/ets/view/MasterStation.ets(196:11)", "entry");
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new 
                                    // 使用我们封装好的DeviceInfoCard组件
                                    DeviceInfoCard(this, {
                                        title: item.name,
                                        icon: item.icon,
                                        temperature: item.temp,
                                        humidity: item.humidity,
                                        noise: item.noise,
                                        vibration: item.vibration,
                                        status: item.status,
                                        conveyorData1: this.__conveyorData1,
                                        conveyorData2: this.__conveyorData2,
                                        dollyData: this.__dollyData,
                                        robot1Data: this.__robot1Data,
                                        robot2Data: this.__robot2Data,
                                        robot3Data: this.__robot3Data,
                                        isLineRunning: this.__isLineRunning
                                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/MasterStation.ets", line: 198, col: 13 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            title: item.name,
                                            icon: item.icon,
                                            temperature: item.temp,
                                            humidity: item.humidity,
                                            noise: item.noise,
                                            vibration: item.vibration,
                                            status: item.status,
                                            conveyorData1: this.conveyorData1,
                                            conveyorData2: this.conveyorData2,
                                            dollyData: this.dollyData,
                                            robot1Data: this.robot1Data,
                                            robot2Data: this.robot2Data,
                                            robot3Data: this.robot3Data,
                                            isLineRunning: this.isLineRunning
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {
                                        title: item.name,
                                        icon: item.icon,
                                        temperature: item.temp,
                                        humidity: item.humidity,
                                        noise: item.noise,
                                        vibration: item.vibration,
                                        status: item.status
                                    });
                                }
                            }, { name: "DeviceInfoCard" });
                        }
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.deviceList, forEachItemGenFunction);
        }, ForEach);
        // 循环渲染设备列表
        ForEach.pop();
        //使用Grid布局来展示所有设备卡片
        Grid.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
