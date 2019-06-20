<template>
  <dialog-template :btnSavePosition="90">
    <template slot="title">{{actionType}}运单监控</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="90px" ref="tempForm">

        <oms-row :span="4" class="mb-8" label="运单编号">{{formItem.orderCode}}</oms-row>
        <oms-row :span="4" class="mb-8" label="货主">{{formItem.ownnerName}}</oms-row>
        <oms-row :span="4" class="mb-8" label="客户">{{formItem.customerName}}</oms-row>
        <oms-row :span="4" class="mb-8" label="收货地址">{{formItem.arriveAddress}}</oms-row>
        <oms-row :span="4" class="mb-8" label="创建时间">{{formItem.createTime | time}}</oms-row>
        <!--<el-form-item label="货主" prop="ownnerId">-->
        <!--<org-select v-model="form.ownnerId" :list="orgList" @change="orgChange"-->
        <!--:remoteMethod="queryOrg" placeholder="请输入名称搜索货主信息"></org-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="客户" prop="customerId">-->
        <!--<org-select v-model="form.customerId" :list="relationCustomerList" @change="customerChange"-->
        <!--:remoteMethod="queryRelationCustomer('form.ownnerId')" placeholder="请输入名称搜索客户信息"></org-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="收货地址" prop="departAddress">-->
        <!--<el-select placeholder="请选择收货地址" v-model="form.departAddress" filterable clearable>-->
        <!--<el-option :label="item.detail" :value="item.id" :key="item.id"-->
        <!--v-for="item in relationCustomerWarehouseList">-->
        <!--<span class="pull-left">{{ item.name }}</span>-->
        <!--<span class="pull-right select-other-info">{{ item.detail }}</span>-->
        <!--</el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="车牌号" prop="plateNumber">-->
        <!--<oms-input type="text" v-model="form.plateNumber" placeholder="请输入车牌号"></oms-input>-->
        <!--</el-form-item>-->
        <el-form-item label="启运时间" prop="departTime">
          <el-date-picker placeholder="请选择启运时间" type="datetime" v-model="form.departTime"></el-date-picker>
        </el-form-item>
        <el-form-item label="送达时间" prop="arriveTime">
          <el-date-picker placeholder="请选择送达时间" type="datetime" v-model="form.arriveTime"></el-date-picker>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {waybillMonitoring} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data() {
      return {
        formModel: {
          orderCode: '',
          ownnerId: '',
          customerId: '',
          departAddress: '',
          plateNumber: '',
          arriveTime: ''
        },
        form: {},
        doing: false,
        rules: {
          ownnerId: [
            {required: true, message: '请选择货主', trigger: 'change'}
          ],
          customerId: [
            {required: true, message: '请选择客户', trigger: 'change'}
          ],
          departAddress: [
            {required: true, message: '请选择收货地址', trigger: 'change'}
          ],
          plateNumber: [
            {required: true, message: '请输入车牌号', trigger: 'change'}
          ],
          departTime: [
            {required: true, message: '请输入启运时间', trigger: 'change'}
          ],
          arriveTime: [
            {required: true, message: '请输入送达时间', trigger: 'change'}
          ],
          rules: [
            {required: true, type: 'array', message: '请选择告警规则', trigger: 'change'}
          ]
        },
        actionType: '添加',
        ruleList: []
      };
    },
    computed: {},
    props: ['formItem', 'index'],
    watch: {
      index: function (val) {
        if (val !== 0) return;
        this.$refs['tempForm'].resetFields();
        if (this.formItem.id) {
          // this.queryDetail();
          this.form = Object.assign({}, this.formItem);
          this.form.arriveTime = this.form.arriveTime ? new Date(this.form.arriveTime) : '';
          this.form.departTime = this.form.departTime ? new Date(this.form.departTime) : '';
          this.actionType = '编辑';
        } else {
          this.form = Object.assign({}, this.formModel);
          this.actionType = '添加';
        }
      }
    },
    methods: {
      orgChange() {
        this.form.customerId = '';
        this.relationCustomerList = [];
        this.form.departAddress = '';
        this.relationCustomerWarehouseList = [];
      },
      customerChange(val) {
        this.form.departAddress = '';
        this.relationCustomerWarehouseList = [];
        this.queryRelationCustomerWarehouse(val);
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            let {formatTime, form} = this;
            let formData = {
              departTime: form.departTime,
              arriveTime: form.arriveTime
            };
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(waybillMonitoring.save(formData), {
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
              this.$httpRequestOpera(waybillMonitoring.update(form.id, formData), {
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
