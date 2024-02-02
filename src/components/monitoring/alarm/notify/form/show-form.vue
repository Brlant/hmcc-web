<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">告警通知</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!detail.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知时间">{{detail.createTime | time}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="设备名称">{{detail.devName}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知类型">
              {{checkList[Number(detail.notifyType) - 1].label }}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="设备编号/编码">{{detail.devNo}}/{{detail.devCode}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知对象">{{detail.targetStr}}</oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="消息类型">{{detail.recordType === '0' ? '告警' : '恢复'}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="发送状态">{{detail.sendStatus === '1' ? '成功' : '失败'}}
            </oms-col>
            <oms-col :isShow="true" :rowSpan="rowSpan" label="通知内容">{{detail.warnHisInfo}}</oms-col>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {NotifyRecord} from '@/resources';

  export default {
    props: {
      index: Number,
      formItem: Object
    },
    data() {
      return {
        rowSpan: 8,
        loading: false,
        pageSets: [
          {name: '详细信息', key: 0}
        ],
        checkList: this.$parent.$parent.checkList,
        currentTab: {},
        tempList: [],
        detail: {}
      };
    },
    watch: {
      index(val) {
        if (val !== 0) return;
        this.queryDetail();
      }
    },
    methods: {
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      queryDetail() {
        this.loading = true;
        NotifyRecord.get(this.formItem.id).then(res => {
          this.detail = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
