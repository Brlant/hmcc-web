<style lang="scss" scoped>
  .order-list-body {
    .cool-content {
      margin-top: 25px;
      .dev {
        border-bottom: 1px solid #eee;
        margin-bottom: 20px;
        /*align-items: normal;*/
      }
      .dev-title {
        text-align: center;
        font-weight: bold;
        font-size: 24px;
      }

      .img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
      }
      .opera-btn {
        text-align: center;
        .des-btn +.des-btn {
          margin-left: 15px;
        }
      }
    }

    .order-list-item {
      cursor: auto;
      position: relative;
    }
  }
  .alarm-title {
    font-size: 20px;
    position: absolute;
    left: 20px;
    top: 8px;
  }
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'ccs-monitordev-add'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <div class="order-list" style="margin-top: 20px">
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
        <div :class="[formatRowAlarmClass(item) ,{'active':currentItemId===item.id}]" class="order-list-item"
             v-for="item in dataList">
              <span class="alarm-title">
                      <span v-if="item.alarm">告警</span>
                      <span v-if="!item.alarm && item.status === '1'">正常</span>
                      <span v-if="!item.alarm && item.status === '0'">未监控</span>
              </span>
          <el-row>
            <el-col :span="10">
              <div class="cool-content">

                <div class="dev-title">{{item.no}}</div>
                <el-row class="dev">
                  <el-col :span="16">
                    <oms-row label="类型" :span="6">{{item.no}}</oms-row>
                    <oms-row label="型号" :span="6">{{item.version}}</oms-row>
                    <oms-row label="单位" :span="6">{{item.orgName}}</oms-row>
                  </el-col>
                  <el-col :span="8">
                    <img class="img" :src="Cool">
                  </el-col>
                </el-row>
                <div class="opera-btn">
                  <des-btn @click="monitorTemp(item)" icon="start" v-has="'ccs-monitordev-switch'"
                           v-show="item.status==='0'">开启监控
                  </des-btn>
                  <des-btn @click="cancelMonitorTemp(item)"
                           icon="forbidden" v-has="'ccs-monitordev-switch'" v-show="item.status==='1'">取消监控
                  </des-btn>
                  <des-btn @click="edit(item)" icon="edit" v-has="'ccs-monitordev-edit'">编辑</des-btn>
                  <des-btn @click="deleteItem(item)" icon="delete" v-has="'ccs-monitordev-del'">删除</des-btn>
                </div>
              </div>
            </el-col>
            <el-col :span="14">
              <dev-list :dev-item="item"/>
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

    <page-right :css="{'width':'800px','padding':0}" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex" :is="currentPart" @change="change" @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import {DevMonitoring, MonitoringObjGroup} from '@/resources';
  import DevList from './dev-list';
  import Cool from '@/assets/img/cool.jpg';

  export default {
    components: {
      SearchPart, DevList
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: utils.orderType,
        filters: {},
        dialogComponents: {
          0: addForm,
          1: showForm
        },
        typeList: [
          {title: '车辆', id: '1'},
          {title: '冷柜', id: '2'}
        ],
        Cool
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
        const http = DevMonitoring.query;
        this.filters.activeFlag = this.filters.status;
        this.dataList = [
          {
            no: '罗泾1#冰箱3101131701-05-0004',
            type: '冰箱',
            version: '海尔药品保存箱HYC-940',
            orgName: '长宁区疾控预防中心',
            status: '1',
            alarm: false,
            details: [
              {
                name: '探头1号', no: 's-001', type: '至强1号', temp: '7.2', humidity: '60', voltage: 220, time: Date.now(),
                tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
              },
              {
                name: '探头2号', no: 's-002', type: '至强1号', temp: '5', humidity: '70', voltage: 220, time: Date.now(),
                tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
              },
              {
                name: '探头11号', no: 's-002', type: '至强1号', temp: '5', humidity: '70', voltage: 220, time: Date.now(),
                tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
              }
            ]
          },
          {
            no: '罗泾1#冰箱3101131701-05-0004',
            type: '冰箱',
            version: 'tc-001',
            orgName: '长宁区疾控预防中心',
            status: '0',
            alarm: false,
            details: [
              {
                name: '探头2号', no: 's-001', type: '至强1号', temp: '7.2', humidity: '60', voltage: 220, time: Date.now(),
                tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
              },
              {
                name: '探头3号', no: 's-002', type: '至强1号', temp: '5', humidity: '70', voltage: 220, time: Date.now(),
                tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
              }
            ]
          },
          {
            no: '冰柜1号',
            type: '冰柜',
            version: 'tc-001',
            orgName: '长宁区疾控预防中心',
            status: '1',
            alarm: true,
            details: [
              {
                name: '探头4号', no: 's-001', type: '至强1号', temp: 1.8, humidity: 60, voltage: 220, time: Date.now(),
                tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: '0'
              },
              {
                name: '探头5号', no: 's-002', type: '至强1号', temp: '5', humidity: 40, voltage: 220, time: Date.now(),
                tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: '1'
              }
            ]
          }
        ];
        // const params = this.queryUtil(http, pageNo);
      },
      formatRowAlarmClass(item) {
        if (item.status === '1') {
          return item.alarm ? 'status-alarm' : 'status-common';
        } else {
          return 'status-close';
        }
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
      deleteItem(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否删除监控设备"${item.monitordevCode}"`, () => {
          this.$httpRequestOpera(DevMonitoring.delete(item.id), {
            successTitle: '删除成功',
            errorTitle: '删除失败',
            success: () => {
              this.queryList(1);
            }
          });
        });
      },
      monitorTemp(item) {
        this.$confirmOpera(`是否监控设备"${item.monitordevCode}"`, () => {
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
        this.$confirmOpera(`是否取消对设备"${item.monitordevCode}"的监控`, () => {
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
      showItemDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.showPart(1);
        this.$nextTick(() => {
          this.form = item;
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(1);
      }
    }
  };
</script>
