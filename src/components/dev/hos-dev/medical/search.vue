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
        <el-row>
          <el-col :span="7">
            <oms-form-row label="设备编号/名称" :span="7">
              <el-input
                v-model.trim="searchCondition.text"
                placeholder="请输入设备编号/名称"
                clearable>
              </el-input>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row label="定位标签" :span="7">
              <el-input
                v-model.trim="searchCondition.tagSnNumber"
                placeholder="请输入定位标签"
                clearable>
              </el-input>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row label="能耗标签" :span="7">
              <el-input
                v-model.trim="searchCondition.energyTagSnNumber"
                placeholder="请输入能耗标签"
                clearable>
              </el-input>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <oms-form-row label="设备分类" :span="7">
              <el-select v-model="searchCondition.devType" placeholder="请选择设备分类" clearable>
                <el-option
                  v-for="(item,index) in deviceTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row label="所属科室" :span="7">
              <el-select v-model="searchCondition.departmentId" placeholder="请选择设备所属科室" clearable>
                <el-option
                  v-for="(item,index) in deviceDeptList"
                  :key="index"
                  :value="item.id"
                  :label="item.departmentName"
                />
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row label="运行状态" :span="7">
              <el-select placeholder="请选择设备运行状态" v-model="searchCondition.status" clearable>
                <el-option
                  v-for="(item,index) in deviceStatusList"
                  :key="index"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </oms-form-row>
          </el-col>
        </el-row>
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
        // 设备编号和名称
        text: '',
        // 定位标签
        tagSnNumber: '',
        // 能耗标签
        energyTagSnNumber: '',
        // 设备分类
        devType: "",
        // 所属科室id
        departmentId: '',
        // 设备状态
        status: "",
      },
      showSearch: false,
      list: [],
      times: [],
      //所属科室
      deviceDeptList: [],
    };
  },
  computed: {
    coolDevType() {
      return this.$getDict('coolDevType')
    },
    deviceTypeList() {
      return this.$getDict('device_type')
    },
    deviceStatusList() {
      return this.$getDict('device_status')
    }
  },
  mounted() {
    this.queryDeptList();
  },
  methods: {
    search() {
      this.$emit('search', this.searchCondition);
    },
    reset() {
      this.searchCondition = {
        // 设备编号和名称
        text: '',
        // 定位标签
        tagSnNumber: '',
        // 能耗标签
        energyTagSnNumber: '',
        // 设备分类
        devType: "",
        // 所属科室id
        departmentId: '',
        // 设备状态
        status: "",
      };
      this.$emit('search', this.searchCondition);
    },
    isShow(val) {
      this.showSearch = val;
    },
    //所属科室
    queryDeptList() {
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
