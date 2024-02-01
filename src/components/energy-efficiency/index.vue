<template>
  <div class="dashboard">
    <!--科室筛选-->
    <div class="warning-list-part bar-part">
      <div style="display: flex;justify-content: space-between;">
        <el-select v-model="listParams.departmentId" placeholder="全部" clearable @change="deptChangeHandler">
          <el-option v-for="(item,index) in departmentList"
                     :key="index"
                     :value="item.id"
                     :label="item.departmentName"
          />
        </el-select>
      </div>
    </div>

    <div class="warning-list-part bar-part" style="margin-top: 45px">
      <el-row>
        <el-col :span="6">
          <div>
            <el-statistic title="今日总用电量">
              <template slot="formatter">
                {{ statisticInfo.electricityTotalCount }}
              </template>
            </el-statistic>
          </div>
        </el-col>
        <el-col :span="6" :offset="3">
          <div>
            <el-statistic title="今日设备平均用电量">
              <template slot="formatter">
                {{ statisticInfo.electricityAvgCount }}
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
      </el-row>
    </div>

    <div style="padding: 0 20px">
      <el-row v-if="devMonitorList.length > 0" :gutter="90">
        <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4"
                v-for="(item,index) in devMonitorList" :key="index" style="min-width: 200px;margin-bottom: 20px">
          <div :class="getDevMonitorTitleBgClass(item)" style="height: 45px;line-height: 45px;padding: 5px 10px">
            <span>{{ item.devName }}</span>
          </div>
          <div style="background: #fff;height: 120px;padding: 5px 10px;">
            <div style="height: 18px;line-height: 18px">{{ item.departmentName || '' }}</div>
            <div style="align-items: center;text-align: center;padding-top: 10px">
              <div style="line-height: 30px">{{ item.electricityCount || '--' }}</div>
              <div style="line-height: 30px">今日用电量</div>
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
    deptChangeHandler(){
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
            departmentName: item.departmentName,
            departmentPosition: item.departmentPosition,
            id: item.id
          }
        })
      })
    },
    /* 设备数量查询 */
    getDevCount() {
      EnergyEffciencyApi.getStatisticInfo({departmentId: this.departmentId}).then(res => {
        this.statisticInfo = res.data;
      }).catch(err => {
        console.log('查询设备数量接口异常：', {...err})
      })
    },
    queryList(pageNo = 1) {
      this.listParams.pageNo = pageNo;
      this.listParams.pageSize = this.pager.pageSize;
      EnergyEffciencyApi.getDevMonitorList(this.listParams).then(res => {
        console.log(res, '设备监控列表')
        this.devMonitorList = res.data.list;
        this.pager.count = res.data.total
      }).catch(err => {
        console.log('查询设备监控列表接口异常：', {...err})
      })
    },
    // 样式查询
    getDevMonitorTitleBgClass(item) {
      let classes = {
        'ONLINE': 'bg-green',
        'OFFLINE': 'bg-grey',
        'ALARM': 'bg-red'
      }
      return classes[item.status] || 'bg-green'
    },
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

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
