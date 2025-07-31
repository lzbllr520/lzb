import { image } from '@kit.ImageKit';
import { camera } from '@kit.CameraKit';
import { fileIo as fs } from '@kit.CoreFileKit';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { BusinessError } from '@kit.BasicServicesKit';
import { common, abilityAccessCtrl, Permissions } from '@kit.AbilityKit';
import { router } from '@kit.ArkUI';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct CameraPage {
  // 相机预览所需对象
  private xcomponentController: XComponentController = new XComponentController();
  private surfaceId: string = '';
  private cameraManager?: camera.CameraManager;
  private cameraInput?: camera.CameraInput;
  private previewOutput?: camera.PreviewOutput;
  private session?: camera.Session;
  private photoOutput?: camera.PhotoOutput;
  private photoAccessHelper?: photoAccessHelper.PhotoAccessHelper;
  private isCameraInitialized: boolean = false;

  //状态管理 ---
  @State backBtnScale: number = 1;
  //控制显示相机预览还是照片预览
  @State isPreviewing: boolean = true;
  //用于在Image控件中显示捕获的照片
  @State capturedPixelMap: image.PixelMap | undefined = undefined;

  //数据和资源管理
  // 存储捕获到的照片的原始数据，用于保存
  private capturedBuffer: ArrayBuffer | undefined = undefined;
  // 存储image对象，以便在保存或取消后释放
  private capturedImageObject: image.Image | undefined = undefined;

  //安全保存按钮的配置
  private saveButtonOptions: SaveButtonOptions = {
    icon: SaveIconStyle.FULL_FILLED,
    text: SaveDescription.SAVE_IMAGE,
    buttonType: ButtonType.Capsule
  };

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
      } else {
        console.error('相机或存储权限被拒绝。');
        promptAction.showToast({ message: '需要相机和存储权限才能使用' });
        this.goBack();
      }
    } catch (error) {
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

    } catch (error) {
      const err = error as BusinessError;
      console.error(`相机初始化失败，错误码: ${err.code}, 信息: ${err.message}`);
      this.isCameraInitialized = false;
    }
  }

  setupPhotoCallbacks(): void {
    if (!this.photoOutput) return;
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
    } catch (error) {
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
    } catch (error) {
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
      } else {
        // 如果会话不存在，则完全重新初始化
        await this.initCamera();
      }
    } catch (e) {
      console.error('重启会话失败', e);
      // 如果失败，完全重新初始化相机
      await this.releaseCamera();
      await this.initCamera();
    }

    // 切换UI
    this.isPreviewing = true;
  }

  build() {
    Stack({ alignContent: Alignment.Bottom }) {
      //根据 isPreviewing 状态决定显示内容
      if (this.isPreviewing) {
        //相机实时预览
        XComponent({
          id: 'camera_preview_xcomponent',
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

        Column() {
          Row() {
            Button({ type: ButtonType.Circle }) {
              Image($r('app.media.left_arrow')).width(24).height(24).fillColor(Color.White)
            }
            .width(40).height(40).backgroundColor(Color.Black).opacity(0.4)
            .onClick(() => this.goBack())
          }.width('100%').justifyContent(FlexAlign.Start).padding({ top: 20, left: 20 })
          Blank()
          Row() {
            Button() {
              Text('拍照').fontSize(20).fontColor(Color.White)
            }
            .width(80).height(80).type(ButtonType.Circle).backgroundColor(Color.Gray).opacity(0.8)
            .onClick(() => this.triggerCapture())
          }.width('100%').justifyContent(FlexAlign.Center).padding({ bottom: 40 })
        }.width('100%').height('100%')

      } else {
        //照片预览和保存
        Column() {
          if (this.capturedPixelMap) {
            Image(this.capturedPixelMap)
              .objectFit(ImageFit.Contain)
              .layoutWeight(1)
          }

          // 底部操作栏
          Row({ space: 30 }) {
            // 重拍按钮
            Button({ type: ButtonType.Circle }) {
              Text('重拍').fontSize(18)
            }
            .width(80).height(80)
            .onClick(() => this.retakePhoto())

            //安全保存按钮
            SaveButton(this.saveButtonOptions)
              .width(180).height(50)
              .onClick(async (event, result: SaveButtonOnClickResult) => {
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

                  } catch (err) {
                    console.error(`使用安全控件保存失败: ${JSON.stringify(err)}`);
                    promptAction.showToast({ message: `保存失败: ${err.message}` });
                  } finally {
                    //无论成功与否，都删除临时文件
                    fs.unlink(tempFilePath).catch((e: BusinessError) => console.error('删除临时文件失败', `code: ${e.code}, message: ${e.message}`));
                  }
                } else {
                  console.error('用户取消保存或SaveButton点击失败');
                  promptAction.showToast({ message: '保存已取消' });
                }
              })
          }
          .width('100%')
          .justifyContent(FlexAlign.Center)

        }.width('100%').height('100%')
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.Black)
  }
}