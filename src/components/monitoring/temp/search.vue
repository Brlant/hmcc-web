<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">历史数据</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="10">
            <oms-form-row :required="true" :span="5" label="上报时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="timeChange" placeholder="请选择"
                              type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="6" label="设备">
              <el-select :remote-method="queryAllTemp"
                         @change="devChange" @click.once.native="queryAllTemp('')" filterable
                         placeholder="请选择设备" popper-class="selects--custom" remote reserve-keyword
                         v-model="searchCondition.devId">
                <el-option :key="item.id" :label="item.devName" :value="item.id"
                           v-for="item in allTempList">
                  <dev-option-info :item="item"/>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="8" label="数据类型">
              <el-radio-group @change="search" size="small" v-model="searchCondition.valType">
                <el-radio-button label="1">温度</el-radio-button>
                <el-radio-button label="2">湿度</el-radio-button>
                <el-radio-button label="3">电压</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          startTime: '',
          endTime: '',
          devId: '',
          devCode: '',
          valType: '1'
        },
        showSearch: false,
        times1: [],
        tempType: {
          1: '温度',
          2: '湿度',
          3: '电压'
        }
      };
    },
    mounted() {
      this.times1 = [this.$moment(this.$moment().format('YYYY-MM-DD')), this.$moment()];
      let {devCode, type, id} = this.$route.query;
      if (!devCode) return;
      this.allTempList = [];
      this.allTempList.push({id, devCode});
      this.$nextTick(() => {
        this.searchCondition.devId = id;
        this.searchCondition.devCode = devCode;
        this.searchCondition.valType = type;
        this.search();
      });
    },
    methods: {
      search() {
        this.searchCondition.startTime = this.formatTimeAry(this.times1, 0);
        this.searchCondition.endTime = this.formatTimeAry(this.times1, 1);
        // if (!this.searchCondition.startTime) {
        //   this.$notify.info({
        //     message: '请选择上报时间'
        //   });
        //   return;
        // }
        let dev = this.allTempList.filter(f => f.id === this.searchCondition.devId)[0];
        if (!dev) {
          this.$notify.info({
            message: '请选择设备'
          });
          return;
        }
        this.searchCondition.devCode = dev && dev.devCode || '';
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          startTime: '',
          endTime: '',
          devId: '',
          devCode: '',
          valType: '1'
        };
        this.times1 = [];
        this.$emit('search', this.searchCondition, true);
      },
      isShow(val) {
        this.showSearch = val;
      },
      formatTimeAry(times, index) {
        if (!times) return;
        return this.formatTime(times[index]);
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      devChange(val) {
        if (!val) return;
        if (!this.times1) return;
        this.search();
      },
      timeChange(val) {
        if (!val) return;
        if (!this.searchCondition.devId) return;
        this.search();
      }
    }
  };
</script>
