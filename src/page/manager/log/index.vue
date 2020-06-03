<template>
    <div class="sys-page">
        <app-title title="角色管理"></app-title>
        <app-notes>管理系统角色</app-notes>
        <!-- 搜索 -->
        <app-search>
            <el-form :inline="true" :model="searchForm">
                <el-form-item>
                    <el-input
                        v-model="searchForm.rid"
                        placeholder="请输入角色代码"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getTableData"
                        >查询</el-button
                    >
                </el-form-item>
            </el-form>
        </app-search>
        <!-- 工具条 -->
        <app-toolbar>
            <el-button type="primary" @click="add()">新增</el-button>
        </app-toolbar>
        <!-- 表格体 -->
        <table-mixin
            pagination
            paginationAlign="center"
            :pageSize="searchForm.pageSize"
            :paginationTotal="searchForm.totalElements"
            :sizeChange="handleSizeChange"
            :pageChange="handlePageChange">

            <el-table
                v-loading="tableData.loading"
                :data="tableData.body"
                border
                stripe
                :default-sort="{ prop: 'rid', order: 'descending' }"
                ref="tableRef"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    width="64"
                    align="center"
                ></el-table-column>
                <el-table-column prop="rid" label="代码" sortable>
                </el-table-column>
                <el-table-column prop="role" label="角色" sortable>
                </el-table-column>
                <el-table-column prop="description" label="描述" sortable>
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="是否启用"
                    align="center"
                >
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.status"
                            :active-value="1"
                            :inactive-value="0"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="changeSwitch(scope.$index, scope.row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.operation.indexOf('edit') >= 0"
                            type="text"
                            size="mini"
                            @click="edit(scope.$index, scope.row)"
                            >修改</el-button
                        >

                        <el-button
                            v-if="scope.row.operation.indexOf('assign') >= 0"
                            type="primary"
                            size="mini"
                            @click="assign(scope.$index, scope.row)"
                            >分配资源</el-button
                        >
                    </template>
                </el-table-column>

            </el-table>

        </table-mixin>

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
                <el-button
                    type="primary"
                    @click="editFormSubmit()"
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
    name: "mgrLog",
    data() {
        //
        return {
            searchForm: {
                rid: "",
                pageSize: 10,
                pageNumber: 1,
                totalElements: 0,
            },
            tableData: {
                loading: true,
                head: [
                    {
                        key: "rid",
                        name: "代码",
                    },
                    {
                        key: "role",
                        name: "角色",
                    },
                    {
                        key: "description",
                        name: "描述",
                    },
                    {
                        key: "status",
                        name: "是否启用",
                    },
                ],
                body: [],
            },

            formLabelWidth: "120px",
            //编辑相关数据
            editFormVisible: false,
            editObjIndex: 0,
            editForm: {
                rid: "",
                role: "",
                description: ""
            },

            //新增相关数据
            addFormVisible: false,
            addForm: {
                rid: "",
                role: "",
                description: "",
                status: 1
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
                ]
            },
        }
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        //查询主界面表格数据
        getTableData() {
            let { pageSize, pageNumber, rid } = this.searchForm;
            this.$axios({
                url: `http://127.0.0.1:8080/role/list/${pageNumber}/${pageSize}`,
                type: "get",
                params: { rid: `${rid}` },
            })
                .then((res) => {
                    console.log("res",res);

                    if (res.meta.code === 6666) {
                        let pageInfo = res.data.pageInfo;
                        this.searchForm.totalElements = pageInfo.totalElements;
                        if (pageInfo.numberOfElements > 0) {
                            let arr = pageInfo.content;
                            let newArr = arr.map((item, index, arr) => {
                                return {
                                    rid: item.rid,
                                    role: item.role,
                                    description: item.description,
                                    status: item.status,
                                    operation: "edit,assign",
                                };
                            });
                            this.tableData.body = newArr;
                        }
                    }
                    this.tableData.loading = false;
                })
                .catch((err) => {
                    this.$message.error(
                        `获取数据失败，失败码：${err.response.status}`
                    );
                });
        },
        handlePageChange(val) {
            this.searchForm.pageNumber = val;
            this.getTableData();
            console.log(`当前页: ${val}`);
        },
        handleSizeChange(val) {
            this.searchForm.pageSize = val;
            this.getTableData();
            console.log(`每页 ${val} 条`);
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
                        console.log("row",this.$refs.tableRef.tableData[this.editObjIndex]);
                        console.log("editForm",this.editForm);
                        let newObj = Object.assign(
                            this.$refs.tableRef.tableData[this.editObjIndex],
                            this.editForm
                        );
                        console.log("newObj",newObj);
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
            this.addFormVisible = true;
        },
        addFormSubmit() {
            console.log(this.addForm);
            this.$axios({
                url: `http://127.0.0.1:8080/role`,
                method: "post",
                data: this.addForm,
            })
                .then((res) => {
                    if (res){
                        if (res.meta.code === 6666){
                            this.$message.info("增加角色信息成功！");
                            this.getTableData();
                        }else{
                            this.$message.error("增加角色信息失败，错误信息：" + res.meta.msg);
                        }
                    }else{
                        this.$message.error("增加角色信息失败，返回信息：" + res);
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
                    console.log("getRole:",res);
                    if (res) {
                        if (res.meta.code === 6666) {
                            this.roleAssigns = res.data.roles;
                            this.getRoleListData();
                        }else{
                            this.$message.info("获取用户已经授权的角色列表出错，错误信息：" + res.meta.msg);
                        }
                    }else{
                        this.$message.info("获取用户已经授权的角色列表，请求出错");
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
            let newRoleList = this.roleAssignMultipleSelection.map((item, index, arr) => {
                return item.rid;
            }).join(",");
            this.$axios({
                url: `http://127.0.0.1:8080/user/authority/rolelist`,
                method: "put",
                data: {
                    uid: this.roleAssignForm.uid.toString(),
                    rids: newRoleList
                },
            }).then((res) => {
                console.log(res);
                if (res){
                    if (res.meta.code === 6666){
                        this.$message.info("更新用户授权角色列表成功！");
                    }else{
                        this.$message.info("更新用户授权角色列表失败：" + res.meta.msg);
                    }
                }
            }).catch((err) => {
                this.$message.error(`更新用户授权角色列表失败：${err.meta.msg}`);
            });
            this.roleAssignVisible = false;
        },


    }
};
</script>

<style></style>
