<style lang="scss" scoped>
@import "../../../assets/scss/mixins";

$leftWidth: 200px;
.min-gutter {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.content-part {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;

  .content-left {
    width: $leftWidth;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    text-align: left;
    background-color: #eef2f3;

    > ul {
      margin: 0;
    }

    > h2 {
      padding: 0;
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      line-height: 55px;
      border-bottom: 1px solid #ddd;
    }

    .list-style {
      cursor: pointer;
      padding: 10px;
      text-align: center;

      span {
        display: inline-block;
        padding: 8px 35px;
      }

      &.active {
        span {
          background-color: $activeColor;
          border-radius: 20px;
          color: $activeColorFont
        }
      }

      &:hover {
        background: #dee9eb
      }

    }

  }

  .content-right {
    > h3 {
      padding: 0;
      margin: 0 0 20px;
      font-size: 18px;
      font-weight: normal;
      line-height: 55px;
      height: 55px;
      border-bottom: 1px solid #ddd;
      text-align: center;
      position: fixed;
      top: 0;
      right: 0;
      left: $leftWidth;
      background: #fff;
      z-index: 2;
    }

    position: absolute;
    top: 0;
    left: $leftWidth;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding-top: 75px;

    .hide-content {
      display: none;
    }

    .show-content {
      padding: 0 20px;
      display: block;
    }
  }

  .min-gutter {
    .el-form-item {
      margin-bottom: 20px;
    }

    .el-form-item__label {
      font-size: 12px
    }
  }
}

.el-form .el-select {
  display: block;
}

.el-form .el-cascader {
  display: block;
}
</style>
<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix right-title">{{ orgTitle }}基础信息</h2>
        <ul>
          <li align="center" style="margin-top:40px;position:absolute;bottom:30px;left:0;right:0;text-align: center">
            <el-button :disabled="doing" type="primary" @click="onSubmit('baseForm')">保存</el-button>
          </li>
        </ul>

      </div>
      <div class="content-right min-gutter">
        <h3></h3>
        <el-form ref="baseForm" :model="form" :rules="rules" class="min-gutter" label-width="140px"
                 onsubmit="return false" style="padding-right: 20px" @submit.prevent="onSubmit('baseForm')">
          <el-form-item :label="orgTitle+'名称'" prop="name">
            <oms-input v-model="form.name" placeholder="请输入名称" type="text"></oms-input>
          </el-form-item>
          <el-form-item :label=" orgTitle+'简称'">
            <oms-input v-model="form.nameJc" placeholder="请输入简称" type="text"></oms-input>
          </el-form-item>
          <el-form-item v-show="action==='edit'" :label=" orgTitle+'名称拼音'"
                        :prop="action==='edit' ? 'namePhonetic' : '' "
                        :rules="[{required: true, message: '请输入单位名称拼音', trigger: 'blur'}]">
            <oms-input v-model="form.namePhonetic" placeholder="请输入通用名称拼音" type="text"></oms-input>
          </el-form-item>
          <el-form-item v-show="action==='edit'" :label=" orgTitle+'拼音首字母'"
                        :prop="action==='edit' ? 'nameAcronymy' : ''"
                        :rules="[{required: true, message: '请输入单位拼音首字母', trigger: 'blur'}]">
            <oms-input v-model="form.nameAcronymy" placeholder="请输入通用名称拼音首字母" type="text"></oms-input>
          </el-form-item>
          <el-form-item label="公司图标">
            <oms-upload-picture :photoUrl="form.orgPhoto" @change="changPhoto"></oms-upload-picture>
          </el-form-item>
          <el-form-item :label="orgTitle+'系统代码'" prop="manufacturerCode">
            <el-input v-model="form.manufacturerCode" placeholder="请输入系统代码" type="text">
              <span v-if="form.manufacturerCode" slot="suffix">{{ form.manufacturerCode.length }}</span>
            </el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="creditCode">
            <el-input v-model="form.creditCode" :style="`width:${form.id ? '70%' : '100%'}`" maxlength="18"
                      placeholder="请输入统一社会信用代码" show-word-limit type="text">
            </el-input>
          </el-form-item>
          <el-form-item label="区域代码" prop="orgAreaCode">
            <el-input v-model="form.orgAreaCode" :maxlength="10" placeholder="请输入区域代码" type="text">
              <span v-if="form.orgAreaCode" slot="suffix">{{ form.orgAreaCode.length }}</span>
            </el-input>
          </el-form-item>
          <el-form-item label="法人代表">
            <oms-input v-model="form.legalRepresentative" placeholder="请输入法人代表" type="text"></oms-input>
          </el-form-item>
          <el-form-item :label="orgTitle+'类型'" prop="orgRelationTypeList">
            <el-select v-model="form.orgRelationTypeList" multiple placeholder="请选择类型">
              <el-option v-for="item in orgRelationType" :key="item.key" :label="item.label"
                         :value="item.key"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话">
            <oms-input v-model="form.phone" placeholder="请输入联系电话" type="text"></oms-input>
          </el-form-item>
          <el-form-item label="联系人">
            <oms-input v-model="form.contact" placeholder="请输入联系人" type="text"></oms-input>
          </el-form-item>
          <el-form-item label="邮政编码">
            <oms-input v-model="form.postcode" placeholder="请输入邮政编码" type="text"></oms-input>
          </el-form-item>
          <el-form-item :label="orgTitle+'所在地区'" prop="selectOptions">
            <el-cascader v-model="form.selectOptions" :checkStrictly="true" :options="options"
                         placeholder="请选择省市区"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <oms-input v-model="form.address" placeholder="建议您如实填写详细地址,例如街道名称,门牌号码等信息" type="text"></oms-input>
          </el-form-item>
          <el-form-item v-if="!form.id" label="管理员手机号码">
            <oms-input v-model="form.adminTelephone" placeholder="请输入手机号码" type="text"></oms-input>
          </el-form-item>
          <el-form-item v-if="!form.id" label="管理员邮箱">
            <oms-input v-model="form.adminEmail" placeholder="请输入邮箱" type="text"></oms-input>
          </el-form-item>
          <el-form-item v-if="form.type==='0'||orgType===0" label="默认物流中心">
            <el-select v-model="form.defaultCentreId" filterable placeholder="请选择默认物流中心">
              <el-option v-for="item in LogisticsCenter" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <!--<el-form-item locate-tag-width="140px">-->
          <!--<el-button type="primary" @click="onSubmit('baseForm')" native-type="submit">保存</el-button>-->
          <!--<el-button @click="doClose">取消</el-button>-->
          <!--</el-form-item>-->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {BaseInfo, plateNumber, User} from '@/resources';
import utils from '@/tools/utils';
import omsUploadPicture from '@/components/common/upload/upload.picture.vue';
import axios from 'axios';

export default {
  components: {
    omsUploadPicture
  },
  props: {
    formItem: {
      type: Object,
      default: {},
      required: true
    },
    title: {
      type: String,
      default: '增加'
    },
    action: {
      type: String,
      default: ''
    },
    orgTitle: {
      type: String,
      default: '货主'
    }
  },
  data: function () {
    let checkEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'));
      } else {
        let re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ig;
        if (!re.test(value)) {
          callback(new Error('请输入正确的邮箱'));
        }
        if (this.action === 'edit') {
          let orgId = this.$route.params.id;
          User.checkEmail(value, this.form.adminId, orgId).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('邮箱已经存在'));
            }
          });
        } else {
          callback();
        }

      }
    };
    let checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入座机电话号码'));
      } else {
        let re = /^(0\d{2,3}-?)?\d{7,8}$/ig;
        if (!re.test(value)) {
          callback(new Error('请输入正确的座机电话号码'));
        } else {
          callback();
        }
      }
    };
    let checkTelePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else {
        let re = /^\d{11}$/;
        if (!re.test(value)) {
          callback(new Error('请输入正确的手机号码'));
        }
        if (this.action === 'edit') {
          let orgId = this.$route.params.id;
          User.checkPhone(value, this.form.adminId, orgId).then(function (res) {
            if (res.data.valid) {
              callback();
            } else {
              callback(new Error('手机号码已经存在'));
            }
          });
        } else {
          callback();
        }
      }
    };
    let checkName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入单位名称'));
      } else {
        BaseInfo.checkName(value, this.form.id).then(function (res) {
          if (res.data.valid) {
            callback();
          } else {
            callback(new Error('单位名称已经存在'));
          }
        });
      }
    };
    let checkCreditCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入统一社会信用代码'));
      } else {
        BaseInfo.checkCreditCode(value, this.form.id).then(function (res) {
          if (res.data.valid) {
            callback();
          } else {
            callback(new Error('统一社会信用代码已经存在'));
          }
        });
      }
    };
    let checkManufacturerCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入单位代码'));
      } else {
        BaseInfo.checkManufacturerCode(value, this.form.id).then(function (res) {
          if (res.data.valid) {
            callback();
          } else {
            callback(new Error('单位代码已经存在'));
          }
        });
      }
    };
    let checkAdminAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入管理员账号'));
      } else {
        BaseInfo.checkAdminAccount(value, this.form.id).then(function (res) {
          if (res.data.valid) {
            callback();
          } else {
            callback(new Error('管理员账号已经存在'));
          }
        });
      }
    };
    return {
      orgType: this.$route.meta.type,
      form: {
        orgRelationTypeList: []
      },
      options: utils.address,
      rules: {
        name: [
          {required: true, message: '请输入单位名称', trigger: 'blur'},
          {validator: checkName, trigger: 'blur'}
        ],
        orgAreaCode: [
          {required: true, message: '请输入区域代码', trigger: 'blur'}
        ],
        creditCode: [
          {required: true, message: '请输入信用代码', trigger: 'blur'}
        ],
        manufacturerCode: [
          {required: true, message: '请输入单位代码', trigger: 'blur'},
          {validator: checkManufacturerCode, trigger: 'blur'}
        ],
        adminAccount: [
          {required: true, message: '请输入管理员账号', trigger: 'blur'},
          {validator: checkAdminAccount, trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入座机号码', trigger: 'blur'},
          {validator: checkPhone, trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        adminTelephone: [
          {required: true, message: '请输入管理员手机号码', trigger: 'blur'},
          {validator: checkTelePhone, trigger: 'blur'}
        ],
        adminEmail: [
          {required: true, message: '请输入管理员邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        defaultCentreId: [
          {required: true, message: '请选择默认物流中心', trigger: 'blur'}
        ],
        orgRelationTypeList: [
          {required: true, type: 'array', message: '请选择单位类型', trigger: 'change'}
        ],
        address: [
          {required: true, message: '请输入单位详细地址', trigger: 'blur'}
        ],
        selectOptions: [
          {required: true, message: '请输入单位所在地区', trigger: 'change'}
        ]
      },
      doing: false,
      photo: {},
      LogisticsCompanies: [],
      orgList: []
    };
  },
  mounted: function () {
  },
  computed: {
    orgLevel() {
      return this.$getDict('orgLevel');
    },
    orgRelationType() {
      return this.$getDict('orgRelationType');
    },
    LogisticsCenter() {
      return this.$store.state.logisticsCenterList || [];
    }
  },
  watch: {
    formItem: function (val) {
      this.orgList = [];
      if (val.id) {
        this.setOrgInfo(val);
      } else {
        this.resetOrgInfo(val);
      }
      this.$nextTick(() => {
        this.$refs.baseForm && this.$refs.baseForm.clearValidate();
      });
    },
    'form.selectOptions': function () {
      let selectOptions = utils.formatAddressByType(this.form.selectOptions[0],
        this.form.selectOptions[1], this.form.selectOptions[2], 'label');
      this.form.province = selectOptions[0] || '';
      this.form.city = selectOptions[1] || '';
      this.form.region = selectOptions[2] || '';
    },
    'form.creditCode': function (val) {
      if (val) {
        this.form.creditCode = val.toUpperCase();
      }
    }
  },
  methods: {
    setOrgInfo: function (val) {
      let orgId = '';
      if (this.action === 'edit') {
        // 保存id
        orgId = this.formItem.id;
      } else {
        orgId = '';
      }
      this.form = Object.assign({}, val, {selectOptions: []});
      // 设置orgId
      this.form.id = orgId;
      if (this.action !== 'edit') {
        this.form.orgRelationTypeList = [];
      }

      if (!this.form.plateList || !this.form.plateList.length) {
        this.form.plateList = [{orgPlateNumber: ''}];
      }

      this.form.selectOptions = utils.formatAddressByType(this.form.province, this.form.city, this.form.region);
      this.queryLogisticsCompany(this.form.logisticsCompanyName);
    },
    resetOrgInfo: function (val) {
      let orgId = '';
      if (this.action === 'edit') {
        // 保存id
        orgId = this.formItem.id;
      }
      this.photo = {};
      this.form.selectOptions = [];
      this.form = {
        'address': '',
        'adminAccount': '',
        'adminEmail': '',
        'adminId': '',
        'adminName': '',
        'adminTelephone': '',
        'auditDto': {
          'baseInfoStatus': '',
          'bizScopeStatus': '',
          'financeStatus': '',
          'id': '',
          'licenseStatus': '',
          'nextProcess': '',
          'objectId': '',
          'objectType': '',
          'process': '',
          'status': '',
          'warehouseStatus': ''
        },
        'auditedBy': '',
        'auditedStatus': '',
        'auditedTime': '',
        'city': '',
        'contact': '',
        'createTime': '',
        'createdBy': '',
        'creditCode': '',
        'defaultCenter': '',
        'defaultCentreId': '',
        'deleteFlag': true,
        'extDto': {
          'id': '',
          'licensePlateNumber': '',
          'logisticsDealer': '',
          'transportTimeLimit': ''
        },
        'id': orgId,
        'legalRepresentative': '',
        'level': '',
        'logisticsCompany': '',
        'logisticsCompanyName': '',
        'manufacturerCode': '',
        'name': '',
        'nameAcronymy': '',
        'nameJc': '',
        'namePhonetic': '',
        'orgAreaCode': '',
        'orgAuditStatus': '',
        'orgOutScanCode': true,
        'orgPhoto': '',
        'orgPhotoId': '',
        'orgRelationList': [],
        'orgRelationType': '',
        'orgRelationTypeList': [],
        'orgScanCode': true,
        'otherAuditStatus': '',
        'outScanCode': '',
        'phone': '',
        'plateList': [],
        'postcode': '',
        'province': '',
        'region': '',
        'relationList': [],
        'remarks': '',
        'scanCode': '',
        'skipFlag': true,
        'transportationTime': 0,
        'type': '',
        'updateTime': '',
        'selectOptions': []
      };
      this.form.extDto = Object.assign({}, {
        id: '',
        licensePlateNumber: '',
        transportTimeLimit: '',
        logisticsDealer: ''
      }, val.extDto || {});
    },
    changPhoto: function (photo) {
      if (photo) {
        this.photo = photo;
        this.form.orgPhoto = this.photo.url;
        this.form.orgPhotoId = this.photo.attachmentId;
      }
    },
    queryLogisticsCompany(query) {
      BaseInfo.query({keyWord: query, orgRelationType: 'LogisticCorp'}).then(res => {
        this.LogisticsCompanies = res.data.list;
      });
    },
    addPlateNumberItem(item) {
      this.form.plateList.push({orgPlateNumber: ''});
    },
    deletePlateNumberItem(item) {
      let index = this.form.plateList.indexOf(item);
      if (index !== -1) this.form.plateList.splice(index, 1);
    },
    onSubmit: function (formName) {
      if (!this.form.city) {
        this.form.city = '';
      }
      if (!this.form.region) {
        this.form.region = '';
      }
      let self = this;
      this.$refs[formName].validate((valid) => {
        if (!valid || this.doing) {
          return false;
        }
        this.doing = true;
        // this.form.orgRelationTypeList = this.orgRelationTypeList;

        if (this.action === 'add') {
          if (self.form.id) {
            self.form.id = '';
          }
          if (self.form.extDto && self.form.extDto.id) {
            self.form.extDto.id = '';
          }
          self.form.type = '1';
          BaseInfo.save(self.form).then(() => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '新增"' + this.orgTitle + self.form.name + '"成功'
            });
            self.$emit('change', Object.assign({}, self.form));
          }).catch(error => {
            this.doing = false;
            this.$notify.error({
              duration: 2000,
              name: '失败',
              message: error.response && error.response.data && error.response.data.msg || '新增失败'
            });
          });
        } else {
          let plates = self.form.plateList.filter(f => f.orgPlateNumber).map(m => {
            return {
              orgPlateNumber: m.orgPlateNumber,
              orgId: self.form.id
            };
          });
          axios.all([BaseInfo.update(self.form.id, self.form), plateNumber.batchAddPlateNumber(plates)]).then(axios.spread(() => {
            this.doing = false;
            this.$notify.success({
              duration: 2000,
              name: '成功',
              message: '修改' + this.orgTitle + '基础信息"' + self.form.name + '"成功'
            });
            self.$emit('change', Object.assign({}, self.form));
          })).catch(error => {
            this.doing = false;
            this.$notify.error({
              duration: 2000,
              name: '失败',
              message: error.response && error.response.data && error.response.data.msg || '修改' + this.orgTitle + '基础信息"' + self.form.name + '"失败'
            });
          });
        }
      });
    },
    doClose: function () {
      this.$emit('close');
      this.$refs['baseForm'].resetFields();
    },
  }
};
</script>
