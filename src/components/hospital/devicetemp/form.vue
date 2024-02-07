<template>
  <dialog-template :showLeft="false">
    <template slot="title">设备类型模板</template>
    <template slot="btn">
      <el-button @click="formBack" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div v-else>
        <el-form label-width="145px" :disabled="!editable">
          <el-form-item label="模板名称">
            <el-input v-model="detail.templateName" placeholder="模板名称"/>
          </el-form-item>
          <el-form-item label="模板类型">
            <el-select v-model="detail.templateType" @change="templateChange" placeholder="模板类型">
              <el-option v-for="item in templateTypes" :key="item.value" :value="item.value" :label="item.label"/>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="detail.devType" placeholder="设备类型">
              <el-option v-for="item in deviceTypes" :key="item.id" :value="item.value" :label="item.label"/>
            </el-select>
          </el-form-item>
          <template v-if="detail.templateType === '1'">
            <el-form-item label="设备启用时间">
              <el-date-picker v-model="detail.devStartUsingTime" value-format="yyyy-MM-dd" placeholder="设备启用时间"/>
            </el-form-item>
            <el-form-item label="所属科室">
              <el-select v-model="detail.departmentId" placeholder="所属科室">
                <el-option v-for="item in departments" :key="item.id" :value="item.id" :label="item.departmentName"/>
              </el-select>
            </el-form-item>
            <el-form-item label="所属单位">
              <el-select v-model="detail.orgId"
                remote
                filterable
                :remote-method="getOrganizationList"
                @change="orgChange"
                placeholder="所属单位">
                <el-option v-for="item in organizations"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="是否医用设备">
              <el-radio-group v-model="detail.devMedicalFlag" placeholder="是否医用设备">
                <el-radio v-for="item in medicalFlags" :key="item.value" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="型号">
              <el-input v-model="detail.devVersion" placeholder="型号"/>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="detail.status" placeholder="状态">
                <el-option v-for="item in devstatus" :key="item.value" :value="item.value" :label="item.label"/>
              </el-select>
            </el-form-item>
            <el-form-item label="门板类型">
              <el-radio-group v-model="detail.doorSheetType" placeholder="门板类型">
                <el-radio v-for="item in doorSheets" :key="item.value" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="容积">
              <el-input v-model="detail.devVolume" placeholder="容积"/>
            </el-form-item>
            <el-form-item label="品牌">
              <el-input v-model="detail.devBrand" placeholder="品牌"/>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="detail.remark" type="textarea" placeholder="备注"/>
            </el-form-item>
          </template>
          <template v-if="detail.templateType === '2'">
            <el-form-item label="注册证号/备案凭证号">
              <el-input v-model="detail.registrationCertificateNumber" placeholder="注册证号/备案凭证号"/>
            </el-form-item>
            <el-form-item label="供应商">
              <el-input v-model="detail.supplier" placeholder="供应商"/>
            </el-form-item>
            <el-form-item label="生产厂商">
              <el-input v-model="detail.manufacturer" placeholder="生产厂商"/>
            </el-form-item>
            <el-form-item label="厂商备案凭证号">
              <el-input v-model="detail.manufacturerRegistrationNumber" placeholder="厂商备案凭证号"/>
            </el-form-item>
            <el-form-item label="生产许可证号">
              <el-input v-model="detail.productionLicenseNumber" placeholder="生产许可证号"/>
            </el-form-item>
          </template>

          <el-divider></el-divider>
          <h3 style="margin-bottom: 30px;">能耗信息设置</h3>
          <el-form-item label="标准工作时长">
            <el-input-number v-model="detail.standardWorkingHours" :min="0" :precision="1" :controls="false"/>
            <span style="padding-left: 10px;">小时</span>
          </el-form-item>
          <el-form-item label="工作状态">
            <el-input-number v-model="detail.workStatus" :min="0" :precision="1" :controls="false"/>
            <span style="padding-left: 10px;">mA</span>
          </el-form-item>
          <el-form-item label="闲置状态范围">
            <el-input-number v-model="detail.idleStateRangeStart" :min="0" :precision="1" :controls="false"/>
            <span class="short-number">至</span>
            <el-input-number v-model="detail.idleStateRangeEnd" :min="0" :precision="1" :controls="false"/>
            <span style="padding-left: 10px;">mA</span>
          </el-form-item>
          <el-form-item label="标准电压范围">
            <el-input-number v-model="detail.standardVoltageRangeStart" :min="0" :precision="1" :controls="false"/>
            <span class="short-number">至</span>
            <el-input-number v-model="detail.standardVoltageRangeEnd" :min="0" :precision="1" :controls="false"/>
            <span style="padding-left: 10px;">V</span>
          </el-form-item>
          <el-form-item label="待机状态范围">
            <el-input-number v-model="detail.standbyStatusRangeStart" :min="0" :precision="1" :controls="false"/>
            <span class="short-number">至</span>
            <el-input-number v-model="detail.standbyStatusRangeEnd" :min="0" :precision="1" :controls="false"/>
            <span style="padding-left: 10px;">mA</span>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label-width="0" style="text-align: center;">
            <el-button type="primary" @click="saveData">保存</el-button>
            <el-button @click="formBack">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import { sinopharmDictDataType } from '@/api/system/dict/data';

  export default {
    props: {
      editable: Boolean,
      formData: Object
    },
    data() {
      return {
        loading: false,
        currentTab: {},
        //null值修改成空字符串
        detail: {
          templateId: "",
          templateName: "",
          templateType: "", // int类型
          devType: "",
          manufacturerRegistrationNumber: "",
          registrationCertificateNumber: "",
          productionLicenseNumber: "",
          supplier: "",
          manufacturer: "",
          devStartUsingTime: "",
          departmentId: "", // int类型
          orgId: "",
          orgName: "",
          devMedicalFlag: 0,
          doorSheetType: 0,
          devVersion: "",
          devBrand: "",
          devVolume: "",
          status: "",
          remark: "",
          standardWorkingHours: "", // decimal
          idleStateRangeStart: "", // decimal
          idleStateRangeEnd: "", // decimal
          standbyStatusRangeStart: "", // decimal
          standbyStatusRangeEnd: "", // decimal
          workStatus: "", // decimal
          standardVoltageRangeStart: "", // decimal
          standardVoltageRangeEnd: "" // decimal
        },
        medicalFlags: [{
          value: '0',
          label: '未知'
        }, {
          value: '1',
          label: '医用'
        }, {
          value: '2',
          label: '非医用'
        }],
        doorSheets: [{
          value: '0',
          label: '未知'
        }, {
          value: '1',
          label: '玻璃门'
        }, {
          value: '2',
          label: '避光门'
        }],
        coolDevs: [],
        medicals: [],
        devstatus: [],
        departments: [],
        templateTypes: [],
        organizations: []
      };
    },
    watch: {
      formData(obj) {
        if (!obj.templateId) {
          this.detail = {
            templateId: "",
            templateName: "",
            templateType: "", // int类型
            devType: "",
            manufacturerRegistrationNumber: "",
            registrationCertificateNumber: "",
            productionLicenseNumber: "",
            supplier: "",
            manufacturer: "",
            devStartUsingTime: "",
            departmentId: "", // int类型
            orgId: "",
            orgName: "",
            devMedicalFlag: 0,
            doorSheetType: 0,
            devVersion: "",
            devBrand: "",
            devVolume: "",
            status: "",
            remark: "",
            standardWorkingHours: "", // decimal
            idleStateRangeStart: "", // decimal
            idleStateRangeEnd: "", // decimal
            standbyStatusRangeStart: "", // decimal
            standbyStatusRangeEnd: "", // decimal
            workStatus: "", // decimal
            standardVoltageRangeStart: "", // decimal
            standardVoltageRangeEnd: "" // decimal
          };
          return;
        }
        this.$http.get(`/template/queryById?templateId=${obj.templateId}`).then(res => {
          console.log(res.data)
          if (res.code !== 200) {
            return this.$message.error(res.msg || '获取设备类型模板详情失败');
          }
          this.detail = Object.assign({}, res.data);
        });
      }
    },
    computed: {
      deviceTypes() {
        switch (this.detail.templateType) {
          case '1':
            return this.coolDevs;
          case '2':
            return this.medicals;
          default:
            return [];
        }
      }
    },
    created() {
      this.getDeviceType();
      this.getCoolDevType();
      this.getDepartmentList();
      this.getOrganizationList();
      this.getDeviceTemplateType();
      this.getDeviceTemplateStatus();
    },
    methods: {
      getDeviceTemplateType() {
        sinopharmDictDataType('deviceTemplateType').then(res => {
          this.templateTypes = res.data.map(item => {
            return {
              label: item.label,
              value: item.key
            }
          })
        });
      },
      getCoolDevType() {
        sinopharmDictDataType('coolDevType').then(res => {
          this.coolDevs = res.data.map(item => {
            return {
              label: item.label,
              value: item.key
            }
          })
        });
      },
      getDeviceType() {
        sinopharmDictDataType('device_type').then(res => {
          this.medicals = res.data.map(item => {
            return {
              label: item.label,
              value: item.key
            }
          })
        });
      },
      getDeviceTemplateStatus() {
        sinopharmDictDataType('deviceTemplateStatus').then(res => {
          this.devstatus = res.data.map(item => {
            return {
              label: item.label,
              value: item.key
            }
          })
        });
      },
      getDepartmentList() {
        this.$http.post('/department/queryList', {}).then(res => {
          if (res.code === 200) {
            this.departments = res.data;
          }
        });
      },
      getOrganizationList(keyword = '') {
        this.$http.get(`/orgs/queryHmccOrg?keyWord=${keyword}`).then(res => {
          this.organizations = res.data;
        });
      },
      templateChange(val) {
        this.detail.devType = null;
      },
      orgChange(val) {
        this.detail.orgName = this.organizations.find(item => item.id === val)?.name;
      },
      saveData() {
        const params = {
          ...this.detail,
        };
        console.log(params,'编辑')
        let url = '/template/insert'
        if (this.detail.templateId) {
          url = '/template/edit';
        }
        this.$http.post(url, params).then(res => {
          if (res.code === 200) {
            this.$message.success(res.msg || '设备类型模板保存成功');
            this.$emit('formBack', true);
          }
        })
      },
      formBack() {
        this.$emit('formBack');
      }
    }
  };
</script>
<style lang="scss" scoped>
  .el-input-number:has(+ .short-number) {
    width: 100px;
  }
  .short-number {
    padding: 0 10px;

    & ~ .el-input-number {
      width: 100px;
    }
  }

  .el-form .el-form-item ::v-deep .el-form-item__content {
    .el-select {

      .el-input.is-disabled .el-input__suffix .el-select__caret{
        cursor: default;
      }
    }

    input[disabled], textarea[disabled], .el-radio .el-radio__label {
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
