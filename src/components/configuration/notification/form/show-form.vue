<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">通知列表</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!notify.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" label="名称">{{notify.name}}</oms-col>
            <oms-col label="所属单位" :isShow="true">{{notify.orgName}}</oms-col>
          </div>
          <div class="hr mb-10 mt-10"></div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[1].name}}</h3>
          </div>
          <div class="content">
            <div v-if="!notify.levelOneAlarmObjectList.length">
              <div>一级告警</div>
              <div class="order-list clearfix" style="padding-top: 10px">
                <el-row class="order-list-header">
                  <el-col :span="4">通知人</el-col>
                  <el-col :span="4">通知类型</el-col>
                  <el-col :span="8">联系方式</el-col>
                  <el-col :span="8">备注</el-col>
                </el-row>
                <div class="empty-info mini">
                  暂无信息
                </div>
                <div class="order-list-body flex-list-dom">
                  <div :key="index" class="order-list-item no-pointer order-list-item-bg"
                       v-for="(item, index) in notify.levelOneAlarmObjectList">
                    <el-row>
                      <el-col :span="4">{{item.alarmNoticeUserName}}</el-col>
                      <el-col :span="4">{{checkList[item.notifyType].label}}</el-col>
                      <el-col :span="8" class="R">
                        {{item.alarmNoticeTarget}}
                      </el-col>
                      <el-col :span="8">{{item.remark}}</el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!notify.levelTwoAlarmObjectList.length">
              <div>二级告警</div>
              <div class="order-list clearfix" style="padding-top: 10px">
                <el-row class="order-list-header">
                  <el-col :span="4">通知人</el-col>
                  <el-col :span="4">通知类型</el-col>
                  <el-col :span="8">联系方式</el-col>
                  <el-col :span="8">备注</el-col>
                </el-row>
                <div class="empty-info mini">
                  暂无信息
                </div>
                <div class="order-list-body flex-list-dom">
                  <div :key="index" class="order-list-item no-pointer order-list-item-bg"
                       v-for="(item, index) in notify.levelTwoAlarmObjectList">
                    <el-row>
                      <el-col :span="4">{{item.alarmNoticeUserName}}</el-col>
                      <el-col :span="4">{{checkList[item.notifyType].label}}</el-col>
                      <el-col :span="8" class="R">
                        {{item.alarmNoticeTarget}}
                      </el-col>
                      <el-col :span="8">{{item.remark}}</el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!notify.levelThreeAlarmObjectList.length">
              <div>三级告警</div>
              <div class="order-list clearfix" style="padding-top: 10px">
                <el-row class="order-list-header">
                  <el-col :span="4">通知人</el-col>
                  <el-col :span="4">通知类型</el-col>
                  <el-col :span="8">联系方式</el-col>
                  <el-col :span="8">备注</el-col>
                </el-row>
                <div class="empty-info mini">
                  暂无信息
                </div>
                <div class="order-list-body flex-list-dom">
                  <div :key="index" class="order-list-item no-pointer order-list-item-bg"
                       v-for="(item, index) in notify.levelThreeAlarmObjectList">
                    <el-row>
                      <el-col :span="4">{{item.alarmNoticeUserName}}</el-col>
                      <el-col :span="4">{{checkList[item.notifyType].label}}</el-col>
                      <el-col :span="8" class="R">
                        {{item.alarmNoticeTarget}}
                      </el-col>
                      <el-col :span="8">{{item.remark}}</el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {AlarmNotifyGroup, User} from '@/resources';

  export default {
    props: ['formItem', 'index'],
    data() {
      return {
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '通知方式', key: 1}
        ],
        currentTab: {},
        notify: {},
        checkList: [
          {label: '短信', key: '0'},
          {label: '微信', key: '1'}
        ]
      };
    },
    watch: {
      index: function (val) {
        if (val !== 1) return;
        this.queryDetail();
      }
    },
    methods: {
      formatContactWay(item) {
        if (item.memberSource === '1') return;
        User.get(item.targetStr).then(res => {
          item.name = res.data.name;
          item.targetStr = item.notifyType === '1' ? res.data.phone : res.data.email;
        });
      },
      selectTab(item) {
        this.currentTab = item;
      },
      close() {
        this.$emit('right-close');
      },
      queryDetail() {
        this.notify = {};
        this.loading = true;
        AlarmNotifyGroup.get(this.formItem.id).then(res => {
          res.data.details.forEach(i => {
            this.formatContactWay(i);
          });
          this.notify = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
