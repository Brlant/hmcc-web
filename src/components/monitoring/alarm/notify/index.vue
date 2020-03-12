<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="5">探头</el-col>
        <el-col :span="2">通知类型</el-col>
        <el-col :span="2">通知方式</el-col>
        <el-col :span="4">通知对象</el-col>
        <el-col :span="4">通知时间</el-col>
        <el-col :span="2">发送状态</el-col>
        <el-col :span="5">失败原因</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length == 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="[{'active':currentItemId===item.id}]" class="order-list-item order-list-item-bg no-pointer"
             v-for="item in dataList">
          <el-row>
            <el-col :span="5">{{item.sensorName}}</el-col>
            <el-col :span="2">{{item.type === '0' ? '告警' : '恢复'}}</el-col>
            <el-col :span="2">{{item.way === '0' ? '短信' : '微信'}}</el-col>
            <el-col :span="4" class="R">{{item.noticeUserTarget}}</el-col>
            <el-col :span="4">{{item.time | time}}</el-col>
            <el-col :span="2">
              {{item.status === '1' ? '成功' : item.status === '0' ? '失败' : item.status === '2' ? '发送中': item.status}}
            </el-col>
            <el-col :span="5">
              <span v-show="item.status === '2'">{{item.sendResult}}</span>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <page-right :css="{'width':'900px','padding':0}" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex" :is="currentPart" @right-close="resetRightBox"/>
    </page-right>
  </div>
</template>
<script>
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import {NotifyRecord} from '@/resources';
  import showForm from './form/show-form.vue';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        filters: {
          status: ''
        },
        checkList: [
          {label: '短信', key: '1', placeholder: '请输入手机号', validator: this.checkPhone},
          {label: '邮箱', key: '2', placeholder: '请输入邮箱', validator: this.checkEmail},
          {label: '微信', key: '3'}
        ],
        dialogComponents: {
          0: showForm
        }
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
      this.queryList(1);
    },
    methods: {
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      checkStatus(item, key) {
        this.filters.status = item.status;
        this.activeStatus = key;
      },
      queryList(pageNo) {
        const http = NotifyRecord.query;
        this.queryUtil(http, pageNo);
      },
      resetRightBox() {
        this.showIndex = -1;
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      showItemDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.showPart(0);
        this.$nextTick(() => {
          this.form = item;
        });
      }
    }
  };
</script>
