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
    <!--<status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType"/>-->
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">设备名称</el-col>
        <el-col :span="4">设备编号</el-col>
        <el-col :span="4">所属单位</el-col>
        <el-col :span="3">型号</el-col>
        <el-col :span="2">温度</el-col>
        <el-col :span="2">湿度</el-col>
        <el-col :span="2">电压</el-col>
        <el-col :span="4">校准期</el-col>
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
             @click="showItemDetail(item)" class="order-list-item order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="3" class="R">{{item.name}}</el-col>
            <el-col :span="4" class="R">{{item.no}}</el-col>
            <el-col :span="4" class="R">{{item.orgName}}</el-col>
            <el-col :span="3" class="R">{{item.type}}</el-col>
            <el-col :span="2" class="R">{{item.type}}</el-col>
            <el-col :span="2" class="R">{{item.type}}</el-col>
            <el-col :span="2" class="R">{{item.type}}</el-col>
            <el-col :span="4" class="R">{{item.type}}</el-col>
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
  </div>
</template>
<script>
  import SearchPart from './search';
  import CommonMixin from '@/mixins/commonMixin';
  import {probe} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        filters: {
          status: '1',
          devCode: '',
          devName: ''
        }
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
      queryList(pageNo) {
        const http = probe.query;
        const params = this.queryUtil(http, pageNo);
      }
    }
  };
</script>
