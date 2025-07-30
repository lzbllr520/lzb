if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CameraPage_Params {
    xcomponentController?: XComponentController;
    surfaceId?: string;
    cameraManager?: camera.CameraManager;
    cameraInput?: camera.CameraInput;
    previewOutput?: camera.PreviewOutput;
    session?: camera.Session;
    photoOutput?: camera.PhotoOutput;
    photoAccessHelper?: photoAccessHelper.PhotoAccessHelper;
    isCameraInitialized?: boolean;
    backBtnScale?: number;
    isPreviewing?: boolean;
    capturedPixelMap?: image.PixelMap | undefined;
    capturedBuffer?: ArrayBuffer | undefined;
    capturedImageObject?: image.Image | undefined;
    saveButtonOptions?: SaveButtonOptions;
}
import image from "@ohos:multimedia.image";
import camera from "@ohos:multimedia.camera";
import fs from "@ohos:file.fs";
import photoAccessHelper from "@ohos:file.photoAccessHelper";
import type { BusinessError as BusinessError } from "@ohos:base";
import type common from "@ohos:app.ability.common";
import abilityAccessCtrl from "@ohos:abilityAccessCtrl";
import type { Permissions as Permissions } from "@ohos:abilityAccessCtrl";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
class CameraPage extends ViewPU {
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
        this.photoOutput = undefined;
        this.photoAccessHelper = undefined;
        this.isCameraInitialized = false;
        this.__backBtnScale = new ObservedPropertySimplePU(1, this, "backBtnScale");
        this.__isPreviewing = new ObservedPropertySimplePU(true, this, "isPreviewing");
        this.__capturedPixelMap = new ObservedPropertyObjectPU(undefined, this, "capturedPixelMap");
        this.capturedBuffer = undefined;
        this.capturedImageObject = undefined;
        this.saveButtonOptions = {
            icon: SaveIconStyle.FULL_FILLED,
            text: SaveDescription.SAVE_IMAGE,
            buttonType: ButtonType.Capsule
        };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CameraPage_Params) {
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
        if (params.photoOutput !== undefined) {
            this.photoOutput = params.photoOutput;
        }
        if (params.photoAccessHelper !== undefined) {
            this.photoAccessHelper = params.photoAccessHelper;
        }
        if (params.isCameraInitialized !== undefined) {
            this.isCameraInitialized = params.isCameraInitialized;
        }
        if (params.backBtnScale !== undefined) {
            this.backBtnScale = params.backBtnScale;
        }
        if (params.isPreviewing !== undefined) {
            this.isPreviewing = params.isPreviewing;
        }
        if (params.capturedPixelMap !== undefined) {
            this.capturedPixelMap = params.capturedPixelMap;
        }
        if (params.capturedBuffer !== undefined) {
            this.capturedBuffer = params.capturedBuffer;
        }
        if (params.capturedImageObject !== undefined) {
            this.capturedImageObject = params.capturedImageObject;
        }
        if (params.saveButtonOptions !== undefined) {
            this.saveButtonOptions = params.saveButtonOptions;
        }
    }
    updateStateVars(params: CameraPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__backBtnScale.purgeDependencyOnElmtId(rmElmtId);
        this.__isPreviewing.purgeDependencyOnElmtId(rmElmtId);
        this.__capturedPixelMap.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__backBtnScale.aboutToBeDeleted();
        this.__isPreviewing.aboutToBeDeleted();
        this.__capturedPixelMap.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 相机预览所需对象
    private xcomponentController: XComponentController;
    private surfaceId: string;
    private cameraManager?: camera.CameraManager;
    private cameraInput?: camera.CameraInput;
    private previewOutput?: camera.PreviewOutput;
    private session?: camera.Session;
    private photoOutput?: camera.PhotoOutput;
    private photoAccessHelper?: photoAccessHelper.PhotoAccessHelper;
    private isCameraInitialized: boolean;
    //状态管理 ---
    private __backBtnScale: ObservedPropertySimplePU<number>;
    get backBtnScale() {
        return this.__backBtnScale.get();
    }
    set backBtnScale(newValue: number) {
        this.__backBtnScale.set(newValue);
    }
    //控制显示相机预览还是照片预览
    private __isPreviewing: ObservedPropertySimplePU<boolean>;
    get isPreviewing() {
        return this.__isPreviewing.get();
    }
    set isPreviewing(newValue: boolean) {
        this.__isPreviewing.set(newValue);
    }
    //用于在Image控件中显示捕获的照片
    private __capturedPixelMap: ObservedPropertyObjectPU<image.PixelMap | undefined>;
    get capturedPixelMap() {
        return this.__capturedPixelMap.get();
    }
    set capturedPixelMap(newValue: image.PixelMap | undefined) {
        this.__capturedPixelMap.set(newValue);
    }
    //数据和资源管理
    // 存储捕获到的照片的原始数据，用于保存
    private capturedBuffer: ArrayBuffer | undefined;
    // 存储image对象，以便在保存或取消后释放
    private capturedImageObject: image.Image | undefined;
    //安全保存按钮的配置
    private saveButtonOptions: SaveButtonOptions;
    async aboutToAppear() {
        const abilityContext = getContext(this) as common.UIAbilityContext;
        this.photoAccessHelper = photoAccessHelper.getPhotoAccessHelper(abilityContext);
        await this.checkAndRequestPermissions();
    }
    async aboutToDisappear() {
        await this.releaseCamera();
        //确保页面销毁时释放捕获的图片资源
        if (this.capturedImageObject) {
            this.capturedImageObject.release();
        }
        if (this.capturedPixelMap) {
            this.capturedPixelMap.release();
        }
    }
    // 相机权限的申请函数
    async checkAndRequestPermissions(): Promise<void> {
        const permissionList: Array<Permissions> = ['ohos.permission.CAMERA', 'ohos.permission.WRITE_MEDIA'];
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
                console.info('所有权限已授予，准备初始化相机。');
                this.cameraManager = camera.getCameraManager(context);
                if (this.surfaceId) {
                    await this.initCamera();
                }
            }
            else {
                console.error('相机或存储权限被拒绝。');
                promptAction.showToast({ message: '需要相机和存储权限才能使用' });
                this.goBack();
            }
        }
        catch (error) {
            console.error(`申请权限时发生异常: ${JSON.stringify(error)}`);
        }
    }
    // 初始化相机（预览+拍照）(无变动)
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
            const cameraDevice = cameras.find(cam => cam.cameraPosition === camera.CameraPosition.CAMERA_POSITION_BACK) ?? cameras[0];
            this.cameraInput = this.cameraManager.createCameraInput(cameraDevice);
            await this.cameraInput.open();
            console.info('相机输入已打开');
            const outputCapability = this.cameraManager.getSupportedOutputCapability(cameraDevice, camera.SceneMode.NORMAL_PHOTO);
            const previewProfile = outputCapability.previewProfiles[0];
            this.previewOutput = this.cameraManager.createPreviewOutput(previewProfile, this.surfaceId);
            console.info('预览输出已创建');
            const photoProfiles = outputCapability.photoProfiles;
            if (!photoProfiles) {
                console.error("设备不支持拍照输出");
                return;
            }
            this.photoOutput = this.cameraManager.createPhotoOutput(photoProfiles[0]);
            console.info('拍照输出已创建');
            //此函数内部逻辑已更新
            this.setupPhotoCallbacks();
            this.session = this.cameraManager.createSession(camera.SceneMode.NORMAL_PHOTO);
            if (this.session === undefined) {
                console.error("创建会话失败");
                return;
            }
            this.session.beginConfig();
            this.session.addInput(this.cameraInput);
            this.session.addOutput(this.previewOutput);
            this.session.addOutput(this.photoOutput);
            await this.session.commitConfig();
            this.configureCameraSettings(this.session as camera.PhotoSession);
            await this.session.start();
            console.info('会话已启动，预览应该可见了！');
        }
        catch (error) {
            const err = error as BusinessError;
            console.error(`相机初始化失败，错误码: ${err.code}, 信息: ${err.message}`);
            this.isCameraInitialized = false;
        }
    }
    setupPhotoCallbacks(): void {
        if (!this.photoOutput)
            return;
        this.photoOutput.on('photoAvailable', (err, photo) => {
            if (err || photo === undefined) {
                console.error('获取照片数据失败', JSON.stringify(err));
                return;
            }
            this.session?.stop();
            this.capturedImageObject = photo.main;
            //使用 getComponent 获取 buffer
            this.capturedImageObject.getComponent(image.ComponentType.JPEG, (err, component) => {
                if (err || !component?.byteBuffer) {
                    console.error('获取照片 JPEG 组件失败');
                    this.retakePhoto();
                    return;
                }
                this.capturedBuffer = component.byteBuffer;
                const imageSource = image.createImageSource(this.capturedBuffer);
                if (!imageSource) {
                    console.error('从buffer创建ImageSource失败');
                    this.retakePhoto();
                    return;
                }
                //用 ImageSource 创建 PixelMap
                imageSource.createPixelMap((err, pixelmap) => {
                    // 无论成功与否，都要释放临时的imageSource
                    imageSource.release();
                    if (err || !pixelmap) {
                        console.error('从ImageSource创建PixelMap失败', JSON.stringify(err));
                        this.retakePhoto();
                        return;
                    }
                    //将得到的 PixelMap 用于UI显示
                    this.capturedPixelMap = pixelmap;
                    //切换到照片预览界面
                    this.isPreviewing = false;
                });
            });
        });
    }
    configureCameraSettings(photoSession: camera.PhotoSession): void {
        try {
            if (photoSession.hasFlash() && photoSession.isFlashModeSupported(camera.FlashMode.FLASH_MODE_AUTO)) {
                photoSession.setFlashMode(camera.FlashMode.FLASH_MODE_AUTO);
            }
            if (photoSession.isFocusModeSupported(camera.FocusMode.FOCUS_MODE_CONTINUOUS_AUTO)) {
                photoSession.setFocusMode(camera.FocusMode.FOCUS_MODE_CONTINUOUS_AUTO);
            }
        }
        catch (error) {
            console.error('配置相机参数失败', JSON.stringify(error));
        }
    }
    triggerCapture(): void {
        if (!this.photoOutput) {
            console.error('拍照功能未就绪');
            return;
        }
        const settings: camera.PhotoCaptureSetting = {
            quality: camera.QualityLevel.QUALITY_LEVEL_HIGH,
            rotation: camera.ImageRotation.ROTATION_0,
            mirror: false
        };
        this.photoOutput.capture(settings, (err) => {
            if (err) {
                console.error(`请求拍照失败: ${err.code}`);
                return;
            }
            console.info('拍照请求已成功发送。');
        });
    }
    async releaseCamera() {
        console.info('开始释放相机资源...');
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
            if (this.photoOutput) {
                await this.photoOutput.release();
                this.photoOutput = undefined;
            }
        }
        catch (error) {
            console.error(`释放相机资源失败: ${JSON.stringify(error)}`);
        }
    }
    // goBack 函数 (无变动)
    goBack(): void {
        router.back();
    }
    //重拍照片/返回相机预览
    //清理已捕获的资源并切换回相机预览界面
    async retakePhoto() {
        // 释放捕获的图片资源
        if (this.capturedImageObject) {
            this.capturedImageObject.release();
            this.capturedImageObject = undefined;
        }
        if (this.capturedPixelMap) {
            this.capturedPixelMap.release();
            this.capturedPixelMap = undefined;
        }
        this.capturedPixelMap = undefined;
        this.capturedBuffer = undefined;
        // 重新启动相机预览
        try {
            if (this.session) {
                // 先确保会话已停止
                await this.session.stop();
                // 然后重新启动
                await this.session.start();
                console.info('相机会话已成功重启');
            }
            else {
                // 如果会话不存在，则完全重新初始化
                await this.initCamera();
            }
        }
        catch (e) {
            console.error('重启会话失败', e);
            // 如果失败，完全重新初始化相机
            await this.releaseCamera();
            await this.initCamera();
        }
        // 切换UI
        this.isPreviewing = true;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Bottom });
            Stack.width('100%');
            Stack.height('100%');
            Stack.backgroundColor(Color.Black);
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            //根据 isPreviewing 状态决定显示内容
            if (this.isPreviewing) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //相机实时预览
                        XComponent.create({
                            id: 'camera_preview_xcomponent',
                            type: 'surface',
                            controller: this.xcomponentController
                        }, "com.my.myapplication/entry");
                        //相机实时预览
                        XComponent.onLoad(async () => {
                            this.surfaceId = this.xcomponentController.getXComponentSurfaceId();
                            if (this.cameraManager) {
                                await this.initCamera();
                            }
                        });
                        //相机实时预览
                        XComponent.width('100%');
                        //相机实时预览
                        XComponent.height('100%');
                    }, XComponent);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Start);
                        Row.padding({ top: 20, left: 20 });
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
                        Image.create({ "id": 16777248, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(24);
                        Image.height(24);
                        Image.fillColor(Color.White);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Blank.create();
                    }, Blank);
                    Blank.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.Center);
                        Row.padding({ bottom: 40 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild();
                        Button.width(80);
                        Button.height(80);
                        Button.type(ButtonType.Circle);
                        Button.backgroundColor(Color.Gray);
                        Button.opacity(0.8);
                        Button.onClick(() => this.triggerCapture());
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('拍照');
                        Text.fontSize(20);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //照片预览和保存
                        Column.create();
                        //照片预览和保存
                        Column.width('100%');
                        //照片预览和保存
                        Column.height('100%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.capturedPixelMap) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Image.create(this.capturedPixelMap);
                                    Image.objectFit(ImageFit.Contain);
                                    Image.layoutWeight(1);
                                }, Image);
                            });
                        }
                        // 底部操作栏
                        else {
                            this.ifElseBranchUpdateFunction(1, () => {
                            });
                        }
                    }, If);
                    If.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 底部操作栏
                        Row.create({ space: 30 });
                        // 底部操作栏
                        Row.width('100%');
                        // 底部操作栏
                        Row.justifyContent(FlexAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 重拍按钮
                        Button.createWithChild({ type: ButtonType.Circle });
                        // 重拍按钮
                        Button.width(80);
                        // 重拍按钮
                        Button.height(80);
                        // 重拍按钮
                        Button.onClick(() => this.retakePhoto());
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('重拍');
                        Text.fontSize(18);
                    }, Text);
                    Text.pop();
                    // 重拍按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //安全保存按钮
                        SaveButton.create(this.saveButtonOptions);
                        //安全保存按钮
                        SaveButton.width(180);
                        //安全保存按钮
                        SaveButton.height(50);
                        //安全保存按钮
                        SaveButton.onClick(async (event, result: SaveButtonOnClickResult) => {
                            if (result === SaveButtonOnClickResult.SUCCESS) {
                                if (!this.capturedBuffer || !this.photoAccessHelper) {
                                    console.error('Buffer或Helper为空，无法保存');
                                    promptAction.showToast({ message: '保存失败，请重试' });
                                    return;
                                }
                                const context = getContext(this) as common.UIAbilityContext;
                                const tempFilePath = `${context.filesDir}/temp_${new Date().getTime()}.jpg`;
                                try {
                                    //将buffer写入应用沙箱内的临时文件
                                    const file = fs.openSync(tempFilePath, fs.OpenMode.CREATE | fs.OpenMode.READ_WRITE);
                                    fs.writeSync(file.fd, this.capturedBuffer);
                                    fs.closeSync(file);
                                    //使用临时文件的URI，在安全控件授权下创建媒体资源
                                    const fileUri = `file://${tempFilePath}`;
                                    const assetChangeRequest = photoAccessHelper.MediaAssetChangeRequest.createImageAssetRequest(context, fileUri);
                                    await this.photoAccessHelper.applyChanges(assetChangeRequest);
                                    promptAction.showToast({ message: '保存成功!' });
                                    console.info('照片已通过安全控件保存, uri: ' + assetChangeRequest.getAsset().uri);
                                    //保存成功后，返回相机界面
                                    this.retakePhoto(); // 复用retake逻辑来清理和切换界面
                                }
                                catch (err) {
                                    console.error(`使用安全控件保存失败: ${JSON.stringify(err)}`);
                                    promptAction.showToast({ message: `保存失败: ${err.message}` });
                                }
                                finally {
                                    //无论成功与否，都删除临时文件
                                    fs.unlink(tempFilePath).catch((e: BusinessError) => console.error('删除临时文件失败', `code: ${e.code}, message: ${e.message}`));
                                }
                            }
                            else {
                                console.error('用户取消保存或SaveButton点击失败');
                                promptAction.showToast({ message: '保存已取消' });
                            }
                        });
                    }, SaveButton);
                    // 底部操作栏
                    Row.pop();
                    //照片预览和保存
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "CameraPage";
    }
}
registerNamedRoute(() => new CameraPage(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/Camera", pageFullPath: "entry/src/main/ets/pages/Camera", integratedHsp: "false", moduleType: "followWithHap" });
