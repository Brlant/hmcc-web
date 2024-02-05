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
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备编号">{{ form.no }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备名称">{{ form.name }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备类型">
                  {{ formatDictLabel(form.type, coolDevType) }}
                </oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备类型模板">{{ templateName }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="所属科室">{{ form.departmentName }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="所属科室">{{ form.departmentName }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="所属单位">{{ form.orgName }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="设备启用时间">{{ form.startUsingTime }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="型号">{{ form.version }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="状态">{{ formatStatus(form.status, statusType) }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="是否医用设备">
                  {{ formatDictLabel(form.medicalFlag, medicalDevType) }}
                </oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="容积">{{ form.volume }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="备注">{{ form.remark }}</oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="门板类型">
                  {{ formatDictLabel(form.doorSheetType, doorDevType) }}
                </oms-col>
                <oms-col :isShow="true" :rowSpan="8" :colSpan="8" label="品牌">{{ form.brand }}</oms-col>
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
                    <el-form-item label="标准工作时长" prop="standardWorkingHours">
                      <!--{{ form.standardWorkingHours || '' }} 小时-->
                      <el-input placeholder="请输入数字" type="number" v-model.number="form.standardWorkingHours" disabled>
                        <template slot="append">小时</template>
                      </el-input>
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
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="闲置状态范围">
                      <el-row :gutter="10">
                        <el-col :span="10">
                          <el-form-item prop="idleStateRangeStart">
                            <el-input placeholder="请输入数字" type="number"
                                      v-model.number="form.idleStateRangeStart" disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">至</el-col>
                        <el-col :span="10">
                          <el-form-item prop="idleStateRangeEnd">
                            <el-input placeholder="请输入数字" type="number"
                                      v-model.number="form.idleStateRangeEnd" disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">mA</el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="标准电压范围">
                      <el-row :gutter="10">
                        <el-col :span="10">
                          <el-form-item prop="standardVoltageRangeStart">
                            <el-input placeholder="请输入数字" type="number"
                                      v-model.number="form.standardVoltageRangeStart"
                                      disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">至</el-col>
                        <el-col :span="10">
                          <el-form-item prop="standardVoltageRangeEnd">
                            <el-input placeholder="请输入数字" type="number"
                                      v-model.number="form.standardVoltageRangeEnd"
                                      disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">V</el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12">
                    <el-form-item label="待机状态范围">
                      <el-row :gutter="10">
                        <el-col :span="10">
                          <el-form-item prop="standbyStatusRangeStart">
                            <el-input placeholder="请输入数字" type="number"
                                      v-model.number="form.standbyStatusRangeStart"
                                      disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="1">至</el-col>
                        <el-col :span="10">
                          <el-form-item prop="standbyStatusRangeEnd">
                            <el-input placeholder="请输入数字" type="number"
                                      v-model.number="form.standbyStatusRangeEnd"
                                      disabled></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col class="line" :span="2">mA</el-col>
                      </el-row>
                    </el-form-item>
                  </el-col>
                </el-row>
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
                                   :inactive-value="0" disabled></el-switch>
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
import commonMixin from '@/mixins/commonMixin'
export default {
  props: {
    index: Number,
    formItem: Object,
    statusType: Object
  },
  mixins: [commonMixin],
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
        no: '',
        name: '',
        type: '',
        templateId: '',
        departmentId: '',
        orgId: '',
        startUsingTime: '',
        version: '',
        status: '',
        medicalFlag: '',
        volume: '',
        remark: '',
        doorSheetType: '',
        brand: '',
        standardWorkingHours: '',
        workStatus: '',
        idleStateRangeStart: 0.00,
        idleStateRangeEnd: '',
        standardVoltageRangeStart: '',
        standardVoltageRangeEnd: '',
        standbyStatusRangeStart: '',
        standbyStatusRangeEnd: '',
        firstStatusType: 0,
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
    coolDevType() {
      return this.$getDict('coolDevType')
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

      this.form = Object.assign({}, this.formItem);
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
    // 查询模板
    getTempList() {
      let params = {
        templateType: '1',
        devType: this.form.type
      };

      this.tempList = [];
      this.$http.get('/template/queryByType', {params}).then(res => {
        this.tempList = res.data;
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
