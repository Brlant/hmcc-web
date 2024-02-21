<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{ actionType }}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="150px" ref="tempForm">
        <div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="模板名称" prop="templateName">
                <el-input placeholder="请输入模板名称" type="input" v-model="form.templateName"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="模板分类" prop="templateType">
                <el-select placeholder="请选择模板分类" type="input" v-model="form.templateType">
                  <el-option key="0" label="冷链设备" value="1"></el-option>
                  <el-option key="1" label="医疗设备" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型" prop="devType">
                <el-select placeholder="请先选择模板分类" v-model="form.devType" popper-class="selects--custom">
                  <el-option :key="item.key" :label="item.label" :value="item.key"
                             v-for="(item, index) in tempDevTypes">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-show="form.templateType === '1'">
            <el-col :span="8">
              <el-form-item label="是否医用设备">
                <el-radio-group v-model="form.medicalFlag">
                  <el-radio :label="item.key" v-for="item in medicalDevType" :key="item.key">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-show="form.templateType === '2'">
              <el-form-item label="容积">
                <oms-input placeholder="请输入容积" v-model="form.volume"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注">
                <oms-input placeholder="请输入备注" type="textarea" v-model="form.remark"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-show="form.templateType === '1'">
            <el-col :span="8">
              <el-form-item label="门板类型">
                <el-radio-group v-model="form.doorSheetType">
                  <el-radio :label="item.key" v-for="item in doorDevType" :key="item.key">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="品牌">
                <oms-input placeholder="请输入品牌" v-model="form.brand"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="型号">
                <oms-input placeholder="请输入型号" v-model="form.version"/>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" v-show="form.templateType === '2'">
            <el-col :span="8">
              <el-form-item label="注册证号/备案凭证号" prop="registrationCertificateNumber">
                <oms-input placeholder="请输入注册证号/备案凭证号" v-model="form.registrationCertificateNumber"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商" prop="supplier">
                <oms-input placeholder="请输入供应商" type="input" v-model="form.supplier"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产厂商" prop="manufacturer">
                <oms-input placeholder="请输入生产厂商" type="input" v-model="form.manufacturer"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" v-show="form.templateType === '2'">
            <el-col :span="8">
              <el-form-item label="厂商备案凭证号" prop="manufacturerRegistrationNumber">
                <oms-input placeholder="请输入厂商备案凭证号" v-model="form.manufacturerRegistrationNumber"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产许可证号" prop="productionLicenseNumber">
                <oms-input placeholder="请输入厂商备案凭证号" v-model="form.productionLicenseNumber"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-divider/>
          <h3>能耗信息设置</h3>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="关机状态范围">
                <el-row :gutter="10">
                  <el-col :span="10">
                    <el-form-item prop="shutdownStatusStart">
                      <el-input placeholder="请输入数字" type="number" v-model.number="form.shutdownStatusStart"
                                disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">至</el-col>
                  <el-col :span="10">
                    <el-form-item prop="shutdownStatusEnd">
                      <el-input placeholder="请输入数字" type="number"
                                v-model.number="form.shutdownStatusEnd"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">mA</el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作状态" prop="workStatus">
                <el-input placeholder="请输入数字" type="number" v-model.number="form.workStatus">
                  <template slot="prepend">大于</template>
                  <template slot="append">mA</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import omsUploadPicture from '@/components/common/upload/upload.picture';
import methodsMixin from '@/mixins/methodsMixin';

export default {
  mixins: [methodsMixin],
  components: {
    omsUploadPicture
  },
  data() {
    return {
      form: {
        devNo: '',
        devName: '',
        devType: '',
        templateId: '',
        supplier: '',
        manufacturer: '',
        departmentId: '',
        productTime: '',
        discardTime: '',
        firstUserTime: '',
        manufacturerRegistrationNumber: '',
        productionLicenseNumber: '',
        maintenanceCycle: '',
        registrationCertificateNumber: '',
        workStatus: '',
        standardWorkingHours: '',
        shutdownStatusStart: 0,
        shutdownStatusEnd: '',
        standardVoltageRangeStart: '',
        standardVoltageRangeEnd: '',
        standbyStatusRangeStart: '',
        standbyStatusRangeEnd: '',
        firstStatusType: '',
        locationTagId: '',
        energyTagId: '',
      },
      doing: false,
      rules: {
        templateName: [
          {required: true, message: '请输入模板名称', trigger: 'blur'}
        ],
        templateType: [
          {required: true, message: '请选择模板分类', trigger: 'change'}
        ],
        devType: [
          {required: true, message: '请选择设备类型', trigger: 'change'}
        ],
      },
      actionType: '添加模板',
      tempList: [],
      locationTags: [],
      energyTags: [],
      loadingLocationTag: false,
      loadingEnergyTag: false,
    };
  },
  props: {
    formItem: Object,
    index: Number,
    statusType: Array
  },
  computed: {
    medicalDevType() {
      return this.$store.state.medicalDevType;
    },
    doorDevType() {
      return this.$store.state.doorDevType;
    },
    medicalDevTypes() {
      return this.$getDict('device_type')
    },
    coolDevTypes() {
      return this.$getDict('coolDevType')
    },
    tempDevTypes() {
      if (this.form.templateType === '1') {
        return this.coolDevTypes;
      } else if (this.form.templateType === '2') {
        return this.medicalDevTypes;
      } else {
        return [];
      }
    }
  },
  watch: {
    index(val) {
      if (val === -1) {
        return;
      }

      if (this.formItem.templateId) {
        this.actionType = '编辑模板';
        this.getDetail(this.formItem.templateId)
      } else {
        this.form = {
          shutdownStatusStart: 0
        };
        this.actionType = '添加模板';
      }

      this.$nextTick(() => {
        this.$refs['tempForm'] && this.$refs['tempForm'].clearValidate();
      });
    },
  },
  methods: {
    getDetail(templateId) {
      if (!templateId) {
        return
      }

      let params = {templateId};
      this.$http.get('/template/queryById', {params}).then(res => {
        this.form = res.data;
        if (!this.form.shutdownStatusStart) {
          // 没有值按0显示处理
          this.form.shutdownStatusStart = 0;
        }

      }).catch(err => {
        this.$notify.error(err.response && err.response.data && err.response.data.msg || '详情接口异常，请联系管理员');
      })
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.doing === false) {
          if (!this.form.templateId) {
            this.doing = true;
            this.$httpRequestOpera(this.$http.post('/template/insert', this.form), {
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
          } else {
            this.$httpRequestOpera(this.$http.post('/template/edit', this.form), {
              errorTitle: '修改失败',
              success: res => {
                if (res.code === 200) {
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
    },
  },
  mounted() {
    if (this.formItem.templateId) {
      this.actionType = '编辑模板';
      this.getDetail(this.formItem.templateId)
    }
  }
};
</script>
