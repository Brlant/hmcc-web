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
          <org-select :list="povList"
                      :remoteMethod="filterPOV"
                      placeholder="请输入名称搜索单位" v-model="form.orgId"></org-select>
        </el-form-item>
        <el-form-item label="冷链设备" prop="monitorTargetId">
          <el-select :remote-method="queryCoolListCondition" @focus="queryCoolListCondition()" clearable filterable
                     placeholder="请输入名称搜索冷链设备" remote
                     v-model="form.monitorTargetId" @change="monitorTargetIdChange">
            <el-option :key="item.id" :label="item.name" :value="item.id"
                       v-for="item in coolList"></el-option>
          </el-select>
        </el-form-item>
        <el-row v-for="(sensor, index) in form.sensorList" :key="index">
          <el-col :span="10">
            <el-form-item label="探头" :prop="`sensorList.${index}.sensorId`"
                          :rules="[{ required: true, message: '请选择探头', trigger: 'change' }]">
              <el-select :remote-method="queryProbeList" @focus="queryProbeList('')" filterable
                         placeholder="请输入名称搜索探头" remote v-model="sensor.sensorId">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in probeList"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label="温度类型" :prop="`sensorList.${index}.temperatureType`"
                          :rules="[{ required: true, message: '请选择温度类型', trigger: 'change' }]">
              <el-radio-group size="small" v-model="sensor.temperatureType">
                <el-radio-button label="0">冷藏</el-radio-button>
                <el-radio-button label="1">冷冻</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="3" style="margin-bottom: 22px;line-height: 40px">
            <des-btn @click="addSensor()" icon="plus"></des-btn>
            <des-btn class="ml-10" @click="delSensor(sensor)" icon="minus"
                     v-show="form.sensorList.length > 1"></des-btn>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import {monitorRelation} from '@/resources';
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
          sensorList: []
        },
        doing: false,
        rules: {
          orgId: [
            {required: true, message: '请选择接种单位', trigger: 'change'}
          ],
          monitorTargetId: [
            {required: true, message: '请选择冷链设备', trigger: 'change'}
          ],
          sensorList: [
            {required: true, type: 'array', message: '探头', trigger: 'change'}
          ]
        },
        actionType: '添加',
        coolList: [],
        probeList: [],
        editProbeList: []
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
        this.editProbeList = [];
        if (this.formItem.id) {
          this.actionType = '编辑';
          this.probeList = this.formItem.sensorDataList.map(i => ({
            id: i.id,
            name: i.name
          }));
          this.editProbeList = this.formItem.sensorDataList.map(i => ({
            id: i.id,
            name: i.name
          }));
          this.coolList = [
            {
              id: this.formItem.monitorTargetId,
              name: this.formItem.monitorTargetName
            }
          ];
          if (this.type === 2) {
            this.povList = [
              {id: this.formItem.orgId, name: this.formItem.orgName}
            ];
          }
          let formData = JSON.parse(JSON.stringify(this.formItem));
          formData.sensorList = this.formItem.sensorDataList.map(i => ({
            sensorId: i.id,
            temperatureType: i.temperatureType
          }));
          this.form = formData;
        } else {
          this.resetForm();
          this.actionType = '添加';
          this.addSensor();
        }
      }
    },
    methods: {
      queryCoolListCondition(query) {
        if (this.type === 2 && !this.form.orgId) return;
        let params = {
          keyWord: query,
          orgId: this.form.orgId || this.$store.state.user.userCompanyAddress
        };
        this.queryCoolList(params);
      },
      monitorTargetIdChange(val) {
        this.form.sensorList = [];
        this.addSensor();
      },
      queryProbeList(query) {
        if (this.type === 2 && !this.form.orgId) return;
        if (!this.form.monitorTargetId) {
          return this.$notify.info({message: '请选择冷链设备'});
        }
        let params = {
          keyWord: query,
          orgId: this.form.orgId || this.$store.state.user.userCompanyAddress,
          freezerDevId: this.form.monitorTargetId
        };
        this.$http.post('/sensor/page-without-monitor', params).then(res => {
          this.editProbeList.forEach(i => {
            if (i.id && !res.data.list.find(f => f.id === i.id)) {
              let item = this.editProbeList.find(f => f.id === i.id);
              if (!item) return;
              res.data.list.push(item);
            }
          });
          this.probeList = res.data.list;
        });
      },
      addSensor() {
        this.form.sensorList.push({
          sensorId: '',
          temperatureType: ''
        });
      },
      delSensor(item) {
        this.form.sensorList = this.form.sensorList.filter(f => f !== item);
      },
      resetForm() {
        this.form = {
          orgId: '',
          monitorTargetId: '',
          sensorList: []
        };
      },
      selectTab(item) {
        this.currentTab = item;
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.povList.forEach(i => {
              if (i.id === this.form.orgId) {
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
                  if (res.code === 200) {
                    this.resetForm();
                    this.$emit('change', res.data);
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
                  if (res.code === 200) {
                    this.resetForm();
                    this.$emit('change', res.data);
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
