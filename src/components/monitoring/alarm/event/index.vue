<template>
  <div class="order-page">
    <search-part @search="searchResult" :alarmTypeList="alarmTypeList">
      <template slot="btn">
        <!--<el-button @click="batchConfirmItem" plain size="small" v-has="'ccs-warn-record-process'"-->
                   <!--v-if="checkList.length>0">-->
          <!--<f-a class="icon-small" name="affirm"></f-a>-->
          <!--批量处理-->
        <!--</el-button>-->
      </template>
    </search-part>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">
          发生时间
        </el-col>
        <el-col :span="3">恢复时间</el-col>
        <el-col :span="3">处理时间</el-col>
        <el-col :span="2">告警类型</el-col>
        <el-col :span="4">探头</el-col>
        <el-col :span="2">告警等级</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="2">处理情况</el-col>
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
            <el-col :span="3">{{item.occurrenceTime | time}}</el-col>
            <el-col :span="3">{{item.recoveryTime | time}}</el-col>
            <el-col :span="3">{{item.handlingTime | time}}
            </el-col>
            <el-col :span="2">{{alarmTypeList[item.type]}}</el-col>
            <el-col :span="4">{{item.sensorName}}</el-col>
            <el-col :span="2">{{alarmLevelList[item.level]}}</el-col>
            <el-col :span="2">{{item.recoveryStatus === '0' ? '告警' : '恢复'}}</el-col>
            <el-col :span="2">{{item.handlingCondition}}</el-col>
            <el-col :span="3">
              <des-btn @click="confirmItem(item)" icon="affirm" v-has="'ccs-warn-record-process'" v-show="!item.handlingCondition">处理
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
                 :alarmTypeList="alarmTypeList" :alarmLevelList="alarmLevelList"
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
  import confirmForm from './form/confirm-form';
  import {alarmEvent} from '@/resources';
  import utils from '@/tools/utils';
  import AlarmEventMixin from '@/mixins/alarmEventMixin';
  import AlarmMixin from '@/mixins/alarmMixin';

  const {DevIcon} = utils;

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin, AlarmEventMixin, AlarmMixin],
    data() {
      return {
        filters: {},
        dialogComponents: {
          0: showForm,
          1: confirmForm
        },
        confirmStatus: {
          0: '未确认',
          1: '已确认',
          2: '取消'
        },
        DevIcon,
        warnRecordIdList: [],
        currentBatchPart: null,
        showBatchIndex: -1, currentPart: null,
        checkList: [],
        alarmTypeList: ['低温', '高温', '低湿度', '高湿度', '低电压', '高电压', '离线'],
        alarmLevelList: ['', '一级', '二级', '三级']
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
        const http = alarmEvent.query;
        const params = this.queryUtil(http, pageNo);
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
