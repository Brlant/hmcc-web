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
            <oms-form-row :span="5" label="单位">
              <org-select :list="orgList"
                          :remoteMethod="filterPOV" @change="orgChange"
                          placeholder="请输入名称搜索单位" v-model="searchCondition.orgId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="冷链设备">
              <el-select :remote-method="queryCoolListCondition" filterable placeholder="请输入名称搜索冷链设备" remote
                         v-model="searchCondition.monitorTargetId">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in coolList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="日期">
              <el-date-picker class="el-date-picker--mini" placeholder="请选择" type="month"
                              v-model="searchCondition.monthDate"/>
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
          orgName: '',
          orgId: '',
          freezerDevName: '',
          freezerDevId: '',
          freezerDevNo: '',
          monthDate: ''
        },
        showSearch: false,
        typeList: this.$parent.typeList,
        list: [],
        times: [],
        orgList: []
      };
    },
    mounted() {

    },
    computed: {
      coolDevType() {
        return this.$store.state.coolDevType;
      },
      type() {
        return this.$route.meta.type;
      }
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          orgName: '',
          orgId: '',
          freezerDevName: '',
          freezerDevId: '',
          freezerDevNo: '',
          monthDate: ''
        };
        this.$emit('search', this.searchCondition);
      },
      queryCoolListCondition() {
        if (!this.searchCondition.orgId) return;
        let params = {
          keyWord: query,
          orgId: this.searchCondition.orgId
        };
        this.queryCoolList(params);
      },
      orgChange() {
        this.searchCondition.freezerDevId = [];
        this.coolList = [];
      }
    }
  };
</script>
