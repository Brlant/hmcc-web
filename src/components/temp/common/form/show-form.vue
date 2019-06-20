<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">设备信息</template>
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
            <oms-col :isShow="true" :rowSpan="span" label="设备编号devNo">{{formItem.devNo}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="名称">{{formItem.devName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="设备编码devCode">{{formItem.devCode}}</oms-col>
            <!--<oms-col label="监控状态" :rowSpan="span" :isShow="true">{{formItem.monitorStatus | formatMonitoringStatus }}</oms-col>-->
            <oms-col :isShow="true" :rowSpan="span" label="状态">{{parent.formatStatus(formItem.devStatus, statusType)}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="校准期" v-show="type===2">{{formItem.createTime | date}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="最新数据">
              <el-tooltip :content="showRecordDate(formItem.recordDate)" effect="dark" placement="top">
                <span>{{$formatDevData(formItem, type !== 5 ? '1' : '2')}}</span>
              </el-tooltip>
            </oms-col>
            <oms-col :isShow="true" :rowSpan="span" label="备注">{{formItem.comment}}</oms-col>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[1].name}}
              <des-btn @click="addBindRelation" class="btn-modify" icon="plus" v-has="'show'"/>
            </h3>
          </div>
          <div class="content">
            <bind-relation :formItem="formItem" :index="currentIndex" ref="bindRelation"></bind-relation>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[2].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[2].name}}</h3>
          </div>
          <div class="content">
            <change-record :formItem="formItem" :index="currentIndex" :statusType="statusType"></change-record>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import BindRelation from './bind-relation';
  import ChangeRecord from './change-record';

  export default {
    props: {
      index: Number,
      formItem: Object,
      type: Number,
      statusType: Object
    },
    components: {BindRelation, ChangeRecord},
    data() {
      return {
        span: 10,
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '设备绑定关系', key: 1},
          {name: '状态变更记录', key: 2}
        ],
        currentTab: {},
        tempList: [],
        currentIndex: -1,
        parent: this.$parent.$parent
      };
    },
    watch: {
      index(val) {
        this.currentIndex = -1;
        this.$nextTick(() => {
          this.currentIndex = val;
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
