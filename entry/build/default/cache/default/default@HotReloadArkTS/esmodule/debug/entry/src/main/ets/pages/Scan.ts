if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Scan_Params {
    xcomponentController?: XComponentController;
    surfaceId?: string;
    cameraManager?: camera.CameraManager;
    cameraInput?: camera.CameraInput;
    previewOutput?: camera.PreviewOutput;
    session?: camera.Session;
    isCameraInitialized?: boolean;
    canvasContext?: CanvasRenderingContext2D;
    scanLineTop?: number;
    isAnimating?: boolean;
}
import camera from "@ohos:multimedia.camera";
import type { BusinessError as BusinessError } from "@ohos:base";
import type common from "@ohos:app.ability.common";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type { Permissions as Permissions } from "@ohos:abilityAccessCtrl";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
class Scan extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.xcomponentController = new XComponentController();
        this.surfaceId = '';
        this.cameraManager = undefined;
        this.cameraInput = undefined;
        this.previewOutput = undefined;
        this.session = undefined;
        this.isCameraInitialized = false;
        this.canvasContext = new CanvasRenderingContext2D();
        this.__scanLineTop = new ObservedPropertySimplePU(-124, this, "scanLineTop");
        this.__isAnimating = new ObservedPropertySimplePU(false, this, "isAnimating");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Scan_Params) {
        if (params.xcomponentController !== undefined) {
            this.xcomponentController = params.xcomponentController;
        }
        if (params.surfaceId !== undefined) {
            this.surfaceId = params.surfaceId;
        }
        if (params.cameraManager !== undefined) {
            this.cameraManager = params.cameraManager;
        }
        if (params.cameraInput !== undefined) {
            this.cameraInput = params.cameraInput;
        }
        if (params.previewOutput !== undefined) {
            this.previewOutput = params.previewOutput;
        }
        if (params.session !== undefined) {
            this.session = params.session;
        }
        if (params.isCameraInitialized !== undefined) {
            this.isCameraInitialized = params.isCameraInitialized;
        }
        if (params.canvasContext !== undefined) {
            this.canvasContext = params.canvasContext;
        }
        if (params.scanLineTop !== undefined) {
            this.scanLineTop = params.scanLineTop;
        }
        if (params.isAnimating !== undefined) {
            this.isAnimating = params.isAnimating;
        }
    }
    updateStateVars(params: Scan_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__scanLineTop.purgeDependencyOnElmtId(rmElmtId);
        this.__isAnimating.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__scanLineTop.aboutToBeDeleted();
        this.__isAnimating.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // --- 相机预览所需对象 ---
    private xcomponentController: XComponentController;
    private surfaceId: string;
    private cameraManager?: camera.CameraManager;
    private cameraInput?: camera.CameraInput;
    private previewOutput?: camera.PreviewOutput;
    private session?: camera.Session;
    private isCameraInitialized: boolean;
    // Canvas 2D渲染上下文
    private canvasContext: CanvasRenderingContext2D;
    // --- 状态管理 ---
    private __scanLineTop: ObservedPropertySimplePU<number>;
    get scanLineTop() {
        return this.__scanLineTop.get();
    }
    set scanLineTop(newValue: number) {
        this.__scanLineTop.set(newValue);
    }
    private __isAnimating: ObservedPropertySimplePU<boolean>;
    get isAnimating() {
        return this.__isAnimating.get();
    }
    set isAnimating(newValue: boolean) {
        this.__isAnimating.set(newValue);
    }
    async aboutToAppear() {
        await this.checkAndRequestPermissions();
        setTimeout(() => {
            if (this.isAnimating) {
                this.handleScanSuccess();
            }
        }, 6000);
    }
    async aboutToDisappear() {
        await this.releaseCamera();
    }
    // ... (省略部分未修改的函数: checkAndRequestPermissions, initCamera, releaseCamera, handleScanSuccess, goBack)
    // ... The unchanged functions from your code go here.
    // 申请相机权限
    async checkAndRequestPermissions(): Promise<void> {
        // 模拟扫码只需要相机权限
        const permissionList: Array<Permissions> = ['ohos.permission.CAMERA'];
        const context = getContext(this) as common.UIAbilityContext;
        const atManager = abilityAccessCtrl.createAtManager();
        try {
            const data = await atManager.requestPermissionsFromUser(context, permissionList);
            let allGranted = true;
            data.authResults.forEach(result => {
                if (result !== abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED) {
                    allGranted = false;
                }
            });
            if (allGranted) {
                console.info('相机权限已授予，准备初始化相机。');
                const abilityContext = getContext(this) as common.UIAbilityContext;
                this.cameraManager = camera.getCameraManager(abilityContext);
                // 如果surfaceId已准备好，则初始化相机
                if (this.surfaceId) {
                    await this.initCamera();
                }
            }
            else {
                console.error('相机权限被拒绝。');
                promptAction.showToast({ message: '需要相机权限才能进行扫码' });
                this.goBack();
            }
        }
        catch (error) {
            console.error(`申请权限时发生异常: ${JSON.stringify(error)}`);
        }
    }
    // 初始化相机（仅预览）
    async initCamera() {
        if (this.isCameraInitialized || !this.surfaceId || !this.cameraManager) {
            console.warn('初始化条件不满足或已初始化，跳过。');
            return;
        }
        this.isCameraInitialized = true;
        console.info('开始初始化相机...');
        try {
            const cameras = this.cameraManager.getSupportedCameras();
            if (cameras.length === 0) {
                console.error('No camera device supported.');
                return;
            }
            // 优先使用后置摄像头
            const cameraDevice = cameras.find(cam => cam.cameraPosition === camera.CameraPosition.CAMERA_POSITION_BACK) ?? cameras[0];
            this.cameraInput = this.cameraManager.createCameraInput(cameraDevice);
            await this.cameraInput.open();
            const outputCapability = this.cameraManager.getSupportedOutputCapability(cameraDevice, camera.SceneMode.NORMAL_PHOTO);
            // 使用默认的预览配置
            const previewProfile = outputCapability.previewProfiles[0];
            this.previewOutput = this.cameraManager.createPreviewOutput(previewProfile, this.surfaceId);
            this.session = this.cameraManager.createSession(camera.SceneMode.NORMAL_PHOTO);
            if (this.session === undefined) {
                console.error("创建会话失败");
                return;
            }
            this.session.beginConfig();
            this.session.addInput(this.cameraInput);
            this.session.addOutput(this.previewOutput);
            await this.session.commitConfig();
            await this.session.start();
            // 启动扫描线动画
            this.isAnimating = true;
            console.info('会话已启动，预览应该可见了！');
        }
        catch (error) {
            const err = error as BusinessError;
            console.error(`相机初始化失败，错误码: ${err.code}, 信息: ${err.message}`);
            this.isCameraInitialized = false;
        }
    }
    // 释放相机资源
    async releaseCamera() {
        console.info('开始释放相机资源...');
        // 停止动画
        this.isAnimating = false;
        this.isCameraInitialized = false;
        try {
            if (this.session) {
                await this.session.stop();
                this.session.release();
                this.session = undefined;
            }
            if (this.cameraInput) {
                await this.cameraInput.close();
                this.cameraInput = undefined;
            }
            if (this.previewOutput) {
                await this.previewOutput.release();
                this.previewOutput = undefined;
            }
        }
        catch (error) {
            console.error(`释放相机资源失败: ${JSON.stringify(error)}`);
        }
    }
    // 模拟扫码成功后的处理
    async handleScanSuccess() {
        await this.releaseCamera(); // 释放相机
        promptAction.showToast({ message: '入库成功！', bottom: '50%' });
        // 延迟1秒后返回，让用户能看到提示
        setTimeout(() => {
            this.goBack();
        }, 1000);
    }
    // 返回上一页
    goBack(): void {
        router.back();
    }
    // --- 【新增部分】 使用Canvas绘制四个角 ---
    ScanCorners(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Canvas.create(this.canvasContext);
            Canvas.width(250);
            Canvas.height(250);
            Canvas.onReady(() => {
                // --- 可自定义参数 ---
                const cornerLength: number = 20; // 角的边长
                const lineWidth: number = 4; // 线的宽度
                const lineColor: string = '#00FF00'; // 线的颜色（绿色）
                // --------------------
                const size = 250; // 画布尺寸
                const ctx = this.canvasContext;
                // 设置线段样式
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = lineColor;
                // 清除旧的绘制（如果需要重绘）
                ctx.clearRect(0, 0, size, size);
                // 绘制左上角
                ctx.beginPath();
                ctx.moveTo(cornerLength, 0);
                ctx.lineTo(0, 0);
                ctx.lineTo(0, cornerLength);
                ctx.stroke();
                // 绘制右上角
                ctx.beginPath();
                ctx.moveTo(size - cornerLength, 0);
                ctx.lineTo(size, 0);
                ctx.lineTo(size, cornerLength);
                ctx.stroke();
                // 绘制左下角
                ctx.beginPath();
                ctx.moveTo(0, size - cornerLength);
                ctx.lineTo(0, size);
                ctx.lineTo(cornerLength, size);
                ctx.stroke();
                // 绘制右下角
                ctx.beginPath();
                ctx.moveTo(size - cornerLength, size);
                ctx.lineTo(size, size);
                ctx.lineTo(size, size - cornerLength);
                ctx.stroke();
            });
        }, Canvas);
        Canvas.pop();
    }
    // --- 【修改部分】 ScanBox构建器 ---
    ScanBox(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width(250);
            Stack.height(250);
        }, Stack);
        // 1. 使用Canvas绘制四个角作为底层
        this.ScanCorners.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 2. 动画扫描线叠加在上面
            if (this.isAnimating) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Rect.create();
                        Context.animation({
                            duration: 2000,
                            curve: Curve.EaseInOut,
                            iterations: -1,
                            playMode: PlayMode.Normal,
                            onFinish: () => {
                                const start = this.scanLineTop;
                                this.scanLineTop = start === 0 ? 248 : 0;
                            }
                        });
                        Rect.width('98%');
                        Rect.height(3);
                        Rect.fill(Color.Green);
                        Rect.shadow({ radius: 10, color: Color.Green });
                        Rect.offset({ x: 0, y: this.scanLineTop });
                        Rect.onAppear(() => {
                            this.scanLineTop = 124;
                        });
                        Context.animation(null);
                    }, Rect);
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
    // --- build方法 (保持不变) ---
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor(Color.Black);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 1. 相机实时预览作为背景
            XComponent.create({
                id: 'scan_preview_xcomponent',
                type: 'surface',
                controller: this.xcomponentController
            }, "com.my.myapplication/entry");
            // 1. 相机实时预览作为背景
            XComponent.onLoad(async () => {
                this.surfaceId = this.xcomponentController.getXComponentSurfaceId();
                if (this.cameraManager) {
                    await this.initCamera();
                }
            });
            // 1. 相机实时预览作为背景
            XComponent.width('100%');
            // 1. 相机实时预览作为背景
            XComponent.height('100%');
        }, XComponent);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 2. 扫码UI遮罩层
            Column.create();
            // 2. 扫码UI遮罩层
            Column.width('100%');
            // 2. 扫码UI遮罩层
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 上部遮罩
            Rect.create();
            // 上部遮罩
            Rect.fill('rgba(0, 0, 0, 0.6)');
            // 上部遮罩
            Rect.layoutWeight(1);
            // 上部遮罩
            Rect.width('100%');
        }, Rect);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 中间透明区域和左右遮罩
            Row.create();
            // 中间透明区域和左右遮罩
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Rect.create();
            Rect.fill('rgba(0, 0, 0, 0.6)');
            Rect.layoutWeight(1);
            Rect.height(250);
        }, Rect);
        this.ScanBox.bind(this)();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Rect.create();
            Rect.fill('rgba(0, 0, 0, 0.6)');
            Rect.layoutWeight(1);
            Rect.height(250);
        }, Rect);
        // 中间透明区域和左右遮罩
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 下部遮罩和提示文字
            Column.create();
            // 下部遮罩和提示文字
            Column.width('100%');
            // 下部遮罩和提示文字
            Column.layoutWeight(1);
            // 下部遮罩和提示文字
            Column.backgroundColor('rgba(0, 0, 0, 0.6)');
            // 下部遮罩和提示文字
            Column.justifyContent(FlexAlign.Start);
            // 下部遮罩和提示文字
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('将二维码/条形码对准扫描框');
            Text.fontSize(16);
            Text.fontColor(Color.White);
            Text.margin({ top: 20 });
        }, Text);
        Text.pop();
        // 下部遮罩和提示文字
        Column.pop();
        // 2. 扫码UI遮罩层
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 3. 顶部返回按钮，覆盖在最上层
            Row.create();
            // 3. 顶部返回按钮，覆盖在最上层
            Row.width('100%');
            // 3. 顶部返回按钮，覆盖在最上层
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithChild({ type: ButtonType.Circle });
            Button.width(40);
            Button.height(40);
            Button.backgroundColor(Color.Black);
            Button.opacity(0.4);
            Button.onClick(() => this.goBack());
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777250, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.fillColor(Color.White);
        }, Image);
        Button.pop();
        // 3. 顶部返回按钮，覆盖在最上层
        Row.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Scan";
    }
}
registerNamedRoute(() => new Scan(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/Scan", pageFullPath: "entry/src/main/ets/pages/Scan", integratedHsp: "false", moduleType: "followWithHap" });
