<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">通知列表查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="4" label="名称">
              <oms-input @keyup.native.enter="search" placeholder="请输入名称"
                         v-model.trim="searchCondition.name"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="10">
            <oms-form-row label="所属单位" :span="4">
              <org-select :list="orgList" :remoteMethod="queryAllOrg"
                          placeholder="请输入名称搜索单位" v-model="searchCondition.orgId" @change="search"></org-select>
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
          name: '',
          orgId: ''
        },
        showSearch: false
      };
    },
    methods: {
      search() {
        const parent = this.$parent;
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          name: '',
          orgId: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
