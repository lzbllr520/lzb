if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ActionButton_Params {
    icon?: Resource;
    click?: () => void;
    isPressed?: boolean;
}
interface RobotArm3_Params {
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    data?: RobotArmState;
    avatar?: Resource;
    button_icon_size?: number;
    button_size?: number;
    catch_size_height?: number;
    catch_size_width?: string;
    catch_font_size?: number;
    holdTimerX?: number;
    holdTimerY?: number;
    holdTimerZ?: number;
    isPressed?: boolean;
    isHover?: boolean;
    idleTimer?: number;
    isPreviewVisible?: boolean;
}
import type { RobotArmState } from '../../model/RobotArmState';
export class RobotArm3 extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.addLog = () => { };
        this.__data = new SynchedPropertyObjectTwoWayPU(params.data, this, "data");
        this.__avatar = new SynchedPropertyObjectTwoWayPU(params.avatar, this, "avatar");
        this.__button_icon_size = new ObservedPropertySimplePU(28, this, "button_icon_size");
        this.__button_size = new ObservedPropertySimplePU(50, this, "button_size");
        this.__catch_size_height = new ObservedPropertySimplePU(60, this, "catch_size_height");
        this.__catch_size_width = new ObservedPropertySimplePU('50%', this, "catch_size_width");
        this.__catch_font_size = new ObservedPropertySimplePU(22, this, "catch_font_size");
        this.__holdTimerX = new ObservedPropertySimplePU(-1, this, "holdTimerX");
        this.__holdTimerY = new ObservedPropertySimplePU(-1, this, "holdTimerY");
        this.__holdTimerZ = new ObservedPropertySimplePU(-1, this, "holdTimerZ");
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.__isHover = new ObservedPropertySimplePU(false, this, "isHover");
        this.__idleTimer = new ObservedPropertySimplePU(-1, this, "idleTimer");
        this.__isPreviewVisible = new ObservedPropertySimplePU(false, this, "isPreviewVisible");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RobotArm3_Params) {
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
        if (params.button_icon_size !== undefined) {
            this.button_icon_size = params.button_icon_size;
        }
        if (params.button_size !== undefined) {
            this.button_size = params.button_size;
        }
        if (params.catch_size_height !== undefined) {
            this.catch_size_height = params.catch_size_height;
        }
        if (params.catch_size_width !== undefined) {
            this.catch_size_width = params.catch_size_width;
        }
        if (params.catch_font_size !== undefined) {
            this.catch_font_size = params.catch_font_size;
        }
        if (params.holdTimerX !== undefined) {
            this.holdTimerX = params.holdTimerX;
        }
        if (params.holdTimerY !== undefined) {
            this.holdTimerY = params.holdTimerY;
        }
        if (params.holdTimerZ !== undefined) {
            this.holdTimerZ = params.holdTimerZ;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
        if (params.isHover !== undefined) {
            this.isHover = params.isHover;
        }
        if (params.idleTimer !== undefined) {
            this.idleTimer = params.idleTimer;
        }
        if (params.isPreviewVisible !== undefined) {
            this.isPreviewVisible = params.isPreviewVisible;
        }
    }
    updateStateVars(params: RobotArm3_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__data.purgeDependencyOnElmtId(rmElmtId);
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
        this.__button_icon_size.purgeDependencyOnElmtId(rmElmtId);
        this.__button_size.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_size_height.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_size_width.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_font_size.purgeDependencyOnElmtId(rmElmtId);
        this.__holdTimerX.purgeDependencyOnElmtId(rmElmtId);
        this.__holdTimerY.purgeDependencyOnElmtId(rmElmtId);
        this.__holdTimerZ.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isHover.purgeDependencyOnElmtId(rmElmtId);
        this.__idleTimer.purgeDependencyOnElmtId(rmElmtId);
        this.__isPreviewVisible.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__data.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        this.__button_icon_size.aboutToBeDeleted();
        this.__button_size.aboutToBeDeleted();
        this.__catch_size_height.aboutToBeDeleted();
        this.__catch_size_width.aboutToBeDeleted();
        this.__catch_font_size.aboutToBeDeleted();
        this.__holdTimerX.aboutToBeDeleted();
        this.__holdTimerY.aboutToBeDeleted();
        this.__holdTimerZ.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        this.__isHover.aboutToBeDeleted();
        this.__idleTimer.aboutToBeDeleted();
        this.__isPreviewVisible.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private addLog: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    private __data: SynchedPropertySimpleOneWayPU<RobotArmState>;
    get data() {
        return this.__data.get();
    }
    set data(newValue: RobotArmState) {
        this.__data.set(newValue);
    }
    private __avatar: SynchedPropertySimpleOneWayPU<Resource>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(newValue: Resource) {
        this.__avatar.set(newValue);
    }
    // 基础信息卡片和控制卡片联动动画控制器
    private __button_icon_size: ObservedPropertySimplePU<number>;
    get button_icon_size() {
        return this.__button_icon_size.get();
    }
    set button_icon_size(newValue: number) {
        this.__button_icon_size.set(newValue);
    }
    private __button_size: ObservedPropertySimplePU<number>;
    get button_size() {
        return this.__button_size.get();
    }
    set button_size(newValue: number) {
        this.__button_size.set(newValue);
    }
    private __catch_size_height: ObservedPropertySimplePU<number>;
    get catch_size_height() {
        return this.__catch_size_height.get();
    }
    set catch_size_height(newValue: number) {
        this.__catch_size_height.set(newValue);
    }
    private __catch_size_width: ObservedPropertySimplePU<string>;
    get catch_size_width() {
        return this.__catch_size_width.get();
    }
    set catch_size_width(newValue: string) {
        this.__catch_size_width.set(newValue);
    }
    private __catch_font_size: ObservedPropertySimplePU<number>;
    get catch_font_size() {
        return this.__catch_font_size.get();
    }
    set catch_font_size(newValue: number) {
        this.__catch_font_size.set(newValue);
    }
    private __holdTimerX: ObservedPropertySimplePU<number>;
    get holdTimerX() {
        return this.__holdTimerX.get();
    }
    set holdTimerX(newValue: number) {
        this.__holdTimerX.set(newValue);
    }
    private increaseSpeedX() {
        if (this.data.xValue < 100) {
            this.data.xValue++;
        }
        else {
            if (this.holdTimerX !== -1) {
                clearInterval(this.holdTimerX);
                this.holdTimerX = -1;
            }
        }
    }
    // 减少速度的辅助方法
    private decreaseSpeedX() {
        if (this.data.xValue > -100) {
            this.data.xValue--;
        }
        else {
            // 如果已达最小值，清除定时器
            if (this.holdTimerX !== -1) {
                clearInterval(this.holdTimerX);
                this.holdTimerX = -1;
            }
        }
    }
    private __holdTimerY: ObservedPropertySimplePU<number>;
    get holdTimerY() {
        return this.__holdTimerY.get();
    }
    set holdTimerY(newValue: number) {
        this.__holdTimerY.set(newValue);
    }
    private increaseSpeedY() {
        if (this.data.yValue < 100) {
            this.data.yValue++;
        }
        else {
            if (this.holdTimerY !== -1) {
                clearInterval(this.holdTimerY);
                this.holdTimerY = -1;
            }
        }
    }
    // 减少速度的辅助方法
    private decreaseSpeedY() {
        if (this.data.yValue > -100) {
            this.data.yValue--;
        }
        else {
            // 如果已达最小值，清除定时器
            if (this.holdTimerY !== -1) {
                clearInterval(this.holdTimerY);
                this.holdTimerY = -1;
            }
        }
    }
    private __holdTimerZ: ObservedPropertySimplePU<number>;
    get holdTimerZ() {
        return this.__holdTimerZ.get();
    }
    set holdTimerZ(newValue: number) {
        this.__holdTimerZ.set(newValue);
    }
    private increaseSpeedZ() {
        if (this.data.zValue < 100) {
            this.data.zValue++;
        }
        else {
            if (this.holdTimerZ !== -1) {
                clearInterval(this.holdTimerZ);
                this.holdTimerZ = -1;
            }
        }
    }
    // 减少速度的辅助方法
    private decreaseSpeedZ() {
        if (this.data.zValue > -100) {
            this.data.zValue--;
        }
        else {
            // 如果已达最小值，清除定时器
            if (this.holdTimerZ !== -1) {
                clearInterval(this.holdTimerZ);
                this.holdTimerZ = -1;
            }
        }
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
        if (this.isHover && !this.isPressed) {
            return {
                radius: 15,
                color: 'rgba(0, 0, 0, 0.25)',
                offsetX: 0,
                offsetY: 8
            };
        }
        return {
            radius: 5,
            color: 'rgba(0, 0, 0, 0.15)',
            offsetX: 2,
            offsetY: 2
        };
    }
    private getScaleValue(): number {
        if (this.isPressed) {
            return 0.95;
        }
        if (this.isHover) {
            return 1.05;
        }
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
    private __idleTimer: ObservedPropertySimplePU<number>;
    get idleTimer() {
        return this.__idleTimer.get();
    }
    set idleTimer(newValue: number) {
        this.__idleTimer.set(newValue);
    }
    onDisappear() {
        if (this.holdTimerX !== -1)
            clearInterval(this.holdTimerX);
        if (this.holdTimerY !== -1)
            clearInterval(this.holdTimerY);
        if (this.holdTimerZ !== -1)
            clearInterval(this.holdTimerZ);
        if (this.idleTimer !== -1)
            clearTimeout(this.idleTimer);
    }
    private activateArm() {
        if (this.data.statusText === '空闲中') {
            this.data.statusText = '运行中';
        }
    }
    private resetIdleTimer() {
        if (this.idleTimer !== -1) {
            clearTimeout(this.idleTimer);
        }
        if (this.data.statusText === '运行中') {
            this.idleTimer = setTimeout(() => {
                if (this.data.statusText === '运行中') {
                    this.data.statusText = '空闲中';
                }
            }, 10000);
        }
    }
    private __isPreviewVisible: ObservedPropertySimplePU<boolean>;
    get isPreviewVisible() {
        return this.__isPreviewVisible.get();
    }
    set isPreviewVisible(newValue: boolean) {
        this.__isPreviewVisible.set(newValue);
    }
    private buildImagePreview(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.alignContent(Alignment.Center);
            Stack.transition(TransitionEffect.OPACITY.animation({ duration: 250, curve: Curve.EaseInOut }));
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0, 0, 0, 0.7)');
            Column.onClick(() => {
                this.isPreviewVisible = false;
            });
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777260, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width('50%');
            Image.objectFit(ImageFit.Contain);
            Image.borderRadius(16);
            Image.hitTestBehavior(HitTestMode.Block);
        }, Image);
        Stack.pop();
    }
    // 新增：用于构建“区域A”的UI
    private buildRegionA(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.clip(true);
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
            Text.create('这里是区域A');
            Text.fontColor(Color.White);
            Text.fontSize(24);
        }, Text);
        Text.pop();
        Column.pop();
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
            if (!this.data.isInfoCardVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //基础信息展示
                        Stack.create();
                        //基础信息展示
                        Stack.width('30%');
                        //基础信息展示
                        Stack.height('100%');
                        //基础信息展示
                        Stack.clip(true);
                        //基础信息展示
                        Stack.offset({ x: this.data.isInfoCardVisible ? '-120%' : 0 });
                        //基础信息展示
                        Stack.opacity(this.data.isInfoCardVisible ? 0 : 1);
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
                        //... (内容与原来一致，此处省略以保持简洁)
                        //模型展示
                        Column.create();
                        //... (内容与原来一致，此处省略以保持简洁)
                        //模型展示
                        Column.width('90%');
                        //... (内容与原来一致，此处省略以保持简洁)
                        //模型展示
                        Column.height('30%');
                        //... (内容与原来一致，此处省略以保持简洁)
                        //模型展示
                        Column.alignItems(HorizontalAlign.Center);
                        //... (内容与原来一致，此处省略以保持简洁)
                        //模型展示
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.avatar);
                        Context.animation({ duration: 200, curve: Curve.EaseInOut });
                        Image.width(150);
                        Image.height(120);
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
                    //... (内容与原来一致，此处省略以保持简洁)
                    //模型展示
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //信息展示
                        Column.create({ space: 20 });
                        //信息展示
                        Column.width('100%');
                        //信息展示
                        Column.height('70%');
                        //信息展示
                        Column.alignItems(HorizontalAlign.Center);
                        //信息展示
                        Column.justifyContent(FlexAlign.Center);
                        //信息展示
                        Column.padding({ left: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂名称
                        Row.create();
                        //机械臂名称
                        Row.width('100%');
                        //机械臂名称
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂名称
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
                        Text.create('机械臂003');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    //机械臂名称
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂状态
                        Row.create();
                        //机械臂状态
                        Row.width('100%');
                        //机械臂状态
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂状态
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('运作状态：');
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
                    //机械臂状态
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //末端状态
                        Row.create();
                        //末端状态
                        Row.width('100%');
                        //末端状态
                        Row.justifyContent(FlexAlign.Center);
                        //末端状态
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('末端状态：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(20);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.endStatusText);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    //末端状态
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //负载状态
                        Row.create();
                        //负载状态
                        Row.width('100%');
                        //负载状态
                        Row.justifyContent(FlexAlign.Center);
                        //负载状态
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
                    //负载状态
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //控制按钮
                        Row.create();
                        Context.animation({ duration: 150, curve: Curve.EaseOut });
                        //控制按钮
                        Row.width('80%');
                        //控制按钮
                        Row.height(50);
                        //控制按钮
                        Row.padding(10);
                        //控制按钮
                        Row.justifyContent(FlexAlign.Center);
                        //控制按钮
                        Row.alignItems(VerticalAlign.Center);
                        //控制按钮
                        Row.backgroundColor(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 'rgba(255, 80, 80, 0.4)' : 'rgba(0, 200, 83, 0.5)');
                        //控制按钮
                        Row.borderRadius(25);
                        //控制按钮
                        Row.border({
                            width: 1,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //控制按钮
                        Row.margin({ top: 20 });
                        //控制按钮
                        Row.shadow(this.getShadowOptions());
                        //控制按钮
                        Row.scale({
                            x: this.getScaleValue(),
                            y: this.getScaleValue()
                        });
                        //控制按钮
                        Row.opacity(this.isPressed ? 0.8 : 1.0);
                        //控制按钮
                        Row.onHover((isHover: boolean) => {
                            this.isHover = isHover;
                        });
                        Gesture.create(GesturePriority.Low);
                        LongPressGesture.create();
                        LongPressGesture.pop();
                        Gesture.pop();
                        //控制按钮
                        Row.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.isPressed = true;
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                this.isPressed = false;
                                // 1. 判断当前状态，准备不同的对话框信息
                                const isCurrentlyRunning = this.data.statusText === '运行中' || this.data.statusText === '空闲中';
                                const message = isCurrentlyRunning ? '您确定要关闭三号机械臂吗？' : '您确定要启动三号机械臂吗？';
                                // 2. 显示确认对话框
                                AlertDialog.show({
                                    title: '操作确认',
                                    message: message,
                                    autoCancel: true,
                                    alignment: DialogAlignment.Center,
                                    buttons: [
                                        {
                                            value: '取消',
                                            action: () => {
                                                // 用户点击取消，不做任何事
                                                console.info('操作已取消');
                                            }
                                        },
                                        {
                                            value: '确认',
                                            fontColor: Color.Red,
                                            action: () => {
                                                if (isCurrentlyRunning) {
                                                    this.data.statusText = '离线中';
                                                    this.data.endStatusText = '释放';
                                                    this.data.xValue = 0;
                                                    this.data.yValue = 0;
                                                    this.data.zValue = 0;
                                                    this.showSystemToast('关闭成功');
                                                    //关闭时清除定时器
                                                    if (this.idleTimer !== -1) {
                                                        clearTimeout(this.idleTimer);
                                                        this.idleTimer = -1;
                                                    }
                                                    this.addLog('warning', '关闭了三号传送带，停止了对三号传送带的操作。', true);
                                                }
                                                else {
                                                    this.data.statusText = '空闲中';
                                                    this.showSystemToast('启动成功');
                                                    this.addLog('info', '启动了三号传送带，要对三号传送带进行操作。', true);
                                                }
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
                    //控制按钮
                    Row.pop();
                    //信息展示
                    Column.pop();
                    Column.pop();
                    //基础信息展示
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //地图信息卡片
                        Stack.create();
                        //地图信息卡片
                        Stack.width(this.data.mapCardWidth);
                        //地图信息卡片
                        Stack.height('100%');
                        //地图信息卡片
                        Stack.clip(true);
                        //地图信息卡片
                        Stack.offset({ x: this.data.isInfoCardVisible ? 0 : '-120%' });
                        //地图信息卡片
                        Stack.opacity(this.data.isInfoCardVisible ? 1 : 0);
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
                        Text.create('机械臂动态位置面板');
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
            //控制区域
            Stack.create({ alignContent: Alignment.TopEnd });
            //控制区域
            Stack.width(this.data.controlCardWidth);
            //控制区域
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 根据 isRegionAVisible 的值，决定显示控制面板还是区域A
            if (this.data.isRegionAVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildRegionA.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 原有的控制面板UI
                        Column.create({ space: 30 });
                        // 原有的控制面板UI
                        Column.justifyContent(FlexAlign.Center);
                        // 原有的控制面板UI
                        Column.width('100%');
                        // 原有的控制面板UI
                        Column.height('100%');
                        // 原有的控制面板UI
                        Column.backdropBlur(12);
                        // 原有的控制面板UI
                        Column.backgroundColor('rgba(10, 10, 15, 0.3)');
                        // 原有的控制面板UI
                        Column.borderRadius(16);
                        // 原有的控制面板UI
                        Column.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.15)'
                        });
                        // 原有的控制面板UI
                        Column.shadow({
                            radius: 30,
                            color: 'rgba(173, 216, 230, 0.2)',
                            offsetX: 0,
                            offsetY: 0
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //控制x轴（左右）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        Gesture.create(GesturePriority.Low);
                        LongPressGesture.create();
                        LongPressGesture.pop();
                        Gesture.pop();
                        //控制x轴（左右）
                        Row.width('90%');
                        //控制x轴（左右）
                        Row.height(60);
                        //控制x轴（左右）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //控制x轴（左右）
                        Row.margin({ top: 20 });
                        //控制x轴（左右）
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //控制x轴（左右）
                        Row.borderRadius(30);
                        //控制x轴（左右）
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //控制x轴（左右）
                        Row.backdropBlur(8);
                        //控制x轴（左右）
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        //控制x轴（左右）
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //控制x轴（左右）
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm(); //激活机械臂
                                this.decreaseSpeedX();
                                this.holdTimerX = setInterval(() => { this.decreaseSpeedX(); }, 120);
                                this.resetIdleTimer(); //重置定时器
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerX);
                                this.holdTimerX = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777249, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('左');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.xValue + '');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(85);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('右');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.increaseSpeedX();
                                this.holdTimerX = setInterval(() => { this.increaseSpeedX(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerX);
                                this.holdTimerX = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777259, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //控制x轴（左右）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //y控制（前后）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        Gesture.create(GesturePriority.Low);
                        LongPressGesture.create();
                        LongPressGesture.pop();
                        Gesture.pop();
                        //y控制（前后）
                        Row.width('90%');
                        //y控制（前后）
                        Row.height(60);
                        //y控制（前后）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //y控制（前后）
                        Row.margin({ top: 20 });
                        //y控制（前后）
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //y控制（前后）
                        Row.borderRadius(30);
                        //y控制（前后）
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //y控制（前后）
                        Row.backdropBlur(8);
                        //y控制（前后）
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        //y控制（前后）
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //y控制（前后）
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.decreaseSpeedY();
                                this.holdTimerY = setInterval(() => { this.decreaseSpeedY(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerY);
                                this.holdTimerY = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777249, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('前');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.yValue + '');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(85);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('后');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.increaseSpeedY();
                                this.holdTimerY = setInterval(() => { this.increaseSpeedY(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerY);
                                this.holdTimerY = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777259, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //y控制（前后）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //z轴控制（上下）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        Gesture.create(GesturePriority.Low);
                        LongPressGesture.create();
                        LongPressGesture.pop();
                        Gesture.pop();
                        //z轴控制（上下）
                        Row.width('90%');
                        //z轴控制（上下）
                        Row.height(60);
                        //z轴控制（上下）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //z轴控制（上下）
                        Row.margin({ top: 20 });
                        //z轴控制（上下）
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //z轴控制（上下）
                        Row.borderRadius(30);
                        //z轴控制（上下）
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //z轴控制（上下）
                        Row.backdropBlur(8);
                        //z轴控制（上下）
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        //z轴控制（上下）
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //z轴控制（上下）
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.decreaseSpeedZ();
                                this.holdTimerZ = setInterval(() => { this.decreaseSpeedZ(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerZ);
                                this.holdTimerZ = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777249, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('上');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.zValue + '');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(85);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('下');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.increaseSpeedZ();
                                this.holdTimerZ = setInterval(() => { this.increaseSpeedZ(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerZ);
                                this.holdTimerZ = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777259, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //z轴控制（上下）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //控制末端的释放和抓取
                        Button.createWithChild();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //控制末端的释放和抓取
                        Button.width(this.catch_size_width);
                        //控制末端的释放和抓取
                        Button.height(this.catch_size_height);
                        //控制末端的释放和抓取
                        Button.onClick(() => {
                            this.activateArm();
                            // 切换末端状态
                            if (this.data.endStatusText === '释放') {
                                this.data.endStatusText = '抓取';
                                this.showSystemToast('末端已抓取');
                            }
                            else {
                                this.data.endStatusText = '释放';
                                this.showSystemToast('末端已释放');
                            }
                            this.resetIdleTimer();
                        });
                        //控制末端的释放和抓取
                        Button.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //控制末端的释放和抓取
                        Button.borderRadius(30);
                        //控制末端的释放和抓取
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //控制末端的释放和抓取
                        Button.backdropBlur(8);
                        //控制末端的释放和抓取
                        Button.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8);
                        //控制末端的释放和抓取
                        Button.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //控制末端的释放和抓取
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.justifyContent(FlexAlign.Center);
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 根据状态显示不同文本
                        Text.create(this.data.endStatusText === '释放' ? '点击抓取' : '点击释放');
                        // 根据状态显示不同文本
                        Text.fontSize(this.catch_font_size);
                        // 根据状态显示不同文本
                        Text.fontWeight(FontWeight.Bold);
                        // 根据状态显示不同文本
                        Text.fontColor(Color.White);
                    }, Text);
                    // 根据状态显示不同文本
                    Text.pop();
                    Row.pop();
                    //控制末端的释放和抓取
                    Button.pop();
                    // 原有的控制面板UI
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.position({ top: 10, right: 74 });
            __Common__.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
            __Common__.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 新增：切换按钮
                    ActionButton(this, {
                        // 请替换为您的图标资源
                        icon: { "id": 16777230, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        click: () => {
                            Context.animateTo({ duration: 800, curve: Curve.EaseInOut }, () => {
                                if (this.data.isInfoCardVisible) { // 当前是分屏模式
                                    // 如果已经是45/45的A区域模式，则切换回65/30的控制模式
                                    if (this.data.controlCardWidth === '45%') {
                                        this.data.controlCardWidth = '30%';
                                        this.data.mapCardWidth = '65%';
                                        this.data.isRegionAVisible = false;
                                    }
                                    else { // 否则，从65/30的控制模式切换至45/45的A区域模式
                                        this.data.controlCardWidth = '45%';
                                        this.data.mapCardWidth = '45%';
                                        this.data.isRegionAVisible = true;
                                    }
                                }
                                else { // 当前是默认模式（60%控制卡片）
                                    // 直接在60%的区域内切换显示区域A
                                    this.data.isRegionAVisible = !this.data.isRegionAVisible;
                                }
                            });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/RobotArm3.ets", line: 877, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            // 请替换为您的图标资源
                            icon: { "id": 16777230, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            click: () => {
                                Context.animateTo({ duration: 800, curve: Curve.EaseInOut }, () => {
                                    if (this.data.isInfoCardVisible) { // 当前是分屏模式
                                        // 如果已经是45/45的A区域模式，则切换回65/30的控制模式
                                        if (this.data.controlCardWidth === '45%') {
                                            this.data.controlCardWidth = '30%';
                                            this.data.mapCardWidth = '65%';
                                            this.data.isRegionAVisible = false;
                                        }
                                        else { // 否则，从65/30的控制模式切换至45/45的A区域模式
                                            this.data.controlCardWidth = '45%';
                                            this.data.mapCardWidth = '45%';
                                            this.data.isRegionAVisible = true;
                                        }
                                    }
                                    else { // 当前是默认模式（60%控制卡片）
                                        // 直接在60%的区域内切换显示区域A
                                        this.data.isRegionAVisible = !this.data.isRegionAVisible;
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.position({ top: 10, right: 20 });
            __Common__.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
            __Common__.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 原有的全屏按钮
                    ActionButton(this, {
                        icon: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        click: () => {
                            Context.animateTo({
                                duration: 800,
                                curve: Curve.EaseInOut
                            }, () => {
                                this.data.isInfoCardVisible = !this.data.isInfoCardVisible;
                                // 每次点击全屏按钮时，都重置A区域的状态，以保证逻辑清晰
                                this.data.isRegionAVisible = false;
                                if (this.data.isInfoCardVisible) {
                                    // 进入分屏模式，固定为 65/30 布局
                                    this.data.mapCardWidth = '65%';
                                    this.data.controlCardWidth = '30%';
                                    this.button_size = 30;
                                    this.button_icon_size = 15;
                                    this.catch_size_width = '40%';
                                    this.catch_size_height = 40;
                                    this.catch_font_size = 15;
                                }
                                else {
                                    // 返回默认模式，恢复 60% 控制卡片
                                    this.data.controlCardWidth = '60%';
                                    this.button_size = 50;
                                    this.button_icon_size = 28;
                                    this.catch_size_width = '50%';
                                    this.catch_size_height = 60;
                                    this.catch_font_size = 22;
                                }
                            });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/RobotArm3.ets", line: 906, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            click: () => {
                                Context.animateTo({
                                    duration: 800,
                                    curve: Curve.EaseInOut
                                }, () => {
                                    this.data.isInfoCardVisible = !this.data.isInfoCardVisible;
                                    // 每次点击全屏按钮时，都重置A区域的状态，以保证逻辑清晰
                                    this.data.isRegionAVisible = false;
                                    if (this.data.isInfoCardVisible) {
                                        // 进入分屏模式，固定为 65/30 布局
                                        this.data.mapCardWidth = '65%';
                                        this.data.controlCardWidth = '30%';
                                        this.button_size = 30;
                                        this.button_icon_size = 15;
                                        this.catch_size_width = '40%';
                                        this.catch_size_height = 40;
                                        this.catch_font_size = 15;
                                    }
                                    else {
                                        // 返回默认模式，恢复 60% 控制卡片
                                        this.data.controlCardWidth = '60%';
                                        this.button_size = 50;
                                        this.button_icon_size = 28;
                                        this.catch_size_width = '50%';
                                        this.catch_size_height = 60;
                                        this.catch_font_size = 22;
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
        //控制区域
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
