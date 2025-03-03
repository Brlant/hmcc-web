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
            <oms-col :isShow="true" :rowSpan="rowSpan" label="冷链标签">{{detail.sensorName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="触发条件">{{detail.alarmRuleInfo}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="告警值" v-show="detail.value">
              {{detail.value}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="恢复值" v-show="detail.recoveryValue">
              {{detail.recoveryValue}}
            </oms-col>

            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理时间" v-show="detail.handlingTime"
            >{{detail.handlingTime | time}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理人" v-show="detail.handlingUserName">
              {{detail.handlingUserName}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理情况" v-show="detail.handlingCondition">
              {{formatHandlingCondition(detail.handlingCondition)}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理备注" v-show="detail.handlingRemark">
              {{detail.handlingRemark}}
            </oms-col>
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
        },
        parent: this.$parent.$parent
      };
    },
    watch: {
      index(val) {
        if (val !== 0) return;
        this.queryDetail();
      }
    },
    computed: {
      handleTypeList() {
        return this.$store.state.handleTypeList;
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      formatHandlingCondition(val) {
        let item = this.handleTypeList.find(f => f.key === val);
        if (!item) return '';
        return item.label;
      },
      queryDetail() {
        this.detail = this.formItem;
        this.queryTempData();
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
