<style lang="scss" scoped>
  .el-form::after {
    content: '';
    clear: both;
    display: table;
  }
</style>
<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">冷链设备查询</template>
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
            <el-select placeholder="请选择类型" v-model="searchCondition.type" clearable popper-class="selects--custom">
              <el-option :key="item.key" :label="item.label" :value="item.key"
                         v-for="(item, index) in coolDevType">
              </el-option>
            </el-select>
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
          type: null,
          orgId: ''
        },
        showSearch: false,
        list: [],
        times: []
      };
    },
    computed: {
      coolDevType() {
        return this.$getDict('coolDevType')
      }
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          text: '',              //设备编号和名称
          tagSnNumber: '',       //标签编号
          devType: "",          //设备分类
          departmentId: '',     //所属科室id
          status: "",           //设备状态   在线:ONLINE  不在线:OFFLINE  异常:ALARM
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
