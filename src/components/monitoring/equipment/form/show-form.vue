<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">设备监控信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!dev.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content mt-10" style="overflow: hidden">
            <oms-col :isShow="true" label="编码">{{dev.monitordevCode}}</oms-col>
            <oms-col :isShow="true" label="类型">{{typeList[dev.monitordevType-1].title}}</oms-col>
            <oms-col :isShow="true" label="监控状态">{{dev.monitorFlag | formatMonitoringStatus}}</oms-col>
            <!--<oms-col locate-tag="告警状态" :isShow="true">{{dev.warnStatus | formatAlarmStatus}}</oms-col>-->
            <oms-col :isShow="true" label="状态">{{dev.activeFlag | formatUseStatus}}</oms-col>
          </div>
          <div class="hr mb-10 mt-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[1].name}}</h3>
          </div>
          <el-table :data="dev.devs" class="mt-10" header-row-class-name="table-header-color" style="width: 100%;">
            <el-table-column label="名称" min-width="100" prop="relationName"></el-table-column>
            <el-table-column label="设备编码" min-width="100" prop="devCode">
            </el-table-column>
            <el-table-column label="设备编号" min-width="100" prop="devNo">
            </el-table-column>
            <el-table-column label="类型" min-width="120" prop="devType">
              <template slot-scope="scope">
                {{tempTypeList[scope.row.devType]}}
              </template>
            </el-table-column>
            <el-table-column label="最新数据" min-width="100" prop="devCode">
              <template slot-scope="scope">
                <el-tooltip :content="showRecordDate(scope.row.recordDate)" effect="dark" placement="top">
                  <span>{{$formatDevData(scope.row, $formatDevType(scope.row))}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="120" prop="devType">
              <template slot-scope="scope">
                <des-btn @click="$turnDevDate(scope.row, $formatDevType(scope.row))" icon="detail"
                         v-has="'ccs-devmap-scan'">历史数据
                </des-btn>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[2].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[2].name}}</h3>
          </div>
          <rule-notify-scan :unitId="dev.id ? `d,${dev.id}` : ''" perm="ccs-monitordev-rulecfg"></rule-notify-scan>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {DevMonitoring} from '@/resources';

  export default {
    props: ['formItem', 'index'],
    data() {
      return {
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '温度计信息', key: 1},
          {name: '规则信息', key: 2}
        ],
        currentTab: {},
        dev: {},
        typeList: this.$parent.$parent.typeList,
        tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车载温度计', '湿度计'],
        tempList: [{
          ccsDevId: 't1'
        }]
      };
    },
    watch: {
      index(val) {
        if (val !== 1) return;
        this.queryDetail();
      }
    },
    methods: {
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
        this.dev = {};
        this.loading = true;
        DevMonitoring.get(this.formItem.id).then(res => {
          res.data.devs.forEach((i, index) => {
            i.relationName = res.data.relationNames && res.data.relationNames[index] || '';
          });
          this.dev = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
