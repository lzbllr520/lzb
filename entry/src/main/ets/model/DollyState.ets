// 使用 class 定义一个数据模型，它包含了小车的所有状态
export class DollyState {
  xValue: number = 0;
  yValue: number = 0;
  statusText: string = '离线中';
  loadText: string = '无物品';
}