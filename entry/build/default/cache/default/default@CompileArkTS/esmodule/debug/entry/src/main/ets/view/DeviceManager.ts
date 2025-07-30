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
    swiperController?: SwiperController;
    onIndexChange?: (index: number) => void;
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
        this.swiperController = new SwiperController();
        this.onIndexChange = () => { };
        this.setInitiallyProvidedValue(params);
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
        if (params.swiperController !== undefined) {
            this.swiperController = params.swiperController;
        }
        if (params.onIndexChange !== undefined) {
            this.onIndexChange = params.onIndexChange;
        }
    }
    updateStateVars(params: DeviceManager_Params) {
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
    //用于记录当前被按下的Tab索引，-1代表没有Tab被按下
    private __pressedTabIndex: ObservedPropertySimplePU<number>;
    get pressedTabIndex() {
        return this.__pressedTabIndex.get();
    }
    set pressedTabIndex(newValue: number) {
        this.__pressedTabIndex.set(newValue);
    }
    private swiperController: SwiperController;
    private onIndexChange: (index: number) => void;
    deviceContent(index: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (index === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Dolly(this, {
                                    data: this.__dollyData,
                                    addLog: this.addLog,
                                    avatar: this.__dollyAvatar
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 45, col: 9 });
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
            else if (index === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Conveyor1(this, {
                                    data: this.__conveyorData1,
                                    addLog: this.addLog,
                                    avatar: this.__conveyorAvatar,
                                    isActive: index === this.currentIndex
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 51, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.conveyorData1,
                                        addLog: this.addLog,
                                        avatar: this.conveyorAvatar,
                                        isActive: index === this.currentIndex
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    isActive: index === this.currentIndex
                                });
                            }
                        }, { name: "Conveyor1" });
                    }
                });
            }
            else if (index === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Conveyor2(this, {
                                    data: this.__conveyorData2,
                                    addLog: this.addLog,
                                    avatar: this.__conveyorAvatar,
                                    isActive: index === this.currentIndex
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 58, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.conveyorData2,
                                        addLog: this.addLog,
                                        avatar: this.conveyorAvatar,
                                        isActive: index === this.currentIndex
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    isActive: index === this.currentIndex
                                });
                            }
                        }, { name: "Conveyor2" });
                    }
                });
            }
            else if (index === 3) {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RobotArm1(this, {
                                    data: this.__robot1Data,
                                    addLog: this.addLog,
                                    avatar: this.__robotArmAvatar
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 65, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.robot1Data,
                                        addLog: this.addLog,
                                        avatar: this.robotArmAvatar
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "RobotArm1" });
                    }
                });
            }
            else if (index === 4) {
                this.ifElseBranchUpdateFunction(4, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RobotArm2(this, {
                                    data: this.__robot2Data,
                                    addLog: this.addLog,
                                    avatar: this.__robotArmAvatar
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 71, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.robot2Data,
                                        addLog: this.addLog,
                                        avatar: this.robotArmAvatar
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "RobotArm2" });
                    }
                });
            }
            else if (index === 5) {
                this.ifElseBranchUpdateFunction(5, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RobotArm3(this, {
                                    data: this.__robot3Data,
                                    addLog: this.addLog,
                                    avatar: this.__robotArmAvatar
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/DeviceManager.ets", line: 77, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.robot3Data,
                                        addLog: this.addLog,
                                        avatar: this.robotArmAvatar
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "RobotArm3" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(6, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
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
                // 监听触摸事件
                if (event.type === TouchType.Down) {
                    // 手指按下时，记录当前项的索引
                    this.pressedTabIndex = targetIndex;
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    // 手指抬起或触摸取消时，重置状态
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
                if (index === this.currentIndex + 1) {
                    this.swiperController.showNext();
                }
                else if (index === this.currentIndex - 1) {
                    this.swiperController.showPrevious();
                }
                else {
                    this.swiperController.changeIndex(index, true);
                }
                this.currentIndex = index;
                this.onIndexChange(index);
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
            Swiper.create(this.swiperController);
            Context.animation({ duration: 300, curve: Curve.Ease });
            Swiper.index(this.currentIndex);
            Swiper.onChange((index: number) => {
                this.currentIndex = index;
                this.onIndexChange(index);
            });
            Swiper.loop(false);
            Swiper.indicator(false);
            Swiper.itemSpace(0);
            Swiper.width('100%');
            Swiper.layoutWeight(1);
            Context.animation(null);
        }, Swiper);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.width('100%');
                    Column.height('100%');
                    Column.justifyContent(FlexAlign.Center);
                }, Column);
                this.deviceContent.bind(this)(index);
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, this.tabArray, forEachItemGenFunction, (item: string) => item, true, false);
        }, ForEach);
        ForEach.pop();
        Swiper.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
