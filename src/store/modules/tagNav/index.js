const state = {
    // 是否要缓存页面，默认不缓存
    cachePage: false,
    // 已经打开的页面
    openedPageList: [],
    // 缓存的页面
    cachedPageName: []
}

const mutations = {
    // 增加标签导航，如果有缓存，在缓存中也增加
    addTagNav(state, data){
        if (state.openedPageList.some(v => v.path === data.path)) return
        if(state.cachedPageName.includes(data.name)){
            console.error(`${data.name} 组件出现命名重复，请检查组件中的name字段。当前组件所在的路由地址为：${data.path}`)
            return
        }
        state.openedPageList.push(data)
        if(state.cachePage){
            state.cachedPageName.push(data.name)
        }
    },
    // 去除标签导航，如果未指定具体的data，则删除所有的导航标签及缓存
    removeTagNav(state, data){
        if(data){
            for(let [i, v] of state.openedPageList.entries()){
                if(v.path === data.path){
                    state.openedPageList.splice(i, 1)
                }
            }
            
            if(state.cachePage){
                let index = state.cachedPageName.indexOf(data.name)
                if(index >= 0){
                    state.cachedPageName.splice(index, 1)
                }
            }
        } else{
            state.openedPageList = []
            state.cachedPageName = []
        }
    }
}


export default {
    namespaced: true,
    state,
    mutations
}