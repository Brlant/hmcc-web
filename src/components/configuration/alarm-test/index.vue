<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="perms[0]">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="4">操作人</el-col>
        <el-col :span="6">测试类型</el-col>
        <el-col :span="6">测试时间</el-col>
        <el-col :span="4">系统结果</el-col>
        <el-col :span="4">操作</el-col>
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
        <div :class="[{'active':currentItemId===item.id}]"
             class="order-list-item no-pointer order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="4" class="R">{{item.operationUserId}}</el-col>
            <el-col :span="6" class="R">
              {{item.test === '0' ? '短信' : '微信'}}
              <div class="f-grey">{{item.noticeTarget}}</div>
            </el-col>
            <el-col :span="6" class="R">{{item.time|time}}</el-col>
            <el-col :span="4" class="R">{{item.result}}</el-col>
            <el-col :span="4" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="perms[1]">编辑</des-btn>
            </el-col>
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
      <component :formItem="form" :index="showIndex" :is="currentPart" @change="change"
                 :getQCodeInfo="getQCodeInfo" @closeDialog="closeDialog" @openDialog="openDialog"
                 @right-close="resetRightBox"/>
    </page-right>
    <q-code-dialog ref="qrCode"/>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form';
  import CommonMixin from '@/mixins/commonMixin';
  import {probe} from '@/resources';
  import QCodeDialog from '../notification/q-code-dialog';
  export default {
    components: {
      SearchPart,
      QCodeDialog
    },
    mixins: [CommonMixin],
    data() {
      return {
        filters: {
          status: '1',
          devCode: '',
          devName: ''
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
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      queryList(pageNo) {
        const http = probe.query;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {status: null});
        const http = probe.queryStateNum;
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
      start(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否启用探头"${item.name}"`, () => {
          this.$httpRequestOpera(probe.start(item.id), {
            errorTitle: '启用失败',
            success: (res) => {
              if(res.data.code === 200) {
                item.status = '1';
              }else {
                this.$notify.error({message: res.data.msg})
              }
            }
          });
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      },
      getQCodeInfo() {
        return this.$refs.qrCode;
      },
      openDialog(imgUrl, item) {
        if (!imgUrl) {
          this.$refs.qrCode.show();
        } else {
          this.$refs.qrCode.open(imgUrl, item);
        }
      },
      closeDialog() {
        this.$refs.qrCode.close();
      }
    }
  };
</script>
