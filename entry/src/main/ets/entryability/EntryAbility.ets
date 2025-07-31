import { AbilityConstant, ConfigurationConstant, UIAbility, Want } from '@kit.AbilityKit';
import { hilog } from '@kit.PerformanceAnalysisKit';
import { promptAction, window } from '@kit.ArkUI';
import { BusinessError } from '@kit.BasicServicesKit';
//导入持久化存储模块
import preferences from '@ohos.data.preferences';
//倒入测试连接请求接口
import {checkApiStatus} from '../service/Request'

//从Login.ets移动过来的常量
const PREFERENCES_FILE_NAME = 'login_prefs';

const DOMAIN = 0x0000;

export default class EntryAbility extends UIAbility {

  private async checkLoginSession(): Promise<boolean> {
    try {
      // 注意：在Ability中，直接使用 this.context
      const prefs = await preferences.getPreferences(this.context, PREFERENCES_FILE_NAME);
      const token = await prefs.get('token','');
      if (token) {
        return true;
      }
    } catch (e) {
      console.error('[EntryAbility] Failed to check login session', e);
    }
    console.info('[EntryAbility] No valid session found.');
    return false;
  }

  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
    this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onCreate');
  }

  onDestroy(): void {
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onDestroy');
  }

  async  onWindowStageCreate(windowStage: window.WindowStage): Promise<void> {
    let  initialPage=''
    const isConnect:boolean=await checkApiStatus()
    if (!isConnect) {
      initialPage='pages/NetError'
    }else {
      const isLoggedIn = await this.checkLoginSession()
      initialPage = isLoggedIn ? 'pages/Index' : 'pages/Login'
    }

    if (initialPage==='pages/Index') {
      promptAction.showToast({ message: '欢迎回来，admin先生' ,bottom:'80%',duration:1000});
    }

    if (initialPage==='pages/NetError'){
      promptAction.showToast({ message: '应用无法与服务器连接' ,bottom:'80%',duration:1000});
    }



    // 设置应用要加载的初始页面
    windowStage.loadContent(initialPage, (err) => {
      if (err.code) {
        console.error('Failed to load the content. Cause:' + JSON.stringify(err));
        return;
      }
      console.info('Succeeded in loading the content.');
    });

    //获取应用主窗口
    let windowClass: window.Window | undefined = undefined;
    try {
      windowClass = windowStage.getMainWindowSync(); // 使用同步方法获取窗口，代码更简洁
      console.info('Succeeded in obtaining the main window.');

      //实现沉浸式效果 - 方式一：隐藏状态栏和导航栏
      // 参数为空数组 [] 表示隐藏状态栏和导航栏。
      // 如果只想隐藏状态栏，传入 ['status']
      // 如果只想隐藏导航栏，传入 ['navigation']
      let names: Array<'status' | 'navigation'> = [];
      windowClass.setWindowSystemBarEnable(names).then(() => {
        console.info('Succeeded in hiding system bars.');
      }).catch((err: BusinessError) => {
        console.error('Failed to hide system bars. Cause: ' + JSON.stringify(err));
      });

    } catch (err) {
      console.error('Failed to obtain the main window. Cause: ' + JSON.stringify(err));
    }
  }

  onWindowStageDestroy(): void {
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
  }

  onForeground(): void {
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onForeground');
  }

  onBackground(): void {
    hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onBackground');
  }
}