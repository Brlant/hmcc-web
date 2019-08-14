<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">告警事件</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!detail.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" :rowSpan="rowSpan" label="发生时间">{{detail.occurrenceTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="恢复时间">{{detail.recoveryTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="告警类型">{{alarmTypeList[detail.type]}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="告警等级">{{alarmLevelList[detail.level]}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="所属单位">{{detail.orgName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="冷链设备">{{detail.freezerDevName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="探头">{{detail.sensorName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="告警值">{{detail.value}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="恢复值">{{detail.recoveryValue}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理时间">{{detail.handlingTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理人">{{detail.confirmerId}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理情况">{{detail.handlingCondition}}</oms-col>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <chart-line :detail="detail" :filter="filters" :isRecord="true" chartWidth="100%"/>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import ChartLine from '@/components/monitoring/temp-new/chart-line-new';
  import AlarmMixin from '@/mixins/alarmMixin';
  import AlarmEventMixin from '@/mixins/alarmEventMixin';

  const halfDay = 60 * 60 * 1000;
  export default {
    props: {
      index: Number,
      formItem: Object
    },
    components: {ChartLine},
    mixins: [AlarmMixin, AlarmEventMixin],
    data() {
      return {
        rowSpan: 8,
        loading: false,
        pageSets: [
          {name: '详细信息', key: 0},
          {name: '历史数据', key: 1}
        ],
        currentTab: {},
        tempList: [],
        detail: {},
        filters: {
          startTime: '',
          endTime: '',
          devId: '',
          devCode: '',
          valType: ['1']
        }
      };
    },
    mounted() {
      this.queryDetail();
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      queryDetail() {
        let id = this.$route.params.id;
        if (id === 'id') {
          id = window.localStorage.getItem('alarmId');
        }
        window.localStorage.setItem('alarmId', id);
        this.loading = true;
        this.$http.get(`/detail/${id}`).then(res => {
          this.detail = res.data;
          this.loading = false;
          this.$nextTick(() => {
            this.queryTempData();
          });
        });
      },
      getValType(warnTypes) {
        let ary = warnTypes.split(',');
        // 离线时间报警显示所有类型数据
        ary.length === 1 && ary[0] === '4' && (ary = ['1', '2', '3']);
        return ary;
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      queryTempData() {
        let {occurrenceTime, recoveryTime, sensorId} = this.formItem;
        this.filters = {
          startDate: new Date(occurrenceTime - halfDay),
          endDate: new Date(recoveryTime ? recoveryTime + halfDay : Date.now()),
          id: sensorId
        };
      }
    }
  };
</script>
