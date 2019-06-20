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
                         v-model.trim="searchCondition.notifyListName"></oms-input>
            </oms-form-row>
          </el-col>
          <!--<el-col :span="10">-->
          <!--<oms-form-row label="创建时间" :span="4">-->
          <!--<el-col :span="24">-->
          <!--<el-date-picker-->
          <!--v-model="times"-->
          <!--type="datetimerange"-->
          <!--placeholder="请选择">-->
          <!--</el-date-picker>-->
          <!--</el-col>-->
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
          notifyListName: '',
          startTime: '',
          endTime: ''
        },
        showSearch: false,
        list: [],
        times: []
      };
    },
    methods: {
      search() {
        const parent = this.$parent;
        this.searchCondition.startTime = parent.formatTimeAry(this.times, 0);
        this.searchCondition.endTime = parent.formatTimeAry(this.times, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          notifyListName: '',
          startTime: '',
          endTime: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
