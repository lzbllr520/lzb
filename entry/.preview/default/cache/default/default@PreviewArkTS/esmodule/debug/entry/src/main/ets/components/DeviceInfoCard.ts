if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DeviceInfoCard_Params {
    conveyorData1?: ConveyorState;
    conveyorData2?: ConveyorState;
    dollyData?: DollyState;
    robot1Data?: RobotArmState;
    robot2Data?: RobotArmState;
    robot3Data?: RobotArmState;
    isLineRunning?: boolean;
    title?: string;
    icon?: Resource;
    temperature?: number;
    humidity?: number;
    noise?: number;
    vibration?: boolean;
    status?: string;
    tempThreshold?: number;
    humidityThreshold?: number;
    noiseThreshold?: number;
}
import type { ConveyorState } from "../model/ConveyorState";
import type { DollyState } from "../model/DollyState";
import type { RobotArmState } from "../model/RobotArmState";
export class DeviceInfoCard extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__conveyorData1 = new SynchedPropertyObjectTwoWayPU(params.conveyorData1, this, "conveyorData1");
        this.__conveyorData2 = new SynchedPropertyObjectTwoWayPU(params.conveyorData2, this, "conveyorData2");
        this.__dollyData = new SynchedPropertyObjectTwoWayPU(params.dollyData, this, "dollyData");
        this.__robot1Data = new SynchedPropertyObjectTwoWayPU(params.robot1Data, this, "robot1Data");
        this.__robot2Data = new SynchedPropertyObjectTwoWayPU(params.robot2Data, this, "robot2Data");
        this.__robot3Data = new SynchedPropertyObjectTwoWayPU(params.robot3Data, this, "robot3Data");
        this.__isLineRunning = new SynchedPropertySimpleTwoWayPU(params.isLineRunning, this, "isLineRunning");
        this.__title = new SynchedPropertySimpleOneWayPU(params.title, this, "title");
        this.__icon = new SynchedPropertyObjectOneWayPU(params.icon, this, "icon");
        this.__temperature = new SynchedPropertySimpleOneWayPU(params.temperature, this, "temperature");
        this.__humidity = new SynchedPropertySimpleOneWayPU(params.humidity, this, "humidity");
        this.__noise = new SynchedPropertySimpleOneWayPU(params.noise, this, "noise");
        this.__vibration = new SynchedPropertySimpleOneWayPU(params.vibration, this, "vibration");
        this.__status = new SynchedPropertySimpleOneWayPU(params.status, this, "status");
        this.tempThreshold = 60;
        this.humidityThreshold = 80;
        this.noiseThreshold = 70;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DeviceInfoCard_Params) {
        if (params.title === undefined) {
            this.__title.set('');
        }
        if (params.icon === undefined) {
            this.__icon.set({ "id": 16777231, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
        }
        if (params.temperature === undefined) {
            this.__temperature.set(0);
        }
        if (params.humidity === undefined) {
            this.__humidity.set(0);
        }
        if (params.noise === undefined) {
            this.__noise.set(0);
        }
        if (params.vibration === undefined) {
            this.__vibration.set(false);
        }
        if (params.status === undefined) {
            this.__status.set('离线中'
            // 预警阈值
            );
        }
        if (params.tempThreshold !== undefined) {
            this.tempThreshold = params.tempThreshold;
        }
        if (params.humidityThreshold !== undefined) {
            this.humidityThreshold = params.humidityThreshold;
        }
        if (params.noiseThreshold !== undefined) {
            this.noiseThreshold = params.noiseThreshold;
        }
    }
    updateStateVars(params: DeviceInfoCard_Params) {
        this.__title.reset(params.title);
        this.__icon.reset(params.icon);
        this.__temperature.reset(params.temperature);
        this.__humidity.reset(params.humidity);
        this.__noise.reset(params.noise);
        this.__vibration.reset(params.vibration);
        this.__status.reset(params.status);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__conveyorData1.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData2.purgeDependencyOnElmtId(rmElmtId);
        this.__dollyData.purgeDependencyOnElmtId(rmElmtId);
        this.__robot1Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot2Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot3Data.purgeDependencyOnElmtId(rmElmtId);
        this.__isLineRunning.purgeDependencyOnElmtId(rmElmtId);
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__temperature.purgeDependencyOnElmtId(rmElmtId);
        this.__humidity.purgeDependencyOnElmtId(rmElmtId);
        this.__noise.purgeDependencyOnElmtId(rmElmtId);
        this.__vibration.purgeDependencyOnElmtId(rmElmtId);
        this.__status.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__conveyorData1.aboutToBeDeleted();
        this.__conveyorData2.aboutToBeDeleted();
        this.__dollyData.aboutToBeDeleted();
        this.__robot1Data.aboutToBeDeleted();
        this.__robot2Data.aboutToBeDeleted();
        this.__robot3Data.aboutToBeDeleted();
        this.__isLineRunning.aboutToBeDeleted();
        this.__title.aboutToBeDeleted();
        this.__icon.aboutToBeDeleted();
        this.__temperature.aboutToBeDeleted();
        this.__humidity.aboutToBeDeleted();
        this.__noise.aboutToBeDeleted();
        this.__vibration.aboutToBeDeleted();
        this.__status.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
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
    private __isLineRunning: SynchedPropertySimpleTwoWayPU<boolean
    // 定义设备信息的数据结构
    >;
    get isLineRunning() {
        return this.__isLineRunning.get();
    }
    set isLineRunning(newValue: boolean) {
        this.__isLineRunning.set(newValue);
    }
    // 定义设备信息的数据结构
    private __title: SynchedPropertySimpleOneWayPU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __icon: SynchedPropertySimpleOneWayPU<Resource>; // 默认图标
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: Resource) {
        this.__icon.set(newValue);
    }
    private __temperature: SynchedPropertySimpleOneWayPU<number>;
    get temperature() {
        return this.__temperature.get();
    }
    set temperature(newValue: number) {
        this.__temperature.set(newValue);
    }
    private __humidity: SynchedPropertySimpleOneWayPU<number>;
    get humidity() {
        return this.__humidity.get();
    }
    set humidity(newValue: number) {
        this.__humidity.set(newValue);
    }
    private __noise: SynchedPropertySimpleOneWayPU<number>;
    get noise() {
        return this.__noise.get();
    }
    set noise(newValue: number) {
        this.__noise.set(newValue);
    }
    private __vibration: SynchedPropertySimpleOneWayPU<boolean>;
    get vibration() {
        return this.__vibration.get();
    }
    set vibration(newValue: boolean) {
        this.__vibration.set(newValue);
    }
    private __status: SynchedPropertySimpleOneWayPU<string>;
    get status() {
        return this.__status.get();
    }
    set status(newValue: string) {
        this.__status.set(newValue);
    }
    // 预警阈值
    private tempThreshold: number;
    private humidityThreshold: number;
    private noiseThreshold: number;
    private getStatusColor(status: string): Color {
        switch (status) {
            case '空闲中':
                return Color.Green;
            case '运行中':
                return Color.Yellow;
            case '离线中':
                return Color.Gray;
            default:
                return Color.Gray;
        }
    }
    private StatusIndicator(status: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(46:5)", "entry");
            Row.margin({ top: 8 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态指示灯
            Circle.create();
            Circle.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(48:7)", "entry");
            // 状态指示灯
            Circle.width(10);
            // 状态指示灯
            Circle.height(10);
            // 状态指示灯
            Circle.fill(this.getStatusColor(status));
            // 状态指示灯
            Circle.margin({ right: 5 });
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 状态文本
            Text.create(status);
            Text.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(55:7)", "entry");
            // 状态文本
            Text.fontSize(14);
            // 状态文本
            Text.fontColor(this.getStatusColor(status));
        }, Text);
        // 状态文本
        Text.pop();
        Row.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(63:5)", "entry");
            Row.padding(15);
            Row.borderRadius(24);
            Row.backdropBlur(12);
            Row.backgroundColor('rgba(10, 10, 15, 0.3)');
            Row.borderRadius(16);
            Row.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            Row.shadow({
                radius: 30,
                color: 'rgba(173, 216, 230, 0.2)',
                offsetX: 0,
                offsetY: 0
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左侧：图标和设备名称
            Column.create();
            Column.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(65:7)", "entry");
            // 左侧：图标和设备名称
            Column.width('30%');
            // 左侧：图标和设备名称
            Column.alignItems(HorizontalAlign.Center);
            // 左侧：图标和设备名称
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.icon);
            Image.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(66:9)", "entry");
            Image.width(48);
            Image.height(48);
            Image.objectFit(ImageFit.Contain);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.title);
            Text.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(70:9)", "entry");
            Text.fontColor(Color.White);
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ top: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.title === '传送带 #1') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLineRunning) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.StatusIndicator.bind(this)(this.status);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.StatusIndicator.bind(this)(this.conveyorData1.statusText);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else if (this.title === '传送带 #2') {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLineRunning) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.StatusIndicator.bind(this)(this.status);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.StatusIndicator.bind(this)(this.conveyorData2.statusText);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else if (this.title === '小车 #1') {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLineRunning) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.StatusIndicator.bind(this)(this.status);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.StatusIndicator.bind(this)(this.dollyData.statusText);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else if (this.title === '机械臂 #1') {
                this.ifElseBranchUpdateFunction(3, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLineRunning) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.StatusIndicator.bind(this)(this.status);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.StatusIndicator.bind(this)(this.robot1Data.statusText);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else if (this.title === '机械臂 #2') {
                this.ifElseBranchUpdateFunction(4, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLineRunning) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.StatusIndicator.bind(this)(this.status);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.StatusIndicator.bind(this)(this.robot2Data.statusText);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else if (this.title === '机械臂 #3') {
                this.ifElseBranchUpdateFunction(5, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLineRunning) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.StatusIndicator.bind(this)(this.status);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.StatusIndicator.bind(this)(this.robot3Data.statusText);
                            });
                        }
                    }, If);
                    If.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(6, () => {
                });
            }
        }, If);
        If.pop();
        // 左侧：图标和设备名称
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 分隔线
            Divider.create();
            Divider.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(120:7)", "entry");
            // 分隔线
            Divider.vertical(true);
            // 分隔线
            Divider.height('80%');
            // 分隔线
            Divider.strokeWidth(1);
            // 分隔线
            Divider.color('#FFFFFF');
            // 分隔线
            Divider.margin({ left: 5, right: 10 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右侧：具体的监控数据
            GridRow.create();
            GridRow.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(128:7)", "entry");
            // 右侧：具体的监控数据
            GridRow.width('70%');
        }, GridRow);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 温度
            GridCol.create({ span: { xs: 6, sm: 6, md: 6, lg: 6 } });
            GridCol.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(130:9)", "entry");
        }, GridCol);
        this.DataText.bind(this)("温度", `${this.temperature}°C`, this.temperature > this.tempThreshold);
        // 温度
        GridCol.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 湿度
            GridCol.create({ span: { xs: 6, sm: 6, md: 6, lg: 6 } });
            GridCol.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(134:9)", "entry");
        }, GridCol);
        this.DataText.bind(this)("湿度", `${this.humidity}%`, this.humidity > this.humidityThreshold);
        // 湿度
        GridCol.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 噪音
            GridCol.create({ span: { xs: 6, sm: 6, md: 6, lg: 6 } });
            GridCol.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(138:9)", "entry");
        }, GridCol);
        this.DataText.bind(this)("噪音", `${this.noise}dB`, this.noise > this.noiseThreshold);
        // 噪音
        GridCol.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 震动
            GridCol.create({ span: { xs: 6, sm: 6, md: 6, lg: 6 } });
            GridCol.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(142:9)", "entry");
        }, GridCol);
        this.DataText.bind(this)("震动", this.vibration ? '有' : '无', this.vibration);
        // 震动
        GridCol.pop();
        // 右侧：具体的监控数据
        GridRow.pop();
        Row.pop();
    }
    // 自定义数据展示组件，包含预警变色逻辑
    DataText(label: string, value: string, isWarning: boolean, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(170:5)", "entry");
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.padding(5);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(171:7)", "entry");
            Text.fontSize(14);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value);
            Text.debugLine("entry/src/main/ets/components/DeviceInfoCard.ets(174:7)", "entry");
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(isWarning ? Color.Red : Color.White);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
