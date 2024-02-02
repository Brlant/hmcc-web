<style lang="scss" scoped>
.list-item {
  position: relative;
  line-height: 20px;
  padding-top: 0;
  padding-bottom: 0;
  border: 0;

  .download-link {
    display: none;
  }

  &:hover .download-link {
    display: block;
  }

  &.list-item_pointer {
    cursor: pointer;
  }
}

.list_flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}


</style>
<template>
  <div>
    <ul class="show-list">
      <li v-for="attachment in attachmentList" class="list-item list_flex list-item_pointer"
          @click="handlePreview(attachment)">
        <div class="attachment-name">
          <el-tooltip :content="attachment.attachmentFileName" effect="dark" placement="top">
            <span>
                {{ attachment.attachmentFileName }}
            </span>
          </el-tooltip>
        </div>
        <div>
          <perm :label="perm">
            <a class="download-link pull-right" @click.stop="$downloadFile(attachment)">
              <i class="el-icon-t-download"></i>
            </a>
          </perm>
          <perm :label="updatePermission">
            <a class="download-link pull-right" href="#" @click.stop.prevent="editName(attachment)">
              <i class="el-icon-t-edit"></i>
            </a>
          </perm>
          <perm :label="deletePermission">
            <a class="download-link pull-right" href="#" @click.stop.prevent="handleRemove(attachment)">
              <i class="el-icon-t-delete"></i>
            </a>
          </perm>
        </div>
      </li>
    </ul>

    <el-dialog :modal="false" :visible.sync="dialogFormVisible" title="编辑附件名称">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item :label-width="formLabelWidth" label="附件名称" prop="attachmentFileName">
          <el-input v-model="form.attachmentFileName" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button :disabled="doing" type="primary" @click.prevent.stop="onSubmit('form')">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {OmsAttachment} from '@/resources';

export default {
  props: {
    objectId: {
      type: String,
      default: ''
    },
    objectType: {
      type: String,
      default: ''
    },
    attachmentIdList: {
      type: [Array, String, Object],
      default: []
    },
    permission: {
      type: String,
      default: 'show'
    },
    deletePermission: {
      type: String,
      default: ''
    },
    updatePermission: {
      type: String,
      default: 'erp-attachment-name-update'
    }
  },
  data() {
    return {
      object: {
        objectId: this.objectId,
        objectType: this.objectType
      },
      attachmentList: [],
      perm: this.permission,
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      rules: {
        attachmentFileName: [
          {required: true, message: '请输入附件名称', trigger: 'blur'}
        ]
      },
      doing: false
    };
  },
  watch: {
    objectId: function (val) {
      this.object.objectId = val;
      this.getFileList();
    },
    objectType: function (val) {
      this.object.objectType = val;
    },
    attachmentIdList: function () {
      this.getFileList();
    },
    perm: function (val) {
      this.perm = val;
    }
  },
  methods: {
    onSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid || this.doing) return;
        // 修改附件名称
        let param = {'attachmentFileName': this.form.attachmentFileName};
        let index = '';
        this.attachmentList.forEach(val => {
          if (val.attachmentId === this.form.attachmentId) {
            index = this.attachmentList.indexOf(val);
          }
        });
        this.doing = true;
        this.$http.put(`/omsAttachment/${this.form.attachmentId}/name`, param).then(res => {
          this.$notify.success({
            message: '修改附件文件名成功'
          });
          this.attachmentList.splice(index, 1, res.data);
          this.dialogFormVisible = false;
          this.doing = false;
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '修改附件文件名失败'
          });
          this.doing = false;
        });
      });
    },
    editName: function (val) {
      this.form = {
        attachmentId: val.attachmentId,
        attachmentFileName: val.attachmentFileName
      };
      this.dialogFormVisible = true;
      if (this.$refs['form']) {
        this.$refs['form'].clearValidate();
      }
    },
    handleRemove(attachment) {
      if (!attachment) {
        return;
      }
      this.$confirm('确认删除附件"' + attachment.attachmentFileName + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        OmsAttachment.delete(attachment.attachmentId).then(() => {
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除附件' + attachment.attachmentFileName + '"'
          });
          // 将附件从附件列表中删除
          let index = this.attachmentList.indexOf(attachment);
          this.attachmentList.splice(index, 1);
          this.$emit('change', this.attachmentList);
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '删除失败'
          });
        });
      });
    },
    getFileList: function () {
      if (!this.object.objectId) return;
      OmsAttachment.queryOneAttachmentList(this.object.objectId, this.object.objectType).then(res => {
        this.attachmentList = res.data;
      });
    },
    handlePreview(file) {
      this.$store.commit('changeAttachment', {currentId: file.attachmentId, attachmentList: this.attachmentList});
    }
  },
  mounted() {
    this.getFileList();
  }
};
</script>
