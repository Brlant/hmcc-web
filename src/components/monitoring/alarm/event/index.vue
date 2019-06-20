<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="batchConfirmItem" plain size="small" v-has="'ccs-warn-record-process'"
                   v-if="checkList.length>0">
          <f-a class="icon-small" name="affirm"></f-a>
          批量处理
        </el-button>
      </template>
    </search-part>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="1">
          <el-checkbox @change="checkAll" v-model="isCheckAll"></el-checkbox>
        </el-col>
        <el-col :span="3">
          发生时间
        </el-col>
        <el-col :span="3">恢复时间</el-col>
        <el-col :span="2">持续时间</el-col>
        <el-col :span="2">异常类型</el-col>
        <el-col :span="4">监控对象</el-col>
        <el-col :span="4">设备名称</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length === 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="[{'active':currentItemId===item.id}]" @click.stop.prevent="checkItem(item)"
             class="order-list-item no-pointer order-list-item-bg" v-for="item in dataList">
          <el-row>
            <el-col :span="1">
              <div @click.stop.prevent="checkItem(item)" class="el-checkbox-warp" v-if="item.confirmStatus === '0'">
                <el-checkbox v-model="item.isChecked"></el-checkbox>
              </div>
            </el-col>
            <el-col :span="3">{{item.createTime | time}}</el-col>
            <el-col :span="3">{{item.restoreTime | time}}</el-col>
            <el-col :span="2">{{formatMsToTime((item.restoreTime ? item.restoreTime : Date.now()) - item.createTime)}}
            </el-col>
            <el-col :span="2">
              <el-tooltip :content="iconClass[icon].title + (item.warnLevel === '0' ? '告警，级别:低' : '告警，级别:高')"
                          :key="icon"
                          class="item" effect="dark"
                          placement="top"
                          v-for="icon in item.warnTypes && item.warnTypes.split(',') || []">
                <f-a :class="item.warnLevel === '0' ? 'icon-warning' :'icon-danger'" :name="iconClass[icon].icon"></f-a>
              </el-tooltip>
              <!--<el-tooltip effect="dark" content="告警级别" placement="top">-->
              <!--<span>{{levels[item.warnLevel].label}}</span>-->
              <!--</el-tooltip>-->
              <!--<span :key="icon" v-for="icon in item.warnTypes && item.warnTypes.split(',') || []"-->
              <!--:title="iconClass[icon].title">-->
              <!--<f-a class="icon-danger" :name="iconClass[icon].icon"></f-a>-->
              <!--</span>-->
            </el-col>
            <el-col :span="4">
              <span @click.stop="goToRouter(item)" class="active-text">{{formatTitle(item)}}</span>
            </el-col>
            <el-col :span="4">
              <el-tooltip :content="tempTypeList[item.devType]" effect="dark" placement="top">
                <f-a :name="DevIcon[item.devType][1]" class="icon-danger ver-a-mid"></f-a>
              </el-tooltip>
              <span @click.stop="goToDev(item)" class="active-text">{{item.devName}}</span>
            </el-col>
            <el-col :span="2">{{confirmStatus[item.confirmStatus]}}</el-col>
            <el-col :span="3">
              <des-btn @click="confirmItem(item)" icon="affirm" v-has="'ccs-warn-record-process'"
                       v-show="item.confirmStatus === '0' ">处理
              </des-btn>
              <des-btn @click="showItemDetail(item)" icon="detail" v-has="'show'">详情</des-btn>
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
      <component :formItem="form" :index="showIndex" :is="currentPart" @change="change"
                 @right-close="resetRightBox"/>
    </page-right>

    <page-right :css="{'width':'900px','padding':0}" :show="showBatchIndex !== -1" @right-close="resetRightBox">
      <component :idList="warnRecordIdList" :is="currentBatchPart" @change="change"
                 @right-close="resetRightBox"/>
    </page-right>
  </div>
</template>
<script>
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import showForm from './form/show-form.vue';
  import batchConfirmForm from './form/batch-confirm-form.vue';
  import confirmForm from './form/confirm-form';
  import {WarnRecord} from '@/resources';
  import utils from '@/tools/utils';
  import AlarmEventMixin from '@/mixins/alarmEventMixin';
  import AlarmMixin from '@/mixins/alarmMixin';

  const {DevIcon} = utils;

  export default {
    components: {
      SearchPart,
      batchConfirmForm
    },
    mixins: [CommonMixin, AlarmEventMixin, AlarmMixin],
    data() {
      return {
        filters: {
          status: '0'
        },
        dialogComponents: {
          0: showForm,
          1: confirmForm
        },
        dialogBatchComponents: {
          0: batchConfirmForm
        },
        confirmStatus: {
          0: '未确认',
          1: '已确认',
          2: '取消'
        },
        DevIcon,
        isCheckAll: false,
        warnRecordIdList: [],
        currentBatchPart: null,
        showBatchIndex: -1, currentPart: null,
        checkList: []
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
      this.formDashboard();
    },
    methods: {
      checkItem: function (item) {
        console.log('111', item);
        // 单选
        item.isChecked = !item.isChecked;
        let index = this.checkList.indexOf(item);
        let idIndex = this.warnRecordIdList.indexOf(item.id);
        if (item.isChecked) {
          if (index === -1) {
            this.checkList.push(item);
          }
          if (idIndex === -1) {
            this.warnRecordIdList.push(item.id);
          }
        } else {
          this.checkList.splice(index, 1);
          this.warnRecordIdList.splice(idIndex, 1);
        }
      },
      checkAll() {
        // 全选
        if (this.isCheckAll) {
          this.dataList.forEach(item => {
            item.isChecked = true;
            let index = this.checkList.indexOf(item);
            if (index === -1 && item.confirmStatus === '0') {
              this.checkList.push(item);
            }
            let idIndex = this.warnRecordIdList.indexOf(item.id);
            if (idIndex === -1 && item.confirmStatus === '0') {
              this.warnRecordIdList.push(item.id);
            }
          });
        } else {
          this.dataList.forEach(item => {
            item.isChecked = false;
          });
          this.checkList = [];
          this.warnRecordIdList = [];
        }
      },
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      checkStatus(item, key) {
        this.filters.status = item.status;
        this.activeStatus = key;
      },
      queryList(pageNo) {
        // 清空数据
        this.checkList = [];
        this.warnRecordIdList = [];
        this.isCheckAll = false;
        const http = WarnRecord.query;
        const params = this.queryUtil(http, pageNo);
        this.dataList.forEach(val => {
          if (val.confirmStatus === '0') {
            val.isChecked = false;
          }
        });
        // this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {status: null});
        const http = WarnRecord.queryStatusNum;
        const res = {};
        this.queryStatusNumUtil(http, pm, this.statusType, res);
      },
      resetRightBox() {
        this.$router.push('/alarm/record');
        this.showIndex = -1;
        this.showBatchIndex = -1;
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
      },
      formatMsToTime: utils.formatMsToTime,
      confirmItem(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.showPart(1);
        this.$nextTick(() => {
          this.form = item;
        });
      },
      batchConfirmItem: function () {
        this.showBatchIndex = 0;
        this.currentBatchPart = this.dialogBatchComponents[0];
      },
      formDashboard() {
        let id = this.$route.query.id;
        if (!id) return;
        this.confirmItem({id});
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
