<template>
    <div class="sys-page">
        <app-title title="API管理"></app-title>
        <app-notes>管理系统API，目前还需要在后台手工添加，这里只供查看</app-notes>
        <!-- 搜索 -->

        <!-- 工具条 -->
        <!-- 菜单树 -->
        <el-table
            :data="tableData"
            style="width: 100%; margin-bottom: 20px;"
            row-key="rid"
            border
            lazy
            :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="rid" label="ID" sortable width="180">
            </el-table-column>
            <el-table-column prop="code" label="代码" sortable width="180">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable width="180">
            </el-table-column>
            <el-table-column prop="uri" label="URI"> </el-table-column>
            <el-table-column prop="method" label="操作" sortable width="180">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "mgrAPI",
    data() {
        //
        return {
            treeVisible: false,
            tableData: [],

            formLabelWidth: "120px",
        };
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        //查询主界面表格数据
        getTableData() {
            this.$axios({
                url: `http://127.0.0.1:8080/resource/api/-1/1/1000`,
            })
                .then((res) => {
                    console.log("get apiTerm:", res);
                    if (res) {
                        if (res.meta.code === 6666) {
                            let arr = res.data.data;

                            function transMenus2local(srcArr, desArr) {
                                srcArr.forEach((menu) => {
                                    if (
                                        menu.children &&
                                        menu.children.length > 0
                                    ) {
                                        let children = [];
                                        transMenus2local(
                                            menu.children,
                                            children
                                        );
                                        desArr.push({
                                            rid: menu.rid,
                                            code: menu.code,
                                            name: menu.name,
                                            uri: menu.uri,
                                            method: menu.method,
                                            hasChildren:true,
                                            children: children,
                                        });
                                    } else {
                                        desArr.push({
                                            rid: menu.rid,
                                            code: menu.code,
                                            name: menu.name,
                                            uri: menu.uri,
                                            method: menu.method,
                                            hasChildren:true,
                                        });
                                    }
                                });
                            }

                            let newArr = [];
                            transMenus2local(arr, newArr);

                            this.tableData = newArr;
                        }
                    }
                })
                .catch((err) => {
                    console.log("err:",err);
                    this.$message.error(
                        `获取数据失败，失败码：${err.response.status}`
                    );
                });
        },
        load(tree,treeNode,resolve){
            console.log("tree",tree);
            console.log("treeNode",treeNode);
            let rid = tree.rid;
            this.$axios({
                url: `http://127.0.0.1:8080/resource/api/${rid}/1/1000`,
            }).then(res => {
                console.log("res",res);
                if (res){
                    if (res.meta.code === 6666){
                        let arr = res.data.pageInfo.content;

                        function transMenus2local(srcArr, desArr) {
                                srcArr.forEach((menu) => {
                                    if (
                                        menu.children &&
                                        menu.children.length > 0
                                    ) {
                                        let children = [];
                                        transMenus2local(
                                            menu.children,
                                            children
                                        );
                                        desArr.push({
                                            rid: menu.rid,
                                            code: menu.code,
                                            name: menu.name,
                                            uri: menu.uri,
                                            method: menu.method,
                                            children: children,
                                        });
                                    } else {
                                        desArr.push({
                                            rid: menu.rid,
                                            code: menu.code,
                                            name: menu.name,
                                            uri: menu.uri,
                                            method: menu.method,
                                        });
                                    }
                                });
                            }

                            let newArr = [];
                            transMenus2local(arr, newArr);

                            resolve(newArr);
                    }
                }
            }).catch(err => {
                console.error("err",err);
            });
        }
    },
};
</script>

<style></style>
