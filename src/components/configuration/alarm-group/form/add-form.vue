<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}告警规则组</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="tempForm">
        <el-form-item label="规则组名称" prop="ruleGroupName">
          <oms-input placeholder="请输入规则名称" type="text" v-model="form.ruleGroupName"></oms-input>
        </el-form-item>
        <el-form-item label="告警规则" prop="rules">
          <el-select :remote-method="queryRule" filterable
                     multiple placeholder="请输入名称搜索告警规则" remote v-model="form.rules">
            <el-option :key="item.id" :label="item.ruleName" :value="item.id"
                       v-for="item in ruleList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {AlarmRule, AlarmRuleGroup} from '@/resources';

  export default {
    data() {
      return {
        formModel: {
          ruleGroupName: '',
          rules: [],
          ruleIds: ''
        },
        form: {},
        doing: false,
        rules: {
          ruleGroupName: [
            {required: true, message: '请输入规则名称', trigger: 'blur'}
          ],
          rules: [
            {required: true, type: 'array', message: '请选择告警规则', trigger: 'change'}
          ]
        },
        actionType: '添加',
        ruleList: []
      };
    },
    computed: {},
    props: ['formItem', 'index'],
    watch: {
      index: function (val) {
        if (val !== 0) return;
        this.$refs['tempForm'].resetFields();
        if (this.formItem.id) {
          this.queryDetail();
          this.actionType = '编辑';
        } else {
          this.form = Object.assign({}, this.formModel);
          this.actionType = '添加';
        }
      }
    },
    methods: {
      queryRule(query, setRuleListWhenEdit) {
        const params = {
          ruleName: query,
          pageNo: 1,
          PageNo: 500
        };
        AlarmRule.query(params).then(res => {
          this.ruleList = res.data.currentList || [];
          setRuleListWhenEdit();
        });
      },
      queryDetail() {
        AlarmRuleGroup.get(this.formItem.id).then(res => {
          const rules = res.data.rules;
          res.data.rules = [];
          this.form = Object.assign({}, res.data);
          this.form.ruleList = rules;
          this.queryRule('', this.setRuleListWhenEdit);
        });
      },
      setRuleListWhenEdit() {
        if (!this.form.id) return;
        this.form.ruleList.forEach(i => {
          let isHas = this.ruleList.some(s => s.id === i.id);
          if (!isHas) {
            this.ruleList.push({
              id: i.id,
              ruleName: i.ruleName
            });
          }
        });
        this.form.rules = this.form.ruleList && this.form.ruleList.map(m => m.id);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            let form = JSON.parse(JSON.stringify(this.form));
            form.ruleIds = form.rules.join(',');
            form.rules = undefined;
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(AlarmRuleGroup.save(form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.$emit('change', res.data);
                },
                error: () => {
                  this.doing = false;
                }
              });
            } else {
              this.$httpRequestOpera(AlarmRuleGroup.update(form.id, form), {
                successTitle: '修改成功',
                errorTitle: '修改失败',
                success: res => {
                  this.doing = false;
                  this.$emit('change', res.data);
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
