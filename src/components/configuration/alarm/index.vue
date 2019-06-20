<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'ccs-warn-rule-add'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>

    <div class="order-list" style="margin-top: 10px">
      <el-row class="order-list-header">
        <el-col :span="5">规则名称</el-col>
        <el-col :span="5">规则条件逻辑</el-col>
        <el-col :span="5">级别</el-col>
        <el-col :span="5">延时通知时间</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length == 0">
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
            <el-col :span="5">{{item.ruleName}}</el-col>
            <el-col :span="5">{{logicList[item.logicType].label}}</el-col>
            <el-col :span="5">{{levels[item.warnLevel].label}}</el-col>
            <el-col :span="5">{{item.warnKeepTime}}min</el-col>
            <el-col :span="4" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="'ccs-warn-rule-edit'">编辑</des-btn>
              <des-btn @click="deleteItem(item)" icon="delete" v-has="'ccs-warn-rule-del'">删除</des-btn>
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
      <component :formItem="form" :index="showIndex" :is="currentPart" @change="change" @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import alarmMixin from '@/mixins/alarmMixin';
  import {AlarmRule} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin, alarmMixin],
    data() {
      return {
        statusType: utils.orderType,
        filters: {},
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
        const http = AlarmRule.query;
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
        this.form = item;
        this.showPart(1);
      },
      deleteItem(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否删除规则"${item.ruleName}"`, () => {
          this.$httpRequestOpera(AlarmRule.delete(item.id), {
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
      }
    }
  };
</script>
