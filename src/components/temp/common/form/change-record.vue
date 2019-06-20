<template>
  <div>
    <div class="order-list clearfix">
      <el-row class="order-list-header">
        <el-col :span="4">旧状态</el-col>
        <el-col :span="4">新状态</el-col>
        <el-col :span="10">修改人</el-col>
        <el-col :span="6">修改时间</el-col>
      </el-row>
      <div class="order-list-body flex-list-dom">
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="records.length == 0">
          <el-col :span="24" class="empty-text">
            暂无状态变更记录
          </el-col>
        </el-row>
        <div :key="index" class="order-list-item no-pointer order-list-item-bg" v-for="(item, index) in records">
          <el-row>
            <el-col :span="4">{{parent.formatStatus(item.oldStatus, statusType)}}</el-col>
            <el-col :span="4">{{parent.formatStatus(item.newStatus, statusType)}}</el-col>
            <el-col :span="10">{{item.createName}}</el-col>
            <el-col :span="6">{{item.createTime | time}}</el-col>
          </el-row>
        </div>
      </div>
      <div class="text-center" v-show="(records.length || pager.currentPage !== 1) && !loadingData">
        <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                       :page-sizes="[10,20,50,100]"
                       :total="pager.count" @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      formItem: Object,
      index: Number,
      statusType: Object
    },
    data() {
      return {
        loadingData: false,
        records: [],
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        parent: this.$parent.$parent.$parent.parent
      };
    },
    watch: {
      index(val) {
        this.records = [];
        if (val !== 1) return;
        this.queryRecords(1);
      }
    },
    methods: {
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.queryRecords(1);
      },
      handleCurrentChange(val) {
        this.queryRecords(val);
      },
      queryRecords(pageNo) {
        let params = {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        };
        this.pager.currentPage = pageNo;
        this.loadingData = true;
        this.$http(`dev-detail/${this.formItem.id}/page`, {params}).then(res => {
          this.records = res.data.list;
          this.loadingData = false;
          this.pager.count = res.data.count;
        });
      }
    }

  };
</script>
