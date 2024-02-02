<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">巡检计划</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!formItem.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content">
            <oms-col :isShow="true" :rowSpan="span" label="巡检单位">{{formItem.patrolOrgName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="巡检人">{{formItem.patrolUserName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="计划巡检时间">{{formItem.patrolProjectDate | date}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="实际巡检时间">{{formItem.patrolTime | date}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="状态">
              {{parent.formatStatus(formItem.status, statusType)}}
            </oms-col>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content">
            <el-table :data="devList" border class="clearfix" ref="orderDetail">
              <el-table-column prop="operationTime" label="设备类型" width="100">
                <template slot-scope="scope">{{scope.row.devType === '0' ? '冷链标签' : '网关'}}</template>
              </el-table-column>
              <el-table-column prop="actionType" label="设备">
                <template slot-scope="scope">
                  <div v-show="scope.row.devName">名称：{{scope.row.devName}}</div>
                  <div v-show="scope.row.devNo">编号：{{scope.row.devNo}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="actionType" label="设备状态" width="100">
                <template slot-scope="scope">{{scope.row.devStatus === '0' ? '正常' : '异常'}}</template>
              </el-table-column>
              <el-table-column prop="actionType" label="备注">
                <template slot-scope="scope">{{scope.row.remark}}</template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {checkRecord} from '@/resources';

  export default {
    props: {
      index: Number,
      formItem: Object,
      statusType: Object
    },
    data() {
      return {
        span: 10,
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '巡检设备', key: 1}
        ],
        currentTab: {},
        devList: [],
        currentIndex: -1,
        parent: this.$parent.$parent
      };
    },
    watch: {
      index(val) {
        if (val !== 1) return;
        this.currentIndex = -1;
        this.$nextTick(() => {
          this.currentIndex = val;
        });
        checkRecord.query(this.formItem.id).then(res => {
          this.devList = res.data.list;
        });
      }
    },
    methods: {
      showRecordDate: function (data) {
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      addBindRelation() {
        this.$refs['bindRelation'].isShowAddForm = true;
      }
    }
  };
</script>
