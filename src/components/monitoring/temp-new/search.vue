<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" :midSpan="0" :titleSpan="16" @isShow="isShow"
                   @reset="reset" @search="search">
    <template slot="title">{{$route.meta.title}}</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="9">
            <oms-form-row :required="true" :span="5" label="上报时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" :clearable="false" @change="search"
                              placeholder="请选择"
                              type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
          <el-col :span="9">
            <oms-form-row :span="4" label="设备">
              <el-select :remote-method="queryCoolList" filterable placeholder="请输入名称搜索冷链设备" remote
                         v-model="searchCondition.freezerDevId" @change="search">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in coolList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="6" label="数据类型">
              <el-radio-group @change="search" size="small" v-model="searchCondition.type">
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
          freezerDevId: '',
          type: '1',
        },
        showSearch: false,
        doing: false,
        times1: []
      };
    },
    mounted() {
      this.times1 = [this.$moment(this.$moment().format('YYYY-MM-DD')), this.$moment()];
      let {freezerDevId, freezerDevName} = this.$route.query;
      if (freezerDevId) {
        this.coolList = [
          {
            id: freezerDevId,
            name: freezerDevName
          }
        ];
        this.searchCondition.freezerDevId = freezerDevId;
        this.search();
      }
    },
    methods: {
      search() {
        this.searchCondition.startTime = this.formatTimeAry(this.times1, 0);
        this.searchCondition.endTime = this.formatTimeAry(this.times1, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          startTime: '',
          endTime: '',
          freezerDevId: '',
          type: '1',
        };
        this.times1 = [this.$moment(this.$moment().format('YYYY-MM-DD')), this.$moment()];
        this.search();
      },
      isShow(val) {
        this.showSearch = val;
      },
      formatTimeAry(times, index) {
        if (!times) return;
        return times[index];
      },
    }
  };
</script>
