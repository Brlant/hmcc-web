<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">添加设备巡检记录</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save" plain type="primary" class="mt-10">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="tempForm">
        <el-form-item label="设备类型" prop="devType">
          <el-radio-group v-model="form.devType">
            <el-radio-button label="0">探头</el-radio-button>
            <el-radio-button label="1">网关</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="探头" prop="devId" v-if="form.devType === '0'"
                      :rules="[{required: true, message: '请选择探头', trigger: 'change'}]">
          <el-select placeholder="请选择" v-model="form.devId"
                     filterable clearable remote :remote-method="queryDevNew">
            <el-option :label="item.name" :value="item.id" :key="item.id"
                       v-for="item in probeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网关" prop="devId" v-else :rules="[{required: true, message: '请选择网关', trigger: 'change'}]">
          <el-select placeholder="请选择" v-model="form.devId"
                     filterable clearable remote :remote-method="queryDevNew">
            <el-option :label="item.no" :value="item.id" :key="item.id"
                       v-for="item in gatewayList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" prop="devStatus">
          <el-radio-group v-model="form.devStatus">
            <el-radio-button label="0">正常</el-radio-button>
            <el-radio-button label="1">异常</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="patrolOrgId">
          <el-input v-model="form.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item prop="patrolOrgId">
          <el-button :disabled="doing" @click="addItem" type="success" class="mt-10">添加</el-button>
        </el-form-item>
        <el-table :data="devList" border class="clearfix" ref="orderDetail">
          <el-table-column prop="operationTime" label="设备类型" width="100">
            <template slot-scope="scope">{{scope.row.devType === '0' ? '探头' : '网关'}}</template>
          </el-table-column>
          <el-table-column prop="actionType" label="设备">
            <template slot-scope="scope">
              <div v-show="scope.row.devName">名称：{{scope.row.devName}}</div>
              <div v-show="scope.row.devNo">编号：{{scope.row.devNo}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="actionType" label="设备状态" width="100">
            <template slot-scope="scope">{{scope.row.devStatus === '0' ? '正常' : '异常'}}</template>
          </el-table-column>
          <el-table-column prop="actionType" label="备注">
            <template slot-scope="scope">{{scope.row.remark}}</template>
          </el-table-column>
          <el-table-column prop="actionType" label="操作" width="100">
            <template slot-scope="scope">
              <des-btn icon="delete" @click="deleteItem(scope.row)">删除</des-btn>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {checkRecord} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],

    data() {
      return {
        form: {
          devType: '0',
          devId: '',
          devStatus: '0',
          remark: ''
        },
        devList: [],
        doing: false,
        rules: {
          devType: [
            {required: true, message: '请选择设备类型', trigger: 'change'}
          ],
          devStatus: [
            {required: true, message: '请选择设备状态', trigger: 'change'}
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
        this.devList = [];
        this.actionType = '添加';
        this.resetForm();
      }
    },
    methods: {
      resetForm() {
        this.form = {
          devType: '0',
          devId: '',
          devStatus: '0',
          remark: ''
        };
        this.$nextTick(() => {
          this.$refs['tempForm'].clearValidate();
        });
      },
      patrolOrgIdChange(val) {
        this.form.patrolUserId = '';
        this.userList = [];
      },
      queryDevNew(query) {
        let params = {
          keyWord: '',
          orgId: this.formItem.patrolOrgId
        };
        if (this.form.devType === '0') {
          this.queryProbeList(params).then(res => {
            this.probeList = this.probeList.filter(f => !this.devList.some(s => s.devId === f.id));
          });
        } else {
          this.queryGateway(params).then(res => {
            this.gatewayList = this.gatewayList.filter(f => !this.devList.some(s => s.devId === f.id));
          });
        }
      },
      addItem() {
        this.$refs['tempForm'].validate((valid) => {
          if (!valid) return;
          this[this.form.devType === '0' ? 'probeList' : 'gatewayList'].forEach(i => {
            if (i.id === this.form.devId) {
              this.form.devName = i.name;
              this.form.devNo = i.no;
            }
          });
          this.devList.push(this.form);
          this.probeList = this.probeList.filter(f => !this.devList.some(s => s.devId === f.id));
          this.gatewayList = this.gatewayList.filter(f => !this.devList.some(s => s.devId === f.id));
          this.resetForm();
        });
      },
      deleteItem(item) {
        this.devList = this.devList.filter(f => f !== item);
      },
      save(formName) {
        if (!this.devList.length) {
          return this.$notify.info({message: '请添加设备'});
        }
        this.doing = true;
        let data = {
          patrolOrgId: this.formItem.patrolOrgId,
          patrolProjectId: this.formItem.id,
          devList: this.devList
        };
        this.$httpRequestOpera(checkRecord.save(data), {
          errorTitle: '添加失败',
          success: res => {
            if (res.code === 200) {
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
      }
    }
  };
</script>
