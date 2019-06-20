<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">告警事件查询</template>
    <template slot="btn">
      <slot name="btn">
        <el-button @click="exportSearchFile" plain size="small">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
      </slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="7">
            <oms-form-row :span="5" label="发生时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                              type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="5" label="恢复时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" class="el-date-picker--mini" placeholder="请选择"
                              type="datetimerange" v-model="times2"/>
            </oms-form-row>
          </el-col>
          <el-col :span="5">
            <oms-form-row :span="4" label="设备">
              <el-select :remote-method="queryAllTemp" @change="search"
                         clearable filterable
                         placeholder="请输入名称搜索设备" popper-class="selects--custom" remote reserve-keyword
                         v-model="searchCondition.devId">
                <el-option :key="item.id" :label="item.devName" :value="item.id"
                           v-for="(item, index) in allTempList">
                  <dev-option-info :item="item"/>
                </el-option>
              </el-select>
              <!--<oms-input placeholder="请输入设备名称" v-model.trim="searchCondition.devName" @keyup.native.enter="search"/>-->
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="8" label="状态">
              <el-radio-group @change="search" size="small" v-model="searchCondition.confirmStatus">
                <el-radio-button :label="0">未确认</el-radio-button>
                <el-radio-button :label="1">已确认</el-radio-button>
                <el-radio-button :label="2">取消</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <oms-form-row :span="5" label="异常类型">
              <el-radio-group @change="search" size="small" v-model="searchCondition.warnType">
                <el-radio-button :label="1">温度</el-radio-button>
                <el-radio-button :label="2">湿度</el-radio-button>
                <el-radio-button :label="3">电压</el-radio-button>
                <el-radio-button :label="4">离线时间</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="4">
            <oms-form-row :span="8" label="是否恢复">
              <el-radio-group @change="search" size="small" v-model="searchCondition.recoveryStatus">
                <el-radio-button :label="1">是</el-radio-button>
                <el-radio-button :label="0">否</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
          <el-col :span="4">
            <oms-form-row :span="8" label="告警级别">
              <el-radio-group @change="search" size="small" v-model="searchCondition.warnLevel">
                <el-radio-button :label="0">低</el-radio-button>
                <el-radio-button :label="1">高</el-radio-button>
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
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          occurBegin: '',
          occurEnd: '',
          restoreBegin: '',
          restoreEnd: '',
          devName: '',
          devId: '',
          confirmStatus: '',
          warnType: '',
          warnLevel: '',
          recoveryStatus: null
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
          moduleId: '/alarm/record',
          text: '正在导出'
        });
        let params = Object.assign({}, this.searchCondition);
        http.get('/ccsWarnRecord/export', {params}).then(res => {
          utils.download(res.data.path, '告警记录表');
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/alarm/record'
          });

        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: '/alarm/record'
          });
          this.$notify.error({
            message: error.response.data && error.response.data.msg || '导出失败'
          });
        });
      },
      search() {
        const parent = this.$parent;
        this.searchCondition.occurBegin = parent.formatTimeAry(this.times1, 0);
        this.searchCondition.occurEnd = parent.formatTimeAry(this.times1, 1);
        this.searchCondition.restoreBegin = parent.formatTimeAry(this.times2, 0);
        this.searchCondition.restoreEnd = parent.formatTimeAry(this.times2, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          occurBegin: '',
          occurEnd: '',
          restoreBegin: '',
          restoreEnd: '',
          devName: '',
          confirmStatus: '',
          warnType: '',
          warnLevel: '',
          recoveryStatus: null
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
