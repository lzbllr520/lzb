if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Conveyor1_Params {
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    data?: ConveyorState;
    lastKnownSpeed?: number;
    avatar?: Resource;
    isPressed?: boolean;
    isHover?: boolean;
    isChartVisible?: boolean;
    isActive?: boolean;
    speedInputText?: string;
    chartOptions?: Options;
    holdTimer?: number;
    isPreviewVisible?: boolean;
}
import { McGaugeChart, Options } from "@normalized:N&&&@mcui/mccharts/index&2.8.9";
import type { ConveyorState } from '../../model/ConveyorState';
export class Conveyor1 extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.addLog = () => { };
        this.__data = new SynchedPropertyObjectTwoWayPU(params.data, this, "data");
        this.__lastKnownSpeed = new ObservedPropertySimplePU(0, this, "lastKnownSpeed");
        this.__avatar = new SynchedPropertyObjectTwoWayPU(params.avatar, this, "avatar");
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.__isHover = new ObservedPropertySimplePU(false, this, "isHover");
        this.__isChartVisible = new ObservedPropertySimplePU(false, this, "isChartVisible");
        this.__isActive = new SynchedPropertySimpleOneWayPU(params.isActive, this, "isActive");
        this.__speedInputText = new ObservedPropertySimplePU('0', this, "speedInputText");
        this.__chartOptions = new ObservedPropertyObjectPU(new Options({})
        // 用于存放长按时启动的定时器ID
        , this, "chartOptions");
        this.__holdTimer = new ObservedPropertySimplePU(-1, this, "holdTimer");
        this.__isPreviewVisible = new ObservedPropertySimplePU(false, this, "isPreviewVisible");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("data", this.onDataChange);
        this.declareWatch("isActive", this.onActiveChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Conveyor1_Params) {
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
        if (params.lastKnownSpeed !== undefined) {
            this.lastKnownSpeed = params.lastKnownSpeed;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
        if (params.isHover !== undefined) {
            this.isHover = params.isHover;
        }
        if (params.isChartVisible !== undefined) {
            this.isChartVisible = params.isChartVisible;
        }
        if (params.isActive === undefined) {
            this.__isActive.set(false);
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
        if (params.isPreviewVisible !== undefined) {
            this.isPreviewVisible = params.isPreviewVisible;
        }
    }
    updateStateVars(params: Conveyor1_Params) {
        this.__isActive.reset(params.isActive);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__data.purgeDependencyOnElmtId(rmElmtId);
        this.__lastKnownSpeed.purgeDependencyOnElmtId(rmElmtId);
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isHover.purgeDependencyOnElmtId(rmElmtId);
        this.__isChartVisible.purgeDependencyOnElmtId(rmElmtId);
        this.__isActive.purgeDependencyOnElmtId(rmElmtId);
        this.__speedInputText.purgeDependencyOnElmtId(rmElmtId);
        this.__chartOptions.purgeDependencyOnElmtId(rmElmtId);
        this.__holdTimer.purgeDependencyOnElmtId(rmElmtId);
        this.__isPreviewVisible.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__data.aboutToBeDeleted();
        this.__lastKnownSpeed.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        this.__isHover.aboutToBeDeleted();
        this.__isChartVisible.aboutToBeDeleted();
        this.__isActive.aboutToBeDeleted();
        this.__speedInputText.aboutToBeDeleted();
        this.__chartOptions.aboutToBeDeleted();
        this.__holdTimer.aboutToBeDeleted();
        this.__isPreviewVisible.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private addLog: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    private __data: SynchedPropertySimpleOneWayPU<ConveyorState>;
    get data() {
        return this.__data.get();
    }
    set data(newValue: ConveyorState) {
        this.__data.set(newValue);
    }
    private __lastKnownSpeed: ObservedPropertySimplePU<number>;
    get lastKnownSpeed() {
        return this.__lastKnownSpeed.get();
    }
    set lastKnownSpeed(newValue: number) {
        this.__lastKnownSpeed.set(newValue);
    }
    private __avatar: SynchedPropertySimpleOneWayPU<Resource>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(newValue: Resource) {
        this.__avatar.set(newValue);
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
    private getStatusColor(): Color {
        switch (this.data.statusText) {
            case '运行中':
                return Color.Orange;
            case '离线中':
                return Color.Gray;
            default:
                return Color.Gray;
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
    //仪表盘的显示与隐藏控制器
    private __isChartVisible: ObservedPropertySimplePU<boolean>;
    get isChartVisible() {
        return this.__isChartVisible.get();
    }
    set isChartVisible(newValue: boolean) {
        this.__isChartVisible.set(newValue);
    }
    private __isActive: SynchedPropertySimpleOneWayPU<boolean>;
    get isActive() {
        return this.__isActive.get();
    }
    set isActive(newValue: boolean) {
        this.__isActive.set(newValue);
    }
    onActiveChange() {
        if (this.isActive) {
            // 当组件从非激活变为激活时，播放动画
            this.playEntryAnimation();
        }
        else {
            // 当组件变为非激活时，重置状态
            this.isChartVisible = false;
        }
    }
    // 新增：将动画逻辑封装成一个独立的私有方法，供多处调用
    private playEntryAnimation() {
        // 立即将图表设为不可见，为播放动画做准备
        this.isChartVisible = false;
        // 使用延时确保UI更新
        setTimeout(() => {
            this.isChartVisible = true;
        }, 50);
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
            this.data.speedValue = Math.min(100, Math.max(0, num));
        }
    }
    // 增加速度的辅助方法
    private increaseSpeed() {
        if (this.data.speedValue < 100) {
            this.data.speedValue++;
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
        if (this.data.speedValue > 0) {
            this.data.speedValue--;
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
        this.speedInputText = this.data.speedValue.toFixed(0);
    }
    onSpeedChange() {
        const chartValue = this.data.speedValue === 0 ? 0.01 : this.data.speedValue;
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
        this.lastKnownSpeed = this.data.speedValue;
        this.speedInputText = this.data.speedValue.toFixed(0);
        this.initChartOptions();
        this.updateChart();
        if (this.isActive) {
            this.playEntryAnimation();
        }
    }
    private initChartOptions() {
        this.chartOptions = new Options({
            series: [
                {
                    // 设置仪表盘的起始和结束角度，形成一个非完整的环形
                    startAngle: -(Math.PI / 4) * 5,
                    endAngle: Math.PI / 4,
                    // 设置仪表盘的数值范围
                    min: 0,
                    max: 100,
                    // 设置主要的刻度分割数量
                    splitNum: 11,
                    // 设置进度条（彩色弧线）的宽度
                    arcLineWidth: 15,
                    // 初始化图表的数值数据
                    data: [
                        {
                            name: '速度',
                            // 注意：这里的 value 会在 aboutToAppear 中被 updateChart() 再次更新
                            value: this.data.speedValue,
                            // 设置进度条的渐变色
                            gradient: ['#11998e', '#38ef7d']
                        }
                    ],
                    // 配置轴刻度线（白色的小短线）
                    axisTick: {
                        show: true,
                        style: { lineWidth: 3, stroke: '#ffffffff' }
                    },
                    // 配置轴标签（例如 "0%", "10%" 等文字）
                    axisLabel: {
                        show: true,
                        formatter: (label: string) => `${label}%`,
                        style: { fontSize: 16, fill: '#ffffffff' }
                    },
                    // 配置指针（中间的指示针）
                    pointer: {
                        show: true,
                        style: {
                            color: '#1890ff' // 设置指针颜色
                        }
                    },
                    // 隐藏仪表盘中心默认的文字详情
                    details: {
                        show: false
                    },
                    // 配置背景弧线（进度条底下的灰色弧线）
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
    }
    onDataChange() {
        if (this.data.speedValue !== this.lastKnownSpeed) {
            console.info(`Speed changed from ${this.lastKnownSpeed} to ${this.data.speedValue}`);
            // 只有速度真的变了，才执行核心逻辑
            this.updateChart();
            this.syncInputText();
            //执行完逻辑后，千万不要忘记更新 "lastKnownSpeed" 的值！
            this.lastKnownSpeed = this.data.speedValue;
        }
    }
    updateChart() {
        const chartValue = this.data.speedValue === 0 ? 0.01 : this.data.speedValue;
        this.chartOptions.setVal({
            series: [{ data: [{ value: chartValue, gradient: ['#11998e', '#38ef7d'] }] }]
        });
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
            Image.create({ "id": 16777233, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
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
            //基础信息卡片
            Column.create();
            //基础信息卡片
            Column.width('30%');
            //基础信息卡片
            Column.height('100%');
            //基础信息卡片
            Column.backdropBlur(12);
            //基础信息卡片
            Column.backgroundColor('rgba(10, 10, 15, 0.3)');
            //基础信息卡片
            Column.borderRadius(16);
            //基础信息卡片
            Column.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            //基础信息卡片
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
            Image.width(150);
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
            //传送带名称
            Row.create();
            //传送带名称
            Row.width('100%');
            //传送带名称
            Row.justifyContent(FlexAlign.Center);
            //传送带名称
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
            Text.create('传送带001');
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        //传送带名称
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //传送带状态
            Row.create();
            //传送带状态
            Row.width('100%');
            //传送带状态
            Row.justifyContent(FlexAlign.Center);
            //传送带状态
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
        //传送带状态
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //传送带速度
            Row.create();
            //传送带速度
            Row.width('100%');
            //传送带速度
            Row.justifyContent(FlexAlign.Center);
            //传送带速度
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('运行速度：');
            Text.fontWeight(FontWeight.Bold);
            Text.fontSize(20);
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.data.speedValue + '  %');
            Text.fontColor(Color.White);
        }, Text);
        Text.pop();
        //传送带速度
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //传送带负载状态
            Row.create();
            //传送带负载状态
            Row.width('100%');
            //传送带负载状态
            Row.justifyContent(FlexAlign.Center);
            //传送带负载状态
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
        //传送带负载状态
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //控制按钮 (已添加点击和悬浮动画)
            Row.create();
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
            Row.backgroundColor(this.data.statusText === '运行中' ? 'rgba(255, 80, 80, 0.4)' : 'rgba(0, 200, 83, 0.5)');
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
                event.stopPropagation();
                if (event.type === TouchType.Down) {
                    this.isPressed = true;
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isPressed = false;
                    //判断当前状态，准备不同的对话框信息
                    const isCurrentlyRunning = this.data.statusText === '运行中';
                    const message = isCurrentlyRunning ? '您确定要停止一号传送带吗？' : '您确定要启动一号传送带吗？';
                    //显示确认对话框
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
                                }
                            },
                            {
                                value: '确认',
                                fontColor: Color.Red,
                                action: () => {
                                    if (isCurrentlyRunning) {
                                        this.data.statusText = '离线中';
                                        this.data.speedValue = 0;
                                        this.showSystemToast('关闭成功');
                                        this.addLog('warning', '关闭了一号传送带，停止了对一号传送带的操作。', true);
                                    }
                                    else {
                                        this.data.statusText = '运行中';
                                        this.data.speedValue = 10;
                                        this.showSystemToast('启动成功');
                                        this.addLog('info', '启动了一号传送带，要对一号传送带进行操作。', true);
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
            if (this.data.statusText === '运行中') {
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
        //控制按钮 (已添加点击和悬浮动画)
        Row.pop();
        Column.pop();
        //基础信息卡片
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //速度调节卡片
            Column.create({ space: 10 });
            //速度调节卡片
            Column.width('65%');
            //速度调节卡片
            Column.height('100%');
            //速度调节卡片
            Column.backdropBlur(12);
            //速度调节卡片
            Column.backgroundColor('rgba(10, 10, 15, 0.3)');
            //速度调节卡片
            Column.borderRadius(16);
            //速度调节卡片
            Column.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            //速度调节卡片
            Column.shadow({
                radius: 30,
                color: 'rgba(173, 216, 230, 0.2)',
                offsetX: 0,
                offsetY: 0
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isChartVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        __Common__.create();
                        __Common__.height(300);
                        __Common__.width(320);
                        __Common__.transition(
                        // 创建一个从完全透明开始的动画效果
                        TransitionEffect.opacity(0)
                            // 将其与一个从90%大小开始的缩放效果组合起来
                            .combine(TransitionEffect.scale({ x: 0.9, y: 0.9 }))
                            // 为这个组合后的动画效果统一设置时长和曲线
                            .animation({
                            duration: 400,
                            curve: Curve.EaseOut
                        }));
                    }, __Common__);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new McGaugeChart(this, { options: this.chartOptions }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/Conveyor1.ets", line: 523, col: 13 });
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
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.SpaceAround);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //选择传送带运动方向
            Select.create([
                { value: '正向运行' },
                { value: '反向运行' }
            ]);
            Context.animation({ duration: 250, curve: Curve.EaseInOut });
            //选择传送带运动方向
            Select.optionWidth(90);
            //选择传送带运动方向
            Select.menuBackgroundBlurStyle(BlurStyle.COMPONENT_ULTRA_THICK);
            //选择传送带运动方向
            Select.menuBackgroundColor(Color.Transparent);
            //选择传送带运动方向
            Select.onSelect((event) => {
                const newDirection = event.valueOf() === 0 ? '正向运行' : '反向运行';
                if (this.data.direction !== newDirection) {
                    this.data.direction = newDirection;
                }
            });
            //选择传送带运动方向
            Select.selected(this.data.direction === '正向运行' ? 0 : 1);
            //选择传送带运动方向
            Select.value(this.data.direction);
            //选择传送带运动方向
            Select.width('40%');
            //选择传送带运动方向
            Select.height(50);
            //选择传送带运动方向
            Select.backgroundColor('rgba(255, 255, 255, 0.2)');
            //选择传送带运动方向
            Select.borderRadius(25);
            //选择传送带运动方向
            Select.fontColor(Color.White);
            //选择传送带运动方向
            Select.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)'
            });
            //选择传送带运动方向
            Select.enabled(this.data.statusText === '运行中');
            //选择传送带运动方向
            Select.opacity(this.data.statusText === '运行中' ? 1.0 : 0.4);
            Context.animation(null);
        }, Select);
        //选择传送带运动方向
        Select.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create([
                { value: '正常停止' },
                { value: '急停' }
            ]);
            Context.animation({ duration: 250, curve: Curve.EaseInOut });
            Select.optionWidth(180);
            Select.menuBackgroundBlurStyle(BlurStyle.COMPONENT_ULTRA_THICK);
            Select.menuBackgroundColor(Color.Transparent);
            Select.onSelect((event) => {
                const newStopMethod = event.valueOf() === 0 ? '正常停止' : '急停';
                if (this.data.stopMethod !== newStopMethod) {
                    this.data.stopMethod = newStopMethod;
                }
            });
            Select.selected(this.data.direction === '正常停止' ? 0 : 1);
            Select.value(this.data.stopMethod);
            Select.width('40%');
            Select.height(50);
            Select.backgroundColor('rgba(255, 255, 255, 0.2)');
            Select.borderRadius(25);
            Select.fontColor(Color.White);
            Select.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)'
            });
            Select.enabled(this.data.statusText === '运行中');
            Select.opacity(this.data.statusText === '运行中' ? 1.0 : 0.4);
            Context.animation(null);
        }, Select);
        Select.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Context.animation({ duration: 250, curve: Curve.EaseInOut });
            Row.width('90%');
            Row.height(60);
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.backgroundColor('rgba(255, 255, 255, 0.2)');
            Row.borderRadius(30);
            Row.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
            });
            Row.backdropBlur(8);
            Row.opacity(this.data.statusText === '运行中' ? 1.0 : 0.4);
            Row.enabled(this.data.statusText === '运行中');
            Context.animation(null);
            Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 减速按钮
            Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
            // 减速按钮
            Button.width(50);
            // 减速按钮
            Button.height(50);
            // 减速按钮
            Button.backgroundColor(Color.Transparent);
            // 减速按钮
            Button.onTouch((event: TouchEvent) => {
                event.stopPropagation();
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
            // 当前速度值显示
            Row.justifyContent(FlexAlign.Center);
            // 当前速度值显示
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.speedInputText });
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
            // 加速按钮
            Button.width(50);
            // 加速按钮
            Button.height(50);
            // 加速按钮
            Button.backgroundColor(Color.Transparent);
            // 加速按钮
            Button.onTouch((event: TouchEvent) => {
                event.stopPropagation();
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
