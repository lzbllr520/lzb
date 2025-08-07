if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ActionButton_Params {
    icon?: Resource;
    click?: () => void;
    isPressed?: boolean;
}
interface RobotArm3_Params {
    addLog?: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    data?: RobotArmState;
    avatar?: Resource;
    stepInputText_xyz?: string;
    stepInputText_r?: string;
    button_icon_size?: number;
    button_size?: number;
    catch_size_height?: number;
    catch_size_width?: string;
    catch_font_size?: number;
    con_width?: string;
    con_height?: number;
    button_icon_size2?: number;
    button_size2?: number;
    catch_size_height2?: number;
    catch_size_width2?: string;
    catch_font_size2?: number;
    con_width2?: string;
    con_height2?: number;
    sn?: string;
    version?: string;
    time?: number;
    uid?: string;
    alarms?: number;
    node_id_alarms?: string;
    alarmTimer?: number;
    endAbled?: boolean;
    node_id_endAbled?: string;
    node_id_clearAlarms?: string;
    node_id_end?: string;
    node_id_toStart?: string;
    node_id_stop?: string;
    node_id_nowPosition?: string;
    node_id_move?: string;
    isCatch?: boolean;
    isMove?: boolean;
    node?: Data;
    isPressed?: boolean;
    isHover?: boolean;
    isPressed1?: boolean;
    isHover1?: boolean;
    idleTimer?: number;
    isPreviewVisible?: boolean;
}
import type { RobotArmState } from '../../model/RobotArmState';
import { RoboticArmWorkRangeView } from "@normalized:N&&&entry/src/main/ets/components/RoboticArmWorkRangeView&";
import type { Node, Data } from '../../model/ServerState';
import { clearEndAble, clearRobotArmAlarms, endControl, getEndStatus, getNodeOther, getRobotArmAlarms, getRobotArmNowPosition, getRobotArmTime, getRobotArmUid, setEndAble, setRobotArmMove, setStop, setToStart } from "@normalized:N&&&entry/src/main/ets/service/Request&";
export class RobotArm3 extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.addLog = () => { };
        this.__data = new SynchedPropertyObjectTwoWayPU(params.data, this, "data");
        this.__avatar = new SynchedPropertyObjectTwoWayPU(params.avatar, this, "avatar");
        this.__stepInputText_xyz = new ObservedPropertySimplePU('5', this, "stepInputText_xyz");
        this.__stepInputText_r = new ObservedPropertySimplePU('5'
        // 基础信息卡片和控制卡片联动动画控制器
        , this, "stepInputText_r");
        this.__button_icon_size = new ObservedPropertySimplePU(25, this, "button_icon_size");
        this.__button_size = new ObservedPropertySimplePU(40, this, "button_size");
        this.__catch_size_height = new ObservedPropertySimplePU(40, this, "catch_size_height");
        this.__catch_size_width = new ObservedPropertySimplePU('25%', this, "catch_size_width");
        this.__catch_font_size = new ObservedPropertySimplePU(18, this, "catch_font_size");
        this.__con_width = new ObservedPropertySimplePU('90%', this, "con_width");
        this.__con_height = new ObservedPropertySimplePU(50, this, "con_height");
        this.__button_icon_size2 = new ObservedPropertySimplePU(18, this, "button_icon_size2");
        this.__button_size2 = new ObservedPropertySimplePU(28, this, "button_size2");
        this.__catch_size_height2 = new ObservedPropertySimplePU(30, this, "catch_size_height2");
        this.__catch_size_width2 = new ObservedPropertySimplePU('70%', this, "catch_size_width2");
        this.__catch_font_size2 = new ObservedPropertySimplePU(20, this, "catch_font_size2");
        this.__con_width2 = new ObservedPropertySimplePU('95%', this, "con_width2");
        this.__con_height2 = new ObservedPropertySimplePU(40
        //序列号
        , this, "con_height2");
        this.__sn = new ObservedPropertySimplePU('DT1420071876'
        //固定版本
        , this, "sn");
        this.__version = new ObservedPropertySimplePU('3.7.0'
        //系统时钟
        , this, "version");
        this.__time = new ObservedPropertySimplePU(0
        //设备uid
        , this, "time");
        this.__uid = new ObservedPropertySimplePU(''
        //设备警报
        , this, "uid");
        this.__alarms = new ObservedPropertySimplePU(0, this, "alarms");
        this.__node_id_alarms = new ObservedPropertySimplePU('', this, "node_id_alarms");
        this.alarmTimer = -1;
        this.__endAbled = new ObservedPropertySimplePU(false, this, "endAbled");
        this.__node_id_endAbled = new ObservedPropertySimplePU(''
        //清除警报
        , this, "node_id_endAbled");
        this.__node_id_clearAlarms = new ObservedPropertySimplePU(''
        //末端执行
        , this, "node_id_clearAlarms");
        this.__node_id_end = new ObservedPropertySimplePU(''
        //设置回零
        , this, "node_id_end");
        this.__node_id_toStart = new ObservedPropertySimplePU(''
        //设置急停
        , this, "node_id_toStart");
        this.__node_id_stop = new ObservedPropertySimplePU(''
        //获取当前位姿
        , this, "node_id_stop");
        this.__node_id_nowPosition = new ObservedPropertySimplePU(''
        //机械臂移动
        , this, "node_id_nowPosition");
        this.__node_id_move = new ObservedPropertySimplePU(''
        //是否抓取
        , this, "node_id_move");
        this.__isCatch = new ObservedPropertySimplePU(false
        //是否点击移动
        , this, "isCatch");
        this.__isMove = new ObservedPropertySimplePU(false, this, "isMove");
        this.__node = new SynchedPropertyObjectOneWayPU(params.node, this, "node");
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.__isHover = new ObservedPropertySimplePU(false, this, "isHover");
        this.__isPressed1 = new ObservedPropertySimplePU(false, this, "isPressed1");
        this.__isHover1 = new ObservedPropertySimplePU(false, this, "isHover1");
        this.__idleTimer = new ObservedPropertySimplePU(-1, this, "idleTimer");
        this.__isPreviewVisible = new ObservedPropertySimplePU(false, this, "isPreviewVisible");
        this.setInitiallyProvidedValue(params);
        this.declareWatch("node", this.onNodeChange);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RobotArm3_Params) {
        if (params.addLog !== undefined) {
            this.addLog = params.addLog;
        }
        if (params.stepInputText_xyz !== undefined) {
            this.stepInputText_xyz = params.stepInputText_xyz;
        }
        if (params.stepInputText_r !== undefined) {
            this.stepInputText_r = params.stepInputText_r;
        }
        if (params.button_icon_size !== undefined) {
            this.button_icon_size = params.button_icon_size;
        }
        if (params.button_size !== undefined) {
            this.button_size = params.button_size;
        }
        if (params.catch_size_height !== undefined) {
            this.catch_size_height = params.catch_size_height;
        }
        if (params.catch_size_width !== undefined) {
            this.catch_size_width = params.catch_size_width;
        }
        if (params.catch_font_size !== undefined) {
            this.catch_font_size = params.catch_font_size;
        }
        if (params.con_width !== undefined) {
            this.con_width = params.con_width;
        }
        if (params.con_height !== undefined) {
            this.con_height = params.con_height;
        }
        if (params.button_icon_size2 !== undefined) {
            this.button_icon_size2 = params.button_icon_size2;
        }
        if (params.button_size2 !== undefined) {
            this.button_size2 = params.button_size2;
        }
        if (params.catch_size_height2 !== undefined) {
            this.catch_size_height2 = params.catch_size_height2;
        }
        if (params.catch_size_width2 !== undefined) {
            this.catch_size_width2 = params.catch_size_width2;
        }
        if (params.catch_font_size2 !== undefined) {
            this.catch_font_size2 = params.catch_font_size2;
        }
        if (params.con_width2 !== undefined) {
            this.con_width2 = params.con_width2;
        }
        if (params.con_height2 !== undefined) {
            this.con_height2 = params.con_height2;
        }
        if (params.sn !== undefined) {
            this.sn = params.sn;
        }
        if (params.version !== undefined) {
            this.version = params.version;
        }
        if (params.time !== undefined) {
            this.time = params.time;
        }
        if (params.uid !== undefined) {
            this.uid = params.uid;
        }
        if (params.alarms !== undefined) {
            this.alarms = params.alarms;
        }
        if (params.node_id_alarms !== undefined) {
            this.node_id_alarms = params.node_id_alarms;
        }
        if (params.alarmTimer !== undefined) {
            this.alarmTimer = params.alarmTimer;
        }
        if (params.endAbled !== undefined) {
            this.endAbled = params.endAbled;
        }
        if (params.node_id_endAbled !== undefined) {
            this.node_id_endAbled = params.node_id_endAbled;
        }
        if (params.node_id_clearAlarms !== undefined) {
            this.node_id_clearAlarms = params.node_id_clearAlarms;
        }
        if (params.node_id_end !== undefined) {
            this.node_id_end = params.node_id_end;
        }
        if (params.node_id_toStart !== undefined) {
            this.node_id_toStart = params.node_id_toStart;
        }
        if (params.node_id_stop !== undefined) {
            this.node_id_stop = params.node_id_stop;
        }
        if (params.node_id_nowPosition !== undefined) {
            this.node_id_nowPosition = params.node_id_nowPosition;
        }
        if (params.node_id_move !== undefined) {
            this.node_id_move = params.node_id_move;
        }
        if (params.isCatch !== undefined) {
            this.isCatch = params.isCatch;
        }
        if (params.isMove !== undefined) {
            this.isMove = params.isMove;
        }
        if (params.node === undefined) {
            this.__node.set({ id: '', node_id: '' });
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
        if (params.isHover !== undefined) {
            this.isHover = params.isHover;
        }
        if (params.isPressed1 !== undefined) {
            this.isPressed1 = params.isPressed1;
        }
        if (params.isHover1 !== undefined) {
            this.isHover1 = params.isHover1;
        }
        if (params.idleTimer !== undefined) {
            this.idleTimer = params.idleTimer;
        }
        if (params.isPreviewVisible !== undefined) {
            this.isPreviewVisible = params.isPreviewVisible;
        }
    }
    updateStateVars(params: RobotArm3_Params) {
        this.__node.reset(params.node);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__data.purgeDependencyOnElmtId(rmElmtId);
        this.__avatar.purgeDependencyOnElmtId(rmElmtId);
        this.__stepInputText_xyz.purgeDependencyOnElmtId(rmElmtId);
        this.__stepInputText_r.purgeDependencyOnElmtId(rmElmtId);
        this.__button_icon_size.purgeDependencyOnElmtId(rmElmtId);
        this.__button_size.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_size_height.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_size_width.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_font_size.purgeDependencyOnElmtId(rmElmtId);
        this.__con_width.purgeDependencyOnElmtId(rmElmtId);
        this.__con_height.purgeDependencyOnElmtId(rmElmtId);
        this.__button_icon_size2.purgeDependencyOnElmtId(rmElmtId);
        this.__button_size2.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_size_height2.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_size_width2.purgeDependencyOnElmtId(rmElmtId);
        this.__catch_font_size2.purgeDependencyOnElmtId(rmElmtId);
        this.__con_width2.purgeDependencyOnElmtId(rmElmtId);
        this.__con_height2.purgeDependencyOnElmtId(rmElmtId);
        this.__sn.purgeDependencyOnElmtId(rmElmtId);
        this.__version.purgeDependencyOnElmtId(rmElmtId);
        this.__time.purgeDependencyOnElmtId(rmElmtId);
        this.__uid.purgeDependencyOnElmtId(rmElmtId);
        this.__alarms.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_alarms.purgeDependencyOnElmtId(rmElmtId);
        this.__endAbled.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_endAbled.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_clearAlarms.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_end.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_toStart.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_stop.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_nowPosition.purgeDependencyOnElmtId(rmElmtId);
        this.__node_id_move.purgeDependencyOnElmtId(rmElmtId);
        this.__isCatch.purgeDependencyOnElmtId(rmElmtId);
        this.__isMove.purgeDependencyOnElmtId(rmElmtId);
        this.__node.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
        this.__isHover.purgeDependencyOnElmtId(rmElmtId);
        this.__isPressed1.purgeDependencyOnElmtId(rmElmtId);
        this.__isHover1.purgeDependencyOnElmtId(rmElmtId);
        this.__idleTimer.purgeDependencyOnElmtId(rmElmtId);
        this.__isPreviewVisible.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__data.aboutToBeDeleted();
        this.__avatar.aboutToBeDeleted();
        this.__stepInputText_xyz.aboutToBeDeleted();
        this.__stepInputText_r.aboutToBeDeleted();
        this.__button_icon_size.aboutToBeDeleted();
        this.__button_size.aboutToBeDeleted();
        this.__catch_size_height.aboutToBeDeleted();
        this.__catch_size_width.aboutToBeDeleted();
        this.__catch_font_size.aboutToBeDeleted();
        this.__con_width.aboutToBeDeleted();
        this.__con_height.aboutToBeDeleted();
        this.__button_icon_size2.aboutToBeDeleted();
        this.__button_size2.aboutToBeDeleted();
        this.__catch_size_height2.aboutToBeDeleted();
        this.__catch_size_width2.aboutToBeDeleted();
        this.__catch_font_size2.aboutToBeDeleted();
        this.__con_width2.aboutToBeDeleted();
        this.__con_height2.aboutToBeDeleted();
        this.__sn.aboutToBeDeleted();
        this.__version.aboutToBeDeleted();
        this.__time.aboutToBeDeleted();
        this.__uid.aboutToBeDeleted();
        this.__alarms.aboutToBeDeleted();
        this.__node_id_alarms.aboutToBeDeleted();
        this.__endAbled.aboutToBeDeleted();
        this.__node_id_endAbled.aboutToBeDeleted();
        this.__node_id_clearAlarms.aboutToBeDeleted();
        this.__node_id_end.aboutToBeDeleted();
        this.__node_id_toStart.aboutToBeDeleted();
        this.__node_id_stop.aboutToBeDeleted();
        this.__node_id_nowPosition.aboutToBeDeleted();
        this.__node_id_move.aboutToBeDeleted();
        this.__isCatch.aboutToBeDeleted();
        this.__isMove.aboutToBeDeleted();
        this.__node.aboutToBeDeleted();
        this.__isPressed.aboutToBeDeleted();
        this.__isHover.aboutToBeDeleted();
        this.__isPressed1.aboutToBeDeleted();
        this.__isHover1.aboutToBeDeleted();
        this.__idleTimer.aboutToBeDeleted();
        this.__isPreviewVisible.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private addLog: (level: 'info' | 'warning' | 'error', message: string, shouldSave: boolean) => void;
    private __data: SynchedPropertySimpleOneWayPU<RobotArmState>;
    get data() {
        return this.__data.get();
    }
    set data(newValue: RobotArmState) {
        this.__data.set(newValue);
    }
    private __avatar: SynchedPropertySimpleOneWayPU<Resource>;
    get avatar() {
        return this.__avatar.get();
    }
    set avatar(newValue: Resource) {
        this.__avatar.set(newValue);
    }
    private __stepInputText_xyz: ObservedPropertySimplePU<string>;
    get stepInputText_xyz() {
        return this.__stepInputText_xyz.get();
    }
    set stepInputText_xyz(newValue: string) {
        this.__stepInputText_xyz.set(newValue);
    }
    private __stepInputText_r: ObservedPropertySimplePU<string>;
    get stepInputText_r() {
        return this.__stepInputText_r.get();
    }
    set stepInputText_r(newValue: string) {
        this.__stepInputText_r.set(newValue);
    }
    // 基础信息卡片和控制卡片联动动画控制器
    private __button_icon_size: ObservedPropertySimplePU<number>;
    get button_icon_size() {
        return this.__button_icon_size.get();
    }
    set button_icon_size(newValue: number) {
        this.__button_icon_size.set(newValue);
    }
    private __button_size: ObservedPropertySimplePU<number>;
    get button_size() {
        return this.__button_size.get();
    }
    set button_size(newValue: number) {
        this.__button_size.set(newValue);
    }
    private __catch_size_height: ObservedPropertySimplePU<number>;
    get catch_size_height() {
        return this.__catch_size_height.get();
    }
    set catch_size_height(newValue: number) {
        this.__catch_size_height.set(newValue);
    }
    private __catch_size_width: ObservedPropertySimplePU<string>;
    get catch_size_width() {
        return this.__catch_size_width.get();
    }
    set catch_size_width(newValue: string) {
        this.__catch_size_width.set(newValue);
    }
    private __catch_font_size: ObservedPropertySimplePU<number>;
    get catch_font_size() {
        return this.__catch_font_size.get();
    }
    set catch_font_size(newValue: number) {
        this.__catch_font_size.set(newValue);
    }
    private __con_width: ObservedPropertySimplePU<string>;
    get con_width() {
        return this.__con_width.get();
    }
    set con_width(newValue: string) {
        this.__con_width.set(newValue);
    }
    private __con_height: ObservedPropertySimplePU<number>;
    get con_height() {
        return this.__con_height.get();
    }
    set con_height(newValue: number) {
        this.__con_height.set(newValue);
    }
    private __button_icon_size2: ObservedPropertySimplePU<number>;
    get button_icon_size2() {
        return this.__button_icon_size2.get();
    }
    set button_icon_size2(newValue: number) {
        this.__button_icon_size2.set(newValue);
    }
    private __button_size2: ObservedPropertySimplePU<number>;
    get button_size2() {
        return this.__button_size2.get();
    }
    set button_size2(newValue: number) {
        this.__button_size2.set(newValue);
    }
    private __catch_size_height2: ObservedPropertySimplePU<number>;
    get catch_size_height2() {
        return this.__catch_size_height2.get();
    }
    set catch_size_height2(newValue: number) {
        this.__catch_size_height2.set(newValue);
    }
    private __catch_size_width2: ObservedPropertySimplePU<string>;
    get catch_size_width2() {
        return this.__catch_size_width2.get();
    }
    set catch_size_width2(newValue: string) {
        this.__catch_size_width2.set(newValue);
    }
    private __catch_font_size2: ObservedPropertySimplePU<number>;
    get catch_font_size2() {
        return this.__catch_font_size2.get();
    }
    set catch_font_size2(newValue: number) {
        this.__catch_font_size2.set(newValue);
    }
    private __con_width2: ObservedPropertySimplePU<string>;
    get con_width2() {
        return this.__con_width2.get();
    }
    set con_width2(newValue: string) {
        this.__con_width2.set(newValue);
    }
    private __con_height2: ObservedPropertySimplePU<number>;
    get con_height2() {
        return this.__con_height2.get();
    }
    set con_height2(newValue: number) {
        this.__con_height2.set(newValue);
    }
    //序列号
    private __sn: ObservedPropertySimplePU<string>;
    get sn() {
        return this.__sn.get();
    }
    set sn(newValue: string) {
        this.__sn.set(newValue);
    }
    //固定版本
    private __version: ObservedPropertySimplePU<string>;
    get version() {
        return this.__version.get();
    }
    set version(newValue: string) {
        this.__version.set(newValue);
    }
    //系统时钟
    private __time: ObservedPropertySimplePU<number>;
    get time() {
        return this.__time.get();
    }
    set time(newValue: number) {
        this.__time.set(newValue);
    }
    //设备uid
    private __uid: ObservedPropertySimplePU<string>;
    get uid() {
        return this.__uid.get();
    }
    set uid(newValue: string) {
        this.__uid.set(newValue);
    }
    //设备警报
    private __alarms: ObservedPropertySimplePU<number>;
    get alarms() {
        return this.__alarms.get();
    }
    set alarms(newValue: number) {
        this.__alarms.set(newValue);
    }
    private __node_id_alarms: ObservedPropertySimplePU<string>;
    get node_id_alarms() {
        return this.__node_id_alarms.get();
    }
    set node_id_alarms(newValue: string) {
        this.__node_id_alarms.set(newValue);
    }
    private alarmTimer: number;
    //使能
    private __endAbled: ObservedPropertySimplePU<boolean>;
    get endAbled() {
        return this.__endAbled.get();
    }
    set endAbled(newValue: boolean) {
        this.__endAbled.set(newValue);
    }
    private __node_id_endAbled: ObservedPropertySimplePU<string>;
    get node_id_endAbled() {
        return this.__node_id_endAbled.get();
    }
    set node_id_endAbled(newValue: string) {
        this.__node_id_endAbled.set(newValue);
    }
    //清除警报
    private __node_id_clearAlarms: ObservedPropertySimplePU<string>;
    get node_id_clearAlarms() {
        return this.__node_id_clearAlarms.get();
    }
    set node_id_clearAlarms(newValue: string) {
        this.__node_id_clearAlarms.set(newValue);
    }
    //末端执行
    private __node_id_end: ObservedPropertySimplePU<string>;
    get node_id_end() {
        return this.__node_id_end.get();
    }
    set node_id_end(newValue: string) {
        this.__node_id_end.set(newValue);
    }
    //设置回零
    private __node_id_toStart: ObservedPropertySimplePU<string>;
    get node_id_toStart() {
        return this.__node_id_toStart.get();
    }
    set node_id_toStart(newValue: string) {
        this.__node_id_toStart.set(newValue);
    }
    //设置急停
    private __node_id_stop: ObservedPropertySimplePU<string>;
    get node_id_stop() {
        return this.__node_id_stop.get();
    }
    set node_id_stop(newValue: string) {
        this.__node_id_stop.set(newValue);
    }
    //获取当前位姿
    private __node_id_nowPosition: ObservedPropertySimplePU<string>;
    get node_id_nowPosition() {
        return this.__node_id_nowPosition.get();
    }
    set node_id_nowPosition(newValue: string) {
        this.__node_id_nowPosition.set(newValue);
    }
    //机械臂移动
    private __node_id_move: ObservedPropertySimplePU<string>;
    get node_id_move() {
        return this.__node_id_move.get();
    }
    set node_id_move(newValue: string) {
        this.__node_id_move.set(newValue);
    }
    //是否抓取
    private __isCatch: ObservedPropertySimplePU<boolean>;
    get isCatch() {
        return this.__isCatch.get();
    }
    set isCatch(newValue: boolean) {
        this.__isCatch.set(newValue);
    }
    //是否点击移动
    private __isMove: ObservedPropertySimplePU<boolean>;
    get isMove() {
        return this.__isMove.get();
    }
    set isMove(newValue: boolean) {
        this.__isMove.set(newValue);
    }
    private __node: SynchedPropertySimpleOneWayPU<Data>;
    get node() {
        return this.__node.get();
    }
    set node(newValue: Data) {
        this.__node.set(newValue);
    }
    async onNodeChange(): Promise<void> {
        if (this.node.id && this.node.node_id) {
            //先找到机械臂下的所有结点
            const nodes: Node[] | null = await getNodeOther(this.node.id, this.node.node_id);
            if (nodes && nodes.length > 0) {
                //获取设备信息
                const infoNodes: Node[] | null = await getNodeOther(this.node.id, nodes[1].node_id);
                if (infoNodes && infoNodes.length > 0) {
                    //获取系统时钟
                    const time: number | null = await getRobotArmTime(this.node.id, infoNodes[4].node_id);
                    if (time) {
                        this.time = time;
                    }
                    else {
                        this.showSystemToast('获取系统时间失败');
                    }
                    //获取uid
                    const uid: string | null = await getRobotArmUid(this.node.id, infoNodes[5].node_id);
                    if (uid) {
                        this.uid = uid;
                    }
                    else {
                        this.showSystemToast('获取uid失败');
                    }
                }
                //获取警报node_id
                const alarmsNodes: Node[] | null = await getNodeOther(this.node.id, nodes[2].node_id);
                if (alarmsNodes && alarmsNodes.length > 0) {
                    //获取是否存在警报和警报信息
                    this.node_id_alarms = alarmsNodes[1].node_id;
                    //获取清除警报node_id
                    this.node_id_clearAlarms = alarmsNodes[4].node_id;
                }
                //获取末端执行node_id
                const endNodes1: Node[] | null = await getNodeOther(this.node.id, nodes[5].node_id);
                if (endNodes1 && endNodes1.length > 0) {
                    const endNodes2: Node[] | null = await getNodeOther(this.node.id, endNodes1[3].node_id);
                    if (endNodes2 && endNodes2.length > 0) {
                        this.node_id_end = endNodes2[3].node_id;
                        this.node_id_endAbled = endNodes2[4].node_id;
                    }
                }
                //获取执行回零node_id
                const toStartNode: Node[] | null = await getNodeOther(this.node.id, nodes[4].node_id);
                if (toStartNode && toStartNode.length > 0) {
                    this.node_id_toStart = toStartNode[2].node_id;
                }
                //获取当前位姿和急停node_id
                const control: Node[] | null = await getNodeOther(this.node.id, nodes[6].node_id);
                if (control && control.length > 0) {
                    //获取机械臂急停node_id
                    this.node_id_stop = control[2].node_id;
                    //机械臂移动控制node_id
                    this.node_id_move = control[3].node_id;
                    //获取当前位姿
                    this.node_id_nowPosition = control[1].node_id;
                    const nowPositions: number[] | null = await getRobotArmNowPosition(this.node.id, control[1].node_id);
                    if (nowPositions && nowPositions.length > 0) {
                        //获取当前位姿成功，然后进行回显
                        this.data.xValue = parseFloat(nowPositions[0].toFixed(2));
                        this.data.yValue = parseFloat(nowPositions[1].toFixed(2));
                        this.data.zValue = parseFloat(nowPositions[2].toFixed(2));
                        this.data.rValue = parseFloat(nowPositions[3].toFixed(2));
                    }
                }
            }
        }
    }
    //获取警报
    async getAlarms(): Promise<boolean> {
        if (this.node.id && this.node.node_id && this.node_id_alarms) {
            const num: number | null = await getRobotArmAlarms(this.node.id, this.node_id_alarms);
            if (num !== null) {
                this.alarms = num;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    //清除警报
    async clearAlarms(): Promise<void> {
        if (this.node.id && this.node.node_id && this.node_id_clearAlarms) {
            const isClear: boolean | null = await clearRobotArmAlarms(this.node.id, this.node_id_clearAlarms);
            if (isClear) {
                this.showSystemToast('清除警报成功');
            }
            else {
                this.showSystemToast('清除警报失败');
            }
        }
    }
    //获取机械臂使能状态
    async getEndStatus(): Promise<boolean> {
        if (this.node.id && this.node.node_id && this.node_id_endAbled) {
            const endStatus: boolean[] | null = await getEndStatus(this.node.id, this.node_id_endAbled);
            if (endStatus && endStatus.length > 0) {
                this.showSystemToast('获取使能状态成功');
                if (endStatus[0] === true && endStatus[1] === false) {
                    //有使能(还未抓取)
                    this.endAbled = true;
                    this.isCatch = false;
                }
                else if (endStatus[0] === false && endStatus[1] === false) {
                    //无使能（无法抓取）
                    this.endAbled = false;
                    this.isCatch = false;
                }
                else if (endStatus[0] === true && endStatus[1] === true) {
                    //有使能（已抓取）
                    this.endAbled = true;
                    this.isCatch = true;
                }
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    //赋予末端使能
    async setEndAble(): Promise<void> {
        if (this.node.id && this.node.node_id && this.node_id_end) {
            const isSet: boolean | null = await setEndAble(this.node.id, this.node_id_end, "true false");
            if (isSet) {
                this.showSystemToast('赋予末端使能成功');
            }
            else {
                this.showSystemToast('赋予末端使能失败');
            }
        }
    }
    //清除末端使能
    async clearEndAble(): Promise<void> {
        if (this.node.id && this.node.node_id && this.node_id_end) {
            const isSet: boolean | null = await clearEndAble(this.node.id, this.node_id_end, "false false");
            if (isSet) {
                this.showSystemToast('清除末端使能成功');
            }
            else {
                this.showSystemToast('清除末端使能失败');
            }
        }
    }
    //控制机械臂末端
    async setEndControl(action: string): Promise<boolean> {
        if (this.node.id && this.node.node_id && this.node_id_end) {
            const isSet: boolean | null = await endControl(this.node.id, this.node_id_end, action);
            if (isSet) {
                return isSet;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    //设置回零
    async setToStart(): Promise<void> {
        if (this.node.id && this.node.node_id && this.node_id_toStart) {
            const isSet: boolean | null = await setToStart(this.node.id, this.node_id_toStart);
            if (isSet) {
                this.showSystemToast('设置回零成功');
            }
            else {
                this.showSystemToast('设置回零失败');
            }
        }
    }
    //设置急停
    async setStop(): Promise<void> {
        if (this.node.id && this.node.node_id && this.node_id_stop) {
            const isSet: boolean | null = await setStop(this.node.id, this.node_id_stop);
            if (isSet) {
                this.showSystemToast('急停成功');
            }
            else {
                this.showSystemToast('急停失败');
            }
        }
    }
    //获取当前位姿
    async getNowPosition(): Promise<boolean> {
        if (this.node.id && this.node.node_id && this.node_id_nowPosition) {
            const nowPositions: number[] | null = await getRobotArmNowPosition(this.node.id, this.node_id_nowPosition);
            if (nowPositions && nowPositions.length > 0) {
                //获取当前位姿成功，然后进行回显
                this.data.xValue = parseFloat(nowPositions[0].toFixed(2));
                this.data.yValue = parseFloat(nowPositions[1].toFixed(2));
                this.data.zValue = parseFloat(nowPositions[2].toFixed(2));
                this.data.rValue = parseFloat(nowPositions[3].toFixed(2));
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    //机械臂移动
    async setMove(x: string, y: string, z: string, r: string): Promise<void> {
        if (this.node.id && this.node.node_id && this.node_id_move) {
            const isSet: boolean | null = await setRobotArmMove(this.node.id, this.node_id_move, `${x} ${y} ${z} ${r}`);
            if (isSet) {
                this.isMove = false;
            }
            else {
                this.setMove(x, y, z, r);
            }
        }
    }
    async aboutToAppear(): Promise<void> {
        await this.onNodeChange();
        const is1 = await this.getNowPosition();
        const is2 = await this.getAlarms();
        const is3 = await this.getEndStatus();
        if (is1 && is2 && is3) {
            this.showSystemToast('初始化成功');
        }
        else {
            this.showSystemToast('初始化失败');
        }
    }
    aboutToDisappear() {
        // 清理 setTimeout 创建的定时器
        if (this.idleTimer !== -1)
            clearTimeout(this.idleTimer);
    }
    private getStatusColor(status: boolean): Color {
        if (status) {
            return Color.Red;
        }
        else {
            return Color.Green;
        }
    }
    private increaseSpeedX() {
        this.isMove = true;
        let result = this.data.xValue + this.data.step_xyz;
        this.data.xValue = parseFloat(result.toFixed(2));
        this.setMove(this.data.xValue + '', this.data.yValue + '', this.data.zValue + '', this.data.rValue + '');
    }
    private decreaseSpeedX() {
        this.isMove = true;
        let result = this.data.xValue - this.data.step_xyz;
        this.data.xValue = parseFloat(result.toFixed(2));
        this.setMove(this.data.xValue + '', this.data.yValue + '', this.data.zValue + '', this.data.rValue + '');
    }
    private increaseSpeedY() {
        this.isMove = true;
        let result = this.data.yValue + this.data.step_xyz;
        this.data.yValue = parseFloat(result.toFixed(2));
        this.setMove(this.data.xValue + '', this.data.yValue + '', this.data.zValue + '', this.data.rValue + '');
    }
    private decreaseSpeedY() {
        this.isMove = true;
        let result = this.data.yValue - this.data.step_xyz;
        this.data.yValue = parseFloat(result.toFixed(2));
        this.setMove(this.data.xValue + '', this.data.yValue + '', this.data.zValue + '', this.data.rValue + '');
    }
    private increaseSpeedZ() {
        this.isMove = true;
        let result = this.data.zValue + this.data.step_xyz;
        this.data.zValue = parseFloat(result.toFixed(2));
        this.setMove(this.data.xValue + '', this.data.yValue + '', this.data.zValue + '', this.data.rValue + '');
    }
    private decreaseSpeedZ() {
        this.isMove = true;
        let result = this.data.zValue - this.data.step_xyz;
        this.data.zValue = parseFloat(result.toFixed(2));
        this.setMove(this.data.xValue + '', this.data.yValue + '', this.data.zValue + '', this.data.rValue + '');
    }
    private increaseSpeedR() {
        this.isMove = true;
        let result = this.data.rValue + this.data.step_r;
        this.data.rValue = parseFloat(result.toFixed(2));
        this.setMove(this.data.xValue + '', this.data.yValue + '', this.data.zValue + '', this.data.rValue + '');
    }
    private decreaseSpeedR() {
        this.isMove = true;
        let result = this.data.rValue - this.data.step_r;
        this.data.rValue = parseFloat(result.toFixed(2));
        this.setMove(this.data.xValue + '', this.data.yValue + '', this.data.zValue + '', this.data.rValue + '');
    }
    private increaseSpeedJump() {
        this.data.jumpValue++;
    }
    private decreaseSpeedJump() {
        this.data.jumpValue--;
    }
    private increaseSpeedZZ() {
        this.data.zzValue++;
    }
    private decreaseSpeedZZ() {
        this.data.zzValue--;
    }
    private increaseSpeedRR() {
        this.data.rrValue++;
    }
    private decreaseSpeedRR() {
        this.data.rrValue--;
    }
    // 用于控制按钮按压动画的状态
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    //用于追踪鼠标悬浮状态
    private __isHover: ObservedPropertySimplePU<boolean>;
    get isHover() {
        return this.__isHover.get();
    }
    set isHover(newValue: boolean) {
        this.__isHover.set(newValue);
    }
    // 用于控制按钮按压动画的状态
    private __isPressed1: ObservedPropertySimplePU<boolean>;
    get isPressed1() {
        return this.__isPressed1.get();
    }
    set isPressed1(newValue: boolean) {
        this.__isPressed1.set(newValue);
    }
    //用于追踪鼠标悬浮状态
    private __isHover1: ObservedPropertySimplePU<boolean>;
    get isHover1() {
        return this.__isHover1.get();
    }
    set isHover1(newValue: boolean) {
        this.__isHover1.set(newValue);
    }
    private getShadowOptions(): ShadowOptions {
        if (this.isHover && !this.isPressed) {
            return {
                radius: 15,
                color: 'rgba(0, 0, 0, 0.25)',
                offsetX: 0,
                offsetY: 8
            };
        }
        return {
            radius: 5,
            color: 'rgba(0, 0, 0, 0.15)',
            offsetX: 2,
            offsetY: 2
        };
    }
    private getScaleValue(): number {
        if (this.isPressed) {
            return 0.95;
        }
        if (this.isHover) {
            return 1.05;
        }
        return 1.0;
    }
    private showSystemToast(message: string) {
        try {
            this.getUIContext().getPromptAction().showToast({
                message: message,
                duration: 1000,
                bottom: '80%'
            });
        }
        catch (error) {
            console.error('Show toast error:', error);
        }
    }
    private __idleTimer: ObservedPropertySimplePU<number>;
    get idleTimer() {
        return this.__idleTimer.get();
    }
    set idleTimer(newValue: number) {
        this.__idleTimer.set(newValue);
    }
    private __isPreviewVisible: ObservedPropertySimplePU<boolean>;
    get isPreviewVisible() {
        return this.__isPreviewVisible.get();
    }
    set isPreviewVisible(newValue: boolean) {
        this.__isPreviewVisible.set(newValue);
    }
    private formattedTime(time: number): string {
        if (!time || time <= 0) {
            return 'N/A';
        }
        const date = new Date(time * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        // 拼接成 "HH:mm:ss" 格式
        return `${hours}:${minutes}:${seconds}`;
    }
    private buildImagePreview(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
            Stack.alignContent(Alignment.Center);
            Stack.transition(TransitionEffect.OPACITY.animation({ duration: 250, curve: Curve.EaseInOut }));
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('rgba(0, 0, 0, 0.7)');
            Column.onClick(() => {
                this.isPreviewVisible = false;
            });
        }, Column);
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777262, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
            Image.width('50%');
            Image.objectFit(ImageFit.Contain);
            Image.borderRadius(16);
            Image.hitTestBehavior(HitTestMode.Block);
        }, Image);
        Stack.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 20 });
            Row.padding(20);
            Row.width('100%');
            Row.height('100%');
            Row.justifyContent(FlexAlign.Center);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.data.isInfoCardVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //基础信息展示
                        Stack.create();
                        //基础信息展示
                        Stack.width('30%');
                        //基础信息展示
                        Stack.height('100%');
                        //基础信息展示
                        Stack.clip(true);
                        //基础信息展示
                        Stack.offset({ x: this.data.isInfoCardVisible ? '-120%' : 0 });
                        //基础信息展示
                        Stack.opacity(this.data.isInfoCardVisible ? 0 : 1);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
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
                        //模型展示
                        Column.create();
                        //模型展示
                        Column.width('90%');
                        //模型展示
                        Column.height('30%');
                        //模型展示
                        Column.alignItems(HorizontalAlign.Center);
                        //模型展示
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(this.avatar);
                        Context.animation({ duration: 200, curve: Curve.EaseInOut });
                        Image.width(150);
                        Image.height(120);
                        Image.borderRadius(16);
                        Image.opacity(0.8);
                        Image.onClick(() => {
                            this.isPreviewVisible = true;
                        });
                        Image.onHover((isHovering: boolean) => {
                            // 你可以在这里添加额外的悬浮动画，比如轻微放大
                        });
                        Context.animation(null);
                    }, Image);
                    //模型展示
                    Column.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //信息展示
                        Column.create({ space: 12 });
                        //信息展示
                        Column.width('100%');
                        //信息展示
                        Column.height('70%');
                        //信息展示
                        Column.alignItems(HorizontalAlign.Center);
                        //信息展示
                        Column.justifyContent(FlexAlign.Center);
                        //信息展示
                        Column.padding({ left: 10 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂uid
                        Row.create();
                        //机械臂uid
                        Row.width('100%');
                        //机械臂uid
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂uid
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('UID：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(17);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.uid);
                        Text.fontColor(Color.White);
                        Text.fontSize(12);
                    }, Text);
                    Text.pop();
                    //机械臂uid
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂序列号
                        Row.create();
                        //机械臂序列号
                        Row.width('100%');
                        //机械臂序列号
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂序列号
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('序列号：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(17);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.sn);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    //机械臂序列号
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂名称
                        Row.create();
                        //机械臂名称
                        Row.width('100%');
                        //机械臂名称
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂名称
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('名称：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(17);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('机械臂003');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    //机械臂名称
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂固定版本
                        Row.create();
                        //机械臂固定版本
                        Row.width('100%');
                        //机械臂固定版本
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂固定版本
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('固定版本：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(17);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.version);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    //机械臂固定版本
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂系统时间
                        Row.create();
                        //机械臂系统时间
                        Row.width('100%');
                        //机械臂系统时间
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂系统时间
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('系统时间：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(17);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.formattedTime(this.time));
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    //机械臂系统时间
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂使能
                        Row.create();
                        //机械臂使能
                        Row.width('100%');
                        //机械臂使能
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂使能
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('使能状态：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(20);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.endAbled ? '有使能' : '无使能');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.margin({ left: 10 });
                        Circle.width(16);
                        Circle.height(16);
                        Circle.fill(this.getStatusColor(!this.endAbled));
                    }, Circle);
                    //机械臂使能
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //机械臂警报
                        Row.create();
                        //机械臂警报
                        Row.width('100%');
                        //机械臂警报
                        Row.justifyContent(FlexAlign.Center);
                        //机械臂警报
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('警报原因：');
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontSize(20);
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.alarms === 0 ? '无报警' : this.alarms + '');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Circle.create();
                        Circle.margin({ left: 10 });
                        Circle.width(16);
                        Circle.height(16);
                        Circle.fill(this.getStatusColor(this.alarms !== 0));
                    }, Circle);
                    //机械臂警报
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.SpaceAround);
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //赋予和清除使能按钮
                        Row.create();
                        Context.animation({ duration: 150, curve: Curve.EaseOut });
                        //赋予和清除使能按钮
                        Row.height(40);
                        //赋予和清除使能按钮
                        Row.padding(8);
                        //赋予和清除使能按钮
                        Row.justifyContent(FlexAlign.Center);
                        //赋予和清除使能按钮
                        Row.alignItems(VerticalAlign.Center);
                        //赋予和清除使能按钮
                        Row.backgroundColor(this.endAbled ? 'rgba(255, 0, 0, 0.75)' : 'rgba(0, 200, 83, 0.5)');
                        //赋予和清除使能按钮
                        Row.borderRadius(20);
                        //赋予和清除使能按钮
                        Row.border({
                            width: 1,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //赋予和清除使能按钮
                        Row.margin({ top: 20 });
                        //赋予和清除使能按钮
                        Row.shadow(this.getShadowOptions());
                        //赋予和清除使能按钮
                        Row.scale({
                            x: this.getScaleValue(),
                            y: this.getScaleValue()
                        });
                        //赋予和清除使能按钮
                        Row.opacity(this.isPressed1 ? 0.8 : 1.0);
                        //赋予和清除使能按钮
                        Row.onHover((isHover: boolean) => {
                            this.isHover1 = isHover;
                        });
                        //赋予和清除使能按钮
                        Row.onTouch((event: TouchEvent) => {
                            event.stopPropagation();
                            if (event.type === TouchType.Down) {
                                this.isPressed1 = true;
                            }
                            if (event.type === TouchType.Up || event.type === TouchType.Cancel) {
                                this.isPressed1 = false;
                                if (this.endAbled) {
                                    //清除使能
                                    this.clearEndAble();
                                }
                                else {
                                    //赋予使能
                                    this.setEndAble();
                                }
                            }
                        });
                        Context.animation(null);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.endAbled ? '清除使能' : '赋予使能');
                        Text.fontSize(15);
                        Text.fontWeight(FontWeight.Bold);
                        Text.fontColor(Color.White);
                        Text.margin({ left: 8 });
                    }, Text);
                    Text.pop();
                    //赋予和清除使能按钮
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //清除警报按钮
                        Button.createWithLabel('清除警报');
                        Context.animation({ duration: 150, curve: Curve.EaseOut });
                        //清除警报按钮
                        Button.fontSize(15);
                        //清除警报按钮
                        Button.fontWeight(FontWeight.Bold);
                        //清除警报按钮
                        Button.fontColor(Color.White);
                        //清除警报按钮
                        Button.enabled(this.alarms !== 0);
                        //清除警报按钮
                        Button.height(40);
                        //清除警报按钮
                        Button.padding(8);
                        //清除警报按钮
                        Button.backgroundColor(this.alarms === 0 ? 'rgba(173, 170, 170, 0.40)' : 'rgba(0, 200, 83, 0.5)');
                        //清除警报按钮
                        Button.borderRadius(20);
                        //清除警报按钮
                        Button.border({
                            width: 1,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //清除警报按钮
                        Button.margin({ top: 20 });
                        //清除警报按钮
                        Button.shadow(this.getShadowOptions());
                        //清除警报按钮
                        Button.scale({
                            x: this.getScaleValue(),
                            y: this.getScaleValue()
                        });
                        //清除警报按钮
                        Button.onClick(() => {
                            this.clearAlarms();
                        });
                        Context.animation(null);
                    }, Button);
                    //清除警报按钮
                    Button.pop();
                    Row.pop();
                    //信息展示
                    Column.pop();
                    Column.pop();
                    //基础信息展示
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width('30%');
                        Stack.height('100%');
                        Stack.clip(true);
                        Stack.offset({ x: this.data.isInfoCardVisible ? 0 : '-120%' });
                        Stack.opacity(this.data.isInfoCardVisible ? 1 : 0);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.SpaceAround);
                        Column.alignItems(HorizontalAlign.Center);
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
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('抬起高度控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //jump高度控制
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //jump高度控制
                        Row.width(this.con_width2);
                        //jump高度控制
                        Row.height(this.con_height2);
                        //jump高度控制
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //jump高度控制
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //jump高度控制
                        Row.borderRadius(30);
                        //jump高度控制
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //jump高度控制
                        Row.backdropBlur(8);
                        Context.animation(null);
                        //jump高度控制
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.decreaseSpeedJump();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('H-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.justifyContent(FlexAlign.Center);
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.jumpValue + ' mm');
                        Text.fontSize(this.button_icon_size2);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(100);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('H+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.increaseSpeedJump();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //jump高度控制
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('方位控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        Row.width(this.con_width2);
                        Row.height(this.con_height2);
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        Row.borderRadius(30);
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        Row.backdropBlur(8);
                        Context.animation(null);
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.decreaseSpeedZZ();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Z-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.zzValue + ' mm');
                        Text.fontSize(this.button_icon_size2);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(100);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Z+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.increaseSpeedZZ();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('角度控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        Row.width(this.con_width2);
                        Row.height(this.con_height2);
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        Row.borderRadius(30);
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        Row.backdropBlur(8);
                        Context.animation(null);
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.decreaseSpeedRR();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('R-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.data.rrValue + ' °');
                        Text.fontSize(this.button_icon_size2);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(100);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('R+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size2);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size2);
                        Button.height(this.button_size2);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.increaseSpeedRR();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size2);
                        Image.height(this.button_icon_size2);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //设置回零按钮
                        Button.createWithLabel('回零');
                        Context.animation({ duration: 150, curve: Curve.EaseOut });
                        //设置回零按钮
                        Button.fontSize(this.catch_font_size2);
                        //设置回零按钮
                        Button.fontWeight(FontWeight.Bold);
                        //设置回零按钮
                        Button.fontColor(Color.White);
                        //设置回零按钮
                        Button.width(this.catch_size_width2);
                        //设置回零按钮
                        Button.height(this.catch_size_height2);
                        //设置回零按钮
                        Button.backgroundColor('rgba(0, 200, 83, 0.5)');
                        //设置回零按钮
                        Button.borderRadius(30);
                        //设置回零按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //设置回零按钮
                        Button.backdropBlur(12);
                        //设置回零按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                        //设置回零按钮
                        Button.onClick(() => {
                            this.setToStart();
                        });
                        Context.animation(null);
                    }, Button);
                    //设置回零按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //抓取释放按钮
                        Button.createWithChild();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //抓取释放按钮
                        Button.width(this.catch_size_width2);
                        //抓取释放按钮
                        Button.height(this.catch_size_height2);
                        //抓取释放按钮
                        Button.enabled(this.endAbled);
                        //抓取释放按钮
                        Button.backgroundColor(!this.endAbled ? 'rgba(173, 170, 170, 0.40)' : 'rgba(0, 200, 83, 0.5)');
                        //抓取释放按钮
                        Button.onClick(async () => {
                            // 切换末端状态
                            if (this.isCatch) {
                                //释放逻辑
                                const isSet: boolean = await this.setEndControl("true false");
                                if (isSet) {
                                    this.showSystemToast('释放成功');
                                }
                                else {
                                    this.showSystemToast('释放失败');
                                }
                            }
                            else {
                                //抓取逻辑
                                const isSet: boolean = await this.setEndControl("true true");
                                if (isSet) {
                                    this.showSystemToast('抓取成功');
                                }
                                else {
                                    this.showSystemToast('抓取失败');
                                }
                            }
                        });
                        //抓取释放按钮
                        Button.borderRadius(30);
                        //抓取释放按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //抓取释放按钮
                        Button.backdropBlur(12);
                        Context.animation(null);
                        //抓取释放按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.justifyContent(FlexAlign.Center);
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 根据状态显示不同文本
                        Text.create(!this.isCatch ? '点击抓取' : '点击释放');
                        // 根据状态显示不同文本
                        Text.fontSize(this.catch_font_size2);
                        // 根据状态显示不同文本
                        Text.fontColor(Color.White);
                    }, Text);
                    // 根据状态显示不同文本
                    Text.pop();
                    Row.pop();
                    //抓取释放按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //急停按钮
                        Button.createWithLabel('急停');
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //急停按钮
                        Button.width(this.catch_size_width2);
                        //急停按钮
                        Button.height(this.catch_size_height2);
                        //急停按钮
                        Button.fontSize(this.catch_font_size2);
                        //急停按钮
                        Button.fontColor(Color.White);
                        //急停按钮
                        Button.onClick(() => {
                            this.setStop();
                        });
                        //急停按钮
                        Button.backgroundColor('rgba(0, 200, 83, 0.5)');
                        //急停按钮
                        Button.borderRadius(30);
                        //急停按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //急停按钮
                        Button.backdropBlur(12);
                        Context.animation(null);
                        //急停按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    //急停按钮
                    Button.pop();
                    Column.pop();
                    Stack.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            //控制区域
            Stack.create({ alignContent: Alignment.TopEnd });
            //控制区域
            Stack.enabled(this.alarms === 0);
            //控制区域
            Stack.opacity(this.alarms === 0 ? 1 : 0.5);
            //控制区域
            Stack.width(this.data.controlCardWidth);
            //控制区域
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 根据 isRegionAVisible 的值，决定显示按钮调节还是量角器调节
            if (this.data.isRegionAVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Stack.create();
                        Stack.width('100%');
                        Stack.height('100%');
                        Stack.backdropBlur(12);
                        Stack.backgroundColor('rgba(10, 10, 15, 0.3)');
                        Stack.borderRadius(16);
                        Stack.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.15)'
                        });
                        Stack.shadow({
                            radius: 30,
                            color: 'rgba(173, 216, 230, 0.2)',
                            offsetX: 0,
                            offsetY: 0
                        });
                        Stack.clip(true);
                    }, Stack);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.alignItems(HorizontalAlign.Center);
                    }, Column);
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new RoboticArmWorkRangeView(this, {
                                    data: this.__data
                                }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/RobotArm3.ets", line: 1053, col: 17 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        data: this.data
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "RoboticArmWorkRangeView" });
                    }
                    Column.pop();
                    Stack.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 原有的控制面板UI
                        Column.create({ space: 15 });
                        // 原有的控制面板UI
                        Column.justifyContent(FlexAlign.SpaceAround);
                        // 原有的控制面板UI
                        Column.width('100%');
                        // 原有的控制面板UI
                        Column.height('100%');
                        // 原有的控制面板UI
                        Column.backdropBlur(12);
                        // 原有的控制面板UI
                        Column.backgroundColor('rgba(10, 10, 15, 0.3)');
                        // 原有的控制面板UI
                        Column.borderRadius(16);
                        // 原有的控制面板UI
                        Column.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.15)'
                        });
                        // 原有的控制面板UI
                        Column.shadow({
                            radius: 30,
                            color: 'rgba(173, 216, 230, 0.2)',
                            offsetX: 0,
                            offsetY: 0
                        });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 20 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('方位控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //步长设置
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('设置步长(mm)：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ text: this.data.step_xyz + ' mm' });
                        TextInput.type(InputType.Number);
                        TextInput.width(100);
                        TextInput.height(30);
                        TextInput.fontSize(12);
                        TextInput.fontWeight(FontWeight.Bold);
                        TextInput.fontColor(Color.White);
                        TextInput.textAlign(TextAlign.Center);
                        TextInput.backgroundColor('rgba(255, 255, 255, 0.2)');
                        TextInput.borderRadius(20);
                        TextInput.onChange((value: string) => {
                            this.stepInputText_xyz = value;
                        });
                        TextInput.onSubmit((enterKey: EnterKeyType) => {
                            const cleanValue = this.stepInputText_xyz.replace(/ mm$/, '').trim();
                            const num = parseFloat(cleanValue);
                            const decimalPart = cleanValue.split('.')[1] || '';
                            if (!isNaN(num) && num > 0 && decimalPart.length <= 2) {
                                this.data.step_xyz = num;
                                this.stepInputText_xyz = num.toString();
                            }
                            else {
                                this.data.step_xyz = 5;
                                this.stepInputText_xyz = '5';
                                this.showSystemToast('输入无效！已恢复为 5 mm');
                            }
                        });
                    }, TextInput);
                    //步长设置
                    Row.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //控制x轴（左右）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //控制x轴（左右）
                        Row.enabled(!this.isMove);
                        //控制x轴（左右）
                        Row.opacity(this.isMove ? 0.5 : 1.0);
                        //控制x轴（左右）
                        Row.width(this.con_width);
                        //控制x轴（左右）
                        Row.height(this.con_height);
                        //控制x轴（左右）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //控制x轴（左右）
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //控制x轴（左右）
                        Row.borderRadius(30);
                        //控制x轴（左右）
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //控制x轴（左右）
                        Row.backdropBlur(8);
                        Context.animation(null);
                        //控制x轴（左右）
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.decreaseSpeedX();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('X-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create((this.data.xValue).toFixed(2) + ' mm');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(150);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('X+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.increaseSpeedX();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //控制x轴（左右）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //y控制（前后）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //y控制（前后）
                        Row.enabled(!this.isMove);
                        //y控制（前后）
                        Row.opacity(this.isMove ? 0.5 : 1.0);
                        //y控制（前后）
                        Row.width(this.con_width);
                        //y控制（前后）
                        Row.height(this.con_height);
                        //y控制（前后）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //y控制（前后）
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //y控制（前后）
                        Row.borderRadius(30);
                        //y控制（前后）
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //y控制（前后）
                        Row.backdropBlur(8);
                        Context.animation(null);
                        //y控制（前后）
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.decreaseSpeedY();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Y-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create((this.data.yValue).toFixed(2) + ' mm');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(150);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Y+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.increaseSpeedY();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //y控制（前后）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //z轴控制（上下）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //z轴控制（上下）
                        Row.enabled(!this.isMove);
                        //z轴控制（上下）
                        Row.opacity(this.isMove ? 0.5 : 1.0);
                        //z轴控制（上下）
                        Row.width(this.con_width);
                        //z轴控制（上下）
                        Row.height(this.con_height);
                        //z轴控制（上下）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //z轴控制（上下）
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //z轴控制（上下）
                        Row.borderRadius(30);
                        //z轴控制（上下）
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //z轴控制（上下）
                        Row.backdropBlur(8);
                        Context.animation(null);
                        //z轴控制（上下）
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.decreaseSpeedZ();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Z-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create((this.data.zValue).toFixed(2) + ' mm');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(150);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('Z+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.increaseSpeedZ();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //z轴控制（上下）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 20 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('角度控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //步长设置
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('设置步长(mm)：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ text: this.data.step_r + '' });
                        TextInput.type(InputType.Number);
                        TextInput.width(100);
                        TextInput.height(30);
                        TextInput.fontSize(12);
                        TextInput.fontWeight(FontWeight.Bold);
                        TextInput.fontColor(Color.White);
                        TextInput.textAlign(TextAlign.Center);
                        TextInput.backgroundColor('rgba(255, 255, 255, 0.2)');
                        TextInput.borderRadius(20);
                        TextInput.onChange((value: string) => {
                            this.stepInputText_r = value;
                        });
                        TextInput.onSubmit((enterKey: EnterKeyType) => {
                            const cleanValue = this.stepInputText_r.replace(/ mm$/, '').trim();
                            const num = parseFloat(cleanValue);
                            const decimalPart = cleanValue.split('.')[1] || '';
                            // 开始校验
                            if (!isNaN(num) && num > 0 && decimalPart.length <= 2) {
                                this.data.step_r = num;
                                this.stepInputText_r = num.toString();
                            }
                            else {
                                this.data.step_r = 5;
                                this.stepInputText_r = '5';
                                this.showSystemToast('输入无效！已恢复为 5 mm');
                            }
                        });
                    }, TextInput);
                    //步长设置
                    Row.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //r轴控制（角度）
                        Row.create();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //r轴控制（角度）
                        Row.enabled(!this.isMove);
                        //r轴控制（角度）
                        Row.opacity(this.isMove ? 0.5 : 1.0);
                        //r轴控制（角度）
                        Row.width(this.con_width);
                        //r轴控制（角度）
                        Row.height(this.con_height);
                        //r轴控制（角度）
                        Row.justifyContent(FlexAlign.SpaceBetween);
                        //r轴控制（角度）
                        Row.backgroundColor('rgba(255, 255, 255, 0.2)');
                        //r轴控制（角度）
                        Row.borderRadius(30);
                        //r轴控制（角度）
                        Row.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)' // 添加微妙的白色边框
                        });
                        //r轴控制（角度）
                        Row.backdropBlur(8);
                        Context.animation(null);
                        //r轴控制（角度）
                        Row.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.decreaseSpeedR();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777251, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('R-');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //数值显示
                        Row.create();
                        //数值显示
                        Row.justifyContent(FlexAlign.Center);
                        //数值显示
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create((this.data.rValue).toFixed(2) + ' °');
                        Text.fontSize(this.button_icon_size);
                        Text.fontWeight(FontWeight.Bold);
                        Text.width(150);
                        Text.height(50);
                        Text.fontColor(Color.White);
                        Text.textAlign(TextAlign.Center);
                        Text.backgroundColor(Color.Transparent);
                    }, Text);
                    Text.pop();
                    //数值显示
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('R+');
                        Text.fontColor(Color.White);
                        Text.fontSize(this.button_icon_size);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithChild({ type: ButtonType.Circle, stateEffect: true });
                        Button.width(this.button_size);
                        Button.height(this.button_size);
                        Button.backgroundColor(Color.Transparent);
                        Button.onClick(() => {
                            this.increaseSpeedR();
                        });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777261, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" });
                        Image.width(this.button_icon_size);
                        Image.height(this.button_icon_size);
                    }, Image);
                    Button.pop();
                    Row.pop();
                    //r轴控制（角度）
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('状态控制：');
                        Text.fontColor(Color.White);
                    }, Text);
                    Text.pop();
                    Row.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.width('100%');
                        Row.justifyContent(FlexAlign.SpaceAround);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //设置回零按钮
                        Button.createWithLabel('回零');
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //设置回零按钮
                        Button.fontSize(this.catch_font_size);
                        //设置回零按钮
                        Button.fontWeight(FontWeight.Bold);
                        //设置回零按钮
                        Button.fontColor(Color.White);
                        //设置回零按钮
                        Button.width(this.catch_size_width);
                        //设置回零按钮
                        Button.height(this.catch_size_height);
                        //设置回零按钮
                        Button.borderRadius(20);
                        //设置回零按钮
                        Button.border({
                            width: 1,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //设置回零按钮
                        Button.backgroundColor('rgba(0, 200, 83, 0.5)');
                        //设置回零按钮
                        Button.borderRadius(30);
                        //设置回零按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //设置回零按钮
                        Button.backdropBlur(12);
                        Context.animation(null);
                        //设置回零按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    //设置回零按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //抓取释放按钮
                        Button.createWithChild();
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //抓取释放按钮
                        Button.width(this.catch_size_width);
                        //抓取释放按钮
                        Button.height(this.catch_size_height);
                        //抓取释放按钮
                        Button.enabled(this.endAbled);
                        //抓取释放按钮
                        Button.backgroundColor(!this.endAbled ? 'rgba(173, 170, 170, 0.40)' : 'rgba(0, 200, 83, 0.5)');
                        //抓取释放按钮
                        Button.onClick(async () => {
                            // 切换末端状态
                            if (this.isCatch) {
                                //释放逻辑
                                const isSet: boolean = await this.setEndControl("true false");
                                if (isSet) {
                                    this.showSystemToast('释放成功');
                                }
                                else {
                                    this.showSystemToast('释放失败');
                                }
                            }
                            else {
                                //抓取逻辑
                                const isSet: boolean = await this.setEndControl("true true");
                                if (isSet) {
                                    this.showSystemToast('抓取成功');
                                }
                                else {
                                    this.showSystemToast('抓取失败');
                                }
                            }
                        });
                        //抓取释放按钮
                        Button.borderRadius(30);
                        //抓取释放按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //抓取释放按钮
                        Button.backdropBlur(12);
                        Context.animation(null);
                        //抓取释放按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 10 });
                        Row.justifyContent(FlexAlign.Center);
                        Row.alignItems(VerticalAlign.Center);
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 根据状态显示不同文本
                        Text.create(!this.isCatch ? '点击抓取' : '点击释放');
                        // 根据状态显示不同文本
                        Text.fontSize(this.catch_font_size);
                        // 根据状态显示不同文本
                        Text.fontColor(Color.White);
                    }, Text);
                    // 根据状态显示不同文本
                    Text.pop();
                    Row.pop();
                    //抓取释放按钮
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        //急停按钮
                        Button.createWithLabel('急停');
                        Context.animation({ duration: 250, curve: Curve.EaseInOut });
                        //急停按钮
                        Button.width(this.catch_size_width);
                        //急停按钮
                        Button.height(this.catch_size_height);
                        //急停按钮
                        Button.fontSize(this.catch_font_size);
                        //急停按钮
                        Button.fontColor(Color.White);
                        //急停按钮
                        Button.onClick(() => {
                            this.setStop();
                        });
                        //急停按钮
                        Button.backgroundColor('rgba(0, 200, 83, 0.5)');
                        //急停按钮
                        Button.borderRadius(30);
                        //急停按钮
                        Button.border({
                            width: 1.5,
                            color: 'rgba(255, 255, 255, 0.3)'
                        });
                        //急停按钮
                        Button.backdropBlur(12);
                        Context.animation(null);
                        //急停按钮
                        Button.shadow({ radius: 5, color: 'rgba(0,0,0,0.1)' });
                    }, Button);
                    //急停按钮
                    Button.pop();
                    Row.pop();
                    // 原有的控制面板UI
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.position({ top: 10, right: 50 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //刷新按钮
                    ActionButton(this, {
                        // 请替换为您的图标资源
                        icon: { "id": 16777289, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        click: async () => {
                            const is1 = await this.getNowPosition();
                            const is2 = await this.getAlarms();
                            const is3 = await this.getEndStatus();
                            if (is1 && is2 && is3) {
                                this.showSystemToast('刷新成功');
                            }
                            else {
                                this.showSystemToast('刷新失败');
                            }
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/RobotArm3.ets", line: 1545, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            // 请替换为您的图标资源
                            icon: { "id": 16777289, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            click: async () => {
                                const is1 = await this.getNowPosition();
                                const is2 = await this.getAlarms();
                                const is3 = await this.getEndStatus();
                                if (is1 && is2 && is3) {
                                    this.showSystemToast('刷新成功');
                                }
                                else {
                                    this.showSystemToast('刷新失败');
                                }
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "ActionButton" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.position({ top: 10, right: 10 });
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    //切换按钮
                    ActionButton(this, {
                        // 请替换为您的图标资源
                        icon: { "id": 16777231, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                        click: () => {
                            Context.animateTo({ duration: 800, curve: Curve.EaseInOut }, async () => {
                                this.data.isRegionAVisible = !this.data.isRegionAVisible;
                                this.data.isInfoCardVisible = !this.data.isInfoCardVisible;
                                if (!this.data.isInfoCardVisible) {
                                    await this.getNowPosition();
                                    await this.getAlarms();
                                    await this.getEndStatus();
                                }
                            });
                        }
                    }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/device/RobotArm3.ets", line: 1562, col: 11 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            // 请替换为您的图标资源
                            icon: { "id": 16777231, "type": 20000, params: [], "bundleName": "com.my.myapplication", "moduleName": "entry" },
                            click: () => {
                                Context.animateTo({ duration: 800, curve: Curve.EaseInOut }, async () => {
                                    this.data.isRegionAVisible = !this.data.isRegionAVisible;
                                    this.data.isInfoCardVisible = !this.data.isInfoCardVisible;
                                    if (!this.data.isInfoCardVisible) {
                                        await this.getNowPosition();
                                        await this.getAlarms();
                                        await this.getEndStatus();
                                    }
                                });
                            }
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "ActionButton" });
        }
        __Common__.pop();
        //控制区域
        Stack.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.isPreviewVisible) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildImagePreview.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
class ActionButton extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.icon = undefined;
        this.click = undefined;
        this.__isPressed = new ObservedPropertySimplePU(false, this, "isPressed");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ActionButton_Params) {
        if (params.icon !== undefined) {
            this.icon = params.icon;
        }
        if (params.click !== undefined) {
            this.click = params.click;
        }
        if (params.isPressed !== undefined) {
            this.isPressed = params.isPressed;
        }
    }
    updateStateVars(params: ActionButton_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isPressed.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isPressed.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private icon: Resource;
    private click: () => void;
    private __isPressed: ObservedPropertySimplePU<boolean>;
    get isPressed() {
        return this.__isPressed.get();
    }
    set isPressed(newValue: boolean) {
        this.__isPressed.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Context.animation({ duration: 150, curve: Curve.EaseOut });
            Row.width(44);
            Row.height(44);
            Row.backgroundColor('rgba(255, 255, 255, 0.15)');
            Row.borderRadius(22);
            Row.justifyContent(FlexAlign.Center);
            Row.scale({ x: this.isPressed ? 0.9 : 1.0, y: this.isPressed ? 0.9 : 1.0 });
            Row.opacity(this.isPressed ? 0.7 : 1.0);
            Context.animation(null);
            Row.onTouch((event: TouchEvent) => {
                if (event.type === TouchType.Down) {
                    this.isPressed = true;
                }
                if (event.type === TouchType.Up) {
                    this.isPressed = false;
                    this.click();
                }
                if (event.type === TouchType.Cancel) {
                    this.isPressed = false;
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.icon);
            Image.width(22);
            Image.height(22);
            Image.fillColor(Color.White);
        }, Image);
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
