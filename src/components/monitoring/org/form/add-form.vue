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
    <template slot="title">添加热点监控</template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="onSubmit('form')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
        <el-form-item label="货主" prop="targetId">
          <org-select v-model="form.targetId" :list="orgList"
                      :remoteMethod="queryOrg" placeholder="请输入名称搜索货主信息"></org-select>
          <!--<oms-input type="text" v-model="form.targetId" placeholder="请输入货主"></oms-input>-->
        </el-form-item>
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
        <!--<el-form-item label="监控状态">-->
        <!--<el-switch active-text="激活" inactive-text="未激活" v-model="form.activeFlag"-->
        <!--active-value="1" inactive-value="0"></el-switch>-->
        <!--</el-form-item>-->
      </el-form>
    </template>
  </dialog-template>
</template>

<script>
  import {MonitoringObjGroup} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        labelWidth: '100px',
        form: {
          targetId: '',
          devIds: [],
          activeFlag: '1',
          relationType: '3'
        },
        rules: {
          targetId: [
            {required: true, message: '请选择货主', trigger: 'change'}
          ],
          devIds: [
            {required: true, type: 'array', message: '请选择设备', trigger: 'change'}
          ]
        },
        doing: false
      };
    },
    computed: {},
    props: ['index'],
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
            if (!this.form.id) {
              this.$httpRequestOpera(MonitoringObjGroup.save(this.form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.form = {
                    targetId: '',
                    devIds: [],
                    activeFlag: '1',
                    relationType: '3'
                  };
                  this.$emit('change', res.data);
                  this.$emit('right-close');
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
