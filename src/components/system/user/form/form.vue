<style lang="scss" scoped>
  .el-form .el-select {
    display: block;
  }
</style>
<template>
  <div>
    <h2 class="clearfix">{{title}}</h2>
    <el-form ref="userForm" :model="form" label-width="100px" :rules="rules"
             @submit.prevent="onSubmit('userForm')" onsubmit="return false">
      <el-form-item label="姓名" prop="name">
        <oms-input type="text" v-model="form.name" placeholder="请输入姓名"></oms-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone" class="contact-check">
        <oms-input type="text" v-model="form.phone" placeholder="请输入手机号码"></oms-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <oms-input type="text" v-model="form.email" placeholder="请输入邮箱"></oms-input>
      </el-form-item>
      <el-form-item label="所属科室" prop="departmentId">
        <el-select v-model="form.departmentId" placeholder="请选择所属科室" clearable filterable  class="contact-check">
          <el-option v-for="(item,index) in departmentList"
                     :key="index"
                     :value="item.departmentId"
                     :label="item.departmentName"
                     :disabled="item.status === '1'"/>
        </el-select>
      </el-form-item>
      <el-form-item label="用户角色" prop="list">
        <el-select placeholder="请选择用户角色" v-model="form.list" multiple filterable clearable>
          <el-option :label="item.title" :value="item.id" :key="item.id" v-for="item in roleSelect"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="100px">
        <el-button type="primary" @click="onSubmit('userForm')" native-type="submit" :disabled="doing">保存</el-button>
        <el-button @click="doClose">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {indexApi, OrgUser, User} from '@/resources';

  export default {
    name: 'editForm',
    props: {
      formItem: {
        type: Object,
        default: {},
        required: true
      },
      title: {
        type: String,
        default: '增加'
      },
      action: {
        type: String,
        default: ''
      },
      actionType: {
        type: Boolean,
        default: true
      }
    },
    data: function () {
      let checkEmail = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else {
          let re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ig;
          if (!re.test(value)) {
            callback(new Error('请输入正确的邮箱'));
          }
          let orgId = this.$store.state.user.userCompanyAddress;
          User.checkEmail(value, this.form.id, orgId).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('邮箱已经存在'));
            }
          });
        }
      };
      let checkPhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号码'));
        } else {
          let re = /^1[345789]\d{9}$/;
          if (!re.test(value)) {
            callback(new Error('请输入正确的手机号码'));
          }
          let orgId = this.$store.state.user.userCompanyAddress;
          User.checkPhone(value, this.form.id, orgId).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('手机号码已经存在'));
            }
          });
        }
      };
      return {
        roleId: '',
        form: {
          name: '',
          phone: '',
          email: '',
          departmentId:'',//科室id
          list: []
        },
        rules: {
          name: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {validator: checkPhone, trigger: 'blur'}
          ],
          email: [
//            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          roleId: [
            {required: true, message: '请输入用户角色', trigger: 'blur'}
          ],
          list: [
            {required: true, type: 'array', message: '请选择用户角色', trigger: 'change'}
          ]
        },
        roleSelect: [],
        departmentList:[],//科室列表
        doing: false
      };
    },
    computed: {
      user() {
        return this.$store.state.user;
      }
    },
    mounted() {
      this.getRoleSelect();
      //科室列表
      this.getDevicesList()
    },
    watch: {
      formItem: function (val) {
        this.$refs['userForm'].clearValidate();
        if (val.id) {
          this.form = this.formItem;
          this.form.list = this.formItem.list.map(m => m.roleId);
        } else {
          this.form = {
            name: '',
            phone: '',
            email: '',
            list: []
          };
        }
      },
      showRight: function (val) {
        if (!val) {
          this.$refs['userForm'].resetFields();
        }
      },
      user(val) {
        this.getRoleSelect();
      }
    },
    methods: {
      /* 科室列表 */
      getDevicesList() {
        indexApi.getDeptQueryList({}).then(res => {
          this.departmentList = res.data.map(item => {
            return {
              departmentName: item.departmentName,
              departmentPosition: item.departmentPosition,
              departmentId: item.id,
              status: item.status
            }
          })
        })
      },
      getRoleSelect: function () {
        let orgId = this.user.userCompanyAddress;
        if (!orgId) {
          this.roleSelect = [];
          return;
        }
        let params = {objectId: 'hmcc-system'};
        this.$http.get(`/erp-access/orgs/${orgId}/self`, {params}).then(res => {
          this.roleSelect = res.data;
        });
      },
      onSubmit: function (formName) {
        let self = this;
        if (this.doing) return;
        this.doing = true;
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.doing = false;
            return false;
          }
          this.doing = true;
          let formData = JSON.parse(JSON.stringify(this.form));
          formData.list = self.form.list.map(m => {
            return {
              roleId: m
            };
          });
          formData.orgId = this.user.userCompanyAddress;
          formData.systemObjectId = 'hmcc-system';
          if (this.action === 'add') {
            OrgUser.save(formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '新增用户"' + self.form.name + '"成功'
              });
              formData.list = this.getSelectRoles(formData, this.roleSelect);
              self.$emit('change', formData);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '新增用户"' + self.form.name + '"失败'
              });
              this.doing = false;
            });
          } else {
            OrgUser.update(self.form.id, formData).then(() => {
              this.doing = false;
              this.$notify.success({
                duration: 2000,
                name: '成功',
                message: '修改用户"' + self.form.name + '"成功'
              });
              formData.list = this.getSelectRoles(formData, this.roleSelect);
              self.$emit('change', formData);
            }).catch(() => {
              this.$notify.error({
                duration: 2000,
                message: '修改用户"' + self.form.name + '"失败'
              });
              this.doing = false;
            });
          }
        });
      },
      getSelectRoles(formData, roles) {
        return roles.filter(f => formData.list.some(s => s.roleId === f.id)).map(m => {
          return {
            roleId: m.id,
            title: m.title
          };
        });
      },
      doClose: function () {
        this.$emit('close');
        this.$refs['userForm'].resetFields();
      }
    }
  };
</script>
