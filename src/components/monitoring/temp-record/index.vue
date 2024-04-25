<style lang="scss" scoped>
  .record-content {
    background: #fff;
    padding-top: 20px;
  }

  .record-title {
    font-weight: bold;
    font-size: 18px;
    text-align: center;
  }

  .m-border {
    border-bottom: 1px solid #333;
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
  }

  .table td {
    height: 24px;
    border: 1px solid #ddd;
    text-align: center;
  }

  .table .header {
    font-weight: bold;
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
        <el-button plain size="small" @click="print">
          <f-a class="icon-small" name="plus"></f-a>
          打印
        </el-button>
      </template>
    </search-part>
    <div class="record-content">
      <div class="record-title">
        <div class="m-border">{{format(filter.monthDate)}}</div>
        <span>年</span>
        <div class="m-border">{{format(filter.monthDate, 'MM')}}</div>
        <span>月冷链设备温度记录表</span>
      </div>
      <div class="record-label">
        <span>冷链设备名称：</span>
        <div class="m-border">{{filter.freezerDevName}}</div>
        <span>设备编码：</span>
        <div class="m-border">{{filter.freezerDevNo}}</div>
        <span>使用单位：</span>
        <div class="m-border">{{filter.orgName}}</div>
      </div>
      <div class="record-table">
        <el-row>
          <el-col :span="12">
            <table class="table">
              <tr class="header">
                <td rowspan="2" colspan="2">记录日期</td>
                <td rowspan="2">记录时间</td>
                <td colspan="2">温度（℃）</td>
                <td rowspan="2">记录人</td>
              </tr>
              <tr class="header">
                <td>冷藏</td>
                <td>冷冻</td>
              </tr>
              <template v-for="(item, index) in dataList.slice(0, 16)">
                <tr>
                  <td rowspan="2">{{index + 1}}</td>
                  <td>上午</td>
                  <td>{{item[0].recordDate || '-'}}</td>
                  <td>{{item[0].refrigerationTemperature || '-'}}</td>
                  <td>{{item[0].freezeTemperature || '-'}}</td>
                  <td class="R">
                    <img v-if="item[0].recordUserSignUrl" :src="item[0].recordUserSignUrl" class="sign-img">
                    <span v-else>未记录</span>
                  </td>
                </tr>
                <tr>
                  <td>下午</td>
                  <td>{{item[1].recordDate || '-'}}</td>
                  <td>{{item[1].refrigerationTemperature || '-'}}</td>
                  <td>{{item[1].freezeTemperature || '-'}}</td>
                  <td class="R">
                    <img v-if="item[1].recordUserSignUrl" :src="item[1].recordUserSignUrl" class="sign-img">
                    <span v-else>未记录</span>
                  </td>
                </tr>
              </template>
            </table>
          </el-col>
          <el-col :span="12">
            <table class="table">
              <tr class="header">
                <td rowspan="2" colspan="2" style="border-left: 0">记录日期</td>
                <td rowspan="2">记录时间</td>
                <td colspan="2">温度（℃）</td>
                <td rowspan="2">记录人</td>
              </tr>
              <tr class="header">
                <td>冷藏</td>
                <td>冷冻</td>
              </tr>
              <template v-for="(item, index) in dataList.slice(16)">
                <tr>
                  <td rowspan="2" style="border-left: 0">{{index + 17}}</td>
                  <td>上午</td>
                  <td>{{item[0].recordDate || '-'}}</td>
                  <td>{{item[0].refrigerationTemperature || '-'}}</td>
                  <td>{{item[0].freezeTemperature || '-'}}</td>
                  <td class="R">
                    <img v-if="item[0].recordUserSignUrl" :src="item[0].recordUserSignUrl" class="sign-img">
                    <span v-else>未记录</span>
                  </td>
                </tr>
                <tr>
                  <td>下午</td>
                  <td>{{item[1].recordDate || '-'}}</td>
                  <td>{{item[1].refrigerationTemperature || '-'}}</td>
                  <td>{{item[1].freezeTemperature || '-'}}</td>
                  <td class="R">
                    <img v-if="item[1].recordUserSignUrl" :src="item[1].recordUserSignUrl" class="sign-img">
                    <span v-else>未记录</span>
                  </td>
                </tr>
              </template>
            </table>
          </el-col>
        </el-row>
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
          if (res.code === 200) {
            // console.log(res.data,'日期对比');
            res.data.forEach(i => {
              i.dayOfMonth = this.$moment(i.recordDate).format('D');
              i.recordDate = this.$moment(i.recordDate).format('HH:mm');
            });
            let ary = [];
            let i = 1;
            while (i < 33) {
              let list = res.data.filter(f => f.dayOfMonth * 1 === i);
              if (!list.length) {
                list.push({id: '', recordDateType: 0});
                list.push({id: '', recordDateType: 1});
              } else if (list.length === 1) {
                if (list[0].recordDateType === 0) {
                  list.push({id: '', recordDateType: 1});
                } else {
                  list.push({id: '', recordDateType: 0});
                }
              }
              i++;
              ary.push(list.sort((pre, cur) => pre.recordDateType - cur.recordDateType));
            }
            console.log(ary,'日期');
            this.dataList = ary;
          }
        });
      },
      format(time, str = 'YYYY') {
        return this.$moment(time).format(str);
      },
      print() {
        var oPop = window.open('', '_blank');
        let content = this.$el.querySelector('.record-content');
        var str = '<!DOCTYPE html>';
        str += '<html>';
        str += '<head>';
        str += '<meta charset="utf-8">';
        str += '<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">';
        str += '<style>';
        str += '.record-content {background: #fff; font-size: 9pt;} .record-title {font-weight: bold;  font-size: 18px;  text-align: center;} .m-border {border-bottom: 1px solid #000;  display: inline-block;  padding: 0 10px;  min-width: 50px;} .record-locate-tag {text-align: center; margin-top: 10px;}.record-table { margin-top: 10px;}.table {  width: 100%;  border-collapse: collapse;}.table td {height: 24px;  border: 1px solid #000;  text-align: center;}.table .header {  font-weight: bold;}.el-col {width: 50%; float: left} .sign-img{width: 36px;height: 24px;vertical-align: middle;} .print-btn {background: #fff;border-radius: 4px;cursor: pointer}';
        str += '</style>';
        str += '</head>';
        str += '<body>';
        str += '</body>';
        str += '</html>';
        oPop.document.write(str);
        let button = document.createElement('button');
        button.innerText = '打印';
        button.classList.add('print-btn');
        button.addEventListener('click', function () {
          button.style.display = 'none';
          oPop.print();
          oPop.close();
        });
        oPop.document.body.append(button);
        oPop.document.body.append(content.cloneNode(true));
      }
    }
  };
</script>
