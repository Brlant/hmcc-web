<template>
  <div class="order-page">
    <!--<status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType"/>-->
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="8">设备编码</el-col>
        <el-col :span="7">设备名称</el-col>
        <el-col :span="3">温度</el-col>
        <el-col :span="3">湿度</el-col>
        <el-col :span="3">电压</el-col>
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
        <div class="order-list-item order-list-item-bg"
             v-for="item in dataList" @click="showItem(item)">
          <el-row>
            <el-col :span="8" class="R">{{item.devCode}}</el-col>
            <el-col :span="7" class="R">{{item.devName}}</el-col>
            <el-col :span="3" class="R">{{item.temperature}}</el-col>
            <el-col :span="3" class="R">{{item.humidity}}</el-col>
            <el-col :span="3" class="R">{{item.voltage}}</el-col>
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
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize
        }, this.filters);
        this.loadingData = true;
        let nowTime = new Date();
        this.nowTime = nowTime;
        this.$http.get('/ccsMonitorRelation', {params}).then(res => {
          if (this.nowTime > nowTime) return;
          if (res.data.code) res.data = res.data.data;
          this.dataList = res.data.currentList || [];
          this.pager.count = res.data.count;
          this.loadingData = false;
        });
      },
      showItem(item) {
        let type = item.devType === '4' ? '2' : '1';
        let id = item.ccsDevId;
        this.$router.push({path: '/monitoring/store/temp', query: {id, type}});
      },
    }
  };
</script>
