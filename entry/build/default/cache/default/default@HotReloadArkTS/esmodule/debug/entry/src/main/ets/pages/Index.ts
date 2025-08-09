if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NavigationItem_Params {
    index?: number;
    current?: number;
    icon?: Resource;
    selectedIcon?: Resource;
    text?: string;
    currentPage?: number;
    showSidebar?: boolean;
    selectedColor?: string;
    normalColor?: string;
    isPressed?: boolean;
    onNavigate?: (index: number) => void;
}
interface MainPage_Params {
    allLogItems?: LogEntry[];
    deviceManagerIndex?: number;
    conveyorData1?: ConveyorState;
    conveyorData2?: ConveyorState;
    dollyData?: DollyState;
    robot1Data?: RobotArmState;
    robot2Data?: RobotArmState;
    robot3Data?: RobotArmState;
    isLineRunning?: boolean;
    userAvatar?: Resource | undefined;
    conveyorAvatar?: Resource | undefined;
    dollyAvatar?: Resource | undefined;
    robotArmAvatar?: Resource | undefined;
    currentPage?: number;
    showSidebar?: boolean;
    context?;
    isSidebarButtonPressed?: boolean;
    servers?: Server[] | null;
    bgOpacity?: number;
}
import { MasterStation } from "@normalized:N&&&entry/src/main/ets/view/MasterStation&";
import { DeviceManager } from "@normalized:N&&&entry/src/main/ets/view/DeviceManager&";
import { TaskLog } from "@normalized:N&&&entry/src/main/ets/view/TaskLog&";
import { DataStatics } from "@normalized:N&&&entry/src/main/ets/view/DataStatics&";
import { SystemSetting } from "@normalized:N&&&entry/src/main/ets/view/SystemSetting&";
import window from "@ohos:window";
import type common from "@ohos:app.ability.common";
import { RobotArmState } from "@normalized:N&&&entry/src/main/ets/model/RobotArmState&";
import { ConveyorState } from "@normalized:N&&&entry/src/main/ets/model/ConveyorState&";
import { DollyState } from "@normalized:N&&&entry/src/main/ets/model/DollyState&";
import preferences from "@ohos:data.preferences";
import promptAction from "@ohos:promptAction";
import { getAllServers } from "@normalized:N&&&entry/src/main/ets/service/Request&";
import type { Server } from '../model/ServerState';
import { Environment } from "@normalized:N&&&entry/src/main/ets/view/Enviroment&";
//日志接口
interface LogEntry {
    id: number;
    level: 'info' | 'warning' | 'error';
    timestamp: string;
    message: string;
}
//用于持久化存储日志的变量
const PREFERENCES_FILE_NAME = 'app_main_data';
const KEY_LOG_ITEMS = 'all_log_items';
class MainPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__allLogItems = new ObservedPropertyObjectPU([], this, "allLogItems");
        this.__deviceManagerIndex = new ObservedPropertySimplePU(0, this, "deviceManagerIndex");
        this.__conveyorData1 = new ObservedPropertyObjectPU(new ConveyorState(), this, "conveyorData1");
        this.__conveyorData2 = new ObservedPropertyObjectPU(new ConveyorState(), this, "conveyorData2");
        this.__dollyData = new ObservedPropertyObjectPU(new DollyState(), this, "dollyData");
        this.__robot1Data = new ObservedPropertyObjectPU(new RobotArmState(), this, "robot1Data");
        this.__robot2Data = new ObservedPropertyObjectPU(new RobotArmState(), this, "robot2Data");
        this.__robot3Data = new ObservedPropertyObjectPU(new RobotArmState(), this, "robot3Data");
        this.__isLineRunning = new ObservedPropertySimplePU(false, this, "isLineRunning");
        this.__userAvatar = new ObservedPropertyObjectPU(undefined, this, "userAvatar");
        this.__conveyorAvatar = new ObservedPropertyObjectPU(undefined, this, "conveyorAvatar");
        this.__dollyAvatar = new ObservedPropertyObjectPU(undefined, this, "dollyAvatar");
        this.__robotArmAvatar = new ObservedPropertyObjectPU(undefined, this, "robotArmAvatar");
        this.__currentPage = new ObservedPropertySimplePU(0 // 当前页面索引，默认为0
        , this, "currentPage");
        this.__showSidebar = new ObservedPropertySimplePU(true // 控制侧边栏显示
        , this, "showSidebar");
        this.context = getContext(this) as common.UIAbilityContext // 获取应用上下文
        ;
        this.__isSidebarButtonPressed = new ObservedPropertySimplePU(false
        //侧边栏的显示与隐藏
        , this, "isSidebarButtonPressed");
        this.__servers = new ObservedPropertyObjectPU([]
        //页面的初始生命周期
        , this, "servers");
        this.__bgOpacity = new ObservedPropertySimplePU(0, this, "bgOpacity");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MainPage_Params) {
        if (params.allLogItems !== undefined) {
            this.allLogItems = params.allLogItems;
        }
        if (params.deviceManagerIndex !== undefined) {
            this.deviceManagerIndex = params.deviceManagerIndex;
        }
        if (params.conveyorData1 !== undefined) {
            this.conveyorData1 = params.conveyorData1;
        }
        if (params.conveyorData2 !== undefined) {
            this.conveyorData2 = params.conveyorData2;
        }
        if (params.dollyData !== undefined) {
            this.dollyData = params.dollyData;
        }
        if (params.robot1Data !== undefined) {
            this.robot1Data = params.robot1Data;
        }
        if (params.robot2Data !== undefined) {
            this.robot2Data = params.robot2Data;
        }
        if (params.robot3Data !== undefined) {
            this.robot3Data = params.robot3Data;
        }
        if (params.isLineRunning !== undefined) {
            this.isLineRunning = params.isLineRunning;
        }
        if (params.userAvatar !== undefined) {
            this.userAvatar = params.userAvatar;
        }
        if (params.conveyorAvatar !== undefined) {
            this.conveyorAvatar = params.conveyorAvatar;
        }
        if (params.dollyAvatar !== undefined) {
            this.dollyAvatar = params.dollyAvatar;
        }
        if (params.robotArmAvatar !== undefined) {
            this.robotArmAvatar = params.robotArmAvatar;
        }
        if (params.currentPage !== undefined) {
            this.currentPage = params.currentPage;
        }
        if (params.showSidebar !== undefined) {
            this.showSidebar = params.showSidebar;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.isSidebarButtonPressed !== undefined) {
            this.isSidebarButtonPressed = params.isSidebarButtonPressed;
        }
        if (params.servers !== undefined) {
            this.servers = params.servers;
        }
        if (params.bgOpacity !== undefined) {
            this.bgOpacity = params.bgOpacity;
        }
    }
    updateStateVars(params: MainPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__allLogItems.purgeDependencyOnElmtId(rmElmtId);
        this.__deviceManagerIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData1.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorData2.purgeDependencyOnElmtId(rmElmtId);
        this.__dollyData.purgeDependencyOnElmtId(rmElmtId);
        this.__robot1Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot2Data.purgeDependencyOnElmtId(rmElmtId);
        this.__robot3Data.purgeDependencyOnElmtId(rmElmtId);
        this.__isLineRunning.purgeDependencyOnElmtId(rmElmtId);
        this.__userAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__conveyorAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__dollyAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__robotArmAvatar.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPage.purgeDependencyOnElmtId(rmElmtId);
        this.__showSidebar.purgeDependencyOnElmtId(rmElmtId);
        this.__isSidebarButtonPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__servers.purgeDependencyOnElmtId(rmElmtId);
        this.__bgOpacity.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__allLogItems.aboutToBeDeleted();
        this.__deviceManagerIndex.aboutToBeDeleted();
        this.__conveyorData1.aboutToBeDeleted();
        this.__conveyorData2.aboutToBeDeleted();
        this.__dollyData.aboutToBeDeleted();
        this.__robot1Data.aboutToBeDeleted();
        this.__robot2Data.aboutToBeDeleted();
        this.__robot3Data.aboutToBeDeleted();
        this.__isLineRunning.aboutToBeDeleted();
        this.__userAvatar.aboutToBeDeleted();
        this.__conveyorAvatar.aboutToBeDeleted();
        this.__dollyAvatar.aboutToBeDeleted();
        this.__robotArmAvatar.aboutToBeDeleted();
        this.__currentPage.aboutToBeDeleted();
        this.__showSidebar.aboutToBeDeleted();
        this.__isSidebarButtonPressed.aboutToBeDeleted();
        this.__servers.aboutToBeDeleted();
        this.__bgOpacity.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    //处理页面跳转函数
    handleNavigation(index: number) {
        this.currentPage = index;
    }
    //保存日志函数
    async saveLogs() {
        try {
            const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
            // 将日志数组转换为 JSON 字符串
            const jsonString = JSON.stringify(this.allLogItems);
            //将字符串存入 preferences
            await prefs.put(KEY_LOG_ITEMS, jsonString);
            //确保数据写入磁盘
            await prefs.flush();
            //保存日志到本地成功
        }
        catch (e) {
            //保存日志到本地失败
        }
    }
    //从本地加载日志的异步函数
    async loadLogs() {
        try {
            const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
            //从 preferences 读取 JSON 字符串，如果不存在则返回一个空数组的字符串 '[]'
            const jsonString = await prefs.get(KEY_LOG_ITEMS, '[]') as string;
            //将字符串解析回对象数组
            const loadedLogs = JSON.parse(jsonString) as LogEntry[];
            this.allLogItems = loadedLogs;
            // 如果加载后一条日志都没有，则添加一条欢迎日志
            if (this.allLogItems.length === 0) {
                this.addLog('info', '欢迎来到家电能效检测中控平台！', false); // 首次加载不重复保存
            }
            //加载日志到应用上成功
        }
        catch (e) {
            promptAction.showToast({ message: '加载日志到应用上失败', bottom: '50%', duration: 1000 });
        }
    }
    //清除日志函数
    async clearAllLogs() {
        // 确认操作弹窗
        AlertDialog.show({
            title: '确认操作',
            message: '您确定要清除所有日志吗？此操作不可撤销。',
            alignment: DialogAlignment.Center,
            buttons: [
                {
                    value: '取消',
                    action: () => {
                    }
                },
                {
                    value: '确认清除',
                    fontColor: Color.Red,
                    action: async () => {
                        try {
                            //清空内存中的 @State 数组
                            this.allLogItems = [];
                            //清除本地存储中的日志
                            const prefs = await preferences.getPreferences(getContext(this), PREFERENCES_FILE_NAME);
                            await prefs.delete(KEY_LOG_ITEMS); // 使用 delete 删除对应的键
                            await prefs.flush();
                            //日志从本地和应用中清除成功
                            //添加一条清除记录
                            this.addLog('warning', '所有日志信息已被管理员清除。');
                            //清除成功提示
                            promptAction.showToast({ message: '清除日志成功', bottom: '50%', duration: 1000 });
                        }
                        catch (e) {
                            promptAction.showToast({ message: '清除日志失败', bottom: '50%', duration: 1000 });
                        }
                    }
                }
            ]
        });
    }
    private __allLogItems: ObservedPropertyObjectPU<LogEntry[]>;
    get allLogItems() {
        return this.__allLogItems.get();
    }
    set allLogItems(newValue: LogEntry[]) {
        this.__allLogItems.set(newValue);
    }
    //获取日志生成时间
    private getCurrentTime(): string {
        const now = new Date();
        const year = now.getFullYear();
        // getMonth() 返回的月份是从0开始的 (0-11)，所以需要加 1
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    //添加新日志的函数，这个函数将传递给子组件
    addLog(level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean = true) {
        const newLog: LogEntry = {
            id: this.allLogItems.length > 0 ? Math.max(...this.allLogItems.map(item => item.id)) + 1 : 1,
            level: level,
            timestamp: this.getCurrentTime(),
            message: message
        };
        this.allLogItems.unshift(newLog);
        //添加日志后，调用保存函数
        if (shouldSave) {
            this.saveLogs();
        }
    }
    //（组件销毁生命周期）组件销毁时进行一次保存，确保万无一失
    onDisappear() {
        this.saveLogs();
    }
    //状态提升
    //设备控制页面导航，默认为0
    private __deviceManagerIndex: ObservedPropertySimplePU<number>;
    get deviceManagerIndex() {
        return this.__deviceManagerIndex.get();
    }
    set deviceManagerIndex(newValue: number) {
        this.__deviceManagerIndex.set(newValue);
    }
    //保持一号传送带的数据
    private __conveyorData1: ObservedPropertyObjectPU<ConveyorState>;
    get conveyorData1() {
        return this.__conveyorData1.get();
    }
    set conveyorData1(newValue: ConveyorState) {
        this.__conveyorData1.set(newValue);
    }
    //保持二号传送带的数据
    private __conveyorData2: ObservedPropertyObjectPU<ConveyorState>;
    get conveyorData2() {
        return this.__conveyorData2.get();
    }
    set conveyorData2(newValue: ConveyorState) {
        this.__conveyorData2.set(newValue);
    }
    //保持小车的数据
    private __dollyData: ObservedPropertyObjectPU<DollyState>;
    get dollyData() {
        return this.__dollyData.get();
    }
    set dollyData(newValue: DollyState) {
        this.__dollyData.set(newValue);
    }
    //保持一号机械臂的数据
    private __robot1Data: ObservedPropertyObjectPU<RobotArmState>;
    get robot1Data() {
        return this.__robot1Data.get();
    }
    set robot1Data(newValue: RobotArmState) {
        this.__robot1Data.set(newValue);
    }
    //保持二号机械臂的数据
    private __robot2Data: ObservedPropertyObjectPU<RobotArmState>;
    get robot2Data() {
        return this.__robot2Data.get();
    }
    set robot2Data(newValue: RobotArmState) {
        this.__robot2Data.set(newValue);
    }
    //保持三号机械臂的数据
    private __robot3Data: ObservedPropertyObjectPU<RobotArmState>;
    get robot3Data() {
        return this.__robot3Data.get();
    }
    set robot3Data(newValue: RobotArmState) {
        this.__robot3Data.set(newValue);
    }
    //持久化产线是否运作信息
    private __isLineRunning: ObservedPropertySimplePU<boolean>;
    get isLineRunning() {
        return this.__isLineRunning.get();
    }
    set isLineRunning(newValue: boolean) {
        this.__isLineRunning.set(newValue);
    }
    //用来存储预先加载好的用户头像信息，这样切换到系统设置界面的话图片就不用再每次都重新加载
    private __userAvatar: ObservedPropertyObjectPU<Resource | undefined>;
    get userAvatar() {
        return this.__userAvatar.get();
    }
    set userAvatar(newValue: Resource | undefined) {
        this.__userAvatar.set(newValue);
    }
    //这些是提前加载好的设备图像
    private __conveyorAvatar: ObservedPropertyObjectPU<Resource | undefined>;
    get conveyorAvatar() {
        return this.__conveyorAvatar.get();
    }
    set conveyorAvatar(newValue: Resource | undefined) {
        this.__conveyorAvatar.set(newValue);
    }
    private __dollyAvatar: ObservedPropertyObjectPU<Resource | undefined>;
    get dollyAvatar() {
        return this.__dollyAvatar.get();
    }
    set dollyAvatar(newValue: Resource | undefined) {
        this.__dollyAvatar.set(newValue);
    }
    private __robotArmAvatar: ObservedPropertyObjectPU<Resource | undefined>;
    get robotArmAvatar() {
        return this.__robotArmAvatar.get();
    }
    set robotArmAvatar(newValue: Resource | undefined) {
        this.__robotArmAvatar.set(newValue);
    }
    private __currentPage: ObservedPropertySimplePU<number>; // 当前页面索引，默认为0
    get currentPage() {
        return this.__currentPage.get();
    }
    set currentPage(newValue: number) {
        this.__currentPage.set(newValue);
    }
    private __showSidebar: ObservedPropertySimplePU<boolean>; // 控制侧边栏显示
    get showSidebar() {
        return this.__showSidebar.get();
    }
    set showSidebar(newValue: boolean) {
        this.__showSidebar.set(newValue);
    }
    private context; // 获取应用上下文
    //侧边栏显示与隐藏按钮的点击动画控制变量
    private __isSidebarButtonPressed: ObservedPropertySimplePU<boolean>;
    get isSidebarButtonPressed() {
        return this.__isSidebarButtonPressed.get();
    }
    set isSidebarButtonPressed(newValue: boolean) {
        this.__isSidebarButtonPressed.set(newValue);
    }
    //侧边栏的显示与隐藏
    toggleSidebar() {
        this.showSidebar = !this.showSidebar;
    }
    private __servers: ObservedPropertyObjectPU<Server[] | null>;
    get servers() {
        return this.__servers.get();
    }
    set servers(newValue: Server[] | null) {
        this.__servers.set(newValue);
    }
    //页面的初始生命周期
    async aboutToAppear() {
        try {
            //获取所有服务器
            const servers: Server[] | null = await getAllServers();
            this.servers = servers;
            //先加载本地的日志到应用中
            this.loadLogs();
            //先将图像信息状态提升，这样就不用每次切换页面都去重新加载了
            this.userAvatar = { "id": 16777271, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" };
            this.conveyorAvatar = { "id": 16777233, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" };
            this.dollyAvatar = { "id": 16777239, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" };
            this.robotArmAvatar = { "id": 16777262, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" };
            //获取窗口对象
            const win = await window.getLastWindow(this.context);
            //背景缓慢显示动画控制代码
            Context.animateTo({ duration: 3000, curve: Curve.EaseInOut }, () => {
                this.bgOpacity = 1;
            });
        }
        catch (exception) {
            //页面初始生成周期函数执行出错
        }
    }
    //背景缓慢显示数值
    private __bgOpacity: ObservedPropertySimplePU<number>;
    get bgOpacity() {
        return this.__bgOpacity.get();
    }
    set bgOpacity(newValue: number) {
        this.__bgOpacity.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.TopStart });
            Stack.backgroundColor('#0E1307');
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777274, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width('100%');
            Image.height('100%');
            Image.objectFit(ImageFit.Cover);
            Image.opacity(this.bgOpacity);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 侧边栏
            Column.create();
            Context.animation({
                duration: 300,
                curve: Curve.EaseInOut
            });
            // 侧边栏
            Column.padding({ top: 10 });
            // 侧边栏
            Column.width(this.showSidebar ? '12%' : '6%');
            // 侧边栏
            Column.height('100%');
            // 侧边栏
            Column.justifyContent(FlexAlign.SpaceAround);
            // 侧边栏
            Column.backgroundEffect({
                radius: 40,
                saturation: 1.8,
                color: 'rgba(10, 10, 10, 0.2)' // 叠加一层半透明颜色，打造磨砂质感
            });
            // 侧边栏
            Column.border({
                width: { right: 1 },
                color: 'rgba(255, 255, 255, 0.2)'
            });
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showSidebar) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777249, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Context.animation({
                            duration: 100,
                            curve: Curve.EaseInOut
                        });
                        Image.width(18);
                        Image.height(18);
                        Image.scale({ x: this.isSidebarButtonPressed ? 0.85 : 1, y: this.isSidebarButtonPressed ? 0.85 : 1 });
                        Context.animation(null);
                        Image.onClick(() => {
                            this.isSidebarButtonPressed = true;
                            setTimeout(() => {
                                this.isSidebarButtonPressed = false;
                                this.toggleSidebar();
                            }, 200);
                        });
                    }, Image);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777260, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Context.animation({
                            duration: 100,
                            curve: Curve.EaseInOut
                        });
                        Image.width(18);
                        Image.height(18);
                        Image.scale({ x: this.isSidebarButtonPressed ? 0.85 : 1, y: this.isSidebarButtonPressed ? 0.85 : 1 });
                        Context.animation(null);
                        Image.onClick(() => {
                            this.isSidebarButtonPressed = true;
                            setTimeout(() => {
                                this.isSidebarButtonPressed = false;
                                this.toggleSidebar();
                            }, 200);
                        });
                    }, Image);
                });
            }
        }, If);
        If.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //环境数据
                    NavigationItem(this, {
                        index: 0,
                        current: this.currentPage,
                        icon: { "id": 16777255, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777256, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '主控台',
                        currentPage: this.__currentPage,
                        showSidebar: this.showSidebar,
                        onNavigate: this.handleNavigation.bind(this)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 271, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            index: 0,
                            current: this.currentPage,
                            icon: { "id": 16777255, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            selectedIcon: { "id": 16777256, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            text: '主控台',
                            currentPage: this.currentPage,
                            showSidebar: this.showSidebar,
                            onNavigate: this.handleNavigation.bind(this)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        index: 0,
                        current: this.currentPage,
                        icon: { "id": 16777255, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777256, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '主控台',
                        showSidebar: this.showSidebar
                    });
                }
            }, { name: "NavigationItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 主控台
                    NavigationItem(this, {
                        index: 1,
                        current: this.currentPage,
                        icon: { "id": 16777290, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777291, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '环境数据',
                        currentPage: this.__currentPage,
                        showSidebar: this.showSidebar,
                        onNavigate: this.handleNavigation.bind(this)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 283, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            index: 1,
                            current: this.currentPage,
                            icon: { "id": 16777290, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            selectedIcon: { "id": 16777291, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            text: '环境数据',
                            currentPage: this.currentPage,
                            showSidebar: this.showSidebar,
                            onNavigate: this.handleNavigation.bind(this)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        index: 1,
                        current: this.currentPage,
                        icon: { "id": 16777290, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777291, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '环境数据',
                        showSidebar: this.showSidebar
                    });
                }
            }, { name: "NavigationItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 设备管理
                    NavigationItem(this, {
                        index: 2,
                        current: this.currentPage,
                        icon: { "id": 16777237, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777238, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '设备管理',
                        currentPage: this.__currentPage,
                        showSidebar: this.showSidebar,
                        onNavigate: this.handleNavigation.bind(this)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 295, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            index: 2,
                            current: this.currentPage,
                            icon: { "id": 16777237, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            selectedIcon: { "id": 16777238, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            text: '设备管理',
                            currentPage: this.currentPage,
                            showSidebar: this.showSidebar,
                            onNavigate: this.handleNavigation.bind(this)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        index: 2,
                        current: this.currentPage,
                        icon: { "id": 16777237, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777238, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '设备管理',
                        showSidebar: this.showSidebar
                    });
                }
            }, { name: "NavigationItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 任务日志
                    NavigationItem(this, {
                        index: 3,
                        current: this.currentPage,
                        icon: { "id": 16777269, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777270, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '任务日志',
                        currentPage: this.__currentPage,
                        showSidebar: this.showSidebar,
                        onNavigate: this.handleNavigation.bind(this)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 307, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            index: 3,
                            current: this.currentPage,
                            icon: { "id": 16777269, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            selectedIcon: { "id": 16777270, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            text: '任务日志',
                            currentPage: this.currentPage,
                            showSidebar: this.showSidebar,
                            onNavigate: this.handleNavigation.bind(this)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        index: 3,
                        current: this.currentPage,
                        icon: { "id": 16777269, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777270, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '任务日志',
                        showSidebar: this.showSidebar
                    });
                }
            }, { name: "NavigationItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 知识库
                    NavigationItem(this, {
                        index: 4,
                        current: this.currentPage,
                        icon: { "id": 16777235, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777236, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '知识库',
                        currentPage: this.__currentPage,
                        showSidebar: this.showSidebar,
                        onNavigate: this.handleNavigation.bind(this)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 319, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            index: 4,
                            current: this.currentPage,
                            icon: { "id": 16777235, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            selectedIcon: { "id": 16777236, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            text: '知识库',
                            currentPage: this.currentPage,
                            showSidebar: this.showSidebar,
                            onNavigate: this.handleNavigation.bind(this)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        index: 4,
                        current: this.currentPage,
                        icon: { "id": 16777235, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777236, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '知识库',
                        showSidebar: this.showSidebar
                    });
                }
            }, { name: "NavigationItem" });
        }
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 系统设置
                    NavigationItem(this, {
                        index: 5,
                        current: this.currentPage,
                        icon: { "id": 16777265, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777266, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '系统设置',
                        currentPage: this.__currentPage,
                        showSidebar: this.showSidebar,
                        onNavigate: this.handleNavigation.bind(this)
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 331, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            index: 5,
                            current: this.currentPage,
                            icon: { "id": 16777265, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            selectedIcon: { "id": 16777266, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            text: '系统设置',
                            currentPage: this.currentPage,
                            showSidebar: this.showSidebar,
                            onNavigate: this.handleNavigation.bind(this)
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {
                        index: 5,
                        current: this.currentPage,
                        icon: { "id": 16777265, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        selectedIcon: { "id": 16777266, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        text: '系统设置',
                        showSidebar: this.showSidebar
                    });
                }
            }, { name: "NavigationItem" });
        }
        // 侧边栏
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容区域
            Column.create();
            Context.animation({
                duration: 300,
                curve: Curve.EaseInOut
            });
            // 内容区域
            Column.width(this.showSidebar ? '88%' : '94%');
            // 内容区域
            Column.height('100%');
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.currentPage === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new MasterStation(this, {
                                    addLog: this.addLog.bind(this),
                                    isLineRunning: this.__isLineRunning
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 363, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        addLog: this.addLog.bind(this),
                                        isLineRunning: this.isLineRunning
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "MasterStation" });
                    }
                });
            }
            else if (this.currentPage === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new Environment(this, {
                                    servers: this.servers ?? []
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 368, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        servers: this.servers ?? []
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    servers: this.servers ?? []
                                });
                            }
                        }, { name: "Environment" });
                    }
                });
            }
            else if (this.currentPage === 2) {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DeviceManager(this, {
                                    conveyorData1: this.__conveyorData1,
                                    conveyorData2: this.__conveyorData2,
                                    dollyData: this.__dollyData,
                                    robot1Data: this.__robot1Data,
                                    robot2Data: this.__robot2Data,
                                    robot3Data: this.__robot3Data,
                                    addLog: this.addLog.bind(this),
                                    conveyorAvatar: this.__conveyorAvatar,
                                    dollyAvatar: this.__dollyAvatar,
                                    robotArmAvatar: this.__robotArmAvatar,
                                    onIndexChange: (index: number) => {
                                        this.deviceManagerIndex = index;
                                    },
                                    servers: this.servers
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 372, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        conveyorData1: this.conveyorData1,
                                        conveyorData2: this.conveyorData2,
                                        dollyData: this.dollyData,
                                        robot1Data: this.robot1Data,
                                        robot2Data: this.robot2Data,
                                        robot3Data: this.robot3Data,
                                        addLog: this.addLog.bind(this),
                                        conveyorAvatar: this.conveyorAvatar,
                                        dollyAvatar: this.dollyAvatar,
                                        robotArmAvatar: this.robotArmAvatar,
                                        onIndexChange: (index: number) => {
                                            this.deviceManagerIndex = index;
                                        },
                                        servers: this.servers
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    servers: this.servers
                                });
                            }
                        }, { name: "DeviceManager" });
                    }
                });
            }
            else if (this.currentPage === 3) {
                this.ifElseBranchUpdateFunction(3, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new TaskLog(this, {
                                    allLogItems: this.allLogItems,
                                    clearAllLogs: this.clearAllLogs.bind(this)
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 389, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        allLogItems: this.allLogItems,
                                        clearAllLogs: this.clearAllLogs.bind(this)
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {
                                    allLogItems: this.allLogItems
                                });
                            }
                        }, { name: "TaskLog" });
                    }
                });
            }
            else if (this.currentPage === 4) {
                this.ifElseBranchUpdateFunction(4, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new DataStatics(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 394, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "DataStatics" });
                    }
                });
            }
            else {
                this.ifElseBranchUpdateFunction(5, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new SystemSetting(this, {
                                    addLog: this.addLog.bind(this),
                                    avatar: this.__userAvatar
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/Index.ets", line: 396, col: 13 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        addLog: this.addLog.bind(this),
                                        avatar: this.userAvatar
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "SystemSetting" });
                    }
                });
            }
        }, If);
        If.pop();
        // 内容区域
        Column.pop();
        Row.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MainPage";
    }
}
class NavigationItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__index = new SynchedPropertySimpleOneWayPU(params.index, this, "index");
        this.__current = new SynchedPropertySimpleOneWayPU(params.current, this, "current");
        this.__icon = new SynchedPropertyObjectOneWayPU(params.icon, this, "icon");
        this.__selectedIcon = new SynchedPropertyObjectOneWayPU(params.selectedIcon, this, "selectedIcon");
        this.__text = new SynchedPropertySimpleOneWayPU(params.text, this, "text");
        this.__currentPage = new SynchedPropertySimpleTwoWayPU(params.currentPage, this, "currentPage");
        this.__showSidebar = new SynchedPropertySimpleOneWayPU(params.showSidebar, this, "showSidebar");
        this.selectedColor = '#1890ff' // 选中颜色(蓝色)
        ;
        this.normalColor = '#FFFFFF' // 默认颜色(深灰色)
        ;
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.onNavigate = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NavigationItem_Params) {
        if (params.selectedColor !== undefined) {
            this.selectedColor = params.selectedColor;
        }
        if (params.normalColor !== undefined) {
            this.normalColor = params.normalColor;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
        if (params.onNavigate !== undefined) {
            this.onNavigate = params.onNavigate;
        }
    }
    updateStateVars(params: NavigationItem_Params) {
        this.__index.reset(params.index);
        this.__current.reset(params.current);
        this.__icon.reset(params.icon);
        this.__selectedIcon.reset(params.selectedIcon);
        this.__text.reset(params.text);
        this.__showSidebar.reset(params.showSidebar);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__index.purgeDependencyOnElmtId(rmElmtId);
        this.__current.purgeDependencyOnElmtId(rmElmtId);
        this.__icon.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedIcon.purgeDependencyOnElmtId(rmElmtId);
        this.__text.purgeDependencyOnElmtId(rmElmtId);
        this.__currentPage.purgeDependencyOnElmtId(rmElmtId);
        this.__showSidebar.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__index.aboutToBeDeleted();
        this.__current.aboutToBeDeleted();
        this.__icon.aboutToBeDeleted();
        this.__selectedIcon.aboutToBeDeleted();
        this.__text.aboutToBeDeleted();
        this.__currentPage.aboutToBeDeleted();
        this.__showSidebar.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __index: SynchedPropertySimpleOneWayPU<number>;
    get index() {
        return this.__index.get();
    }
    set index(newValue: number) {
        this.__index.set(newValue);
    }
    private __current: SynchedPropertySimpleOneWayPU<number>;
    get current() {
        return this.__current.get();
    }
    set current(newValue: number) {
        this.__current.set(newValue);
    }
    private __icon: SynchedPropertySimpleOneWayPU<Resource>;
    get icon() {
        return this.__icon.get();
    }
    set icon(newValue: Resource) {
        this.__icon.set(newValue);
    }
    private __selectedIcon: SynchedPropertySimpleOneWayPU<Resource>;
    get selectedIcon() {
        return this.__selectedIcon.get();
    }
    set selectedIcon(newValue: Resource) {
        this.__selectedIcon.set(newValue);
    }
    private __text: SynchedPropertySimpleOneWayPU<string>;
    get text() {
        return this.__text.get();
    }
    set text(newValue: string) {
        this.__text.set(newValue);
    }
    private __currentPage: SynchedPropertySimpleTwoWayPU<number>;
    get currentPage() {
        return this.__currentPage.get();
    }
    set currentPage(newValue: number) {
        this.__currentPage.set(newValue);
    }
    private __showSidebar: SynchedPropertySimpleOneWayPU<boolean
    // 定义选中和未选中时的颜色
    >;
    get showSidebar() {
        return this.__showSidebar.get();
    }
    set showSidebar(newValue: boolean) {
        this.__showSidebar.set(newValue);
    }
    // 定义选中和未选中时的颜色
    private selectedColor: string; // 选中颜色(蓝色)
    private normalColor: string; // 默认颜色(深灰色)
    //用于控制按压动效的状态变量
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    private onNavigate: (index: number) => void;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation({
                duration: 50,
                curve: Curve.EaseInOut // 动画曲线
            });
            Column.width('85%');
            Column.height(this.showSidebar ? 70 : 50);
            Column.justifyContent(FlexAlign.Center);
            Column.alignItems(HorizontalAlign.Center);
            Column.borderRadius(15);
            Column.backgroundColor(this.index === this.current ? 'rgba(255, 255, 255, 0.25)' : 'transparent');
            Column.scale({ x: this.isPressed ? 0.95 : 1, y: this.isPressed ? 0.95 : 1 });
            Column.onClick(() => {
                this.onNavigate(this.index);
            });
            Column.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.isPressed = true;
                }
                if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                    this.isPressed = false;
                }
            });
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.index === this.currentPage ? this.selectedIcon : this.icon);
            Image.width(this.showSidebar ? 18 : 18);
            Image.height(this.showSidebar ? 18 : 18);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.showSidebar) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.text);
                        Text.fontSize(10);
                        Text.margin({ top: 10 });
                        Text.fontColor(this.index === this.currentPage ? this.selectedColor : this.normalColor);
                        Text.transition(TransitionEffect.opacity(0).animation({ duration: 0, curve: Curve.EaseInOut }));
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new MainPage(undefined, {}), "", { bundleName: "com.my.myapplication", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
