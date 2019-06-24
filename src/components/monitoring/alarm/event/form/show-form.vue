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
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" :rowSpan="rowSpan" label="发生时间">{{detail.createTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="恢复时间">{{detail.restoreTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="告警类型"></oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="告警等级"></oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="探头"></oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="告警值"></oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="恢复值"></oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理时间">{{detail.confirmTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理人">{{detail.confirmerId}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="处理情况">{{detail.confirmContent}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="创建时间">{{detail.insertTime | time}}</oms-col>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {WarnRecord} from '@/resources';
  import utils from '@/tools/utils';
  import ChartLine from '@/components/monitoring/temp-new/chart-line-new';
  import AlarmMixin from '@/mixins/alarmMixin';
  import AlarmEventMixin from '@/mixins/alarmEventMixin';
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
          {name: '历史数据', key: 0}
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
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      formatKeepTime(detail) {
        let formatMsToTime = utils.formatMsToTime;
        return formatMsToTime((detail.restoreTime ? detail.restoreTime : Date.now()) - detail.createTime);
      },
      queryDetail() {
        // this.loading = true;
        // WarnRecord.get(this.formItem.id).then(res => {
        //   this.detail = res.data;
        //   this.loading = false;
        // });
      },
      getValType(warnTypes) {
        let ary = warnTypes.split(',');
        // 离线时间报警显示所有类型数据
        ary.length === 1 && ary[0] === '4' && (ary = ['1', '2', '3']);
        return ary;
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      }
    }
  };
</script>
