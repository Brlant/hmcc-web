<style lang="scss" scoped>
  .form-part {
    background: #ffffff;

    .el-form {
      width: 800px;
      margin-left: auto;
      margin-right: auto;
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
</style>
<template>
  <div class="form-part">
    <el-form class="advanced-query-form" onsubmit="return false" label-width="80px">
      <el-form-item label="设备">
        <el-select popper-class="selects--custom" placeholder="请输入名称搜索设备" v-model="searchCondition.devIds"
                   multiple filterable remote :remote-method="queryAllTemp">
          <el-option :label="item.devName" :value="item.id" :key="item.id"
                     v-for="(item, index) in allTempList">
            <dev-option-info :item="item"/>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间段">
        <el-date-picker v-model="searchCondition.times" type="datetimerange" :default-time="['00:00:00', '23:59:59']"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"/>
      </el-form-item>
      <el-form-item label="时间间隔">
        <el-input type="number" v-model.number="searchCondition.statPiece" style="width: 180px" placeholder="请输入">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-has="'show'" type="primary" @click="exportData" :loading="doing">
          {{doing ? '正在导出': '导出'}}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import qs from 'qs';
  import utils from '@/tools/utils';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          devIds: [],
          times: [],
          statPiece: 5
        },
        showSearch: false,
        doing: false
      };
    },
    mounted() {
      this.queryAllTemp();
    },
    methods: {
      exportData() {
        let {devIds, times, statPiece} = this.searchCondition;
        let {$moment, $notify} = this;
        if (!devIds) {
          return $notify.info({
            message: '请选择设备'
          });
        }
        if (!times) {
          return $notify.info({
            message: '请选择时间段'
          });
        }
        if (!statPiece && statPiece !== 0) {
          return $notify.info({
            message: '请输入时间间隔'
          });
        }
        let params = {
          devIds, statPiece,
          startDate: $moment(times[0]).format('YYYY-MM-DD HH:mm:ss'),
          endDate: $moment(times[1]).format('YYYY-MM-DD HH:mm:ss')
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
      },
      reset() {
        this.searchCondition = {
          devIds: [],
          times: [],
          statPiece: 5
        };
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
