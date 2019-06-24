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
          <oms-form-row label="操作人" :span="4">
            <el-select placeholder="请输入名称搜索操作人" v-model="searchCondition.operationUserId"
                       filterable clearable remote :remote-method="queryUserList"
                       @click.native.once="queryUserList('')">
              <el-option :label="item.name" :value="item.id" :key="item.id"
                         v-for="item in userList"></el-option>
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row label="测试类型" :span="8">
            <el-radio-group v-model="searchCondition.type" size="small">
              <el-radio-button :label="item.key" :key="item.key" v-for="item in alarmTestList">{{item.label}}
              </el-radio-button>
            </el-radio-group>
          </oms-form-row>
        </el-col>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import {OrgUser} from '@/resources';

  export default {
    data: function () {
      return {
        searchCondition: {
          operationUserId: '',
          type: ''
        },
        showSearch: false,
        alarmTestList: [
          {key: 0, label: '短信报警'},
          {key: 1, label: '微信报警'}
        ],
        userList: []
      };
    },
    mounted() {
      let no = this.$route.query.no;
      if (!no) return;
      this.searchCondition.no = no;
      this.search();
    },
    methods: {
      queryUserList(query) {
        let params = {keyWord: query};
        let orgId = this.$store.state.user.userCompanyAddress;
        OrgUser.queryOrgInfo(orgId, params).then(res => {
          this.userList = res.data.list;
        });
      },
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          operationUserId: '',
          type: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
