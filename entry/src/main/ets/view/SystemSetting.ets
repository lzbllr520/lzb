import promptAction from '@ohos.promptAction';
import preferences from '@ohos.data.preferences';
import { router } from '@kit.ArkUI';

//持久化存储在本地的用户登录信息名称，准备用于退出登录时找到并删除登录信息数据
const PREFERENCES_FILE_NAME = 'login_prefs';
const KEY_SESSION_TOKEN = 'session_token';
const KEY_SESSION_EXPIRY = 'session_expiry';

@Component
export struct SystemSetting {
  // 假设这些是登录后获取的用户信息
  @State private username: string = 'Admin'
  @State private userRole: string = '管理员'

  addLog: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void = () => {};

  @Link avatar:Resource;


  //跳转到相机开发界面的函数
  openCamera() {
    router.pushUrl({url:'pages/Camera'})
  }

  logout() {
    AlertDialog.show({
      title: '操作确认',
      message: '是否退出此账户',
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
          action: async () => {

            try {
              //获取应用的 preferences 实例
              const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
              //删除存储的登录令牌和过期时间
              await prefs.delete(KEY_SESSION_TOKEN);
              await prefs.delete(KEY_SESSION_EXPIRY);
              //确保改动已写入磁盘
              await prefs.flush();

              this.addLog('error', '退出了系统登录', true)

              //给出用户提示
              promptAction.showToast({ message: '已退出登录' });
              //替换路由到登录页面
              router.replaceUrl({ url: 'pages/Login' });
            } catch (e) {
              console.error('Failed to clear login session', e);
              promptAction.showToast({ message: '退出登录时发生错误' });
            }
          }
        }
      ]
    });

  }

  build() {
    Column() {
      // 用户管理卡片
      this.UserManagementCard()
    }
    .width('100%')
    .height('100%')
    .padding(24)
    .justifyContent(FlexAlign.Start) // 从顶部开始排列
    .alignItems(HorizontalAlign.Center)
  }

  // 封装的用户管理卡片组件
  @Builder
  UserManagementCard() {
    Column() {
      // 用户信息区域
      Row() {
        // 头像
        Image(this.avatar) // 替换成你自己的头像资源
          .width(75)
          .height(75)
          .borderRadius(32)
          .objectFit(ImageFit.Cover)

        // 用户名和角色
        Column() {
          Text(this.username)
            .fontSize(19)
            .fontColor(Color.White)
            .fontWeight(FontWeight.Bold)
          Text(this.userRole)
            .fontSize(14)
            .fontColor(Color.White)
            .margin({ top: 4 })
        }
        .alignItems(HorizontalAlign.Start)
        .margin({ left: 40 })

        // 添加一个灵活的空白填充，将右侧的按钮推到最右边
        Blank()

        //相机按钮
        Button({ type: ButtonType.Circle, stateEffect: true }) {
          Image($r('app.media.camera'))
            .width(28)
            .height(28)
            .fillColor(Color.White)
        }
        .width(50)
        .height(50)
        .backgroundColor('rgba(255, 255, 255, 0.2)')
        .onClick(() => {
          // 点击按钮时调用 openCamera 方法
          this.openCamera();
        })
      }
      .width('100%')
      .alignItems(VerticalAlign.Center)

      //退出登录按钮
      Button('退出登录')
        .width('100%')
        .height(48)
        .fontSize(20)
        .fontWeight(FontWeight.Bold)
        .opacity(0.8)
        .backgroundColor('rgba(255, 80, 80, 0.4)')
        .border({
          width: 1,
          color: 'rgba(255, 255, 255, 0.3)'
        })
        .type(ButtonType.Capsule)
        .backgroundColor(Color.Red)
        .margin({ top: 30 })
        .onClick(() => {
          this.logout();
        })
    }
    .width('95%')
    .height('80%')
    .padding(40)
    .borderRadius(24)
    .shadow({ radius: 10, color: '#1824311F', offsetX: 2, offsetY: 4 })
  }
}