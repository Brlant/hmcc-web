<style lang="scss" scoped>
  .record-content {
    background: #fff;
    padding: 20px 0;
  }

  .record-title {
    font-weight: bold;
    font-size: 18px;
    text-align: center;
  }

  .m-border {
    border-bottom: 1px solid #e7e7e7;
    display: inline-block;
    padding: 0 10px;
    min-width: 50px;
  }

  .record-label {
    text-align: center;
    margin-top: 15px;
  }

  .record-table {
    padding: 0 50px;
    margin-top: 15px;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .table td {
    padding: 4px 8px;
    border: 1px solid #e7e7e7;
    text-align: center;
  }

  .table .header {
    font-weight: bold;

    td {
      background: #F5F5F6;
    }
  }

  .sign-img {
    width: auto;
    height: 24px;
    vertical-align: middle;
  }

  .refresh-btn {
    cursor: pointer;
    margin-left: 10px;
  }
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button plain size="small" @click="exportExcel">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
      </template>
    </search-part>
    <div class="record-content">
      <div class="record-table">
        <table class="table" v-loading="loading">
          <tr class="header">
            <td rowspan="2">ID</td>
            <td rowspan="2">单位名称</td>
            <td rowspan="2">设备名称</td>
            <td rowspan="2">设备类型</td>
            <td rowspan="2">品牌型号</td>
            <td rowspan="2">容积（冷藏/冷冻）L</td>
            <td rowspan="2">启用日期</td>
            <td colspan="3">温度情况</td>
            <td colspan="2">报警情况</td>
            <td rowspan="2">冷链设备评估值</td>
          </tr>
          <tr class="header">
            <td style="width: 30px">平均温度</td>
            <td style="width: 30px">最高温度</td>
            <td style="width: 30px">最低温度</td>
            <td style="width: 40px">超温报警次数</td>
            <td style="width: 40px">设备故障次数</td>
          </tr>
          <template v-for="(item, index) in dataList">
            <tr>
              <td>{{index + 1}}</td>
              <td>{{item.orgName}}</td>

              <td>{{item.freezerDevName}}</td>
              <td>{{formatDictLabel(item.freezerDevType, coolDevType)}}</td>
              <td>{{item.freezerDevBrand}}</td>
              <td>{{item.freezerDevVolume}}</td>
              <td>{{item.freezerDevUsingDate | date}}</td>

              <td>{{item.averageTemperature}}</td>
              <td>{{item.maximumTemperature}}</td>
              <td>{{item.minimumTemperature}}</td>

              <td>{{item.overTemperatureAlarmCount}}</td>
              <td>{{item.devMalfunctionCount}}</td>
              <td>
                {{item.freezerDevAssessedValue}}
                <i class="el-icon-refresh-right refresh-btn" @click="refreshItem(item)"></i>
              </td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import SearchPart from './search';
  import {devAssess} from '@/resources';
  import utils, {formatDictLabel} from '@/tools/utils';

  export default {
    components: {
      SearchPart
    },
    data() {
      return {
        filter: {
          orgName: '',
          orgId: '',
          freezerDevName: '',
          freezerDevId: '',
          freezerDevNo: '',
          monthDate: new Date(),
        },
        loading: false,
        formatDictLabel,
        dataList: []
      };
    },
    computed: {
      perms() {
        return this.$route.meta.perms;
      },
      coolDevType() {
        return this.$getDict('coolDevType');
      }
    },
    methods: {
      searchResult: function (search) {
        this.filter = Object.assign({}, this.filter, search);
        this.queryList();
      },
      resetRightBox() {
        this.showIndex = -1;
      },
      queryList() {
        let {orgId, status, monthDate} = this.filter;
        let evaluationDate = new Date(this.$moment(monthDate).startOf('month'));

        let params = {
          orgId,
          status,
          evaluationDate
        };
        this.loading = true;
        devAssess.query(params).then(res => {
          this.loading = false;
          if (res.code === 200) {
            this.dataList = res.data;
          }
        });
      },
      format(time, str = 'YYYY') {
        return this.$moment(time).format(str);
      },
      exportExcel() {
        let {orgId, status, monthDate} = this.filter;
        let evaluationDate = new Date(this.$moment(monthDate).startOf('month'));

        let params = {
          orgId,
          status,
          evaluationDate
        };
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '拼命导出中'});
        devAssess.export(params).then(res => {
          utils.download(res.data.path);
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path, text: '拼命导出中'});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path, text: '拼命导出中'});
          this.$notify({
            duration: 2000,
            title: '导出失败',
            message: error.response.data.msg,
            type: 'error'
          });
        });
      },
      refreshItem(item) {
        devAssess.refreshItem(item.id, item).then(res => {
          this.$notify.success('计算完成');
          Object.keys(item).forEach(k => {
            item[k] = res.data[k];
          });
        });
      }
    }
  };
</script>
