<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">货主热点监控查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="货主">
              <org-select :list="orgList" :remoteMethod="queryOrg"
                          placeholder="请输入名称搜索货主信息" v-model="searchCondition.monitorTargetId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="设备编码">
              <oms-input @keyup.native.enter="search" placeholder="请输入设备编码"
                         v-model.trim="searchCondition.devCode"></oms-input>
            </oms-form-row>
          </el-col>
          <!--<oms-form-row label="创建时间" :span="4">-->
          <!--<el-col :span="24">-->
          <!--<el-date-picker-->
          <!--v-model="times"-->
          <!--type="datetimerange"-->
          <!--placeholder="请选择">-->
          <!--</el-date-picker>-->
          <!--</el-col>-->
          <!--</oms-form-row>-->
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
          devCode: '',
          monitorTargetId: '',
          startTime: '',
          endTime: ''
        },
        showSearch: false,
        times: []
      };
    },
    mounted() {
      this.initSearchParams();
    },
    methods: {
      initSearchParams() {
        let query = this.$route.query;
        if (!query.code) return;
        this.searchCondition = {
          devCode: query.code,
          monitorTargetId: query.orgId
        };
        this.search();
        this.queryOrg({manufacturerCode: query.manufacturerCode});
      },
      search() {
        const parent = this.$parent;
        this.searchCondition.startTime = parent.formatTimeAry(this.times, 0);
        this.searchCondition.endTime = parent.formatTimeAry(this.times, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          devCode: '',
          monitorTargetId: '',
          startTime: '',
          endTime: ''
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
