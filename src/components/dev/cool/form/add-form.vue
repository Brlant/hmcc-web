<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="tempForm">
        <el-form-item label="名称" prop="name">
          <oms-input placeholder="请输入名称" type="input" v-model="form.name"/>
        </el-form-item>
        <el-form-item label="编号" prop="no">
          <oms-input placeholder="请输入设备编号" type="input" v-model="form.no"/>
        </el-form-item>
        <el-form-item label="所属单位" prop="orgId">
          <org-select :list="orgList"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索单位" v-model="form.orgId"></org-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="item.key" v-for="item in coolDevType" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="品牌">
          <oms-input placeholder="请输入品牌"  v-model="form.brand"/>
        </el-form-item>
        <el-form-item label="型号">
          <oms-input placeholder="请输入型号"  v-model="form.version"/>
        </el-form-item>
        <el-form-item label="设备图片">
          <oms-upload-picture :photoUrl="form.photoUrl" @change="changPhoto"></oms-upload-picture>
        </el-form-item>
        <el-form-item label="设备启用时间">
          <el-date-picker placeholder="请选择" type="date" v-model="form.startUsingTime" value-format="timestamp"/>
        </el-form-item>
        <el-form-item label="是否医用设备">
          <el-radio-group v-model="form.medicalFlag">
            <el-radio :label="item.key" v-for="item in medicalDevType" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="门板类型">
          <el-radio-group v-model="form.doorSheetType">
            <el-radio :label="item.key" v-for="item in doorDevType" :key="item.key">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="容积">
          <oms-input placeholder="请输入容积"  v-model="form.volume"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select placeholder="请选择状态" v-model="form.status" popper-class="selects--custom">
            <el-option :key="item.status" :label="item.title" :value="item.status"
                       v-for="(item, index) in statusType">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <oms-input placeholder="请输入型号" type="textarea" v-model="form.remark"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import omsUploadPicture from '@/components/common/upload/upload.picture';
  import {cool} from '@/resources';
  export default {
    components: {
      omsUploadPicture
    },
    data() {
      return {
        form: {
          status: '1'
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
          type: [
            {required: true, message: '请输入类型', trigger: 'blur'}
          ],
          status: [
            {required: true, message: '请选择状态', trigger: 'change'}
          ]
        },
        actionType: '添加',
        orgList: []
      };
    },
    props: {
      formItem: Object,
      index: Number,
      statusType: Object
    },
    computed: {
      medicalDevType () {
        return this.$store.state.medicalDevType;
      },
      doorDevType () {
        return this.$store.state.doorDevType;
      },
      coolDevType() {
        return this.$store.state.coolDevType
      }
    },
    watch: {
      index: function (val) {
        this.$refs['tempForm'] && this.$refs['tempForm'].clearValidate();
        if (this.formItem.id) {
          this.orgList = [
            {name: this.formItem.orgName, id: this.formItem.orgId}
          ];
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {};
          this.actionType = '添加';
        }
      }
    },
    methods: {
      changPhoto: function (photo) {
        if (photo) {
          this.form.photoId = photo.attachmentId;
          this.form.photoUrl = photo.url;
        }
      },
      queryAllOrg: function (query) {// 查询货主
        let params = {keyWord: query};
        this.$http.get('/orgs/pager', {params: params}).then(res => {
          this.orgList = res.data.list;
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            // this.form.createTime = this.form.createTime ? this.$moment(this.form.createTime).format('YYYY-MM-DD') : '';
            this.orgList.forEach(i => {
              if(i.id === this.form.orgId) {
                this.form.orgName = i.name;
              }
            });
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(cool.save(this.form), {
                errorTitle: '添加失败',
                success: res => {
                  if(res.data.code === 200) {
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
              this.$httpRequestOpera(cool.update(this.form), {
                errorTitle: '修改失败',
                success: res => {
                  if(res.data.code === 200) {
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
      }
    }
  };
</script>
