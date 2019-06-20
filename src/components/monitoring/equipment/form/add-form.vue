<style lang="scss" scoped>
  $labelWidth: 180px;
  .content-part {
    .content-left {
      width: $labelWidth;
    }

    .content-right {
      > h3 {
        left: $labelWidth;
      }

      left: $labelWidth;
    }
  }
</style>
<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab" :btnSavePosition="100">
    <template slot="title">{{actionType}}设备监控</template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="save('tempForm')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="tempForm" :model="form" label-width="100px" :rules="rules">
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[0].key === currentTab.key}">
              {{pageSets[0].name}}</h3>
          </div>
          <div class="content  mt-10">
            <el-form-item label="编码" prop="monitordevCode">
              <oms-input type="text" v-model="form.monitordevCode" placeholder="请输入编码"></oms-input>
            </el-form-item>
            <el-form-item label="类型" prop="monitordevType">
              <el-select placeholder="请选择类型" v-model="form.monitordevType">
                <el-option :label="item.title" :value="item.id" :key="item.id" v-for="item in typeList"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch active-text="启用" inactive-text="停用" v-model="form.activeFlag"
                         active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </div>
        </div>
        <div class="form-header-part">
          <div class="header">
            <div class="sign f-dib"></div>
            <h3 class="tit f-dib index-tit" :class="{active: pageSets[1].key === currentTab.key}">
              {{pageSets[1].name}}
              <des-btn v-has="'show'" class="btn-modify" icon="plus" @click="addTemp()"/>
            </h3>
          </div>
          <div class="content  mt-10">
            <div class="part-border-box no-border" v-for="(item, index) in form.details" :key="index">
              <el-row>
                <el-col :span="9">
                  <el-form-item label="名称" label-width="50px">
                    <oms-input type="text" v-model="item.name" placeholder="请输入名称"></oms-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="设备" label-width="70px"
                                :prop="`details.${index}.id`"
                                :rules="[{ required: true, message: '请选择设备', trigger: 'change' }]">
                    <el-select popper-class="selects--custom" placeholder="请输入名称搜索设备" v-model="item.id"
                               @click.once.native="queryAllTemp('')"
                               clearable filterable remote :remote-method="queryAllTemp">
                      <el-option :label="item.devName" v-show="!item.disabled" :value="item.id" :key="item.id"
                                 v-for="item in useableTempList">
                        <dev-option-info :item="item"/>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="3" align="center" class="opera-btn">
                  <des-btn v-has="'show'" icon="delete" @click="deleteTempItem(item)"/>
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
  import methodsMixin from '@/mixins/methodsMixin';
  import {DevMonitoring} from '@/resources';
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';

  export default {
    components: {TwoColumn},
    props: ['formItem', 'index'],
    mixins: [methodsMixin],
    data() {
      return {
        pageSets: [
          {name: '基本信息', key: 1},
          {name: '设备绑定', key: 2}
        ],
        currentTab: {},
        form: {
          details: []
        },
        doing: false,
        rules: {
          monitordevCode: [
            {required: true, message: '请输入编码', trigger: 'blur'}
          ],
          monitordevType: [
            {required: true, message: '请选择类型', trigger: 'change'}
          ]
        },
        actionType: '添加',
        typeList: this.$parent.$parent.typeList
      };
    },
    computed: {
      useableTempList() {
        this.allTempList.forEach(f => {
          this.form.details.forEach(i => {
            if (i.id === f.id) {
              f.disabled = true;
            }
          });
        });
        return this.allTempList;
      }
    },
    watch: {
      index: function (val) {
        this.allTempList = [];
        if (val !== 0) return;
        this.$refs['tempForm'].resetFields();
        this.form.devIds = [];
        if (this.formItem.id) {
          this.queryDetail();
          this.actionType = '编辑';
        } else {
          this.resetForm();
          this.actionType = '添加';
        }
      }
    },
    methods: {
      resetForm() {
        this.form = {
          monitordevCode: '',
          monitordevType: '',
          monitorFlag: '1',
          warnStatus: '0',
          activeFlag: '1',
          devIds: [],
          relationName: '',
          details: []
        };
      },
      selectTab(item) {
        this.currentTab = item;
      },
      queryDetail() {
        DevMonitoring.get(this.formItem.id).then(res => {
          this.form = Object.assign({devIds: [], details: []}, res.data);
          this.form.details = this.form.devs.map((m, index) => {
            return {
              id: m.ccsDevId,
              name: this.form.relationNames && this.form.relationNames[index] || ''
            };
          });
          this.queryAllTemp();
        });
      },
      setTempListWhenEdit() {
        if (!this.form.id) return;
        this.form.devs && this.form.devs.forEach(i => {
          let isHas = this.allTempList.some(s => s.id === i.ccsDevId);
          if (!isHas) {
            this.allTempList.push({
              id: i.ccsDevId,
              devCode: i.devCode,
              devType: i.devType,
              devName: i.devName
            });
          }
        });
        this.form.devs && (this.form.devIds = this.form.devs.map(m => m.ccsDevId));
      },
      addTemp() {
        this.form.details.push(Object.assign({}, {name: '', id: ''}));
      },
      deleteTempItem(item) {
        let index = this.form.details.indexOf(item);
        index !== -1 && this.form.details.splice(index, 1);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            let form = JSON.parse(JSON.stringify(this.form));
            form.devIds = form.details.map(m => m.id);
            form.relationNames = form.details.map(m => m.name || null);
            if (!form.id) {
              this.doing = true;
              this.$httpRequestOpera(DevMonitoring.save(form), {
                successTitle: '添加成功',
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  this.resetForm();
                  this.$emit('change', res.data);
                },
                error: () => {
                  this.doing = false;
                }
              });
            } else {
              this.$httpRequestOpera(DevMonitoring.update(form.id, form), {
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
