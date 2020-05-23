import Cookies from "js-cookie";
import axios from "@/util/ajax";
import Auth from "@/util/auth";
import CryptoJS from "crypto-js";

const state = {
    token: "",
    appId: "",
    jwt: "",
    navList: []
};

const mutations = {
    setNavList: (state, data) => {
        state.navList = data;
    },

    setToken: (state, data) => {
        console.log("setToken will be call:" + data);
        if (data) {
            Auth.setToken(data);
            Auth.setLoginStatus();
        } else {
            Auth.removeToken();
            Auth.removeLoginStatus();
        }
        state.token = data;
    },

    setJwt: (state, data) => {
        console.log("setJwt:" + data);
        if (data) {
            Auth.setJwt(data);
            Auth.setLoginStatus();
        } else {
            Auth.removeJwt();
            Auth.removeLoginStatus();
        }
        state.jwt = data;
    },

    setAppId: (state, data) => {
        console.log("setAppId:" + data);
        if (data) {
            Auth.setAppId(data);
        } else {
            Auth.removeAppId();
        }
        state.appId = data;
    }
};

const actions = {
    // 邮箱登录
    loginByEmail({ commit }, userInfo) {
        return new Promise(resolve => {
            axios({
                url: "/login",
                method: "post",
                data: {
                    ...userInfo
                }
            }).then(res => {
                if (res.login) {
                    commit("setToken", res.token);
                    commit("user/setName", res.name, { root: true });
                }
                resolve(res);
            });
        });
    },

    loginByPassword({ commit }, userInfo) {
        return new Promise(resolve => {
            axios({
                transformRequest: [
                    function(data) {
                        data = JSON.stringify(data);
                        return data;
                    }
                ],
                url: "http://127.0.0.1:8080/account/register?tokenKey=get",
                method: "get"
            }).then(res => {
                resolve(res);
            });
        })
            .then(res => {
                if (res.meta.code === 1000) {
                    let userKey = res.data.userKey;
                    let key = res.data.tokenKey;
                    let tokenKey = CryptoJS.enc.Utf8.parse(key);

                    let srcs = CryptoJS.enc.Utf8.parse(userInfo.password);
                    let password = CryptoJS.AES.encrypt(srcs, tokenKey, {
                        iv: tokenKey,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    });
                    let date1 = new Date();
                    let date2 = Date.parse(date1) / 1000;

                    return axios({
                        url: "http://127.0.0.1:8080/account/login",
                        method: "post",
                        data: {
                            appId: userInfo.name,
                            password: `${password}`,
                            methodName: "login",
                            userKey: `${userKey}`,
                            timestamp: `${date2}`
                        }
                    });
                }
            })
            .then(res => {
                console.log("loginResult:" + res);
                if (res.meta.success) {
                    commit("setJwt", res.data.jwt);
                    commit("setAppId", res.data.user.username);
                    commit("user/setName", res.data.user.username, {
                        root: true
                    });
                    commit("user/setUser", res.data.user, { root: true });
                }
                return res;
            });
    },

    // 登出
    logout({ commit }) {
        return new Promise(resolve => {
            commit("setToken", "");
            commit("user/setName", "", { root: true });
            commit("tagNav/removeTagNav", "", { root: true });
            resolve();
        });
    },

    // 重新获取用户信息及Token
    // TODO: 这里不需要提供用户名和密码，实际中请根据接口自行修改
    relogin({ dispatch, commit, state }) {
        return new Promise(resolve => {
            // 根据Token进行重新登录
            let token = Cookies.get("token"),
                userName = Cookies.get("userName");

            // 重新登录时校验Token是否存在，若不存在则获取
            if (!token) {
                dispatch("getNewToken").then(() => {
                    commit("setToken", state.token);
                });
            } else {
                commit("setToken", token);
            }
            // 刷新/关闭浏览器再进入时获取用户名
            commit("user/setName", decodeURIComponent(userName), {
                root: true
            });
            resolve();
        });
    },

    // 获取新Token
    getNewToken({ commit, state }) {
        return new Promise(resolve => {
            axios({
                url: "/getToken",
                method: "get",
                param: {
                    token: state.token
                }
            }).then(res => {
                console.log("getToken=" + res.token);
                commit("setToken", res.token);
                resolve();
            });
        });
    },

    // 获取该用户的菜单列表
    getNavList({ commit }) {
        return new Promise(resolve => {
            axios({
                url: "http://127.0.0.1:8080/resource/authorityMenu",
                // url: "http://192.168.0.164:8080/account/register?tokenKey=get",
                method: "get"
            }).then(res => {
                console.log("getMenu res:" + res);
                let localMenus = [];
                if (res.meta.code === 6666){
                    let menus = res.data.menuTree;
                    // menus.forEach(menu => {
                        
                    // });

                    function transMenus2local(srcArr,desArr){
                        srcArr.forEach(menu => {
                            if (menu.children && menu.children.length > 0){
                                let children = [];
                                transMenus2local(menu.children,children);
                                desArr.push({name:menu.name,path:menu.uri,child:children});
                            }else{
                                desArr.push({name:menu.name,path:menu.uri});
                            }
                        });
                    }
                    transMenus2local(menus,localMenus);

                    // localMenus = menus.map(menu => {
                    //     if (menu.children.length > 0){
                    //         //
                    //         let children = menu.children.map(child => {
                    //             if (child.children.length > 0){
                    //                 let grandChildren = child.children.map( grandChild => {
                    //                     if (grandChild.children.length > 0){
                    //                         let grandChildren2 = grandChild.children.map(grandChild2 => {
                    //                             return {name:grandChild2.name,path:grandChild2.uri};
                    //                         });
                    //                         return {name:grandChild.name,path:grandChild.uri,child:grandChildren2};
                    //                     }else{
                    //                         return {name:grandChild.name,path:grandChild.uri};
                    //                     }
                    //                 });
                    //                 return {name:child.name,path:child.uri,child:grandChildren}; 
                    //             }else{
                    //                 return {name:child.name,path:child.uri};
                    //             }
                    //         });
                    //         return {name:menu.name,path:menu.uri,child:children};
                    //     }else{
                    //         return {name:menu.name,path:menu.uri};
                    //     }
                        
                    // });
                    console.log("localMenus:" + localMenus);
                }

                commit("setNavList", localMenus);
                resolve(localMenus);
            });
        });
    },

    // 获取该用户的菜单列表
    getNavListRaw({ commit }) {
        return new Promise(resolve => {
            axios({
                url: "/user/navlist",
                methods: "post",
                data: {}
            }).then(res => {
                console.log("getMenu res:" + res);
                commit("setNavList", res);
                resolve(res);
            });
        });
    },

    // 将菜单列表扁平化形成权限列表
    getPermissionList({ state }) {
        return new Promise(resolve => {
            let permissionList = [];
            // 将菜单数据扁平化为一级
            function flatNavList(arr) {
                for (let v of arr) {
                    if (v.child && v.child.length) {
                        flatNavList(v.child);
                    } else {
                        permissionList.push(v);
                    }
                }
            }
            flatNavList(state.navList);
            resolve(permissionList);
        });
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
