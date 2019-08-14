<template>
  <div>
    <div class="empty-info" v-if="!detail.id">暂无数据</div>
    <div v-else>
      <div class="form-header-part">
        <div class="header">
          <div class="sign f-dib"></div>
          <h3 class="tit f-dib index-tit">
            {{pageSets[0].name}}</h3>
        </div>
        <div class="content" style="overflow: hidden">
          <tn-ceil :rowSpan="rowSpan" label="发生时间">{{detail.occurrenceTime | time}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="恢复时间">{{detail.recoveryTime | time}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="告警类型">{{alarmTypeList[detail.type]}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="告警等级">{{alarmLevelList[detail.level]}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="所属单位">{{detail.orgName}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="冷链设备">{{detail.freezerDevName}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="探头">{{detail.sensorName}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="告警值" v-show="detail.value">{{detail.value}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="恢复值" v-show="detail.recoveryValue">{{detail.recoveryValue}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="处理时间" v-show="detail.handlingTime">{{detail.handlingTime | time}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="处理人" v-show="detail.handlingUserName">{{detail.handlingUserName}}</tn-ceil>
          <tn-ceil :rowSpan="rowSpan" label="处理情况" v-show="detail.handlingCondition">{{detail.handlingCondition}}</tn-ceil>
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
  </div>
</template>
<script>
  import ChartLine from '@/components/monitoring/temp-new/chart-line-new';
  import AlarmMixin from '@/mixins/alarmMixin';
  import AlarmEventMixin from '@/mixins/alarmEventMixin';
  import TnCeil from './tn-cell';

  const halfDay = 60 * 60 * 1000;
  export default {
    props: {
      index: Number,
      formItem: Object
    },
    components: {ChartLine, TnCeil},
    mixins: [AlarmMixin, AlarmEventMixin],
    data() {
      return {
        rowSpan: 8,
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
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
        this.$http.post(`/alarm-event/${id}`).then(res => {
          this.detail = res.data.data;
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
        let {occurrenceTime, recoveryTime, sensorId} = this.detail;
        this.filters = {
          startDate: new Date(occurrenceTime - halfDay),
          endDate: new Date(recoveryTime ? recoveryTime + halfDay : Date.now()),
          id: sensorId
        };
      }
    }
  };
</script>
