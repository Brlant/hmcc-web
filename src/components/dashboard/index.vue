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
</style>
<style lang="scss" scoped>
  @import "../../../src/assets/scss/mixins";

  .bar-part {
    margin-bottom: 20px;

  }

  .dashboard {
    width: 1200px;
    margin: 0 auto;
    padding-top: 20px;

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

    > div {

      &:first-child {
        width: 300px;
      }

      &:last-child {
        width: 820px;
      }

      border: 1px solid #eee;
      padding: 15px;
      background: #fff;

      .echarts {
        height: 300px;
        width: 100%
      }
    }
  }

  .equipment-chart, .alarm-chart {
    position: relative;

    .refresh-cycle-dropdown {
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 2;
    }
  }
</style>
<template>
  <div class="dashboard">
    <div class="waring-statistics bar-part">
      <div class="waring-statistics-1">
        <div class="warning-item-icon">
          <i class="el-icon-t-xitongjiankong"></i>
          监控对象
        </div>
        <div class="warning-item-body">
          <div>当前监控</div>
          <div>{{focusTotalCount.curMonitorCnt}}</div>
          <div>累计监控: <span>{{focusTotalCount.totalMonitorCnt}}</span></div>
        </div>
      </div>
      <div class="waring-statistics-2">
        <div class="warning-item-icon">
          <i class="el-icon-t-alarm"></i>
          告警事件
        </div>
        <div class="warning-item-body">
          <div>正在发生</div>
          <div>{{focusTotalCount.unConfirmWarnRecordCnt}}</div>
          <div>今日累计: <span>{{focusTotalCount.dayWarnRecordCnt}}</span></div>
        </div>
      </div>
      <div class="waring-statistics-3">
        <div class="warning-item-icon">
          <i class="el-icon-t-notice"></i>
          告警通知
        </div>
        <div class="warning-item-body">
          <div>今日通知</div>
          <div>{{focusTotalCount.dayNotifyCnt}}</div>
          <div>累计通知: <span>{{focusTotalCount.totalNotifyCnt}}</span></div>
        </div>
      </div>
      <div class="waring-statistics-4">
        <div class="warning-item-icon">
          <i class="el-icon-t-temp"></i>
          接入设备
        </div>
        <div class="warning-item-body">
          <div>累计接入</div>
          <div>{{focusTotalCount.totalDevCnt}}</div>
          <!--<div>累计接入: <span>{{focusTotalCount.totalDevCnt}}</span></div>-->
        </div>
      </div>
    </div>
    <div class="warning-list-part bar-part">
      <el-row class="header">
        <el-col :span="4" align="left">
          <h3 class="title">告警事件</h3>
        </el-col>
        <el-col :span="20" align="right">
          <refresh-cycle @change="cycleChange"></refresh-cycle>
        </el-col>
      </el-row>
      <el-table :data="reportList">
        <el-table-column label="发生时间" header-align="center" prop="modifyTime" width="110" class-name="time-line">
          <template slot-scope="props">
            <div class="time-cell">
              <span>{{ formatModifyTime(props.row)}}</span>
              <div class="timeline-item timeline-item-date" v-if="props.row.isIntegralDate"></div>
              <div class="timeline-item timeline-item-time" v-else-if="props.row.isIntegralTime"></div>
              <div class="timeline-item timeline-item-normal" v-else></div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="恢复时间" align="center" header-align="center" prop="restoreTime" min-width="150">
          <template slot-scope="props">{{props.row.restoreTime | time}}</template>
        </el-table-column>
        <el-table-column label="持续时间" align="center" header-align="center" min-width="150">
          <template slot-scope="props">{{props.row.id ? formatMsToTime(props.row.restoreTime ?
            props.row.restoreTime : Date.now(), props.row.createTime) : '' }}
          </template>
        </el-table-column>
        <el-table-column label="异常类型" align="center" header-align="center" prop="warnTypes" min-width="100">
          <template slot-scope="props">
            <!--<span :key="icon" v-for="icon in props.row.warnTypes && props.row.warnTypes.split(',') || []"-->
            <!--:title="iconClass[icon].title">-->
            <!--<f-a class="icon-danger" :name="iconClass[icon].icon"></f-a>-->
            <!--</span>-->
            <el-tooltip :key="icon" v-for="icon in props.row.warnTypes && props.row.warnTypes.split(',') || []"
                        class="item" effect="dark"
                        :content="iconClass[icon].title + (props.row.warnLevel === '0' ? '告警，级别:低' : '告警，级别:高')"
                        placement="top">
              <f-a :class="props.row.warnLevel === '0' ? 'icon-warning' :'icon-danger'"
                   :name="iconClass[icon].icon"></f-a>
            </el-tooltip>
          </template>
        </el-table-column>
        <!--<el-table-column label="告警级别" align="center" header-align="center" prop="warnLevel" min-width="70">-->
        <!--<template slot-scope="props">{{levels[props.row.warnLevel] && levels[props.row.warnLevel].label}}</template>-->
        <!--</el-table-column>-->
        <el-table-column label="监控对象" align="center" header-align="center" prop="monitorTargetCode" min-width="200">
          <span class="active-text" slot-scope="props"
                @click.stop="goToRouter(props.row)">{{formatTitle(props.row)}}</span>
        </el-table-column>
        <el-table-column label="设备名称" align="left" header-align="left" prop="devName" min-width="160">
          <template slot-scope="props">
            <el-tooltip effect="dark" :content="tempTypeList[props.row.devType]" placement="top"
                        v-if="!props.row.isIntegralDate">
              <f-a class="icon-danger ver-a-mid" :name="DevIcon[props.row.devType][1]"></f-a>
            </el-tooltip>
            <span class="active-text" @click.stop="goToDev(props.row)">{{props.row.devName}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="状态" prop="confirmStatus">-->
        <!--<template slot-scope="props">{{props.row.confirmStatus | formatConfirmStatus}}</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column label="确认时间" align="center" header-align="center" prop="confirmTime">-->
        <!--<template slot-scope="props">{{props.row.confirmTime | time }}</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" align="center" header-align="center" prop="confirmerId">
          <template slot-scope="props">
            <!--<el-tooltip effect="dark" placement="top" content="查看历史数据">-->
            <!--<des-btn v-has="'show'" icon="detail" v-if="props.row.id" @click="confirmItem(props.row)"></des-btn>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip effect="dark" placement="top" content="处理告警事件">-->
            <!--<des-btn v-has="'show'" icon="affirm" v-if="props.row.id" @click="confirmItem(props.row)"></des-btn>-->
            <!--</el-tooltip>-->
            <des-btn v-has="'show'" icon="detail" v-show="props.row.id" @click="showDetail(props.row)"></des-btn>
            <des-btn v-has="'show'" icon="affirm" v-show="props.row.id" @click="confirmItem(props.row)"></des-btn>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bar-part warning-chart-part">
      <div class="equipment-chart">
        <refresh-cycle @change="equipmentCycleChange"></refresh-cycle>
        <equipment-chart ref="equipmentChart"></equipment-chart>
      </div>
      <div class="alarm-chart">
        <refresh-cycle @change="equipmentAlarmChange"></refresh-cycle>
        <alarm-chart ref="alarmChart"></alarm-chart>
      </div>
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
  import {WarnRecord} from '@/resources';
  import RefreshCycle from '@/components/common/refresh-cycle';
  import EquipmentChart from './chart/equipmentChart.vue';
  import AlarmChart from './chart/alarmChart.vue';
  import AlarmEventMixin from '@/mixins/alarmEventMixin';
  import AlarmMixin from '@/mixins/alarmMixin';
  import TimeMixins from '@/mixins/timeMixin';

  const {DevIcon} = utils;
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
        reportList: [],
        showIndex: -1,
        form: {},
        cycle: 0,
        focusTotalCount: {
          curMonitorCnt: 0,
          totalMonitorCnt: 0,
          unConfirmWarnRecordCnt: 0,
          dayWarnRecordCnt: 0,
          dayNotifyCnt: 0,
          totalNotifyCnt: 0,
          devException: 0,
          totalDevCnt: 0
        },
        DevIcon
      };
    },
    mounted() {
      this.clearAllTimes();
      this.queryReports();
      this.queryFocusTotalCount();
    },
    methods: {
      formatMsToTime(restoreTime, createTime) {
        if (!createTime || !restoreTime) {
          return '--';
        }
        return utils.formatMsToTime(restoreTime - createTime);
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
        data.currentList.forEach(i => {
          let date = this.$moment(i.createTime).format('YYYY-MM-DD');
          !dateList.includes(date) && dateList.push(date);
          i.modifyTime = i.createTime;
          i.modifyTimeType = this.$moment(i.createTime).format('YYYY-MM-DD HH:mm:ss');
          i.isIntegralDate = false;
        });
        let totalList = [].concat(data.currentList, dateList.map(d => {
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
          confirmStatus: 0
        };
        WarnRecord.query(params).then(res => {
          this.reportList = this.formatReportListByDay(res.data);
          if (!this.cycle) return;
          this.setTimes(setTimeout(this.queryReports, this.cycle));
        });
      },
      queryFocusTotalCount() {
        this.$http('/ccsIndex/gainTopCounts').then(res => {
          this.focusTotalCount = res.data;
          // 去掉实时刷新统计数量
          // if (!this.cycle) return;
          // this.setTimes(setTimeout(this.queryReports, this.cycle));
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
        const params = {confirmStatus: 0};
        WarnRecord.query(params).then(res => {
          this.reportList = this.formatReportListByDay(res.data);
        });
        this.resetRightBox();
      }
    }
  };
</script>
