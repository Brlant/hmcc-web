<style lang="scss" scoped>
.el-form::after {
  content: '';
  clear: both;
  display: table;
}
</style>
<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">维保单查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" ref="formSearch" onsubmit="return false">
        <el-col :span="8">
          <oms-form-row label="设备名称" :span="5">
            <el-input v-model="searchCondition.deviceName"   clearable placeholder="请输入设备名称"></el-input>
          </oms-form-row>
        </el-col>
        <el-col :span="8">
          <oms-form-row :span="5" label="维保时间">
            <el-date-picker v-model="equipmentTime" @change="handlerEquipmentTime" :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                            type="datetimerange" />
          </oms-form-row>
        </el-col>
      </el-form>
    </template>
  </search-template>
</template>

<script>
export default {
  name: "search",
  data(){
    return{
      showSearch: false,
      searchCondition:{
        deviceName:'',
        startDate:'',
        endDate:'',
      },
      equipmentTime:[],
    }
  },
  methods:{
    handlerEquipmentTime(){
      this.searchCondition.startDate = this.equipmentTime[0].getTime();
      this.searchCondition.endDate = this.equipmentTime[1].getTime();
    },
    search() {
      this.$emit('search', this.searchCondition);
    },
    reset() {
      this.searchCondition = {
          deviceName:'',
          startDate:'',
          endDate:'',
      };
      this.equipmentTime = [];
      this.$refs.formSearch.resetFields();
      this.$emit('search', this.searchCondition);
    },
    isShow(val) {
      this.showSearch = val;
    }
  }
}
</script>

<style scoped>

</style>
