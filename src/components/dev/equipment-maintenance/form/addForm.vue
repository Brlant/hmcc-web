<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{ actionType }}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save" plain type="primary">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="tempForm">
        <el-form-item label="设备类型" prop="hospitalDeviceType">
          <el-select v-model="form.hospitalDeviceType" placeholder="请选择设备类型" @change="handlerDeviceType">
            <el-option v-for="(item,index) in hospitalDeviceTypeList"
                       :key="item.id"
                       :value="item.key"
                       :label="item.label"/>
          </el-select>
        </el-form-item>
        <!--设备名称-->
        <el-form-item label="设备名称" prop="deviceId">
          <el-select v-model="form.deviceId"
                     :clearable="true"
                     filterable
                     remote
                     :remote-method="searchDeviceName"
                     @click.native.once="searchDeviceName('')"
                     @change="handlerDeviceName"
                     placeholder="请选择设备名称">
            <el-option
              v-for="(item,index) in deviceNames"
              :key="index"
              :label="item.deviceName"
              :value="item.deviceId"
            >
              <div>
                <span class="pull-left">{{ item.deviceName }}</span>
              </div>
              <div style="float: right">
                <span class="select-other-info">
                  <span>设备编号:</span> {{ item.deviceNo }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <!--所属单位-->
        <el-form-item label="所属单位">
          <el-input v-model="form.orgName" readonly :disabled="true"></el-input>
        </el-form-item>
        <!--        所属科室-->
        <el-form-item label="所属科室">
          <el-input v-model="form.departmentName" readonly :disabled="true"></el-input>
        </el-form-item>
        <!--维保公司-->
        <el-form-item label="维保公司" prop="companyName">
          <el-input v-model="form.companyName"></el-input>
        </el-form-item>
        <!--维保时间-->
        <el-form-item label="维保时间" prop="maintenanceDate">
          <el-date-picker
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.maintenanceDate"
            type="datetime"
            placeholder="选择日期"></el-date-picker>
        </el-form-item>

        <div v-for="(detail,index) in form.deviceMaintenanceDetails">
          <div class="vertical" v-if="detail.checkStatus">
            <div class="vertical-bar"></div>
            <div>{{ detail.maintenanceName }}</div>
          </div>
          <div v-if="detail.twoListDetailList && detail.twoListDetailList.length > 0">
            <div v-for="(innerDetail, innerIndex) in detail.twoListDetailList" :key="innerIndex"
                 v-if="innerDetail.checkStatus">
              <el-form-item label-width="120px" :label="innerDetail.maintenanceName" required></el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="'合格状态'">
                    <el-switch :active-value="1" :inactive-value="2" v-model="innerDetail.isQualified"></el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="'处理时间'"
                                :prop="'deviceMaintenanceDetails.' + index + '.twoListDetailList.' + innerIndex + '.handleTime'"
                                :rules="rules.handleTime">
                    <el-date-picker
                      value-format="yyyy-MM-dd HH:mm:ss"
                      v-model="innerDetail.handleTime"
                      type="datetime"
                      placeholder="选择日期"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="'处理方式'"
                            :prop="'deviceMaintenanceDetails.' + index + '.twoListDetailList.' + innerIndex + '.handleManner'"
                            :rules="rules.handleManner">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入处理方式"
                  v-model="innerDetail.handleManner"
                >
                </el-input>
              </el-form-item>
              <el-form-item :label="'备注'">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入备注"
                  v-model="innerDetail.remark">
                </el-input>
              </el-form-item>
            </div>
          </div>
        </div>

        <!--签名-->
        <div style="margin-top: 20px">
          <div class="vertical">
            <div class="vertical-bar"></div>
            <div>签名</div>
          </div>
          <el-row>
            <el-col :span="10">
              <el-form-item label="维保人员">
                <el-input v-model="form.maintenanceUserName"></el-input>
              </el-form-item>
            </el-col>
<!--            <el-col :span="10">-->
<!--              <el-form-item label="复核人员">-->
<!--                <el-input v-model="form.reviewUserName"></el-input>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="4">-->
<!--              <el-button style="margin-left: 25px;">查看签字</el-button>-->
<!--            </el-col>-->
          </el-row>
        </div>


      </el-form>
    </template>
  </dialog-template>
</template>

<script>
import {sinopharmDictDataType} from "@/api/system/dict/data";
import {
  getColdList,
  getMedicalList,
  getQueryByTypeList,
  postDeviceMaintenanceApi
} from "@/api/maintenance/device";
import moment from 'moment';

export default {
  name: "addEdit",
  props: {
    formItem: Object,
    index: Number,
    statusData:Number,
  },
  data() {
    return {
      actionType: '添加',
      form: {
        hospitalDeviceType: '',
        deviceId: '',
        deviceName: '',
        orgId: '',
        orgName: '',
        departmentId: null,
        departmentName: '',
        companyName: '',//维保公司
        maintenanceDate:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),//维保时间
        maintenanceUserName: '',//维保人员
        reviewUserName: '',//复核人员
        deviceMaintenanceDetails: [{
          checkStatus: null,
          maintenanceName: '',
          twoListDetailList: [{
            checkStatus: null,
            maintenanceName: '',
            isQualified: 1,
            handleTime: '',
            handleManner: '',
            remark: '',
          }]
        }],
      },
      currentDate: new Date(),
      doing: false,
      rules: {
        hospitalDeviceType: [
          {required: true, message: '请选择设备类型', trigger: 'blur'}
        ],
        deviceId: [
          {required: true, message: '请选择设备名称', trigger: 'blur'}
        ],
        companyName: [
          {required: true, message: '请输入维保公司', trigger: 'blur'}
        ],
        maintenanceDate: [
          {required: true, message: '请选择维保时间', trigger: 'blur'}
        ],
        handleTime: [
          {required: true, message: '请选择处理时间', trigger: 'blur'}
        ],
        handleManner: [
          {required: true, message: '请输入数量', trigger: 'blur'},
        ],
      },
      hospitalDeviceTypeList: [],//设备类型
      //设备名称判断
      deviceNameCode: '',
      //设备名称
      deviceNames: [],
      //维保设备
      maintenanceInterposeDetailList: [],
    }
  },
  watch: {
    formItem:{
      handler(newValue, oldValue) {
        this.form={
          hospitalDeviceType: '',
          deviceId: '',
          deviceName: '',
          orgId: '',
          orgName: '',
          departmentId: null,
          departmentName: '',
          companyName: '',//维保公司
          maintenanceDate:moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),//维保时间
          maintenanceUserName: '',//维保人员
          reviewUserName: '',//复核人员
          deviceMaintenanceDetails: [{
            checkStatus: null,
            maintenanceName: '',
            twoListDetailList: [{
              checkStatus: null,
              maintenanceName: '',
              isQualified: 1,
              handleTime: '',
              handleManner: '',
              remark: '',
            }]
          }],
        }
      },
      immediate: true,
      deep: true,
    }
  },
  created() {
    this.getDeviceTemplateType();
  },
  methods: {
    save() {
      this.$refs.tempForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.form)
          postDeviceMaintenanceApi(params).then(response => {
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '新增设备维保单成功'
            });
            this.$emit('refreshEquipment');
            this.refreshFrom();
          }).catch(error => {

          })
        }
      })

    },
    cancel(){
      this.$emit('refreshEquipment');
      this.refreshFrom();
    },
    refreshFrom(){
      this.form={
        hospitalDeviceType: '',
        deviceId: '',
        deviceName: '',
        orgId: '',
        orgName: '',
        departmentId: null,
        departmentName: '',
        companyName: '',//维保公司
        maintenanceDate:'',//维保时间
        maintenanceUserName: '',//维保人员
        reviewUserName: '',//复核人员
        deviceMaintenanceDetails: [{
          checkStatus: null,
          maintenanceName: '',
          twoListDetailList: [{
            checkStatus: null,
            maintenanceName: '',
            isQualified: 1,
            handleTime: '',
            handleManner: '',
            remark: '',
          }]
        }],
      }
      this.$refs.tempForm.resetFields();
    },
    //设备名称
    handlerDeviceName() {
      //根据id过滤出设备名称数组,获取这一行所有的数据
      let deviceNameArray = this.deviceNames.filter(item => item.deviceId === this.form.deviceId);
      this.form.deviceName = deviceNameArray[0]?.deviceName;
      this.form.orgId = deviceNameArray[0]?.orgId;
      this.form.orgName = deviceNameArray[0]?.orgName;
      this.form.departmentId = deviceNameArray[0]?.departmentId;
      this.form.departmentName = deviceNameArray[0]?.departmentName;
    },
    getDeviceTemplateType() {
      sinopharmDictDataType('hospitalDeviceType').then(res => {
        this.hospitalDeviceTypeList = res.data
      });
    },
    //设备类型
    handlerDeviceType(newType) {
      this.deviceNames = [];
      this.form.deviceId = '';
      this.form.orgName = '';
      this.form.departmentName = '';
      this.fetchDeviceNames(newType, '');
      this.queryByTypeList(newType);
    },
    queryByTypeList(newType) {
      getQueryByTypeList(newType).then(res => {
        this.form.deviceMaintenanceDetails = res.data.maintenanceInterposeDetailList.map(detail => {
          return {
            checkStatus: detail.checkStatus,
            maintenanceName: detail.maintenanceName,
            twoListDetailList: detail.twoInterposeDetailList.map((innerDetail) => {
              return {
                checkStatus: innerDetail.checkStatus,
                maintenanceName: innerDetail.maintenanceName,
                isQualified: 1,
                handleTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                handleManner: '',
                remark: '',
              }
            })
          }
        })
      })
    },
    fetchDeviceNames(deviceType, query) {
      let _that = this;
      //冷链接口
      if (deviceType === '1') {
        _that.$http.post('/freezer-dev/page', {pageNo: 1, pageSize: 10, keyWord: query || ''}).then(res => {
          _that.deviceNames = res.data.list.map(item => {
            return {
              deviceNo: item.no,
              deviceId: item.id,
              deviceName: item.name,
              orgId: item.orgId,
              orgName: item.orgName,
              departmentId: item.departmentId,
              departmentName: item.departmentName
            }
          })
        })
      }
      //医疗接口
      if (deviceType === '2') {
        _that.$http.post('/device/queryAllByCondition ', {pageNo: 1, pageSize: 10, text: query || ''}).then(res => {
          _that.deviceNames = res.data.pageInfo.list.map(item => {
            return {
              deviceNo: item.devNo,
              deviceId: item.id,
              deviceName: item.devName,
              orgId: "wXzAMBMvmKooAuz2dAT",
              orgName: "中日友好医院",
              departmentId: item.departmentId,
              departmentName: item.departmentName
            }
          })
        })
      }
    },
    //设备名称模糊搜索
    searchDeviceName(query) {
      if (query && query.length > 0) {
        this.fetchDeviceNames(this.form.hospitalDeviceType, query); // 可以在此处添加模糊查询参数，具体取决于接口要求
      }
    }

  },
}
</script>

<style lang="scss" scoped>
.vertical {
  display: flex;
  width: auto;

  .vertical-bar {
    width: 3px; /* 设置宽度为2px */
    height: 20px; /* 设置高度为10px */
    background: blue; /* 给元素填充颜色，这里以黑色为例 */
    margin-right: 6px;
  }
}

.borderNone .el-input__inner {
  border: 0;
}
</style>
