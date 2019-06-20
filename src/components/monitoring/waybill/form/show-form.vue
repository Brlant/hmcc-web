<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">运单监控信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <!--<div v-if="loading">-->
      <!--<oms-loading :loading="loading"></oms-loading>-->
      <!--</div>-->
      <div class="empty-info" v-if="!formItem.id">暂无数据</div>
      <div v-else v-loading="loading">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: getCurPageSetItem(0).key === currentTab.key}" class="tit f-dib index-tit">
              {{getCurPageSetItem(0).name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <el-row>
              <oms-col :isShow="true" :rowSpan="rowSpan" label="运单编号">{{formItem.orderCode}}</oms-col>
              <oms-col :isShow="true" :rowSpan="rowSpan" label="货主">{{formItem.ownnerName}}</oms-col>
              <oms-col :isShow="true" :rowSpan="rowSpan" label="客户">{{formItem.customerName}}</oms-col>
              <oms-col :isShow="true" :rowSpan="rowSpan" label="收货地址">{{formItem.arriveAddress}}</oms-col>
            </el-row>
            <el-row>
              <oms-col :isShow="true" :rowSpan="rowSpan" label="启运时间">{{formItem.departTime | minute}}</oms-col>
              <oms-col :isShow="true" :rowSpan="rowSpan" label="送达时间">{{formItem.arriveTime | minute}}</oms-col>
            </el-row>
            <el-row>
              <oms-col :isShow="true" :rowSpan="rowSpan" label="运单监控开始时间">{{formItem.createTime | time}}</oms-col>
              <oms-col :isShow="true" :rowSpan="rowSpan" label="数据截止时间" v-if="handOverList[0]">{{handOverList[0].endTime
                |
                minute}}
              </oms-col>
            </el-row>
          </div>
          <div class="hr mb-10 mt-10"></div>
        </div>
        <div class="form-header-part" v-if="formItem.arriveTime">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: getCurPageSetItem(3).key === currentTab.key}" class="tit f-dib index-tit">
              {{getCurPageSetItem(3).name}}</h3>
          </div>
          <div class="content">
            <div v-show="handOverList.length">
              <chart-line-hand :dataList="handOverList" :devInfo="formItem" class="mt-10"
                               ref="vhDevTempLineHand"></chart-line-hand>
            </div>
            <div v-show="!handOverList.length">暂无数据</div>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: getCurPageSetItem(1).key === currentTab.key}" class="tit f-dib index-tit">
              {{getCurPageSetItem(1).name}}</h3>
            <span @click="showAdd" class="btn-circle" v-has="'ccs-department-add'"><i
              class="el-icon-t-plus"></i> </span>
          </div>
          <div>
            <el-form :model="detailForm" class="clearfix" label-width="100px" ref="detailForm" v-show="showAddFlag">
              <el-row>
                <el-col :span="20">
                  <el-form-item label="设备" style="margin-top: 20px;margin-bottom: 20px">
                    <el-select :clearable="true" :remote-method="queryDevList" @click.native="queryDevList('')"
                               filterable
                               multiple placeholder="请输入设备名称/编号/编码查询设备"
                               popperClass="good-selects" remote v-model="detailForm.devIdList">
                      <el-option :key="ccsDev.ccsDevId" :label="ccsDev.devName" :value="ccsDev.ccsDevId"
                                 v-for="ccsDev in ccsDevList">
                        <div style="overflow: hidden">
                          <span class="pull-left" style="clear: right">{{ccsDev.devName}}</span>
                        </div>
                        <div style="overflow: hidden">
                          <span class="select-other-info pull-left">
                            <span v-show="ccsDev.devCode">设备编码:</span>{{ccsDev.devCode}}
                          </span>
                          <span class="select-other-info pull-left" style="margin-left: 10px">
                            <span v-show="ccsDev.devNo">设备编号:</span>{{ccsDev.devNo}}
                          </span>
                        </div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="4" style="margin-top: 20px;margin-bottom: 20px;padding-left: 40px">
                  <el-button :disabled="doing" @click="onSubmit('detailForm')" type="primary">保存</el-button>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="content">
            <div class="order-list clearfix" style="padding-top: 10px">
              <el-row class="order-list-header">
                <el-col :span="6">名称</el-col>
                <el-col :span="6">编码</el-col>
                <el-col :span="6" v-show="!formItem.arriveTime">最新数据</el-col>
                <el-col :span="6">操作</el-col>
              </el-row>
              <div class="empty-info mini" v-if="!tempList.length">暂无数据</div>
              <div class="order-list-body flex-list-dom" v-else>
                <div :key="index" class="order-list-item no-pointer order-list-item-bg"
                     v-for="(item, index) in tempList">
                  <el-row>
                    <el-col :span="6">{{item.devName}}</el-col>
                    <el-col :span="6">{{item.devCode}}</el-col>
                    <el-col :span="6" v-show="!formItem.arriveTime">
                      <el-tooltip :content="showRecordDate(item.recordDate)" effect="dark" placement="top">
                        <span>{{$formatDevData(item, $formatDevType(item))}}</span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span="6">
                        <span @click.stop="deleteDetail(item)" v-has="'ccs-department-add'">
                          <a @click.pervent="" class="btn-circle btn-opera">
                            <i class="el-icon-t-delete"></i>
                          </a>删除
                        </span>
                    </el-col>
                  </el-row>
                </div>
                <chart-line :dataKey="tempDataKey" :devInfo="formItem"
                            :isLoaded="loadingData" class="mt-10"
                            ref="devTempLine" v-loading="loadingData"></chart-line>
              </div>
            </div>

          </div>
        </div>
        <div class="form-header-part" v-if="isLoadedFirst">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: getCurPageSetItem(2).key === currentTab.key}" class="tit f-dib index-tit">
              {{getCurPageSetItem(2).name}}</h3>
          </div>
          <div class="content">
            <div v-show="plateNumbers.length">
              <vehicle-form :devInfo="formItem" :plateNumbers="plateNumbers" :queryVhDevInfo="queryAllVhDevInfo"
                            :setVhList="setVhList"></vehicle-form>
              <chart-line :dataKey="tempVhDataKey" :devInfo="formItem" :isLoaded="loadingDataVh"
                          class="mt-10" ref="vhDevTempLine"
                          v-if="isShowVhChart" v-loading="loadingDataVh"></chart-line>
              <map-path :formItem="formItem" :isLoaded="isLoaded" :showBigMap="showBigMap"
                        :vhList="vhList" vid="waybillMap"></map-path>
            </div>
            <div class="empty-info mini" v-show="!plateNumbers.length">暂无信息</div>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: getCurPageSetItem(4).key === currentTab.key}" class="tit f-dib index-tit">
              {{getCurPageSetItem(4).name}}</h3>
          </div>
          <rule-notify-scan :unitId="formItem.id" perm="ccs-transorder-rulecfg"></rule-notify-scan>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import qs from 'qs';
  import ChartLine from './chart-line';
  import {MonitoringObjGroup, TempDev} from '@/resources';
  import VehicleForm from './vehicle-form';
  import ChartLineHand from './chart-line-hand';
  import MapPath from '../map/map-path';
  import StorageMixin from '@/mixins/StorageMixin';

  export default {
    props: {
      index: Number,
      formItem: Object,
      showBigMap: Function
    },
    components: {ChartLine, VehicleForm, ChartLineHand, MapPath},
    mixins: [StorageMixin],
    data() {
      return {
        rowSpan: 9,
        loading: false,
        loadingData: false,
        loadingDataVh: false,
        currentTab: {},
        tempList: [],
        tempDataKey: 'tempDataList',
        tempVhDataKey: 'tempVhDataList',
        plateNumbers: [],
        isShowVhChart: false,
        handOverList: [],
        vhList: [],
        isLoaded: false,
        isLoadedFirst: false,
        showAddFlag: false,
        detailForm: {
          ccsOrderId: '',
          devIdList: []
        },
        ccsDevList: [],
        doing: false
      };
    },
    computed: {
      pageSets() {
        let ary = [
          {name: '基本信息', key: 0},
          {name: '温度计信息', key: 1},
          {name: '车辆信息', key: 2},
          {name: '监控规则', key: 4}
        ];
        if (this.formItem.arriveTime) {
          ary.splice(1, 0, {name: '交接数据', key: 3});
        }
        return ary;
      }
    },
    watch: {
      index(val) {
        this.removeStorageItem(this.tempDataKey);
        this.removeStorageItem(this.tempVhDataKey);
        this.handOverList = [];
        this.vhList = [];
        this.isShowVhChart = false;
        this.isLoadedFirst = false;
        this.isLoaded = false;
        if (val !== 1) return;
        this.plateNumbers = this.formItem.plateNumber ? [this.formItem.plateNumber] : [];
        // 查询温度计数据
        this.queryDetail();
        // 查询交接数据
        this.queryHandOverList();
      }
    },
    methods: {
      deleteDetail: function (item) {
        this.$confirm('确认删除设备"' + item.devName + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            devId: item.ccsDevId
          };
          MonitoringObjGroup.deleteCcsMonitorRelationByMonitorTargetIdAndDevCode(this.formItem.ccsOrderId, param).then(() => {
            this.$notify.success({
              duration: 2000,
              title: '成功',
              message: '已成功删除设备"' + item.devName + '"'
            });
            this.detailForm.devIdList = [];
            this.showAddFlag = false;
            this.$http.get(`ccsOrder/info/${this.formItem.ccsOrderId}`).then(res => {
              this.formItem = res.data;
              this.queryDetail();
            });
          }).catch(error => {
            this.$notify.error({
              duration: 2000,
              message: error.response && error.response.data && error.response.data.msg || '删除设备失败'
            });
          });
        }).catch(() => {

        });
      },
      onSubmit: function () {
        if (!this.detailForm.devIdList.length) {
          this.$notify.warning({
            duration: 2000,
            message: '请选择需要添加的设备'
          });
          return;
        }
        this.detailForm.ccsOrderId = this.formItem.ccsOrderId;
        this.doing = true;
        MonitoringObjGroup.addCcsOrderDevMonitorRelation(this.detailForm).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功新增设备'
          });
          this.doing = false;
          this.showAddFlag = !this.showAddFlag;
          this.$http.get(`ccsOrder/info/${this.formItem.ccsOrderId}`).then(res => {
            this.formItem = res.data;
            this.queryDetail();
          });
        }).catch(error => {
          this.$notify.error({
            duration: 2000,
            message: error.response && error.response.data && error.response.data.msg || '新增设备失败'
          });
        });
      },
      queryDevList: function (query) {
        let param = {
          keyWord: query,
          pageNo: 1,
          pageSize: 20
        };
        TempDev.query(param).then(res => {
          this.ccsDevList = res.data.currentList;
        });
      },
      showAdd: function () {
        this.showAddFlag = !this.showAddFlag;
      },
      setVhList(vhList) {
        this.vhList = vhList;
      },
      getCurPageSetItem(key) {
        return this.pageSets.filter(i => i.key === key)[0];
      },
      showRecordDate: function (data) {
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      queryDetail() {
        this.tempList = [];
        this.isLoadedFirst = false;
        if (!this.formItem.devCodes || this.formItem.devCodes && !this.formItem.devCodes.length) {
          this.isLoadedFirst = true;
          return;
        }
        this.loading = true;
        let params = {
          devCodes: this.formItem.devCodes
        };
        this.$http({
          url: '/ccsDevice',
          params,
          paramsSerializer(params) {
            return qs.stringify(params, {indices: false});
          }
        }).then(res => {
          this.tempList = res.data.currentList;
          this.loading = false;
          this.queryAllDevInfo();
        });
      },
      queryAllDevInfo() {
        this.tempList.forEach((i, index) => {
          this.queryDevInfo(i, index === this.tempList.length - 1);
        });
      },
      queryDevInfo(item, isEnd) {
        let params = Object.assign({
          devCode: item.devCode,
          devId: item.ccsDevId,
          valType: '1'
        }, this.getTimeParams(this.formItem.departTime));
        this.loadingData = true;
        TempDev.queryTempData(params).then(res => {
          let ary = this.getStorageItem(this.tempDataKey) || [];
          ary.push({
            name: item.devName,
            tempData: res.data.ccsDevDataRecordDTOList
          });
          this.addStorageItem(this.tempDataKey, ary);
          if (isEnd) {
            setTimeout(() => {
              this.loadingData = false;
              this.isLoadedFirst = true;
            }, 200);
          }
        });
      },
      queryAllVhDevInfo(tempList) {
        if (!tempList) return;
        if (tempList.length) {
          this.isShowVhChart = true;
        }
        tempList.forEach((i, index) => {
          this.queryVhDevInfo(i, index === tempList.length - 1);
        });
      },
      queryVhDevInfo(item, isEnd) {
        if (!this.formItem.departTime) return;
        let params = Object.assign({
          devCode: item.devCode,
          devId: item.ccsDevId,
          valType: '1'
        }, this.getTimeParams(this.formItem.departTime));
        this.loadingDataVh = true;
        this.isLoaded = false;
        TempDev.queryTempData(params).then(res => {
          let ary = this.getStorageItem(this.tempVhDataKey) || [];
          ary.push({
            name: item.relationName,
            tempData: res.data.ccsDevDataRecordDTOList
          });
          this.addStorageItem(this.tempVhDataKey, ary);
          if (isEnd) {
            setTimeout(() => {
              this.loadingDataVh = false;
              this.isLoaded = true;
            }, 200);
          }
        });
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      getTimeParams(startTime) {
        let {formItem, formatTime} = this;
        const tm = 10 * 60 * 1000;
        return {
          startTime: formatTime(startTime ? startTime - tm : formItem.createTime),
          endTime: formatTime(formItem.arriveTime ? formItem.arriveTime + tm : Date.now())
        };
      },
      queryHandOverList() {
        if (!this.formItem.arriveTime) return;
        let params = {waybillNo: this.formItem.orderCode};
        this.$http.get('/handover-data/info', {params}).then(res => {
          this.handOverList = res.data;
        });
      }
    }
  };
</script>
