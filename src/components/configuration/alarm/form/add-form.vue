<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('tempForm')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="tempForm">
        <el-form-item label="探头" prop="sensorId">
          <el-select :remote-method="queryProbeList" filterable placeholder="请输入名称搜索探头"
                     remote v-model="form.sensorId" @change="sensorIdChange">
            <el-option :key="item.id" :label="item.name" :value="item.id"
                       v-for="item in probeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="温度告警开关">
          <el-switch v-model="form.temperatureAlarmFlag" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-row v-if="form.temperatureAlarmFlag === '1'">
          <el-col :span="12">
            <el-form-item label="温度最低值" prop="temperatureMin">
              <oms-input placeholder="请输入温度最低值" type="input" v-model.number="form.temperatureMin">
                <template slot="append">℃</template>
              </oms-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="温度最高值" prop="temperatureMax">
              <oms-input placeholder="请输入温度最高值" type="input" v-model.number="form.temperatureMax">
                <template slot="append">℃</template>
              </oms-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item label="湿度告警开关">
          <el-switch v-model="form.humidityAlarmFlag" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-row v-if="form.humidityAlarmFlag === '1'">
          <el-col :span="12">
            <el-form-item label="湿度最低值" prop="humidityMin">
              <oms-input placeholder="请输入湿度最低值" type="input" v-model.number="form.humidityMin">
                <template slot="append">%</template>
              </oms-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="湿度最高值" prop="humidityMax">
              <oms-input placeholder="请输入湿度最高值" type="input" v-model.number="form.humidityMax">
                <template slot="append">%</template>
              </oms-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="电压告警开关">
          <el-switch v-model="form.voltageAlarmFlag" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-row v-if="form.voltageAlarmFlag === '1'">
          <el-col :span="12">
            <el-form-item label="电压最低值" prop="voltageMin">
              <oms-input placeholder="请输入电压最低值" type="input" v-model.number="form.voltageMin">
                <template slot="append">V</template>
              </oms-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电压最高值" prop="voltageMax">
              <oms-input placeholder="请输入电压最高值" type="input" v-model="form.voltageMax">
                <template slot="append">V</template>
              </oms-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="离线告警开关">
          <el-switch v-model="form.offLineFlag" active-value="1" inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="1级告警延迟时间" prop="levelOneAlarmDelayTime">
          <el-select clearable placeholder="请选择" v-model="form.levelOneAlarmDelayTime">
            <el-option :key="item" :label="item + '分钟'" :value="item"
                       v-for="item in timeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="2级告警延迟时间" prop="levelTwoAlarmDelayTime">
          <el-select clearable placeholder="请选择" v-model="form.levelTwoAlarmDelayTime">
            <el-option :key="item" :label="item + '分钟'" :value="item"
                       v-for="item in timeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="3级告警延迟时间" prop="levelThreeAlarmDelayTime">
          <el-select clearable placeholder="请选择" v-model="form.levelThreeAlarmDelayTime">
            <el-option :key="item" :label="item + '分钟'" :value="item"
                       v-for="item in timeList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="告警通知组" prop="alarmNoticeGroupId">
          <el-select remote :remote-method="queryNotifyListNew" v-model="form.alarmNoticeGroupId" filterable
                     placeholder="请输入名称搜索告警通知组"
                     remotev-model="form.alarmNoticeGroupId">
            <el-option :key="item.id" :label="item.name" :value="item.id"
                       v-for="item in notifyList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';

  import {AlarmRule} from '@/resources';

  export default {
    mixins: [methodsMixin],

    data() {
      return {
        form: {
          alarmNoticeGroupId: '',
          sensorId: '',
          temperatureMax: '',
          temperatureMin: '',
          humidityMin: '',
          humidityMax: '',
          voltageMin: '',
          voltageMax: '',
          temperatureAlarmFlag: '0',
          humidityAlarmFlag: '0',
          voltageAlarmFlag: '0',
          offLineFlag: '0',
          levelOneAlarmDelayTime: '',
          levelThreeAlarmDelayTime: '',
          levelTwoAlarmDelayTime: ''
        },
        doing: false,
        rules: {
          sensorId: [
            {required: true, message: '请选择探头', trigger: 'change'}
          ],
          temperatureMax: [
            {required: true, message: '请输入温度最高值', trigger: 'blur'}
          ],
          temperatureMin: [
            {required: true, message: '请输入温度最低值', trigger: 'blur'}
          ],
          humidityMax: [
            {required: true, message: '请输入湿度最高值', trigger: 'blur'}
          ],
          humidityMin: [
            {required: true, message: '请输入湿度最低值', trigger: 'blur'}
          ],
          voltageMax: [
            {required: true, message: '请输入电压最高值', trigger: 'blur'}
          ],
          voltageMin: [
            {required: true, message: '请输入电压最低值', trigger: 'blur'}
          ],
          levelOneAlarmDelayTime: [
            {required: true, message: '请输入1级告警延迟时间', trigger: 'change'}
          ],
          levelTwoAlarmDelayTime: [
            {required: true, message: '请输入2级告警延迟时间', trigger: 'change'}
          ],
          levelThreeAlarmDelayTime: [
            {required: true, message: '请输入3级告警延迟时间', trigger: 'change'}
          ],
          alarmNoticeGroupId: [
            {required: true, message: '请选择告警通知组', trigger: 'change'}
          ]
        },
        timeList: [5, 10, 30],
        actionType: '添加'
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
          this.probeList = [
            {name: this.formItem.sensorName, id: this.formItem.sensorId,  no: this.formItem.sensorNo}
          ];
          this.notifyList = [
            {
              id: this.formItem.alarmNoticeGroupId,
              name: this.formItem.alarmNoticeGroupName
            }
          ];
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            alarmNoticeGroupId: '',
            sensorId: '',
            temperatureMax: '',
            temperatureMin: '',
            humidityMin: '',
            humidityMax: '',
            voltageMin: '',
            voltageMax: '',
            temperatureAlarmFlag: '0',
            humidityAlarmFlag: '0',
            voltageAlarmFlag: '0',
            offLineFlag: '0',
            levelOneAlarmDelayTime: '',
            levelThreeAlarmDelayTime: '',
            levelTwoAlarmDelayTime: ''
          };
          this.actionType = '添加';
        }
      }
    },
    methods: {
      queryNotifyListNew(query) {
        if (!this.form.sensorId) return;
        let item = this.probeList.find(f => f.id === this.form.sensorId);
        let params = {
          orgId: item.orgId,
          keyWord: query
        };
        this.queryNotifyList(params);
      },
      sensorIdChange(val) {
        this.notifyList = [];
        this.form.alarmNoticeGroupId = '';
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.probeList.forEach(i => {
              if (i.id === this.form.sensorId) {
                this.form.sensorName = i.name;
                this.form.sensorNo = i.no;
              }
            });
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(AlarmRule.save(this.form), {
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
              this.$httpRequestOpera(AlarmRule.update(this.form), {
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
