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
        <el-col :span="8">
          <oms-form-row label="编号" :span="5">
            <oms-input placeholder="请输入编号" @keyup.native.enter="search"
                       v-model.trim="searchCondition.no"></oms-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="所属单位" :span="5">
            <org-select :list="orgList" :remoteMethod="queryAllOrg"
                        placeholder="请输入名称搜索单位" v-model="searchCondition.orgId" @change="search"></org-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="类型" :span="5">
            <oms-input placeholder="请输入型号" @keyup.native.enter="search"
                       v-model.trim="searchCondition.version"></oms-input>
          </oms-form-row>
        </el-col>
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
          no: null,
          devName: null,
          devType: null,
          version: null
        },
        showSearch: false,
        list: [],
        times: []
      };
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          no: null,
          devName: null,
          devType: null,
          version: null
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
