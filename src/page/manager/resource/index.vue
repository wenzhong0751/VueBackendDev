<template>
    <div class="sys-page">
        <app-title title="菜单管理"></app-title>
        <app-notes>管理系统菜单</app-notes>
        <!-- 搜索 -->

        <!-- 工具条 -->
        <app-toolbar>
            <el-button type="primary" @click="add()">新增</el-button>
        </app-toolbar>
        <!-- 菜单树 -->
        <el-table
            :data="tableData2"
            style="width: 100%; margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
            <el-table-column prop="date" label="日期" sortable width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" sortable width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址"> </el-table-column>
        </el-table>
        <el-dialog title="编辑角色" :visible.sync="treeVisible">
            <el-table
                :data="tableData"
                style="width: 100%; margin-bottom: 20px;"
                row-key="id"
                border
                :tree-props="{
                    children: 'children',
                    hasChildren: 'hasChildren',
                }"
            >
                <el-table-column prop="id" label="资源ID" width="100" sortable>
                </el-table-column>
                <el-table-column prop="code" label="代码" width="100" sortable>
                </el-table-column>
                <el-table-column prop="name" label="名称" width="180" sortable>
                </el-table-column>
                <el-table-column prop="icon" label="图标" width="200">
                </el-table-column>

                <!--
                <el-table-column prop="uri" label="URI">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="mini">add</el-button>
                    <el-button type="text" size="mini">delete</el-button>
                </template>
            </el-table-column>
            -->
            </el-table>
        </el-dialog>

        <!-- 编辑窗口 -->
        <el-dialog title="编辑角色" :visible.sync="editFormVisible">
            <el-form :model="editForm" ref="editFormRef">
                <el-form-item label="角色名称" :label-width="formLabelWidth">
                    <el-input
                        v-model="editForm.role"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="描述" :label-width="formLabelWidth">
                    <el-input
                        v-model="editForm.description"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="editFormSubmit()"
                    >确定</el-button
                >
            </div>
        </el-dialog>

        <!-- 新增窗口 -->
        <el-dialog title="新增角色" :visible.sync="addFormVisible">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
                <el-form-item
                    label="编码"
                    prop="rid"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="addForm.rid"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="名称"
                    prop="role"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="addForm.role"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="描述"
                    prop="description"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="addForm.description"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addFormSubmit()"
                    >确定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "mgrResource",
    data() {
        //
        return {
            treeVisible: false,
            tableData: [
                {
                    id: 1,
                    code: "code1",
                    name: "name1",
                    icon: "icon1",
                    children: [
                        {
                            id: 11,
                            code: "code11",
                            name: "name11",
                            icon: "icon1",
                        },
                        {
                            id: 12,
                            code: "code12",
                            name: "name12",
                            icon: "icon1",
                        },
                    ],
                },
                { id: 2, code: "code2", name: "name2", icon: "icon1" },
            ],
            tableData2: [
                {
                    id: 1,
                    date: "2016-05-02",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1518 弄",
                },
                {
                    id: 2,
                    date: "2016-05-04",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1517 弄",
                },
                {
                    id: 3,
                    date: "2016-05-01",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1519 弄",
                    children: [
                        {
                            id: 31,
                            date: "2016-05-01",
                            name: "王小虎",
                            address: "上海市普陀区金沙江路 1519 弄",
                        },
                        {
                            id: 32,
                            date: "2016-05-01",
                            name: "王小虎",
                            address: "上海市普陀区金沙江路 1519 弄",
                        },
                    ],
                },
                {
                    id: 4,
                    date: "2016-05-03",
                    name: "王小虎",
                    address: "上海市普陀区金沙江路 1516 弄",
                },
            ],

            formLabelWidth: "120px",
            //编辑相关数据
            editFormVisible: false,
            editObjIndex: 0,
            editForm: {
                rid: "",
                role: "",
                description: "",
            },

            //新增相关数据
            addFormVisible: false,
            addForm: {
                rid: "",
                role: "",
                description: "",
                status: 1,
            },
            addFormRules: {
                rid: [
                    {
                        required: true,
                        message: "请输入角色代码",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 15,
                        message: "长度在3到15个字符",
                        trigger: "blur",
                    },
                ],
                role: [
                    {
                        required: true, //是否必填
                        message: "请输入角色名称", //错误提示信息
                        trigger: "blur", //检验方式（blur为鼠标点击其他地方，）
                    },
                    {
                        min: 3,
                        max: 15,
                        message: "长度在3到15个字符",
                        trigger: "blur",
                    },
                ],
            },
        };
    },
    mounted() {
        // this.getTableData();
    },
    methods: {
        //查询主界面表格数据
        getTableData() {
            this.$axios({
                url: `http://127.0.0.1:8080/resource/menus`,
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
        // 点击编辑按钮
        edit(index, row) {
            this.editObjIndex = index;
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        editFormSubmit() {
            this.$axios({
                url: `http://127.0.0.1:8080/role`,
                method: "put",
                data: this.editForm,
            })
                .then((res) => {
                    console.log(res);
                    if (res.meta.code === 6666) {
                        console.log(
                            "row",
                            this.$refs.tableRef.tableData[this.editObjIndex]
                        );
                        console.log("editForm", this.editForm);
                        let newObj = Object.assign(
                            this.$refs.tableRef.tableData[this.editObjIndex],
                            this.editForm
                        );
                        console.log("newObj", newObj);
                        this.$refs.tableRef.tableData.splice(
                            this.editObjIndex,
                            1,
                            newObj
                        );
                        this.$message.info("更新角色成功");
                    } else {
                        this.$message.info("更新角色信息失败：" + res.meta.msg);
                    }
                    this.editFormVisible = false;
                })
                .catch((err) => {
                    this.$message.error(`更新角色信息失败：${err.meta.msg}`);
                    this.editFormVisible = false;
                });
        },
        // 增加相关
        add() {
            this.treeVisible = true;
        },
        addFormSubmit() {
            console.log(this.addForm);
            this.$axios({
                url: `http://127.0.0.1:8080/role`,
                method: "post",
                data: this.addForm,
            })
                .then((res) => {
                    if (res) {
                        if (res.meta.code === 6666) {
                            this.$message.info("增加角色信息成功！");
                            this.getTableData();
                        } else {
                            this.$message.error(
                                "增加角色信息失败，错误信息：" + res.meta.msg
                            );
                        }
                    } else {
                        this.$message.error(
                            "增加角色信息失败，返回信息：" + res
                        );
                    }
                })
                .catch((err) => {
                    this.$message.error(`新增用户信息失败：${err.meta.msg}`);
                });

            this.addFormVisible = false;
        },
        // 转换状态
        changeSwitch(index, row) {
            let { rid, status } = row;
            let newInfo = { rid, status };
            this.$axios({
                url: `http://127.0.0.1:8080/role`,
                method: "put",
                data: {
                    rid: `${rid}`,
                    status: `${status}`,
                },
            })
                .then((res) => {
                    if (res.meta.code === 6666) {
                        this.$message.info("更新角色状态信息成功");
                    } else {
                        console.log(
                            "tabledata",
                            this.$refs.tableRef.tableData[index]
                        );
                        console.log("newInfo", newInfo);
                        newInfo.disabled = !newInfo.disabled;
                        const newObj = Object.assign(
                            {},
                            this.$refs.tableRef.tableData[index],
                            newInfo
                        );
                        console.log("newObj", newObj);
                        this.$refs.tableRef.tableData.splice(
                            this.editObjIndex,
                            1,
                            newObj
                        );
                        this.$message.info(
                            "更新用户状态信息失败：" + res.meta.msg
                        );
                    }
                })
                .catch((err) => {
                    console.log(
                        "tabledata",
                        this.$refs.tableRef.tableData[index]
                    );
                    console.log("newInfo", newInfo);
                    newInfo.disabled = !newInfo.disabled;
                    const newObj = Object.assign(
                        {},
                        this.$refs.tableRef.tableData[index],
                        newInfo
                    );
                    console.log("newObj", newObj);
                    this.$refs.tableRef.tableData.splice(
                        this.editObjIndex,
                        1,
                        newObj
                    );
                    this.$message.error(
                        `更新用户状态信息失败：${err.meta.msg}`
                    );
                });
        },
        // 分配相关
        assign(index, row) {
            //
            let username = row.username;
            this.roleAssignForm.uid = row.uid;
            //获取用户授权的角色列表
            this.$axios({
                url: `http://127.0.0.1:8080/user/role/${username}`,
            })
                .then((res) => {
                    console.log("getRole:", res);
                    if (res) {
                        if (res.meta.code === 6666) {
                            this.roleAssigns = res.data.roles;
                            this.getRoleListData();
                        } else {
                            this.$message.info(
                                "获取用户已经授权的角色列表出错，错误信息：" +
                                    res.meta.msg
                            );
                        }
                    } else {
                        this.$message.info(
                            "获取用户已经授权的角色列表，请求出错"
                        );
                    }
                })
                .catch((err) => {
                    this.$message.error(
                        `获取数据失败，失败码：${err.response.status}`
                    );
                });
        },
        assignFormSubmit() {
            //此处处理选中的角色，更新用户相关信息
            let newRoleList = this.roleAssignMultipleSelection
                .map((item, index, arr) => {
                    return item.rid;
                })
                .join(",");
            this.$axios({
                url: `http://127.0.0.1:8080/user/authority/rolelist`,
                method: "put",
                data: {
                    uid: this.roleAssignForm.uid.toString(),
                    rids: newRoleList,
                },
            })
                .then((res) => {
                    console.log(res);
                    if (res) {
                        if (res.meta.code === 6666) {
                            this.$message.info("更新用户授权角色列表成功！");
                        } else {
                            this.$message.info(
                                "更新用户授权角色列表失败：" + res.meta.msg
                            );
                        }
                    }
                })
                .catch((err) => {
                    this.$message.error(
                        `更新用户授权角色列表失败：${err.meta.msg}`
                    );
                });
            this.roleAssignVisible = false;
        },
    },
};
</script>

<style></style>
