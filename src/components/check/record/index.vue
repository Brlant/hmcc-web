<template>
  <div class="order-page">
    <search-part @search="searchResult" :statusType="statusType">
<!--      <template slot="btn">-->
<!--        <el-button @click="add" plain size="small" v-has="permPage.add">-->
<!--          <f-a class="icon-small" name="plus"></f-a>-->
<!--          添加-->
<!--        </el-button>-->
<!--      </template>-->
    </search-part>
    <!--    <status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType"/>-->
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="5">巡检单位</el-col>
        <el-col :span="2">巡检人</el-col>
        <el-col :span="5">所属单位</el-col>
        <el-col :span="3">设备类型</el-col>
        <el-col :span="3">设备状态</el-col>
        <el-col :span="3">计划巡检时间</el-col>
        <el-col :span="3">实际巡检时间</el-col>
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
        <div :class="[{'active':currentItemId===item.id}]" class="order-list-item order-list-item-bg no-pointer"
             v-for="item in dataList">
          <el-row>
            <el-col :span="5" class="R">{{item.patrolOrgName}}</el-col>
            <el-col :span="2" class="R">{{item.patrolUserName}}</el-col>
            <el-col :span="5">{{item.orgName}}</el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3"></el-col>
            <el-col :span="3" class="R">{{item.patrolProjectDate | date}}</el-col>
            <el-col :span="3" class="R">{{item.patrolTime | date}}</el-col>
          </el-row>
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
      <component :formItem="form" :index="showIndex" :statusType="statusType" :is="currentPart" @change="change"
                 @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form';
  import CommonMixin from '@/mixins/commonMixin';
  import {checkRecord} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: {
          0: {'title': '未巡检', status: '0', num: ''},
          1: {'title': '已巡检', status: '1', num: ''},
          2: {'title': '取消', status: '2', num: ''}
        },
        filters: {
          status: ''
        },
        dialogComponents: {
          0: addForm,
          1: showForm
        },
        defaultPageRight: {'width': '700px', 'padding': 0}
      };
    },
    computed: {
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
        this.currentItem = {};
        this.currentItemId = '';
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      queryList(pageNo) {
        const http = checkRecord.query;
        const params = this.queryUtil(http, pageNo);
        // this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {status: null});
        const http = checkRecord.queryStateNum;
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
      cancel(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否取消此巡检计划`, () => {
          let newItem = JSON.parse(JSON.stringify(item));
          newItem.status = '3';
          this.$httpRequestOpera(checkRecord.update(newItem), {
            successTitle: '取消成功',
            errorTitle: '取消失败',
            success: (res) => {
              this.change();
            }
          });
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
