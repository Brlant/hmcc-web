<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">告警规则查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="6">
            <oms-form-row :span="6" label="规则名称">
              <oms-input @keyup.native.enter="search" placeholder="请输入名称"
                         v-model.trim="searchCondition.ruleName"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="9" label="规则条件逻辑">
              <el-radio-group @change="search" size="small" v-model="searchCondition.logicType">
                <el-radio-button :key="item.key" :label="item.key" v-for="item in logicList">{{item.label}}
                </el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="4">
            <oms-form-row :span="6" label="级别">
              <el-radio-group @change="search" size="small" v-model="searchCondition.warnLevel">
                <el-radio-button :key="item.key" :label="item.key" v-for="item in levels">{{item.label}}
                </el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="8" label="延时通知时间">
              <oms-input @keyup.native.enter="search" placeholder="请输入延时通知时间"
                         v-model.number="searchCondition.warnKeepTime">
                <template slot="append">min</template>
              </oms-input>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  export default {
    data: function () {
      return {
        searchCondition: {
          ruleName: '',
          logicType: '',
          warnLevel: '',
          warnKeepTime: ''
        },
        showSearch: false,
        list: [],
        times: [],
        levels: this.$parent.levels,
        logicList: this.$parent.logicList
      };
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          ruleName: '',
          logicType: '',
          warnLevel: '',
          warnKeepTime: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
