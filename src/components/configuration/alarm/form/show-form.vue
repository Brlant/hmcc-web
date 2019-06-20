<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">规则信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!rule.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" label="规则名称">{{rule.ruleName}}</oms-col>
            <oms-col :isShow="true" label="规则条件逻辑">{{logicList[rule.logicType].label}}</oms-col>
            <oms-col :isShow="true" label="级别">{{levels[rule.warnLevel].label}}</oms-col>
            <oms-col :isShow="true" label="延时通知时间">{{rule.warnKeepTime}}min</oms-col>
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
            <div class="order-list clearfix" style="padding-top: 10px">
              <el-row class="order-list-header">
                <el-col :span="5">类型</el-col>
                <el-col :span="4">条件</el-col>
                <el-col :span="5">阈值</el-col>
                <!--<el-col :span="5">生效开始</el-col>-->
                <!--<el-col :span="5">生效结束</el-col>-->
              </el-row>
              <div class="empty-info mini" v-if="!rule.details.length">
                暂无信息
              </div>
              <div class="order-list-body flex-list-dom" v-else>
                <div :key="index" class="order-list-item no-pointer order-list-item-bg"
                     v-for="(item, index) in rule.details">
                  <el-row>
                    <el-col :span="5">{{checkList[item.monitorType-1].label}}</el-col>
                    <el-col :span="4">{{conditions[item.compareType].label}}</el-col>
                    <el-col :span="5">{{item.threshold + checkList[item.monitorType-1].unit}}</el-col>
                    <!--<el-col :span="5">{{item.startTime}}</el-col>-->
                    <!--<el-col :span="5">{{item.endTime}}</el-col>-->
                  </el-row>
                </div>
              </div>
            </div>
          </div>
          <div class="hr mb-10"></div>
        </div>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {AlarmRule} from '@/resources';

  export default {
    props: {
      index: Number,
      formItem: Object
    },
    data() {
      return {
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '规则明细', key: 1}
        ],
        currentTab: {},
        rule: {},
        checkList: this.$parent.$parent.checkList,
        conditions: this.$parent.$parent.conditions,
        levels: this.$parent.$parent.levels,
        logicList: this.$parent.$parent.logicList
      };
    },
    watch: {
      index(val) {
        if (val !== 1) return;
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
        this.rule = {};
        this.loading = true;
        AlarmRule.get(this.formItem.id).then(res => {
          this.rule = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
