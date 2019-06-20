<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <!--<el-button slot="btn"  plain size="small" @click="add">-->
      <!--<f-a class="icon-small" name="plus"></f-a>添加-->
      <!--</el-button>-->
    </search-part>

    <!--<status-list :activeStatus="activeStatus" :statusList="statusType" :checkStatus="checkStatus"/>-->

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">车牌号/运单编号</el-col>
        <el-col :span="5">货主</el-col>
        <el-col :span="5">客户</el-col>
        <el-col :span="4">时间</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="5">操作</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="!dataList.length">
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
            <el-col :span="3">
              <div>
                {{item.plateNumber}}
              </div>
              <div>{{item.orderCode}}</div>
            </el-col>
            <el-col :span="5">{{item.ownnerName}}</el-col>
            <el-col :span="5">{{item.customerName}}</el-col>
            <el-col :span="4">
              <div>创建:{{item.createTime | minute }}</div>
              <div v-show="item.departTime">始:{{item.departTime | minute }}</div>
              <div v-show="item.arriveTime">终:{{item.arriveTime | minute }}</div>
            </el-col>
            <el-col :span="2">
              <div>
                <el-tag :type="item.monitorFlag === '1' ? 'primary' : 'info' " class="el-tag--width">
                  {{item.monitorFlag === '1' ? '激活' : '停止'}}
                </el-tag>
              </div>
              <div style="margin-top: 5px">
                <el-tag type="success" v-show="item.handoverDataDone">已交接</el-tag>
                <el-tag type="danger" v-show="!item.handoverDataDone">未交接</el-tag>
              </div>
            </el-col>
            <el-col :span="5" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="'ccs-transorder-edit'">编辑</des-btn>
              <des-btn @click="monitorTemp(item)" icon="start"
                       v-has="'ccs-transorder-switch'"
                       v-show="item.monitorFlag==='0'&&!item.handoverDataDone">开启监控
              </des-btn>
              <des-btn @click="cancelMonitorTemp(item)" icon="forbidden" v-has="'ccs-transorder-switch'"
                       v-show="item.monitorFlag==='1'">
                取消监控
              </des-btn>
              <!--<des-btn v-has="'ccs-transorder-rulecfg'" icon="edit" @click="ruleConfig(item.id)">配置规则</des-btn>-->
              <des-btn @click="exportFile(item.ccsOrderId)" icon="print" v-has="'ccs-transorder-export'">导出温度计记录
              </des-btn>
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

    <page-right :css="defaultDialogClass" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex" :is="currentPart" :showBigMap="showBigMap"
                 @change="change" @right-close="resetRightBox"/>
    </page-right>
    <el-dialog :fullscreen="true" :visible.sync="isShowMulBigMap" custom-class="custom-dialog-map" title="车辆轨迹"
               width="100%">
      <map-path :formItem="form" :isLoaded="isLoaded" :mapStyle="{height: bodyHeight}" :vhList="vhList"
                custom-class="custom-dialog-map" vid="waybillBigMap"></map-path>
    </el-dialog>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import {MonitoringObjGroup, waybillMonitoring} from '@/resources';
  import MapPath from './map/map-path';

  export default {
    components: {
      SearchPart,
      MapPath
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: utils.orderType,
        filters: {
          status: '0'
        },
        dialogComponents: {
          0: addForm,
          1: showForm
        },
        defaultDialogClass: {
          'width': '1000px',
          'padding': 0
        },
        isShowMulBigMap: false,
        vhList: [],
        isLoaded: false
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height + 136) + 'px';
      }
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
      let id = this.$route.params.id;
      if (id === ':id' || id === 'id') {
        this.$router.push('/monitoring/waybill/id');
      } else {
        this.showItemDetail({id});
      }
    },
    methods: {
      showBigMap(vhList) {
        this.vhList = [];
        this.isShowMulBigMap = true;
        this.isLoaded = false;
        this.$nextTick(() => {
          this.vhList = vhList;
          this.isLoaded = true;
        });
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
        this.defaultDialogClass.width = '1000px';
        this.isLoaded = false;
        this.$router.push('/monitoring/waybill/id');
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      queryList(pageNo) {
        const http = waybillMonitoring.query;
        const params = this.queryUtil(http, pageNo);
        // this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {status: null});
        const http = waybillMonitoring.queryStatusNum;
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
        this.defaultDialogClass.width = '800px';
        this.showPart(0);
      },
      deleteItem(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera('是否删除温度计' + item.name, () => {

        });
      },
      showItemDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.currentPart = this.dialogComponents[1];
        this.queryItemDetail(item);
        this.$router.push(`/monitoring/waybill/${item.id}`);
      },
      queryItemDetail(item) {
        this.$http.get(`ccsOrder/info/${item.id}`).then(res => {
          this.form = res.data;
          this.$nextTick(() => {
            this.showIndex = 1;
          });
        });
      },
      monitorTemp(item) {
        this.$confirmOpera(`是否监控运单"${item.orderCode}"`, () => {
          let obj = {
            activeFlag: '1',
            targetId: item.id
          };
          this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatus(obj), {
            successTitle: '监控成功',
            errorTitle: '监控失败',
            success: () => {
              item.monitorFlag = '1';
            }
          });
        });
      },
      cancelMonitorTemp(item) {
        this.$confirmOpera(`是否取消对运单"${item.orderCode}"的监控`, () => {
          let obj = {
            activeFlag: '0',
            targetId: item.id
          };
          this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatus(obj), {
            successTitle: '取消成功',
            errorTitle: '取消失败',
            success: () => {
              item.monitorFlag = '0';
            }
          });
        });
      },
      exportFile(billWayId) {
        this.setIsPrinting(true);
        this.$http.get(`ccsOrder/${billWayId}/temperature-log/export`).then(res => {
          utils.download(res.data.path);
          this.setIsPrinting(false);
        }).catch(error => {
          this.setIsPrinting(false);
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      setIsPrinting(res) {
        this.$store.commit('initPrint', {isPrinting: res, moduleId: this.$route.path, text: '拼命导出中'});
      },
      change() {
        this.resetRightBox();
        this.queryList(1);
      }
    }
  };
</script>
