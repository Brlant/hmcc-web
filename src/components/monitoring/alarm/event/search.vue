<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">告警事件查询</template>
    <template slot="btn">
      <slot name="btn">
        <el-button @click="exportSearchFile" plain size="small" v-has="permPage.handle">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
      </slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="发生时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                              type="datetimerange" v-model="times1" @change="search"/>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="恢复时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                              type="datetimerange" v-model="times2" @change="search"/>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="4" label="探头">
              <el-select :remote-method="queryProbeList" @focus="queryProbeList('')" filterable placeholder="请输入名称搜索探头" remote
                         v-model="searchCondition.sensorId" @change="search">
                <el-option :key="item.id" :label="item.name" :value="item.id"
                           v-for="item in probeList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="告警类型">
              <el-select filterable placeholder="请选择告警类型"
                         v-model="searchCondition.type" @change="search">
                <el-option :key="index" :label="item" :value="index"
                           v-for="(item, index) in alarmTypeList"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="告警级别">
              <el-radio-group @change="search" size="small" v-model="searchCondition.level">
                <el-radio-button label="1">一级</el-radio-button>
                <el-radio-button label="2">二级</el-radio-button>
                <el-radio-button label="3">三级</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="4">
            <oms-form-row :span="11" label="是否恢复">
              <el-radio-group @change="search" size="small" v-model="searchCondition.handleStatus">
                <el-radio-button :label="1">是</el-radio-button>
                <el-radio-button :label="0">否</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="4">
            <oms-form-row :span="11" label="是否处理">
              <el-radio-group @change="search" size="small" v-model="searchCondition.handlingStatus">
                <el-radio-button :label="1">是</el-radio-button>
                <el-radio-button :label="0">否</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import {http} from '@/resources';
  import utils from '@/tools/utils';

  export default {
    props: {
      alarmTypeList: Array
    },
    mixins: [methodsMixin],
    computed: {
      permPage() {
        return this.$route.meta.permPage;
      }
    },
    data: function () {
      return {
        searchCondition: {
          type: '',
          level: '',
          sensorId: '',
          startDate: '',
          endDate: '',
          recoveryStartDate: '',
          recoveryEndDate: '',
          handlingStatus: '',
          handleStatus: ''
        },
        showSearch: false,
        list: [],
        times1: [],
        times2: []
      };
    },
    methods: {
      exportSearchFile: function () {
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: this.$route.path,
          text: '正在导出'
        });
        let params = Object.assign({}, this.searchCondition);
        http.post('/alarm-event/export', params).then(res => {
          if (res.data.code === 200) {
            utils.download(res.data.data.path, '告警记录表');
          }
          this.$notify.success({
            message: '导出成功'
          });

          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/alarm/record'
          });

        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: this.$route.path
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search() {
        const parent = this.$parent;
        this.searchCondition.startDate = parent.formatTimeAry(this.times1, 0);
        this.searchCondition.endDate = parent.formatTimeAry(this.times1, 1);
        this.searchCondition.recoveryStartDate = parent.formatTimeAry(this.times2, 0);
        this.searchCondition.recoveryEndDate = parent.formatTimeAry(this.times2, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          type: '',
          level: '',
          sensorId: '',
          startDate: '',
          endDate: '',
          recoveryStartDate: '',
          recoveryEndDate: '',
          handlingStatus: '',
          handleStatus: ''
        };
        this.times1 = [];
        this.times2 = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
