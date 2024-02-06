<style lang="scss">
.dashboard {
  .el-table {
    td, th {
      padding: 6px 0
    }

    th {
      background: #f7f7f7
    }
  }
}

@import "../../../src/assets/scss/mixins";

.bar-part {
  margin-bottom: 20px;
}

.dashboard {
  padding-top: 20px !important;

  .header {
    margin: 8px 0;
  }

  .title {
    margin: 0;
  }
}

.warning-list-part {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 15px;
}

.waring-statistics {
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    width: 24%;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
}

.warning-item-icon {
  height: 100px;
  width: 100px;

  color: #fff;
  text-align: center;
  font-size: 12px;

  > i {
    display: block;
    font-size: 40px;
    line-height: 70px;
  }
}

.warning-item-body {
  width: calc(100% - 100px);

  color: $subsidiary-color;

  > div {
    padding: 0 15px;

    &:first-child {
      font-size: 14px;
      line-height: 24px;

      i {
        color: $warning-color;
        font-size: 12px;
      }
    }

    &:nth-child(2) {
      width: 100%;
      font-size: 28px;
      line-height: 38px;
      color: $black-color;
    }

    span {
      color: $black-color
    }
  }
}

.waring-statistics-1 {
  .warning-item-icon {
    background: $primary-color;
  }
}

.waring-statistics-2 {
  .warning-item-icon {
    background: $error-color;
  }
}

.waring-statistics-3 {
  .warning-item-icon {
    background: $warning-color;
  }
}

.waring-statistics-4 {
  .warning-item-icon {
    background: $success-color;
  }
}

