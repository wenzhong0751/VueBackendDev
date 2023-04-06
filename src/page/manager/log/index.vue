<template>
    <div class="sys-page">
        <app-title title="日志查看"></app-title>
        <app-notes>查看系统日志</app-notes>

        <!-- 工具条 -->
        <app-toolbar>
            <el-radio v-model="logType" label="1">登录日志</el-radio>
            <el-radio v-model="logType" label="2">操作日志</el-radio>
        </app-toolbar>
        <!-- 表格体 -->
        <table-mixin
            pagination
            paginationAlign="center"
            :pageSize="pageSize"
            :paginationTotal="totalElements"
            :sizeChange="handleSizeChange"
            :pageChange="handlePageChange">

            <el-table
                v-loading="tableData.loading"
                :data="tableData.body"
                border
                stripe
                :default-sort="{ prop: 'ID', order: 'descending' }"
                ref="tableRef"
            >
                <el-table-column
                    type="index"
                    label="序号"
                    width="64"
                    align="center"
                ></el-table-column>
                <el-table-column prop="ID" label="日志ID"  width="96" sortable>
                </el-table-column>
                <el-table-column prop="logName" label="日志名称" sortable>
                </el-table-column>
                <el-table-column prop="userID" label="用户名" sortable width="112">
                </el-table-column>
                <el-table-column prop="createTime" label="时间" sortable :formatter="dateFormat" width="152">
                </el-table-column>
                <el-table-column prop="SUCCEED" label="是否成功" width="96">
                </el-table-column>
                <div v-if="logType === '1'">
                <el-table-column prop="MESSAGE" label="信息">
                </el-table-column>
                <el-table-column prop="IP" label="登录IP">
                </el-table-column>
                </div>
                <div v-else>
                <el-table-column prop="API" label="API">
                </el-table-column>
                <el-table-column prop="METHOD" label="METHOD" width="96">
                </el-table-column>
                </div>
            </el-table>

        </table-mixin>
    </div>
</template>

<script>
import fecha from "element-ui/lib/utils/date";
export default {
    name: "mgrLog",
    data() {
        //
        return {
            logType: "1",
            pageSize: 10,
            pageNumber: 1,
            totalElements: 0,

            tableData: {
                loading: true,
                body: [],
            },

            formLabelWidth: "120px",
  
        }
    },
    mounted() {
        this.getTableData();
    },
    watch: {
        logType: {
            handler(newType,oldType){
                this.getTableData();
            }
        }
    },
    methods: {
        //查询主界面表格数据
        getTableData() {
            let pageNum = this.pageNumber;
            let pageSize = this.pageSize;
            let logName = this.logType === '1'?'accountLog':'operationLog';
            this.$axios({
                url: `/log/${logName}/${pageNum}/${pageSize}`,
                type: "get"
            })
                .then((res) => {
                    console.log("res",res);

                    if (res.meta.code === 6666) {
                        let pageInfo = res.data.data;
                        this.totalElements = pageInfo.totalElements;
                        if (pageInfo.numberOfElements > 0) {
                            let arr = pageInfo.content;
                            let newArr = arr.map((item, index, arr) => {
                                if (this.logType === '1') {
                                    return {
                                        ID: item.id,
                                        logName: item.logName,
                                        userID: item.userId,
                                        createTime: item.createTime,
                                        SUCCEED: item.succeed,
                                        IP: item.ip,
                                        MESSAGE: item.message
                                    };
                                }else{
                                    return {
                                        ID: item.id,
                                        logName: item.logName,
                                        userID: item.userId,
                                        createTime: item.createTime,
                                        SUCCEED: item.succeed,
                                        API: item.api,
                                        METHOD: item.method
                                    }
                                }
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
            this.pageNumber = val;
            this.getTableData();
            console.log(`当前页: ${val}`);
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getTableData();
            console.log(`每页 ${val} 条`);
        },
        dateFormat(row, column, cellValue) {
            return cellValue
                ? fecha.format(new Date(cellValue), "yyyy-MM-dd HH:mm:ss")
                : "";
        },
        
        


    }
};
</script>

<style></style>
