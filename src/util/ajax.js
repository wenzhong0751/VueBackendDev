/**
 * axios全局配置
 * TODO: 拦截器全局配置，根据实际情况修改
 */
import axios from "axios";
import store from "../store";
import router from "../router";
import { Message } from "element-ui";
import Auth from "@/util/auth";

var getTokenLock = false,
    CancelToken = axios.CancelToken,
    requestList = [];

function checkTokenSwz(cancel, callback) {
    console.log(Auth.hasJwt());
    if (!Auth.hasJwt()) {
        console.log("jwt missing, do nothing");
    } else {
        console.log("has jwt. continue...");
        callback();
    }
}

/**
 * Token校验
 * @param {function} cancel - 中断函数
 * @param {function} callback -  回调
 * @description 校验Token是否过期，如果Token过期则根据配置采用不同方法获取新Token
 *              自动获取Token：过期时自动调用获取Token接口。注意：当有任一请求在获取Token时，其余请求将顺延，直至新Token获取完毕
 *              跳转授权Token：过期时中断当前所有请求并跳转到对应页面获取Token。注意：跳转页面授权最佳实现应在授权页面点击触发
 */
function checkToken(cancel, callback) {
    if (!Auth.hasToken()) {
        // 自动获取Token
        console.log("即将获取token");
        if (Auth.tokenTimeoutMethod == "getNewToken") {
            // 如果当前有请求正在获取Token
            console.log("使用getNewToken");
            if (getTokenLock) {
                console.log("getTokenLock = ture");
                setTimeout(function() {
                    checkToken(cancel, callback);
                }, 500);
            } else {
                getTokenLock = true;
                console.log("加锁，使用getNewToken");
                store.dispatch("auth/getNewToken").then(() => {
                    console.log("已获取新token");
                    callback();
                    getTokenLock = false;
                });
            }
        }

        // 跳转授权Token
        if (Auth.tokenTimeoutMethod == "jumpAuthPage" && Auth.isLogin()) {
            if (router.currentRoute.path != "/auth") {
                // BUG: 无法保证一定会中断所有请求
                cancel();
                router.push("/auth");
            }
        }
    } else {
        console.log("取消请求");
        callback();
    }
}

/**
 * 阻止短时间内的重复请求
 * @param {string} url - 当前请求地址
 * @param {function} c - 中断请求函数
 * @description 每个请求发起前先判断当前请求是否存在于RequestList中，
 *              如果存在则取消该次请求，如果不存在则加入RequestList中，
 *              当请求完成后500ms时，清除RequestList中对应的该请求。
 */
function stopRepeatRequest(url, c) {
    console.log("befroe call url=" + url);
    for (let i = 0; i < requestList.length; i++) {
        if (requestList[i] == url) {
            c();
            console.log("repeat url=" + url);
            return;
        }
    }
    console.log("url=" + url);
    requestList.push(url);
}

// 超时设置
const service = axios.create({
    // 请求超时时间
    timeout: 5000
});

// baseURL
// axios.defaults.baseURL = 'https://api.github.com';

// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
service.interceptors.request.use(
    config => {
        let cancel;
        config.cancelToken = new CancelToken(function executor(c) {
            cancel = c;
        });
        if (config.url.endsWith("tokenKey=get") || config.url.endsWith("account/login")){
            console.log("to login,skip jwt check.")
        }else{
            console.log("开始检查Token...")
            checkTokenSwz(cancel, () => {
                console.log("开始增加头部信息...",`${store.state.auth.appId}`,`${store.state.auth.jwt}`)
                config.headers.Authorization = `${store.state.auth.jwt}`;
                config.headers.appId = `${store.state.auth.appId}`;
            });
        }
        // checkToken(cancel, function(){
        //     // Auth.setLoginStatus()
        //     config.headers.Authorization = `${store.state.auth.token}`
        //     console.log("config.headers.Authorization=" + config.headers.Authorization);
        // })
        stopRepeatRequest(config.url, cancel);
        return config;
    },
    err => {
        console.log("发生错误了：" + err);
        return Promise.reject(err);
    }
);

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
    response => {
        for (let i = 0; i < requestList.length; i++) {
            console.log("list url:" + requestList[i]);
            if (requestList[i] == response.config.url) {
                // 注意，不能保证500ms必定执行，详情请了解JS的异步机制
                setTimeout(function() {
                    console.log("remove url:" + requestList[i],i,response.config.url);
                    requestList.splice(requestList.findIndex(item => item === response.config.url), 1);
                }, 50);
                // 这里原本为500ms
                break;
            }
        }
        return Promise.resolve(response.data);
    },
    error => {
        if (axios.isCancel(error)) {
            console.log(error);
            return Promise.reject("Ajax Abort: 该请求在axios拦截器中被中断");
        } else if (error.response) {
            switch (error.response.status) {
                case 401:
                    router.push("error/401");
                case 403:
                    router.push("error/403");
                default:
                    Message({
                        message: `服务器错误！错误代码：${error.response.status}`,
                        type: "error"
                    });
            }
            return Promise.reject(error.response.data);
        }
    }
);

export default service;
