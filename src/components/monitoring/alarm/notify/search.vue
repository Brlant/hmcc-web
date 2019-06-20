<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">告警通知查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="6" label="设备">
              <el-select :remote-method="queryAllTemp" @change="search"
                         clearable filterable
                         placeholder="请输入名称搜索设备" popper-class="selects--custom" remote reserve-keyword
                         v-model="searchCondition.devId">
                <el-option :key="item.id" :label="item.devName" :value="item.id"
                           v-for="(item, index) in allTempList">
                  <dev-option-info :item="item"/>
                </el-option>
              </el-select>
              <!--<oms-input placeholder="请输入设备名称" v-model.trim="searchCondition.devName" @keyup.native.enter="search"/>-->
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="6" label="通知类型">
              <el-radio-group @change="search" size="small" v-model="searchCondition.notifyType">
                <el-radio-button label="1">短信</el-radio-button>
                <el-radio-button label="2">邮箱</el-radio-button>
                <el-radio-button label="3">微信</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="6" label="消息类型">
              <el-radio-group @change="search" size="small" v-model="searchCondition.recordType">
                <el-radio-button :label="0">告警</el-radio-button>
                <el-radio-button :label="1">恢复</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="6" label="发送状态">
              <el-radio-group @change="search" size="small" v-model="searchCondition.sendStatus">
                <el-radio-button label="1">成功</el-radio-button>
                <el-radio-button label="0">失败</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <oms-form-row :span="4" label="通知时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                              type="datetimerange" v-model="times"/>
            </oms-form-row>
          </el-col>
          <el-col :span="12"></el-col>
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
          devName: '',
          recordType: '',
          notifyType: '',
          sendStatus: '',
          devId: ''
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
          recordType: '',
          notifyType: '',
          sendStatus: ''
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
