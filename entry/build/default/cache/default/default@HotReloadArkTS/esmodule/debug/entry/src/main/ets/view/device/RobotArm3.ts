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
    con_width?: string;
    con_height?: number;
    button_icon_size2?: number;
    button_size2?: number;
    catch_size_height2?: number;
    catch_size_width2?: string;
    catch_font_size2?: number;
    con_width2?: string;
    con_height2?: number;
    holdTimerJump?: number;
    holdTimerZZ?: number;
    holdTimerRR?: number;
    isPressed?: boolean;
    isHover?: boolean;
    idleTimer?: number;
    isPreviewVisible?: boolean;
}
import { RobotArmState } from "@normalized:N&&&entry/src/main/ets/model/RobotArmState&";
import { RoboticArmWorkRangeView } from "@normalized:N&&&entry/src/main/ets/components/RoboticArmWorkRangeView&";
export class RobotArm3 extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.addLog = () => { };
        this.__data = new SynchedPropertyObjectTwoWayPU(params.data, this, "data");
        this.__avatar = new SynchedPropertyObjectTwoWayPU(params.avatar, this, "avatar");
        this.__button_icon_size = new ObservedPropertySimplePU(25, this, "button_icon_size");
        this.__button_size = new ObservedPropertySimplePU(40, this, "button_size");
        this.__catch_size_height = new ObservedPropertySimplePU(40, this, "catch_size_height");
        this.__catch_size_width = new ObservedPropertySimplePU('25%', this, "catch_size_width");
        this.__catch_font_size = new ObservedPropertySimplePU(18, this, "catch_font_size");
        this.__con_width = new ObservedPropertySimplePU('90%', this, "con_width");
        this.__con_height = new ObservedPropertySimplePU(50, this, "con_height");
        this.__button_icon_size2 = new ObservedPropertySimplePU(18, this, "button_icon_size2");
        this.__button_size2 = new ObservedPropertySimplePU(28, this, "button_size2");
        this.__catch_size_height2 = new ObservedPropertySimplePU(30, this, "catch_size_height2");
        this.__catch_size_width2 = new ObservedPropertySimplePU('70%', this, "catch_size_width2");
        this.__catch_font_size2 = new ObservedPropertySimplePU(20, this, "catch_font_size2");
        this.__con_width2 = new ObservedPropertySimplePU('95%', this, "con_width2");
        this.__con_height2 = new ObservedPropertySimplePU(40, this, "con_height2");
        this.__holdTimerJump = new ObservedPropertySimplePU(-1, this, "holdTimerJump");
        this.__holdTimerZZ = new ObservedPropertySimplePU(-1, this, "holdTimerZZ");
        this.__holdTimerRR = new ObservedPropertySimplePU(-1, this, "holdTimerRR");
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
        if (params.con_width !== undefined) {
            this.con_width = params.con_width;
        }
        if (params.con_height !== undefined) {
            this.con_height = params.con_height;
        }
        if (params.button_icon_size2 !== undefined) {
            this.button_icon_size2 = params.button_icon_size2;
        }
        if (params.button_size2 !== undefined) {
            this.button_size2 = params.button_size2;
        }
        if (params.catch_size_height2 !== undefined) {
            this.catch_size_height2 = params.catch_size_height2;
        }
        if (params.catch_size_width2 !== undefined) {
            this.catch_size_width2 = params.catch_size_width2;
        }
        if (params.catch_font_size2 !== undefined) {
            this.catch_font_size2 = params.catch_font_size2;
        }
        if (params.con_width2 !== undefined) {
            this.con_width2 = params.con_width2;
        }
        if (params.con_height2 !== undefined) {
            this.con_height2 = params.con_height2;
        }
        if (params.holdTimerJump !== undefined) {
            this.holdTimerJump = params.holdTimerJump;
        }
        if (params.holdTimerZZ !== undefined) {
            this.holdTimerZZ = params.holdTimerZZ;
        }
        if (params.holdTimerRR !== undefined) {
            this.holdTimerRR = params.holdTimerRR;
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
        this.__con_width.purgeDependencyOnElmtId(rmElmtId);
        this.__con_height.purgeDependencyOnElmtId(rmElmtId);
        this.__button_icon_size2.purgeDependencyOnElmtId(rmElmtId);
        this.__button_size2.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_size_height2.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_size_width2.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_font_size2.purgeDependencyOnElmtId(rmElmtId);
        this.__con_width2.purgeDependencyOnElmtId(rmElmtId);
        this.__con_height2.purgeDependencyOnElmtId(rmElmtId);
        this.__holdTimerJump.purgeDependencyOnElmtId(rmElmtId);
        this.__holdTimerZZ.purgeDependencyOnElmtId(rmElmtId);
        this.__holdTimerRR.purgeDependencyOnElmtId(rmElmtId);
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
        this.__con_width.aboutToBeDeleted();
        this.__con_height.aboutToBeDeleted();
        this.__button_icon_size2.aboutToBeDeleted();
        this.__button_size2.aboutToBeDeleted();
        this.__catch_size_height2.aboutToBeDeleted();
        this.__catch_size_width2.aboutToBeDeleted();
        this.__catch_font_size2.aboutToBeDeleted();
        this.__con_width2.aboutToBeDeleted();
        this.__con_height2.aboutToBeDeleted();
        this.__holdTimerJump.aboutToBeDeleted();
        this.__holdTimerZZ.aboutToBeDeleted();
        this.__holdTimerRR.aboutToBeDeleted();
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
    private __con_width: ObservedPropertySimplePU<string>;
    get con_width() {
        return this.__con_width.get();
    }
    set con_width(newValue: string) {
        this.__con_width.set(newValue);
    }
    private __con_height: ObservedPropertySimplePU<number>;
    get con_height() {
        return this.__con_height.get();
    }
    set con_height(newValue: number) {
        this.__con_height.set(newValue);
    }
    private __button_icon_size2: ObservedPropertySimplePU<number>;
    get button_icon_size2() {
        return this.__button_icon_size2.get();
    }
    set button_icon_size2(newValue: number) {
        this.__button_icon_size2.set(newValue);
    }
    private __button_size2: ObservedPropertySimplePU<number>;
    get button_size2() {
        return this.__button_size2.get();
    }
    set button_size2(newValue: number) {
        this.__button_size2.set(newValue);
    }
    private __catch_size_height2: ObservedPropertySimplePU<number>;
    get catch_size_height2() {
        return this.__catch_size_height2.get();
    }
    set catch_size_height2(newValue: number) {
        this.__catch_size_height2.set(newValue);
    }
    private __catch_size_width2: ObservedPropertySimplePU<string>;
    get catch_size_width2() {
        return this.__catch_size_width2.get();
    }
    set catch_size_width2(newValue: string) {
        this.__catch_size_width2.set(newValue);
    }
    private __catch_font_size2: ObservedPropertySimplePU<number>;
    get catch_font_size2() {
        return this.__catch_font_size2.get();
    }
    set catch_font_size2(newValue: number) {
        this.__catch_font_size2.set(newValue);
    }
    private __con_width2: ObservedPropertySimplePU<string>;
    get con_width2() {
        return this.__con_width2.get();
    }
    set con_width2(newValue: string) {
        this.__con_width2.set(newValue);
    }
    private __con_height2: ObservedPropertySimplePU<number>;
    get con_height2() {
        return this.__con_height2.get();
    }
    set con_height2(newValue: number) {
        this.__con_height2.set(newValue);
    }
    private increaseSpeedX() {
        this.data.xValue++;
    }
    private decreaseSpeedX() {
        this.data.xValue--;
    }
    private increaseSpeedY() {
        this.data.yValue++;
    }
    private decreaseSpeedY() {
        this.data.yValue--;
    }
    private increaseSpeedZ() {
        this.data.zValue++;
    }
    private decreaseSpeedZ() {
        this.data.zValue--;
    }
    private increaseSpeedR() {
        this.data.rValue++;
    }
    private decreaseSpeedR() {
        this.data.rValue--;
    }
    private __holdTimerJump: ObservedPropertySimplePU<number>;
    get holdTimerJump() {
        return this.__holdTimerJump.get();
    }
    set holdTimerJump(newValue: number) {
        this.__holdTimerJump.set(newValue);
    }
    private increaseSpeedJump() {
        if (this.data.jumpValue < 100) {
            this.data.jumpValue++;
        }
        else {
            if (this.holdTimerJump !== -1) {
                clearInterval(this.holdTimerJump);
                this.holdTimerJump = -1;
            }
        }
    }
    private decreaseSpeedJump() {
        if (this.data.jumpValue > -100) {
            this.data.jumpValue--;
        }
        else {
            // 如果已达最小值，清除定时器
            if (this.holdTimerJump !== -1) {
                clearInterval(this.holdTimerJump);
                this.holdTimerJump = -1;
            }
        }
    }
    private __holdTimerZZ: ObservedPropertySimplePU<number>;
    get holdTimerZZ() {
        return this.__holdTimerZZ.get();
    }
    set holdTimerZZ(newValue: number) {
        this.__holdTimerZZ.set(newValue);
    }
    private increaseSpeedZZ() {
        if (this.data.zzValue < 100) {
            this.data.zzValue++;
        }
        else {
            if (this.holdTimerZZ !== -1) {
                clearInterval(this.holdTimerZZ);
                this.holdTimerZZ = -1;
            }
        }
    }
    private decreaseSpeedZZ() {
        if (this.data.zzValue > -100) {
            this.data.zzValue--;
        }
        else {
            // 如果已达最小值，清除定时器
            if (this.holdTimerZZ !== -1) {
                clearInterval(this.holdTimerZZ);
                this.holdTimerZZ = -1;
            }
        }
    }
    private __holdTimerRR: ObservedPropertySimplePU<number>;
    get holdTimerRR() {
        return this.__holdTimerRR.get();
    }
    set holdTimerRR(newValue: number) {
        this.__holdTimerRR.set(newValue);
    }
    private increaseSpeedRR() {
        if (this.data.rrValue < 100) {
            this.data.rrValue++;
        }
        else {
            if (this.holdTimerRR !== -1) {
                clearInterval(this.holdTimerRR);
                this.holdTimerRR = -1;
            }
        }
    }
    private decreaseSpeedRR() {
        if (this.data.rrValue > -100) {
            this.data.rrValue--;
        }
        else {
            // 如果已达最小值，清除定时器
            if (this.holdTimerRR !== -1) {
                clearInterval(this.holdTimerRR);
                this.holdTimerRR = -1;
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
        if (this.holdTimerJump !== -1)
            clearInterval(this.holdTimerJump);
        if (this.holdTimerZZ !== -1)
            clearInterval(this.holdTimerZZ);
        if (this.holdTimerRR !== -1)
            clearInterval(this.holdTimerRR);
        // 清理 setTimeout 创建的定时器
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
            Image.create({ "id": 16777262, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width('50%');
            Image.objectFit(ImageFit.Contain);
            Image.borderRadius(16);
            Image.hitTestBehavior(HitTestMode.Block);
        }, Image);
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
                        //模型展示
                        Column.create();
                        //模型展示
                        Column.width('90%');
                        //模型展示
                        Column.height('30%');
                        //模型展示
                        Column.alignItems(HorizontalAlign.Center);
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
                                    Image.create({ "id": 16777232, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                                    Image.width(20);
                                    Image.height(20);
                                    Image.margin({ left: 10 });
                                }, Image);
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create({ "id": 16777257, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                        //控制按钮
                        Row.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.isPressed = true;
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                this.isPressed = false;
                                //判断当前状态，准备不同的对话框信息
                                const isCurrentlyRunning = this.data.statusText === '运行中' || this.data.statusText === '空闲中';
                                const message = isCurrentlyRunning ? '您确定要关闭二号机械臂吗？' : '您确定要启动二号机械臂吗？';
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
                                                    //创建一个新的、干净的 RobotArmState 实例
                                                    const newData = new RobotArmState();
                                                    //将这个全新的、准备好的对象赋值给 this.data
                                                    //因为原来的RobotArmState对象初始值就是关闭的状态
                                                    this.data = newData;
                                                    this.showSystemToast('关闭成功');
                                                    //关闭时清除定时器
                                                    if (this.idleTimer !== -1) {
                                                        clearTimeout(this.idleTimer);
                                                        this.idleTimer = -1;
                                                    }
                                                    this.addLog('warning', '关闭了二号传送带，停止了对二号传送带的操作。', true);
                                                }
                                                else {
                                                    this.data.statusText = '空闲中';
                                                    this.showSystemToast('启动成功');
                                                    this.addLog('info', '启动了二号传送带，要对二号传送带进行操作。', true);
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
                                    Image.create({ "id": 16777268, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                                    Image.create({ "id": 16777267, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                        Stack.create();
                        Stack.width('30%');
                        Stack.height('100%');
                        Stack.clip(true);
                        Stack.offset({ x: this.data.isInfoCardVisible ? 0 : '-120%' });
                        Stack.opacity(this.data.isInfoCardVisible ? 1 : 0);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.SpaceAround);
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
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('高度控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //jump高度控制
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //jump高度控制
                        Row.width(this.con_width2);
                        //jump高度控制
                        Row.height(this.con_height2);
                        //jump高度控制
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //jump高度控制
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //jump高度控制
                        Row.borderRadius(30);
                        //jump高度控制
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //jump高度控制
                        Row.backdropBlur(8);
                        //jump高度控制
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        //jump高度控制
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //jump高度控制
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.decreaseSpeedJump();
                                this.holdTimerJump = setInterval(() => { this.decreaseSpeedJump(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerJump);
                                this.holdTimerJump = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.justifyContent(FlexAlign.Center);
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.jumpValue + ' mm');
                        Text.fontSize(this.button_icon_size2);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(100);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.increaseSpeedJump();
                                this.holdTimerJump = setInterval(() => { this.increaseSpeedJump(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerJump);
                                this.holdTimerJump = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //jump高度控制
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('方位控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        Row.width(this.con_width2);
                        Row.height(this.con_height2);
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        Row.borderRadius(30);
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        Row.backdropBlur(8);
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.decreaseSpeedZZ();
                                this.holdTimerZZ = setInterval(() => { this.decreaseSpeedZZ(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerZZ);
                                this.holdTimerZZ = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('下');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
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
                        Text.create(this.data.zzValue + ' mm');
                        Text.fontSize(this.button_icon_size2);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(100);
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
                        Text.create('上');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.increaseSpeedZZ();
                                this.holdTimerZZ = setInterval(() => { this.increaseSpeedZZ(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerZZ);
                                this.holdTimerZZ = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('角度控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        Row.width(this.con_width2);
                        Row.height(this.con_height2);
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        Row.borderRadius(30);
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        Row.backdropBlur(8);
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.decreaseSpeedRR();
                                this.holdTimerRR = setInterval(() => { this.decreaseSpeedRR(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerRR);
                                this.holdTimerRR = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
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
                        Text.create(this.data.rrValue + ' °');
                        Text.fontSize(this.button_icon_size2);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(100);
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
                        Text.create('+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.activateArm();
                                this.increaseSpeedRR();
                                this.holdTimerRR = setInterval(() => { this.increaseSpeedRR(); }, 120);
                                this.resetIdleTimer();
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                clearInterval(this.holdTimerRR);
                                this.holdTimerRR = -1;
                            }
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //抓取释放按钮
                        Button.createWithChild();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //抓取释放按钮
                        Button.width(this.catch_size_width2);
                        //抓取释放按钮
                        Button.height(this.catch_size_height2);
                        //抓取释放按钮
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
                        //抓取释放按钮
                        Button.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //抓取释放按钮
                        Button.borderRadius(30);
                        //抓取释放按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //抓取释放按钮
                        Button.backdropBlur(12);
                        //抓取释放按钮
                        Button.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8);
                        //抓取释放按钮
                        Button.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //抓取释放按钮
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
                        Text.fontSize(this.catch_font_size2);
                        // 根据状态显示不同文本
                        Text.fontColor(Color.White);
                    }, Text);
                    // 根据状态显示不同文本
                    Text.pop();
                    Row.pop();
                    //抓取释放按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //停止按钮
                        Button.createWithLabel('停止');
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //停止按钮
                        Button.width(this.catch_size_width2);
                        //停止按钮
                        Button.height(this.catch_size_height2);
                        //停止按钮
                        Button.fontSize(this.catch_font_size2);
                        //停止按钮
                        Button.fontColor(Color.White);
                        //停止按钮
                        Button.onClick(() => {
                        });
                        //停止按钮
                        Button.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //停止按钮
                        Button.borderRadius(30);
                        //停止按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //停止按钮
                        Button.backdropBlur(12);
                        //停止按钮
                        Button.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8);
                        //停止按钮
                        Button.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //停止按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    //停止按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //急停按钮
                        Button.createWithLabel('急停');
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //急停按钮
                        Button.width(this.catch_size_width2);
                        //急停按钮
                        Button.height(this.catch_size_height2);
                        //急停按钮
                        Button.fontSize(this.catch_font_size2);
                        //急停按钮
                        Button.fontColor(Color.White);
                        //急停按钮
                        Button.onClick(() => {
                        });
                        //急停按钮
                        Button.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //急停按钮
                        Button.borderRadius(30);
                        //急停按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //急停按钮
                        Button.backdropBlur(12);
                        //急停按钮
                        Button.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8);
                        //急停按钮
                        Button.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //急停按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    //急停按钮
                    Button.pop();
                    Column.pop();
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
            // 根据 isRegionAVisible 的值，决定显示按钮调节还是量角器调节
            if (this.data.isRegionAVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width('100%');
                        Stack.height('100%');
                        Stack.backdropBlur(12);
                        Stack.backgroundColor('rgba(10, 10, 15, 0.3)');
                        Stack.borderRadius(16);
                        Stack.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.15)'
                        });
                        Stack.shadow({
                            radius: 30,
                            color: 'rgba(173, 216, 230, 0.2)',
                            offsetX: 0,
                            offsetY: 0
                        });
                        Stack.clip(true);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RoboticArmWorkRangeView(this, {
                                    data: this.__data,
                                    onActivate: this.activateArm.bind(this)
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/RobotArm3.ets", line: 879, col: 17 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.data,
                                        onActivate: this.activateArm.bind(this)
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "RoboticArmWorkRangeView" });
                    }
                    Column.pop();
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 原有的控制面板UI
                        Column.create({ space: 15 });
                        // 原有的控制面板UI
                        Column.justifyContent(FlexAlign.SpaceAround);
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
                        Row.create();
                        Row.width('100%');
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('方位控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //控制x轴（左右）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //控制x轴（左右）
                        Row.width(this.con_width);
                        //控制x轴（左右）
                        Row.height(this.con_height);
                        //控制x轴（左右）
                        Row.justifyContent(FlexAlign.SpaceBetween);
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
                        Button.onClick(() => {
                            this.activateArm(); //激活机械臂
                            this.decreaseSpeedX();
                            this.resetIdleTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                        Text.create(this.data.xValue + ' mm');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(150);
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
                        Button.onClick(() => {
                            this.activateArm();
                            this.increaseSpeedX();
                            this.resetIdleTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                        //y控制（前后）
                        Row.width(this.con_width);
                        //y控制（前后）
                        Row.height(this.con_height);
                        //y控制（前后）
                        Row.justifyContent(FlexAlign.SpaceBetween);
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
                        Button.onClick(() => {
                            this.activateArm();
                            this.decreaseSpeedY();
                            this.resetIdleTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                        Text.create(this.data.yValue + ' mm');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(150);
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
                        Button.onClick(() => {
                            this.activateArm();
                            this.increaseSpeedY();
                            this.resetIdleTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                        //z轴控制（上下）
                        Row.width(this.con_width);
                        //z轴控制（上下）
                        Row.height(this.con_height);
                        //z轴控制（上下）
                        Row.justifyContent(FlexAlign.SpaceBetween);
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
                        Button.onClick(() => {
                            this.activateArm();
                            this.decreaseSpeedZ();
                            this.resetIdleTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                        Text.create(this.data.zValue + ' mm');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(150);
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
                        Button.onClick(() => {
                            this.activateArm();
                            this.increaseSpeedZ();
                            this.resetIdleTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //z轴控制（上下）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('角度控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //r轴控制（角度）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //r轴控制（角度）
                        Row.width(this.con_width);
                        //r轴控制（角度）
                        Row.height(this.con_height);
                        //r轴控制（角度）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //r轴控制（角度）
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //r轴控制（角度）
                        Row.borderRadius(30);
                        //r轴控制（角度）
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //r轴控制（角度）
                        Row.backdropBlur(8);
                        //r轴控制（角度）
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        //r轴控制（角度）
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //r轴控制（角度）
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
                        Button.onClick(() => {
                            this.activateArm();
                            this.decreaseSpeedR();
                            this.resetIdleTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('-');
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
                        Text.create(this.data.rValue + ' °');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(150);
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
                        Text.create('+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.activateArm();
                            this.increaseSpeedR();
                            this.resetIdleTimer();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //r轴控制（角度）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
                        Row.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('状态控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.SpaceAround);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //抓取释放按钮
                        Button.createWithChild();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //抓取释放按钮
                        Button.width(this.catch_size_width);
                        //抓取释放按钮
                        Button.height(this.catch_size_height);
                        //抓取释放按钮
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
                        //抓取释放按钮
                        Button.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //抓取释放按钮
                        Button.borderRadius(30);
                        //抓取释放按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //抓取释放按钮
                        Button.backdropBlur(12);
                        //抓取释放按钮
                        Button.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8);
                        //抓取释放按钮
                        Button.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //抓取释放按钮
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
                        Text.fontColor(Color.White);
                    }, Text);
                    // 根据状态显示不同文本
                    Text.pop();
                    Row.pop();
                    //抓取释放按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //停止按钮
                        Button.createWithLabel('停止');
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //停止按钮
                        Button.width(this.catch_size_width);
                        //停止按钮
                        Button.height(this.catch_size_height);
                        //停止按钮
                        Button.fontSize(this.catch_font_size);
                        //停止按钮
                        Button.fontColor(Color.White);
                        //停止按钮
                        Button.onClick(() => {
                        });
                        //停止按钮
                        Button.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //停止按钮
                        Button.borderRadius(30);
                        //停止按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //停止按钮
                        Button.backdropBlur(12);
                        //停止按钮
                        Button.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8);
                        //停止按钮
                        Button.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //停止按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    //停止按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //急停按钮
                        Button.createWithLabel('急停');
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //急停按钮
                        Button.width(this.catch_size_width);
                        //急停按钮
                        Button.height(this.catch_size_height);
                        //急停按钮
                        Button.fontSize(this.catch_font_size);
                        //急停按钮
                        Button.fontColor(Color.White);
                        //急停按钮
                        Button.onClick(() => {
                        });
                        //急停按钮
                        Button.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //急停按钮
                        Button.borderRadius(30);
                        //急停按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //急停按钮
                        Button.backdropBlur(12);
                        //急停按钮
                        Button.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.8);
                        //急停按钮
                        Button.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
                        Context.animation(null);
                        //急停按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    //急停按钮
                    Button.pop();
                    Row.pop();
                    // 原有的控制面板UI
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.position({ top: 10, right: 10 });
            __Common__.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
            __Common__.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //切换按钮
                    ActionButton(this, {
                        // 请替换为您的图标资源
                        icon: { "id": 16777231, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        click: () => {
                            Context.animateTo({ duration: 800, curve: Curve.EaseInOut }, () => {
                                this.data.isRegionAVisible = !this.data.isRegionAVisible;
                                this.data.isInfoCardVisible = !this.data.isInfoCardVisible;
                            });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/RobotArm3.ets", line: 1323, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            // 请替换为您的图标资源
                            icon: { "id": 16777231, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            click: () => {
                                Context.animateTo({ duration: 800, curve: Curve.EaseInOut }, () => {
                                    this.data.isRegionAVisible = !this.data.isRegionAVisible;
                                    this.data.isInfoCardVisible = !this.data.isInfoCardVisible;
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
