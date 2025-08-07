//集成所有网络请求函数文件
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from '@ohos/axios';
import {Server,Node} from '../model/ServerState'
//导入全局变量来使用，因为这不是一个页面或者组件，不存在this和context
import { globalAbilityContext } from '../entryability/EntryAbility';
import { preferences } from '@kit.ArkData';

// 定义所有不需要 Token 认证的公开API路径
const PUBLIC_PATHS = ['/system/user/login', '/'];
const PREFERENCES_FILE_NAME = 'login_prefs'

//用于统一处理基础基础url、超时时间、请求头
const authAPI = axios.create({
  baseURL: 'http://192.168.2.88:8100/api',
  timeout: 10000, // 请求超时时间设置为10s
  headers: {
    'Content-Type': 'application/json'
  }
})

//给authAPIToken添加请求拦截器
authAPI.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      //如果当前的路径存在于前面定义的公共路径中，就是不需要token的，直接返回即可
      if (config.url && PUBLIC_PATHS.includes(config.url)) {
        return config
      }
      //不存在的话，就是需要token
      const prefs = await preferences.getPreferences(globalAbilityContext, PREFERENCES_FILE_NAME)
      const token = await prefs.get('token', '')
      if (token) {
        //如果token存在，请求拦截器就将token添加到请求头中
        config.headers.Authorization = `Bearer ${token}`
      } else {
        console.info('【请求拦截器】从本地获取到的token值为空')
      }
    } catch (e) {
      console.info('【请求拦截器】从本地获取token失败')
    }
    //顺利完成
    //返回修改后的 config 对象，请求将携带新的请求头发起
    return config;
  },
  (error:AxiosError) => {
    //请求拦截器发生错误
    return Promise.reject(error);
  }
);

//测试与服务器连接情况的请求接口
export async function checkApiStatus(): Promise<boolean> {
  try {
    // 使用 GET 方法请求 /api 根路径
    const responseData: AxiosResponse = await authAPI.get('/');

    return responseData.status===200

  } catch (error) {
    // 捕获所有类型的错误（网络问题、超时、服务器错误等）
    if (error instanceof AxiosError) {
      if (error.response) {
        // 服务器有响应，但状态码是 4xx 或 5xx
        console.info('【状态接口】服务器响应错误:', error.response.status, error.response.data);
      } else {
        // 请求已发出，但没有收到响应（例如网络不通或超时）
        console.info('【状态接口】网络或请求设置错误:', error.message);
      }
    } else {
      // 其他未知错误
      console.info('【状态接口】捕获到未知错误:', JSON.stringify(error));
    }
    // 发生任何错误都表示连接失败
    return false;
  }
}

//登录接口
//请求发送的据格式
export interface LoginRequestData {
  mobile: string;
  password: string;
}
//请求函数
export async function login(mobile: string, password: string): Promise<AxiosResponse|null> {
  const requestData: LoginRequestData = {
    mobile: mobile,
    password: password
  };
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/system/user/login',
      requestData
    );
    console.info('【登录接口】登录成功')
    return responseData;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info('【登录接口】服务器响应错误:', error.response.status, error.response.data);
      } else {
        console.info('【登录接口】网络或请求设置错误:', error.message);
      }
    } else if (error instanceof Error) {
      console.info('【登录接口】捕获到普通错误:', error.message);
    } else {
      console.info('【登录接口】捕获到未知错误:', JSON.stringify(error));
    }
    return null;
  }
}

//获取所有服务接口
export async function getAllServers(): Promise<Server[] | null> {
  try {
    const responseData: AxiosResponse = await authAPI.get('/opcua/connected-servers');
    console.info('【获取所有服务接口】获取所有服务接口成功');
    return responseData.data.data.servers
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info('【获取所有服务接口】服务器响应错误:', error.response.status, error.response.data);
      } else {
        console.info('【获取所有服务接口】网络或请求设置错误:', error.message);
      }
    } else {
      console.info('【获取所有服务接口】捕获到未知错误:', JSON.stringify(error));
    }
    return null;
  }
}

