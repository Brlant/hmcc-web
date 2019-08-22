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
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">

        <el-button plain size="small" @click="calculate">
          <f-a class="icon-small" name="start"></f-a>
          开始计算
        </el-button>

        <el-button plain size="small" @click="exportExcel">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
      </template>
    </search-part>
    <div class="record-content">
      <div class="record-table">
        <table class="table">
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
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </template>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
  import SearchPart from './search';
  import {temperatureRecord} from '@/resources';

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
        dataList: []
      };
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
        let {orgId, freezerDevId, monthDate} = this.filter;
        let startDate = new Date(this.$moment(monthDate).startOf('month'));
        let endDate = new Date(this.$moment(monthDate).endOf('month'));
        let params = {
          orgId,
          freezerDevId,
          startDate,
          endDate
        };
        temperatureRecord.query(params).then(res => {
          if (res.data.code === 200) {
            this.dataList = res.data.data;
          }
        });
      },
      format(time, str = 'YYYY') {
        return this.$moment(time).format(str);
      },
      exportExcel() {

      },
      calculate() {

      }
    }
  };
</script>
