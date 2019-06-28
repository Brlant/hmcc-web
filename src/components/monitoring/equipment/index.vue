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
          <el-row class="cool-content">
            <el-col :span="1">
               <span class="alarm-title">
               <el-tag type="danger" v-if="item.monitorStatus === '2'">告警</el-tag>
               <el-tag type="success" v-if="item.monitorStatus === '1'">正常</el-tag>
               <el-tag type="info" v-if="item.monitorStatus === '0'">未监控</el-tag>
            </span>
            </el-col>
            <el-col :span="6" class="text-overflow" style="padding-left: 5px">
              设备：
              <el-tooltip effect="dark" placement="top" :content="item.monitorTargetName">
                <span>{{item.monitorTargetName}}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="2" class="text-overflow">
              类型：{{coolDevType[item.monitorTargetType].label}}
            </el-col>
            <el-col :span="4" class="text-overflow">
              型号：
              <el-tooltip effect="dark" placement="top" :content="item.version">
                <span>{{item.monitorTargetVersion}}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="5" class="text-overflow">
              单位：
              <el-tooltip effect="dark" placement="top" :content="item.orgName">
                <span>{{item.orgName}}</span>
              </el-tooltip>
            </el-col>
            <el-col :span="6" class="opera-btn">
              <des-btn @click="monitorTemp(item)" icon="chaxun" v-has="'ccs-monitordev-switch'">查看历史数据</des-btn>
              <des-btn @click="monitorTemp(item)" icon="start" v-has="'ccs-monitordev-switch'"
                       v-show="item.monitorStatus==='0'">开启监控
              </des-btn>
              <des-btn @click="cancelMonitorTemp(item)"
                       icon="forbidden" v-has="'ccs-monitordev-switch'" v-show="item.monitorStatus==='1'">取消监控
              </des-btn>
              <des-btn @click="edit(item)" icon="edit" v-has="'ccs-monitordev-edit'">编辑</des-btn>
              <des-btn @click="deleteItem(item)" icon="delete" v-has="'ccs-monitordev-del'">删除</des-btn>
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
  import {monitorRelation} from '@/resources';
  import DevList from './dev-list';

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
        ]
      };
    },
    computed: {
      type () {
        return this.$route.meta.type
      },
      coolDevType() {
        return this.$store.state.coolDevType;
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
        // this.dataList = [
        //   {
        //     no: '冰箱1号',
        //     type: '冰箱',
        //     version: 'tc-001',
        //     orgName: '长宁疾控',
        //     monitorStatus: '1',
        //     alarm: false,
        //     details: [
        //       {
        //         name: '探头1号', no: 's-001', type: '至强1号', temp: '7.2', humidity: '60', voltage: 220, time: Date.now(),
        //         tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
        //       },
        //       {
        //         name: '探头2号', no: 's-002', type: '至强1号', temp: '5', humidity: '70', voltage: 220, time: Date.now(),
        //         tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
        //       }
        //     ]
        //   },
        //   {
        //     no: '冰箱2号',
        //     type: '冰箱',
        //     version: 'tc-001',
        //     orgName: '长宁疾控',
        //     monitorStatus: '0',
        //     alarm: false,
        //     details: [
        //       {
        //         name: '探头2号', no: 's-001', type: '至强1号', temp: '7.2', humidity: '60', voltage: 220, time: Date.now(),
        //         tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
        //       },
        //       {
        //         name: '探头3号', no: 's-002', type: '至强1号', temp: '5', humidity: '70', voltage: 220, time: Date.now(),
        //         tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: ''
        //       }
        //     ]
        //   },
        //   {
        //     no: '冰柜1号',
        //     type: '冰柜',
        //     version: 'tc-001',
        //     orgName: '长宁疾控',
        //     monitorStatus: '1',
        //     alarm: true,
        //     details: [
        //       {
        //         name: '探头4号', no: 's-001', type: '至强1号', temp: 1.8, humidity: 60, voltage: 220, time: Date.now(),
        //         tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: '0'
        //       },
        //       {
        //         name: '探头5号', no: 's-002', type: '至强1号', temp: '5', humidity: 40, voltage: 220, time: Date.now(),
        //         tempScope: [2, 8], humidityScope: [50, 70], voltageScope: [200, 240], alarm: '1'
        //       }
        //     ]
        //   }
        // ];
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
          this.$httpRequestOpera(monitorRelation.delete(item.monitorTargetId), {
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
          let obj = {
            activeFlag: '1',
            targetId: item.id
          };
          this.$httpRequestOpera(monitorRelation.start(obj), {
            successTitle: '开启监控完成',
            errorTitle: '开启监控失败',
            success: () => {
              item.monitorFlag = '1';
            }
          });
        });
      },
      cancelMonitorTemp(item) {
        this.$confirmOpera(`是否关闭对设备"${item.monitorTargetName}"的监控`, () => {
          let obj = {
            activeFlag: '0',
            targetId: item.id
          };
          this.$httpRequestOpera(monitorRelation.stop(obj), {
            successTitle: '关闭监控成功',
            errorTitle: '关闭监控失败',
            success: res => {
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
