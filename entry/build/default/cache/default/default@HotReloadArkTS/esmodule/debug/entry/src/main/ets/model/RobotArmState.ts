// 使用 class 定义一个数据模型，它包含了机械臂的所有状态
export interface Point {
    x: number;
    y: number;
}
export class RobotArmState {
    xValue: number = 0;
    yValue: number = 0;
    zValue: number = 0;
    zzValue: number = 0;
    rValue: number = 0;
    rrValue: number = 0;
    jumpValue: number = 0;
    //持久化界面动画执行信息
    isInfoCardVisible: boolean = false;
    controlCardWidth: string = '60%';
    isRegionAVisible: boolean = false;
    // 提升后的“逻辑”坐标 (用于Canvas内部计算和动画)
    currentPos: Point = { x: 0, y: 0 };
    targetPos: Point = { x: 0, y: 0 };
    step_xyz: number = 5;
    step_r: number = 5;
}
