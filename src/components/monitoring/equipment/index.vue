<style lang="scss" scoped>
  .order-list-body {
    .cool-content {
      border-bottom: 1px solid #eee;
    }

    .order-list-item {
      cursor: auto;
    }
  }
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="permPage.add">
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
          <el-row class="cool-content">
            <el-col :span="1">
               <span class="alarm-title">
               <el-tag type="danger" v-if="item.monitorStatus === '2'">告警</el-tag>
               <el-tag type="success" v-if="item.monitorStatus === '1'">正常</el-tag>
               <el-tag type="info" v-if="item.monitorStatus === '0'">未监控</el-tag>
            </span>
            </el-col>
            <el-col :span="14" class="text-overflow" style="padding-left: 5px">
              <span>
                设备：
                <el-tooltip effect="dark" placement="top" :content="item.monitorTargetName">
                <span>
                  {{item.monitorTargetName}}
                  <span v-show="item.monitorTargetNo">（{{item.monitorTargetNo}}）</span>
                </span>
              </el-tooltip>
              </span>
              <span class="ml-15" v-show="item.monitorTargetType">
                类型：
              <el-tooltip effect="dark" placement="top" :content="formatDictLabel(item.monitorTargetType, coolDevType)">
                <span>
                   {{formatDictLabel(item.monitorTargetType, coolDevType)}}
                </span>
              </el-tooltip>
              </span>
              <span class="ml-15">
                单位：
              <el-tooltip effect="dark" placement="top" :content="item.orgName">
                <span>{{item.orgName}}</span>
              </el-tooltip>
              </span>
            </el-col>
            <el-col :span="10" class="opera-btn" >
<!--              <des-btn @click="record(item)" icon="report" v-has="permPage.record">-->
<!--                记录温度-->
<!--              </des-btn>-->
              <des-btn @click="showHistoryData(item)" icon="chaxun" v-has="permPage.query">查看历史数据</des-btn>
              <des-btn @click="monitorTemp(item)" icon="start" v-has="permPage.start"
                       v-show="item.monitorStatus==='0'">开启监控
              </des-btn>
              <des-btn @click="cancelMonitorTemp(item)"
                       icon="forbidden" v-has="permPage.stop"
                       v-show="item.monitorStatus==='1' || item.monitorStatus==='2'">取消监控
              </des-btn>
              <des-btn @click="edit(item)" icon="edit" v-has="permPage.edit">编辑</des-btn>
              <des-btn @click="deleteItem(item)" icon="delete" v-has="permPage.delete">删除</des-btn>
            </el-col>
          </el-row>
          <dev-list :dev-item="item"/>
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
  import {monitorRelation, temperatureRecord} from '@/resources';
  import DevList from './dev-list';
  import {formatDictLabel} from '@/tools/utils'
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
        formatDictLabel
      };
    },
    computed: {
      type() {
        return this.$route.meta.type;
      },
      coolDevType() {
        return this.$getDict('coolDevType');
      }
    },
    watch: {
      filters: {
        handler: function () {
          this.queryList(1);
        },
        deep: true
      },
      type() {
        this.queryList(1);
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
        const http = monitorRelation.query;
        this.filters.subordinateFlag = this.type === 2;
        this.queryUtil(http, pageNo);
      },
      formatRowAlarmClass(item) {
        let status = item.monitorStatus;
        return status === '0' ? 'status-close' : status === '1' ? 'status-common' : 'status-alarm';
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
        this.$confirmOpera(`是否删除监控设备"${item.monitorTargetName}"`, () => {
          this.$httpRequestOpera(monitorRelation.delete(item.id), {
            successTitle: '删除成功',
            errorTitle: '删除失败',
            success: () => {
              this.queryList(1);
            }
          });
        });
      },
      monitorTemp(item) {
        this.$confirmOpera(`是否开启监控设备"${item.monitorTargetName}"`, () => {
          this.$httpRequestOpera(monitorRelation.start(item.monitorTargetId), {
            successTitle: '开启监控完成',
            errorTitle: '开启监控失败',
            success: () => {
              item.monitorStatus = '1';
            }
          });
        });
      },
      cancelMonitorTemp(item) {
        this.$confirmOpera(`是否取消对设备"${item.monitorTargetName}"的监控`, () => {
          this.$httpRequestOpera(monitorRelation.stop(item.monitorTargetId), {
            successTitle: '取消监控成功',
            errorTitle: '取消监控失败',
            success: res => {
              item.monitorStatus = '0';
            }
          });
        });
      },
      showHistoryData(item) {
        this.$router.push({
          path: '/monitoring/temp',
          query: {freezerDevId: item.monitorTargetId, freezerDevName: item.monitorTargetName}
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
      },
      record(item) {
        this.$confirmOpera(`是否记录此刻设备"${item.monitorTargetName}"的温度数据`, () => {
          let obj = {
            freezerDevId: item.monitorTargetId,
            orgId: item.orgId,
            refrigerationTemperature: item.sensorDataList.filter(f => f.temperatureType === '0').map(m => m.temperature).join('/'),
            freezeTemperature: item.sensorDataList.filter(f => f.temperatureType === '1').map(m => m.temperature).join('/')
          };
          this.$httpRequestOpera(temperatureRecord.add(obj), {
            successTitle: '记录完成'
          });
        });
      }
    }
  };
</script>
