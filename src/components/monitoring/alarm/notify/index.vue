<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="6">通知时间</el-col>
        <el-col :span="6">设备名称</el-col>
        <el-col :span="4">通知类型</el-col>
        <el-col :span="4">消息类型</el-col>
        <el-col :span="4">发送状态</el-col>
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
        <div :class="[{'active':currentItemId===item.id}]" @click="showItemDetail(item)"
             class="order-list-item order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="6">{{item.createTime | time}}</el-col>
            <el-col :span="6">{{item.devName}}</el-col>
            <el-col :span="4">{{checkList[Number(item.notifyType) - 1].label}}</el-col>
            <el-col :span="4">{{item.recordType === '0' ? '告警' : '恢复'}}</el-col>
            <el-col :span="4">{{item.sendStatus === '1' ? '成功' : '失败'}}</el-col>
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
          status: '0'
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
        const params = this.queryUtil(http, pageNo);
        // this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {status: null});
        const http = NotifyRecord.queryStatusNum;
        const res = {};
        this.queryStatusNumUtil(http, pm, this.statusType, res);
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