//获取对应服务下的第一层结点
export interface NodeRequestDataStart{
  id:string
}
export async function getNodeStart(serverId:string): Promise<Node[]|null> {
  let requestData: NodeRequestDataStart = {
    id:serverId
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的第一层结点接口】获取成功`)
    return responseData.data.data.nodes;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的第一层结点接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的第一层结点接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的第一层结点接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的第一层结点接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//获取对应服务下的其他层结点
export interface NodeRequestDataOther{
  id:string,
  node_id:string
}
export async function getNodeOther(serverId:string,node_id:string): Promise<Node[]|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的其他层结点接口】获取成功`)
    return responseData.data.data.nodes
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的其他层结点接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的其他层结点接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的其他层结点接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的其他层结点接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeEn(serverId:string,node_id:string): Promise<number[]|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的环境数据接口】获取成功`)
    return responseData.data.data.output_args
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的环境数据接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的环境数据接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的环境数据接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的环境数据接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeVoice(serverId:string,node_id:string): Promise<number|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的噪声数据接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的噪声数据接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的噪声数据接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的噪声数据接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的噪声数据接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeRed1(serverId:string,node_id:string): Promise<boolean|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的红外检测状态接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的红外检测状态接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的红外检测状态接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的红外检测状态接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的红外检测状态接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeRed2(serverId:string,node_id:string): Promise<number|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的红外检测次数接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的红外检测次数接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的红外检测次数接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的红外检测次数接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的红外检测次数接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeShark1(serverId:string,node_id:string): Promise<boolean|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的震动状态接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的震动状态接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的震动状态接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的震动状态接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的震动状态接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeShark2(serverId:string,node_id:string): Promise<number|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的震动次数接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的震动次数接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的震动次数接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的震动次数接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的震动次数接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeShark3(serverId:string,node_id:string): Promise<number|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的脉冲次数接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的脉冲次数接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的脉冲次数接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的脉冲次数接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的脉冲次数接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeRFID1(serverId:string,node_id:string): Promise<string|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的卡片UID接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的卡片UID接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的卡片UID接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的卡片UID接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的卡片UID接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeRFID2(serverId:string,node_id:string): Promise<string|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的卡片存在接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的卡片存在接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的卡片存在接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的卡片存在接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的卡片存在接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeRFID3(serverId:string,node_id:string): Promise<string|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的卡片数据块内容接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的卡片数据块内容接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的卡片数据块内容接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的卡片数据块内容接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的卡片数据块内容接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeRFID4(serverId:string,node_id:string): Promise<string|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的卡片读取次数接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的卡片读取次数接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的卡片读取次数接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的卡片读取次数接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的卡片读取次数接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export async function getNodeRFID5(serverId:string,node_id:string): Promise<string|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的卡片最后读取时间接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的卡片最后读取时间接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的卡片最后读取时间接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的卡片最后读取时间接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的卡片最后读取时间接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//获取传送带速度
export async function getConveyorSpeed(serverId:string,node_id:string): Promise<AxiosResponse|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`${responseData.data.data.value}【获取${serverId}服务的传送带速度接口】获取成功`)
    return responseData
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的传送带速度接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的传送带速度接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的传送带速度接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的传送带速度接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export interface ConveyorData{
  id:string,
  node_id:string,
  action:string
}
//设置传送带速度
export async function setConveyorSpeed(serverId:string,node_id:string, action:string): Promise<AxiosResponse|null> {
  let requestData: ConveyorData = {
    id:serverId,
    node_id:node_id,
    action:action
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`${action}【设置${serverId}服务的传送带速度接口】获取成功`)
    return responseData
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【设置${serverId}服务的传送带速度接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【设置${serverId}服务的传送带速度接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【设置${serverId}服务的传送带速度接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【设置${serverId}服务的传送带速度接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//启动传送带
export async function openConveyor(serverId:string,node_id:string): Promise<AxiosResponse|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【启动${serverId}服务的传送带接口】获取成功`)
    return responseData
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【启动${serverId}服务的传送带接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【启动${serverId}服务的传送带接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【启动${serverId}服务的传送带接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【启动${serverId}服务的传送带接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//关闭传送带
export async function closeConveyor(serverId:string,node_id:string): Promise<AxiosResponse|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【关闭${serverId}服务的传送带接口】获取成功`)
    return responseData
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【关闭${serverId}服务的传送带接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【关闭${serverId}服务的传送带接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【关闭${serverId}服务的传送带接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【关闭${serverId}服务的传送带接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//设置运行方向
export async function setConveyorDirection(serverId:string,node_id:string,action:string): Promise<AxiosResponse|null> {
  let requestData: ConveyorData = {
    id:serverId,
    node_id:node_id,
    action:action
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【设置${serverId}服务的传送带方向接口】获取成功`)
    return responseData
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【设置${serverId}服务的传送带方向接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【设置${serverId}服务的传送带方向接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【设置${serverId}服务的传送带方向接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【设置${serverId}服务的传送带方向接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//设置停止模式
export async function setConveyorStop(serverId:string,node_id:string,action:string): Promise<AxiosResponse|null> {
  let requestData: ConveyorData = {
    id:serverId,
    node_id:node_id,
    action:action
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`ppp${action}【设置${serverId}服务的传送带停止模式接口】获取成功`)
    return responseData
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【设置${serverId}服务的传送带停止模式接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【设置${serverId}服务的传送带停止模式接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【设置${serverId}服务的传送带停止模式接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【设置${serverId}服务的传送带停止模式接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

export interface RobotArmData{
  id:string,
  node_id:string,
  action:string
}
//获取机械臂系统时间
export async function getRobotArmTime(serverId:string,node_id:string): Promise<number|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的机械臂系统时间接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的机械臂系统时间接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的机械臂系统时间接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的机械臂系统时间接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的机械臂系统时间接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//获取机械臂uid
export async function getRobotArmUid(serverId:string,node_id:string): Promise<string|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的机械臂uid接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的机械臂uid接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的机械臂uid接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的机械臂uid接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的机械臂uid接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//获取机械臂警报信息
export async function getRobotArmAlarms(serverId:string,node_id:string): Promise<number|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【${responseData.data.data.value}获取${serverId}服务的机械臂警报接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的机械臂警报接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的机械臂警报接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的机械臂警报接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的机械臂警报接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//清除机械臂警报
export async function clearRobotArmAlarms(serverId:string,node_id:string): Promise<boolean|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【清除${serverId}服务的机械臂警报接口】获取成功`)
    return responseData.data.code===0
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【清除${serverId}服务的机械臂警报接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【清除${serverId}服务的机械臂警报接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【清除${serverId}服务的机械臂警报接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【清除${serverId}服务的机械臂警报接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//控制末端执行器
export async function endControl(serverId:string,node_id:string,action:string): Promise<boolean|null> {
  let requestData: RobotArmData= {
    id:serverId,
    node_id:node_id,
    action:action
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`获取【${serverId}服务的机械臂末端执行接口】获取成功`)
    return responseData.data.code===0
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`获取【${serverId}服务的机械臂末端执行接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`获取【${serverId}服务的机械臂末端执行接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`获取【${serverId}服务的机械臂末端执行接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`获取【${serverId}服务的机械臂末端执行接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//获取机械臂警报信息
export async function getEndStatus(serverId:string,node_id:string): Promise<boolean[]|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的机械臂使能接口】获取成功`)
    return responseData.data.data.output_args
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的机械臂使能接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的机械臂使能接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的机械臂使能接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的机械臂使能接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//赋予机械臂末端控制器使能
export async function setEndAble(serverId:string,node_id:string,action:string): Promise<boolean|null> {
  let requestData: RobotArmData= {
    id:serverId,
    node_id:node_id,
    action:action
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`赋予【${serverId}服务的机械臂末端使能接口】获取成功`)
    return responseData.data.code===0
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`赋予【${serverId}服务的机械臂末端使能接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`赋予【${serverId}服务的机械臂末端使能接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`赋予【${serverId}服务的机械臂末端使能接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`赋予【${serverId}服务的机械臂末端使能接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//赋予机械臂末端控制器使能
export async function clearEndAble(serverId:string,node_id:string,action:string): Promise<boolean|null> {
  let requestData: RobotArmData= {
    id:serverId,
    node_id:node_id,
    action:action
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`清除【${serverId}服务的机械臂末端使能接口】获取成功`)
    return responseData.data.code===0
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`清除【${serverId}服务的机械臂末端使能接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`清除【${serverId}服务的机械臂末端使能接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`清除【${serverId}服务的机械臂末端使能接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`清除【${serverId}服务的机械臂末端使能接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//获取当前机械臂位姿
export async function getRobotArmNowPosition(serverId:string,node_id:string): Promise<number[]|null> {
  let requestData: NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`【获取${serverId}服务的机械臂位姿接口】获取成功`)
    return responseData.data.data.value
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【获取${serverId}服务的机械臂位姿接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【获取${serverId}服务的机械臂位姿接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【获取${serverId}服务的机械臂位姿接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【获取${serverId}服务的机械臂位姿接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//机械臂设置回零
export async function setToStart(serverId:string,node_id:string): Promise<boolean|null> {
  let requestData:NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`设置【${serverId}服务的机械臂回零接口】获取成功`)
    return responseData.data.code===0
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`设置【${serverId}服务的机械臂回零接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`设置【${serverId}服务的机械臂回零接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`设置【${serverId}服务的机械臂回零接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`设置【${serverId}服务的机械臂回零接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//机械臂设置急停
export async function setStop(serverId:string,node_id:string): Promise<boolean|null> {
  let requestData:NodeRequestDataOther = {
    id:serverId,
    node_id:node_id
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`设置【${serverId}服务的机械臂急停接口】获取成功`)
    return responseData.data.code===0
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`设置【${serverId}服务的机械臂急停接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`设置【${serverId}服务的机械臂急停接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`设置【${serverId}服务的机械臂急停接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`设置【${serverId}服务的机械臂急停接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//点按移动机械臂
export async function setRobotArmMove(serverId:string,node_id:string,action:string): Promise<boolean|null> {
  let requestData: RobotArmData= {
    id:serverId,
    node_id:node_id,
    action:action
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`${action}【${serverId}服务的机械臂移动接口】获取成功`)
    return responseData.data.code===0
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【${serverId}服务的机械臂移动接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【${serverId}服务的机械臂移动接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【${serverId}服务的机械臂移动接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【${serverId}服务的机械臂移动接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}

//jump移动
export async function jumpRobotArmMove(serverId:string,node_id:string,action:string): Promise<boolean|null> {
  let requestData: RobotArmData= {
    id:serverId,
    node_id:node_id,
    action:action
  }
  try {
    const responseData: AxiosResponse = await authAPI.post(
      '/opcua/browse-nodes',
      requestData
    );
    console.info(`${action}【${serverId}服务的机械臂jump移动接口】获取成功`)
    return responseData.data.code===0
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        console.info(`【${serverId}服务的机械臂jump移动接口】服务器响应错误:`, error.response.status, error.response.data);
      } else {
        console.info(`【${serverId}服务的机械臂jump移动接口】网络或请求设置错误:`, error.message);
      }
    } else if (error instanceof Error) {
      console.info(`【${serverId}服务的机械臂jump移动接口】捕获到普通错误:`, error.message);
    } else {
      console.info(`【${serverId}服务的机械臂jump移动接口】捕获到未知错误:`, JSON.stringify(error));
    }
    return null;
  }
}




