<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'ccs-hotmonitor-add'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType"/>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="5">货主</el-col>
        <el-col :span="4">设备编码/名称</el-col>
        <el-col :span="3">最新数据</el-col>
        <el-col :span="3">监控状态</el-col>
        <el-col :span="8">操作</el-col>
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
        <div :class="[formatRowClass(item.activeFlag, statusType) ,{'active':currentItemId===item.id}]"
             class="order-list-item no-pointer"
             v-for="item in dataList">
          <el-row>
            <el-col :span="5">{{item.orgName}}</el-col>
            <el-col :span="4">
              {{item.devCode}}
              <div>
                {{item.devName}}
              </div>
            </el-col>
            <el-col :span="3">
              <el-tooltip :content="showRecordDate(item.recordDate)" effect="dark" placement="top">
                <span>{{$formatDevData(item, $formatDevType(item))}}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="3">{{item.activeFlag | formatMonitoringStatus}}</el-col>
            <el-col :span="8" class="opera-btn">
              <!--<des-btn icon="edit" @click="edit(item)">编辑</des-btn>-->
              <des-btn @click="monitorTemp(item)" icon="start"
                       v-has="'ccs-hotmonitor-switch'" v-show="item.activeFlag==='0'">开启监控
              </des-btn>
              <des-btn @click="cancelMonitorTemp(item)"
                       icon="forbidden" v-has="'ccs-hotmonitor-switch'" v-show="item.activeFlag==='1'">取消监控
              </des-btn>
              <des-btn @click="cancelAttention(item)" icon="delete" v-has="'ccs-hotmonitor-del'">删除</des-btn>
              <des-btn @click="ruleConfig('o,' + item.id)" icon="edit" v-has="'ccs-hotmonitor-rulecfg'">配置规则</des-btn>
              <des-btn @click="goToTemp(item, $formatDevType(item))" icon="detail" v-has="'ccs-hotpints-history-scan'">
                历史数据
              </des-btn>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
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
      <component :formItem="form" :index="showIndex" :is="currentPart" @change="change" @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import {MonitoringObjGroup} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: utils.monitorType,
        filters: {
          monitorRelationType: '3',
          status: '1'
        },
        dialogComponents: {
          0: addForm
        },
        tempList: [
          {label: '有线温度计', key: 1},
          {label: '无线温度计', key: 2},
          {label: '冷柜温度计', key: 3},
          {label: '车头温度计', key: 4},
          {label: '湿度计', key: 5}
        ]
      };
    },
    computed: {},
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
      showRecordDate: function (data) {
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      checkStatus(item, key) {
        this.filters.status = item.status;
        this.activeStatus = key;
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
      queryList(pageNo) {
        const http = MonitoringObjGroup.query;
        this.filters.activeFlag = this.filters.status;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {status: null});
        const http = MonitoringObjGroup.queryStateNum;
        const res = {};
        this.queryStatusNumUtil(http, pm, this.statusType, res);
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.form = item;
        this.showPart(0);
      },
      monitorTemp(item) {
        this.$confirmOpera(`是否监控设备"${item.devCode}"`, () => {
          let obj = {
            activeFlag: '1',
            ids: [item.id]
          };
          this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatusSingle(obj), {
            successTitle: '监控成功',
            errorTitle: '监控失败',
            success: () => {
              this.queryList(this.pager.currentPage);
            }
          });
        });
      },
      cancelMonitorTemp(item) {
        this.$confirmOpera(`是否取消对设备"${item.devCode}"的监控`, () => {
          let obj = {
            activeFlag: '0',
            ids: [item.id]
          };
          this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatusSingle(obj), {
            successTitle: '取消成功',
            errorTitle: '取消失败',
            success: () => {
              this.queryList(this.pager.currentPage);
            }
          });
        });
      },
      cancelAttention(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否删除设备"${item.devCode}"`, () => {
          let ids = [item.id];
          this.$httpRequestOpera(
            this.$http.delete('/ccsMonitorRelation', {
              data: {ids}
            }), {
              successTitle: '删除成功',
              errorTitle: '删除失败',
              success: () => {
                this.queryList(1);
              }
            });
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(1);
      },
      goToTemp(item, type) {
        let devCode = item.devCode;
        let id = item.ccsDevId;
        let devName = item.devName || item.ccsDevName;
        this.$router.push({path: '/monitoring/org/hot/spot/temp', query: {id, type}});
      }
    }
  };
</script>
