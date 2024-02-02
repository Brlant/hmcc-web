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
          <oms-form-row label="巡检单位" :span="5">
            <org-select :list="orgList" :remoteMethod="queryAllOrg"
                        placeholder="请输入名称巡检单位" v-model="searchCondition.patrolOrgId" @change="search"></org-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row :span="9" label="状态">
            <el-radio-group @change="search" size="small" v-model="searchCondition.status">
              <el-radio-button :label="item.status" :key="item.key" v-for="item in statusType">{{item.title}}</el-radio-button>
            </el-radio-group>
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
    props: ['statusType'],
    data: function () {
      return {
        searchCondition: {
          no: null,
          name: null,
          type: null,
          status: null,
          patrolOrgId: ''
        },
        showSearch: false,
        list: [],
        times: [],
        orgList: []
      };
    },
    mounted() {
      let no = this.$route.query.no;
      if (!no) return;
      this.searchCondition.no = no;
      this.search();
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          no: null,
          name: null,
          type: null,
          status: null,
          patrolOrgId: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
