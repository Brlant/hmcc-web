<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">处理告警事件</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="100px" ref="tempForm">
        <el-form-item label="处理人" prop="userId">
          <el-select placeholder="请选择处理人" v-model="form.userId"
                     filterable clearable remote :remote-method="queryUserList" @focus="queryUserList()">
            <el-option :label="item.name" :value="item.id" :key="item.id"
                       v-for="item in userList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理方式" prop="handlingWay"
                      :rules="[{required: true, message: '请选择处理方式', trigger: 'change'}]" v-if="formItem.type === '6'">
          <el-radio-group v-model="form.handlingWay">
            <el-radio label="0">现场</el-radio>
            <el-radio label="1">远程</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理情况" prop="handlingCondition">
          <el-radio-group v-model="form.handlingCondition" class="is-vertical">
            <el-radio :label="item.key" :key="item.key" v-for="item in handleTypeList">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理备注" prop="handlingRemark"
                      :rules="[{required: true, message: '请输入处理备注', trigger: 'blur'}]"
                      v-if="form.handlingCondition === '7'">
          <el-input v-model="form.handlingRemark"></el-input>
        </el-form-item>
        <el-form-item label="相同报警" v-show="sameData">
          <el-checkbox v-model="form.handleSameAlarmFlag">本设备下的该监控探头还有{{sameData}}次相同情况的未处理的报警，是否一同处理？</el-checkbox>
        </el-form-item>
        <el-form-item label="处理时间">
          {{form.handlerTime | time}}
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {alarmEvent, OrgUser} from '@/resources';

  export default {
    data() {
      return {
        form: {
          userId: '',
          handlingCondition: '',
          handleSameAlarmFlag: false,
          handlerTime: '',
          handlingWay: '',
          handlingRemark: ''
        },
        rules: {
          userId: [
            {required: true, message: '请选择处理人', trigger: 'change'}
          ],
          handlingCondition: [
            {required: true, message: '请选择处理情况', trigger: 'change'}
          ]
        },
        doing: false,
        userList: [],
        sameData: 0
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    computed: {
      confirmStatus() {
        return {
          1: '确认',
          2: '取消',
          0: '未确认'
        };
      },
      handleTypeList() {
        if (this.formItem.type === '6') {
          return this.$store.state.handleTypeList.filter(f => ['8', '9', '10', '11', '12', '7'].includes(f.key));
        }
        return this.$store.state.handleTypeList.filter(f => ['1', '2', '3', '4', '5', '6', '7'].includes(f.key));
      }
    },
    watch: {
      index: function (val) {
        this.form = {
          userId: '',
          handlingCondition: '',
          handleSameAlarmFlag: false,
          handlerTime: new Date(),
          handlingWay: '',
          handlingRemark: ''
        };
        this.queryLotsAlarm();
        this.$nextTick(() => {
          this.$refs.tempForm && this.$refs.tempForm.clearValidate();
        });
      }
    },
    methods: {
      queryLotsAlarm() {
        if (!this.formItem.id) return;
        alarmEvent.queryLotsAlarm(this.formItem.id).then(res => {
          if (res.data.code === 200) {
            this.sameData = res.data.data;
          }
        });
      },
      queryUserList(query) {
        let params = {keyWord: query};
        OrgUser.queryUsers(this.$store.state.user.userCompanyAddress, params).then(res => {
          this.userList = res.data.list;
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.form.id = this.formItem.id;
            this.$httpRequestOpera(alarmEvent.batchConfirmItem(this.form), {
              errorTitle: '处理失败',
              success: res => {
                if (res.data.code === 200) {
                  this.doing = false;
                  this.$emit('change', res.data);
                } else {
                  this.doing = false;
                }
              },
              error: () => {
                this.doing = false;
              }
            });
          }
        });
      }
    }
  };
</script>
