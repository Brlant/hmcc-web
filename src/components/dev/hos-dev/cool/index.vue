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
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
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
              {{ index }}
            </el-col>
            <el-col :span="3" class="R">
              {{ item.name }}
            </el-col>
            <el-col :span="2" class="R">{{ item.devNo }}</el-col>
            <el-col :span="3" class="R">{{ item.orgName }}</el-col>
            <el-col :span="2" class="R">
              {{ formatStatus(item.type, coolDevType) }}
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
              <des-btn @click="edit(item)" icon="edit" v-has="permPage.edit">编辑</des-btn>
            </el-col>
          </el-row>
          <!--<div class="order-list-item-bg"></div>-->
        </div>
      </div>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
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
import utils, {formatDictLabel} from '@/tools/utils';
import SearchPart from './search';
import addForm from './form/add-form.vue';
import showForm from './form/show-form';
import CommonMixin from '@/mixins/commonMixin';
import {cool} from '@/resources';

export default {
  // 冷链设备管理
  name: 'CoolManagement',
  components: {
    SearchPart
  },
  mixins: [CommonMixin],
  data() {
    return {
      statusType: JSON.parse(JSON.stringify(utils.coolType)),
      filters: {
        status: '1',
        type: '',
        no: ''
      },
      dialogComponents: {
        0: addForm,
        1: showForm
      },
      formatDictLabel,
      defaultPageRight: {'width': '700px', 'padding': 0}
    };
  },
  computed: {
    coolDevType() {
      return this.$getDict('coolDevType')
    },
    deviceStatus() {
      return this.$getDict('device_status')
    },
  },
  watch: {
    filters: {
      handler: function (val) {
        this.queryList(1);
      },
      deep: true
    }
  },
  mounted() {
    this.queryList(1);
  },
  methods: {
    searchResult: function (search) {
      this.filters = Object.assign({}, this.filters, search);
    },
    checkStatus(item, key) {
      this.filters.status = item.status;
      this.activeStatus = key;
    },
    resetRightBox() {
      this.defaultPageRight.width = '700px';
      this.showIndex = -1;
    },
    showPart(index) {
      this.currentPart = this.dialogComponents[index];
      this.$nextTick(() => {
        this.showIndex = index;
      });
    },
    queryList(pageNo) {
      const http = cool.query;
      const params = this.queryUtil(http, pageNo);
      this.queryStatusNum(params)
    },
    queryStatusNum(params) {
      const pm = Object.assign({}, params, {status: null});
      const http = cool.queryStateNum;
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
      this.defaultPageRight.width = '900px';
      this.$nextTick(() => {
        this.form = item;
      });
    },
    change() {
      this.resetRightBox();
      this.queryList(this.pager.currentPage);
    }
  }
}
</script>
