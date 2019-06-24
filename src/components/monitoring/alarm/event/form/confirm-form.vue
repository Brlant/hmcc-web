<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">处理告警事件</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="100px" ref="tempForm">
        <el-form-item label="情况说明" prop="confirmContent">
          <oms-input placeholder="请输入情况说明" type="textarea" v-model="form.confirmContent"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {WarnRecord} from '@/resources';

  export default {
    data() {
      return {
        form: {
          confirmType: '1',
          confirmContent: ''
        },
        rules: {
          confirmContent: [
            {required: true, message: '请输入情况说明', trigger: 'blur'}
          ]
        },
        doing: false
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
      }
    },
    watch: {
      index: function (val) {
        this.form = {
          confirmType: '1',
          confirmContent: ''
        };
      }
    },
    methods: {
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.$httpRequestOpera(WarnRecord.update(this.formItem.id, this.form), {
              successTitle: '处理成功',
              errorTitle: '处理失败',
              success: res => {
                this.doing = false;
                this.$emit('change', res.data);
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
