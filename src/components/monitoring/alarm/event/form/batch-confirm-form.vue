<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">批量处理告警事件</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('batchForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" label-width="100px" ref="batchForm">
        <el-form-item label="类型" prop="devName">
          <el-radio-group size="small" v-model="form.confirmType">
            <el-radio-button :key="key" :label="key"
                             v-for="(item, key) in confirmStatus">{{item}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="情况说明">
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
        doing: false
      };
    },
    props: {
      idList: Array
    },
    computed: {
      confirmStatus() {
        return {
          1: '确认',
          2: '取消'
        };
      }
    },
    watch: {
      idList: function (val) {
        this.form = {
          confirmType: '1',
          confirmContent: ''
        };
      }
    },
    methods: {
      save(formName) {
        this.form.warnRecordIdList = this.idList;
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.$httpRequestOpera(WarnRecord.batchConfirmItem(this.form), {
              successTitle: '批量处理成功',
              errorTitle: '批量处理失败',
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
