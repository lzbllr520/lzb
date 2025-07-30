if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Conveyor_Params {
    statusText?: string;
    loadText?: string;
    isPressed?: boolean;
    isHover?: boolean;
    speedValue?: number;
    speedInputText?: string;
    chartOptions?: Options;
    holdTimer?: number;
}
import { McGaugeChart, Options } from "@normalized:N&&&@mcui/mccharts/index&2.8.9";
export class Conveyor extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__statusText = new ObservedPropertySimplePU('离线中', this, "statusText");
        this.__loadText = new ObservedPropertySimplePU('无物品', this, "loadText");
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.__isHover = new ObservedPropertySimplePU(false, this, "isHover");
        this.__speedValue = new ObservedPropertySimplePU(0, this, "speedValue");
        this.__speedInputText = new ObservedPropertySimplePU('0', this, "speedInputText");
        this.__chartOptions = new ObservedPropertyObjectPU(new Options({})
        // 用于存放长按时启动的定时器ID
        , this, "chartOptions");
        this.__holdTimer = new ObservedPropertySimplePU(-1, this, "holdTimer");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("speedValue", this.handleSpeedValueUpdate);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Conveyor_Params) {
        if (params.statusText !== undefined) {
            this.statusText = params.statusText;
        }
        if (params.loadText !== undefined) {
            this.loadText = params.loadText;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
        if (params.isHover !== undefined) {
            this.isHover = params.isHover;
        }
        if (params.speedValue !== undefined) {
            this.speedValue = params.speedValue;
        }
        if (params.speedInputText !== undefined) {
            this.speedInputText = params.speedInputText;
        }
        if (params.chartOptions !== undefined) {
            this.chartOptions = params.chartOptions;
        }
        if (params.holdTimer !== undefined) {
            this.holdTimer = params.holdTimer;
        }
    }
    updateStateVars(params: Conveyor_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__statusText.purgeDependencyOnElmtId(rmElmtId);
        this.__loadText.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isHover.purgeDependencyOnElmtId(rmElmtId);
        this.__speedValue.purgeDependencyOnElmtId(rmElmtId);
        this.__speedInputText.purgeDependencyOnElmtId(rmElmtId);
        this.__chartOptions.purgeDependencyOnElmtId(rmElmtId);
        this.__holdTimer.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__statusText.aboutToBeDeleted();
        this.__loadText.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        this.__isHover.aboutToBeDeleted();
        this.__speedValue.aboutToBeDeleted();
        this.__speedInputText.aboutToBeDeleted();
        this.__chartOptions.aboutToBeDeleted();
        this.__holdTimer.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
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
    //传送带状态
    private __statusText: ObservedPropertySimplePU<string>;
    get statusText() {
        return this.__statusText.get();
    }
    set statusText(newValue: string) {
        this.__statusText.set(newValue);
    }
    private getStatusColor(): Color {
        switch (this.statusText) {
            case '运行中':
                return Color.Green;
            case '离线中':
                return Color.Gray;
            default:
                return Color.Gray;
        }
    }
    //负载状态
    private __loadText: ObservedPropertySimplePU<string>;
    get loadText() {
        return this.__loadText.get();
    }
    set loadText(newValue: string) {
        this.__loadText.set(newValue);
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
    //根据状态计算缩放值
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
    //根据状态计算阴影效果
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
    private __speedValue: ObservedPropertySimplePU<number>;
    get speedValue() {
        return this.__speedValue.get();
    }
    set speedValue(newValue: number) {
        this.__speedValue.set(newValue);
    }
    private __speedInputText: ObservedPropertySimplePU<string>;
    get speedInputText() {
        return this.__speedInputText.get();
    }
    set speedInputText(newValue: string) {
        this.__speedInputText.set(newValue);
    }
    private __chartOptions: ObservedPropertyObjectPU<Options>;
    get chartOptions() {
        return this.__chartOptions.get();
    }
    set chartOptions(newValue: Options) {
        this.__chartOptions.set(newValue);
    }
    // 用于存放长按时启动的定时器ID
    private __holdTimer: ObservedPropertySimplePU<number>;
    get holdTimer() {
        return this.__holdTimer.get();
    }
    set holdTimer(newValue: number) {
        this.__holdTimer.set(newValue);
    }
    handleSpeedValueUpdate() {
        // 在这里统一分发任务
        this.onSpeedChange(); // 更新图表
        this.syncInputText(); // 更新文本输入框
    }
    private commitSpeedInput() {
        let num = parseInt(this.speedInputText, 10);
        if (isNaN(num)) {
            // 如果输入的内容不是有效数字（比如被清空了），则恢复显示为上一次的有效值
            this.syncInputText();
        }
        else {
            // 如果是有效数字，则更新主速度值（并限制在0-100）
            // @Watch 会自动处理后续的图表和文本框同步
            this.speedValue = Math.min(100, Math.max(0, num));
        }
    }
    // 增加速度的辅助方法
    private increaseSpeed() {
        if (this.speedValue < 100) {
            this.speedValue++;
        }
        else {
            // 如果已达最大值，清除定时器
            if (this.holdTimer !== -1) {
                clearInterval(this.holdTimer);
                this.holdTimer = -1;
            }
        }
    }
    // 减少速度的辅助方法
    private decreaseSpeed() {
        if (this.speedValue > 0) {
            this.speedValue--;
        }
        else {
            // 如果已达最小值，清除定时器
            if (this.holdTimer !== -1) {
                clearInterval(this.holdTimer);
                this.holdTimer = -1;
            }
        }
    }
    syncInputText() {
        this.speedInputText = this.speedValue.toFixed(0);
    }
    onSpeedChange() {
        const chartValue = this.speedValue === 0 ? 0.01 : this.speedValue;
        this.chartOptions.setVal({
            series: [
                {
                    data: [
                        {
                            value: chartValue,
                            gradient: ['#11998e', '#38ef7d']
                        }
                    ]
                }
            ]
        });
    }
    // aboutToAppear是页面即将显示时的生命周期回调
    aboutToAppear() {
        this.chartOptions = new Options({
            series: [
                {
                    // 使用文档默认角度，这与图片样式匹配
                    startAngle: -(Math.PI / 4) * 5,
                    endAngle: Math.PI / 4,
                    min: 0,
                    max: 100,
                    splitNum: 11,
                    arcLineWidth: 15,
                    data: [
                        {
                            name: '速度',
                            value: this.speedValue,
                            gradient: ['#11998e', '#38ef7d']
                        }
                    ],
                    // 显示轴刻度线
                    axisTick: {
                        show: true,
                        style: { lineWidth: 3, stroke: '#ffffffff' }
                    },
                    // 显示轴标签 (0%, 10% ...)
                    axisLabel: {
                        show: true,
                        formatter: (label: string) => `${label}%`,
                        style: { fontSize: 16, fill: '#ffffffff' }
                    },
                    // c. 显示并设置指针样式
                    pointer: {
                        show: true,
                        style: {
                            color: '#1890ff' // 设置指针为红色
                        }
                    },
                    //隐藏仪表盘中心的文字详情
                    details: {
                        show: false
                    },
                    //配置背景弧
                    backgroundArc: {
                        show: true,
                        style: {
                            stroke: '#ffd0d0d0',
                            lineWidth: 15
                        }
                    }
                }
            ]
        });
        this.onSpeedChange();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 20 });
            Row.debugLine("entry/src/main/ets/view/device/Conveyor.ets(206:5)", "entry");
            Row.padding(20);
            Row.width('100%');
            Row.height('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //基础信息卡片
            Column.create();
            Column.debugLine("entry/src/main/ets/view/device/Conveyor.ets(208:7)", "entry");
            //基础信息卡片
            Column.width('30%');
            //基础信息卡片
            Column.height('100%');
            //基础信息卡片
            Column.backdropBlur(8);
            //基础信息卡片
            Column.backgroundColor('rgba(255, 255, 255, 0.2)');
            //基础信息卡片
            Column.borderRadius(16);
            //基础信息卡片
            Column.shadow({
                radius: 20,
                color: 'rgba(0, 0, 0, 0.2)',
                offsetX: 0,
                offsetY: 10
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/device/Conveyor.ets(209:9)", "entry");
            Column.width('90%');
            Column.height('30%');
            Column.alignItems(HorizontalAlign.Center);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('传送带模型');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(210:11)", "entry");
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 20 });
            Column.debugLine("entry/src/main/ets/view/device/Conveyor.ets(218:9)", "entry");
            Column.width('100%');
            Column.height('70%');
            Column.alignItems(HorizontalAlign.Center);
            Column.justifyContent(FlexAlign.Center);
            Column.padding({ left: 10 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //传送带名称
            Row.create();
            Row.debugLine("entry/src/main/ets/view/device/Conveyor.ets(221:11)", "entry");
            //传送带名称
            Row.width('100%');
            //传送带名称
            Row.justifyContent(FlexAlign.Center);
            //传送带名称
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('名称：');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(222:13)", "entry");
            Text.fontWeight(FontWeight.Bold);
            Text.fontSize(20);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('传送带001');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(226:13)", "entry");
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        //传送带名称
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //传送带状态
            Row.create();
            Row.debugLine("entry/src/main/ets/view/device/Conveyor.ets(234:11)", "entry");
            //传送带状态
            Row.width('100%');
            //传送带状态
            Row.justifyContent(FlexAlign.Center);
            //传送带状态
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('状态：');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(235:13)", "entry");
            Text.fontWeight(FontWeight.Bold);
            Text.fontSize(20);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.statusText);
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(239:13)", "entry");
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.debugLine("entry/src/main/ets/view/device/Conveyor.ets(241:13)", "entry");
            Circle.margin({ left: 10 });
            Circle.width(16);
            Circle.height(16);
            Circle.fill(this.getStatusColor());
        }, Circle);
        //传送带状态
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //传送带速度
            Row.create();
            Row.debugLine("entry/src/main/ets/view/device/Conveyor.ets(252:11)", "entry");
            //传送带速度
            Row.width('100%');
            //传送带速度
            Row.justifyContent(FlexAlign.Center);
            //传送带速度
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('运行速度：');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(253:13)", "entry");
            Text.fontWeight(FontWeight.Bold);
            Text.fontSize(20);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.speedValue + '  %');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(257:13)", "entry");
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        //传送带速度
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //传送带负载状态
            Row.create();
            Row.debugLine("entry/src/main/ets/view/device/Conveyor.ets(265:11)", "entry");
            //传送带负载状态
            Row.width('100%');
            //传送带负载状态
            Row.justifyContent(FlexAlign.Center);
            //传送带负载状态
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('负载：');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(266:13)", "entry");
            Text.fontWeight(FontWeight.Bold);
            Text.fontSize(20);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.loadText);
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(270:13)", "entry");
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.loadText === '有物品') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777228, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/view/device/Conveyor.ets(273:15)", "entry");
                        Image.width(20);
                        Image.height(20);
                        Image.margin({ left: 10 });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777243, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/view/device/Conveyor.ets(278:15)", "entry");
                        Image.width(20);
                        Image.height(20);
                        Image.margin({ left: 10 });
                    }, Image);
                });
            }
        }, If);
        If.pop();
        //传送带负载状态
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //控制按钮 (已添加点击和悬浮动画)
            Row.create();
            Row.debugLine("entry/src/main/ets/view/device/Conveyor.ets(289:11)", "entry");
            Context.animation({ duration: 150, curve: Curve.EaseOut });
            //控制按钮 (已添加点击和悬浮动画)
            Row.width('80%');
            //控制按钮 (已添加点击和悬浮动画)
            Row.height(50);
            //控制按钮 (已添加点击和悬浮动画)
            Row.padding(10);
            //控制按钮 (已添加点击和悬浮动画)
            Row.justifyContent(FlexAlign.Center);
            //控制按钮 (已添加点击和悬浮动画)
            Row.alignItems(VerticalAlign.Center);
            //控制按钮 (已添加点击和悬浮动画)
            Row.backgroundColor(this.statusText === '运行中' ? 'rgba(255, 80, 80, 0.4)' : 'rgba(0, 200, 83, 0.5)');
            //控制按钮 (已添加点击和悬浮动画)
            Row.borderRadius(25);
            //控制按钮 (已添加点击和悬浮动画)
            Row.border({
                width: 1,
                color: 'rgba(255, 255, 255, 0.3)'
            });
            //控制按钮 (已添加点击和悬浮动画)
            Row.margin({ top: 20 });
            //控制按钮 (已添加点击和悬浮动画)
            Row.shadow(this.getShadowOptions());
            //控制按钮 (已添加点击和悬浮动画)
            Row.scale({
                x: this.getScaleValue(),
                y: this.getScaleValue()
            });
            //控制按钮 (已添加点击和悬浮动画)
            Row.opacity(this.isPressed ? 0.8 : 1.0);
            //控制按钮 (已添加点击和悬浮动画)
            Row.onHover((isHover: boolean) => {
                this.isHover = isHover;
            });
            //控制按钮 (已添加点击和悬浮动画)
            Row.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.isPressed = true;
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isPressed = false;
                    // 1. 判断当前状态，准备不同的对话框信息
                    const isCurrentlyRunning = this.statusText === '运行中';
                    const message = isCurrentlyRunning ? '您确定要停止传送带吗？' : '您确定要启动传送带吗？';
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
                                    // 3. 将原先的逻辑移到这里！
                                    if (isCurrentlyRunning) {
                                        this.statusText = '离线中';
                                        this.speedValue = 0;
                                        this.showSystemToast('关闭成功');
                                    }
                                    else {
                                        this.statusText = '运行中';
                                        this.speedValue = 10;
                                        this.showSystemToast('启动成功');
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
            if (this.statusText === '运行中') {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777220, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/view/device/Conveyor.ets(291:15)", "entry");
                        Image.width(22);
                        Image.height(22);
                        Image.fillColor(Color.White);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('停止');
                        Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(293:15)", "entry");
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
                        Image.create({ "id": 16777249, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.debugLine("entry/src/main/ets/view/device/Conveyor.ets(295:15)", "entry");
                        Image.width(24);
                        Image.height(24);
                        Image.fillColor(Color.White);
                    }, Image);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('启动');
                        Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(297:15)", "entry");
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
        //控制按钮 (已添加点击和悬浮动画)
        Row.pop();
        Column.pop();
        //基础信息卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //速度调节卡片
            Column.create({ space: 20 });
            Column.debugLine("entry/src/main/ets/view/device/Conveyor.ets(401:7)", "entry");
            //速度调节卡片
            Column.width('65%');
            //速度调节卡片
            Column.height('100%');
            //速度调节卡片
            Column.backdropBlur(8);
            //速度调节卡片
            Column.backgroundColor('rgba(255, 255, 255, 0.2)');
            //速度调节卡片
            Column.borderRadius(16);
            //速度调节卡片
            Column.shadow({
                radius: 20,
                color: 'rgba(0, 0, 0, 0.2)',
                offsetX: 0,
                offsetY: 10
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.height(320);
            __Common__.width('100%');
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new McGaugeChart(this, { options: this.chartOptions }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Conveyor.ets", line: 402, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            options: this.chartOptions
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        options: this.chartOptions
                    });
                }
            }, { name: "McGaugeChart" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/device/Conveyor.ets(406:9)", "entry");
            Context.animation({ duration: 250, curve: Curve.EaseInOut });
            Row.width('90%');
            Row.height(60);
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.margin({ top: 20 });
            Row.backgroundColor('rgba(255, 255, 255, 0.2)');
            Row.borderRadius(30);
            Row.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
            });
            Row.backdropBlur(8);
            Row.opacity(this.statusText === '运行中' ? 1.0 : 0.4);
            Row.enabled(this.statusText === '运行中');
            Context.animation(null);
            Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 减速按钮
            Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
            Button.debugLine("entry/src/main/ets/view/device/Conveyor.ets(408:11)", "entry");
            // 减速按钮
            Button.width(50);
            // 减速按钮
            Button.height(50);
            // 减速按钮
            Button.backgroundColor(Color.Transparent);
            // 减速按钮
            Button.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.decreaseSpeed();
                    this.holdTimer = setInterval(() => { this.decreaseSpeed(); }, 120);
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    clearInterval(this.holdTimer);
                    this.holdTimer = -1;
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('-');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(409:13)", "entry");
            Text.fontSize(26);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        // 减速按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 当前速度值显示
            Row.create();
            Row.debugLine("entry/src/main/ets/view/device/Conveyor.ets(427:11)", "entry");
            // 当前速度值显示
            Row.justifyContent(FlexAlign.Center);
            // 当前速度值显示
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.speedInputText });
            TextInput.debugLine("entry/src/main/ets/view/device/Conveyor.ets(428:13)", "entry");
            TextInput.type(InputType.Number);
            TextInput.maxLength(3);
            TextInput.fontSize(28);
            TextInput.fontWeight(FontWeight.Bold);
            TextInput.width(85);
            TextInput.height(50);
            TextInput.fontColor(Color.White);
            TextInput.textAlign(TextAlign.Center);
            TextInput.backgroundColor(Color.Transparent);
            TextInput.onChange((value: string) => { this.speedInputText = value; });
            TextInput.onSubmit(() => { this.commitSpeedInput(); });
            TextInput.onBlur(() => { this.commitSpeedInput(); });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('%');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(442:13)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        // 当前速度值显示
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 加速按钮
            Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
            Button.debugLine("entry/src/main/ets/view/device/Conveyor.ets(452:11)", "entry");
            // 加速按钮
            Button.width(50);
            // 加速按钮
            Button.height(50);
            // 加速按钮
            Button.backgroundColor(Color.Transparent);
            // 加速按钮
            Button.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.increaseSpeed();
                    this.holdTimer = setInterval(() => { this.increaseSpeed(); }, 120);
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    clearInterval(this.holdTimer);
                    this.holdTimer = -1;
                }
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('+');
            Text.debugLine("entry/src/main/ets/view/device/Conveyor.ets(453:13)", "entry");
            Text.fontSize(28);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        // 加速按钮
        Button.pop();
        Row.pop();
        //速度调节卡片
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
