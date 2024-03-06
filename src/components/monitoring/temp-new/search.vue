<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" :midSpan="0" :titleSpan="6" @isShow="isShow"
                   @reset="reset" @search="search">
    <template slot="title">{{$route.meta.title}}</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="12">
            <oms-form-row :required="true" :span="4" label="采集时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" :clearable="false" @change="search"
                              placeholder="请选择"
                              type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
          <el-col :span="12">
            <oms-form-row :span="5" label="设备">
              <el-select :remote-method="queryCoolList" @focus="queryCoolList()" filterable placeholder="请输入名称搜索冷链设备" remote
                         v-model="searchCondition.freezerDevId" @change="search" popper-class="selects--custom">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in coolList">
                  {{item.name}}
                  <div class="select-other-info">
                    编号：{{item.no}}
                  </div>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <oms-form-row :span="4" label="时间间隔">
              <el-input v-model.number="searchCondition.statPiece" oninput="value = value.replace(/[^1-9]/g,'')" :min="1" :maxlength="9">
                <span slot="append">分钟</span>
              </el-input>
            </oms-form-row>
          </el-col>
          <el-col :span="12">
            <oms-form-row :span="5" label="数据类型">
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
          statPiece: ''
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
        this.setSearchCondition();
        this.$emit('search', this.searchCondition);
      },
      setSearchCondition() {
        this.searchCondition.startTime = this.formatTimeAry(this.times1, 0);
        this.searchCondition.endTime = this.formatTimeAry(this.times1, 1);
      },
      reset() {
        this.searchCondition = {
          startTime: '',
          endTime: '',
          freezerDevId: '',
          type: '1',
          statPiece: ''
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
