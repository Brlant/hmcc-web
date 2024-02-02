<template>
  <el-dialog :before-close="closeDetail" :close-on-click-modal="false" :title="titleDetail" :visible="addEditVisible"
             width="75%">
    <el-form ref="form" :inline="true" :model="formData" :rules="rules">
      <el-tabs v-model="activeName" :before-leave="beforeHandle" @tab-click="handleTabClick">
        <el-tab-pane label="设备档案" name="设备档案">
          <el-row>
            <el-col :span="8">
              <el-form-item label="设备编号" label-width="120px" prop="devNo">
                <el-input v-model="formData.devNo" :disabled="!edit" maxlength="20" placeholder="请输入设备编号"
                          show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备名称" label-width="120px" prop="devName">
                <el-input v-model="formData.devName" :disabled="!edit" maxlength="20" placeholder="请输入设备名称"
                          show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型" label-width="120px" prop="devType">
                <el-select v-model="formData.devType" :disabled="!edit" clearable placeholder="设备类型">
                  <el-option
                    v-for="(item,index) in deviceTypeList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="所属科室" label-width="120px" prop="departmentId">
                <el-select v-model="formData.departmentId" :disabled="!edit" clearable placeholder="所属科室">
                  <el-option
                    v-for="(item,index) in deviceDeptList"
                    :key="index"
                    :label="item.departmentName"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商" label-width="120px" prop="supplier">
                <el-input v-model="formData.supplier" :disabled="!edit" maxlength="20" placeholder="请输入供应商"
                          show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产厂商" label-width="120px" prop="manufacturer">
                <el-input v-model="formData.manufacturer" :disabled="!edit" maxlength="20" placeholder="请输入生产厂商"
                          show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="首次投入时间" label-width="120px" prop="firstUserTime">
                <el-date-picker
                  v-model="formData.firstUserTime"
                  :disabled="!edit"
                  placeholder="首次投入时间"
                  type="date"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产日期" label-width="120px" prop="productTime">
                <el-date-picker
                  v-model="formData.productTime"
                  :disabled="!edit"
                  placeholder="生产日期"
                  type="date"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报废时间" label-width="120px" prop="discardTime">
                <el-date-picker
                  v-model="formData.discardTime"
                  :disabled="!edit"
                  placeholder="报废时间"
                  type="date"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="维保周期" label-width="120px" prop="maintenanceCycle">
                <el-input v-model="formData.maintenanceCycle" :disabled="!edit" placeholder="请输入维保周期"
                          type="number" @change="handleMaintenanceCycle"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="厂商备案号" label-width="120px" prop="manufacturerRegistrationNumber">
                <el-input v-model="formData.manufacturerRegistrationNumber" :disabled="!edit" maxlength="20"
                          placeholder="请输入厂商备案号" show-word-limit></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产许可证号" label-width="120px" prop="productionLicenseNumber">
                <el-input v-model="formData.productionLicenseNumber" :disabled="!edit" maxlength="20"
                          placeholder="请输入生产许可证号" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="注册证号/备案凭证号" label-width="120px" prop="registrationCertificateNumber">
                <el-input v-model="formData.registrationCertificateNumber" :disabled="!edit" maxlength="20"
                          placeholder="请输入注册证号/备案凭证号" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <!--        下一步-->
        <el-tab-pane label="设备标签绑定" name="设备标签绑定">
          <el-row>
            <el-form-item label="标签类型" label-width="120px" prop="tagType">
              <el-select v-model="formData.tagType" :disabled="!edit" clearable placeholder="标签类型"
                         @change="handleTagType">
                <el-option
                  v-for="(item,index) in labelTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :error="tagSnNumberError" label="标签sn号" label-width="120px" prop="tagSnNumber">
              <el-select v-model="formData.tagSnNumber" :disabled="!edit" clearable placeholder="标签sn号"
                         @change="handleTagSnNumber">
                <el-option
                  v-for="(item,index) in tagSnNumberList"
                  :key="index"
                  :label="item.tagSnNumber"
                  :value="item.tagSnNumber"
                />
              </el-select>
            </el-form-item>
          </el-row>

        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer">
      <template>
        <el-button v-if="nextStepTitle === '下一步'" type="primary" @click="nextStep">下一步</el-button>
        <el-button v-if="nextStepTitle === '提交' " v-show="edit" :disabled="doing" type="primary" @click="upDataDetail">
          提交
        </el-button>
      </template>
      <template>
        <el-button @click="goBack">返回</el-button>
      </template>
    </div>
  </el-dialog>
