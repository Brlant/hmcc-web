<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="permPage.addCool">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>

    <status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType"/>

    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="1">序号</el-col>
        <el-col :span="3">设备名称</el-col>
        <el-col :span="2">设备编号</el-col>
        <el-col :span="3">所属科室</el-col>
        <el-col :span="2">设备分类</el-col>
        <el-col :span="2">定位标签</el-col>
        <el-col :span="2">能耗标签</el-col>
        <el-col :span="3">启用时间</el-col>
        <el-col :span="2">运行状态</el-col>
        <el-col :span="2">设备状态</el-col>
        <el-col :span="2">操作</el-col>
      </el-row>
      <el-row v-if="loading">
        <el-col :span="24">
          <oms-loading :loading="loading"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="!dataList.length">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else>
        <div :class="[{'active':currentItemId===item.id}]"
             @click="showItemDetail(item)" class="order-list-item order-list-item-bg"
             v-for="(item,index) in dataList">
          <el-row>
            <el-col :span="1" class="R">
              {{ index + 1 }}
            </el-col>
            <el-col :span="3" class="R">
              {{ item.name }}
            </el-col>
            <el-col :span="2" class="R">{{ item.no }}</el-col>
            <el-col :span="3" class="R">{{ item.departmentName }}</el-col>
            <el-col :span="2" class="R">
              {{ formatDictLabel(item.type, coolDevType) }}
            </el-col>
            <el-col :span="2" class="R">{{ item.tagSnNumber }}</el-col>
            <el-col :span="2" class="R">{{ item.energyTagSnNumber }}</el-col>

            <el-col :span="3">{{ item.startUsingTime | date }}</el-col>
            <el-col :span="2">
              <span v-if="item.deviceStatus === 'ONLINE'" style="color: green">开机</span>
              <span v-if="item.deviceStatus === 'OFFLINE'" style="color: grey">关机</span>
              <span v-if="item.deviceStatus === 'ALARM'" style="color: red">异常</span>
              <span v-if="item.deviceStatus === 'FAILURE'" style="color: yellow">故障</span>
            </el-col>
            <el-col :span="2">
              {{ formatStatus(item.status, statusType) }}
            </el-col>
            <el-col :span="2" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="permPage.editCool">编辑</des-btn>
            </el-col>
          </el-row>
          <!--<div class="order-list-item-bg"></div>-->
        </div>
      </div>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loading">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :statusType="statusType" :index="showIndex" :is="currentPart" @change="change"
                 @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>

<script>

import utils from '@/tools/utils';
import {coolApi} from '@/resources';
import SearchPart from './search';
import addForm from './form/add-form.vue';
import showForm from './form/show-form.vue';
import CommonMixin from '@/mixins/commonMixin';
import queryApi from '@/api/query/query'

export default {
  // 冷链设备管理
  name: 'CoolDev',
  components: {
    SearchPart
  },
  mixins: [CommonMixin],
  data() {
    return {
      loading: false,
      statusType: JSON.parse(JSON.stringify(utils.coolType)),
      filters: {
        // 设备编号和名称
        keyWord: '',
        // 定位标签
        tagSnNumber: '',
        // 能耗标签
        energyTagSnNumber: '',
        // 设备分类
        type: "",
        // 所属科室id
        departmentId: '',
        // 设备状态
        status: "1",
        deviceStatus: "",
      },
      dialogComponents: {
        0: addForm,
        1: showForm
      },
      defaultPageRight: {'width': '1500px', 'padding': 0},
      // 所属科室
      deviceDeptList: [],
    }
  },
  computed: {
    coolDevType() {
      return this.$getDict('coolDevType')
    },
    deviceStatus() {
      return this.$getDict('device_status')
    },
    alarmStatus() {
      return this.$getDict('alarm_status')
    },
  },
  watch: {
    filters: {
      handler(val) {
        this.queryList(1);
      },
      deep: true
    }
  },
  mounted() {
    //科室
    this.queryDepartmentList();
    //查询列表
    this.queryList(1);
  },
  methods: {
    searchResult(search) {
      this.filters = Object.assign({}, this.filters, search);
    },
    checkStatus(item, key) {
      this.filters.status = item.status;
      this.activeStatus = key;
    },
    resetRightBox() {
      this.defaultPageRight.width = '1500px';
      this.showIndex = -1;
    },
    showPart(index) {
      this.currentPart = this.dialogComponents[index];
      this.$nextTick(() => {
        this.showIndex = index;
      });
    },
    /* 定位 */
    devicesPosition(row) {
      this.$router.push({
        name: 'position',
        params: {...row}
      });
    },
    /* 删除设备 */
    remove(row) {
      this.$confirm('确定删除该设备吗？删除后设备将无法回复，标签将释放', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认删除'
      }).then(() => {
        coolApi.filesDeleteList({id: row.id}).then(() => {
          this.$notify.success('删除成功')
          this.queryList(1);
        })
      }).catch(err => {
      });
    },
    queryList(pageNo) {
      const http = coolApi.query;
      const params = this.queryUtil(http, pageNo);
      this.queryStatusNum(params)
    },
    queryStatusNum(params) {
      const pm = Object.assign({}, params, {status: null});
      const http = coolApi.queryStateNum;
      const res = {};
      this.queryStatusNumUtil(http, pm, this.statusType, res);
    },
    add() {
      this.form = {};
      this.showPart(0);
    },
    edit(item) {
      this.currentItem = item;
      this.currentItemId = item.id;
      this.form = item;
      this.showPart(0);
    },
    showItemDetail(item) {
      this.currentItem = item;
      this.currentItemId = item.id;
      this.showPart(1);
      this.defaultPageRight.width = '1500px';
      this.$nextTick(() => {
        this.form = item;
      });
    },
    change() {
      this.resetRightBox();
      this.queryList(this.pager.currentPage);
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
}
</script>

<style scoped>
</style>
