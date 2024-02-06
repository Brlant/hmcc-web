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
              <el-form-item label="设备编号" prop="devNo">
                <el-input placeholder="请输入设备编号" type="input" v-model="form.devNo"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备名称" prop="devName">
                <oms-input placeholder="请输入设备名称" type="input" v-model="form.devName"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型" prop="devType">
                <el-select placeholder="请选择设备类型" v-model="form.devType" popper-class="selects--custom"
                           @change="devTypeChangeHandler">
                  <el-option :key="item.key" :label="item.label" :value="item.key"
                             v-for="(item, index) in devTypes">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="设备类型模板">
                <el-select placeholder="请先选择设备类型"
                           v-model="form.templateId"
                           @change="setTempData"
                           popper-class="selects--custom">
                  <el-option :key="item.templateId" :label="item.templateName" :value="item.templateId"
                             v-for="(item, index) in tempList">
                  </el-option>
                </el-select>
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
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="所属科室" prop="departmentId">
                <el-select placeholder="请输入名称搜索科室"
                           v-model="form.departmentId"
                           filterable
                           popper-class="selects--custom">
                  <el-option v-for="(item, index) in deptList"
                             :key="item.id"
                             :label="item.departmentName"
                             :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产日期" prop="productTime">
                <el-date-picker placeholder="请选择日期" type="date" v-model="form.productTime" value-format="timestamp"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报废时间" prop="discardTime">
                <el-date-picker placeholder="请选择时间" type="datetime" v-model="form.discardTime"
                                value-format="timestamp"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="首次投入使用时间" prop="firstUserTime">
                <el-date-picker placeholder="请选择" type="date" v-model="form.firstUserTime" value-format="timestamp"/>
              </el-form-item>
            </el-col>
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
          <el-row :gutter="10">
            <el-col :span="8">

            </el-col>
            <el-col :span="8">
              <el-form-item label="维保周期" prop="maintenanceCycle">
                <oms-input placeholder="请输入维保周期" v-model="form.maintenanceCycle"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册证号/备案凭证号" prop="registrationCertificateNumber">
                <oms-input placeholder="请输入注册证号 / 备案凭证号" v-model="form.registrationCertificateNumber"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-divider/>
          <h3>能耗信息设置</h3>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="标准工作时长" prop="standardWorkingHours">
                <el-input placeholder="请输入数字" type="number" v-model.number="form.standardWorkingHours">
                  <template slot="append">小时</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作状态" prop="workStatus">
                <el-input placeholder="请输入数字" type="number" v-model.number="form.workStatus" disabled>
                  <template slot="prepend">大于</template>
                  <template slot="append">mA</template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="闲置状态范围">
                <el-row :gutter="10">
                  <el-col :span="10">
                    <el-form-item prop="idleStateRangeStart">
                      <el-input placeholder="请输入数字" type="number" v-model.number="form.idleStateRangeStart"
                                disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">至</el-col>
                  <el-col :span="10">
                    <el-form-item prop="idleStateRangeEnd">
                      <el-input placeholder="请输入数字" type="number" v-model.number="form.idleStateRangeEnd"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">mA</el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标准电压范围">
                <el-row :gutter="10">
                  <el-col :span="10">
                    <el-form-item prop="standardVoltageRangeStart">
                      <el-input placeholder="请输入数字" type="number"
                                v-model.number="form.standardVoltageRangeStart"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">至</el-col>
                  <el-col :span="10">
                    <el-form-item prop="standardVoltageRangeEnd">
                      <el-input placeholder="请输入数字" type="number"
                                v-model.number="form.standardVoltageRangeEnd"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">V</el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="待机状态范围">
                <el-row :gutter="10">
                  <el-col :span="10">
                    <el-form-item prop="standbyStatusRangeStart">
                      <el-input placeholder="请输入数字" type="number"
                                v-model.number="form.standbyStatusRangeStart" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">至</el-col>
                  <el-col :span="10">
                    <el-form-item prop="standbyStatusRangeEnd">
                      <el-input placeholder="请输入数字" type="number"
                                v-model.number="form.standbyStatusRangeEnd"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="2">mA</el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
          <el-divider/>
          <h3>标签绑定</h3>
          <el-form-item label="定位标签">
            <template slot="label">
              <span style="font-size: 1.17em">定位标签</span>
            </template>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="7">
                <el-form-item label="设备状态监控" prop="firstStatusType">
                  <el-switch v-model.number="form.firstStatusType" :active-value="1" :inactive-value="null"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="标签sn号" prop="locationTagId">
                  <el-select
                    v-model="form.locationTagId"
                    :disabled="showUnbindLocationTag"
                    placeholder="输入搜索标签sn号"
                    filterable
                    remote
                    :remote-method="searchLocationTagSn"
                    :loading="loadingLocationTag">
                    <el-option
                      v-for="item in locationTags"
                      :key="item.id"
                      :value="item.id"
                      :label="item.tagSnNumber"
                    >
                      <span style="float: left">{{ item.tagSnNumber }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tagName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-button type="primary" @click="unbindLocationTag" v-show="showUnbindLocationTag">解绑</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="能耗标签">
            <template slot="label">
              <span style="font-size: 1.17em">能耗标签</span>
            </template>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="7">
                <el-form-item label="设备状态监控" prop="firstStatusType">
                  <el-switch v-model.number="form.firstStatusType" :active-value="2" :inactive-value="null"></el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="标签sn号" prop="energyTagId">

                  <el-select
                    v-model="form.energyTagId"
                    :disabled="showUnbindEnergyTag"
                    placeholder="输入搜索标签sn号"
                    filterable
                    remote
                    :remote-method="searchEnergyTagSn"
                    :loading="loadingEnergyTag">
                    <el-option
                      v-for="item in energyTags"
                      :key="item.id"
                      :value="item.id"
                      :label="item.tagSnNumber"
                    >
                      <span style="float: left">{{ item.tagSnNumber }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tagName }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <el-button type="primary" @click="unbindEnergyTag" v-show="showUnbindEnergyTag">解绑</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </div>

      </el-form>
    </template>
  </dialog-template>
</template>
<script>
import omsUploadPicture from '@/components/common/upload/upload.picture';
import methodsMixin from '@/mixins/methodsMixin';

import {medicalApi} from '@/resources';

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
        idleStateRangeStart: 0.00,
        idleStateRangeEnd: '',
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
        devName: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        devNo: [
          {required: true, message: '请输入编码', trigger: 'blur'}
        ],
        orgId: [
          {required: true, message: '请选择所属单位', trigger: 'change'}
        ],
        departmentId: [
          {required: true, message: '请选择所属科室', trigger: 'change'}
        ],
        devType: [
          {required: true, message: '请输入类型', trigger: 'change'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'change'}
        ],
        locationTagId: [
          {validator: this.validatorTagSnNumberId, trigger: 'blur'}
        ],
        energyTagId: [
          {validator: this.validatorEnergyTagSnNumberId, trigger: 'blur'}
        ]
      },
      actionType: '添加医疗设备',
      tempList: [],
      locationTags: [],
      energyTags: [],
      loadingLocationTag: false,
      loadingEnergyTag: false,
      showUnbindLocationTag: !!(this.formItem.id && this.formItem.tagSnNumber),
      showUnbindEnergyTag: !!(this.formItem.id && this.formItem.energyTagSnNumber),
    };
  },
  props: {
    formItem: Object,
    index: Number,
    statusType: Object
  },
  computed: {
    medicalDevType() {
      return this.$store.state.medicalDevType;
    },
    doorDevType() {
      return this.$store.state.doorDevType;
    },
    devTypes() {
      return this.$getDict('device_type')
    },
  },
  watch: {
    index(val) {
      this.showUnbindLocationTag = !!(this.formItem.id && this.formItem.tagSnNumber);
      this.showUnbindEnergyTag = !!(this.formItem.id && this.formItem.energyTagSnNumber);
      if (this.formItem.id) {
        this.actionType = '编辑医疗设备';
        this.getDetail(this.formItem.id)
      } else {
        this.form = {};
        this.actionType = '添加医疗设备';
      }

      this.$nextTick(() => {
        this.$refs['tempForm'] && this.$refs['tempForm'].clearValidate();
      });
    },
    'form.idleStateRangeEnd': function () {
      this.form.standbyStatusRangeStart = this.form.idleStateRangeEnd;
    },
    'form.standbyStatusRangeEnd': function (val) {
      this.form.workStatus = this.form.standbyStatusRangeEnd;
    },
  },
  methods: {
    getDetail(id) {
      if (!id) {
        return
      }

      medicalApi.queryById(id).then(res => {
        this.form = res.data;
        this.getTempList();
        this.searchLocationTagSn(this.form.tagSnNumber);
        this.searchEnergyTagSn(this.form.energyTagSnNumber);
      }).catch(err => {
        this.$notify.error(err.response && err.response.data && err.response.data.msg || '详情接口异常，请联系管理员');
      })
    },
    changPhoto: function (photo) {
      if (photo) {
        this.form.photoId = photo.attachmentId;
        this.form.photoUrl = photo.url;
      }
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.doing === false) {
          if (!this.form.id) {
            this.doing = true;
            this.$httpRequestOpera(medicalApi.addDevice(this.form), {
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
            this.$httpRequestOpera(medicalApi.editDevice(this.form), {
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
    // 查询模板
    getTempList() {
      let params = {
        templateType: '2',
        devType: this.form.devType
      };

      this.tempList = [];
      this.$http.get('/template/queryByType', {params}).then(res => {
        this.tempList = res.data;
        // console.log('getTempList:',this.form);
        if (!this.form.templateId) {
          return;
        }

        let has = this.tempList.some(t => t.templateId === this.form.templateId);
        if (!has) {
          this.tempList.push(this.form)
        }
      });
    },
    devTypeChangeHandler(val) {
      debugger
      this.form.templateId = '';
      if (val) {
        this.getTempList();
      }
    },
    // 查询定位标签
    searchLocationTagSn(keyword) {
      let params = {
        tagSnNumber: keyword,
        type: '1',
        tagId:this.form.locationTagId
      };

      this.loadingLocationTag = true;
      this.$http.get(`/tag/queryByTagSnNumber`, {params}).then(res => {
        this.locationTags = res.data;
      }).finally(() => {
        this.loadingLocationTag = false;
      });
    },
    // 查询能耗标签
    searchEnergyTagSn(keyword) {
      let params = {
        tagSnNumber: keyword,
        type: '2',
        tagId:this.form.energyTagId
      };

      this.loadingEnergyTag = true;
      this.$http.get(`/tag/queryByTagSnNumber`, {params}).then(res => {
        this.energyTags = res.data;
      }).finally(() => {
        this.loadingEnergyTag = false;
      });
    },
    setTempData(templateId) {
      let template = this.tempList.find(i => i.templateId == templateId);
      this.form = Object.assign({}, this.form, template)
      this.form.firstUserTime = template.devStartUsingTime;
    },
    checkTag(id, type, cb) {
      let deviceId = this.form.id
      this.$http.get(`/tag/checkTagStatus?id=${id}&&type=${type}&&deviceId=${deviceId}`).then(res => {
        cb(res.data)
      }).catch(err => {
        let res = err.response.data;

        cb({
          tagCode: res.code,
          tip: res.msg || '标签异常'
        })
      })
    },
    validatorTagSnNumberId(rule, value, callback) {
      if (value) {
        this.checkTag(value, 1, ({tagCode, tip}) => {
          if (tagCode == 0) {
            callback();
          } else {
            callback(new Error(tip));
          }
        })
      } else {
        callback();
      }
    },
    validatorEnergyTagSnNumberId(rule, value, callback) {
      if (value) {
        this.checkTag(value, 2, ({tagCode, tip}) => {
          if (tagCode == 0) {
            callback();
          } else {
            callback(new Error(tip));
          }
        })
      } else {
        callback();
      }
    },
    handleSelect(item) {
      // console.log(`handleSelect`, item);
    },
    unbindLocationTag() {
      medicalApi.unbindDeviceTagRelation(this.form.locationTagId, this.form.id, "2").then(res => {
        this.form.locationTagId = '';
        this.showUnbindLocationTag = false;
        this.$message.success('解绑成功')
      })
    },
    unbindEnergyTag() {
      medicalApi.unbindDeviceTagRelation(this.form.energyTagId, this.form.id, "1").then(res => {
        this.form.energyTagId = '';
        this.showUnbindEnergyTag = false;
        this.$message.success('解绑成功')
      })
    },
  },
  mounted() {
    this.queryDeptList();
  }
};
</script>
