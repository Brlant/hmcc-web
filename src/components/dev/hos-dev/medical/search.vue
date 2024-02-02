<style lang="scss" scoped>
.el-form::after {
  content: '';
  clear: both;
  display: table;
}
</style>
<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">医疗设备查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-col :span="6">
          <oms-form-row label="设备编号/名称" :span="5">
            <el-input
              v-model.trim="searchCondition.text"
              placeholder="设备编号/名称"
              clearable>
            </el-input>
          </oms-form-row>
        </el-col>
        <el-col :span="6">
          <oms-form-row label="定位标签" :span="5">
            <el-input
              v-model.trim="searchCondition.tagSnNumber"
              placeholder="定位标签"
              clearable>
            </el-input>
          </oms-form-row>
        </el-col>
        <el-col :span="6">
          <oms-form-row label="能耗标签" :span="5">
            <el-input
              v-model.trim="searchCondition.energyTagSnNumber"
              placeholder="请选择能耗标签"
              clearable>
            </el-input>
          </oms-form-row>
        </el-col>
        <el-col :span="6">
          <oms-form-row label="设备分类" :span="5">
            <el-select v-model="searchCondition.devType" placeholder="设备分类" clearable>
              <el-option
                v-for="(item,index) in deviceTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="6">
          <oms-form-row label="所属科室" :span="5">
            <el-select v-model="searchCondition.departmentId" placeholder="所属科室" clearable>
              <el-option
                v-for="(item,index) in deviceDeptList"
                :key="index"
                :value="item.id"
                :label="item.departmentName"
              />
            </el-select>
          </oms-form-row>
        </el-col>
        <el-col :span="6">
          <oms-form-row label="设备状态" :span="5">
            <el-select placeholder="设备状态" v-model="searchCondition.status" clearable>
              <el-option
                v-for="(item,index) in deviceStatusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </oms-form-row>
        </el-col>
      </el-form>
    </template>
  </search-template>
</template>
<script>
import methodsMixin from '@/mixins/methodsMixin';
import queryApi from '@/api/query/query'

export default {
  mixins: [methodsMixin],
  data: function () {
    return {
      searchCondition: {
        text: '',              //设备编号和名称
        tagSnNumber: '',       //标签编号
        devType: "",          //设备分类
        departmentId: '',     //所属科室id
        status: "",           //设备状态   在线:ONLINE  不在线:OFFLINE  异常:ALARM
      },
      showSearch: false,
      list: [],
      times: [],
      deviceTypeList: [],
      //所属科室
      deviceDeptList: [],
    };
  },
  computed: {
    coolDevType() {
      return this.$getDict('coolDevType')
    },
    deviceStatus() {
      return this.$getDict('device_status')
    },
    deviceStatusList() {
      return this.$getDict('device_status')
    }
  },
  mounted() {
    //科室
    this.queryDepartmentList();
    //设备状态
    this.getDeviceStatusList();
  },
  methods: {
    search() {
      this.$emit('search', this.searchCondition);
    },
    reset() {
      this.searchCondition = {
        no: null,
        devName: null,
        devType: null,
        type: null,
        orgId: ''
      };
      this.$emit('search', this.searchCondition);
    },
    isShow(val) {
      this.showSearch = val;
    },
    //所属科室
    queryDepartmentList() {
      queryApi.queryDepartment({}).then(res => {
        this.departmentId = []
        this.deviceDeptList = res.data.map(item => {
          return {
            departmentName: item.departmentName,
            departmentPosition: item.departmentPosition,
            id: item.id,
            departmentId: item.id
          }
        })
      })
    },
  }
};
</script>
