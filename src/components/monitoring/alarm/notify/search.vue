<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">告警通知查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="9">
            <oms-form-row :span="5" label="探头">
              <el-select :remote-method="queryProbeList" @focus="queryProbeList('')" filterable placeholder="请输入名称搜索探头" remote
                         v-model="searchCondition.sensorId" @change="search">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in probeList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="9" label="通知类型">
              <el-radio-group @change="search" size="small" v-model="searchCondition.type">
                <el-radio-button label="0">告警</el-radio-button>
                <el-radio-button label="1">恢复</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="9" label="通知方式">
              <el-radio-group @change="search" size="small" v-model="searchCondition.way">
                <el-radio-button label="0">短信</el-radio-button>
                <el-radio-button label="1">微信</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="9">
            <oms-form-row :span="5" label="发送状态">
              <el-radio-group @change="search" size="small" v-model="searchCondition.status">
                <el-radio-button label="1">成功</el-radio-button>
                <el-radio-button label="0">失败</el-radio-button>
                <el-radio-button label="2">发送中</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row :span="5" label="通知时间">
              <el-date-picker @change="search" :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                              type="datetimerange" v-model="times"/>
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
          notifyBegin: '',
          notifyEnd: '',
          type: '',
          way: '',
          status: ''
        },
        showSearch: false,
        list: [],
        times: []
      };
    },
    methods: {
      search() {
        const parent = this.$parent;
        this.searchCondition.notifyBegin = parent.formatTimeAry(this.times, 0);
        this.searchCondition.notifyEnd = parent.formatTimeAry(this.times, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          notifyBegin: '',
          notifyEnd: '',
          devName: '',
          type: '',
          way: '',
          status: ''
        };
        this.times = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
