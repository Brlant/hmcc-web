<style lang="scss">

</style>
<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}通知列表</template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="save('tempForm')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="tempForm" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="名称" prop="notifyListName">
          <oms-input type="text" v-model="form.notifyListName" placeholder="请输入名称"></oms-input>
        </el-form-item>
        <el-form-item>
          <des-btn v-has="'show'" icon="plus" @click="addRule('0')">添加系统联系人</des-btn>
          <des-btn v-has="'show'" icon="plus" @click="addRule('1')">添加外部联系人</des-btn>
        </el-form-item>
        <div class="part-border-box" v-for="(item, index) in form.details" :key="index">
          <label class="title">{{item.memberSource === '0' ? '系统联系人' : '外部联系人'}}</label>
          <des-btn v-has="'show'" class="btn-modify" icon="delete" @click="deleteRule(item)"/>
          <div>
            <el-row>
              <el-col :span="8">
                <el-form-item :prop="`details.${index}.targetStr`" label-width="0" v-if="item.memberSource === '0'"
                              :rules="[{ required: true, message: '请选择系统用户', trigger: 'change' }]">
                  <el-select placeholder="请选择系统用户" v-model="item.targetStr" @change="userChange(item)"
                             filterable clearable remote :remote-method="queryUserList"
                             @click.native.once="queryUserList('')">
                    <el-option :label="item.name" :value="item.id" :key="item.id"
                               v-for="item in userList"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :prop="`details.${index}.notifyType`" label-width="0" v-if="item.memberSource === '1'"
                              :rules="[{ required: true, message: '请选择通知类型', trigger: 'change' }]">
                  <!--<el-select placeholder="请选择通知类型" v-model="item.notifyType" @change="checkChange(item)">-->
                  <!--<el-option :label="item.label" :value="item.key" :key="item.key"-->
                  <!--v-for="item in checkList"></el-option>-->
                  <!--</el-select>-->
                  <el-radio-group v-model="item.notifyType" size="small" @change="checkChange(item)">
                    <el-radio-button :label="item.key" :key="item.key" v-for="item in checkList">{{item.label}}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="7">
                <el-form-item :prop="`details.${index}.notifyType`" label-width="0" v-if="item.memberSource === '0'"
                              :rules="[{ required: true, message: '请选择通知类型', trigger: 'change' }]">
                  <!--<el-select placeholder="请选择通知类型" v-model="item.notifyType" @change="checkChange(item)">-->
                  <!--<el-option :label="item.label" :value="item.key" :key="item.key"-->
                  <!--v-for="item in checkList"></el-option>-->
                  <!--</el-select>-->
                  <el-radio-group v-model="item.notifyType" size="small" @change="checkChange(item)">
                    <el-radio-button :label="item.key" :key="item.key" v-for="item in checkList">{{item.label}}
                    </el-radio-button>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :prop="`details.${index}.targetStr`" label-width="0"
                              v-if="item.memberSource === '1' && item.notifyType !== '3'"
                              :rules="{validator: promptMsg(item).validator, trigger: 'blur'}">
                  <oms-input type="text" v-model="item.targetStr"
                             :placeholder="promptMsg(item).placeholder"></oms-input>
                </el-form-item>
                <el-form-item label-width="0" v-if="item.memberSource === '1' && item.notifyType === '3'">
                  <oms-input type="text" v-model="item.comment" placeholder="请输入备注"></oms-input>
                </el-form-item>
              </el-col>
              <el-col :span="1"></el-col>
              <el-col :span="7">
                <el-form-item label-width="0"
                              v-if="item.memberSource !== '1'||item.memberSource === '1' && item.notifyType !== '3'">
                  <oms-input type="text" v-model="item.comment" placeholder="请输入备注"></oms-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {Department, NotifyRule, User} from '@/resources';

  export default {
    data() {
      return {
        formModel: {
          notifyListName: '',
          details: []
        },
        ruleModel: {
          memberSource: '',
          notifyType: '1',
          comment: '',
          targetStr: ''
        },
        form: {},
        doing: false,
        rules: {
          notifyListName: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ]
        },
        actionType: '添加',
        checkList: [
          {label: '短信', key: '1', placeholder: '请输入手机号', validator: this.checkPhone},
          {label: '邮箱', key: '2', placeholder: '请输入邮箱', validator: this.checkEmail},
          {label: '微信', key: '3'}
        ],
        typeList: [
          {label: '系统', key: '0'},
          {label: '手动添加', key: '1'}
        ],
        userList: []
      };
    },
    computed: {},
    props: ['formItem', 'index', 'getQCodeInfo'],
    watch: {
      index: function (val) {
        if (val !== 0) return;
        this.form = JSON.parse(JSON.stringify(this.formModel));
        if (this.formItem.id) {
          this.queryDetail();
          this.actionType = '编辑';
        } else {
          // this.form = JSON.parse(JSON.stringify(this.formModel));
          this.actionType = '添加';
        }
      }
    },
    methods: {
      checkPhone(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入手机号码'));
        } else {
          let re = /^1[345789]\d{9}$/;
          if (!re.test(value)) {
            callback(new Error('请输入正确的手机号码'));
          } else {
            callback();
          }
        }
      },
      checkEmail(rule, value, callback) {
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else {
          let re = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/ig;
          if (!re.test(value)) {
            callback(new Error('请输入正确的邮箱'));
          } else {
            callback();
          }
        }
      },
      addRule(type) {
        this.form.details.splice(0, 0, Object.assign({}, this.ruleModel, {memberSource: type}));
      },
      deleteRule(item) {
        let index = this.form.details.indexOf(item);
        index !== -1 && this.form.details.splice(index, 1);
      },
      promptMsg(item) {
        let ary = this.checkList.filter(f => f.key === item.notifyType);
        return ary.length ? ary[0] : {
          placeholder: '请输入联系方式',
          rules: []
        };
      },
      userChange(item) {
        // 修改联系人时，清空对应的openId
        item.openId = '';
        this.checkContactWay(item);
        // 校验微信模式
        this.queryWeChart(item);
      },
      checkChange(item) {
        item.openId = '';
        item.memberSource === '1' && (item.targetStr = '');
        item.memberSource === '0' && this.checkContactWay(item);

        // 校验微信模式
        this.queryWeChart(item);
      },
      checkContactWay(item) {
        if (item.notifyType === '3') {
          item.checkPass = false;
          return;
        }
        this.userList.forEach(i => {
          if (i.id === item.targetStr) {
            item.checkPass = false;
            if (item.notifyType === '1' && !i.phone) {
              this.$notify.info({
                message: `联系人"${i.name}"无法取得手机联系方式，请尝试邮箱`
              });
              item.checkPass = true;
            }
            if (item.notifyType === '2' && !i.email) {
              this.$notify.info({
                message: `联系人"${i.name}"无法取得邮箱联系方式，请尝试短信`
              });
              item.checkPass = true;
            }
          }
        });
      },
      queryWeChart(item) {
        // 如果没选择微信, 返回
        if (item.notifyType !== '3') return;
        this.userList.forEach(i => {
          if (i.id === item.targetStr) {
            item.name = i.name;
          }
        });
        if (item.memberSource === '0') {
          // 系统联系人
          if (!item.targetStr) return;
          this.$http.get(`/ccsWeChat/queryWechatUser/${item.targetStr}`).then(res => {
            item.openId = res.data.openId;
            item.loading = false;
          }).catch(e => {
            this.getQCode(item);
          });
        } else {
          // 外部联系人
          this.getQCode(item);
        }
      },
      getQCode(item) {
        let params = {
          userId: item.targetStr
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
        if (item.openId || this.index !== 0) return;
        let code = this.getQCodeInfo();
        this.$http.get(`/ccsWeChat/queryWeChatTicketInfo/${code.ticket}`).then(res => {
          item.loading = false;
          if (res.data.openId === '400') {
            this.$notify.info({
              message: '该微信账号已绑定系统用户，请取消关注后再操作'
            });
            this.$emit('closeDialog');
          } else {
            this.$notify.success({
              message: item.name ? `联系人"${item.name}"关注成功` : '关注成功'
            });
            item.openId = res.data.openId;
            this.$emit('closeDialog');
          }
        }).catch(() => {
          setTimeout(() => {
            this.loopQueryInfo(item, code.ticket);
          }, 3000);
        });
      },
      queryDetail() {
        NotifyRule.get(this.formItem.id).then(res => {
          res.data.details.forEach(i => {
            i.openId = i.targetStr;
            this.formatContactWay(i);
          });
          this.form = res.data;
        });
      },
      formatContactWay(item) {
        if (item.memberSource === '1') return;
        User.get(item.targetStr).then(res => {
          let isHas = this.userList.some(s => s.id === item.targetStr);
          if (!isHas) {
            item.name = res.data.name;
            this.userList.push({
              id: item.targetStr,
              name: res.data.name,
              phone: res.data.phone,
              email: res.data.email
            });
          }
        });
      },
      queryUserList(query) {
        Department.getMembers({keyWord: query, status: 1}).then(res => {
          this.userList = res.data.list;
        });
      },
      checkContactWayWhenSave() {
        this.form.details.forEach(i => {
          this.checkContactWay(i);
        });
        return this.form.details.some(s => s.checkPass);
      },
      checkWeChatWay() {
        for (let i = 0; i < this.form.details.length; i++) {
          let item = this.form.details[i];
          if (item.notifyType === '3' && !item.openId) {
            if (item.memberSource === '0') {
              let title = item.name
                ? `存在系统联系人"${item.name}"没有绑定微信` : '存在系统联系人没有绑定微信';
              this.$notify.warning({
                message: title
              });
            } else {
              this.$notify.warning({
                message: '存在外部联系人没有绑定微信'
              });
            }
            return true;
          }
        }
        return false;
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            // if (!this.form.details.length) {
            //   this.$notify.info({
            //     message: '请添加联系人'
            //   });
            //   return;
            // }
            if (this.checkContactWayWhenSave()) return;
            // // 微信模式的校验
            if (this.checkWeChatWay()) return;
            // 拼装给后台的数据
            const form = JSON.parse(JSON.stringify(this.form));
            form.details.forEach(i => {
              i.name = undefined;
              i.loading = undefined;
              if (i.memberSource === '1' && i.notifyType === '3') {
                i.targetStr = i.openId;
              }
              i.openId = undefined;
              i.time = undefined;
              i.checkPass = undefined;
            });
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(NotifyRule.save(form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.$emit('change', res.data);
                },
                error: () => {
                  this.doing = false;
                }
              });
            } else {
              this.$httpRequestOpera(NotifyRule.update(this.form.id, form), {
                successTitle: '修改成功',
                errorTitle: '修改失败',
                success: res => {
                  this.doing = false;
                  this.$emit('change', res.data);
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
