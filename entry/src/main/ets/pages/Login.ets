
import router from '@ohos.router';
import promptAction from '@ohos.promptAction';
import preferences from '@ohos.data.preferences';
import { common } from '@kit.AbilityKit';
import { window } from '@kit.ArkUI';

// 导入鸿蒙官方加密框架和 buffer 工具
import { cryptoFramework } from '@kit.CryptoArchitectureKit';
import { buffer } from '@kit.ArkTS';
import { hilog } from '@kit.PerformanceAnalysisKit';

// 定义存储中使用的常量，避免魔法字符串
const PREFERENCES_FILE_NAME = 'login_prefs';// 存储文件的名称
const KEY_SESSION_TOKEN = 'session_token';// 存储登录令牌的键
const KEY_SESSION_EXPIRY = 'session_expiry'; // 存储过期时间的键
const LOGIN_EXPIRY_DAYS = 7;// 设置登录有效期为 7 天

//将16进制字符串转换为 Uint8Array
function hexToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error('Invalid hex string');
  }
  const bytes = new Uint8Array(hexString.length / 2);
  for (let i = 0; i < hexString.length; i += 2) {
    bytes[i / 2] = parseInt(hexString.substring(i, i + 2), 16);
  }
  return bytes;
}

@Entry
@Component
struct Login {

  @State username: string = '';
  @State password: string = '';
  @State bgScale: number = 1.0;
  @State isButtonPressed: boolean = false;

  @State bgOpacity: number = 0;

  private context = getContext(this) as common.UIAbilityContext // 获取应用上下文

  //初始化公钥对象
  @State private pubKey: cryptoFramework.PubKey | null = null;

