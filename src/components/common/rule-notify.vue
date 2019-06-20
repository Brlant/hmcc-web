<template>
  <page-right :css="{'width':'900px','padding':0}" :show="isShow" @right-close="resetRightBox">
    <dialog-template :pageSets="pageSets" @selectTab="selectTab">
      <template slot="title">配置规则</template>
      <template slot="btnSave">
        <!--<el-button type="primary" plain @click="save('tempForm')" :disabled="doing">保存</el-button>-->
      </template>
      <template slot="content">
        <el-form :model="form" :rules="rules" label-width="100px" ref="form">
          <div class="form-header-part">
            <el-row>
              <el-col :span="12">
                <div class="header">
                  <div class="sign f-dib"></div>
                  <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
                    {{pageSets[0].name}}</h3>
                </div>
              </el-col>
              <el-col :span="12" class="text-right">
                <des-btn @click="isShowRule = true" icon="plus" v-has="'show'">添加</des-btn>
              </el-col>
            </el-row>
            <div class="content  mt-10">
              <div class="add-info-part" v-show="isShowRule">
                <el-form-item label="配置方式" v-show="type === 'd'">
                  <el-radio-group @change="configTypeChange" size="small" v-model="configType">
                    <el-radio-button :label="0">整体</el-radio-button>
                    <el-radio-button :label="1">单个设备</el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="告警规则组" prop="ccsWarnRuleGroupId">
                  <el-select :remote-method="queryRuleGroupList" @click.once.native="queryRuleGroupList('')"
                             clearable
                             filterable placeholder="请输入名称搜索告警规则组" remote v-model="form.ccsWarnRuleGroupId">
                    <el-option :key="item.id" :label="item.ruleGroupName" :value="item.id"
                               v-for="item in ruleGroupList"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="通知列表" prop="ccsNotifyListId">
                  <el-select :remote-method="queryNotifyList" @click.once.native="queryNotifyList('')"
                             clearable
                             filterable placeholder="请输入名称搜索通知列表" remote v-model="form.ccsNotifyListId">
                    <el-option :key="item.id" :label="item.notifyListName" :value="item.id"
                               v-for="item in notifyList"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="设备" prop="ccsMonitorRelationId" v-if="configType && type === 'd'">
                  <el-select @focus="queryDevList" clearable filterable
                             placeholder="请输入名称搜索设备" popper-class="selects--custom" v-model="form.ccsMonitorRelationId">
                    <el-option :key="item.id" :label="item.devName" :value="item.ccsMonitorRelationId"
                               v-for="(item, index) in currentDevList">
                      <dev-option-info :item="item"/>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button :disabled="doing" @click="save" size="small" type="primary">保存</el-button>
                  <el-button @click="cancel" plain size="small">取消</el-button>
                </el-form-item>
              </div>
              <el-form-item label-width="0">
                <el-table :data="ruleList" @expand-change="expandChange"
                          class="el-table--expand"
                          header-row-class-name="table-header-color" style="width: 100%;" v-loading="loading">
                  <el-table-column type="expand">
                    <template slot-scope="props1">
                      <rule-util :props1="props1"></rule-util>
                    </template>
                  </el-table-column>
                  <el-table-column label="设备名称" min-width="110" prop="devName"/>
                  <el-table-column label="设备编码" prop="devCode"/>
                  <el-table-column label="告警规则组" prop="warnRuleGroupName"/>
                  <el-table-column label="通知列表" prop="notifyListName"/>
                  <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                      <des-btn @click="deleteRule(scope.row)" icon="delete" v-has="'show'">删除</des-btn>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </template>
    </dialog-template>
  </page-right>
</template>
<script>
  import {AlarmRuleGroup, BindRule, DevMonitoring, NotifyRule} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import ruleUtil from './rule-notify-util';

  export default {
    props: ['formItem', 'index'],
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
    computed: {
      unitId() {
        return this.$store.state.unitId;
      }
    },
    watch: {
      index: function (val) {
        if (val !== 0) return;
        if (this.formItem.id) {
          this.form = {
            ccsWarnRuleGroupId: '',
            ccsNotifyListId: ''
          };
          this.actionType = '编辑';
        } else {
          this.form = {
            ccsWarnRuleGroupId: '',
            ccsNotifyListId: ''
          };
          this.actionType = '添加';
        }
      },
      unitId(val) {
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
        this.$refs['form'].resetFields();
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
