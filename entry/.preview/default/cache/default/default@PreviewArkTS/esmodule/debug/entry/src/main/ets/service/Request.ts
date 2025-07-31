import axios, { AxiosError } from "@normalized:N&&&@ohos/axios/index&2.2.6";
import type { AxiosResponse } from "@normalized:N&&&@ohos/axios/index&2.2.6";
//为所有认证相关的请求设置统一的 baseURL 和 timeout，方便管理
const authAPI = axios.create({
    baseURL: 'http://www.ubeepic.com:8100/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
//登录请求接口
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
        //登录成功返回数据
        return responseData;
    }
    catch (error) {
        //登录错误捕获异常
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
            console.error('【登录接口】捕获到未知错误:', JSON.stringify(error));
        }
        return null;
    }
}
