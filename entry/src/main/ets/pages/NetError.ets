import { common } from '@kit.AbilityKit';
import { promptAction } from '@kit.ArkUI';

@Entry
@Component
struct NetError {

  @State bgOpacity: number = 0;

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

  async aboutToAppear() {
    try {
      //控制背景缓慢显示动画
      animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
        this.bgOpacity = 1;
      })
    } catch (exception) {
      promptAction.showToast({message:'页面初始化函数执行失败',bottom:'50%',duration:1000})
    }
  }

  build() {
    Stack({ alignContent: Alignment.Center }){
      Image($r('app.media.zb'))
        .width('100%')
        .height('100%')
        .objectFit(ImageFit.Cover)
        .opacity(this.bgOpacity)
      Column({space:20}){
        Row({space:20}){
          Image($r('app.media.warning'))
            .width(90)
            .height(90)
          Text('与服务器连接失败！')
            .fontSize(30)
            .fontColor(Color.White)
            .fontWeight(FontWeight.Bold)
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
        Row(){
          Text('可进行的操作：长按退出应用手动重启')
            .fontSize(15)
            .fontColor(Color.White)
        }
        .width('100%')
        .justifyContent(FlexAlign.Center)
      }
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .alignItems(HorizontalAlign.Center)
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#0E1307')
    .gesture(
      LongPressGesture() // 使用默认参数，长按500ms触发
        .onAction(() => {
          // 触发长按后，调用显示弹窗的函数，确认退出应用
          this.showExitDialog();
        })
    )
  }
}