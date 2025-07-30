if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ActionButton_Params {
    icon?: Resource;
    click?: () => void;
    isPressed?: boolean;
}
interface RockerControl_Params {
    handleX?: number;
    handleY?: number;
    onDirectionChange?: (direction: string) => void;
    rockerBaseSize?: number;
    rockerHandleSize?: number;
}
interface Dolly_Params {
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    data?: DollyState;
    isPressed?: boolean;
    isHover?: boolean;
    avatar?: Resource;
    rockerDirection?: string;
    idleTimer?: number;
    isInfoCardVisible?: boolean;
    controlCardWidth?: string;
    rockerBaseSize?: number;
    rockerHandleSize?: number;
    isPreviewVisible?: boolean;
}
import type { DollyState } from "../../model/DollyState";
export class Dolly extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.addLog = () => { };
        this.__data = new SynchedPropertyObjectTwoWayPU(params.data, this, "data");
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.__isHover = new ObservedPropertySimplePU(false, this, "isHover");
        this.__avatar = new SynchedPropertyObjectTwoWayPU(params.avatar, this, "avatar");
        this.__rockerDirection = new ObservedPropertySimplePU('stop', this, "rockerDirection");
        this.idleTimer = -1;
        this.__isInfoCardVisible = new ObservedPropertySimplePU(false, this, "isInfoCardVisible");
        this.__controlCardWidth = new ObservedPropertySimplePU('65%', this, "controlCardWidth");
        this.__rockerBaseSize = new ObservedPropertySimplePU(250, this, "rockerBaseSize");
        this.__rockerHandleSize = new ObservedPropertySimplePU(80, this, "rockerHandleSize");
        this.__isPreviewVisible = new ObservedPropertySimplePU(false, this, "isPreviewVisible");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Dolly_Params) {
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
        if (params.isHover !== undefined) {
            this.isHover = params.isHover;
        }
        if (params.rockerDirection !== undefined) {
            this.rockerDirection = params.rockerDirection;
        }
        if (params.idleTimer !== undefined) {
            this.idleTimer = params.idleTimer;
        }
        if (params.isInfoCardVisible !== undefined) {
            this.isInfoCardVisible = params.isInfoCardVisible;
        }
        if (params.controlCardWidth !== undefined) {
            this.controlCardWidth = params.controlCardWidth;
        }
        if (params.rockerBaseSize !== undefined) {
            this.rockerBaseSize = params.rockerBaseSize;
        }
        if (params.rockerHandleSize !== undefined) {
            this.rockerHandleSize = params.rockerHandleSize;
        }
        if (params.isPreviewVisible !== undefined) {
            this.isPreviewVisible = params.isPreviewVisible;
        }
    }
    updateStateVars(params: Dolly_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__data.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isHover.purgeDependencyOnElmtId(rmElmtId);
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
        this.__rockerDirection.purgeDependencyOnElmtId(rmElmtId);
        this.__isInfoCardVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__controlCardWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__rockerBaseSize.purgeDependencyOnElmtId(rmElmtId);
        this.__rockerHandleSize.purgeDependencyOnElmtId(rmElmtId);
        this.__isPreviewVisible.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__data.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        this.__isHover.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        this.__rockerDirection.aboutToBeDeleted();
        this.__isInfoCardVisible.aboutToBeDeleted();
        this.__controlCardWidth.aboutToBeDeleted();
        this.__rockerBaseSize.aboutToBeDeleted();
        this.__rockerHandleSize.aboutToBeDeleted();
        this.__isPreviewVisible.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private addLog: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    private __data: SynchedPropertySimpleOneWayPU<DollyState>;
    get data() {
        return this.__data.get();
    }
    set data(newValue: DollyState) {
        this.__data.set(newValue);
    }
    // 用于控制按钮按压动画的状态
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    //用于追踪鼠标悬浮状态
    private __isHover: ObservedPropertySimplePU<boolean>;
    get isHover() {
        return this.__isHover.get();
    }
    set isHover(newValue: boolean) {
        this.__isHover.set(newValue);
    }
    private __avatar: SynchedPropertySimpleOneWayPU<Resource>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(newValue: Resource) {
        this.__avatar.set(newValue);
    }
    //用于追踪遥感方向的状态
    private __rockerDirection: ObservedPropertySimplePU<string>; // 'up', 'down', 'left', 'right', 'stop'
    get rockerDirection() {
        return this.__rockerDirection.get();
    }
    set rockerDirection(newValue: string) {
        this.__rockerDirection.set(newValue);
    }
    //用来存储30s内无遥感操作定时器ID
    private idleTimer: number;
    //基础信息展示卡片动画控制器
    private __isInfoCardVisible: ObservedPropertySimplePU<boolean>;
    get isInfoCardVisible() {
        return this.__isInfoCardVisible.get();
    }
    set isInfoCardVisible(newValue: boolean) {
        this.__isInfoCardVisible.set(newValue);
    }
    //用来控制遥感和卡片尺寸的控制器
    private __controlCardWidth: ObservedPropertySimplePU<string>;
    get controlCardWidth() {
        return this.__controlCardWidth.get();
    }
    set controlCardWidth(newValue: string) {
        this.__controlCardWidth.set(newValue);
    }
    private __rockerBaseSize: ObservedPropertySimplePU<number>;
    get rockerBaseSize() {
        return this.__rockerBaseSize.get();
    }
    set rockerBaseSize(newValue: number) {
        this.__rockerBaseSize.set(newValue);
    }
    private __rockerHandleSize: ObservedPropertySimplePU<number>;
    get rockerHandleSize() {
        return this.__rockerHandleSize.get();
    }
    set rockerHandleSize(newValue: number) {
        this.__rockerHandleSize.set(newValue);
    }
    onDisappear() {
        //页面销毁时，清除原来的定时器
        if (this.idleTimer !== -1) {
            clearTimeout(this.idleTimer);
        }
    }
    private getStatusColor(): Color {
        switch (this.data.statusText) {
            case '运行中':
                return Color.Orange;
            case '离线中':
                return Color.Gray;
            case '空闲中':
                return Color.Green;
            default:
                return Color.Gray;
        }
    }
    private getShadowOptions(): ShadowOptions {
        // 仅在悬浮且未被按下时，显示“浮起”的增强阴影
        if (this.isHover && !this.isPressed) {
            return {
                radius: 15,
                color: 'rgba(0, 0, 0, 0.25)',
                offsetX: 0,
                offsetY: 8 // 向下偏移更多，产生立体感
            };
        }
        // 默认或点击时的阴影
        return {
            radius: 5,
            color: 'rgba(0, 0, 0, 0.15)',
            offsetX: 2,
            offsetY: 2
        };
    }
    private getScaleValue(): number {
        // 点击状态的优先级最高
        if (this.isPressed) {
            return 0.95; // 按下时，总是缩小
        }
        // 其次是悬浮状态
        if (this.isHover) {
            return 1.05; // 悬浮时，放大
        }
        // 默认状态
        return 1.0;
    }
    private showSystemToast(message: string) {
        try {
            this.getUIContext().getPromptAction().showToast({
                message: message,
                duration: 1000,
                bottom: '80%'
            });
        }
        catch (error) {
            console.error('Show toast error:', error);
        }
    }
    //用于控制图片预览是否显示的状态变量
    private __isPreviewVisible: ObservedPropertySimplePU<boolean>;
    get isPreviewVisible() {
        return this.__isPreviewVisible.get();
    }
    set isPreviewVisible(newValue: boolean) {
        this.__isPreviewVisible.set(newValue);
    }
    //预览层
    private buildImagePreview(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用Stack作为根布局，以实现覆盖效果
            Stack.create();
            // 使用Stack作为根布局，以实现覆盖效果
            Stack.width('100%');
            // 使用Stack作为根布局，以实现覆盖效果
            Stack.height('100%');
            // 使用Stack作为根布局，以实现覆盖效果
            Stack.alignContent(Alignment.Center);
            // 使用Stack作为根布局，以实现覆盖效果
            Stack.transition(TransitionEffect.OPACITY.animation({ duration: 250, curve: Curve.EaseInOut }));
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 半透明背景遮罩，本身就作为可点击关闭的区域
            Column.create();
            // 半透明背景遮罩，本身就作为可点击关闭的区域
            Column.width('100%');
            // 半透明背景遮罩，本身就作为可点击关闭的区域
            Column.height('100%');
            // 半透明背景遮罩，本身就作为可点击关闭的区域
            Column.backgroundColor('rgba(0, 0, 0, 0.7)');
            // 半透明背景遮罩，本身就作为可点击关闭的区域
            Column.onClick(() => {
                // 点击背景时，关闭预览
                this.isPreviewVisible = false;
            });
        }, Column);
        // 半透明背景遮罩，本身就作为可点击关闭的区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 居中显示的、放大的图片
            Image.create({ "id": 16777238, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            // 居中显示的、放大的图片
            Image.width('50%');
            // 居中显示的、放大的图片
            Image.objectFit(ImageFit.Contain);
            // 居中显示的、放大的图片
            Image.borderRadius(16);
            // 居中显示的、放大的图片
            Image.hitTestBehavior(HitTestMode.Block);
        }, Image);
        // 使用Stack作为根布局，以实现覆盖效果
        Stack.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 20 });
            Row.padding(20);
            Row.width('100%');
            Row.height('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            //基础信息卡片
            if (!this.isInfoCardVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width('30%');
                        Stack.height('100%');
                        Stack.clip(true);
                        Stack.offset({ x: this.isInfoCardVisible ? '-120%' : 0 });
                        Stack.opacity(this.isInfoCardVisible ? 0 : 1);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
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
                        Column.create();
                        Column.width('90%');
                        Column.height('30%');
                        Column.alignItems(HorizontalAlign.Center);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.avatar);
                        Context.animation({ duration: 200, curve: Curve.EaseInOut });
                        Image.width(170);
                        Image.height(100);
                        Image.borderRadius(16);
                        Image.opacity(0.8);
                        Image.onClick(() => {
                            this.isPreviewVisible = true;
                        });
                        Image.onHover((isHovering: boolean) => {
                            // 你可以在这里添加额外的悬浮动画，比如轻微放大
                        });
                        Context.animation(null);
                    }, Image);
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 20 });
                        Column.width('100%');
                        Column.height('70%');
                        Column.alignItems(HorizontalAlign.Center);
                        Column.justifyContent(FlexAlign.Center);
                        Column.padding({ left: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //小车名称
                        Row.create();
                        //小车名称
                        Row.width('100%');
                        //小车名称
                        Row.justifyContent(FlexAlign.Center);
                        //小车名称
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('名称：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(20);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('小车001');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    //小车名称
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //小车运行状态
                        Row.create();
                        //小车运行状态
                        Row.width('100%');
                        //小车运行状态
                        Row.justifyContent(FlexAlign.Center);
                        //小车运行状态
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('状态：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(20);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.statusText);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.margin({ left: 10 });
                        Circle.width(16);
                        Circle.height(16);
                        Circle.fill(this.getStatusColor());
                    }, Circle);
                    //小车运行状态
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //小车负载状态
                        Row.create();
                        //小车负载状态
                        Row.width('100%');
                        //小车负载状态
                        Row.justifyContent(FlexAlign.Center);
                        //小车负载状态
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('负载：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(20);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.loadText);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.data.loadText === '有物品') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 16777231, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                                    Image.width(20);
                                    Image.height(20);
                                    Image.margin({ left: 10 });
                                }, Image);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 16777255, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                                    Image.width(20);
                                    Image.height(20);
                                    Image.margin({ left: 10 });
                                }, Image);
                            });
                        }
                    }, If);
                    If.pop();
                    //小车负载状态
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //控制启动按钮
                        Row.create();
                        Context.animation({ duration: 150, curve: Curve.EaseOut });
                        //控制启动按钮
                        Row.width('80%');
                        //控制启动按钮
                        Row.height(50);
                        //控制启动按钮
                        Row.padding(10);
                        //控制启动按钮
                        Row.justifyContent(FlexAlign.Center);
                        //控制启动按钮
                        Row.alignItems(VerticalAlign.Center);
                        //控制启动按钮
                        Row.backgroundColor(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 'rgba(255, 80, 80, 0.4)' : 'rgba(0, 200, 83, 0.5)');
                        //控制启动按钮
                        Row.borderRadius(25);
                        //控制启动按钮
                        Row.border({
                            width: 1,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //控制启动按钮
                        Row.margin({ top: 20 });
                        //控制启动按钮
                        Row.shadow(this.getShadowOptions());
                        //控制启动按钮
                        Row.scale({
                            x: this.getScaleValue(),
                            y: this.getScaleValue()
                        });
                        //控制启动按钮
                        Row.opacity(this.isPressed ? 0.8 : 1.0);
                        //控制启动按钮
                        Row.onHover((isHover: boolean) => {
                            this.isHover = isHover;
                        });
                        Gesture.create(GesturePriority.Low);
                        LongPressGesture.create();
                        LongPressGesture.pop();
                        Gesture.pop();
                        //控制启动按钮
                        Row.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.isPressed = true;
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                this.isPressed = false;
                                const isCurrentlyRunning = this.data.statusText === '运行中' || this.data.statusText === '空闲中';
                                const message = isCurrentlyRunning ? '您确定要停止小车吗？' : '您确定要启动小车吗？';
                                AlertDialog.show({
                                    title: '操作确认',
                                    message: message,
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
                                                if (isCurrentlyRunning) {
                                                    //关闭时先清除原来的定时器
                                                    if (this.idleTimer !== -1) {
                                                        clearTimeout(this.idleTimer);
                                                        this.idleTimer = -1;
                                                    }
                                                    this.data.statusText = '离线中';
                                                    this.showSystemToast('关闭成功');
                                                    this.addLog('warning', '关闭了小车，停止了对小车的操作。', true);
                                                }
                                                else {
                                                    this.data.statusText = '空闲中';
                                                    this.showSystemToast('启动成功');
                                                    this.addLog('info', '启动了小车，要对小车进行操作。', true);
                                                }
                                                console.info('操作已确认');
                                            }
                                        }
                                    ]
                                });
                            }
                        });
                        Context.animation(null);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.data.statusText === '运行中' || this.data.statusText === '空闲中') {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 16777266, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                                    Image.width(22);
                                    Image.height(22);
                                    Image.fillColor(Color.White);
                                }, Image);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('停止');
                                    Text.fontSize(18);
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.fontColor(Color.White);
                                    Text.margin({ left: 8 });
                                }, Text);
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 16777265, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                                    Image.width(24);
                                    Image.height(24);
                                    Image.fillColor(Color.White);
                                }, Image);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('启动');
                                    Text.fontSize(18);
                                    Text.fontWeight(FontWeight.Bold);
                                    Text.fontColor(Color.White);
                                    Text.margin({ left: 8 });
                                }, Text);
                                Text.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    //控制启动按钮
                    Row.pop();
                    Column.pop();
                    Column.pop();
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //地图信息卡片
                        Stack.create();
                        //地图信息卡片
                        Stack.width('60%');
                        //地图信息卡片
                        Stack.height('100%');
                        //地图信息卡片
                        Stack.clip(true);
                        //地图信息卡片
                        Stack.offset({ x: this.isInfoCardVisible ? 0 : '-120%' });
                        //地图信息卡片
                        Stack.opacity(this.isInfoCardVisible ? 1 : 0);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.alignItems(HorizontalAlign.Center);
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
                        Text.create('小车地图面板');
                        Text.fontColor(Color.White);
                        Text.fontSize(24);
                    }, Text);
                    Text.pop();
                    Column.pop();
                    //地图信息卡片
                    Stack.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 小车控制卡片——遥感控制器
            Stack.create({ alignContent: Alignment.TopEnd });
            // 小车控制卡片——遥感控制器
            Stack.width(this.controlCardWidth);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation(null);
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.width('100%');
            Column.height('100%');
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
            __Common__.create();
            __Common__.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
            __Common__.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.5);
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 在这里调用新的遥感组件
                    RockerControl(this, {
                        //传入尺寸
                        rockerBaseSize: this.rockerBaseSize,
                        rockerHandleSize: this.rockerHandleSize,
                        // 传递一个回调函数，当遥感方向改变时，会调用这个函数
                        // 并将新的方向作为参数传进来
                        onDirectionChange: (direction: string) => {
                            // 更新父组件的状态
                            this.rockerDirection = direction;
                            // 你可以在这里根据direction发送具体的命令
                            //只要遥感有任何操作，就清除旧的“返回空闲状态”的定时器
                            if (this.idleTimer !== -1) {
                                clearTimeout(this.idleTimer);
                                this.idleTimer = -1;
                            }
                            if (direction !== 'stop') {
                                // 并且当前状态是“空闲中”，则立即切换为“运行中”
                                if (this.data.statusText === '空闲中') {
                                    this.data.statusText = '运行中';
                                }
                            }
                            //如果遥感已回到中心 (方向是 'stop')
                            else {
                                // 并且当前状态是“运行中”，则启动一个30秒的倒计时
                                if (this.data.statusText === '运行中') {
                                    this.idleTimer = setTimeout(() => {
                                        // 30秒后，如果状态仍然是“运行中”，则切换回“空闲中”
                                        if (this.data.statusText === '运行中') {
                                            this.data.statusText = '空闲中';
                                        }
                                    }, 10000); // 30000毫秒 = 30秒
                                }
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Dolly.ets", line: 363, col: 13 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            //传入尺寸
                            rockerBaseSize: this.rockerBaseSize,
                            rockerHandleSize: this.rockerHandleSize,
                            // 传递一个回调函数，当遥感方向改变时，会调用这个函数
                            // 并将新的方向作为参数传进来
                            onDirectionChange: (direction: string) => {
                                // 更新父组件的状态
                                this.rockerDirection = direction;
                                // 你可以在这里根据direction发送具体的命令
                                //只要遥感有任何操作，就清除旧的“返回空闲状态”的定时器
                                if (this.idleTimer !== -1) {
                                    clearTimeout(this.idleTimer);
                                    this.idleTimer = -1;
                                }
                                if (direction !== 'stop') {
                                    // 并且当前状态是“空闲中”，则立即切换为“运行中”
                                    if (this.data.statusText === '空闲中') {
                                        this.data.statusText = '运行中';
                                    }
                                }
                                //如果遥感已回到中心 (方向是 'stop')
                                else {
                                    // 并且当前状态是“运行中”，则启动一个30秒的倒计时
                                    if (this.data.statusText === '运行中') {
                                        this.idleTimer = setTimeout(() => {
                                            // 30秒后，如果状态仍然是“运行中”，则切换回“空闲中”
                                            if (this.data.statusText === '运行中') {
                                                this.data.statusText = '空闲中';
                                            }
                                        }, 10000); // 30000毫秒 = 30秒
                                    }
                                }
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        //传入尺寸
                        rockerBaseSize: this.rockerBaseSize,
                        rockerHandleSize: this.rockerHandleSize
                    });
                }
            }, { name: "RockerControl" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.position({ top: 10, right: 20 });
            __Common__.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
            __Common__.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new ActionButton(this, {
                        icon: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        click: () => {
                            Context.animateTo({
                                duration: 800,
                                curve: Curve.EaseInOut
                            }, () => {
                                // 1. 先更新状态
                                this.isInfoCardVisible = !this.isInfoCardVisible;
                                // 2. 根据更新后的状态，修改所有需要动画的属性
                                // 所有这些变更都会被这一个 animateTo 捕获并同时应用动画
                                if (this.isInfoCardVisible) {
                                    // 折叠视图的状态
                                    this.controlCardWidth = '35%';
                                    this.rockerBaseSize = 180;
                                    this.rockerHandleSize = 50;
                                }
                                else {
                                    // 展开视图的状态
                                    this.controlCardWidth = '65%';
                                    this.rockerBaseSize = 250;
                                    this.rockerHandleSize = 80;
                                }
                            });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Dolly.ets", line: 404, col: 13 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            click: () => {
                                Context.animateTo({
                                    duration: 800,
                                    curve: Curve.EaseInOut
                                }, () => {
                                    // 1. 先更新状态
                                    this.isInfoCardVisible = !this.isInfoCardVisible;
                                    // 2. 根据更新后的状态，修改所有需要动画的属性
                                    // 所有这些变更都会被这一个 animateTo 捕获并同时应用动画
                                    if (this.isInfoCardVisible) {
                                        // 折叠视图的状态
                                        this.controlCardWidth = '35%';
                                        this.rockerBaseSize = 180;
                                        this.rockerHandleSize = 50;
                                    }
                                    else {
                                        // 展开视图的状态
                                        this.controlCardWidth = '65%';
                                        this.rockerBaseSize = 250;
                                        this.rockerHandleSize = 80;
                                    }
                                });
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "ActionButton" });
        }
        __Common__.pop();
        Column.pop();
        // 小车控制卡片——遥感控制器
        Stack.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isPreviewVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildImagePreview.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class RockerControl extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__handleX = new ObservedPropertySimplePU(0, this, "handleX");
        this.__handleY = new ObservedPropertySimplePU(0, this, "handleY");
        this.onDirectionChange = () => { };
        this.__rockerBaseSize = new SynchedPropertySimpleOneWayPU(params.rockerBaseSize, this, "rockerBaseSize");
        this.__rockerHandleSize = new SynchedPropertySimpleOneWayPU(params.rockerHandleSize, this, "rockerHandleSize");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RockerControl_Params) {
        if (params.handleX !== undefined) {
            this.handleX = params.handleX;
        }
        if (params.handleY !== undefined) {
            this.handleY = params.handleY;
        }
        if (params.onDirectionChange !== undefined) {
            this.onDirectionChange = params.onDirectionChange;
        }
        if (params.rockerBaseSize === undefined) {
            this.__rockerBaseSize.set(250);
        }
        if (params.rockerHandleSize === undefined) {
            this.__rockerHandleSize.set(80);
        }
    }
    updateStateVars(params: RockerControl_Params) {
        this.__rockerBaseSize.reset(params.rockerBaseSize);
        this.__rockerHandleSize.reset(params.rockerHandleSize);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__handleX.purgeDependencyOnElmtId(rmElmtId);
        this.__handleY.purgeDependencyOnElmtId(rmElmtId);
        this.__rockerBaseSize.purgeDependencyOnElmtId(rmElmtId);
        this.__rockerHandleSize.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__handleX.aboutToBeDeleted();
        this.__handleY.aboutToBeDeleted();
        this.__rockerBaseSize.aboutToBeDeleted();
        this.__rockerHandleSize.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __handleX: ObservedPropertySimplePU<number>;
    get handleX() {
        return this.__handleX.get();
    }
    set handleX(newValue: number) {
        this.__handleX.set(newValue);
    }
    private __handleY: ObservedPropertySimplePU<number>;
    get handleY() {
        return this.__handleY.get();
    }
    set handleY(newValue: number) {
        this.__handleY.set(newValue);
    }
    private onDirectionChange: (direction: string) => void;
    private __rockerBaseSize: SynchedPropertySimpleOneWayPU<number>;
    get rockerBaseSize() {
        return this.__rockerBaseSize.get();
    }
    set rockerBaseSize(newValue: number) {
        this.__rockerBaseSize.set(newValue);
    }
    private __rockerHandleSize: SynchedPropertySimpleOneWayPU<number>;
    get rockerHandleSize() {
        return this.__rockerHandleSize.get();
    }
    set rockerHandleSize(newValue: number) {
        this.__rockerHandleSize.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            Context.animation({ duration: 800, curve: Curve.EaseInOut });
            Stack.width(this.rockerBaseSize);
            Stack.height(this.rockerBaseSize);
            Context.animation(null);
            Gesture.create(GesturePriority.Low);
            PanGesture.create();
            PanGesture.onActionUpdate((event: GestureEvent) => {
                let x = event.offsetX;
                let y = event.offsetY;
                const R = this.rockerBaseSize / 2;
                const distance = Math.sqrt(x * x + y * y);
                if (distance > R) {
                    x = (x / distance) * R;
                    y = (y / distance) * R;
                }
                this.handleX = x;
                this.handleY = y;
                this.updateDirection(x, y);
            });
            PanGesture.onActionEnd(() => {
                this.handleX = 0;
                this.handleY = 0;
                this.updateDirection(0, 0);
            });
            PanGesture.onActionCancel(() => {
                this.handleX = 0;
                this.handleY = 0;
                this.updateDirection(0, 0);
            });
            PanGesture.pop();
            Gesture.pop();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Context.animation({ duration: 800, curve: Curve.EaseInOut });
            Circle.width(this.rockerBaseSize);
            Circle.height(this.rockerBaseSize);
            Circle.fill('rgba(255, 255, 255, 0.16)');
            Context.animation(null);
        }, Circle);
        this.DirectionIcons.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Context.animation({
                duration: 100,
                curve: Curve.EaseOut,
                playMode: PlayMode.Normal
            });
            Circle.width(this.rockerHandleSize);
            Circle.height(this.rockerHandleSize);
            Circle.fill('rgba(255, 255, 255, 0.25)');
            Circle.offset({ x: this.handleX, y: this.handleY });
            Context.animation(null);
        }, Circle);
        Stack.pop();
    }
    updateDirection(x: number, y: number) {
        const deadZone = this.rockerBaseSize * 0.1;
        if (Math.abs(x) < deadZone && Math.abs(y) < deadZone) {
            this.onDirectionChange('stop');
            return;
        }
        const angle = Math.atan2(y, x) * (180 / Math.PI);
        if (angle > -135 && angle < -45) {
            this.onDirectionChange('up');
        }
        else if (angle > 45 && angle < 135) {
            this.onDirectionChange('down');
        }
        else if (angle > -45 && angle < 45) {
            this.onDirectionChange('right');
        }
        else {
            this.onDirectionChange('left');
        }
    }
    DirectionIcons(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777243, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(25);
            Image.height(25);
            Image.opacity(0.4);
            Image.offset({ y: -this.rockerBaseSize / 2 + 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777239, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(25);
            Image.height(25);
            Image.opacity(0.4);
            Image.offset({ y: this.rockerBaseSize / 2 - 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777241, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(25);
            Image.height(25);
            Image.opacity(0.4);
            Image.offset({ x: -this.rockerBaseSize / 2 + 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777242, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(25);
            Image.height(25);
            Image.opacity(0.4);
            Image.offset({ x: this.rockerBaseSize / 2 - 20 });
        }, Image);
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class ActionButton extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.icon = undefined;
        this.click = undefined;
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ActionButton_Params) {
        if (params.icon !== undefined) {
            this.icon = params.icon;
        }
        if (params.click !== undefined) {
            this.click = params.click;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
    }
    updateStateVars(params: ActionButton_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isPressed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private icon: Resource;
    private click: () => void;
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Context.animation({ duration: 150, curve: Curve.EaseOut });
            Row.width(44);
            Row.height(44);
            Row.backgroundColor('rgba(255, 255, 255, 0.15)');
            Row.borderRadius(22);
            Row.justifyContent(FlexAlign.Center);
            Row.scale({ x: this.isPressed ? 0.9 : 1.0, y: this.isPressed ? 0.9 : 1.0 });
            Row.opacity(this.isPressed ? 0.7 : 1.0);
            Context.animation(null);
            Row.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.isPressed = true;
                }
                if (event.type === TouchType.Up) {
                    this.isPressed = false;
                    this.click();
                }
                if (event.type === TouchType.Cancel) {
                    this.isPressed = false;
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.icon);
            Image.width(22);
            Image.height(22);
            Image.fillColor(Color.White);
        }, Image);
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
