<style lang="scss" scoped>
  .el-form::after {
    content: '';
    clear: both;
    display: table;
  }
</style>
<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row label="冷链标签" :span="4">
              <el-select :remote-method="queryProbeList" filterable placeholder="请输入名称搜索冷链标签" remote
                         v-model="searchCondition.sensorId">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in probeList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row label="所属单位" :span="4">
              <org-select :list="orgList" :remoteMethod="queryAllOrg"
                          placeholder="请输入名称搜索单位" v-model="searchCondition.orgId"></org-select>
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
          sensorId: '',
          orgId:'',//所属单位
        },
        showSearch: false,
        list: [],
        times: [],
        orgList: []
      };
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          sensorId: '',
          orgId:'',
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
