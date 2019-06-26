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
        <el-form-item label="冷链设备" prop="coolId">
          <el-select :remote-method="queryCoolList" filterable placeholder="请输入名称搜索冷链设备" remote v-model="form.coolId">
            <el-option :key="item.id" :label="item.no" :value="item.id"
                       v-for="item in coolList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="探头" prop="probeIds">
          <el-select :remote-method="queryProbeList" filterable multiple
                     placeholder="请输入名称搜索探头" remote v-model="form.probeIds">
            <el-option :key="item.id" :label="item.name" :value="item.id"
                       v-for="item in probeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch active-text="启用" inactive-text="停用" v-model="form.activeFlag"
                     active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import {DevMonitoring, probe, cool} from '@/resources';
  import TwoColumn from '@dtop/dtop-web-common/packages/two-column';

  export default {
    components: {TwoColumn},
    props: ['formItem', 'index'],
    mixins: [methodsMixin],
    data() {
      return {
        currentTab: {},
        form: {
          coolId: '',
          probeIds: []
        },
        doing: false,
        rules: {
          coolId: [
            {required: true, message: '请选择冷链设备', trigger: 'change'}
          ],
          probeIds: [
            {required: true, type: 'array', message: '探头', trigger: 'change'}
          ]
        },
        actionType: '添加',
        coolList: [],
        probeList: []
      };
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
      queryCoolList(query) {
        let params = {keyWord: query};
        cool.query(params).then(res => {
          this.coolList = res.data.data.list;
        });
      },
      queryProbeList(query) {
        let params = {keyWord: query};
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
