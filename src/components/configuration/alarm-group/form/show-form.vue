<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">规则组信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!ruleGroup.id">暂无数据</div>
      <div v-else>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content" style="overflow: hidden">
            <oms-col :isShow="true" label="规则组名称">{{ruleGroup.ruleGroupName}}</oms-col>
            <!--<oms-col label="创建时间" :isShow="true">{{ruleGroup.createTime | time}}</oms-col>-->
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
            <el-table :data="ruleGroup.rules"
                      class="el-table--expand" header-row-class-name="table-header-color">
              <!--<el-table-column type="expand">-->
              <!--<template slot-scope="props">-->
              <!--<el-table-->
              <!--:data="props.row.details" header-row-class-name="sub-table-header-color">-->
              <!--<el-table-column label="类型" prop="monitorType">-->
              <!--<template slot-scope="props">{{checkList[props.row.monitorType-1].label}}</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column label="条件" prop="compareType">-->
              <!--<template slot-scope="props">{{conditions[props.row.compareType] && conditions[props.row.compareType].label}}</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column label="阈值" prop="threshold">-->
              <!--<template slot-scope="props">{{props.row.threshold + checkList[props.row.monitorType-1].unit}}</template>-->
              <!--</el-table-column>-->
              <!--&lt;!&ndash;<el-table-column label="生效开始" prop="startTime">&ndash;&gt;-->
              <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
              <!--&lt;!&ndash;<el-table-column label="生效结束" prop="endTime">&ndash;&gt;-->
              <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
              <!--</el-table>-->
              <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column label="名称" prop="ruleName">
              </el-table-column>
              <el-table-column label="规则条件逻辑" prop="logicType" width="120">
                <template slot-scope="props">{{logicList[props.row.logicType] &&
                  logicList[props.row.logicType].label}}
                </template>
              </el-table-column>
              <el-table-column label="级别" prop="warnLevel" width="60">
                <template slot-scope="props">{{levels[props.row.warnLevel] && levels[props.row.warnLevel].label}}
                </template>
              </el-table-column>
              <el-table-column label="延时通知时间" prop="warnKeepTime" width="120">
                <template slot-scope="props">{{props.row.warnKeepTime}}min</template>
              </el-table-column>
              <el-table-column label="条件" prop="warnKeepTime">
                <template slot-scope="props">
                  <div v-for="item in props.row.details">{{checkList[item.monitorType-1].label}}
                    {{conditions[item.compareType] &&
                    conditions[item.compareType].label}} {{item.threshold + checkList[item.monitorType-1].unit}}
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

    </template>
  </dialog-template>
</template>
<script>
  import {AlarmRuleGroup} from '@/resources';

  export default {
    props: ['formItem', 'index'],
    data() {
      return {
        loading: false,
        pageSets: [
          {name: '基本信息', key: 0},
          {name: '告警规则', key: 1}
        ],
        currentTab: {},
        ruleGroup: {},
        checkList: this.$parent.$parent.checkList,
        conditions: this.$parent.$parent.conditions,
        levels: this.$parent.$parent.levels,
        logicList: this.$parent.$parent.logicList
      };
    },
    watch: {
      index: function (val) {
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
        this.ruleGroup = {};
        this.loading = true;
        AlarmRuleGroup.get(this.formItem.id).then(res => {
          this.ruleGroup = res.data;
          this.loading = false;
        });
      }
    }
  };
</script>
