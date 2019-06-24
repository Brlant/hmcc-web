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
        <el-form-item label="名称" prop="name">
          <oms-input type="text" v-model="form.name" placeholder="请输入名称"></oms-input>
        </el-form-item>

        <el-form-item label="所属单位" prop="orgId">
          <org-select :list="orgList"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索所属单位" v-model="form.orgId"></org-select>
        </el-form-item>

        <div v-if="form.orgId">
          <el-form-item>
            <span class="border-left-color">一级告警 </span>
            <des-btn icon="plus" @click="addRule(form.levelOneAlarmObjectList)"> 添加通知人</des-btn>
          </el-form-item>
          <div class="part-border-box" v-for="(item, index) in form.levelOneAlarmObjectList" :key="index">
            <des-btn v-has="'show'" class="btn-modify" icon="delete"
                     @click="deleteRule(item, form.levelOneAlarmObjectList)"/>
            <div>
              <el-row>
                <el-col :span="8">
                  <el-form-item :prop="`levelOneAlarmObjectList.${index}.alarmNoticeUserId`" label-width="0"
                                :rules="[{ required: true, message: '请选择通知人', trigger: 'change' }]">
                    <el-select placeholder="请选择通知人" v-model="item.alarmNoticeUserId" @change="userChange(item)"
                               filterable clearable remote :remote-method="queryUserList"
                               @click.native.once="queryUserList('')">
                      <el-option :label="item.name" :value="item.id" :key="item.id"
                                 v-for="item in userList"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="6">
                  <el-form-item :prop="`levelOneAlarmObjectList.${index}.alarmNoticeType`" label-width="0"
                                :rules="[{ required: true, message: '请选择通知类型', trigger: 'change' }]">
                    <el-radio-group v-model="item.alarmNoticeType" size="small" @change="checkChange(item)">
                      <el-radio-button :label="item.key" :key="item.key" v-for="item in checkList">{{item.label}}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="8">
                  <el-form-item label-width="0">
                    <oms-input type="text" v-model="item.remark" placeholder="请输入备注"></oms-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-form-item class="mt-10">
            <span class="border-left-color">二级告警 </span>
            <des-btn icon="plus" @click="addRule(form.levelTwoAlarmObjectList)"> 添加通知人</des-btn>
          </el-form-item>
          <div class="part-border-box" v-for="(item, index) in form.levelTwoAlarmObjectList" :key="index">
            <des-btn v-has="'show'" class="btn-modify" icon="delete"
                     @click="deleteRule(item, form.levelTwoAlarmObjectList)"/>
            <div>
              <el-row>
                <el-col :span="8">
                  <el-form-item :prop="`levelTwoAlarmObjectList.${index}.alarmNoticeUserId`" label-width="0"
                                :rules="[{ required: true, message: '请选择通知人', trigger: 'change' }]">
                    <el-select placeholder="请选择通知人" v-model="item.alarmNoticeUserId" @change="userChange(item)"
                               filterable clearable remote :remote-method="queryUserList"
                               @click.native.once="queryUserList('')">
                      <el-option :label="item.name" :value="item.id" :key="item.id"
                                 v-for="item in userList"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="6">
                  <el-form-item :prop="`levelTwoAlarmObjectList.${index}.alarmNoticeType`" label-width="0"
                                :rules="[{ required: true, message: '请选择通知类型', trigger: 'change' }]">
                    <el-radio-group v-model="item.alarmNoticeType" size="small" @change="checkChange(item)">
                      <el-radio-button :label="item.key" :key="item.key" v-for="item in checkList">{{item.label}}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="8">
                  <el-form-item label-width="0">
                    <oms-input type="text" v-model="item.remark" placeholder="请输入备注"></oms-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-form-item class="mt-10">
            <span class="border-left-color">三级告警 </span>
            <des-btn icon="plus" @click="addRule(form.levelThreeAlarmObjectList)"> 添加通知人</des-btn>
          </el-form-item>
          <div class="part-border-box" v-for="(item, index) in form.levelThreeAlarmObjectList" :key="index">
            <des-btn v-has="'show'" class="btn-modify" icon="delete"
                     @click="deleteRule(item, form.levelThreeAlarmObjectList)"/>
            <div>
              <el-row>
                <el-col :span="8">
                  <el-form-item :prop="`levelThreeAlarmObjectList.${index}.alarmNoticeUserId`" label-width="0"
                                :rules="[{ required: true, message: '请选择通知人', trigger: 'change' }]">
                    <el-select placeholder="请选择通知人" v-model="item.alarmNoticeUserId" @change="userChange(item)"
                               filterable clearable remote :remote-method="queryUserList"
                               @click.native.once="queryUserList('')">
                      <el-option :label="item.name" :value="item.id" :key="item.id"
                                 v-for="item in userList"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="6">
                  <el-form-item :prop="`levelThreeAlarmObjectList.${index}.alarmNoticeType`" label-width="0"
                                :rules="[{ required: true, message: '请选择通知类型', trigger: 'change' }]">
                    <el-radio-group v-model="item.alarmNoticeType" size="small" @change="checkChange(item)">
                      <el-radio-button :label="item.key" :key="item.key" v-for="item in checkList">{{item.label}}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="1"></el-col>
                <el-col :span="8">
                  <el-form-item label-width="0">
                    <oms-input type="text" v-model="item.remark" placeholder="请输入备注"></oms-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {AlarmNotifyGroup, OrgUser, User} from '@/resources';

  export default {
    data() {
      return {
        formModel: {
          name: '',
          orgId: '',
          levelOneAlarmObjectList: [],
          levelTwoAlarmObjectList: [],
          levelThreeAlarmObjectList: []
        },
        ruleModel: {
          alarmNoticeTarget: '',
          alarmNoticeType: '',
          remark: '',
          alarmNoticeUserId: ''
        },
        form: {},
        doing: false,
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择所属单位', trigger: 'change'}
          ]
        },
        actionType: '添加',
        checkList: [
          {label: '短信', key: '0', placeholder: '请输入手机号', validator: this.checkPhone},
          {label: '微信', key: '1'}
        ],
        userList: [],
        orgList: []
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
          this.form = JSON.parse(JSON.stringify(this.formModel));
          this.actionType = '添加';
        }
      }
    },
    methods: {
      queryAllOrg: function (query) {// 查询货主
        let params = {keyWord: query};
        this.$http.get('/orgs/pager', {params: params}).then(res => {
          this.orgList = res.data.list;
        });
      },
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
      addRule(list) {
        list.splice(0, 0, Object.assign({}, this.ruleModel));
      },
      deleteRule(item, list) {
        let index = list.indexOf(item);
        index !== -1 && list.splice(index, 1);
      },
      userChange(item) {
        item.alarmNoticeTarget = '';
        item.alarmNoticeType = '';
        item.remark = '';
      },
      checkChange(item) {
        item.alarmNoticeTarget = '';
        if (item.alarmNoticeType === '0') {
          this.checkContactWay(item);
        } else {
          // 校验微信模式
          this.queryWeChart(item);
        }
      },
      checkContactWay(item) {
        this.userList.forEach(i => {
          if (i.id === item.alarmNoticeUserId) {
            item.noPass = false;
            if (item.alarmNoticeType === '1' && !i.phone) {
              item.noPass = true;
              this.$notify.info({
                message: `联系人"${i.name}"无法取得手机联系方式，请尝试微信`
              });
            } else {
              item.alarmNoticeTarget = item.phone;

            }
          }
        });
      },
      queryWeChart(item) {
        this.$http.get(`/ccsWeChat/queryWechatUser/${item.alarmNoticeUserId}`).then(res => {
          item.alarmNoticeTarget = res.data.openId;
          item.loading = false;
        }).catch(e => {
          this.getQCode(item);
        });
      },
      getQCode(item) {
        let params = {
          userId: item.alarmNoticeUserId
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
        if (item.alarmNoticeTarget || this.index !== 0) return;
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
            item.alarmNoticeTarget = res.data.openId;
            this.$emit('closeDialog');
          }
        }).catch(() => {
          setTimeout(() => {
            this.loopQueryInfo(item, code.ticket);
          }, 3000);
        });
      },
      queryDetail() {
        AlarmNotifyGroup.get(this.formItem.id).then(res => {
          res.data.details.forEach(i => {
            this.formatContactWay(i);
          });
          this.form = res.data;
        });
      },
      formatContactWay(item) {
        if (item.alarmNoticeType === '1') return;
        User.get(item.alarmNoticeUserId).then(res => {
          let isHas = this.userList.some(s => s.id === item.alarmNoticeUserId);
          if (!isHas) {
            item.name = res.data.name;
            this.userList.push({
              id: item.alarmNoticeUserId,
              name: res.data.name,
              phone: res.data.phone,
              email: res.data.email
            });
          }
        });
      },
      queryUserList(query) {
        let params = {keyWord: query};
        OrgUser.queryOrgInfo(this.form.orgId, params).then(res => {
          this.userList = res.data.list;
        });
      },
      checkContactWayWhenSave() {
        let details = [].concat(this.form.levelOneAlarmObjectList,
          this.form.levelTwoAlarmObjectList, this.form.levelThreeAlarmObjectList);
        details.forEach(i => {
          this.checkContactWay(i);
        });
        return details.some(s => s.noPass);
      },
      checkWeChatWay() {
        let details = [].concat(this.form.levelOneAlarmObjectList,
          this.form.levelTwoAlarmObjectList, this.form.levelThreeAlarmObjectList);
        for (let i = 0; i < details.length; i++) {
          let item = details[i];
          if (item.alarmNoticeType === '1' && !item.alarmNoticeTarget) {
            let title = item.name
              ? `存在通知人"${item.name}"没有绑定微信` : '存在通知人没有绑定微信';
            this.$notify.warning({
              message: title
            });
            return true;
          }
        }
        return false;
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (this.checkContactWayWhenSave()) return;
            // // 微信模式的校验
            if (this.checkWeChatWay()) return;
            // 拼装给后台的数据
            const form = JSON.parse(JSON.stringify(this.form));
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(AlarmNotifyGroup.save(form), {
                errorTitle: '添加失败',
                success: res => {
                  if (res.data.code === 200) {
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
              this.$httpRequestOpera(AlarmNotifyGroup.update(form), {
                errorTitle: '修改失败',
                success: res => {
                  if (res.data.code === 200) {
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
