<style lang="scss" scoped>

  .R {
    word-wrap: break-word;
    word-break: break-all;
  }

  .good-selects {
    .el-select-dropdown__item {
      height: auto;
      width: 300px;
    }
  }

  .align-word {
    letter-spacing: 1em;
    margin-right: -1em;
  }

  .order-list-item {
    cursor: pointer;
  }

  .good-selects {
    .el-select-dropdown__item {
      width: auto;
    }
  }

  .header-list {
    overflow: hidden;
  }
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div class="opera-btn-group" :class="{up:!showSearch}">
        <div class="opera-icon">
          <!--<span class="">-->
          <!--<i class="el-icon-t-search"></i> 筛选查询-->
          <!--</span>-->
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row label="日志操作人" :span="5">
                <el-select filterable remote placeholder="请输入名称/拼音首字母缩写搜索" :remote-method="filterUser"
                           :clearable="true"
                           v-model="searchWord.operatorId" popperClass="good-selects">
                  <el-option :value="user.id" :key="user.id" :label="user.name" v-for="user in userList">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{user.name}}</span>
                      <span class="pull-right">
                        {{user.companyDepartmentName}}
                      </span>
                      <div class="font-gray clearfix">所属单位：{{user.orgName}}</div>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="9">
              <oms-form-row label="日志操作时间" :span="7">
                <el-col :span="24">
                  <el-date-picker
                    v-model="expectedTime"
                    type="datetimerange"
                    :default-time="['00:00:00', '23:59:59']">
                  </el-date-picker>
                </el-col>
              </oms-form-row>
            </el-col>
            <el-col :span="7">
              <oms-form-row label="操作类型" :span="6">
                <oms-input v-model="searchWord.actionType" placeholder="请输入操作类型"/>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <oms-form-row label="请求体" :span="5">
                <oms-input type="text" v-model="searchWord.body" placeholder="请输入请求体"></oms-input>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row label="" :span="5">
                <el-button type="primary" native-type="submit" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <el-table :data="logList" border @row-click="showDetail" class="clearfix" :header-row-class-name="'headerClass'"
                ref="orderDetail" v-loading="loadingData">
        <el-table-column prop="operationTime" label="日志操作时间" :sortable="true"
                         width="200">
          <template slot-scope="scope">
            {{ scope.row.operationTime | time}}
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="日志操作人" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="orgName" label="所属单位" :sortable="true" width="250"></el-table-column>
        <el-table-column prop="actionType" label="日志操作类型" :sortable="true" width="180">
          <template slot-scope="scope">
            {{ showActionType(scope.row.actionType)}}
          </template>
        </el-table-column>
        <el-table-column prop="logRemarks" label="日志内容" :sortable="true" min-width="200"></el-table-column>
        <el-table-column prop="body" label="请求体" :sortable="true" min-width="200">
          <div style="max-height: 150px;overflow: auto">
            <template slot-scope="scope">
              {{ scope.row.body}}
            </template>
          </div>
        </el-table-column>
        <el-table-column prop="sessionId" label="sessionId" :sortable="true" width="150"></el-table-column>
        <el-table-column prop="ip" label="IP" :sortable="true" width="150"></el-table-column>
      </el-table>
      <div class="text-center" v-show="(logList.length || pager.currentPage !== 1) && !loadingData">
        <el-cu-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page="pager.currentPage"
                          :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                          layout="sizes, prev, pager, next, jumper"
                          :total="pager.count">
        </el-cu-pagination>
      </div>
    </div>

    <!--<page-right :show="showDetailPart" @right-close="resetRightBox" :css="{'width':'1100px','padding':0}">-->
    <!--<detail :currentItem="currentItem" @close="resetRightBox"></detail>-->
    <!--</page-right>-->
  </div>
</template>
<script>
  import {BaseInfo, User} from '@/resources';
  //  import detail from './detail.vue';
  import Util from '@/tools/utils';

  export default {
//    components: {detail},
    data() {
      return {
        loadingData: true,
        showSearch: true,
        logList: [],
        filters: {
          operatorId: '',
          startTime: '',
          endTime: '',
          actionType: '',
          body: ''
        },
        searchWord: {
          operatorId: '',
          startTime: '',
          endTime: '',
          actionType: '',
          body: ''
        },
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        expectedTime: '',
        userList: []
      };
    },
    mounted() {
      this.getLogPager(1);
    },
    computed: {},
    watch: {
      filters: {
        handler: function () {
          this.getLogPager(1);
        },
        deep: true
      }
    },
    methods: {
      showActionType: function (item) {
        if (item === 'login') {
          item = '登录';
        }
        return item;
      },
      filterUser: function (query) {
        let data = Object.assign({}, {
          pageNo: 1,
          pageSize: 20,
          keyWord: query
        });
        User.queryAllUser(data).then(res => {
          this.userList = res.data.list;
        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.getLogPager(1);
      },
      handleCurrentChange(val) {
        this.getLogPager(val);
      },
      filterCustomer: function (query) {// 过滤客户
        BaseInfo.query({keyWord: query, type: 0}).then(res => {
          this.customerList = res.data.list;
        });
      },
      getLogPager: function (pageNo) { // 得到日志列表
        this.pager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        this.$http.get('/system-log', {params: param}).then(res => {
          this.logList = res.data.list;
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      showDetail(item) {
        this.currentItemId = item.id;
        this.currentItem = item;
        this.showDetailPart = true;
      },
      resetRightBox() {
        this.showDetailPart = false;
      },
      searchInOrder: function () {// 搜索
        this.searchWord.startTime = this.$formatAryTime(this.expectedTime, 0);
        this.searchWord.endTime = this.$formatAryTime(this.expectedTime, 1);
        Object.assign(this.filters, this.searchWord);
      },
      resetSearchForm: function () {// 重置表单
        this.searchWord = {
          operatorId: '',
          startTime: '',
          endTime: '',
          actionType: '',
          body: ''
        };
        this.expectedTime = '';
        Object.assign(this.filters, this.searchWord);
      },
      formatTime(date) {
        return date ? this.$moment(date).format('YYYY-MM-DD') : '';
      }
    }
  };
</script>
