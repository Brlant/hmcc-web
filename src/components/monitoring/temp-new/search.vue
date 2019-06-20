<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" :midSpan="0" :titleSpan="16" @isShow="isShow"
                   @reset="reset" @search="search">
    <template slot="title">
      <span v-if="typeof devTitle === 'string'">{{devTitle}}</span>
      <span v-else>
        <span class="mr-10">{{devTitle.devName}}</span>
        <span class="mr-10">设备编号:{{devTitle.devNo}}</span>
        <span class="mr-10">编码: {{devTitle.devCode}}</span>
        <span class="mr-10">类型:{{tempTypeList[devTitle.devType]}}</span>
      </span>
    </template>
    <template slot="btn">
      <slot name="btn">
        <el-button :disabled="doing" @click="exportData" size="small" v-has="'ccs-devdata-export'">
          <i class="el-icon-t-export" style="font-size: 12px"/>
          {{doing ? '正在导出...': '导出温度数据'}}
        </el-button>
        <el-button @click="$router.push('/monitoring/org/hot/spot')" size="small" v-show="!$route.meta.showDev">
          <i class="el-icon-back"/> 返回上一级
        </el-button>
      </slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="9">
            <oms-form-row :required="true" :span="5" label="上报时间">
              <el-date-picker :default-time="['00:00:00', '23:59:59']" @change="timeChange" placeholder="请选择"
                              type="datetimerange" v-model="times1"/>
            </oms-form-row>
          </el-col>
          <el-col :span="9" v-show="$route.meta.showDev">
            <oms-form-row :span="4" label="设备">
              <el-select :remote-method="queryAllTemp" @change="devChange"
                         clearable filterable multiple
                         placeholder="请输入名称搜索设备" popper-class="selects--custom" remote v-model="searchCondition.devId">
                <el-option :key="item.id" :label="item.devName" :value="item.id"
                           v-for="(item, index) in allTempList">
                  <dev-option-info :item="item"/>
                </el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="9" v-show="!$route.meta.showDev">
            <oms-form-row :required="true" :span="5" label="时间间隔">
              <el-input placeholder="请输入时间间隔" type="number" v-model.number="searchCondition.startPrice">
                <template slot="append">分钟</template>
              </el-input>
            </oms-form-row>
          </el-col>
          <el-col :span="6">
            <oms-form-row :span="6" label="数据类型">
              <el-checkbox-group :max="searchCondition.devId.length > 1 ? 1: 3" @change="search" size="small"
                                 v-if="searchCondition.devId.length <= 1"
                                 v-model="searchCondition.valType">
                <el-checkbox-button label="1">温度</el-checkbox-button>
                <el-checkbox-button label="2">湿度</el-checkbox-button>
                <el-checkbox-button label="3">电压</el-checkbox-button>
              </el-checkbox-group>
              <el-radio-group @change="search" size="small" v-else v-model="searchCondition.valType">
                <el-radio-button label="1">温度</el-radio-button>
                <el-radio-button label="2">湿度</el-radio-button>
                <el-radio-button label="3">电压</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row v-show="$route.meta.showDev">
          <el-col :span="9">
            <oms-form-row :required="true" :span="5" label="时间间隔">
              <el-input placeholder="请输入时间间隔" type="number" v-model.number="searchCondition.startPrice">
                <template slot="append">分钟</template>
              </el-input>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import {TempDev} from '@/resources';
  import utils from '@/tools/utils';
  import qs from 'qs';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          startTime: '',
          endTime: '',
          devId: '',
          devCode: '',
          valType: ['1'],
          startPrice: ''
        },
        showSearch: false,
        doing: false,
        times1: [],
        tempType: {
          1: '温度',
          2: '湿度',
          3: '电压'
        },
        selectTempList: [] // 用来存储已经丢失的 选中过的设备的列表数据
      };
    },
    computed: {
      devTitle() {
        if (!this.searchCondition.devId || !this.searchCondition.devId.length) return '历史数据';
        if (this.searchCondition.devId.length === 1) {
          let dev = this.selectTempList.filter(f => f.id === this.searchCondition.devId[0])[0];
          if (!dev) return '历史数据';
          return dev;
        }
        return '历史数据';
      }
    },
    mounted() {
      this.times1 = [this.$moment(this.$moment().format('YYYY-MM-DD')), this.$moment()];
      let {id, type} = this.$route.query;
      if (!id) return;
      this.allTempList = [];
      TempDev.get(id).then(res => {
        let {devName, devCode, devType, id, devNo} = res.data;
        this.allTempList.push({devName, devCode, devType, id, devNo});
        this.$nextTick(() => {
          this.searchCondition.devId = [id];
          this.searchCondition.devCode = devCode;
          this.searchCondition.valType = [type];
          this.search();
          this.devChange(this.searchCondition.devId);
        });
      });
    },
    methods: {
      search() {
        this.searchCondition.startTime = this.formatTimeAry(this.times1, 0);
        this.searchCondition.endTime = this.formatTimeAry(this.times1, 1);
        if (!this.searchCondition.devId.length || !this.searchCondition.valType.length) return;
        let ary = this.searchCondition.devId.map(i => {
          let item = JSON.parse(JSON.stringify(this.searchCondition));
          item.devId = i;
          let dev = this.selectTempList.find(f => f.id === i);
          item.devCode = dev && dev.devCode || '';
          item.devName = dev && dev.devName;
          if (!Array.isArray(item.valType)) {
            item.valType = [item.valType];
          }
          return item;
        });
        this.$emit('search', ary);

      },
      reset() {
        this.searchCondition = {
          startTime: '',
          endTime: '',
          devId: '',
          devCode: '',
          valType: ['1']
        };
        this.times1 = [this.$moment(this.$moment().format('YYYY-MM-DD')), this.$moment()];
        this.$emit('search', this.searchCondition, true);
      },
      isShow(val) {
        this.showSearch = val;
      },
      formatTimeAry(times, index) {
        if (!times) return;
        return this.formatTime(times[index]);
      },
      formatTime(time, str = 'YYYY-MM-DD HH:mm:ss') {
        return time ? this.$moment(time).format(str) : '';
      },
      devChange(val) {
        if (!val) return;
        if (!this.times1) return;
        val.forEach(i => {
          let item = this.allTempList.find(f => f.id === i);
          item && this.selectTempList.push(item);
        });
        if (this.searchCondition.devId.length > 1) {
          this.searchCondition.valType = '1';
        } else {
          this.searchCondition.valType = ['1'];
        }
        this.search();
      },
      timeChange(val) {
        if (!val) return;
        if (!this.searchCondition.devId) return;
        this.search();
      },
      exportData() {
        let {devId, startPrice} = this.searchCondition;
        let {$notify} = this;
        if (!devId || !devId.length) {
          return $notify.info({
            message: '请选择设备'
          });
        }
        if (!this.times1) {
          return $notify.info({
            message: '请选择时间段'
          });
        }
        let params = {
          devIds: devId,
          statPiece: startPrice,
          startDate: this.formatTimeAry(this.times1, 0),
          endDate: this.formatTimeAry(this.times1, 1)
        };
        this.doing = true;
        this.$httpRequestOpera(this.$http({
          url: '/ccsWarehouse/export/dev-report',
          params,
          paramsSerializer(params) {
            return qs.stringify(params, {indices: false});
          }
        }), {
          successTitle: '导出成功',
          errorTitle: '导出失败',
          success: res => {
            this.doing = false;
            utils.download(res.data.path);
          },
          error: () => {
            this.doing = false;
          }
        });
      }
    }
  };
</script>
