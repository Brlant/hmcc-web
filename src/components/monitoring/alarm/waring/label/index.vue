<template>
  <div class="order-page">
    <search-part @search="searchResult" :deviceExceptionList="deviceExceptionList" :deviceTypeList="deviceTypeList"></search-part>
    <div class="order-list" style="margin-top: 20px">
      <!--标签告警列表-->
      <el-table v-loading="loadingData" :data="dataList" header-row-class-name="order-list-header" header-cell-class-name="order-list-header">
        <el-table-column label="序号" align="center" type="index"/>
        <el-table-column label="设备编号" prop="devNo" align="center"></el-table-column>
        <el-table-column label="设备名称" prop="devName" align="center"></el-table-column>
        <el-table-column label="设备类型" prop="devType" align="center">
          <template v-slot="{row}">
            <div v-for="(item,index) in deviceTypeList" :key="index">
              <span v-if="Number(row.devType)===item.value">{{ item.label }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属科室" prop="departmentName" align="center"></el-table-column>
        <el-table-column label="标签sn码" prop="tagSnNumber" align="center"></el-table-column>
        <el-table-column label="异常类型" prop="alarmStatus" align="center">
          <template v-slot="{row}">
            <div v-for="(item,index) in deviceExceptionList" :key="index">
              <span v-if="row.alarmStatus==item.value">{{ item.label }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后定位时间" prop="lastPositionTime" align="center"></el-table-column>
        <el-table-column label="最后位置" prop="lastPositionStr" align="center"></el-table-column>
        <el-table-column label="告警发生时间" prop="alarmTime" align="center"></el-table-column>
        <el-table-column label="操作" prop="" align="center">
          <template v-slot="{row}">
            <el-button type="primary" size="mini" icon="el-icon-location-outline" circle
                       @click="devicesPosition(row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import {waringApi} from '@/resources'
import CommonMixin from '@/mixins/commonMixin';
import SearchPart from './search';
import {sinopharmDictDataType} from '@/api/system/dict/data'

export default {
  name: 'WaringLabel',
  mixins: [CommonMixin],
  components: {
    SearchPart
  },
  data() {
    return {
      // 设备类型
      deviceTypeList: [],
      // 异常类型
      deviceExceptionList: [],
      // 异常告警列表
      dataList: [],
      // 过滤条件
      filters: {
        status: "",              //异常状态  1不在线 2异常
        departmentId: '',          //科室id
        devType: "",             //设备类型
        floorId: '',               //楼层id
        selectText: "",         //设备名称/编号/sn号查询
      },
    }
  },
  watch: {
    filters: {
      handler: function () {
        this.queryList(1);
      },
      deep: true
    }
  },
  created() {
    //获取异常警告查询
    this.queryList(1);
    //设备类型
    this.getDeviceTypeList();
    //异常类型
    this.getDeviceStatusList();
  },
  methods: {
    searchResult(search) {
      this.filters = Object.assign({}, this.filters, search);
    },
    /* 定位 */
    devicesPosition(row) {
      this.$router.push({
        path: 'deviceposition/position',
        params: {...row}
      });
    },
    //异常类型
    getDeviceStatusList() {
      sinopharmDictDataType('alarm_status').then(res => {
        this.deviceExceptionList = res.data.map(item => {
          return {
            label: item.label,
            value: item.key
          }
        })
      }).catch(err => {

      })
    },
    //设备类型
    getDeviceTypeList() {
      sinopharmDictDataType('device_type').then(res => {
        this.deviceTypeList = res.data.map(item => {
          return {
            label: item.label,
            value: item.key
          }
        })
      }).catch(err => {

      })
    },

    reset() {
      this.queryParams = {
        status: "",              //异常状态  1不在线 2异常
        departmentId: '',          //科室id
        devType: "",             //设备类型
        floorId: '',               //楼层id
        selectText: "",         //设备名称/编号/sn号查询
        //分页
        total: 0,
        pageNum: 1,
        pageSize: 10,
      }
      this.$refs.queryForm.resetFields();
      this.queryList(1);
    },
    /* 获取异常告警列表 */
    queryList(pageNo) {
      const http = waringApi.getWarningList;
      this.queryUtil(http, pageNo);
    }
  }
}
</script>

<style scoped>

</style>
