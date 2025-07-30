if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Login_Params {
    username?: string;
    password?: string;
    bgScale?: number;
    isButtonPressed?: boolean;
    bgOpacity?: number;
    context?;
}
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import window from "@ohos:window";
// 定义存储中使用的常量，避免魔法字符串
const PREFERENCES_FILE_NAME = 'login_prefs'; // 存储文件的名称
const KEY_SESSION_TOKEN = 'session_token'; // 存储登录令牌的键
const KEY_SESSION_EXPIRY = 'session_expiry'; // 存储过期时间的键
const LOGIN_EXPIRY_DAYS = 7; // 设置登录有效期为 7 天
class Login extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__bgScale = new ObservedPropertySimplePU(1.0, this, "bgScale");
        this.__isButtonPressed = new ObservedPropertySimplePU(false, this, "isButtonPressed");
        this.__bgOpacity = new ObservedPropertySimplePU(0, this, "bgOpacity");
        this.context = getContext(this) as common.UIAbilityContext // 获取应用上下文
        ;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Login_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.bgScale !== undefined) {
            this.bgScale = params.bgScale;
        }
        if (params.isButtonPressed !== undefined) {
            this.isButtonPressed = params.isButtonPressed;
        }
        if (params.bgOpacity !== undefined) {
            this.bgOpacity = params.bgOpacity;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
    }
    updateStateVars(params: Login_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__bgScale.purgeDependencyOnElmtId(rmElmtId);
        this.__isButtonPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__bgOpacity.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__bgScale.aboutToBeDeleted();
        this.__isButtonPressed.aboutToBeDeleted();
        this.__bgOpacity.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __bgScale: ObservedPropertySimplePU<number>;
    get bgScale() {
        return this.__bgScale.get();
    }
    set bgScale(newValue: number) {
        this.__bgScale.set(newValue);
    }
    private __isButtonPressed: ObservedPropertySimplePU<boolean>;
    get isButtonPressed() {
        return this.__isButtonPressed.get();
    }
    set isButtonPressed(newValue: boolean) {
        this.__isButtonPressed.set(newValue);
    }
    private __bgOpacity: ObservedPropertySimplePU<number>;
    get bgOpacity() {
        return this.__bgOpacity.get();
    }
    set bgOpacity(newValue: number) {
        this.__bgOpacity.set(newValue);
    }
    private context; // 获取应用上下文
    async aboutToAppear() {
        try {
            // 使用 await 等待 Promise 返回结果
            const win = await window.getLastWindow(this.context);
            //控制背景缓慢显示动画
            Context.animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
                this.bgOpacity = 1;
            });
        }
        catch (exception) {
            promptAction.showToast({ message: '页面初始化函数执行失败', bottom: '50%', duration: 1000 });
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
                    action: () => {
                        context.terminateSelf();
                    }
                }
            ]
        });
    }
    // 登录逻辑函数
    private async login() {
        if (this.username === 'admin' && this.password === 'admin') {
            try {
                //登录成功后，存储会话信息
                const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
                // 计算过期时间戳（从现在开始的毫秒数）
                const expiryTime = Date.now() + LOGIN_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
                // 存储令牌和过期时间
                // 在真实项目中，'LOGGED_IN_TOKEN' 应该是由服务器返回的真实令牌
                await prefs.put(KEY_SESSION_TOKEN, 'LOGGED_IN_TOKEN');
                await prefs.put(KEY_SESSION_EXPIRY, expiryTime);
                // 确保数据写入磁盘
                await prefs.flush();
                //登录成功弹窗
                promptAction.showToast({ message: '登录成功', bottom: '50%', duration: 1000 });
                //页面跳转到主页
                router.replaceUrl({ url: 'pages/Index' });
            }
            catch (e) {
                promptAction.showToast({ message: '登录出错，无法保存登录信息', bottom: '50%', duration: 1000 });
            }
        }
        else {
            promptAction.showToast({ message: '用户名或密码错误', bottom: '50%', duration: 1000 });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.Center });
            Stack.backgroundColor('#0E1307');
            Stack.width('100%');
            Stack.height('100%');
            Gesture.create(GesturePriority.Low);
            LongPressGesture.create();
            LongPressGesture.onAction(() => {
                console.info('Long press detected, showing exit dialog.');
                // 触发长按后，调用显示弹窗的函数，确认退出应用
                this.showExitDialog();
            });
            LongPressGesture.pop();
            Gesture.pop();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777271, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
            Image.objectFit(ImageFit.Cover);
            Image.opacity(this.bgOpacity);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('50%');
            Column.padding({ top: 40, bottom: 40 });
            Column.backdropBlur(12);
            Column.backgroundColor('rgba(10, 10, 15, 0.3)');
            Column.borderRadius(16);
            Column.border({
                width: 1.5,
                color: 'rgba(255, 255, 255, 0.15)'
            });
            Column.shadow({
                radius: 30,
                color: 'rgba(173, 216, 230, 0.2)',
                offsetX: 0,
                offsetY: 0
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('家电能效产线中控平台');
            Text.fontSize(32);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(Color.White);
            Text.margin({ bottom: 40 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('85%');
            Row.height(55);
            Row.borderRadius(15);
            Row.backgroundColor('rgba(255, 255, 255, 0.15)');
            Row.border({ width: 1, color: 'rgba(255, 255, 255, 0.2)' });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777270, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(20);
            Image.height(20);
            Image.margin({ left: 15, right: 10 });
            Image.fillColor(Color.White);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入用户名' });
            TextInput.maxLength(30);
            TextInput.placeholderColor('rgba(255, 255, 255, 0.6)');
            TextInput.fontColor(Color.White);
            TextInput.fontSize(18);
            TextInput.backgroundColor('transparent');
            TextInput.layoutWeight(1);
            TextInput.onChange((value) => { this.username = value; });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('85%');
            Row.height(55);
            Row.borderRadius(15);
            Row.backgroundColor('rgba(255, 255, 255, 0.15)');
            Row.border({ width: 1, color: 'rgba(255, 255, 255, 0.2)' });
            Row.margin({ top: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777256, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width(20);
            Image.height(20);
            Image.margin({ left: 15, right: 10 });
            Image.fillColor(Color.White);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入密码' });
            TextInput.maxLength(30);
            TextInput.type(InputType.Password);
            TextInput.placeholderColor('rgba(255, 255, 255, 0.6)');
            TextInput.fontColor(Color.White);
            TextInput.fontSize(18);
            TextInput.backgroundColor('transparent');
            TextInput.layoutWeight(1);
            TextInput.onChange((value) => { this.password = value; });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('登 录');
            Context.animation({ duration: 150, curve: Curve.EaseInOut });
            Button.width('60%');
            Button.height(55);
            Button.fontSize(20);
            Button.fontWeight(FontWeight.Bold);
            Button.fontColor(Color.White);
            Button.backgroundColor('#1890ff');
            Button.borderRadius(15);
            Button.margin({ top: 40 });
            Button.scale({ x: this.isButtonPressed ? 0.97 : 1, y: this.isButtonPressed ? 0.97 : 1 });
            Context.animation(null);
            Button.onClick(() => {
                //执行登录函数
                this.login();
            });
            Button.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.isButtonPressed = true;
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isButtonPressed = false;
                }
            });
        }, Button);
        Button.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Login";
    }
}
registerNamedRoute(() => new Login(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/Login", pageFullPath: "entry/src/main/ets/pages/Login", integratedHsp: "false", moduleType: "followWithHap" });
