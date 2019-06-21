<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="tempForm">
        <el-form-item label="编号" prop="no">
          <oms-input placeholder="请输入设备编号" type="input" v-model="form.no"/>
        </el-form-item>
        <el-form-item label="所属单位" prop="orgId">
          <org-select :list="orgList"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索单位" v-model="form.orgId"></org-select>
        </el-form-item>
        <el-form-item label="型号" prop="version">
          <oms-input placeholder="请输入型号" v-model="form.version"/>
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <oms-input placeholder="请输入品牌" v-model="form.brand"/>
        </el-form-item>
        <el-form-item label="SIM">
          <oms-input placeholder="请输入SIM" v-model="form.sim"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {gateway} from '@/resources';

  export default {
    data() {
      return {
        form: {},
        doing: false,
        rules: {
          no: [
            {required: true, message: '请输入编码', trigger: 'blur'}
          ],
          version: [
            {required: true, message: '请输入型号', trigger: 'blur'}
          ],
          brand: [
            {required: true, message: '请输入品牌', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择所属单位', trigger: 'change'}
          ]
        },
        actionType: '添加',
        orgList: []
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    watch: {
      index: function (val) {
        this.$refs['tempForm'].clearValidate();
        if (this.formItem.id) {
          this.orgList = [
            {name: this.formItem.orgName, id: this.formItem.orgId}
          ];
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {};
          this.actionType = '添加';
        }
      }
    },
    methods: {
      queryAllOrg: function (query) {// 查询货主
        let params = {keyWord: query};
        this.$http.get('/orgs/pager', {params: params}).then(res => {
          this.orgList = res.data.list;
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {

            this.orgList.forEach(i => {
              if(i.id === this.form.orgId) {
                this.form.orgName = i.name;
              }
            });
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(gateway.save(this.form), {
                errorTitle: '添加失败',
                success: res => {
                  if(res.data.code === 200) {
                    this.$notify.success({message: '添加成功'});
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
            } else {
              this.$httpRequestOpera(gateway.update(this.form), {
                errorTitle: '修改失败',
                success: res => {
                  if(res.data.code === 200) {
                    this.$notify.success({message: '修改成功'});
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
          }
        });
      }
    }
  };
</script>
