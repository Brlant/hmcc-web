<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}巡检计划</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="tempForm">
        <el-form-item label="巡检单位" prop="patrolOrgId">
          <org-select :list="orgList" @change="patrolOrgIdChange"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索巡检单位" v-model="form.patrolOrgId"></org-select>
        </el-form-item>
        <el-form-item label="巡检人" prop="patrolUserId">
          <el-select placeholder="请选择巡检人" v-model="form.patrolUserId"
                     filterable clearable remote :remote-method="queryUserListNew"
                     @click.native.once="queryUserListNew('')">
            <el-option :label="item.name" :value="item.id" :key="item.id"
                       v-for="item in userList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划巡检日期" prop="patrolProjectDate">
          <el-date-picker placeholder="请选择" type="date" v-model="form.patrolProjectDate"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {checkPlan} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data() {
      return {
        form: {},
        doing: false,
        rules: {
          patrolOrgId: [
            {required: true, message: '请选择巡检单位', trigger: 'change'}
          ],
          patrolProjectDate: [
            {required: true, message: '计划巡检日期', trigger: 'change'}
          ],
          patrolUserId: [
            {required: true, message: '请选择巡检人', trigger: 'change'}
          ]
        },
        actionType: '添加',
        orgList: [],
        userList: []
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
            {name: this.formItem.patrolOrgName, id: this.formItem.patrolOrgId}
          ];
          this.userList = [
            {name: this.formItem.patrolUserName, id: this.formItem.patrolUserId}
          ];
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            patrolUserId: '',
            status: '0',
            patrolOrgId: '',
            patrolProjectDate: ''
          };
          this.actionType = '添加';
        }
      }
    },
    methods: {
      patrolOrgIdChange(val) {
        this.form.patrolUserId = '';
        this.userList = [];
      },
      queryUserListNew(query) {
        let params = {
          keyWord: query
        };
        let orgId = this.$store.state.user.userCompanyAddress;
        this.$http.get(`/erp-org/${orgId}/users`, params).then(res => {
          this.userList = res.data.list;
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {

            this.orgList.forEach(i => {
              if (i.id === this.form.patrolOrgId) {
                this.form.patrolOrgName = i.name;
              }
            });
            this.userList.forEach(i => {
              if (i.id === this.form.patrolUserId) {
                this.form.patrolUserName = i.name;
              }
            });
            this.form.orgId = this.$store.state.userCompanyAddress;

            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(checkPlan.save(this.form), {
                errorTitle: '添加失败',
                success: res => {
                  if (res.data.code === 200) {
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
              this.$httpRequestOpera(checkPlan.update(this.form), {
                errorTitle: '修改失败',
                success: res => {
                  if (res.data.code === 200) {
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
