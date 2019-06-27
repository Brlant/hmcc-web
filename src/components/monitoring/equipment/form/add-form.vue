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
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}设备监控</template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="save('tempForm')" :disabled="doing">保存</el-button>
    </template>
    <template slot="content">
      <el-form ref="tempForm" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="接种单位" prop="orgId" v-if="type === 2">
          <org-select :list="orgList"
                      :remoteMethod="filterPOV"
                      placeholder="请输入名称搜索单位" v-model="form.orgId"></org-select>
        </el-form-item>
        <el-form-item label="冷链设备" prop="monitorTargetId">
          <el-select :remote-method="queryCoolList" filterable placeholder="请输入名称搜索冷链设备" remote
                     v-model="form.monitorTargetId">
            <el-option :key="item.id" :label="item.name" :value="item.id"
                       v-for="item in coolList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="探头" prop="sensorIdList">
          <el-select :remote-method="queryProbeList" filterable multiple
                     placeholder="请输入名称搜索探头" remote v-model="form.sensorIdList">
            <el-option :key="item.id" :label="item.name" :value="item.id"
                       v-for="item in probeList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import {cool, monitorRelation, probe, BaseInfo} from '@/resources';
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';

  export default {
    components: {TwoColumn},
    props: ['formItem', 'index'],
    mixins: [methodsMixin],
    data() {
      return {
        currentTab: {},
        form: {
          orgId: '',
          monitorTargetId: '',
          sensorIdList: []
        },
        doing: false,
        rules: {
          orgId: [
            {required: true, message: '请选择接种单位', trigger: 'change'}
          ],
          monitorTargetId: [
            {required: true, message: '请选择冷链设备', trigger: 'change'}
          ],
          sensorIdList: [
            {required: true, type: 'array', message: '探头', trigger: 'change'}
          ]
        },
        actionType: '添加',
        coolList: [],
        probeList: [],
        orgList: []
      };
    },
    computed: {
      type() {
        return this.$route.meta.type;
      }
    },
    watch: {
      index: function (val) {
        this.coolList = [];
        this.probeList = [];
        if (val !== 0) return;
        this.$refs['tempForm'].resetFields();
        this.form.devIds = [];
        if (this.formItem.id) {
          this.actionType = '编辑';
        } else {
          this.resetForm();
          this.actionType = '添加';
        }
      }
    },
    methods: {
      filterPOV: function (query) {// 过滤POV
        let orgId = this.$store.state.user.userCompanyAddress;
        if (!orgId) return;
        let params = {
          keyWord: query,
          relation: '0'
        };
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.orgList = res.data;
        });
      },
      queryCoolList(query) {
        if (this.type === 2 && !this.form.orgId) return;
        let params = {
          keyWord: query,
          orgId: this.form.orgId || this.$store.state.user.userCompanyAddress
        };
        cool.query(params).then(res => {
          this.coolList = res.data.data.list;
        });
      },
      queryProbeList(query) {
        if (this.type === 2 && !this.form.orgId) return;
        let params = {
          keyWord: query,
          orgId: this.form.orgId || this.$store.state.user.userCompanyAddress
        };
        probe.query(params).then(res => {
          this.probeList = res.data.data.list;
        });
      },
      resetForm() {
        this.form = {};
      },
      selectTab(item) {
        this.currentTab = item;
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.orgList.forEach(i => {
              if(i.id === this.form.orgId) {
                this.form.orgName = i.name;
              }
            });
            let form = JSON.parse(JSON.stringify(this.form));
            if (!form.id) {
              this.doing = true;
              this.$httpRequestOpera(monitorRelation.save(form), {
                errorTitle: '添加失败',
                success: res => {
                  this.doing = false;
                  if (res.data.code === 200) {
                    this.resetForm();
                    this.$emit('change', res.data.data);
                    this.$notify.success({message: '添加成功'});
                  }
                },
                error: () => {
                  this.doing = false;
                }
              });
            } else {
              this.$httpRequestOpera(monitorRelation.update(form), {
                errorTitle: '修改失败',
                success: res => {
                  this.doing = false;
                  if (res.data.code === 200) {
                    this.resetForm();
                    this.$emit('change', res.data.data);
                    this.$notify.success({message: '修改成功'});
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
