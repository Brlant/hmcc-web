<style lang="scss" scoped>
  .part-hj-box {
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .el-select {
    display: block;
  }

  .form-item-row {
    margin-bottom: 10px;
    line-height: 16px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">设备位置</template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="横坐标" prop="positionX">
          <el-input v-model.number="form.positionX" placeholder="请选择横坐标"></el-input>
        </el-form-item>
        <el-form-item label="纵坐标" prop="positionY">
          <el-input v-model.number="form.positionY" placeholder="请选择纵坐标"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {WarehouseDevRelation} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        labelWidth: '100px',
        form: {
          positionX: '',
          positionY: ''
        },
        rules: {
          positionX: [
            {required: true, type: 'number', message: '请选择横坐标', trigger: 'blur'}
          ],
          positionY: [
            {required: true, type: 'number', message: '请选择纵坐标', trigger: 'blur'}
          ]
        },
        doing: false
      };
    },
    props: ['index', 'tempItem'],
    watch: {
      index: function (val) {
        this.$refs['form'].resetFields();
        this.form.positionX = this.tempItem.positionX;
        this.form.positionY = this.tempItem.positionY;
      }
    },
    methods: {
      doClose() {
        this.$emit('right-close');
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
            if (!valid || this.doing) return;
            if (!this.form.id) {
              let form = [{
                id: this.tempItem.id,
                positionX: this.form.positionX,
                positionY: this.form.positionY
              }];
              this.$httpRequestOpera(this.$http.put('/ccsWarehouseDevRelation', form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.form = {
                    positionX: '',
                    positionY: ''
                  };
                  this.$emit('refresh');
                },
                error: () => {
                  this.doing = false;
                }
              });
            }
          }
        );
      }
    }

  };
</script>
