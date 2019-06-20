<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" :midSpan="0" :titleSpan="16" @isShow="isShow"
                   @reset="reset" @search="search">
    <template slot="title">
      <span v-if="typeof devTitle === 'string'">{{devTitle}}</span>
      <span v-else>
        <span class="mr-10">{{devTitle.devName}}</span>
        <span class="mr-10">设备编号:{{devTitle.devNo}}</span>
        <span class="mr-10">编码: {{devTitle.devCode}}</span>
        <span class="mr-10">类型:{{tempTypeList[devTitle.devType]}}</span>
      </span>
    </template>
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
          <el-col :span="8">
            <oms-form-row :span="5" label="设备">
              <el-select :remote-method="queryAllTemp" @change="devChange"
                         clearable filterable
                         placeholder="请输入名称搜索设备" popper-class="selects--custom" remote reserve-keyword
                         v-model="searchCondition.devCode">
                <el-option :key="item.id" :label="item.devName" :value="item.devCode"
                           v-for="(item, index) in allTempList">
                  <dev-option-info :item="item"/>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :required="true" :span="7" label="时间间隔">
              <el-input placeholder="请输入时间间隔" type="number" v-model.number="searchCondition.startPrice">
                <template slot="append">分钟</template>
              </el-input>
            </oms-form-row>
          </el-col>
          <!--<el-col :span="7">-->
          <!--<oms-form-row label="数据类型" :span="8">-->
          <!--<el-checkbox-group v-model="searchCondition.valType" size="small" @change="search">-->
          <!--<el-checkbox-button label="1">温度</el-checkbox-button>-->
          <!--<el-checkbox-button label="2">湿度</el-checkbox-button>-->
          <!--<el-checkbox-button label="3">电压</el-checkbox-button>-->
          <!--</el-checkbox-group>-->
          <!--</oms-form-row>-->
          <!--</el-col>-->
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import {TempDev} from '@/resources';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          startTime: '',
          endTime: '',
          devCode: '',
          valType: ['1'],
          startPrice: ''
        },
        showSearch: false,
        times1: [],
        tempType: {
          1: '温度'
        }
      };
    },
    computed: {
      devTitle() {
        if (!this.searchCondition.devCode) return '交接数据';
        let dev = this.allTempList.filter(f => f.id === this.searchCondition.devCode)[0];
        if (!dev) return '交接数据';
        return dev;
      }
    },
    mounted() {
      this.times1 = [this.$moment(this.$moment().format('YYYY-MM-DD')), this.$moment()];
      let {id, type} = this.$route.query;
      if (!id) return;
      this.allTempList = [];
      TempDev.get(id).then(res => {
        let {devName, devCode, devType, id, devNo} = res.data;
        this.allTempList.push({devName, devCode, devType, id, devNo});
        this.$nextTick(() => {
          this.searchCondition.devNo = devNo;
          this.searchCondition.valType = [type];
          this.search();
        });
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
        let dev = this.allTempList.filter(f => f.devCode === this.searchCondition.devCode)[0];
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
          devCode: '',
          valType: ['1']
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
        if (!this.searchCondition.devCode) return;
        this.search();
      }
    }
  };
</script>
