<template>
  <oms-loading :loading="true" v-if="props1.row.loading"></oms-loading>
  <div v-else>
    <el-tabs class="el-tabs--custom" type="border-card">
      <el-tab-pane :label="props1.row.warnRuleGroupName">
        <el-table :data="props1.row.rules" header-row-class-name="sub-table-header-color">
          <!--<el-table-column type="expand">-->
          <!--<template slot-scope="props2">-->
          <!--<el-table-->
          <!--:data="props2.row.details" header-row-class-name="sub-table-header-color">-->
          <!--<el-table-column label="类型" prop="monitorType">-->
          <!--<template slot-scope="props">{{checkList[props.row.monitorType-1].label}}</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="条件" prop="compareType">-->
          <!--<template slot-scope="props">{{conditions[props.row.compareType] &&-->
          <!--conditions[props.row.compareType].label}}-->
          <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column label="阈值" prop="threshold">-->
          <!--<template slot-scope="props">{{props.row.threshold + checkList[props.row.monitorType-1].unit}}-->
          <!--</template>-->
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
      </el-tab-pane>
      <el-tab-pane :label="props1.row.notifyListName">
        <el-table :data="props1.row.notifyList"
                  class="el-table--expand" header-row-class-name="sub-table-header-color">
          <el-table-column label="人员类型" prop="memberSource" width="90">
            <template slot-scope="props">{{typeList[props.row.memberSource].label}}</template>
          </el-table-column>
          <el-table-column label="通知类型" prop="logicType" width="80">
            <template slot-scope="props">{{NotifyCheckList[props.row.notifyType-1].label}}</template>
          </el-table-column>
          <el-table-column label="联系方式" min-width="120" prop="warnLevel">
            <template slot-scope="props">
              <span v-show="props.row.memberSource === '1'">{{props.row.targetStr}}</span>
              <span v-show="props.row.memberSource === '0'">
                {{props.row.name}}
              <span v-show="props.row.notifyType !== '3'">({{props.row.targetStr}})</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="comment"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!--&lt;!&ndash;<label>告警规则</label>&ndash;&gt;-->
    <!--<el-table header-row-class-name="table-header-color" :default-expand-all="true"-->
    <!--:data="props1.row.rules" class="el-table&#45;&#45;expand">-->
    <!--<el-table-column type="expand">-->
    <!--<template slot-scope="props2">-->
    <!--<el-table-->
    <!--:data="props2.row.details" header-row-class-name="sub-table-header-color">-->
    <!--<el-table-column label="类型" prop="monitorType">-->
    <!--<template slot-scope="props">{{checkList[props.row.monitorType-1].label}}</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="条件" prop="compareType">-->
    <!--<template slot-scope="props">{{conditions[props.row.compareType] &&-->
    <!--conditions[props.row.compareType].label}}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="阈值" prop="threshold">-->
    <!--<template slot-scope="props">{{props.row.threshold + checkList[props.row.monitorType-1].unit}}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--&lt;!&ndash;<el-table-column label="生效开始" prop="startTime">&ndash;&gt;-->
    <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
    <!--&lt;!&ndash;<el-table-column label="生效结束" prop="endTime">&ndash;&gt;-->
    <!--&lt;!&ndash;</el-table-column>&ndash;&gt;-->
    <!--</el-table>-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="名称" prop="ruleName">-->
    <!--</el-table-column>-->
    <!--<el-table-column label="规则条件逻辑" prop="logicType">-->
    <!--<template slot-scope="props">{{logicList[props.row.logicType] &&-->
    <!--logicList[props.row.logicType].label}}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="级别" prop="warnLevel">-->
    <!--<template slot-scope="props">{{levels[props.row.warnLevel] && levels[props.row.warnLevel].label}}-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="延时通知时间" prop="warnKeepTime">-->
    <!--<template slot-scope="props">{{props.row.warnKeepTime}}min</template>-->
    <!--</el-table-column>-->
    <!--</el-table>-->
    <!--&lt;!&ndash;<label>通知列表</label>&ndash;&gt;-->
    <!--<el-table header-row-class-name="table-header-color"-->
    <!--:data="props1.row.notifyList" class="el-table&#45;&#45;expand mt-10">-->
    <!--<el-table-column label="人员类型" prop="memberSource" min-width="80">-->
    <!--<template slot-scope="props">{{typeList[props.row.memberSource].label}}</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="通知类型" prop="logicType" min-width="80">-->
    <!--<template slot-scope="props">{{NotifyCheckList[props.row.notifyType-1].label}}</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="联系方式" prop="warnLevel" min-width="120">-->
    <!--<template slot-scope="props">-->
    <!--<span v-show="props.row.memberSource === '1'">{{props.row.targetStr}}</span>-->
    <!--<span v-show="props.row.memberSource === '0'">{{props.row.name}}({{props.row.targetStr}})</span>-->
    <!--</template>-->
    <!--</el-table-column>-->
    <!--<el-table-column label="备注" prop="comment"></el-table-column>-->
    <!--</el-table>-->
  </div>
</template>
<script>
  import {AlarmRuleGroup, NotifyRule, User} from '@/resources';
  import alarmMixin from '@/mixins/alarmMixin';

  export default {
    props: ['props1'],
    mixins: [alarmMixin],
    data() {
      return {
        NotifyCheckList: [
          {label: '短信', key: '1'},
          {label: '邮箱', key: '2'},
          {label: '微信', key: '3'}
        ],
        typeList: [
          {label: '系统联系人', key: '0'},
          {label: '外部联系人', key: '1'}
        ]
      };
    },
    methods: {
      expandChange(item) {
        this.queryRuleDetail(item);
        this.queryNotifyDetail(item);
      },
      queryRuleDetail(item) {
        item.loading = true;
        if (item.rules.length) {
          item.loading = false;
          return;
        }
        AlarmRuleGroup.get(item.ccsWarnRuleGroupId).then(res => {
          item.rules = res.data.rules;
          item.loading = false;
        });
      },
      formatContactWay(item) {
        if (item.memberSource === '1') return;
        User.get(item.targetStr).then(res => {
          item.name = res.data.name;
          item.targetStr = item.notifyType === '1' ? res.data.phone : res.data.email;
        });
      },
      queryNotifyDetail(item) {
        if (item.notifyList.length) return;
        NotifyRule.get(item.ccsNotifyListId).then(res => {
          res.data.details.forEach(i => {
            this.formatContactWay(i);
          });
          item.notifyList = res.data.details;
        });
      },
      initRuleList(currentList) {
        currentList.forEach(i => {
          i.rules = [];
          i.notifyList = [];
          i.loading = false;
        });
      }
    }
  };
</script>
