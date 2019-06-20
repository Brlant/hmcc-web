<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}告警规则</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="tempForm">
        <el-form-item label="规则名称" prop="ruleName">
          <oms-input placeholder="请输入规则名称" type="text" v-model="form.ruleName"></oms-input>
        </el-form-item>
        <two-column>
          <el-form-item label="规则条件逻辑" prop="logicType" slot="left">
            <el-radio-group size="small" v-model="form.logicType">
              <el-radio-button :key="item.key" :label="item.key" v-for="item in logicList">{{item.label}}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="级别" prop="warnLevel" slot="right">
            <el-radio-group size="small" v-model="form.warnLevel">
              <el-radio-button :key="item.key" :label="item.key" v-for="item in levels">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </two-column>


        <el-form-item label="延时通知时间" prop="warnKeepTime">
          <!--<oms-input type="text" v-model.number="form.warnKeepTime" placeholder="请输入延时通知时间">-->
          <!--<template slot="append">min</template>-->
          <!--</oms-input>-->
          <el-select placeholder="请选择延时通知时间" v-model="form.warnKeepTime">
            <el-option :key="key * 1" :label="item" :value="key * 1"
                       v-for="(item, key) in offLine">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <des-btn @click="addRule" icon="plus" v-has="'show'" v-show="isShowAddRuleBtn">添加条件</des-btn>
        </el-form-item>
        <div :key="index" class="part-border-box no-border" v-for="(item, index) in form.details">
          <el-row>
            <el-col :span="8">
              <el-form-item :prop="`details.${index}.monitorType`"
                            :rules="[{ required: true, message: '请选择监控项', trigger: 'change' }]"
                            label-width="0">
                <el-select :disabled="item.checkDisabled" @change="checkChange(item)"
                           placeholder="请选择监控项" v-model="item.monitorType">
                  <el-option :key="item.key" :label="item.label" :value="item.key"
                             v-for="item in checkList" v-show="item.show"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="4" align="center">
              <el-form-item :prop="`details.${index}.compareType`"
                            :rules="[{ required: true, message: '请选择条件', trigger: 'change' }]"
                            label-width="0">
                <el-select :disabled="item.disabled" @change="compareTypeChange(item, index)" placeholder="请选择条件"
                           v-model="item.compareType">
                  <el-option :key="item.key" :label="item.label" :value="item.key"
                             v-for="item in conditions"
                             v-show="item.monitorType !== '4' && item.key!== '2'"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="8">
              <el-form-item :prop="`details.${index}.threshold`"
                            :rules="[{ required: true, message: '请输入阀值', trigger: 'blur' }]" label-width="0"
                            v-show="item.monitorType !== '4'">
                <oms-input :disabled="item.thresholdDisabled" placeholder="请输入阀值" type="text" v-model="item.threshold">
                  <template slot="append" v-if="unitIcon(item)">{{unitIcon(item)}}</template>
                </oms-input>
              </el-form-item>
              <el-form-item :prop="`details.${index}.threshold`"
                            :rules="[{ required: true, message: '请选择阀值', trigger: 'change' }]" label-width="0"
                            v-show="item.monitorType === '4'">
                <el-select :disabled="item.thresholdDisabled" placeholder="请输入阀值"
                           v-model="item.threshold">
                  <el-option :key="key * 1" :label="item" :value="key * 1" v-for="(item, key) in offLine"
                             v-show="key > 0"></el-option>
                </el-select>
              </el-form-item>

            </el-col>
            <el-col :span="2" align="center" class="opera-btn">
              <des-btn @click="deleteRule(item)" icon="delete" v-has="'show'"/>
            </el-col>
          </el-row>
          <!--<el-row>-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label-width="0"-->
          <!--:rules="[{ required: true, message: '请选择生效开始时间', trigger: 'change' }]">-->
          <!--<el-time-picker v-model="item.startTime" placeholder="请选择生效开始时间"/>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="1"></el-col>-->
          <!--<el-col :span="8">-->
          <!--<el-form-item label-width="0"-->
          <!--:rules="[{ required: true, message: '请选择生效结束时间', trigger: 'change' }]">-->
          <!--<el-time-picker v-model="item.endTime" type="date" placeholder="请选择生效结束时间"/>-->
          <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="1"></el-col>-->
          <!--<el-col :span="6">-->

          <!--</el-col>-->
          <!--</el-row>-->
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {AlarmRule} from '@/resources';

  export default {
    data() {
      return {
        formModel: {
          ruleName: '',
          logicType: '0',
          warnLevel: '0',
          warnKeepTime: 0,
          details: []
        },
        ruleModel: {
          monitorType: '',
          compareType: '0',
          warnLevel: '1',
          startTime: '',
          endTime: '',
          threshold: '',
          checkDisabled: false,
          disabled: false,
          thresholdDisabled: false
        },
        form: {},
        doing: false,
        rules: {
          ruleName: [
            {required: true, message: '请输入规则名称', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请输入类型', trigger: 'blur'}
          ],
          logicType: [
            {required: true, message: '请选择规则条件逻辑', trigger: 'change'}
          ],
          warnKeepTime: [
            {required: true, message: '请输入延时通知时间', trigger: 'blur'}
          ]
        },
        actionType: '添加',
        offLine: this.$parent.$parent.offLine,
        checkList: this.$parent.$parent.checkList,
        conditions: this.$parent.$parent.conditions,
        levels: this.$parent.$parent.levels,
        logicList: this.$parent.$parent.logicList
      };
    },
    computed: {
      isShowAddRuleBtn() {
        // 添加条件，最多是条件的种类个数
        // 种类有2种
        // 特殊情况，选择离线时间时，只能是一条规则
        let details = this.form.details || [];
        return !(details.length > 1 || details.length === 1 && details[0].monitorType === '4');
      }
    },
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
      addRule() {
        let details = this.form.details || [];
        if (!details.length) {
          details.push(Object.assign({}, this.ruleModel));
          return;
        }
        details.push(Object.assign({}, details[0], {
          threshold: '',
          checkDisabled: this.switchDisabled(),
          disabled: this.switchDisabled(),
          thresholdDisabled: false,
          compareType: this.switchCompareType(details[0].compareType)
        }));
      },
      switchDisabled() {
        return this.form.details && this.form.details.length && this.form.details[0].disabled;
      },
      switchCompareType(val) {
        return val === '0' ? '1' : '0';
      },
      deleteRule(item) {
        let index = this.form.details.indexOf(item);
        index !== -1 && this.form.details.splice(index, 1);
      },
      unitIcon(item) {
        let ary = this.checkList.filter(f => f.key === item.monitorType);
        return ary.length ? ary[0].unit : '';
      },
      checkChange(item) {
        item.disabled = item.monitorType === '4';
        item.threshold = item.disabled ? '' : '';

        //若选择离线时间，删除其他条件
        if (item.monitorType === '4') {
          item.compareType = '1';
          if (this.form.details.length > 1) {
            this.form.details = [item];
          }
          return;
        }
        // 若是其他监控项， 所有条件的监控项，都设成一样
        this.form.details.forEach(i => {
          i.monitorType = item.monitorType;
        });
      },
      // 条件改变时，若条件个数是2条，切换对应的另外一条数据
      compareTypeChange(item, index) {
        let details = this.form.details || [];
        if (details.length !== 2) return;
        let modifierIndex = index === 0 ? 1 : 0;
        let modifierItem = Object.assign({}, details[modifierIndex], {
          compareType: this.switchCompareType(details[modifierIndex].compareType)
        });
        details.splice(modifierIndex, 1, modifierItem);
      },
      // 打开弹窗，判断监控项，离线时间，只能添加一个条件
      modifierCheckList(item) {
        let count = 0;
        this.form.details.forEach(i => {
          if (i.monitorType === '4') {
            count++;
          }
        });
        this.checkList[3].show = !count || (count && item.monitorType === '4');
      },
      queryDetail() {
        AlarmRule.get(this.formItem.id).then(res => {
          this.setTime(res.data);
          res.data.details.forEach(i => {
            i.checkDisabled = true;
            i.disabled = true;
            i.thresholdDisabled = true;
          });
          this.form = res.data;
        });
      },
      setTime(data) {
        if (!data.details) return;
        data.details.forEach(i => {
          let str = this.$moment().format('YYYY-MM-DD') + ' ';
          i.startTime && (i.startTime = new Date(i.startTime = str + i.startTime));
          i.endTime && (i.endTime = new Date(i.endTime = str + i.endTime));
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (!this.form.details.length) {
              this.$notify.info({
                message: '请添加条件'
              });
              return;
            }
            const parent = this.$parent.$parent;
            let form = JSON.parse(JSON.stringify(this.form));
            form.details.forEach(i => {
              i.startTime = parent.formatTime(i.startTime, 'HH:mm:ss');
              i.endTime = parent.formatTime(i.endTime, 'HH:mm:ss');
            });
            this.doing = true;

            if (!this.form.id) {
              this.$httpRequestOpera(AlarmRule.save(form), {
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
              this.$httpRequestOpera(AlarmRule.update(form.id, form), {
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
