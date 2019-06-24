<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'ccs-notify-add'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>

    <div class="order-list" style="margin-top: 10px">
      <el-row class="order-list-header">
        <el-col :span="8">名称</el-col>
        <el-col :span="12">所属单位</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length === 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else="">
        <div :class="['status-no', {'active':currentItemId===item.id}]" @click="showItemDetail(item)"
             class="order-list-item order-list-item-bg " v-for="item in dataList">
          <el-row>
            <el-col :span="8">{{item.name}}</el-col>
            <el-col :span="8">{{item.orgName}}</el-col>
            <el-col :span="4" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="'ccs-notify-edit'">编辑</des-btn>
              <des-btn @click="deleteItem(item)" icon="delete" v-has="'ccs-notify-del'">
                删除
              </des-btn>
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

    <page-right :css="defaultStyle" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :getQCodeInfo="getQCodeInfo" :index="showIndex" :is="currentPart"
                 @change="change" @closeDialog="closeDialog" @openDialog="openDialog"
                 @right-close="resetRightBox"/>
    </page-right>
    <q-code-dialog ref="qrCode"/>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import {AlarmNotifyGroup} from '@/resources';
  import QCodeDialog from './q-code-dialog';

  export default {
    components: {
      SearchPart,
      QCodeDialog
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: utils.orderType,
        filters: {
          status: '2'
        },
        dialogComponents: {
          0: addForm,
          1: showForm
        },
        defaultStyle: {
          'width': '900px',
          'padding': 0
        }
      };
    },
    watch: {
      filters: {
        handler: function () {
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
        this.defaultStyle.width = '900px';
        this.showIndex = -1;
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      queryList(pageNo) {
        const http = AlarmNotifyGroup.query;
        this.queryUtil(http, pageNo);
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
        this.defaultStyle.width = '900px';
        this.showPart(1);
        this.$nextTick(() => {
          this.form = item;
        });
      },
      deleteItem(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否删除通知列表"${item.name}"`, () => {
          this.$httpRequestOpera(AlarmNotifyGroup.delete(item.id), {
            successTitle: '删除成功',
            errorTitle: '删除失败',
            success: () => {
              this.queryList(1);
            }
          });
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(1);
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
