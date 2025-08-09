if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface DirectionalButton_Params {
    icon?: Resource;
    onPress?: () => void;
    onRelease?: () => void;
    isPressed?: boolean;
}
interface ActionButton_Params {
    icon?: Resource;
    click?: () => void;
    isPressed?: boolean;
}
interface Dolly_Params {
    controller?: WebviewController;
    holdTimers?: Map<string, number>;
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    data?: DollyState;
    isPressed?: boolean;
    isHover?: boolean;
    avatar?: Resource;
    isInfoCardVisible?: boolean;
    controlCardWidth?: string;
    ws?: webSocket.WebSocket | null;
    isWsConnected?: boolean;
    isPreviewVisible?: boolean;
}
import type { DollyState } from "../../model/DollyState";
import webSocket from "@ohos:net.webSocket";
import type { BusinessError as BusinessError } from "@ohos:base";
import webview from "@ohos:web.webview";
//为ROS指令定义三个类型接口
interface TwistVector {
    x: number;
    y: number;
    z: number;
}
interface TwistMessage {
    linear: TwistVector;
    angular: TwistVector;
}
interface RosCommand {
    op: string;
    topic: string;
    msg: TwistMessage;
}
export class Dolly extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.controller = new webview.WebviewController();
        this.__holdTimers = new ObservedPropertyObjectPU(new Map(), this, "holdTimers");
        this.addLog = () => { };
        this.__data = new SynchedPropertyObjectTwoWayPU(params.data, this, "data");
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.__isHover = new ObservedPropertySimplePU(false, this, "isHover");
        this.__avatar = new SynchedPropertyObjectTwoWayPU(params.avatar, this, "avatar");
        this.__isInfoCardVisible = new ObservedPropertySimplePU(false, this, "isInfoCardVisible");
        this.__controlCardWidth = new ObservedPropertySimplePU('65%', this, "controlCardWidth");
        this.ws = null;
        this.__isWsConnected = new ObservedPropertySimplePU(false, this, "isWsConnected");
        this.__isPreviewVisible = new ObservedPropertySimplePU(false, this, "isPreviewVisible");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Dolly_Params) {
        if (params.controller !== undefined) {
            this.controller = params.controller;
        }
        if (params.holdTimers !== undefined) {
            this.holdTimers = params.holdTimers;
        }
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
        if (params.isHover !== undefined) {
            this.isHover = params.isHover;
        }
        if (params.isInfoCardVisible !== undefined) {
            this.isInfoCardVisible = params.isInfoCardVisible;
        }
        if (params.controlCardWidth !== undefined) {
            this.controlCardWidth = params.controlCardWidth;
        }
        if (params.ws !== undefined) {
            this.ws = params.ws;
        }
        if (params.isWsConnected !== undefined) {
            this.isWsConnected = params.isWsConnected;
        }
        if (params.isPreviewVisible !== undefined) {
            this.isPreviewVisible = params.isPreviewVisible;
        }
    }
    updateStateVars(params: Dolly_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__holdTimers.purgeDependencyOnElmtId(rmElmtId);
        this.__data.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isHover.purgeDependencyOnElmtId(rmElmtId);
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
        this.__isInfoCardVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__controlCardWidth.purgeDependencyOnElmtId(rmElmtId);
        this.__isWsConnected.purgeDependencyOnElmtId(rmElmtId);
        this.__isPreviewVisible.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__holdTimers.aboutToBeDeleted();
        this.__data.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        this.__isHover.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        this.__isInfoCardVisible.aboutToBeDeleted();
        this.__controlCardWidth.aboutToBeDeleted();
        this.__isWsConnected.aboutToBeDeleted();
        this.__isPreviewVisible.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private controller: WebviewController;
    private __holdTimers: ObservedPropertyObjectPU<Map<string, number>>;
    get holdTimers() {
        return this.__holdTimers.get();
    }
    set holdTimers(newValue: Map<string, number>) {
        this.__holdTimers.set(newValue);
    }
    //小车运动逻辑
    private startMove(direction: string) {
        // 规则1: 如果【停止】按钮正被按住，任何其他方向键都无效
        if (direction !== '停止' && this.holdTimers.has('停止')) {
            console.info('急停状态中，已忽略其他方向指令');
            return;
        }
        //如果按下的是【停止】按钮
        if (direction === '停止') {
            // 立即清除所有正在运行的方向定时器
            this.holdTimers.forEach((timerId, dir) => {
                if (dir !== '停止') {
                    clearInterval(timerId);
                }
            });
            this.holdTimers.clear(); // 清空Map，只留下【停止】
            // 立即发送停止指令，这是实现“立即”响应的关键
            this.move('停止');
            console.info('急停指令已发送');
            this.data.statusText = '空闲中';
            // 启动一个专门的【停止】定时器，持续发送停止指令以确保最高优先级
            const timerId = setInterval(() => {
                this.move('停止');
            }, 200);
            this.holdTimers.set('停止', timerId);
            return; // 【停止】指令的逻辑到此结束
        }
        const allDirections = ['向前', '向后', '向左', '向右'];
        allDirections.forEach(dir => {
            if (dir !== direction && this.holdTimers.has(dir)) {
                console.info(`方向冲突：正在按下【${direction}】，自动松开【${dir}】。`);
                this.stopMove(dir); // 调用 stopMove 来清除旧方向的定时器
            }
        });
        // 如果当前方向的定时器已在运行，则不重复启动
        if (this.holdTimers.has(direction)) {
            return;
        }
        // 启动新方向的定时器
        this.data.statusText = '运行中';
        this.move(direction);
        const timerId = setInterval(() => {
            this.move(direction);
        }, 100);
        this.holdTimers.set(direction, timerId);
    }
    //小车停止逻辑
    private stopMove(direction: string) {
        // 检查并清除当前松开方向的定时器
        if (this.holdTimers.has(direction)) {
            const timerId = this.holdTimers.get(direction);
            clearInterval(timerId);
            this.holdTimers.delete(direction);
            if (this.holdTimers.size === 0) {
                this.sendCommand(0.0, 0.0);
                this.data.statusText = '空闲中';
                console.info("所有按键已松开，发送最终停止指令。");
            }
        }
    }
    private move(direction: string) {
        const speed = 2.0; // 定义前进/后退的基础速度
        const turnSpeed = 2.0; // 定义左转/右转的基础角速度
        let linearX = 0.0;
        let angularZ = 0.0;
        switch (direction) {
            case '向前':
                linearX = speed;
                break;
            case '向后':
                linearX = -speed;
                break;
            case '向左':
                angularZ = turnSpeed;
                break;
            case '向右':
                angularZ = -turnSpeed;
                break;
            case '停止':
                // '停止'按钮会直接发送 0,0 速度
                linearX = 0.0;
                angularZ = 0.0;
                break;
        }
        this.sendCommand(linearX, angularZ);
    }
    //指令发送函数
    private sendCommand(linearX: number, angularZ: number) {
        if (this.ws && this.isWsConnected) {
            const rosCmd: RosCommand = {
                op: "publish",
                topic: "/cmd_vel",
                msg: {
                    linear: { x: linearX, y: 0.0, z: 0.0 },
                    angular: { x: 0.0, y: 0.0, z: angularZ }
                }
            };
            const cmdJson = JSON.stringify(rosCmd);
            this.ws.send(cmdJson)
                .then((success) => {
                if (success) {
                    console.info(`指令已提交发送: ${cmdJson}`);
                }
                else {
                    console.info(`指令提交发送失败: ${cmdJson}`);
                }
            })
                .catch((err: BusinessError) => {
                console.info(`发送指令时出错. Code: ${err.code}, message: ${err.message}`);
            });
        }
        else {
            console.info("WebSocket 未连接，无法发送指令。");
        }
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
    //基础信息展示卡片动画控制器
    private __isInfoCardVisible: ObservedPropertySimplePU<boolean>;
    get isInfoCardVisible() {
        return this.__isInfoCardVisible.get();
    }
    set isInfoCardVisible(newValue: boolean) {
        this.__isInfoCardVisible.set(newValue);
    }
    //控制卡片宽度控制
    private __controlCardWidth: ObservedPropertySimplePU<string>;
    get controlCardWidth() {
        return this.__controlCardWidth.get();
    }
    set controlCardWidth(newValue: string) {
        this.__controlCardWidth.set(newValue);
    }
    //用于持有WebSocket客户端实例的变量
    private ws: webSocket.WebSocket | null;
    //用于跟踪WebSocket连接状态的变量
    private __isWsConnected: ObservedPropertySimplePU<boolean>;
    get isWsConnected() {
        return this.__isWsConnected.get();
    }
    set isWsConnected(newValue: boolean) {
        this.__isWsConnected.set(newValue);
    }
    //WebSocket: 封装了创建、监听和连接WebSocket的完整逻辑
    private initializeWebSocket() {
        //创建 WebSocket 实例
        this.ws = webSocket.createWebSocket();
        console.info('成功创建WebSocket实例');
        //下面进行WebSocket实例的初始化
        // 监听连接成功事件
        this.ws.on('open', (err) => {
            if (!err) {
                this.isWsConnected = true;
                console.info("连接成功");
            }
            else {
                console.info(`连接失败. Code: ${err.code}, message: ${err.message}`);
            }
        });
        // 监听接收到消息事件
        this.ws.on('message', (err, value) => {
            if (!err) {
                console.info("收到回显信息: " + value);
            }
            else {
                console.info(`收到回显信息失败. Code: ${err.code}, message: ${err.message}`);
            }
        });
        // 监听连接关闭事件
        this.ws.on('close', (err, value) => {
            this.isWsConnected = false;
            if (!err) {
                console.info(`连接已关闭: ${value.code}, reason: ${value.reason}`);
            }
            else {
                console.info(`连接关闭失败. Code: ${err.code}, message: ${err.message}`);
            }
        });
        // 监听错误事件
        this.ws.on('error', (err) => {
            this.isWsConnected = false;
            console.error(`发生错误: ${err.code}, message: ${err.message}`);
        });
        //发起连接
        const url = "ws://192.168.2.19:9090";
        this.ws.connect(url, (err) => {
            if (!err) {
                console.info("发起连接请求");
            }
            else {
                console.error(`连接请求失败. Code: ${err.code}, message: ${err.message}`);
            }
        });
    }
    //页面初始化时执行
    aboutToAppear() {
        this.initializeWebSocket();
    }
    //页面销毁时执行
    onDisappear() {
        //在界面销毁前确保让其急停
        this.sendCommand(0.0, 0.0);
        if (this.ws) {
            // 移除所有事件监听，防止在后台触发回调导致应用异常
            this.ws.off('open');
            this.ws.off('message');
            this.ws.off('close');
            this.ws.off('error');
            // 发起关闭请求
            this.ws.close()
                .then(() => {
                console.info("连接关闭成功");
            })
                .catch((err: BusinessError) => {
                console.info(`连接关闭失败. Code: ${err.code}, message: ${err.message}`);
            });
            this.ws = null; // 将WebSocket实例置空
            this.isWsConnected = false;
        }
        // 清理所有可能正在运行的定时器
        this.holdTimers.forEach((timerId) => {
            clearInterval(timerId);
        });
        this.holdTimers.clear();
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
    //图片预览层
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
            Image.create({ "id": 16777239, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
                    //控制启动按钮
                    Row.pop();
                    Column.pop();
                    Column.pop();
                    Stack.pop();
                });
            }
            // 小车控制卡片
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 小车控制卡片
            Stack.create({ alignContent: Alignment.TopEnd });
            // 小车控制卡片
            Stack.width(this.controlCardWidth);
            // 小车控制卡片
            Stack.enabled(this.data.statusText === '运行中' || this.data.statusText === '空闲中');
            // 小车控制卡片
            Stack.opacity(this.data.statusText === '运行中' || this.data.statusText === '空闲中' ? 1.0 : 0.4);
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
            __Common__.position({ top: 10, right: 20 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //地图位置
                    //全屏按钮
                    ActionButton(this, {
                        icon: { "id": 16777247, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        click: () => {
                            Context.animateTo({
                                duration: 800,
                                curve: Curve.EaseInOut
                            }, () => {
                                // 1. 先更新状态
                                this.isInfoCardVisible = !this.isInfoCardVisible;
                                //根据更新后的状态，修改所有需要动画的属性
                                // 所有这些变更都会被这一个 animateTo 捕获并同时应用动画
                                if (this.isInfoCardVisible) {
                                    // 折叠视图的状态
                                    this.controlCardWidth = '100%';
                                }
                                else {
                                    // 展开视图的状态
                                    this.controlCardWidth = '65%';
                                }
                            });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Dolly.ets", line: 528, col: 13 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: { "id": 16777247, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            click: () => {
                                Context.animateTo({
                                    duration: 800,
                                    curve: Curve.EaseInOut
                                }, () => {
                                    // 1. 先更新状态
                                    this.isInfoCardVisible = !this.isInfoCardVisible;
                                    //根据更新后的状态，修改所有需要动画的属性
                                    // 所有这些变更都会被这一个 animateTo 捕获并同时应用动画
                                    if (this.isInfoCardVisible) {
                                        // 折叠视图的状态
                                        this.controlCardWidth = '100%';
                                    }
                                    else {
                                        // 展开视图的状态
                                        this.controlCardWidth = '65%';
                                    }
                                });
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: { "id": 16777247, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }
                    });
                }
            }, { name: "ActionButton" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //方向控制按钮
            Row.create();
            //方向控制按钮
            Row.width('100%');
            //方向控制按钮
            Row.padding({ left: 20, right: 20 });
            //方向控制按钮
            Row.position({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 左下角按钮组 (向左, 向右)
            Row.create({ space: 20 });
        }, Row);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //向左按钮
                    DirectionalButton(this, {
                        icon: { "id": 16777242, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        onPress: () => { this.startMove('向左'); },
                        onRelease: () => { this.stopMove('向左'); }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Dolly.ets", line: 556, col: 17 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: { "id": 16777242, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            onPress: () => { this.startMove('向左'); },
                            onRelease: () => { this.stopMove('向左'); }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: { "id": 16777242, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }
                    });
                }
            }, { name: "DirectionalButton" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //向右按钮
                    DirectionalButton(this, {
                        icon: { "id": 16777243, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        onPress: () => { this.startMove('向右'); },
                        onRelease: () => { this.stopMove('向右'); }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Dolly.ets", line: 563, col: 17 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: { "id": 16777243, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            onPress: () => { this.startMove('向右'); },
                            onRelease: () => { this.stopMove('向右'); }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: { "id": 16777243, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }
                    });
                }
            }, { name: "DirectionalButton" });
        }
        // 左下角按钮组 (向左, 向右)
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 间隔，将左右按钮组推到两边
            Blank.create();
        }, Blank);
        // 间隔，将左右按钮组推到两边
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 右下角按钮组 (向前, 向后)
            Column.create({ space: 20 });
        }, Column);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //向前按钮
                    DirectionalButton(this, {
                        icon: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        onPress: () => { this.startMove('向前'); },
                        onRelease: () => { this.stopMove('向前'); }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Dolly.ets", line: 576, col: 17 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            onPress: () => { this.startMove('向前'); },
                            onRelease: () => { this.stopMove('向前'); }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: { "id": 16777245, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }
                    });
                }
            }, { name: "DirectionalButton" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //急停按钮
                    DirectionalButton(this, {
                        icon: { "id": 16777244, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        onPress: () => { this.startMove('停止'); },
                        onRelease: () => { this.stopMove('停止'); }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Dolly.ets", line: 583, col: 17 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: { "id": 16777244, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            onPress: () => { this.startMove('停止'); },
                            onRelease: () => { this.stopMove('停止'); }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: { "id": 16777244, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }
                    });
                }
            }, { name: "DirectionalButton" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //向后按钮
                    DirectionalButton(this, {
                        icon: { "id": 16777240, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        onPress: () => { this.startMove('向后'); },
                        onRelease: () => { this.stopMove('向后'); }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Dolly.ets", line: 590, col: 17 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            icon: { "id": 16777240, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            onPress: () => { this.startMove('向后'); },
                            onRelease: () => { this.stopMove('向后'); }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        icon: { "id": 16777240, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" }
                    });
                }
            }, { name: "DirectionalButton" });
        }
        // 右下角按钮组 (向前, 向后)
        Column.pop();
        //方向控制按钮
        Row.pop();
        Column.pop();
        // 小车控制卡片
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
        this.__icon = new SynchedPropertyObjectOneWayPU(params.icon, this, "icon");
        this.click = () => { };
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ActionButton_Params) {
        if (params.click !== undefined) {
            this.click = params.click;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
    }
    updateStateVars(params: ActionButton_Params) {
        this.__icon.reset(params.icon);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__icon.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __icon: SynchedPropertySimpleOneWayPU<Resource>;
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: Resource) {
        this.__icon.set(newValue);
    }
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
class DirectionalButton extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__icon = new SynchedPropertyObjectOneWayPU(params.icon, this, "icon");
        this.onPress = () => { };
        this.onRelease = () => { };
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: DirectionalButton_Params) {
        if (params.onPress !== undefined) {
            this.onPress = params.onPress;
        }
        if (params.onRelease !== undefined) {
            this.onRelease = params.onRelease;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
    }
    updateStateVars(params: DirectionalButton_Params) {
        this.__icon.reset(params.icon);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__icon.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __icon: SynchedPropertySimpleOneWayPU<Resource>;
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: Resource) {
        this.__icon.set(newValue);
    }
    private onPress: () => void;
    private onRelease: () => void;
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    //用于根据按压状态生成不同阴影的辅助方法
    private getShadow(): ShadowOptions {
        if (this.isPressed) {
            // 按下时的阴影：更小、更贴近，模拟“按下去”的效果
            return {
                radius: 8,
                color: 'rgba(0, 0, 0, 0.4)',
                offsetX: 2,
                offsetY: 2
            };
        }
        else {
            // 默认的悬浮阴影：更宽、更深，产生立体感
            return {
                radius: 12,
                color: 'rgba(0, 0, 0, 0.35)',
                offsetX: 0,
                offsetY: 5
            };
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Context.animation({ curve: Curve.EaseOut, duration: 150 });
            Row.width(80);
            Row.height(80);
            Row.borderRadius(16);
            Row.justifyContent(FlexAlign.Center);
            Row.backgroundColor('rgba(45, 50, 65, 0.45)');
            Row.backdropBlur(12);
            Row.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.2)'
            });
            Row.shadow(this.getShadow());
            Row.scale(this.isPressed ? { x: 0.9, y: 0.9 } : { x: 1.0, y: 1.0 });
            Context.animation(null);
            Row.onTouch((event: TouchEvent) => {
                event.stopPropagation();
                if (event.type === TouchType.Down) {
                    this.isPressed = true;
                    this.onPress();
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isPressed = false;
                    this.onRelease();
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.icon);
            Image.width(40);
            Image.height(40);
            Image.fillColor(Color.White);
        }, Image);
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
