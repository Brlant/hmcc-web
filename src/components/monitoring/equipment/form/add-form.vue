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
    <template slot="title">{{ actionType }}设备监控</template>
    <template slot="content">
      <el-form ref="tempForm" :model="form" label-width="100px" :rules="rules">
        <el-form-item label="关联单位" prop="orgId" v-if="type === 2">
          <org-select :list="povList"
                      :remoteMethod="filterPOV"
                      placeholder="请输入名称搜索单位" v-model="form.orgId"></org-select>
        </el-form-item>
        <el-form-item label="冷链设备" prop="monitorTargetId">
          <el-row :gutter="10">
            <el-col :span="7">
              <el-select :remote-method="queryCoolListCondition" @focus="queryCoolListCondition()" clearable filterable
                         placeholder="请输入名称搜索冷链设备" remote
                         v-model="form.monitorTargetId" @change="monitorTargetIdChange">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in coolList"></el-option>
              </el-select>
            </el-col>
            <el-col :span="12" :offset="2">
              <span style="color: red">注：冷链标签需先绑定告警规则才可以开启监控</span>
            </el-col>
          </el-row>
        </el-form-item>
        <div style="margin-top: 44px !important;">
          <el-divider/>
        </div>

        <h2 style="margin-bottom: 22px">冷链标签安放区域配置</h2>
        <el-row v-for="(sensor, index) in form.sensorList" :key="index" :gutter="10">
          <el-col :span="6">
            <el-form-item label="区域" :prop="`sensorList.${index}.areaName`"
                          :rules="[{ required: true, message: '区域不能为空', trigger: 'blur' }]">
              <el-input v-model="sensor.areaName" placeholder="请输入区域" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="是否启用" :prop="`sensorList.${index}.isOpen`">
              <el-switch v-model="sensor.isOpen" :active-value="1" :inactive-value="0"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="冷链标签" :prop="`sensorList.${index}.sensorId`">
              <el-select v-model="sensor.sensorId"
                         filterable clearable
                         placeholder="请输入名称搜索冷链标签">
                <el-option v-for="(item,i) in probeList" :key="i" :label="item.name" :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="温度类型" :prop="`sensorList.${index}.temperatureType`"
                          :rules="[{ required: true, message: '请选择温度类型', trigger: 'change' }]"
                          v-if="sensor.sensorId">
              <el-radio-group size="small" v-model="sensor.temperatureType">
                <el-radio-button label="0">冷藏</el-radio-button>
                <el-radio-button label="1">冷冻</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="2" style="margin-bottom: 22px;line-height: 40px">
            <des-btn @click="addSensor()" icon="plus"></des-btn>
            <des-btn class="ml-10" @click="delSensor(sensor)" icon="minus"
                     v-show="sensor.delFlag && form.sensorList.length > 1"></des-btn>
          </el-col>
        </el-row>
      </el-form>
    </template>
    <template slot="btnSave">
      <el-button type="primary" plain @click="save('tempForm')" :disabled="doing" style="margin-top: 22px">保存
      </el-button>
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
          {required: true, message: '请选择关联单位', trigger: 'change'}
        ],
        monitorTargetId: [
          {required: true, message: '请选择冷链设备', trigger: 'change'}
        ],
        sensorList: [
          {required: true, type: 'array', message: '冷链标签不能为空', trigger: 'change'}
        ]
      },
      actionType: '添加',
      coolList: [],
      probeList: []
    };
  },
  computed: {
    type() {
      return this.$route.meta.type;
    }
  },
  watch: {
    index: function (val) {
      if (val !== 0) {
        return;
      }

      this.coolList = [];
      this.probeList = [];
      this.form.devIds = [];
      this.$refs['tempForm'].resetFields();

      if (this.formItem.id) {
        this.actionType = '编辑';

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
        if (formData.sensorDataList.length) {
          formData.sensorList = formData.sensorDataList.map(i => ({
            sensorId: i.id,
            temperatureType: i.temperatureType,
            areaId: i.areaId,
            areaName: i.areaName,
            monitorTargetId: this.formItem.monitorTargetId,
            monitorTargetName: this.formItem.monitorTargetName,
            orgId: this.formItem.orgId,
            orgName: this.formItem.orgName,
            isOpen: i.isOpen || 0,
            // 未绑定标签的才能删除
            delFlag: !i.id
          }));
        }

        formData.sensorDataList = null;
        this.form = formData;
      } else {
        this.resetForm();
        this.actionType = '添加';
        this.addSensor();
      }

      this.querySensorList('');
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
      // this.addSensor();
      this.getAreasByDevId(val);
    },
    getAreasByDevId(val) {
      if (this.formItem.id){
        // 编辑不需要处理
        return
      }

      this.$http.get('monitor-relation/queryPlacementAreaById', {params: {devId: val}}).then(res => {
        let list  = res.data.areaList  || []
        if (!list){
          this.addSensor();
        }else {
          this.form.sensorList = list.map(item => {
            return {
              monitorTargetId: this.formItem.monitorTargetId,
              monitorTargetName: this.formItem.monitorTargetName,
              orgId: this.formItem.orgId,
              orgName: this.formItem.orgName,
              sensorId: item.sensorId || '',
              temperatureType: item.sensorId || '',
              areaId: item.id || '',
              areaName: item.areaName || '',
              isOpen: item.isOpen || 0,
              // 手动添加的可以删除
              delFlag: true
            }
          })
        }
      });
    },
    querySensorList(query) {
      if (this.type === 2 && !this.form.orgId) {
        return;
      }

      let params = {
        keyWord: query,
        orgId: this.form.orgId || this.$store.state.user.userCompanyAddress || '',
        freezerDevId: this.form.monitorTargetId || '',
        sensorStatus: 1
      };

      this.$http.post('/sensor/without-monitor', params).then(res => {
        this.probeList = res.data || [];
      });
    },
    addSensor() {
      this.form.sensorList.push({
        monitorTargetId: this.formItem.monitorTargetId,
        monitorTargetName: this.formItem.monitorTargetName,
        orgId: this.formItem.orgId,
        orgName: this.formItem.orgName,
        sensorId: '',
        temperatureType: '',
        areaId: '',
        areaName: '',
        isOpen: 0,
        // 手动添加的可以删除
        delFlag: true
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
              error: (err) => {
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
