<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">设备信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!formItem.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content">
            <el-row>
              <el-col :span="12">
                <oms-row  label="探头">{{formItem.sensorName}}</oms-row>

                <oms-row  label="湿度告警开关">
                  <el-tag type="primary" :type="formItem.humidityAlarmFlag === '1' ? 'success' : 'warning'">
                    {{formItem.humidityAlarmFlag === '1' ? '开启' : '关闭'}}</el-tag>

                </oms-row>
                <div v-show="formItem.humidityAlarmFlag === '1'">
                  <oms-row label="湿度最高值">
                    {{formItem.humidityMax}}%
                  </oms-row>
                  <oms-row label="湿度最低值">
                    {{formItem.humidityMin}}%
                  </oms-row>
                  <oms-row  label="湿度1级告警延迟时间" v-show="formItem.humidityLevelOneAlarmDelayTime">
                    {{formItem.humidityLevelOneAlarmDelayTime}}分钟</oms-row>
                  <oms-row  label="湿度2级告警延迟时间" v-show="formItem.humidityLevelTwoAlarmDelayTime">
                    {{formItem.humidityLevelTwoAlarmDelayTime}}分钟</oms-row>
                  <oms-row  label="湿度3级告警延迟时间" v-show="formItem.humidityLevelThreeAlarmDelayTime">
                    {{formItem.humidityLevelThreeAlarmDelayTime}}分钟</oms-row>
                </div>
                <oms-row  label="电压告警开关">
                  <el-tag type="primary" :type="formItem.voltageAlarmFlag === '1' ? 'success' : 'warning'">
                    {{formItem.voltageAlarmFlag === '1' ? '开启' : '关闭'}}</el-tag>
                </oms-row>
                <div v-show="formItem.voltageAlarmFlag === '1'">
                  <oms-row  label="电压最高值">{{formItem.voltageMax}}%</oms-row>
                  <oms-row  label="电压最低值">{{formItem.voltageMin}}%</oms-row>
                  <oms-row  label="电压1级告警延迟时间">{{formItem.voltageLevelOneAlarmDelayTime}}分钟</oms-row>
                  <oms-row  label="电压2级告警延迟时间">{{formItem.voltageLevelTwoAlarmDelayTime}}分钟</oms-row>
                  <oms-row  label="电压3级告警延迟时间">{{formItem.voltageLevelThreeAlarmDelayTime}}分钟</oms-row>
                </div>
              </el-col>
              <el-col :span="12">
                <oms-row  label="告警通知组">{{formItem.alarmNoticeGroupName}}</oms-row>
                <oms-row  label="温度告警开关">
                  <el-tag type="primary" :type="formItem.temperatureAlarmFlag === '1' ? 'success' : 'warning'">
                    {{formItem.temperatureAlarmFlag === '1' ? '开启' : '关闭'}}</el-tag>
                </oms-row>
                <div v-show="formItem.temperatureAlarmFlag === '1'">
                  <oms-row   label="温度最高值">{{formItem.temperatureMax}}℃</oms-row>
                  <oms-row  label="温度最低值">{{formItem.temperatureMin}}℃</oms-row>
                  <oms-row  label="温度1级告警延迟时间">{{formItem.temperatureLevelOneAlarmDelayTime}}分钟</oms-row>
                  <oms-row  label="温度2级告警延迟时间">{{formItem.temperatureLevelTwoAlarmDelayTime}}分钟</oms-row>
                  <oms-row  label="温度3级告警延迟时间">{{formItem.temperatureLevelThreeAlarmDelayTime}}分钟</oms-row>
                </div>

                <oms-row  label="离线告警开关">
                  <el-tag type="primary" :type="formItem.offLineFlag === '1' ? 'success' : 'warning'">
                    {{formItem.offLineFlag === '1' ? '开启' : '关闭'}}</el-tag>
                </oms-row>
                <div v-show="formItem.offLineFlag === '1'">
                  <oms-row  label="离线1级告警延迟时间">{{formItem.offLineLevelOneAlarmDelayTime}}分钟</oms-row>
                  <oms-row  label="离线2级告警延迟时间">{{formItem.offLineLevelTwoAlarmDelayTime}}分钟</oms-row>
                  <oms-row  label="离线3级告警延迟时间">{{formItem.offLineLevelThreeAlarmDelayTime}}分钟</oms-row>
                </div>
              </el-col>
            </el-row>

          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  export default {
    props: {
      index: Number,
      formItem: Object,
      statusType: Object
    },
    data() {
      return {
        span: 10,
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0}
        ],
        currentTab: {},
        tempList: [],
        currentIndex: -1,
        parent: this.$parent.$parent
      };
    },
    watch: {
      index(val) {
        this.currentIndex = -1;
        this.$nextTick(() => {
          this.currentIndex = val;
        });
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
      addBindRelation() {
        this.$refs['bindRelation'].isShowAddForm = true;
      }
    }
  };
</script>
