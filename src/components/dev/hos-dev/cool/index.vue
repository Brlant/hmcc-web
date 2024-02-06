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
        <el-col :span="2">设备名称</el-col>
        <el-col :span="2">设备编号</el-col>
        <el-col :span="2">所属科室</el-col>
        <el-col :span="2">设备分类</el-col>
        <el-col :span="2">定位标签</el-col>
        <el-col :span="2">能耗标签</el-col>
        <el-col :span="2">启用时间</el-col>
        <el-col :span="2">运行状态</el-col>
        <el-col :span="2">设备状态</el-col>
        <el-col :span="3">最后位置</el-col>
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
            <el-col :span="2" class="R">
              {{ item.name }}
            </el-col>
            <el-col :span="2" class="R">{{ item.no }}</el-col>
            <el-col :span="2" class="R">{{ item.departmentName }}</el-col>
            <el-col :span="2" class="R">
              {{ formatDictLabel(item.type, deviceTypes) }}
            </el-col>
            <el-col :span="2" class="R">{{ item.tagSnNumber }}</el-col>
            <el-col :span="2" class="R">{{ item.energyTagSnNumber }}</el-col>

            <el-col :span="2">{{ item.startUsingTime | time }}</el-col>
            <el-col :span="2">
              <span v-if="item.deviceStatus === 'ONLINE'" style="color: green">开机</span>
              <span v-else-if="item.deviceStatus === 'OFFLINE'" style="color: grey">关机</span>
              <span v-else-if="item.deviceStatus === 'ALARM'" style="color: red">异常</span>
              <span v-else-if="item.deviceStatus === 'FAILURE'" style="color: yellow">故障</span>
              <span v-else>--</span>
            </el-col>
            <el-col :span="2">
              {{ formatDictLabel(item.status, statusList) }}
            </el-col>
            <el-col :span="3">
              {{ item.lastPositionStr }}
            </el-col>
            <el-col :span="2" class="opera-btn">
               <span @click.prevent.stop="devicesPosition(item)" class="des-btn">
               <a href="#" class="btn-circle" @click.prevent=""><i
                 :class="'el-icon-location-outline'"></i></a>
                定位
              </span>
              <des-btn @click="edit(item)" icon="edit" v-has="permPage.editCool">编辑</des-btn>
              <!--<des-btn @click="remove(item)" icon="delete" v-has="permPage.delCool">删除</des-btn>-->
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

import SearchPart from './search';
import CommonMixin from '@/mixins/commonMixin';
import utils from '@/tools/utils';

import addForm from './form/add-form.vue';
import showForm from './form/show-form.vue';


import queryApi from '@/api/query/query';
import {coolApi} from '@/resources';

export default {
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
      // 设备总数
      totalNumberDevices: {
        totalCount: '',     // 设备总数
        onlineCount: '',    // 开机数
        offlineCount: '',   // 关机数
        alarmCount: ''      // 异常数
      },
    }
  },
  computed: {
    deviceTypes() {
      return this.$getDict('coolDevType')
    },
    deviceStatus() {
      return this.$getDict('device_status')
    },
    alarmStatus() {
      return this.$getDict('alarm_status')
    },
    statusList() {
      return this.$getDict('deviceTemplateStatus')
    }
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
        path: '/device-position/position',
        query: {
          id: row.id,
          devNo:row.no,
          devName:row.name
        },
      });
    },
    /* 删除设备 */
    remove(row) {
      this.$confirm('确定删除该设备吗？删除后设备将无法回复，标签将释放', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认删除'
      }).then(() => {
        coolApi.deleteById(row.id).then(() => {
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
.totalNumberDevices {
  display: flex;
  margin: 10px 0;
}

.deviceStyle {
  margin-right: 30px;
}

.deviceStyleNumber {
  margin-left: 20px;
}

.vertical-line {
  margin: 4px 40px 0 0;
  width: 1px;
  height: 15px;
  background-color: grey;
}

</style>
