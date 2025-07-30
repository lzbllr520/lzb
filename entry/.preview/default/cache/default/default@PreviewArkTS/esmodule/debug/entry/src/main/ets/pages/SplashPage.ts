if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SplashPage_Params {
}
import router from "@ohos:router";
import preferences from "@ohos:data.preferences";
import promptAction from "@ohos:promptAction";
import type { BusinessError as BusinessError } from "@ohos:base";
// 常量定义...
const PREFERENCES_FILE_NAME = 'login_prefs';
const KEY_SESSION_TOKEN = 'session_token';
const KEY_SESSION_EXPIRY = 'session_expiry';
class SplashPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SplashPage_Params) {
    }
    updateStateVars(params: SplashPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    async aboutToAppear() {
        console.info('[SplashPage] aboutToAppear: Starting init tasks.');
        try {
            // 【修改开始】
            // Promise.all 会返回一个包含所有结果的数组
            const results = await Promise.all([
                this.checkLoginSession(),
                this.preloadNextPageResources() // 任务二：预加载资源
            ]);
            // 通过数组索引来获取对应的结果，并显式声明类型
            const isLoggedIn: boolean = results[0];
            const preloadResult: boolean = results[1];
            // 【修改结束】
            console.info(`[SplashPage] Init tasks completed. User is ${isLoggedIn ? 'logged in' : 'not logged in'}.`);
            const targetPage = isLoggedIn ? 'pages/Index' : 'pages/Login';
            if (isLoggedIn) {
                promptAction.showToast({ message: '欢迎回来' });
            }
            router.replaceUrl({ url: targetPage }, router.RouterMode.Single, (err: BusinessError) => {
                if (err) {
                    console.error(`Invoke replaceUrl to ${targetPage} failed, code is ${err.code}, message is ${err.message}`);
                }
            });
        }
        catch (error) {
            console.error('[SplashPage] Failed to initialize the app.', error);
            router.replaceUrl({ url: 'pages/Login' });
        }
    }
    // 任务一：检查登录状态 (与之前相同)
    private async checkLoginSession(): Promise<boolean> {
        try {
            const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
            const token = await prefs.get(KEY_SESSION_TOKEN, "");
            const expiry = await prefs.get(KEY_SESSION_EXPIRY, 0) as number;
            // 【修改点】
            // 将对 token 的隐式判断，改为显式的、返回布尔值的比较操作
            return token !== '' && expiry > Date.now();
        }
        catch (e) {
            console.error('[SplashPage] Failed to check login session', e);
            // 出现错误时，安全起见返回 false
            return false;
        }
    }
    // 任务二：预加载下一个页面的资源
    private async preloadNextPageResources(): Promise<boolean> {
        console.info('[SplashPage] Starting resource preloading...');
        try {
            // 这里可以根据需要预加载不同类型的资源
            // 示例1: 预加载网络数据 (例如首页需要用到的用户信息、新闻列表等)
            // let httpRequest = http.createHttp();
            // let response = await httpRequest.request("https://api.example.com/user/profile");
            // AppStorage.SetOrCreate('userProfile', JSON.parse(response.result as string));
            // console.info('[SplashPage] User profile preloaded.');
            // 示例2: 预加载图片资源到缓存
            // 这在鸿蒙中没有直接的API，但可以通过创建Image组件并设置opacity为0的方式间接实现
            // （更简单的做法是确保图片本身经过优化，加载速度足够快）
            // 示例3: 预加载Lottie动画文件等
            console.info('[SplashPage] Resource preloading finished successfully.');
            return true;
        }
        catch (e) {
            console.error('[SplashPage] Failed to preload resources', e);
            return false; // 预加载失败不应阻塞主流程
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // UI部分保持轻量，与启动窗口视觉一致
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/SplashPage.ets(100:5)", "entry");
            // UI部分保持轻量，与启动窗口视觉一致
            Stack.width('100%');
            // UI部分保持轻量，与启动窗口视觉一致
            Stack.height('100%');
            // UI部分保持轻量，与启动窗口视觉一致
            Stack.backgroundColor({ "id": 16777241, "type": 10001, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777226, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/SplashPage.ets(101:7)", "entry");
            Image.width('100%');
            Image.height('100%');
            Image.objectFit(ImageFit.Cover);
        }, Image);
        // UI部分保持轻量，与启动窗口视觉一致
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SplashPage";
    }
}
registerNamedRoute(() => new SplashPage(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/SplashPage", pageFullPath: "entry/src/main/ets/pages/SplashPage", integratedHsp: "false", moduleType: "followWithHap" });