.warning-chart-part {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.equipment-chart, .alarm-chart {
  position: relative;
  border: 1px solid #eee;
  padding: 15px;
  background: #fff;

  .echarts {
    height: 300px;
    width: 100%
  }

  .refresh-cycle-dropdown {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
  }
}

.deviceStatus {
  margin-top: 10px;
}

.devStatus {
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  margin: 20px 0;
}

.center {
  text-align: center;
}

.devCount {
  font-size: 35px;
  font-weight: bolder;
  margin-bottom: 5px;
  //cursor: pointer;
}
</style>
<template>
  <div class="dashboard">
    <div class="warning-list-part bar-part">
      <div style="display: flex;justify-content: space-between;">
        <el-select v-model="departmentId" placeholder="全部" clearable @change="handleFloorChange($event)">
          <el-option v-for="(item,index) in deptList"
                     :key="index"
                     :value="item.id"
                     :label="item.departmentName"
          />
        </el-select>
        <div style="color:#d1d1d1;margin-top: 10px;">更新时间: {{ lastUpdateTime }}</div>
      </div>
    </div>
    <div class="warning-list-part bar-part">
      <!--    设备状态-->
      <div class="deviceStatus">
        <div class="devStatus">设备状态</div>
        <el-row style="margin: 50px;">
          <el-col :span="4" class="center">
            <div class="devCount" @click="deviceWarnStatus('')"
                 style="color: rgb(128, 128, 255)"> {{ totalNumberDevices.totalCount }}
            </div>
            <div>院内设备总数</div>
          </el-col>
          <el-col :span="4" class="center">
            <div class="devCount" @click="deviceWarnStatus('ONLINE')"
                 style="color: rgb(1,167,240)"> {{ totalNumberDevices.onlineCount }}
            </div>
            <div>开机</div>
          </el-col>
          <el-col :span="4" class="center">
            <div class="devCount" @click="deviceWarnStatus('OFFLINE')"
                 style="color: rgb(1,167,240)"> {{ totalNumberDevices.offlineCount }}
            </div>
            <div>关机</div>
          </el-col>
          <el-col :span="4" class="center">
            <div class="devCount" @click="deviceWarnStatus('ONLINE')"
                 style="color: rgb(0, 183, 92)"> {{ totalNumberDevices.locationCount }}
            </div>
            <div>定位标签</div>
          </el-col>
          <el-col :span="4" class="center">
            <div class="devCount" @click="deviceWarnStatus('OFFLINE')"
                 style="color: rgb(0, 183, 92)"> {{ totalNumberDevices.energyCount }}
            </div>
            <div>能耗标签</div>
          </el-col>
          <el-col :span="4" class="center">
            <div class="devCount devCountColor" @click="deviceWarnStatus('ALARM')"
                 style="color: rgb(216, 0, 27)">
              {{ totalNumberDevices.alarmCount }}
            </div>
            <div>标签告警</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="waring-statistics bar-part">
      <div class="waring-statistics-1">
        <div class="warning-item-icon">
          <i class="el-icon-t-xitongjiankong"></i>
          冷链设备
        </div>
        <div class="warning-item-body">
          <div>当前监控</div>
          <div>{{ focusTotalCount.currentMonitorDevCount }}</div>
          <div>已有设备: <span>{{ focusTotalCount.totalMonitorDevCount }}</span></div>
        </div>
      </div>
      <div class="waring-statistics-2">
        <div class="warning-item-icon">
          <i class="el-icon-t-alarm"></i>
          告警事件
        </div>
        <div class="warning-item-body">
          <div>正在发生告警</div>
          <div>{{ focusTotalCount.unconfirmWarnEventCount }}</div>
          <div>今日累计告警: <span>{{ focusTotalCount.dayWarnEventCount }}</span></div>
        </div>
      </div>
      <div class="waring-statistics-3">
        <div class="warning-item-icon">
          <i class="el-icon-t-notice"></i>
          告警通知
        </div>
        <div class="warning-item-body">
          <div>今日通知</div>
          <div>{{ focusTotalCount.dayNotifyCount }}</div>
          <div>累计通知: <span>{{ focusTotalCount.totalNotifyCount }}</span></div>
        </div>
      </div>
      <div class="waring-statistics-4">
        <div class="warning-item-icon">
          <i class="el-icon-t-temp"></i>
          接入冷链标签
        </div>
        <div class="warning-item-body">
          <div>累计接入</div>
          <div>{{ focusTotalCount.sensorCount }}</div>
          <div>已有冷链标签: <span>{{ focusTotalCount.totalSensorCount }}</span></div>
        </div>
      </div>
    </div>

    <div class="warning-list-part bar-part">
      <el-tabs v-model="activeName">
        <el-tab-pane label="定位标签告警" name="0">
          <div class="deviceStatus">
            <el-table v-loading="loading" :data="abnormalList">
              <el-table-column label="序号" align="center" type="index"/>
              <el-table-column label="设备编号" align="center" prop="devNo"/>
              <el-table-column label="设备名称" align="center" prop="devName"/>
              <el-table-column label="设备类型" align="center" prop="devType">
                <template v-slot="{row}">
                  <div v-for="(item,index) in deviceTypeList" :key="index">
                    <span v-if="row.devType==item.key">{{ item.label }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="所属科室" align="center" prop="departmentName"/>
              <el-table-column label="标签sn码" align="center" prop="tagSnNumber"/>
              <el-table-column label="异常类型" align="center" prop="alarmStatus">
                <template v-slot="{row}">
                  <div v-for="(item,index) in alarmStatusList" :key="index">
                    <span v-if="item.key == row.alarmStatus" style="color: red">
                      {{ item.label }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="最后定位时间" align="center" prop="lastPositionTime"/>
              <el-table-column label="最后位置" align="center" prop="lastPositionStr"/>
              <el-table-column label="告警发生时间" align="center" prop="alarmTime"/>
              <el-table-column label="操作" align="center" prop="">
                <template v-slot="{row}">
                  <el-button type="primary" size="mini" icon="el-icon-location-outline" circle
                             @click="devicesPosition(row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="冷链设备告警" name="1">
          <el-row class="header">
            <el-col :span="24" align="right">
              <refresh-cycle @change="cycleChange"></refresh-cycle>
            </el-col>
          </el-row>
          <el-table :data="reportList">
            <el-table-column label="发生时间" header-align="center" prop="modifyTime" width="110" class-name="time-line">
              <template v-slot="props">
                <div class="time-cell">
                  <span>{{ formatModifyTime(props.row) }}</span>
                  <div class="timeline-item timeline-item-date" v-if="props.row.isIntegralDate"></div>
                  <div class="timeline-item timeline-item-time" v-else-if="props.row.isIntegralTime"></div>
                  <div class="timeline-item timeline-item-normal" v-else></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="恢复时间" align="center" header-align="center" prop="recoveryTime" min-width="150">
              <template v-slot="props">{{ props.row.recoveryTime | time }}</template>
            </el-table-column>
            <el-table-column label="持续时间" align="center" header-align="center" min-width="150">
              <template v-slot="props">{{
                  props.row.id ? formatMsToTime(props.row.recoveryTime ?
                    props.row.recoveryTime : Date.now(), props.row.occurrenceTime) : ''
                }}
              </template>
            </el-table-column>
            <el-table-column label="告警类型/等级" align="center" header-align="center" prop="warnTypes" min-width="100">
              <template v-slot="props">
                <div v-if="props.row.id">
                  {{ alarmTypeList[props.row.type] }}
                  <div>{{ alarmLevelList[props.row.level] }}告警</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="冷链设备/冷链标签" align="center" header-align="center" prop="monitorTargetCode"
                             min-width="200">
              <template v-slot="props">
                <div>{{ props.row.freezerDevName }}</div>
                <div>{{ props.row.sensorName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="所属单位" align="center" header-align="center" min-width="150">
              <template v-slot="props">
                {{ props.row.orgName }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" header-align="center">
              <template v-slot="props">
                <des-btn v-has="'show'" icon="detail" v-show="props.row.id" @click="showDetail(props.row)"></des-btn>
                <des-btn v-has="'show'" icon="affirm" v-show="props.row.id" @click="confirmItem(props.row)"></des-btn>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="能耗标签告警" name="2">
          <div class="deviceStatus">
            <el-table v-loading="loading" :data="abnormalList1">
              <el-table-column label="序号" align="center" type="index"/>
              <el-table-column label="设备编号" align="center" prop="devNo"/>
              <el-table-column label="设备名称" align="center" prop="devName"/>
              <el-table-column label="设备类型" align="center" prop="devType">
                <template v-slot="{row}">
                  <div v-for="(item,index) in deviceTypeList" :key="index">
                    <span v-if="row.devType==item.key">{{ item.label }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="所属科室" align="center" prop="departmentName"/>
              <el-table-column label="标签sn码" align="center" prop="tagSnNumber"/>
              <el-table-column label="异常类型" align="center" prop="alarmStatus">
                <template v-slot="{row}">
                  <div v-for="(item,index) in alarmStatusList" :key="index">
                    <span v-if="item.key == row.alarmStatus" style="color: red">
                      {{ item.label }}
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="告警发生时间" align="center" prop="alarmTime"/>
              <el-table-column label="操作" align="center" prop="">
                <template v-slot="{row}">
                  <el-button type="primary" size="mini" icon="el-icon-location-outline" circle
                    @click="devicesPosition(row)"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <page-right :show="showIndex !== -1" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <show-form :formItem="form" :index="showIndex" v-show="showIndex===0" :tempTypeList="tempTypeList"
                 @right-close="resetRightBox"/>
      <confirm-form v-show="showIndex===1" :formItem="form"
                    :index="showIndex" @change="change" @right-close="resetRightBox"></confirm-form>
    </page-right>
  </div>
</template>
<script>
import showForm from '@/components/monitoring/alarm/event/form/show-form';
import confirmForm from '@/components/monitoring/alarm/event/form/confirm-form';

import utils from '@/tools/utils';
import {alarmEvent, indexApi} from '@/resources';
import RefreshCycle from '@/components/common/refresh-cycle';
import EquipmentChart from './chart/equipmentChart.vue';
import AlarmChart from './chart/alarmChart.vue';
import AlarmEventMixin from '@/mixins/alarmEventMixin';
import AlarmMixin from '@/mixins/alarmMixin';
import TimeMixins from '@/mixins/timeMixin';
import {sinopharmDictDataType} from '@/api/system/dict/data'

export default {
  components: {
    AlarmChart,
    EquipmentChart,
    RefreshCycle,
    showForm,
    confirmForm
  },
  mixins: [AlarmEventMixin, TimeMixins, AlarmMixin],
  data() {
    return {
      loadingData: false,
      activeName: '0',
      reportList: [],
      showIndex: -1,
      form: {},
      cycle: 0,
      focusTotalCount: {
        currentMonitorDevCount: 0,
        dayNotifyCount: 0,
        dayWarnEventCount: 0,
        sensorCount: 0,
        totalMonitorDevCount: 0,
        totalNotifyCount: 0,
        totalSensorCount: 0,
        // 正在发生告警的告警数量
        unconfirmWarnEventCount: 0
      },
      DevIcon: utils.DevIcon,
      departmentId: '',
      rules: {},
      //设别数组
      deptList: [],
      //设备总数
      totalNumberDevices: {
        totalCount: '',     //设备总数
        onlineCount: '',    //开机数
        offlineCount: '',   //关机数
        locationCount: '',   //定位标签
        energyCount: '',   //能耗标签
        alarmCount: ''      //异常数
      },
      loading: true,
      //异常列表
      abnormalList: [],
      abnormalList1: [],
      //当前更新时间
      lastUpdateTime: '',
      //异常类型
      alarmStatusList: [],
      //设备类型
      deviceTypeList: [],
      //定时任务
      deviceLastUpdateTime: '',
    };
  },
  beforeDestroy() {
    clearInterval(this.deviceLastUpdateTime);
    this.deviceLastUpdateTime = null
  },
  mounted() {
    this.$getDict('coolDevType');
    this.clearAllTimes();
    this.queryReports();
    this.queryFocusTotalCount();

    this.getAbnormalList();
    this.getAbnormalList1();
    //科室列表
    this.getDeptList()
    //设备状态
    this.getEquipmentTotalNumber();
    this.startInterval();
    //异常类型
    this.gethmccDictDataType();
    //设备类型
    this.getDeviceTypeList();
  },
  methods: {
    formatMsToTime(recoveryTime, occurrenceTime) {
      if (!occurrenceTime || !recoveryTime) {
        return '--';
      }
      return utils.formatMsToTime(recoveryTime - occurrenceTime);
    },
    formatModifyTime(item) {
      if (item.isIntegralDate) {
        if (item.modifyTime === this.$moment().format('YYYY-MM-DD')) return '今天';
        return item.modifyTime;
      } else if (item.isIntegralTime) {
        return this.$moment(item.modifyTime).format('HH:mm');
      }
      return this.$moment(item.modifyTime).format('HH:mm:ss');
    },
    formatReportListByDay(data) {
      const dateList = [];
      data.list.forEach(i => {
        let date = this.$moment(i.occurrenceTime).format('YYYY-MM-DD');
        !dateList.includes(date) && dateList.push(date);
        i.modifyTime = i.occurrenceTime;
        i.modifyTimeType = this.$moment(i.occurrenceTime).format('YYYY-MM-DD HH:mm:ss');
        i.isIntegralDate = false;
      });
      let totalList = [].concat(data.list, dateList.map(d => {
        return {
          modifyTime: d,
          modifyTimeType: this.$moment(d).format('YYYY-MM-DD HH:mm:ss'),
          isIntegralDate: true
        };
      }));
      return totalList.sort((pre, net) => this.$moment(net.modifyTime).diff(this.$moment(pre.modifyTime)));
    },
    queryReports() {
      const params = {
        handlingStatus: '0'
      };
      alarmEvent.query(params).then(res => {
        if (res.code === 200) {
          this.reportList = this.formatReportListByDay(res.data);
          if (!this.cycle) return;
          this.setTimes(setTimeout(this.queryReports, this.cycle));
        }
      });
    },
    queryFocusTotalCount() {
      this.$http('/index/gainTopCounts').then(res => {
        this.focusTotalCount = res.data;
      });
    },
    resetRightBox() {
      this.showIndex = -1;
    },
    showDetail(item) {
      if (!item.id) return;
      this.form = item;
      this.showIndex = 0;
    },
    confirmItem(item) {
      if (!item.id) return;
      this.form = item;
      this.showIndex = 1;
    },
    cycleChange(cycle) {
      this.cycle = cycle;
    },
    equipmentCycleChange(cycle) {
      this.$refs['equipmentChart'].cycle = cycle;
    },
    equipmentAlarmChange(cycle) {
      this.$refs['alarmChart'].cycle = cycle;
    },
    change() {
      const params = {handlingStatus: '0'};
      alarmEvent.query(params).then(res => {
        if (res.code === 200) {
          this.reportList = this.formatReportListByDay(res.data);
        }
      });
      this.resetRightBox();
    },
    /* 定位 */
    devicesPosition(row) {
      this.$router.push({
        name: 'DevicePosition',
        params: { ...row }
      });
      // queryApi.queryAddressPos({deviceId:row.id}).then(res=>{
      //   if(res.data.length>0){
      //     this.$router.push({
      //       path:'/equipmap/position',
      //       query:{
      //         deviceId:Number(res.data[0].deviceId),
      //         devName:res.data[0].devName,
      //         devNo:res.data[0].devNo,
      //       }
      //     })
      //   }else{
      //     return this.$notify.info('不存在设备位置信息')
      //   }
      //
      // }).catch(err=>{})
      // console.log(row)
    },
    //设备类型
    getDeviceTypeList() {
      sinopharmDictDataType('device_type').then(res => {
        this.deviceTypeList = res.data.map(item => {
          return {
            label: item.label,
            key: item.key
          }
        })
      }).catch(err => {

      })
    },
    /* 异常类型 */
    gethmccDictDataType() {
      sinopharmDictDataType('alarm_status').then(res => {
        this.alarmStatusList = res.data.map(item => {
          return {
            label: item.label,
            key: item.key
          }
        })
      }).catch(err => {

      })
    },
    startInterval() {
      this.deviceLastUpdateTime = setInterval(() => {
        // 调用接口的代码
        this.getAbnormalList();
        this.getAbnormalList1();
      }, 60 * 1000); // 每隔一分钟调用一次接口
    },
    /* 科室列表 */
    getDeptList() {
      indexApi.getDeptQueryList({}).then(res => {
        this.deptList = res.data.map(item => {
          return {
            departmentName: item.departmentName,
            departmentPosition: item.departmentPosition,
            id: item.id
          }
        })
      })
    },
    /* 设备状态 */
    getEquipmentTotalNumber() {
      indexApi.getEquipmentTotal({departmentId: this.departmentId}).then(res => {
        this.totalNumberDevices = res.data
      }).catch(err => {

      })
    },
    //异常告警列表
    getAbnormalList() {
      let params = {
        departmentId: this.departmentId,
        relationTagType: 2
      }

      indexApi.getList(params).then(res => {
        this.loading = false
        this.abnormalList = res.data;
      })

      this.lastUpdateTime = new Date().toLocaleString();
    },
    getAbnormalList1() {
      let params = {
        departmentId: this.departmentId,
        relationTagType: 1
      }

      indexApi.getList(params).then(res => {
        this.loading = false
        this.abnormalList1 = res.data;
      })

      this.lastUpdateTime = new Date().toLocaleString();
    },
    //楼层切换
    handleFloorChange(row) {
      this.departmentId = row;
      this.getAbnormalList();
      this.getEquipmentTotalNumber();
    },
    //设备状态
    deviceWarnStatus(status) {
      // this.$router.push({
      //   path: '/device/query',
      //   query: {
      //     status: status,
      //     departmentId: this.departmentId
      //   }
      // })
      // console.log('点了 ', status)
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
};
</script>