</template>

<script>
import {sinopharmDictDataType} from '@/api/system/dict/data'
import queryApi from '@/api/query/query'
import filesApi from '@/api/files/files'

export default {
  name: 'formMsg',
  props: {
    addEditVisible: {
      type: Boolean
    },
    titleDetail: {
      type: String
    },
    detailForm: {
      type: Object
    },
    edit: Boolean,
  },
  data() {
    return {
      doing: false,
      activeName: '设备档案',
      nextStepTitle: '下一步',
      tagSnNumberError: '',//sn号错误
      formData: {
        devNo: '',
        devName: '',
        devType: '',
        departmentId: '',
        supplier: '',
        manufacturer: '',
        firstUserTime: '',
        productTime: '',
        discardTime: '',
        maintenanceCycle: '',
        manufacturerRegistrationNumber: '',
        productionLicenseNumber: '',
        registrationCertificateNumber: '',

        tagType: '',//标签类型
        tagSnNumber: '',
        id: null,
      },
      rules: {
        devNo: [{required: true, message: '请输入设备编号', trigger: 'blur'}],
        devName: [{required: true, message: '请输入设备名称', trigger: 'blur'}],
        devType: [{required: true, message: '请选择设备类型', trigger: 'change'}],
        departmentId: [{required: true, message: '请选择所属科室', trigger: 'change'}],
        tagType: [{required: true, message: '请选择标签类型', trigger: 'change'}],
        tagSnNumber: [{required: true, message: '请选择标签sn号', trigger: 'change'}],
      },
      deviceTypeList: [],//设备类型
      deviceDeptList: [],//所属科室
      labelTypeList: [],//标签类型
      tagSnNumberList: [],//标签sn号

    }
  },
  watch: {
    addEditVisible: {
      handler(val) {
        if (val) {
          this.nextStepTitle = '下一步'
          this.formData = {
            devNo: '',
            devName: '',
            devType: '',
            departmentId: '',
            supplier: '',
            manufacturer: '',
            firstUserTime: '',
            productTime: '',
            discardTime: '',
            maintenanceCycle: '',
            manufacturerRegistrationNumber: '',
            productionLicenseNumber: '',
            registrationCertificateNumber: '',

            tagType: '',//标签类型
            tagSnNumber: '',
            id: null,
          }
          this.$refs.form && this.$refs.form.resetFields();
        }
      },
      immediate: true
    },
    detailForm: {
      handler(val) {
        if (val.id) {
          this.formData = {...val}
          // console.log(this.formData,'参数')
        }
      },
      immediate: true
    }
  },

  created() {
    this.getDeviceTypeList();
    this.queryDepartmentList();
    this.getLabelTypeList();
  },
  methods: {
    handleTagSnNumber(tagSnNumber) {
      if (!tagSnNumber) {
        return
      }
      const id = this.tagSnNumberList.find(item => item.tagSnNumber === tagSnNumber)?.id;
      let params = {id: id}
      filesApi.filesLabelSn(params).then(res => {
        if (res.data.tagCode === '3') {
          this.$nextTick(() => {
            this.$notify.error(res.data.tip)
            this.tagSnNumberError = res.data.tip;
            this.formData.tagSnNumber = '';
          })
        } else {
          this.tagSnNumberError = res.data.tip;
        }
      }).then(err => {

      })
    },
    handleTagType(value) {
      this.formData.tagSnNumber = '';
      if (!value) {
        return
      }
      let params = {type: value,}
      filesApi.filesLabelType(params).then(res => {
        this.tagSnNumberList = res.data.length > 0 ? res.data.map(item => {
          return {
            lastPositionStr: item.lastPositionStr,
            lastPositionTime: item.lastPositionTime,
            id: item.id,
            tagSnNumber: item.tagSnNumber,
            status: item.status,
          }
        }) : []
      }).catch(err => {
        // console.log(err)
      })
    },
    /* 标签类型 */
    getLabelTypeList() {
      sinopharmDictDataType('tag_type').then(res => {
        this.labelTypeList = res.data.map(item => {
          return {
            label: item.label,
            value: item.key,
            type: item.type,
            id: item.id,
          }
        })
        // console.log(res)
      }).catch(err => {

      })
    },
    handleTabClick(row) {
      if (row.name === '设备档案') {
        this.nextStepTitle = '下一步'
      }
    },
    /* 标签绑定 */
    beforeHandle(newName, oldName) {
      if (this.nextStepTitle === '下一步') {
        if (this.formData.devNo === '' || this.formData.devName === '' || this.formData.devType === '' || this.formData.departmentId === '') {
          this.$refs.form.validateField(['devNo', 'devName', 'devType', 'departmentId'])
          return false;
        } else {
          this.activeName = '设备标签绑定'
          this.nextStepTitle = '提交'
        }
      }

    },
    /* 更新 */
    upDataDetail() {
      this.$refs.form.validate((validate) => {
        if (validate) {
          this.submit();
        }
      })
    },
    submit() {
      let params = {
        devNo: this.formData.devNo,
        //入参 值传设备的id,新增的时候没有id,传null,修改的时候,有id,
        id: this.formData.id === null ? null : this.formData.id,
      }
      filesApi.verifyDevNo(params).then(res => {
        if (res.code === 200) {
          this.submitMsg();
        } else {
          this.$notify.error(res.data)
        }
      })
    },
    submitMsg() {
      let params = {
        ...this.formData
      }
      if (this.formData.id) {
        if (this.doing) return;
        this.doing = true;
        filesApi.filesEditList(params).then(res => {
          if (res.code === 200) {
            this.doing = false;
            this.$notify.success('编辑成功')
            this.closeDetail()
          } else {
            this.doing = false;
            this.$notify.error(res.data)
          }
        }).catch(err => {
          this.doing = false;
        })
      } else {
        if (this.doing) return;
        this.doing = true;
        filesApi.filesAddList(params).then(res => {
          if (res.code === 200) {
            this.doing = false;
            this.$notify.success('提交成功')
            this.closeDetail()
          } else {
            this.doing = false;
            this.$notify.error(res.data)
          }
        }).catch(err => {
          this.doing = false;
        })
      }

    },
    //维保周期
    handleMaintenanceCycle(row) {
      if (row < 0) {
        this.formData.maintenanceCycle = ''
        return this.$notify.info('请输入正整数')
      }
    },
    //所属科室
    queryDepartmentList() {
      queryApi.queryDepartment({}).then(res => {
        this.deviceDeptList = res.data.map(item => {
          return {
            departmentName: item.departmentName,
            departmentPosition: item.departmentPosition,
            id: item.id
          }
        })
      })
    },
    //设备类型
    getDeviceTypeList() {
      sinopharmDictDataType('device_type').then(res => {
        this.deviceTypeList = res.data.map(item => {
          return {
            label: item.label,
            value: item.key
          }
        })
      }).catch(err => {

      })
    },
    closeDetail(done) {
      this.doing = false;
      this.activeName = '设备档案'
      this.formData = {
        devNo: '',
        devName: '',
        devType: '',
        departmentId: '',
        supplier: '',
        manufacturer: '',
        firstUserTime: '',
        productTime: '',
        discardTime: '',
        maintenanceCycle: '',
        manufacturerRegistrationNumber: '',
        productionLicenseNumber: '',
        registrationCertificateNumber: '',

        tagType: '',//标签类型
        tagSnNumber: '',
        id: null,
      }
      this.$refs.form.resetFields();
      // console.trace(done)
      this.$emit('closeDetail')
    },
    goBack() {
      this.closeDetail();
    },
    /* 下一步 */
    nextStep() {
      this.beforeHandle();
    },
  }
}
</script>

<style lang="scss" scoped>
.el-form .el-form-item ::v-deep .el-form-item__content {
  .el-select {
    width: 100%;

    .el-input.is-disabled .el-input__suffix .el-select__caret {
      cursor: default;
    }
  }

  input[disabled], .el-radio .el-radio__label {
    cursor: default;
    color: #606266;
    background-color: #ffffff;
  }

  .el-input-number.is-disabled {

    > span {
      cursor: default;
    }
  }

  .el-radio .el-radio__input.is-disabled {

    cursor: default;
    color: #606266;
    background-color: #ffffff;

    .el-radio__inner {
      cursor: default;
      color: #606266;
      background-color: #ffffff;

      &:after {
        cursor: default;
        background-color: #606266;
      }
    }
  }
}
</style>
