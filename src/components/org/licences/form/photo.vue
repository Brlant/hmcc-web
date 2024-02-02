<style lang="scss" scoped>
@import "../../../../assets/scss/mixins";

$leftWidth: 0;
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
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    left: $leftWidth;

    .show-content {
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
  <div class="content-part">
    <div class="content-right min-gutter">
      <h3 class="clearfix">{{ formItem.id ? '编辑' : '新增' }}</h3>
      <el-form ref="photoform" :model="form" :rules="rules" label-width="100px">
        <el-form-item v-if="!form.id" label="业务单位" prop="orgId">
          <el-select v-model="form.orgId" :clearable="true" :remote-method="filterOrg" filterable
                     placeholder="请输入名称搜索业务单位" popperClass="good-selects"
                     remote @clear="filterOrg('')"
                     @click.native="filterOrg('')">
            <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
              <div style="overflow: hidden">
                <span class="pull-left" style="clear: right">{{ org.name }}</span>
              </div>
              <div style="overflow: hidden">
              <span class="select-other-info pull-left">
                <span>系统代码:</span>{{ org.manufacturerCode }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="licenceType">
          <el-select v-model="form.licenceType" placeholder="请选择证照">
            <el-option v-for="item in certificateList" :key="item.key" :label="item.label"
                       :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="form.licenceNumber" placeholder="请输入证照编号"></el-input>
        </el-form-item>
        <el-form-item ref="validStartTime" label="开始日期" prop="validStartTime">
          <el-date-picker
            v-model="form.validStartTime"
            format="yyyy-MM-dd"
            placeholder="选择日期" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item ref="validEndTime" label="截止日期" prop="validEndTime">
          <el-date-picker
            v-model="form.validEndTime"
            format="yyyy-MM-dd"
            placeholder="选择日期" value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="附件" prop="photos">
          <oms-upload :fileList="licenses" :formData="{ objectId:form.id , objectType:'basePhoto'}" :multiple="true"
                      type="picture"
                      @change="changeFiles"></oms-upload>
        </el-form-item>
        <el-form-item label-width="100px">
          <el-button :disabled="doing" type="success" @click.prevent="onSubmit('photoform')">保存</el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>
import {BaseInfo, OmsAttachment, orgLicence} from '@/resources';

export default {
  props: ['formItem'],
  data: function () {
    let checkStartTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择截止日期'));
      } else {
        if (this.form.validEndTime < this.form.validStartTime) {
          callback(new Error('开始日期必须小于截止日期'));
        } else {
          callback();
        }
      }
    };
    let checkEndTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择截止日期'));
      } else {
        if (this.form.validEndTime < this.form.validStartTime) {
          callback(new Error('截止日期必须大于开始日期'));
        } else {
          callback();
        }
      }
    };
    return {
      licenses: [],
      form: this.formItem,
      rules: {
        orgId: [
          {required: true, message: '请选择业务单位', trigger: 'change'}
        ],
        licenceType: [
          {required: true, message: '请选择证照名称', trigger: 'change'}
        ],
        validStartTime: [
          {required: true, message: '请选择起始时间', trigger: 'change'},
          {validator: checkStartTime, trigger: 'blur'}
        ],
        validEndTime: [
          {required: true, message: '请选择截止时间', trigger: 'change'},
          {validator: checkEndTime, trigger: 'blur'}
        ]
      },
      doing: false,
      orgList: []
    };
  },
  computed: {
    uploadUrl: function () {
      return this.$store.state.uploadUrl;
    },
    certificateList() {
      return this.$getDict('businessUnitCertificate');
    }
  },
  watch: {
    formItem: function (val) {
      this.form = val;
      this.licenses = [];
      this.getFileList();
      this.$nextTick(() => {
        this.$refs['photoform'].clearValidate();
      })
    }
  },
  methods: {
    changeFiles: function (fileList) {
      let ids = [];
      fileList.forEach(file => {
        ids.push(file.attachmentId);
      });
      this.form.attachmentIdList = ids;
      this.form.photos = fileList;
    },
    getFileList: function () {
      if (!this.form.id) return;
      OmsAttachment.queryOneAttachmentList(this.form.id, 'orgLicence').then(res => {
        this.licenses = res.data;
        this.form.photos = res.data;
        let ids = [];
        this.form.photos.forEach(file => {
          ids.push(file.attachmentId);
        });
        this.form.attachmentIdList = ids;
      });
    },
    filterOrg: function (query) {
      let param = {
        keyWord: query
      };
      BaseInfo.query(param).then(res => {
        this.orgList = res.data.list;
      });
    },
    onSubmit: function (formName) {
      if (this.form.photos.length === 0) {
        this.$notify.error({
          duration: 2000,
          message: '请上传证照文件'
        });
        return false;
      }
      this.$refs[formName].validate((valid) => {
        if (!valid || this.doing) {
          return false;
        }
        this.doing = true;
        let form = this.form;
        if (form.id) {
          orgLicence.update(form.id, form).then(res => {
            this.doing = false;
            this.$emit('close');
            this.$emit('change', res.data);
          });
        } else {
          // 获取当前表单下的附件
          this.getFileList();
          orgLicence.save(form).then(res => {
            this.doing = false;
            this.$emit('close');
            this.$emit('change', res.data);
          });
        }

      });
    }
  }
};
</script>
