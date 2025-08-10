import { camera } from '@kit.CameraKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { common, abilityAccessCtrl, Permissions } from '@kit.AbilityKit';
import { router } from '@kit.ArkUI';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct Scan {
  // --- 相机预览所需对象 ---
  private xcomponentController: XComponentController = new XComponentController();
  private surfaceId: string = '';
  private cameraManager?: camera.CameraManager;
  private cameraInput?: camera.CameraInput;
  private previewOutput?: camera.PreviewOutput;
  private session?: camera.Session;
  private isCameraInitialized: boolean = false;

  // Canvas 2D渲染上下文
  private canvasContext: CanvasRenderingContext2D = new CanvasRenderingContext2D();

  // --- 状态管理 ---
  @State scanLineTop: number = -124;
  @State isAnimating: boolean = false;

  async aboutToAppear() {
    await this.checkAndRequestPermissions();
    setTimeout(() => {
      if (this.isAnimating) {
        this.handleScanSuccess();
      }
    }, 6000)
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
      } else {
        console.error('相机权限被拒绝。');
        promptAction.showToast({ message: '需要相机权限才能进行扫码' });
        this.goBack();
      }
    } catch (error) {
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

    } catch (error) {
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
    } catch (error) {
      console.error(`释放相机资源失败: ${JSON.stringify(error)}`);
    }
  }

  // 模拟扫码成功后的处理
  async handleScanSuccess() {
    await this.releaseCamera(); // 释放相机
    promptAction.showToast({ message: '入库成功！' ,bottom:'50%'});
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
  @Builder ScanCorners() {
    Canvas(this.canvasContext)
      .width(250)
      .height(250)
      .onReady(() => {
        // --- 可自定义参数 ---
        const cornerLength: number = 20; // 角的边长
        const lineWidth: number = 4;      // 线的宽度
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
      })
  }

  // --- 【修改部分】 ScanBox构建器 ---
  @Builder ScanBox() {
    Stack() {
      // 1. 使用Canvas绘制四个角作为底层
      this.ScanCorners()

      // 2. 动画扫描线叠加在上面
      if (this.isAnimating) {
        Rect()
          .width('98%')
          .height(3)
          .fill(Color.Green)
          .shadow({ radius: 10, color: Color.Green })
          .offset({ x: 0, y: this.scanLineTop })
          .onAppear(() => {
            this.scanLineTop = 124;
          })
          .animation({
            duration: 2000,
            curve: Curve.EaseInOut,
            iterations: -1,
            playMode: PlayMode.Normal,
            onFinish: () => {
              const start = this.scanLineTop;
              this.scanLineTop = start === 0 ? 248 : 0;
            }
          })
      }
    }
    .width(250)
    .height(250)
  }

  // --- build方法 (保持不变) ---
  build() {
    Stack({ alignContent: Alignment.TopStart }) {
      // 1. 相机实时预览作为背景
      XComponent({
        id: 'scan_preview_xcomponent',
        type: 'surface',
        controller: this.xcomponentController
      })
        .onLoad(async () => {
          this.surfaceId = this.xcomponentController.getXComponentSurfaceId();
          if (this.cameraManager) {
            await this.initCamera();
          }
        })
        .width('100%')
        .height('100%')

      // 2. 扫码UI遮罩层
      Column() {
        // 上部遮罩
        Rect().fill('rgba(0, 0, 0, 0.6)').layoutWeight(1).width('100%')

        // 中间透明区域和左右遮罩
        Row() {
          Rect().fill('rgba(0, 0, 0, 0.6)').layoutWeight(1).height(250)
          this.ScanBox()
          Rect().fill('rgba(0, 0, 0, 0.6)').layoutWeight(1).height(250)
        }.width('100%')

        // 下部遮罩和提示文字
        Column() {
          Text('将二维码/条形码对准扫描框')
            .fontSize(16)
            .fontColor(Color.White)
            .margin({ top: 20 })
        }
        .width('100%')
        .layoutWeight(1)
        .backgroundColor('rgba(0, 0, 0, 0.6)')
        .justifyContent(FlexAlign.Start)
        .alignItems(HorizontalAlign.Center)
      }
      .width('100%')
      .height('100%')

      // 3. 顶部返回按钮，覆盖在最上层
      Row() {
        Button({ type: ButtonType.Circle }) {
          Image($r('app.media.left_arrow')).width(24).height(24).fillColor(Color.White)
        }
        .width(40).height(40).backgroundColor(Color.Black).opacity(0.4)
        .onClick(() => this.goBack())
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.Black)
  }
}