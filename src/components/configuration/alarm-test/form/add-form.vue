<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="tempForm">
        <el-form-item label="操作人" prop="operationUserId">
          <el-select placeholder="请输入名称搜索操作人" v-model="form.operationUserId"
                     filterable clearable remote :remote-method="queryUserList"
                     @click.native.once="queryUserList('')" @change="operationUserChange">
            <el-option :label="item.name" :value="item.id" :key="item.id"
                       v-for="item in userList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试类型" prop="type">
          <el-radio-group v-model="form.type" size="small" @change="checkChange(form)">
            <el-radio-button :label="item.key" :key="item.key" v-for="item in alarmTestList">{{item.label}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {AlarmTest, OrgUser} from '@/resources';

  export default {
    data() {
      return {
        form: {
          operationUserId: '',
          type: '',
          noticeTarget: ''
        },
        doing: false,
        rules: {
          operationUserId: [
            {required: true, message: '请选择操作人', trigger: 'change'}
          ],
          type: [
            {required: true, message: '请选择测试类型', trigger: 'change'}
          ]
        },
        actionType: '添加',
        alarmTestList: [
          {key: '0', label: '短信报警'},
          {key: '1', label: '微信报警'}
        ],
        userList: []
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    watch: {
      index: function (val) {
        this.$refs['tempForm'].clearValidate();
        if (this.formItem.id) {
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            operationUserId: '',
            type: '',
            noticeTarget: ''
          };
          this.actionType = '添加';
        }
      }
    },
    methods: {
      operationUserChange() {
        this.form.type = '';
      },
      queryUserList(query) {
        let params = {keyWord: query};
        let orgId = this.$store.state.user.userCompanyAddress;
        OrgUser.queryOrgInfo(orgId, params).then(res => {
          this.userList = res.data.list;
        });
      },
      checkChange(item) {
        if(!item.operationUserId) return;
        if (item.type === '0') {
          this.checkContactWay(item);
        } else {
          // 校验微信模式
          this.queryWeChart(item);
        }
      },
      checkContactWay(item) {
        this.userList.forEach(i => {
          if (i.id ===  item.operationUserId) {
            item.noPass = false;
            if (!i.phone) {
              item.noPass = true;
              this.$notify.info({
                message: `联系人"${i.name}"无法取得手机联系方式，请尝试微信`
              });
            } else {
              item.noticeTarget = i.phone;
            }
          }
        });
      },
      queryWeChart(item) {
        this.$http.get(`/ccsWeChat/queryWechatUser/${item.operationUserId}`).then(res => {
          item.noticeTarget = res.data.openId;
          item.loading = false;
        }).catch(e => {
          this.getQCode(item);
        });
      },
      getQCode(item) {
        let params = {
          userId: item.operationUserId
        };
        this.$emit('openDialog');
        // 获取二维码
        this.$http.get('/ccsWeChat/queryWechatQrCode', {params}).then(res => {
          item.ticket = res.data.ticket;
          this.$emit('openDialog', res.data.path, item);
        });
        // 已经在轮询中, 返回
        if (item.loading) return;
        // 轮询查询关注信息
        setTimeout(() => {
          item.loading = true;
          this.loopQueryInfo(item);
        }, 3000);
      },
      loopQueryInfo(item) {
        if (item.noticeTarget || this.index !== 0) return;
        let code = this.getQCodeInfo();
        this.$http.get(`/ccsWeChat/queryWeChatTicketInfo/${code.ticket}`).then(res => {
          item.loading = false;
          if (res.data.openId === '400') {
            this.$notify.info({
              message: '该微信账号已绑定通知人，请取消关注后再操作'
            });
            this.$emit('closeDialog');
          } else {
            this.$notify.success({
              message: item.name ? `通知人"${item.name}"关注成功` : '关注成功'
            });
            item.noticeTarget = res.data.openId;
            this.$emit('closeDialog');
          }
        }).catch(() => {
          setTimeout(() => {
            this.loopQueryInfo(item, code.ticket);
          }, 3000);
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {

            this.userList.forEach(i => {
              if(i.id === this.form.operationUserId) {
                this.form.operationUserName = i.name;
              }
            });
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(AlarmTest.save(this.form), {
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
              this.$httpRequestOpera(AlarmTest.update(this.form), {
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
