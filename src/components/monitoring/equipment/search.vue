<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">{{$route.meta.title}}</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="编码">
              <oms-input @keyup.native.enter="search" placeholder="请输入名称"
                         v-model.trim="searchCondition.monitordevCode"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="8" label="类型">
              <el-radio-group @change="search" size="small" v-model="searchCondition.monitordevType">
                <el-radio-button :key="item.key" :label="item.key" v-for="item in coolDevType">{{item.label}}
                </el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="8" label="监控状态">
              <el-radio-group @change="search" size="small" v-model="searchCondition.monitorFlag">
                <el-radio-button label="1">正常</el-radio-button>
                <el-radio-button label="0">告警</el-radio-button>
                <el-radio-button label="2">未监控</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row v-show="type === 2">
          <el-col :span="8">
            <oms-form-row :span="5" label="单位">
              <org-select :list="orgList"
                          :remoteMethod="filterPOV"
                          placeholder="请输入名称搜索单位" v-model="searchCondition.orgId"></org-select>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import {BaseInfo} from '@/resources';
  export default {
    data: function () {
      return {
        searchCondition: {
          monitordevCode: '',
          monitordevType: '',
          monitorFlag: '',
          warnStatus: ''
        },
        showSearch: false,
        typeList: this.$parent.typeList,
        list: [],
        times: [],
        orgList: []
      };
    },
    mounted() {
      this.initSearchParams();
    },
    computed: {
      coolDevType() {
        return this.$getDict('coolDevType')
      },
      type () {
        return this.$route.meta.type
      }
    },
    methods: {
      filterPOV: function (query) {// 过滤POV
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '0'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      initSearchParams() {
        let query = this.$route.query;
        if (!query.code) return;
        this.searchCondition.monitordevCode = query.code;
        this.search();
      },
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          monitordevCode: '',
          monitordevType: '',
          monitorFlag: '',
          warnStatus: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
