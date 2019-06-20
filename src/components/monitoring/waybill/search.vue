<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">运单监控查询</template>
    <template slot="btn">
      <slot name="btn">
        <el-button @click="exportSearchFile" plain size="small">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
        <el-button @click="exportSearchZip" plain size="small">
          <f-a class="icon-small" name="export"></f-a>
          导出Zip
        </el-button>
      </slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="4" label="运单编号">
              <oms-input @keyup.native.enter="search" placeholder="请输入运单编号"
                         v-model.trim="searchCondition.orderCode"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="货主">
              <org-select :list="orgList" :remoteMethod="queryOrg"
                          placeholder="请输入名称搜索货主信息" v-model="searchCondition.ownnerId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="客户">
              <org-select :list="customerList" :remoteMethod="queryCustomer"
                          placeholder="请输入名称搜索客户信息" v-model="searchCondition.customerId"></org-select>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="4" label="车牌号">
              <oms-input @keyup.native.enter="search" placeholder="请输入车牌号"
                         v-model.trim="searchCondition.plateNumber"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="交接数据">
              <el-radio-group @change="search" size="small" v-model="searchCondition.handoverDataDone">
                <el-radio-button label="true">已交接</el-radio-button>
                <el-radio-button label="false">未交接</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="监控状态">
              <el-radio-group @change="search" size="small" v-model="searchCondition.activeFlag">
                <el-radio-button label="1">激活</el-radio-button>
                <el-radio-button label="0">停止</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <oms-form-row :required="true" :span="3" label="创建时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="search" placeholder="请选择创建时间"
                              type="datetimerange" v-model="times"/>
            </oms-form-row>
          </el-col>
          <el-col :span="12">
            <oms-form-row :required="true" :span="3" label="启运时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="search" placeholder="请选择启运时间"
                              type="datetimerange" v-model="departTimes"/>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import {http} from '@/resources';
  import utils from '@/tools/utils';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          orderCode: '',
          ownnerId: '',
          customerId: '',
          createStartTime: '',
          createEndTime: '',
          startTime: '',
          endTime: '',
          activeFlag: '',
          plateNumber: '',
          handoverDataDone: ''
        },
        showSearch: false,
        list: [],
        times: [],
        departTimes: []
      };
    },
    mounted() {
      this.initSearchParams();
    },
    methods: {
      exportSearchZip: function () {
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/monitoring/waybill/id',
          text: '正在导出'
        });
        let params = Object.assign({}, this.searchCondition);
        http.get('/ccsOrder/temperature-log/export-zip', {params}).then(res => {
          utils.download(res.data.path, '运单设备温度表');
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/monitoring/waybill/id'
          });

        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/monitoring/waybill/id'
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      exportSearchFile: function () {
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: '/monitoring/waybill/id',
          text: '正在导出'
        });
        let params = Object.assign({}, this.searchCondition);
        http.get('/ccsOrder/export/temperature-info', {params}).then(res => {
          utils.download(res.data.path, '运单设备温度表');
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/monitoring/waybill/id'
          });

        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/monitoring/waybill/id'
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      initSearchParams() {
        let query = this.$route.query;
        if (!query.code) return;
        this.searchCondition.orderCode = query.code;
        this.search();
      },
      search() {
        this.searchCondition.createStartTime = this.formatTimeAry(this.times, 0);
        this.searchCondition.createEndTime = this.formatTimeAry(this.times, 1);
        this.searchCondition.startTime = this.formatTimeAry(this.departTimes, 0);
        this.searchCondition.endTime = this.formatTimeAry(this.departTimes, 1);
        this.$emit('search', this.searchCondition);
      },
      formatTimeAry(times, index) {
        if (!times) return;
        return this.formatTime(times[index]);
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      reset() {
        this.searchCondition = {
          orderCode: '',
          ownnerId: '',
          customerId: '',
          createStartTime: '',
          createEndTime: '',
          startTime: '',
          endTime: '',
          activeFlag: '',
          plateNumber: '',
          handoverDataDone: ''
        };
        this.times = [];
        this.departTimes = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
