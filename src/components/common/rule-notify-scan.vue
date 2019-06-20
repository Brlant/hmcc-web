<style lang="scss" scoped>
  .el-form__btn {
    position: absolute;
    left: 95px;
    top: 8px;
  }
</style>
<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <des-btn class="el-form__btn" v-has="perm" icon="plus" @click="isShowRule = true">添加</des-btn>
    <div class="add-info-part" v-show="isShowRule">
      <el-form-item label="配置方式" v-show="type === 'd'">
        <el-radio-group v-model="configType" size="small" @change="configTypeChange">
          <el-radio-button :label="0">整体</el-radio-button>
          <el-radio-button :label="1">单个设备</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="告警规则组" prop="ccsWarnRuleGroupId">
        <el-select placeholder="请输入名称搜索告警规则组" v-model="form.ccsWarnRuleGroupId"
                   @click.once.native="queryRuleGroupList('')"
                   filterable clearable remote :remote-method="queryRuleGroupList">
          <el-option :label="item.ruleGroupName" :value="item.id" :key="item.id"
                     v-for="item in ruleGroupList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知列表" prop="ccsNotifyListId">
        <el-select placeholder="请输入名称搜索通知列表" v-model="form.ccsNotifyListId" @click.once.native="queryNotifyList('')"
                   filterable clearable remote :remote-method="queryNotifyList">
          <el-option :label="item.notifyListName" :value="item.id" :key="item.id"
                     v-for="item in notifyList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备" prop="ccsMonitorRelationId" v-if="configType && type === 'd'">
        <el-select popper-class="selects--custom" placeholder="请输入名称搜索设备" v-model="form.ccsMonitorRelationId"
                   clearable filterable @focus="queryDevList">
          <el-option :label="item.devName" :value="item.ccsMonitorRelationId" :key="item.id"
                     v-for="(item, index) in currentDevList">
            <dev-option-info :item="item"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="save" :disabled="doing">保存</el-button>
        <el-button plain size="small" @click="cancel">取消</el-button>
      </el-form-item>
    </div>
    <el-form-item label-width="0">
      <el-table header-row-class-name="table-header-color" class="el-table--expand"
                :data="ruleList" v-loading="loading" @expand-change="expandChange"
                style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props1">
            <rule-util :props1="props1"></rule-util>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="devName" min-width="150">
          <template slot-scope="scope">
            <span>{{scope.row.devName}}</span>
            <div>
              <span>编码:{{scope.row.devCode}}</span> / <span>编号:{{scope.row.devNo}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="告警规则组" prop="warnRuleGroupName"/>
        <el-table-column label="通知列表" prop="notifyListName"/>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <des-btn v-has="perm" icon="delete" @click="deleteRule(scope.row)">删除</des-btn>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>
<script>
  import {AlarmRuleGroup, BindRule, DevMonitoring, NotifyRule} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import ruleUtil from './rule-notify-util';

  export default {
    name: 'rule-notify-scan',
    props: {
      unitId: String,
      perm: String
    },
    components: {ruleUtil},
    mixins: [methodsMixin, ruleUtil],
    data() {
      return {
        isShow: false,
        isShowRule: false,
        isShowNotify: false,
        pageSets: [
          {name: '规则信息', key: 1}
        ],
        currentTab: {},
        form: {
          ccsWarnRuleGroupId: '',
          ccsNotifyListId: '',
          ccsMonitorRelationId: ''
        },
        rules: {
          ccsWarnRuleGroupId: [
            {required: true, message: '请选择告警规则组', trigger: 'change'}
          ],
          ccsNotifyListId: [
            {required: true, message: '请选择通知列表', trigger: 'change'}
          ],
          ccsMonitorRelationId: [
            {required: true, message: '请选择设备', trigger: 'change'}
          ]
        },
        doing: false,
        actionType: '添加',
        ruleList: [],
        ruleGroupList: [],
        notifyList: [],
        loading: false,
        configType: 0, // 配置方式 1 整体 0 单个设备
        type: '', // 监控对象组类型 s 库区单个设备对象 o 货主热点设备对象 d 设备监控对象 空字符串 其他对象
        curUnitId: '', // 格式化后的id 代替unitId
        currentDevList: [] // 当前对象的设备列表
      };
    },
    watch: {
      unitId: {
        handler(val) {
          this.form = {
            ccsWarnRuleGroupId: '',
            ccsNotifyListId: ''
          };
          this.configType = 0;
          this.type = '';
          this.curUnitId = '';
          this.currentDevList = [];
          if (val) {
            this.isShow = true;
            this.handleUnitId();
            this.cancel();
            this.queryRuleList();
          }
        },
        immediate: true
      }
    },
    mounted() {

    },
    methods: {
      resetRightBox() {
        this.isShow = false;
        this.$store.commit('initUnitId', '');
      },
      selectTab(item) {
        this.currentTab = item;
      },
      configTypeChange(val) {

      },
      queryDevList() {
        DevMonitoring.get(this.curUnitId).then(res => {
          res.data.devs.forEach((i, index) => {
            i.ccsMonitorRelationId = res.data.monitorRelationIds && res.data.monitorRelationIds[index] || '';
          });
          this.currentDevList = res.data.devs || [];
        });
      },
      handleUnitId() {
        let ary = this.unitId.split(',');
        if (ary.length === 2) {
          this.curUnitId = ary[1];
          this.type = ary[0];
          if (this.type !== 'd') {
            this.configType = 1;
          }
        } else {
          this.curUnitId = ary[0];
          this.type = '';
        }
      },
      queryRuleList() {
        this.ruleList = [];
        if (!this.curUnitId) return;
        const params = {
          pageNo: 1,
          pageSize: 500
        };
        if (this.type === 's' || this.type === 'o') {
          params.ccsMonitorRelationId = this.curUnitId;
        } else {
          params.monitorTargetId = this.curUnitId;
        }
        this.loading = true;
        BindRule.query(params).then(res => {
          this.initRuleList(res.data.currentList);
          this.ruleList = res.data.currentList || [];
          this.loading = false;
        });
      },
      queryRuleGroupList(query) {
        const params = {
          ruleGroupName: query,
          pageNo: 1,
          pageSize: 500
        };
        AlarmRuleGroup.query(params).then(res => {
          this.ruleGroupList = res.data.currentList || [];
        });
      },
      queryNotifyList(query) {
        const params = {
          notifyListName: query
        };
        NotifyRule.query(params).then(res => {
          this.notifyList = res.data.currentList || [];
        });
      },
      deleteRule(item) {
        this.$confirmOpera(`是否删除规则组"${item.warnRuleGroupName}"`, () => {
          const ids = [item.id];
          this.$httpRequestOpera(this.$http.delete('/ccsNotifyPlan', {
            data: {ids}
          }), {
            successTitle: '删除成功',
            errorTitle: '删除失败',
            success: () => {
              this.queryRuleList();
            }
          });
        });
      },
      cancel() {
        this.isShowRule = false;
        this.$refs['form'] && this.$refs['form'].resetFields();
        this.form = {
          ccsWarnRuleGroupId: '',
          ccsNotifyListId: '',
          ccsMonitorRelationId: ''
        };
      },
      save() {
        this.$refs['form'].validate((valid) => {
          if (valid && this.doing === false) {
            if (!this.form.id) {
              let http = {};
              if (this.configType === 1) {
                this.form.ccsMonitorRelationIds = this.type === 'd' ? [this.form.ccsMonitorRelationId] : [this.curUnitId];
                http = BindRule.bindCcsNotifyPlans;
                this.form.ccsMonitorRelationId = undefined;
              } else {
                this.form.monitorTargetId = this.curUnitId;
                http = BindRule.bindCcsNotifyPlan;
              }
              this.doing = true;
              this.$httpRequestOpera(http(this.form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.$refs['form'].resetFields();
                  this.queryRuleList();
                },
                error: () => {
                  this.doing = false;
                }
              });
            }
          }
        });
      }
    }
  };
</script>
