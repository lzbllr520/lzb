if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SystemSetting_Params {
    username?: string;
    userRole?: string;
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    avatar?: Resource;
}
import promptAction from "@ohos:promptAction";
import preferences from "@ohos:data.preferences";
import router from "@ohos:router";
//持久化存储在本地的用户登录信息名称，准备用于退出登录时找到并删除登录信息数据
const PREFERENCES_FILE_NAME = 'login_prefs';
const KEY_SESSION_TOKEN = 'session_token';
const KEY_SESSION_EXPIRY = 'session_expiry';
export class SystemSetting extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('Admin', this, "username");
        this.__userRole = new ObservedPropertySimplePU('管理员', this, "userRole");
        this.addLog = () => { };
        this.__avatar = new SynchedPropertyObjectTwoWayPU(params.avatar, this, "avatar");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SystemSetting_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.userRole !== undefined) {
            this.userRole = params.userRole;
        }
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
    }
    updateStateVars(params: SystemSetting_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__userRole.purgeDependencyOnElmtId(rmElmtId);
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__userRole.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 假设这些是登录后获取的用户信息
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __userRole: ObservedPropertySimplePU<string>;
    get userRole() {
        return this.__userRole.get();
    }
    set userRole(newValue: string) {
        this.__userRole.set(newValue);
    }
    private addLog: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    private __avatar: SynchedPropertySimpleOneWayPU<Resource>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(newValue: Resource) {
        this.__avatar.set(newValue);
    }
    //跳转到相机开发界面的函数
    openCamera() {
        router.pushUrl({ url: 'pages/Camera' });
    }
    logout() {
        AlertDialog.show({
            title: '操作确认',
            message: '是否退出此账户',
            autoCancel: true,
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
                    fontColor: Color.Red,
                    action: async () => {
                        try {
                            //获取应用的 preferences 实例
                            const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
                            //删除存储的登录令牌和过期时间
                            await prefs.delete(KEY_SESSION_TOKEN);
                            await prefs.delete(KEY_SESSION_EXPIRY);
                            //确保改动已写入磁盘
                            await prefs.flush();
                            this.addLog('error', '退出了系统登录', true);
                            //给出用户提示
                            promptAction.showToast({ message: '已退出登录' });
                            //替换路由到登录页面
                            router.replaceUrl({ url: 'pages/Login' });
                        }
                        catch (e) {
                            console.error('Failed to clear login session', e);
                            promptAction.showToast({ message: '退出登录时发生错误' });
                        }
                    }
                }
            ]
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.padding(24);
            Column.justifyContent(FlexAlign.Start);
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        // 用户管理卡片
        this.UserManagementCard.bind(this)();
        Column.pop();
    }
    // 封装的用户管理卡片组件
    UserManagementCard(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('95%');
            Column.height('80%');
            Column.padding(40);
            Column.borderRadius(24);
            Column.shadow({ radius: 10, color: '#1824311F', offsetX: 2, offsetY: 4 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户信息区域
            Row.create();
            // 用户信息区域
            Row.width('100%');
            // 用户信息区域
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头像
            Image.create(this.avatar);
            // 头像
            Image.width(75);
            // 头像
            Image.height(75);
            // 头像
            Image.borderRadius(32);
            // 头像
            Image.objectFit(ImageFit.Cover);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名和角色
            Column.create();
            // 用户名和角色
            Column.alignItems(HorizontalAlign.Start);
            // 用户名和角色
            Column.margin({ left: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.username);
            Text.fontSize(19);
            Text.fontColor(Color.White);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.userRole);
            Text.fontSize(14);
            Text.fontColor(Color.White);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        // 用户名和角色
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加一个灵活的空白填充，将右侧的按钮推到最右边
            Blank.create();
        }, Blank);
        // 添加一个灵活的空白填充，将右侧的按钮推到最右边
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //相机按钮
            Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
            //相机按钮
            Button.width(50);
            //相机按钮
            Button.height(50);
            //相机按钮
            Button.backgroundColor('rgba(255, 255, 255, 0.2)');
            //相机按钮
            Button.onClick(() => {
                // 点击按钮时调用 openCamera 方法
                this.openCamera();
            });
        }, Button);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777230, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(28);
            Image.height(28);
            Image.fillColor(Color.White);
        }, Image);
        //相机按钮
        Button.pop();
        // 用户信息区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //退出登录按钮
            Button.createWithLabel('退出登录');
            //退出登录按钮
            Button.width('100%');
            //退出登录按钮
            Button.height(48);
            //退出登录按钮
            Button.fontSize(20);
            //退出登录按钮
            Button.fontWeight(FontWeight.Bold);
            //退出登录按钮
            Button.opacity(0.8);
            //退出登录按钮
            Button.backgroundColor('rgba(255, 80, 80, 0.4)');
            //退出登录按钮
            Button.border({
                width: 1,
                color: 'rgba(255, 255, 255, 0.3)'
            });
            //退出登录按钮
            Button.type(ButtonType.Capsule);
            //退出登录按钮
            Button.backgroundColor(Color.Red);
            //退出登录按钮
            Button.margin({ top: 30 });
            //退出登录按钮
            Button.onClick(() => {
                this.logout();
            });
        }, Button);
        //退出登录按钮
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
