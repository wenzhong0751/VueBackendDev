import Cookies from "js-cookie";

const state = {
    // 用户名
    name: "",
    // 用户对象
    user: ""
};

const mutations = {
    setName: (state, data) => {
        console.log("setUsername:" + data);
        if (data) {
            Cookies.set("userName", encodeURIComponent(data), {
                expires: 365
            });
        } else {
            Cookies.remove("userName");
        }
        state.name = data;
    },

    setUser: (state, data) => {
        console.log("setUser:" + data);
        if (data) {
            Cookies.set("user", encodeURIComponent(data), { expires: 365 });
        } else {
            Cookies.remove("user");
        }
        state.user = data;
    }
};

export default {
    namespaced: true,
    state,
    mutations
};
