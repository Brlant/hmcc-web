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
    <template slot="title">添加分布图</template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="名称" prop="imageName">
          <oms-input v-model="form.imageName"></oms-input>
        </el-form-item>
        <el-form-item label="上传分布图">
          <oms-upload ref="uploadFile" @change="changeFiles" :limit="1"></oms-upload>
        </el-form-item>
        <el-form-item label="物流中心">
          <el-select placeholder="请选择物流中心" v-model="form.logsicId" @click.once.native="queryLogisticsCenterList('')"
                     filterable clearable remote :remote-method="queryLogisticsCenterList" @change="logsicChange">
            <el-option :label="item.warehouseCode" :value="item.id" :key="item.id"
                       v-for="item in logisticsCenterList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库" prop="warehouseIds">
          <el-select placeholder="请选择仓库" v-model="form.warehouseIds"
                     filterable clearable multiple>
            <el-option :label="item.warehouseCode" :value="item.id" :key="item.id"
                       v-for="item in warehouseList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {CcsWarehouse, warehouseDevImage} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        labelWidth: '100px',
        form: {
          imageName: '',
          logsicId: '',
          warehouseIds: [],
          imageId: '',
          imageUrl: ''
        },
        logisticsCenterList: [],
        warehouseList: [],
        rules: {
          imageName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          logsicId: [
            {required: true, message: '请选择物流中心', trigger: 'change'}
          ],
          warehouseIds: [
            {required: true, type: 'array', message: '请选择仓库', trigger: 'change'}
          ]
        },
        doing: false
      };
    },
    props: ['index', 'formItem'],
    watch: {
      index: function (val) {
        this.$refs['form'].resetFields();
        this.$refs.uploadFile.$refs.upload.clearFiles();
      }
    },
    methods: {
      doClose() {
        this.$emit('right-close');
      },
      queryLogisticsCenterList: function () {
        let param = {
          warehouseType: '0',
          activeFlag: '1'
        };
        CcsWarehouse.queryAllList(param).then(res => {
          this.logisticsCenterList = res.data.currentList;
        });
      },
      queryWarehouse: function () {
        if (!this.form.logsicId) return;
        let param = {
          parentId: this.form.logsicId,
          warehouseType: '1',
          activeFlag: '1'
        };
        CcsWarehouse.queryAllList(param).then(res => {
          this.warehouseList = res.data.currentList;
        });
      },
      logsicChange() {
        this.form.warehouseIds = [];
        this.queryWarehouse();
      },
      changeFiles(files) {
        this.form.imageId = files.length ? files[0].attachmentId : '';
        this.form.imageUrl = files.length ? files[0].attachmentStoragePath : '';
      },
      onSubmit: function (formName) {
        this.$refs[formName].validate((valid) => {
            if (!valid || this.doing) return;
            if (!this.form.id) {
              let form = {
                imageName: this.form.imageName,
                imageUrl: this.form.imageUrl,
                imageId: this.form.imageId,
                warehouseIds: this.form.warehouseIds
              };
              this.$httpRequestOpera(warehouseDevImage.save(form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.$emit('refresh');
                  this.form = {
                    imageName: '',
                    logsicId: '',
                    warehouseIds: [],
                    imageId: '',
                    imageUrl: ''
                  };
                  this.$refs.uploadFile.$refs.upload.clearFiles();
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
