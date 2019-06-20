<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">设备监控查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="6">
            <oms-form-row :span="5" label="编码">
              <oms-input @keyup.native.enter="search" placeholder="请输入名称"
                         v-model.trim="searchCondition.monitordevCode"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="5">
            <oms-form-row :span="8" label="类型">
              <!--<el-select filterable remote placeholder="请选择类型" :clearable="true"-->
              <!--v-model="searchCondition.monitordevType" @change="search">-->
              <!--<el-option :label="item.title" :value="item.id" :key="item.id" v-for="item in typeList"></el-option>-->
              <!--</el-select>-->
              <el-radio-group @change="search" size="small" v-model="searchCondition.monitordevType">
                <el-radio-button :key="item.id" :label="item.id" v-for="item in typeList">{{item.title}}
                </el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="5">
            <oms-form-row :span="8" label="监控状态">
              <el-radio-group @change="search" size="small" v-model="searchCondition.monitorFlag">
                <el-radio-button label="1">激活</el-radio-button>
                <el-radio-button label="0">未激活</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <!--<el-col :span="6">-->
          <!--<oms-form-row label="告警状态" :span="8">-->
          <!--<el-radio-group v-model="searchCondition.warnStatus" size="small" @change="search">-->
          <!--<el-radio-button label="0">正常</el-radio-button>-->
          <!--<el-radio-button label="1">告警</el-radio-button>-->
          <!--</el-radio-group>-->
          <!--</oms-form-row>-->
          <!--</el-col>-->
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
          monitordevCode: '',
          monitordevType: '',
          monitorFlag: '',
          warnStatus: ''
        },
        showSearch: false,
        typeList: this.$parent.typeList,
        list: [],
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
