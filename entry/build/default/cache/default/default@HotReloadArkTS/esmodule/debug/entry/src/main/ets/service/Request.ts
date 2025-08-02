import axios, { AxiosError } from "@normalized:N&&&@ohos/axios/index&2.2.6";
import type { AxiosResponse, InternalAxiosRequestConfig } from "@normalized:N&&&@ohos/axios/index&2.2.6";
import { globalAbilityContext } from "@normalized:N&&&entry/src/main/ets/entryability/EntryAbility&";
import preferences from "@ohos:data.preferences";
// 定义所有不需要 Token 认证的公开API路径
const PUBLIC_PATHS = ['/system/user/login', '/'];
const PREFERENCES_FILE_NAME = 'login_prefs';
//用于统一处理基础基础url、超时时间、请求头
const authAPI = axios.create({
    baseURL: 'http://192.168.2.88:8100/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
//给authAPIToken添加请求拦截器
authAPI.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    try {
        //如果当前的路径存在于前面定义的公共路径中，就是不需要token的，直接返回即可
        if (config.url && PUBLIC_PATHS.includes(config.url)) {
            return config;
        }
        //不存在的话，就是需要token
        const prefs = await preferences.getPreferences(globalAbilityContext, PREFERENCES_FILE_NAME);
        const token = await prefs.get('token', '');
        if (token) {
            //如果token存在，请求拦截器就将token添加到请求头中
            config.headers.Authorization = `Bearer ${token}`;
        }
        else {
            console.info('【请求拦截器】从本地获取到的token值为空');
        }
    }
    catch (e) {
        console.info('【请求拦截器】从本地获取token失败');
    }
    //顺利完成
    //返回修改后的 config 对象，请求将携带新的请求头发起
    return config;
}, (error: AxiosError) => {
    //请求拦截器发生错误
    return Promise.reject(error);
});
//测试与服务器连接情况的请求接口
export async function checkApiStatus(): Promise<boolean> {
    try {
        // 使用 GET 方法请求 /api 根路径
        const responseData: AxiosResponse = await authAPI.get('/');
        return responseData.status === 200;
    }
    catch (error) {
        // 捕获所有类型的错误（网络问题、超时、服务器错误等）
        if (error instanceof AxiosError) {
            if (error.response) {
                // 服务器有响应，但状态码是 4xx 或 5xx
                console.info('【状态接口】服务器响应错误:', error.response.status, error.response.data);
            }
            else {
                // 请求已发出，但没有收到响应（例如网络不通或超时）
                console.info('【状态接口】网络或请求设置错误:', error.message);
            }
        }
        else {
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
export async function login(mobile: string, password: string): Promise<AxiosResponse | null> {
    const requestData: LoginRequestData = {
        mobile: mobile,
        password: password
    };
    try {
        const responseData: AxiosResponse = await authAPI.post('/system/user/login', requestData);
        console.info('【登录接口】登录成功');
        return responseData;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                console.info('【登录接口】服务器响应错误:', error.response.status, error.response.data);
            }
            else {
                console.info('【登录接口】网络或请求设置错误:', error.message);
            }
        }
        else if (error instanceof Error) {
            console.info('【登录接口】捕获到普通错误:', error.message);
        }
        else {
            console.info('【登录接口】捕获到未知错误:', JSON.stringify(error));
        }
        return null;
    }
}
//获取所有服务接口
export async function getAllServers(): Promise<AxiosResponse | null> {
    try {
        const responseData: AxiosResponse = await authAPI.get('/opcua/connected-servers');
        console.info('【获取所有服务接口】获取所有服务接口成功');
        return responseData;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                console.info('【获取所有服务接口】服务器响应错误:', error.response.status, error.response.data);
            }
            else {
                console.info('【获取所有服务接口】网络或请求设置错误:', error.message);
            }
        }
        else {
            console.info('【获取所有服务接口】捕获到未知错误:', JSON.stringify(error));
        }
        return null;
    }
}
//获取对应服务下的第一层结点
export interface NodeRequestDataStart {
    id: string;
}
export async function getNodeStart(serverId: string): Promise<AxiosResponse | null> {
    let requestData: NodeRequestDataStart = {
        id: serverId
    };
    try {
        const responseData: AxiosResponse = await authAPI.post('/opcua/browse-nodes', requestData);
        console.info(`【获取${serverId}服务的第一层结点接口】获取成功`);
        return responseData;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                console.info(`【获取${serverId}服务的第一层结点接口】服务器响应错误:`, error.response.status, error.response.data);
            }
            else {
                console.info(`【获取${serverId}服务的第一层结点接口】网络或请求设置错误:`, error.message);
            }
        }
        else if (error instanceof Error) {
            console.info(`【获取${serverId}服务的第一层结点接口】捕获到普通错误:`, error.message);
        }
        else {
            console.info(`【获取${serverId}服务的第一层结点接口】捕获到未知错误:`, JSON.stringify(error));
        }
        return null;
    }
}
//获取对应服务下的其他层结点
export interface NodeRequestDataOther {
    id: string;
    node_id: string;
}
export async function getNodeOther(serverId: string, node_id: string): Promise<AxiosResponse | null> {
    let requestData: NodeRequestDataOther = {
        id: serverId,
        node_id: node_id
    };
    try {
        const responseData: AxiosResponse = await authAPI.post('/opcua/browse-nodes', requestData);
        console.info(`【获取${serverId}服务的其他层结点接口】获取成功`);
        return responseData;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            if (error.response) {
                console.info(`【获取${serverId}服务的其他层结点接口】服务器响应错误:`, error.response.status, error.response.data);
            }
            else {
                console.info(`【获取${serverId}服务的其他层结点接口】网络或请求设置错误:`, error.message);
            }
        }
        else if (error instanceof Error) {
            console.info(`【获取${serverId}服务的其他层结点接口】捕获到普通错误:`, error.message);
        }
        else {
            console.info(`【获取${serverId}服务的其他层结点接口】捕获到未知错误:`, JSON.stringify(error));
        }
        return null;
    }
}
