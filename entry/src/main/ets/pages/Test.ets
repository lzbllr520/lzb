import webview from '@ohos.web.webview'



@Entry

@Component

export struct WebViewComponent{

  //控制器对象

  controller:WebviewController = new webview.WebviewController()



  build(){

    Row(){

      //加载网络页面

      Web({src:$rawfile('CloudOfPoints.html'),controller:this.controller})



    }.height('100%')

  }

}