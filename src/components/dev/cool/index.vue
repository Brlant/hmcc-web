<template>
  <div class="order-page">
    <search-part :type="type" @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="perms[0]" v-if="type">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType" v-show="!!type"/>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">编号</el-col>
        <el-col :span="4">所属单位</el-col>
        <el-col :span="3">类型</el-col>
        <el-col :span="3">品牌</el-col>
        <el-col :span="3">型号</el-col>
        <el-col :span="3">启用时间</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="3">操作</el-col>
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
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="[formatRowClass(item.status, statusType) ,{'active':currentItemId===item.id}]"
             @click="showItemDetail(item)" class="order-list-item"
             v-for="item in dataList">
          <el-row>
            <el-col :span="3" class="R">{{item.no}}</el-col>
            <el-col :span="4" class="R">{{item.orgName}}</el-col>
            <el-col :span="3" class="R">{{item.type}}</el-col>
            <el-col :span="3" class="R">{{item.barnd}}</el-col>
            <el-col :span="3" class="R">{{item.version}}</el-col>

            <el-col :span="3">{{item.startUsingTime | date}}</el-col>
            <el-col :span="2">
              {{formatStatus(item.status, statusType)}}
            </el-col>
            <el-col :span="3" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="perms[1]">编辑</des-btn>
              <des-btn @click="edit(item)" icon="forbidden" v-show="item.status === '1'" v-has="perms[1]">停用</des-btn>
              <des-btn @click="edit(item)" icon="forbidden" v-has="perms[1]" v-show="item.status === '0'">停用</des-btn>
            </el-col>
          </el-row>
          <div class="order-list-item-bg"></div>
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
      <component :formItem="form" :statusType="statusType"  :index="showIndex" :is="currentPart" @change="change" @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form';
  import CommonMixin from '@/mixins/commonMixin';
  import {TempDev} from '@/resources';

  export default {
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
        defaultPageRight: {'width': '700px', 'padding': 0}
      };
    },
    computed: {
      type() {
        const type = this.$route.meta.type;
        this.init(type);
        return type;
      },
      perms() {
        return this.$route.meta.perms;
      }
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
      showRecordDate: function (data) {
        if (!data) return '';
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      init(val) {
        this.activeStatus = 0;
        this.filters = {
          status: '1',
          type: '',
          no: ''
        };
        this.$nextTick(() => {
          this.filters.status = val === 2 ? null : '1';
        });
      },
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
        const http = TempDev.query;
        const params = this.queryUtil(http, pageNo);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {status: null});
        const http = TempDev.queryStateNum;
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
  };
</script>
