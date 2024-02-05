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
              <el-form-item label="设备编号" prop="no">
                <el-input placeholder="请输入设备编号" type="input" v-model="form.no"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备名称" prop="name">
                <oms-input placeholder="请输入设备名称" type="input" v-model="form.name"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="设备类型" prop="type">
                <el-select placeholder="请选择设备类型" v-model="form.type" popper-class="selects--custom"
                           @change="devTypeChangeHandler">
                  <el-option :key="item.key" :label="item.label" :value="item.key"
                             v-for="(item, index) in coolDevType">
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
              <el-form-item label="所属单位" prop="orgId">
                <org-select :list="orgList"
                            :remoteMethod="queryAllOrg"
                            placeholder="请输入名称搜索单位" v-model="form.orgId"></org-select>

              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="设备启用时间">
                <el-date-picker placeholder="请选择" type="date" v-model="form.startUsingTime" value-format="timestamp"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="型号">
                <oms-input placeholder="请输入型号" v-model="form.version"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" prop="status">
                <el-select placeholder="请选择状态" v-model="form.status" popper-class="selects--custom">
                  <el-option :key="item.status" :label="item.title" :value="item.status"
                             v-for="(item, index) in statusType">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="是否医用设备">
                <el-radio-group v-model="form.medicalFlag">
                  <el-radio :label="item.key" v-for="item in medicalDevType" :key="item.key">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="容积">
                <oms-input placeholder="请输入容积" v-model="form.volume"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备注">
                <oms-input placeholder="请输入型号" type="textarea" v-model="form.remark"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
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

import {coolApi} from '@/resources';

export default {
  mixins: [methodsMixin],
  components: {
    omsUploadPicture
  },
  data() {
    return {
      form: {
        no: '',
        name: '',
        type: '',
        templateId: '',
        departmentId: '',
        orgId: '',
        startUsingTime: '',
        version: '',
        status: '',
        medicalFlag: '',
        volume: '',
        remark: '',
        doorSheetType: '',
        brand: '',
        standardWorkingHours: '',
        workStatus: '',
        idleStateRangeStart: 0.00,
        idleStateRangeEnd: '',
        standardVoltageRangeStart: '',
        standardVoltageRangeEnd: '',
        standbyStatusRangeStart: '',
        standbyStatusRangeEnd: '',
        firstStatusType: 0,
        locationTagId: '',
        energyTagId: '',
      },
      doing: false,
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        no: [
          {required: true, message: '请输入编码', trigger: 'blur'}
        ],
        orgId: [
          {required: true, message: '请选择所属单位', trigger: 'change'}
        ],
        departmentId: [
          {required: true, message: '请选择所属科室', trigger: 'change'}
        ],
        type: [
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
      actionType: '添加冷链设备',
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
    coolDevType() {
      return this.$getDict('coolDevType')
    },
  },
  watch: {
    index: function (val) {
      this.showUnbindLocationTag = !!(this.formItem.id && this.formItem.tagSnNumber);
      this.showUnbindEnergyTag = !!(this.formItem.id && this.formItem.energyTagSnNumber);

      if (this.formItem.id) {
        this.orgList = [
          {name: this.formItem.orgName, id: this.formItem.orgId}
        ];

        this.form = Object.assign({}, this.formItem);
        this.actionType = '编辑冷链设备';
        this.getTempList();
        this.searchLocationTagSn(this.form.locationTagId);
        this.searchEnergyTagSn(this.form.energyTagId);
      } else {
        this.form = {};
        this.actionType = '添加冷链设备';
      }
      this.$nextTick(() => {
        this.$refs['tempForm'] && this.$refs['tempForm'].clearValidate();
      });
    },
    'form.idleStateRangeEnd': function (val) {
      this.form.standbyStatusRangeStart = this.form.idleStateRangeEnd;
    },
    'form.standbyStatusRangeEnd': function (val) {
      this.form.workStatus = this.form.standbyStatusRangeEnd;
    },
  },
  methods: {
    changPhoto: function (photo) {
      if (photo) {
        this.form.photoId = photo.attachmentId;
        this.form.photoUrl = photo.url;
      }
    },
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.doing === false) {
          // this.form.createTime = this.form.createTime ? this.$moment(this.form.createTime).format('YYYY-MM-DD') : '';
          this.orgList.forEach(i => {
            if (i.id === this.form.orgId) {
              this.form.orgName = i.name;
            }
          });
          if (!this.form.id) {
            this.doing = true;
            this.$httpRequestOpera(coolApi.save(this.form), {
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
            this.$httpRequestOpera(coolApi.update(this.form), {
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
        templateType: '1',
        devType: this.form.type
      };

      this.tempList = [];
      this.$http.get('/template/queryByType', {params}).then(res => {
        this.tempList = res.data;
      });
    },
    devTypeChangeHandler(val) {
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
        tagId: this.form.locationTagId
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
        tagId: this.form.energyTagId
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
      this.form.brand = template.devBrand;
      this.form.version = template.devVersion;
      this.form.volume = template.devVolume;
      this.form.medicalFlag = template.devMedicalFlag;
      this.form.startUsingTime = template.devStartUsingTime;
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
      console.log(`handleSelect`, item);
    },
    unbindLocationTag() {
      coolApi.unbindDeviceTagRelation(this.form.locationTagId, this.form.id, "2").then(res => {
        this.form.locationTagId = '';
        this.showUnbindLocationTag = false;
        this.$message.success('解绑成功')
      })
    },
    unbindEnergyTag() {
      coolApi.unbindDeviceTagRelation(this.form.energyTagId, this.form.id, "1").then(res => {
        this.form.energyTagId = '';
        this.showUnbindEnergyTag = false;
        this.$message.success('解绑成功')
      })
    },
  },
  created() {
    this.queryDeptList();
    this.queryAllOrg();
  }
};
</script>
