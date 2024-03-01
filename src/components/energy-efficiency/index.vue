<template>
  <div class="dashboard">
    <!--科室筛选-->
    <div class="warning-list-part bar-part">
      <el-row :gutter="10">
        <el-col :span="2">
          <el-select v-model="listParams.departmentId" placeholder="请选择科室" clearable
                     filterable
                     @change="deptChangeHandler">
            <el-option v-for="(item,index) in departmentList"
                       :key="index"
                       :value="item.id"
                       :label="item.departmentName">
              <span style="float: left">{{ item.departmentName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.status === '1'?'停用':'启用' }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="listParams.keyWord" placeholder="请输入设备编号/名称" clearable @keyup.enter.native="search"/>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="warning-list-part bar-part" style="margin-top: 45px;cursor: pointer" @click="toAnalysis">
      <el-row>
        <el-col :span="6">
          <div style="padding-top: 10px">
            <el-statistic title="今日总用电量">
              <template slot="formatter">
                <h3> {{ statisticInfo.electricityTotalCount }}度</h3>
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6" :offset="4">
          <div style="padding-top: 10px">
            <el-statistic title="今日设备平均用电量">
              <template slot="formatter">
                <h3 style="font-weight: 800;margin-top: 20px"> {{ statisticInfo.electricityAvgCount }}度</h3>
              </template>
            </el-statistic>
          </div>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="6" class="center">
          设备总数：{{ statisticInfo.totalCount }}
        </el-col>
        <el-col :span="2" :offset="1">
          <el-badge is-dot type="success"></el-badge>
          开机数 {{ statisticInfo.onlineCount }}
        </el-col>
        <el-col :span="2" :offset="1">
          <el-badge is-dot type="info"></el-badge>
          关机数 {{ statisticInfo.offlineCount }}
        </el-col>
        <el-col :span="2" :offset="1">
          <el-badge is-dot type="danger"></el-badge>
          异常数 {{ statisticInfo.alarmCount }}
        </el-col>
        <el-col :span="2" :offset="1">
          <el-badge is-dot type="warning"></el-badge>
          故障数 {{ statisticInfo.faultCount }}
        </el-col>
        <el-col :span="2" :offset="1">
          <el-badge is-dot type="primary"></el-badge>
          未知数 {{ statisticInfo.otherCount }}
        </el-col>
      </el-row>
    </div>

    <div style="padding: 20px">
      <el-row v-if="devMonitorList.length > 0" :gutter="80">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4"
                v-for="(item,index) in devMonitorList" :key="index">
          <div class="dev-monitor" @click="handleDevMonitorClick(item)">
            <div :class="getDevMonitorTitleBgClass(item)" class="dev-monitor-title">
              <span>{{ item.devName }}</span>
            </div>
            <div class="dev-monitor-main">
              <div class="dev-monitor-departmentName">{{ item.departmentName || '' }}</div>
              <div class="dev-monitor-elec">
                <div class="dev-monitor-elec-count"><strong>{{ item.electricityCount || '--' }}</strong></div>
                <div class="dev-monitor-elec-title">今日用电量</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-empty v-else description="暂无数据"></el-empty>
    </div>

    <div class="text-center" v-show="(devMonitorList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[6,12,24,48]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import {EnergyEffciencyApi} from '@/resources';
import TimeMixins from '@/mixins/timeMixin';
import CommonMixin from '@/mixins/commonMixin';

export default {
  name: 'energy-effciency',
  components: {},
  mixins: [TimeMixins, CommonMixin],
  data() {
    return {
      listParams: {
        departmentId: '',
        pageNo: 1,
        pageSize: 12
      },
      departmentList: [],
      statisticInfo: {
        totalCount: '',     //设备总数
        onlineCount: '',    //开机数
        offlineCount: '',   //关机数
        alarmCount: '',     //异常数
        faultCount: '',     //故障数
        otherCount: '',     //未知数
        electricityTotalCount: '', // 今日总用电量
        electricityAvgCount: '', // 今日设备平均用电量
      },
      devMonitorList: [],
      // 刷新周期
      refreshCycle: 10 * 60 * 1000
    };
  },
  mounted() {
    this.pager.pageSize = 12;

    this.getDetpList();
    this.getDevCount();
    this.refreshDevMonitorList();
  },
  methods: {
    deptChangeHandler() {
      this.queryList(1);
      this.getDevCount();
    },
    search() {
      this.queryList(1);
      this.getDevCount();
    },
    refreshDevMonitorList() {
      this.queryList();
      // 每10分钟刷新一次列表
      setTimeout(() => {
        this.refreshDevMonitorList();
      }, this.refreshCycle)
    },
    /* 科室列表 */
    getDetpList() {
      EnergyEffciencyApi.getDetpList({}).then(res => {
        this.departmentList = res.data.map(item => {
          return {
            id: item.id,
            departmentName: item.departmentName,
            status: item.status,
          }
        })

        this.departmentList.unshift({
          id: '',
          departmentName: '全部',
        })
      })
    },
    /* 设备数量查询 */
    getDevCount() {
      EnergyEffciencyApi.getStatisticInfo({departmentId: this.listParams.departmentId}).then(res => {
        this.statisticInfo = res.data;
      }).catch(err => {
        // console.log('查询设备数量接口异常：', {...err})
      })
    },
    queryList(pageNo = 1) {
      this.listParams.pageNo = pageNo;
      this.listParams.pageSize = this.pager.pageSize;
      EnergyEffciencyApi.getDevMonitorList(this.listParams).then(res => {
        // console.log(res, '设备监控列表')
        this.devMonitorList = res.data.list;
        this.pager.count = res.data.total
      }).catch(err => {
        // console.log('查询设备监控列表接口异常：', {...err})
      })
    },
    // 样式查询
    getDevMonitorTitleBgClass(item) {
      let classes = {
        'ONLINE': 'bg-green',
        'OFFLINE': 'bg-grey',
        'ALARM': 'bg-red',
        'FAILURE': 'bg-yellow',
        '--': 'bg-other',
      }
      return classes[item.status] || 'bg-green'
    },
    handleDevMonitorClick(item) {
      this.$router.push({
        path: '/energy-efficiency/analysis',
        query: {
          id: item.deviceId
        }
      })
    },
    toAnalysis(){
      this.$router.push({
        path: '/energy-efficiency/analysis'
      })
    }
  }
};
</script>

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
    width: 100%;
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

.el-col {
  border-radius: 4px;
}

.bg-green {
  background-color: #67C23A;
}

.bg-grey {
  background-color: #909399;
}

.bg-red {
  background-color: #F56C6C;
}
.bg-yellow {
  background-color: #E6A23C;
}
.bg-other {
  background-color: #7142FF;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.dev-monitor {
  cursor: pointer;
  //border: #fff 1px solid;
  border-radius: 5px;
  height: 150px;
  width: 320px;
  background: #fff;
  margin-bottom: 20px;

  .dev-monitor-title {
    padding: 5px 10px;
    -moz-border-radius-topleft: 5px;
    -moz-border-radius-topright: 5px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    line-height: 30px;
  }

  .dev-monitor-departmentName {
    padding: 5px 10px;
  }

  .dev-monitor-elec {
    align-items: center;
    text-align: center;
    padding-top: 10px
  }

  .dev-monitor-elec-title {
    font-size: 14px;
    color: #606266;
    line-height: 30px;
  }

  .dev-monitor-elec-count {
    font-size: 20px;
    line-height: 30px;
  }
}
</style>
