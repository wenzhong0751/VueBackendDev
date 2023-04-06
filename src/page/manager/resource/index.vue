<template>
    <div class="sys-page">
        <app-title title="菜单管理"></app-title>
        <app-notes>管理系统菜单，目前还需要在后台手工添加，这里只供查看</app-notes>
        <!-- 搜索 -->

        <!-- 工具条 -->
        <!-- 菜单树 -->
        <el-table
            :data="tableData"
            style="width: 100%; margin-bottom: 20px;"
            row-key="rid"
            border
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="rid" label="ID" sortable width="180">
            </el-table-column>
            <el-table-column prop="code" label="代码" sortable width="180">
            </el-table-column>
            <el-table-column prop="name" label="名称" sortable width="180">
            </el-table-column>
            <el-table-column prop="icon" label="图标"> </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: "mgrResource",
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
                url: `/resource/menus`,
            })
                .then((res) => {
                    console.log("getMenu res:", res);
                    if (res) {
                        if (res.meta.code === 6666) {
                            let arr = res.data.menuTree;

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
                                            name: menu.name,
                                            code: menu.code,
                                            icon: menu.icon,
                                            children: children,
                                        });
                                    } else {
                                        desArr.push({
                                            rid: menu.rid,
                                            name: menu.name,
                                            code: menu.code,
                                            icon: menu.icon,
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
                    this.$message.error(
                        `获取数据失败，失败码：${err.response.status}`
                    );
                });
        },
    },
};
</script>

<style></style>
