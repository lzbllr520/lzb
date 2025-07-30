// 使用 class 定义一个数据模型，它包含了机械臂的所有状态
export class RobotArmState {
    xValue: number = 0;
    yValue: number = 0;
    zValue: number = 0;
    statusText: string = '离线中';
    endStatusText: string = '释放';
    loadText: string = '无物品';
    //持久化界面动画执行信息
    isInfoCardVisible: boolean = false;
    controlCardWidth: string = '60%';
    mapCardWidth: string = '65%';
    isRegionAVisible: boolean = false;
}
