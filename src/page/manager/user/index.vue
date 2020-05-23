<template>
    <div class="sys-page">
        <app-title title="用户管理"></app-title>
        <app-notes>管理系统用户</app-notes>
        <!-- 搜索 -->
        <app-search>
            <el-form :inline="true" :model="searchForm">
                <el-form-item>
                    <el-input
                        v-model="searchForm.username"
                        placeholder="请输入用户或"
                    ></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="getTableData">查询</el-button>
                </el-form-item>
            </el-form>
        </app-search>
        <!-- 工具条 -->
        <app-toolbar>
            <el-button type="primary" @click="userAdd()">新增</el-button>
        </app-toolbar>
        <!-- 表格体 -->
        <table-mixin
            pagination
            paginationAlign="center"
            :pageSize="searchForm.pageSize"
            :paginationTotal="searchForm.totalElements"
            :sizeChange="handleSizeChange"
            :pageChange="handlePageChange"
        >
            <el-table
                v-loading="tableData.loading"
                :data="tableData.body"
                border
                stripe
                :default-sort="{ prop: 'username', order: 'descending' }"
                ref="tableRef"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    width="64"
                    align="center"
                ></el-table-column>
                <el-table-column prop="username" label="姓名" sortable>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" sortable>
                </el-table-column>
                <el-table-column prop="tel" label="电话" sortable>
                </el-table-column>
                <el-table-column prop="addr" label="地址" sortable>
                </el-table-column>
                <el-table-column
                    prop="regtime"
                    label="注册时间"
                    sortable
                    :formatter="dateFormat"
                >
                </el-table-column>
                <el-table-column
                    prop="disabled"
                    label="禁用"
                    sortable
                    :formatter="boolFormat"
                >
                </el-table-column>

                <!-- 需要格式化显示，暂时放弃这种方便的写法 
                <el-table-column
                    v-for="(item, index) in tableData.head"
                    :prop="item.key"
                    :label="item.name"
                    sortable
                    :key="index"
                ></el-table-column>
                -->
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.operation.indexOf('edit') >= 0"
                            type="text"
                            size="mini"
                            @click="userEdit(scope.$index, scope.row)"
                            >修改</el-button
                        >
                        <el-button
                            v-if="scope.row.operation.indexOf('delete') >= 0"
                            type="danger"
                            size="mini"
                            @click="userDelete(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </table-mixin>

        <!-- 编辑窗口 -->
        <el-dialog title="编辑用户" :visible.sync="editFormVisible">
            <el-form :model="editForm" ref="editFormRef">
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input
                        v-model="editForm.username"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" :label-width="formLabelWidth">
                    <el-input
                        v-model="editForm.email"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="电话" :label-width="formLabelWidth">
                    <el-input
                        v-model="editForm.tel"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input
                        v-model="editForm.addr"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button
                    type="primary"
                    @click="editFormSubmit()"
                    :loading="addLoading"
                    >确定</el-button
                >
            </div>
        </el-dialog>

        <!-- 新增窗口 -->
        <el-dialog title="新增用户" ref="addFormRef" size="small" :visible.sync="addFormVisible">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
                <el-form-item label="姓名" prop="username" :label-width="formLabelWidth">
                    <el-input
                        v-model="addForm.username"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="addForm.password"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword" :label-width="formLabelWidth">
                    <el-input
                        type="password"
                        v-model="addForm.checkPassword"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
                    <el-input
                        type="email"
                        v-model="addForm.email"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="呢称" :label-width="formLabelWidth">
                    <el-input
                        v-model="addForm.nickname"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel" :label-width="formLabelWidth">
                    <el-input
                        v-model="addForm.tel"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input
                        v-model="addForm.addr"
                        auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addFormSubmit()"
                    >确定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import fecha from "element-ui/lib/utils/date";