  async aboutToAppear() {
    try {
      // 使用 await 等待 Promise 返回结果
      const win = await window.getLastWindow(this.context);
      //控制背景缓慢显示动画
      animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
        this.bgOpacity = 1;
      })
    } catch (exception) {
      promptAction.showToast({message:'页面初始化函数执行失败',bottom:'50%',duration:1000})
    }

    // 初始化加密模块的公钥
    await this.initPublicKey();
  }

  /**
   * 初始化 SM2 公钥的函数
   */
  async initPublicKey() {
    try {
      // 使用我们之前确认过的预设公钥
      const presetPublicKeyHex = '0467c5dd4de7e975469e8145dda8fd6c50dba0f738e0130fcc43e97ab761b838f1f87f90ababf473802e580cb5df506edf232ad09995afd174333b77e24c643b07';
      const rawPublicKeyBytes = hexToUint8Array(presetPublicKeyHex);
      const derHeader = new Uint8Array([
        0x30, 0x59, 0x30, 0x13, 0x06, 0x07, 0x2A, 0x86, 0x48, 0xCE, 0x3D, 0x02, 0x01, 0x06, 0x08, 0x2A,
        0x81, 0x1C, 0xCF, 0x55, 0x01, 0x82, 0x2D, 0x03, 0x42, 0x00
      ]);
      const fullPublicKeyDer = new Uint8Array(derHeader.length + rawPublicKeyBytes.length);
      fullPublicKeyDer.set(derHeader, 0);
      fullPublicKeyDer.set(rawPublicKeyBytes, derHeader.length);

      const pubKeyBlob: cryptoFramework.DataBlob = { data: fullPublicKeyDer };
      const sm2Generator = cryptoFramework.createAsyKeyGenerator('SM2_256');
      const keyPair = await sm2Generator.convertKey(pubKeyBlob, null);
      this.pubKey = keyPair.pubKey;
    } catch (err) {
      promptAction.showToast({ message: `加密模块初始化失败: ${JSON.stringify(err)}`, bottom: '50%', duration: 2000 });
    }
  }

  /**
   * 加密密码的函数
   * @param plainPassword - 需要加密的明文密码
   * @returns 加密后的Base64密文，或在失败时返回null
   */
  async encryptPassword(plainPassword: string): Promise<string | null> {
    if (!this.pubKey) {
      promptAction.showToast({ message: '公钥未就绪，无法加密', bottom: '50%', duration: 1000 });
      return null;
    }
    try {
      const plainTextBlob: cryptoFramework.DataBlob = { data: new Uint8Array(buffer.from(plainPassword, 'utf-8').buffer) };
      const cipher = cryptoFramework.createCipher('SM2_256|SM3');
      await cipher.init(cryptoFramework.CryptoMode.ENCRYPT_MODE, this.pubKey, null);
      const encryptedBlob = await cipher.doFinal(plainTextBlob);

      if (encryptedBlob?.data) {
        return buffer.from(encryptedBlob.data).toString('base64');
      }
      return null;
    } catch (err) {
      promptAction.showToast({ message: `密码加密失败: ${JSON.stringify(err)}`, bottom: '50%', duration: 2000 });
      return null;
    }
  }

  //退出应用确认和执行函数
  private showExitDialog() {
    // 获取UIAbility的上下文，用于调用terminateSelf方法
    const context = getContext(this) as common.UIAbilityContext;
    //操作确认弹出框
    AlertDialog.show({
      title: '操作确认',
      message: '是否退出应用',
      autoCancel: true, // 点击对话框外部可取消
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
          fontColor: Color.Red, // 将确认按钮设为红色以示警示
          action: () => {
            context.terminateSelf();
          }
        }
      ]
    });
  }

  // 登录逻辑函数
  private async login() {
    if (!this.username || !this.password) {
      promptAction.showToast({ message: '用户名和密码不能为空', bottom: '50%', duration: 1000 });
      return;
    }
    //对用户输入的密码进行加密
    const encryptedPassword = await this.encryptPassword(this.password);
    // 如果加密过程出错，则函数终止
    if (!encryptedPassword) {
      promptAction.showToast({ message: '加密过程出错，无法登录', bottom: '50%', duration: 1000 });
      return;
    }
    //将加密结果输出到日志中
    hilog.info(0x0000, 'LoginCrypto', '==================== LOGIN PASSWORD ENCRYPTION RESULT (BASE64) ====================');
    hilog.info(0x0000, 'LoginCrypto', `Username: ${this.username}`);
    hilog.info(0x0000, 'LoginCrypto', `Encrypted Password: ${encryptedPassword}`);
    hilog.info(0x0000, 'LoginCrypto', '=============================================================================');
    // 不再验证，直接执行登录成功的后续操作
    try {
      const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
      const expiryTime = Date.now() + LOGIN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      await prefs.put(KEY_SESSION_TOKEN, 'LOGGED_IN_TOKEN');
      await prefs.put(KEY_SESSION_EXPIRY, expiryTime);
      await prefs.flush();
      promptAction.showToast({ message: '登录成功', bottom: '50%', duration: 1000 });
      router.replaceUrl({ url: 'pages/Index' });
    } catch (e) {
      promptAction.showToast({ message: '无法持久化存储登录信息，登录失败', bottom: '50%', duration: 1000 })
    }
  }

  build() {
    Stack({ alignContent: Alignment.Center }) {
      Image($r('app.media.zb'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .opacity(this.bgOpacity)

      Column() {
        Text('家电能效产线中控平台')
          .fontSize(32)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .margin({ bottom: 40 })

        Row() {
          Image($r("app.media.username"))
            .width(20)
            .height(20)
            .margin({ left: 15, right: 10 })
            .fillColor(Color.White)

          TextInput({ placeholder: '请输入用户名' })
            .maxLength(30)
            .placeholderColor('rgba(255, 255, 255, 0.6)')
            .fontColor(Color.White)
            .fontSize(18)
            .backgroundColor('transparent')
            .layoutWeight(1)
            .onChange((value) => { this.username = value; })
        }
        .width('85%')
        .height(55)
        .borderRadius(15)
        .backgroundColor('rgba(255, 255, 255, 0.15)')
        .border({ width: 1, color: 'rgba(255, 255, 255, 0.2)' })

        Row() {
          Image($r("app.media.password"))
            .width(20)
            .height(20)
            .margin({ left: 15, right: 10 })
            .fillColor(Color.White)

          TextInput({ placeholder: '请输入密码' })
            .maxLength(30)
            .type(InputType.Password)
            .placeholderColor('rgba(255, 255, 255, 0.6)')
            .fontColor(Color.White)
            .fontSize(18)
            .backgroundColor('transparent')
            .layoutWeight(1)
            .onChange((value) => { this.password = value; })
        }
        .width('85%')
        .height(55)
        .borderRadius(15)
        .backgroundColor('rgba(255, 255, 255, 0.15)')
        .border({ width: 1, color: 'rgba(255, 255, 255, 0.2)' })
        .margin({ top: 20 })

        Button('登 录')
          .width('60%')
          .height(55)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .backgroundColor('#1890ff')
          .borderRadius(15)
          .margin({ top: 40 })
          .scale({ x: this.isButtonPressed ? 0.97 : 1, y: this.isButtonPressed ? 0.97 : 1 })
          .animation({ duration: 150, curve: Curve.EaseInOut })
          .onClick(() => {
            //执行登录函数
            this.login();
          })
          .onTouch((event: TouchEvent) => {
            if (event.type === TouchType.Down) { this.isButtonPressed = true; }
            if (event.type === TouchType.Up || event.type === TouchType.Cancel) { this.isButtonPressed = false; }
          })
      }
      .width('50%')
      .padding({ top: 40, bottom: 40 })
      .backdropBlur(12)
      .backgroundColor('rgba(10, 10, 15, 0.3)')
      .borderRadius(16)
      //添加清晰的轮廓线
      .border({
        width: 1.5,
        color: 'rgba(255, 255, 255, 0.15)'
      })
      // 添加柔和的背景光晕
      .shadow({
        radius: 30,
        color: 'rgba(173, 216, 230, 0.2)',
        offsetX: 0,
        offsetY: 0
      })
    }
    .backgroundColor('#0E1307')
    .width('100%')
    .height('100%')
    .gesture(
      LongPressGesture() // 使用默认参数，长按500ms触发
        .onAction(() => {
          console.info('Long press detected, showing exit dialog.');
          // 触发长按后，调用显示弹窗的函数，确认退出应用
          this.showExitDialog();
        })
    )
  }
}