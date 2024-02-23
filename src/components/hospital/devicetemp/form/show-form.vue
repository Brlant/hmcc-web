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
      <div class="empty-info" v-else-if="!formItem.templateId">暂无数据</div>
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
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="模板名称">{{ form.templateName }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="模板分类">
                  {{ form.templateType == '1' ? '冷链设备' : '医疗设备' }}
                </oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备类型">
                  {{ formatDictLabel(form.devType, tempDevTypes) }}
                </oms-col>

                <div v-show="form.templateType === '1'">
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="是否医用设备">
                    {{ formatDictLabel(form.medicalFlag, medicalDevType) }}
                  </oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="容积">{{ form.devVolume }}</oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="备注">{{ form.remark }}</oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="门板类型">
                    {{ formatDictLabel(form.doorSheetType, doorDevType) }}
                  </oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="品牌">{{ form.devBrand }}</oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="型号">{{ form.devVersion }}</oms-col>
                </div>

                <div v-show="form.templateType === '2'">
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="注册证号/备案凭证号">
                    {{ form.registrationCertificateNumber }}
                  </oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="供应商">{{ form.supplier }}</oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="生产厂商">{{ form.manufacturer }}</oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="厂商备案凭证号">{{
                      form.manufacturerRegistrationNumber
                    }}
                  </oms-col>
                  <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="生产许可证号">{{
                      form.productionLicenseNumber
                    }}
                  </oms-col>
                </div>

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

export default {
  props: {
    index: Number,
    formItem: Object
  },
  data() {
    return {
      span: 8,
      loading: false,
      pageSets: [
        {name: '基本信息', key: 0},
        {name: '能耗信息设置', key: 1},
      ],
      currentTab: {},
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
        shutdownStatusStart: 0.00,
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
    medicalDevTypes() {
      return this.$getDict('device_type')
    },
    coolDevTypes() {
      return this.$getDict('coolDevType')
    },
    tempDevTypes(){
      if (this.form.templateType === '1'){
        return this.coolDevTypes;
      }else if (this.form.templateType === '2'){
        return this.medicalDevTypes;
      }else {
        return [];
      }
    }
  },
  watch: {
    index(val) {
      this.currentIndex = -1;
      this.$nextTick(() => {
        this.currentIndex = val;
      });

      this.getDetail(this.formItem.templateId)
    },
  },
  methods: {
    getDetail(templateId) {
      if (!templateId) {
        return
      }

      let params = {templateId};
      this.$http.get('/template/queryById', {params}).then(res => {
        this.form = res.data;
      }).catch(err => {
        this.$notify.error(err.response && err.response.data && err.response.data.msg || '详情接口异常，请联系管理员');
      })
    },
    handlePreview: function (attachmentId) {
      this.$store.commit('changeAttachment', attachmentId);
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
  },
  mounted() {
    if (this.formItem.templateId) {
      this.getDetail(this.formItem.templateId)
    }
  }
}
</script>
