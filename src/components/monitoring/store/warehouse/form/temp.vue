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
    <template slot="title">绑定设备</template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="设备" prop="devIds">
          <el-select popper-class="selects--custom" placeholder="请输入名称搜索设备" v-model="form.devIds"
                     @click.once.native="queryAllTemp('')"
                     multiple reserve-keyword filterable remote :remote-method="queryAllTemp">
            <el-option :label="item.devName" :value="item.id" :key="item.id"
                       v-for="(item, index) in allTempList">
              <dev-option-info :item="item"/>
            </el-option>
          </el-select>
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
          warehouseId: '',
          devIds: []
        },
        rules: {
          devIds: [
            {required: true, type: 'array', message: '请选择设备', trigger: 'change'}
          ]
        },
        doing: false
      };
    },
    props: ['index', 'area'],
    watch: {
      index: function (val) {
        this.$refs['form'].resetFields();
      }
    },
    methods: {
      doClose() {
        this.$emit('right-close');
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
            if (!valid || this.doing) return;
            this.form.warehouseId = this.area.id;
            if (!this.form.id) {
              this.$httpRequestOpera(WarehouseDevRelation.save(this.form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.form.warehouseId = '';
                  this.form.devIds = [];
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
