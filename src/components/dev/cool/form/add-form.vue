<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="tempForm">
        <el-form-item label="编号">
          <oms-input placeholder="请输入设备编号" type="input" v-model="form.no"/>
        </el-form-item>
        <el-form-item label="所属单位" prop="orgId">
          <org-select :list="orgList"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索单位" v-model="form.orgId"></org-select>
        </el-form-item>
        <el-form-item label="类型">
          <oms-input placeholder="请输入类型"  v-model="form.type"/>
        </el-form-item>
        <el-form-item label="品牌">
          <oms-input placeholder="请输入品牌"  v-model="form.barnd"/>
        </el-form-item>
        <el-form-item label="型号">
          <oms-input placeholder="请输入型号"  v-model="form.vsrsion"/>
        </el-form-item>
        <el-form-item label="设备启用时间">
          <el-date-picker placeholder="请选择" type="date" v-model="form.startUsingTime" value-format="timestamp"/>
        </el-form-item>
        <el-form-item label="是否医用设备">
          <el-radio-group v-model="form.medicalFlag">
            <el-radio :label="3" v-for="item in medicalDevType" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="门板类型">
          <el-radio-group v-model="form.doorSheetType">
            <el-radio :label="3" v-for="item in doorDevType" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="容积">
          <oms-input placeholder="请输入容积"  v-model="form.volume"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch active-text="启用" active-value="1" inactive-text="停用" inactive-value="0" v-model="form.devStatus">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <oms-input placeholder="请输入型号" type="textarea" v-model="form.remark"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {TempDev} from '@/resources';

  export default {
    data() {
      return {
        form: {},
        doing: false,
        rules: {
          no: [
            {required: true, message: '请输入编码', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          temp: [
            {required: true, message: '请输入当前温度', trigger: 'blur'}
          ],
          voltage: [
            {required: true, message: '请输入当前电压', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '请选择校准期', trigger: 'change'}
          ],
          devNo: [
            {required: true, message: '请输入设备编号', trigger: 'blur'}
          ]
        },
        medicalDevType: [
          {key: '0', label: '未知'},
          {key: '1', label: '未知'},
          {key: '2', label: '未知'}
        ],
        doorDevType: [
          {key: '0', label: '未知'},
          {key: '1', label: '玻璃门'},
          {key: '2', label: '避光们'}
        ],
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
        if (this.formItem.ccsDevId) {
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            no: '',
            name: '',
            devStatus: '1',
            devType: '',
            monitorStatus: '0',
            comment: '',
            createTime: '',
            devNo: ''
          };
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
            // this.form.createTime = this.form.createTime ? this.$moment(this.form.createTime).format('YYYY-MM-DD') : '';
            if (!this.form.id) {
              this.form.devType = '' + (this.type - 1);
              this.doing = true;
              this.$httpRequestOpera(TempDev.save(this.form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.$emit('change', res.data);
                },
                error: () => {
                  this.doing = false;
                }
              });
            } else {
              this.$httpRequestOpera(TempDev.update(this.form.id, this.form), {
                successTitle: '修改成功',
                errorTitle: '修改失败',
                success: res => {
                  this.doing = false;
                  this.$emit('change', res.data);
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