export default {
    name: "mgrUser",
    data() {
        var validatePassword = (rule,value,callback) => {
                if (value === ''){
                    callback(new Error('请输入密码'));
                }else{
                    if (this.addForm.checkPassword !== ''){
                        this.$refs.addFormRef.validateField('checkPassword');
                    }
                    callback();
                }
            };
        var validateCheckPassword = (rule,value,callback) => {
                if (value === ''){
                    callback(new Error('请再次输入密码'));
                }else if (value !== this.addForm.password){
                    callback(new Error('两次输入密码不一样'));
                }else{
                    callback();
                }
            };
        return {
            searchForm: {
                username: "",
                pageSize: 6,
                pageNumber: 0,
                totalElements: 0,
            },
            tableData: {
                loading: true,
                head: [
                    {
                        key: "uid",
                        name: "代码",
                    },
                    {
                        key: "username",
                        name: "姓名",
                    },
                    {
                        key: "email",
                        name: "邮箱",
                    },
                    {
                        key: "tel",
                        name: "电话",
                    },
                    {
                        key: "addr",
                        name: "地址",
                    },
                    {
                        key: "regtime",
                        name: "注册时间",
                    },
                    {
                        key: "disabled",
                        name: "禁用",
                    },
                ],
                body: [],
            },

            //编辑相关数据
            editFormVisible: false,
            addLoading: false,
            formLabelWidth: "120px",
            editObjIndex: 0,
            editForm: {
                uid: 0,
                username: "",
                email: "",
                tel: "",
                addr: "",
            },

            //新增相关数据
            addFormVisible:false,
            addForm:{
                username:"",
                password:"",
                checkPassword:"",
                email:"",
                nickname:"",
                email:"",
                tel:"",
                addr:""
            },
            
            addFormRules:{
                username:[{required:true,message:'请输入用户名',trigger:'blur'},
                {min:3,max:15,message:'长度在3到15个字符',trigger:'blur'}],
                password:[{validator:validatePassword,trigger:'blur'}],
                checkPassword:[{validator:validateCheckPassword,trigger:'blur'}],
                email: [{
                            required: true,//是否必填
                            message: '请输入邮箱地址',//错误提示信息
                            trigger: 'blur'//检验方式（blur为鼠标点击其他地方，）
                        },
                        {
                            type: 'email',//要检验的类型（number，email，date等）
                            message: '请输入正确的邮箱地址',
                            trigger: ['blur', 'change']
                        }
                    ],
                tel: [{
                            required: true,
                            pattern: /^1[34578]\d{9}$/,//可以写正则表达式呦呦呦
                            message: '目前只支持中国大陆的手机号码',
                            trigger: 'blur'
                        }],
            },
        };
    },
    mounted() {
        this.getTableData();
    },
    methods: {
        //
        // 获取table数据
        getTableData() {
            let { pageSize, pageNumber, username } = this.searchForm;
            console.log(username);
            this.$axios({
                url: `http://127.0.0.1:8080/user/list/${pageNumber}/${pageSize}`,
                type: "get",
                params: {username:`${username}`},
            })
                .then((res) => {
                    console.log(res);

                    if (res.meta.code === 6666) {
                        let pageInfo = res.data.pageInfo;
                        this.searchForm.totalElements = pageInfo.totalElements;
                        if (pageInfo.numberOfElements > 0) {
                            let arr = pageInfo.content;
                            let newArr = arr.map((item, index, arr) => {
                                return {
                                    uid: item.uid,
                                    username: item.username,
                                    email: item.email,
                                    tel: item.tel,
                                    addr: item.addr,
                                    regtime: item.regtime,
                                    disabled: item.disabled,
                                    operation: "edit,delete",
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
        dateFormat(row, column, cellValue) {
            return cellValue
                ? fecha.format(new Date(cellValue), "yyyy-MM-dd HH:mm:ss")
                : "";
        },
        boolFormat(row, column, cellValue) {
            return cellValue ? "禁用" : "启用";
        },

        search() {
            //
        },
        // 点击编辑按钮
        userEdit(index, row) {
            this.editObjIndex = index;
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        editFormSubmit() {
            this.$axios({
                url: `http://127.0.0.1:8080/user`,
                method: "put",
                data: this.editForm,
            })
                .then((res) => {
                    console.log(res);
                    if (res.meta.code === 6666) {
                        let newObj = Object.assign(
                            {},
                            this.$refs.tableRef.tableData[this.editObjIndex],
                            this.editForm
                        );
                        this.$refs.tableRef.tableData.splice(
                            this.editObjIndex,
                            1,
                            newObj
                        );
                        this.$message.info("更新用户成功");
                    } else {
                        this.$message.info("更新用户信息失败：" + res.meta.msg);
                    }
                    this.editFormVisible = false;
                })
                .catch((err) => {
                    this.$message.error(`更新用户信息失败：${err.meta.msg}`);
                    this.editFormVisible = false;
                });
        },

        userAdd(){
            this.addFormVisible = true;
        },
        addFormSubmit(){
            console.log(this.addForm);
            this.$axios({
                url: `http://127.0.0.1:8080/user`,
                method: 'post',
                data: this.addForm
            }).then((res) => {
                console.log(res);
                this.getTableData();
            }).catch((err) => {
                this.$message.error(`新增用户信息失败：${err.meta.msg}`);
            });

            this.addFormVisible = false;
        },


        userDelete(row) {
            console.log(row);
            this.$confirm(
                "此操作将永久删除用户 " + row.username + ", 是否继续?",
                "提示",
                { type: "warning" }
            )
                .then(() => {
                    // 向服务端请求删除
                    this.$axios({
                        url: `http://127.0.0.1:8080/user`,
                        method: "delete",
                        data: row,
                    })
                        .then((response) => {
                            this.$message.success(
                                "成功删除了用户" + row.username + "!"
                            );
                            this.getTableData();
                        })
                        .catch((response) => {
                            this.$message.error("删除失败!");
                        });
                })
                .catch(() => {
                    this.$message.info("已取消操作!");
                });
        },
    },
};
</script>
