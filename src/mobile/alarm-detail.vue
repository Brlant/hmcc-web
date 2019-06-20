<style scoped>
  .form-header-part .header {
    line-height: 24px;
    height: 24px;
  }

  .empty-info.mini {
    margin-top: 100px;
  }
  .index-tit {
    font-size: 20px;
  }
  .tn-cell {
    font-size: 16px;
  }
</style>
<template>
  <div>
    <div v-if="!detail.id" class="empty-info mini">暂无数据</div>
    <div v-else>
      <div class="form-header-part">
        <div class="header">
          <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
            {{pageSets[0].name}}</h3>
        </div>
        <div class="content" style="overflow: hidden">
          <tn-ceil label="发生时间" :span="rowSpan">{{detail.createTime | time}}</tn-ceil>
          <tn-ceil label="恢复时间" :span="rowSpan">{{detail.restoreTime | time}}</tn-ceil>
          <tn-ceil label="持续时间" :span="rowSpan">
            {{formatKeepTime(detail)}}
          </tn-ceil>
          <tn-ceil label="异常类型" :span="rowSpan">
            <el-tooltip :key="icon" v-for="icon in detail.warnTypes && detail.warnTypes.split(',') || []"
                        class="item" effect="dark"
                        :content="iconClass[icon].title + (detail.warnLevel === '0' ? '告警，级别:低' : '告警，级别:高')"
                        placement="top">
              <f-a :class="detail.warnLevel === '0' ? 'icon-warning' :'icon-danger'"
                   :name="iconClass[icon].icon"></f-a>
            </el-tooltip>
          </tn-ceil>
          <tn-ceil label="监控对象" :span="rowSpan">
            <span>{{formatTitle(detail)}}</span>
          </tn-ceil>
          <tn-ceil label="设备名称" :span="rowSpan">
            <el-tooltip effect="dark" :content="tempTypeList[detail.devType]" placement="top">
              <f-a class="icon-danger ver-a-mid" :name="DevIcon[detail.devType][1]"></f-a>
            </el-tooltip>
            <span>{{detail.devName}}</span>
          </tn-ceil>
          <tn-ceil label="设备编号/编码" :span="rowSpan">{{detail.devNo}}/{{detail.devCode}}</tn-ceil>
          <tn-ceil label="创建时间" :span="rowSpan">{{detail.insertTime | time}}</tn-ceil>
          <tn-ceil label="告警规则" :span="rowSpan">{{detail.warnHisInfo}}</tn-ceil>
          <tn-ceil label="触发信息" :span="rowSpan">{{detail.triggerInfo}}</tn-ceil>
          <tn-ceil label="状态" :span="rowSpan">{{detail.confirmStatus === '1' ? '已确认' : '未确认'}}</tn-ceil>
          <tn-ceil label="处理时间" :span="rowSpan" v-show="detail.confirmTime">{{detail.confirmTime | time}}</tn-ceil>
          <tn-ceil label="处理人" :span="rowSpan" v-show="detail.confirmerId">{{detail.confirmerId}}</tn-ceil>
          <tn-ceil label="情况说明" :span="rowSpan" v-show="detail.confirmContent">{{detail.confirmContent}}</tn-ceil>
        </div>
      </div>
      <div class="form-header-part">
        <div class="header">
          <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
            {{pageSets[1].name}}</h3>
        </div>
        <div class="content">
          <chart-line :filters="filters" :isRecord="true" :detail="detail" chartWidth="100%"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {WarnRecord} from './resources';
  import utils from '@/tools/utils';
  import ChartLine from './chart-line-new';
  import AlarmMixin from '@/mixins/alarmMixin';
  import AlarmEventMixin from '@/mixins/alarmEventMixin';
  import TnCeil from './tn-cell';

  const {DevIcon} = utils;
  const halfDay = 60 * 60 * 1000;
  export default {
    components: {ChartLine, TnCeil},
    mixins: [AlarmMixin, AlarmEventMixin],
    data() {
      return {
        rowSpan: 8,
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
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
        DevIcon
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
      formatKeepTime(detail) {
        let formatMsToTime = utils.formatMsToTime;
        return formatMsToTime((detail.restoreTime ? detail.restoreTime : Date.now()) - detail.createTime);
      },
      queryDetail() {
        let id = this.$route.params.id;
        if (id === 'id') {
          id = window.localStorage.getItem('alarmId');
        }
        window.localStorage.setItem('alarmId', id);
        this.loading = true;
        WarnRecord.get(id).then(res => {
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
        let {formatTime, getValType} = this;
        let {createTime, restoreTime, devCode, ccsDevId, warnTypes} = this.detail;
        this.filters = {
          startTime: formatTime(createTime - halfDay),
          endTime: formatTime(restoreTime ? restoreTime + halfDay : Date.now()),
          devId: ccsDevId,
          devCode: devCode,
          valType: getValType(warnTypes)
        };
      }
    }
  };
</script>
