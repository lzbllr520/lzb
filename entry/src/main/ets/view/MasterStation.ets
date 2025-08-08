import { promptAction } from '@kit.ArkUI'

@Component
export struct MasterStation {

  @Link isLineRunning: boolean

  addLog: (level: 'info' | 'warning' | 'error', message: string,shouldSave:boolean) => void = () => {};

  //停止产线函数
  private stopLine() {
    AlertDialog.show({
      title: '操作确认',
      message: '是否停止产线运作',
      autoCancel: true,
      alignment: DialogAlignment.Center,
      buttons: [
        {
          value: '取消',
          action: () => {
            //用户点击取消，不做任何操作
          }
        },
        {
          value: '确认',
          fontColor: Color.Red,
          action: () => {
            promptAction.showToast({message:'关闭成功',bottom:'50%'})
            this.isLineRunning = false;
            this.addLog('warning','停止产线运行',true)
          }
        }
      ]
    })
  }

  //启动产线函数
  private startLine() {
    AlertDialog.show({
      title: '操作确认',
      message: '是否开启产线运作',
      autoCancel: true,
      alignment: DialogAlignment.Center,
      buttons: [
        {
          value: '取消',
          action: () => {
            //用户点击取消，不做任何操作
          }
        },
        {
          value: '确认',
          fontColor: Color.Red,
          action: () => {
            promptAction.showToast({message:'启动成功!',bottom:'50%'})
            this.isLineRunning = true;
            this.addLog('info','启动产线运行',true)
          }
        }
      ]
    });
  }

  build() {
    Column() {
      Row() {
        Button('启动产线运作')
          .onClick(() => this.startLine())
          .backgroundColor(this.isLineRunning ? Color.Gray : '#28a745')
          .enabled(!this.isLineRunning)

        Button('停止产线运作')
          .onClick(() => this.stopLine())
          .backgroundColor(this.isLineRunning ? '#dc3545' : Color.Gray)
          .enabled(this.isLineRunning)
      }
      .margin({top:20})
      .width('100%')
      .justifyContent(FlexAlign.SpaceEvenly)
    }
    .width('100%')
    .height('100%')
  }

}