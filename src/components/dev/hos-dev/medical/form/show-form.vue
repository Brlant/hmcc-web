<template>
  <dialog-template :pageSets="pageSets" @selectTab="selectTab">
    <template slot="title">设备信息</template>
    <template slot="btn">
      <el-button @click="close" plain>关闭</el-button>
    </template>
    <template slot="content">
      <div v-if="loading">
        <oms-loading :loading="loading"></oms-loading>
      </div>
      <div class="empty-info" v-else-if="!formItem.id">暂无数据</div>
      <div v-else>
        <el-form :model="form" label-width="140px" ref="tempForm">
          <div class="form-header-part">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 :class="{active: pageSets[0].key === currentTab.key}" class="tit f-dib index-tit">
                {{ pageSets[0].name }}</h3>
            </div>
            <div class="content">
              <div>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备编号">{{ form.devNo }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备名称">{{ form.devName }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备类型">
                  {{ formatDictLabel(form.devType, deviceTypes) }}
                </oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备类型模板">{{ form.templateName }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="供应商">{{ form.supplier }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="生产厂商">{{ form.manufacturer }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="所属科室">{{ form.departmentName }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="生产日期">{{ form.productTime|date }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="报废时间">{{ form.discardTime|time }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="首次投入使用时间">{{ form.firstUserTime|date }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="厂商备案凭证号">{{
                    form.manufacturerRegistrationNumber
                  }}
                </oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="生产许可证号">{{
                    form.productionLicenseNumber
                  }}
                </oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="维保周期">{{ form.maintenanceCycle }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="注册证号/备案凭证号">
                  {{ form.registrationCertificateNumber }}
                </oms-col>
              </div>
            </div>
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 :class="{active: pageSets[1].key === currentTab.key}" class="tit f-dib index-tit">
                {{ pageSets[1].name }}</h3>
            </div>
            <div class="content">
              <div>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="关机状态范围">
                      <el-row :gutter="10">
                        <el-col :span="10">
                          <el-form-item prop="shutdownStatusStart">
                            <el-input placeholder="请输入数字" type="number"
                                      v-model.number="form.shutdownStatusStart" disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">至</el-col>
                        <el-col :span="10">
                          <el-form-item prop="shutdownStatusEnd">
                            <el-input placeholder="请输入数字" type="number"
                                      v-model.number="form.shutdownStatusEnd" disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">mA</el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="工作状态" prop="workStatus">
                      <el-input placeholder="请输入数字" type="number" v-model.number="form.workStatus" :disabled="true">
                        <template slot="prepend">大于</template>
                        <template slot="append">mA</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <!--<el-row :gutter="10">-->
                <!--  <el-col :span="12">-->
                <!--    <el-form-item label="闲置状态范围">-->
                <!--      <el-row :gutter="10">-->
                <!--        <el-col :span="10">-->
                <!--          <el-form-item prop="idleStateRangeStart">-->
                <!--            <el-input placeholder="请输入数字" type="number"-->
                <!--                      v-model.number="form.idleStateRangeStart" disabled></el-input>-->
                <!--          </el-form-item>-->
                <!--        </el-col>-->
                <!--        <el-col class="line" :span="1">至</el-col>-->
                <!--        <el-col :span="10">-->
                <!--          <el-form-item prop="idleStateRangeEnd">-->
                <!--            <el-input placeholder="请输入数字" type="number"-->
                <!--                      v-model.number="form.idleStateRangeEnd" disabled></el-input>-->
                <!--          </el-form-item>-->
                <!--        </el-col>-->
                <!--        <el-col class="line" :span="2">mA</el-col>-->
                <!--      </el-row>-->
                <!--    </el-form-item>-->
                <!--  </el-col>-->
                <!--  <el-col :span="12">-->
                <!--    <el-form-item label="标准电压范围">-->
                <!--      <el-row :gutter="10">-->
                <!--        <el-col :span="10">-->
                <!--          <el-form-item prop="standardVoltageRangeStart">-->
                <!--            <el-input placeholder="请输入数字" type="number"-->
                <!--                      v-model.number="form.standardVoltageRangeStart"-->
                <!--                      disabled></el-input>-->
                <!--          </el-form-item>-->
                <!--        </el-col>-->
                <!--        <el-col class="line" :span="1">至</el-col>-->
                <!--        <el-col :span="10">-->
                <!--          <el-form-item prop="standardVoltageRangeEnd">-->
                <!--            <el-input placeholder="请输入数字" type="number"-->
                <!--                      v-model.number="form.standardVoltageRangeEnd"-->
                <!--                      disabled></el-input>-->
                <!--          </el-form-item>-->
                <!--        </el-col>-->
                <!--        <el-col class="line" :span="2">V</el-col>-->
                <!--      </el-row>-->
                <!--    </el-form-item>-->
                <!--  </el-col>-->
                <!--</el-row>-->
                <!--<el-row :gutter="10">-->
                <!--  <el-col :span="12">-->
                <!--    <el-form-item label="待机状态范围">-->
                <!--      <el-row :gutter="10">-->
                <!--        <el-col :span="10">-->
                <!--          <el-form-item prop="standbyStatusRangeStart">-->
                <!--            <el-input placeholder="请输入数字" type="number"-->
                <!--                      v-model.number="form.standbyStatusRangeStart"-->
                <!--                      disabled></el-input>-->
                <!--          </el-form-item>-->
                <!--        </el-col>-->
                <!--        <el-col class="line" :span="1">至</el-col>-->
                <!--        <el-col :span="10">-->
                <!--          <el-form-item prop="standbyStatusRangeEnd">-->
                <!--            <el-input placeholder="请输入数字" type="number"-->
                <!--                      v-model.number="form.standbyStatusRangeEnd"-->
                <!--                      disabled></el-input>-->
                <!--          </el-form-item>-->
                <!--        </el-col>-->
                <!--        <el-col class="line" :span="2">mA</el-col>-->
                <!--      </el-row>-->
                <!--    </el-form-item>-->
                <!--  </el-col>-->
                <!--</el-row>-->
              </div>
            </div>
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 :class="{active: pageSets[2].key === currentTab.key}" class="tit f-dib index-tit">
                {{ pageSets[2].name }}</h3>
            </div>
            <div class="content">
              <div>
                <el-form-item label="定位标签">
                  <template slot="label">
                    <span style="font-size: 1.17em">定位标签</span>
                  </template>
                  <el-row :gutter="10">
                    <el-col :span="7">
                      <el-form-item label="设备状态监控" prop="firstStatusType">
                        <el-switch v-model.number="form.firstStatusType" :active-value="1"
                                   inactive-value="" disabled></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="标签sn号" prop="locationTagId">
                        <!--<el-input placeholder="输入搜索标签sn号" type="input" v-model="form.name"/>-->
                        {{ form.tagSnNumber }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="能耗标签">
                  <template slot="label">
                    <span style="font-size: 1.17em">能耗标签</span>
                  </template>
                  <el-row :gutter="10">
                    <el-col :span="7">
                      <el-form-item label="设备状态监控" prop="firstStatusType">
                        <el-switch v-model.number="form.firstStatusType" :active-value="2"
                                   :inactive-value="0"
                                   disabled></el-switch>
                      </el-form-item>
                    </el-col>
                    <el-col :span="10">
                      <el-form-item label="标签sn号" prop="energyTagId">
                        {{ form.energyTagSnNumber }}
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </template>
  </dialog-template>
</template>
<script>
import {formatDictLabel} from '@/tools/utils'
import {medicalApi} from '@/resources'

export default {
  props: {
    index: Number,
    formItem: Object,
    statusType: Object
  },
  data() {
    return {
      span: 8,
      loading: false,
      pageSets: [
        {name: '基本信息', key: 0},
        {name: '能耗信息设置', key: 1},
        {name: '标签绑定', key: 2},
      ],
      currentTab: {},
      tempList: [],
      currentIndex: -1,
      parent: this.$parent.$parent,
      formatDictLabel,
      form: {
        devNo: '',
        devName: '',
        devType: '',
        templateId: '',
        supplier: '',
        manufacturer: '',
        departmentId: '',
        productTime: '',
        discardTime: '',
        firstUserTime: '',
        manufacturerRegistrationNumber: '',
        productionLicenseNumber: '',
        maintenanceCycle: '',
        registrationCertificateNumber: '',
        workStatus: '',
        standardWorkingHours: '',
        idleStateRangeStart: 0.00,
        idleStateRangeEnd: '',
        shutdownStatusStart: 0,
        shutdownStatusEnd: '',
        standardVoltageRangeStart: '',
        standardVoltageRangeEnd: '',
        standbyStatusRangeStart: '',
        standbyStatusRangeEnd: '',
        firstStatusType: '',
        locationTagId: '',
        energyTagId: '',
      }
    };
  },
  computed: {
    medicalDevType() {
      return this.$store.state.medicalDevType;
    },
    doorDevType() {
      return this.$store.state.doorDevType;
    },
    deviceTypes() {
      return this.$getDict('device_type')
    },
    templateName() {
      if (!this.tempList) {
        return ''
      }

      let temp = this.tempList.find(item => item.templateId === this.form.templateId);
      if (!temp) {
        return '';
      }

      return temp.templateName;
    }
  },
  watch: {
    index(val) {
      this.currentIndex = -1;
      this.$nextTick(() => {
        this.currentIndex = val;
      });

      this.getDetail(this.formItem.id)
    },
    'form.type': function (val) {
      if (!val) {
        return;
      }

      // 拿到设备类型后，调用设备模板查询接口获取设备类型模板
      this.getTempList();
    }
  },
  methods: {
    getDetail(id) {
      if (!id) {
        return
      }

      medicalApi.queryById(id).then(res => {
        this.form = res.data;
        if (!this.form.shutdownStatusStart) {
          this.form.shutdownStatusStart = 0;
        }

        this.getTempList();
      }).catch(err => {
        this.$notify.error(err.response && err.response.data && err.response.data.msg || '详情接口异常，请联系管理员');
      })
    },
    // 查询模板
    getTempList() {
      let params = {
        templateType: '2',
        devType: this.form.devType
      };

      this.tempList = [];
      this.$http.get('/template/queryByType', {params}).then(res => {
        this.tempList = res.data;
        if (!this.form.templateId) {
          return;
        }

        let has = this.tempList.some(t => t.templateId === this.form.templateId);
        if (!has) {
          this.tempList.push(this.form)
        }
      });
    },
    handlePreview: function (id) {
      this.$store.commit('changeAttachment', id);
    },
    showRecordDate: function (data) {
      return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
    },
    selectTab(item) {
      this.currentTab = item;
    },
    close() {
      this.$emit('right-close');
    },
    addBindRelation() {
      this.$refs['bindRelation'].isShowAddForm = true;
    }
  }
};
</script>
