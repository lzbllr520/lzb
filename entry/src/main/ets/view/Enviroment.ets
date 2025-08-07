import {ServerInfoView} from '../components/ServerInfoView'
import { Server } from '../model/ServerState'
import { promptAction } from '@kit.ArkUI'

@Component
export struct Environment {
  @State currentIndex: number=0
  @Prop servers: Server[] = []

  private controller: TabsController = new TabsController();

  build() {
    Column() {
        if (!this.servers || this.servers.length === 0) {
          Column() {
            Text('暂无服务器')
              .fontColor(Color.White)
              .fontWeight(FontWeight.Bolder)
              .fontSize(30)
              .opacity(0.8)
          }
          .width('100%')
          .height('100%')
          .justifyContent(FlexAlign.Center)
        } else {
          Row() {
            Tabs({
              controller: this.controller,
              barPosition: BarPosition.Start,
              index: this.currentIndex
            }) {
              ForEach(
                this.servers,
                (server: Server, index: number) => {
                  TabContent() {
                    Column() {
                      ServerInfoView({ server: server })
                    }
                    .width('100%')
                    .height('100%')
                  }
                  .tabBar(this.buildTabBar($r('app.media.server'), index))
                },
                (server: Server) => server.id
              )
            }
            .margin({left:10})
            .vertical(true)
            .barMode(BarMode.Fixed)
            .barWidth(60)
            .animationDuration(300)
            .onChange((index: number) => {
              this.currentIndex = index;
            })
            .layoutWeight(1)
          }
          .width('100%')
          .layoutWeight(1)
        }
    }
    .width('100%')
    .height('100%')
  }

  @Builder
  private buildTabBar(icon: Resource, index: number) {
    Column() {
      Image(icon)
        .width(18)
        .height(18)
        .fillColor(Color.White)
        .objectFit(ImageFit.Contain)
    }
    .width('90%')
    .aspectRatio(1)
    .justifyContent(FlexAlign.Center)
    .backgroundColor(this.currentIndex === index ? 'rgba(255, 255, 255, 0.25)' : Color.Transparent)
    .scale(this.currentIndex === index ? { x: 1.1, y: 1.1 } : { x: 1.0, y: 1.0 })
    .borderRadius(12)
    .animation({ duration: 200, curve: Curve.EaseInOut })
  }
}