<style scoped>
  .chart-Line {
    height: 400px;
    width: 1200px;
    background: #fff;
  }
</style>
<template>
  <div>
    <!--<div v-if="!dataList || !dataList.length" class="empty-info">暂无信息</div>-->
    <oms-loading v-if="loadingData" :loading="loadingData"/>
    <div v-else-if="!isHasData" class="empty-info">暂无信息</div>
    <!--<e-charts ref="echart" v-else :options="option" theme="light" class="chart-Line"></e-charts>-->
    <div v-else>
      <div id="chartLine" class="chart-Line" :style="{width: chartWidth}"></div>
    </div>
  </div>
</template>
<script>
  const unitAry = ['', '°C', '%', '%'];
  const titleAry = ['', '温度', '湿度', '电压'];
  import {TempDev} from '@/resources';
  import axios from 'axios';
  import Echarts from 'echarts/lib/echarts';
  import moment from 'moment';

  function formatTime(time) {
    return moment(time).format('YYYY-MM-DD: HH:mm:ss');
  }

  export default {
    props: ['filters', 'isRecord', 'detail', 'chartWidth'],
    data() {
      return {
        loadingData: false,
        isHasData: false
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.queryList();
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      getLegend(typeList) {
        return {
          data: typeList.map(m => titleAry[m])
        };
      },
      getYAxis(typeList) {
        let {setMaxAndMin} = this;
        return typeList.map((m, index) => {
          let ot = this.isRecord ? 40 : 50;
          let obj = {
            name: titleAry[m] + `(${unitAry[m]})`,
            offset: index === 2 ? ot : 0,
            type: 'value'
          };
          setMaxAndMin(obj, m);
          return obj;
        });
      },
      setMaxAndMin(obj, type) {

        obj.min = value => value.min;
        obj.max = value => value.max;

        // if (type === '1') {
        //   obj.min = value => value.min;
        //   obj.max = value => value.max;
        // } else if (type === '2') {
        //   obj.min = value => value.min;
        //   obj.max = value => value.max;
        // } else {
        //   obj.max = function (value) {
        //     return value.max !== Infinity
        //       ? value.max + value.max > 10 ? 10 : 5
        //       : '';
        //   };
        //   obj.min = function (value) {
        //     let v = value.min - value.min > 10 ? 10 : 5;
        //     return value.min !== Infinity
        //       ? v > 0 ? v : 0
        //       : value.min;
        //   };
        // }
      },
      getData(data, type, index) {
        return {
          name: titleAry[type],
          type: 'line',
          showSymbol: true,
          symbolSize: 6,
          yAxisIndex: index,
          data: data,
          smooth: true,
          markPoint: {
            data: [
              {type: 'max', name: '最大值'},
              {type: 'min', name: '最小值'}
            ]
          },
          markLine: {
            data: [
              [
                {
                  type: 'average',
                  name: '平均值',
                  x: '10%'
                },
                {
                  type: 'average',
                  x: '92%'
                }
              ]
            ]
          }
        };
      },
      getOption() {
        let obj = {
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['温度']
          },
          xAxis: {
            type: 'time',
            splitLine: {
              show: false
            }
          },
          dataZoom: [
            {
              id: 'dataZoomXslider',
              type: 'slider',
              xAxisIndex: [0],
              filterMode: 'filter'
            },
            {
              id: 'dataZoomXinside',
              type: 'inside',
              xAxisIndex: [0],
              filterMode: 'filter'
            }
          ],
          grid: {
            bottom: 80
          }
        };
        let _this = this;
        obj.tooltip.formatter = function (params) {
          if (!params.length) return '';
          let collectTime = '';
          let insertTime = '';
          if (_this.isRecord) {
            // 告警事件
            collectTime = moment(params[0].value[0]).format('MM-DD: HH:mm:ss');
            insertTime = moment(params[0].value[2]).format('MM-DD: HH:mm:ss');
          } else {
            // 历史数据
            collectTime = formatTime(params[0].value[0]);
            insertTime = formatTime(params[0].value[2]);
          }
          let str = `采集时间: ${collectTime}<br/>数据库存储时间: ${insertTime}<br/>`;
          params.forEach(i => {
            str += `${i.marker}${i.seriesName}: ${i.value[1]}<br/>`;
          });
          return str;
        };
        return obj;
      },
      getAlarmLine(time) {
        return {
          xAxis: time,
          label: {
            formatter: obj => {
              return this.$moment(obj.value).format('HH:mm:ss');
            }
          },
          lineStyle: {
            color: 'red'
          }
        };
      },
      queryList() {
        let filter = {};
        if (Array.isArray(this.filters)) {
          if (!this.filters.length) return;
          filter = this.filters[0];
        } else {
          if (!this.filters) return;
          filter = this.filters;
        }
        const {startTime, endTime, devId, devCode, valType, startPrice} = filter;
        let {getLegend, getYAxis, getData, getOption, getAlarmLine} = this;
        const option = getOption();
        if (!devCode) return;
        const typeList = valType.filter(f => f !== '4');
        // 设置图例
        option.legend = getLegend(typeList);
        // 设置Y轴
        option.yAxis = getYAxis(typeList);
        option.series = [];
        let httpAry = [];
        typeList.forEach((i, index) => {
          const params = {startTime, endTime, devId, devCode, valType: i, startPrice};
          httpAry.push(TempDev.queryTempData(params));
        });
        this.loadingData = true;
        this.isHasData = false;
        axios.all(httpAry)
          .then(axios.spread((...args) => {
            this.loadingData = false;
            typeList.forEach((i, index) => {
              const data = args[index].data.ccsDevDataRecordDTOList && args[index].data.ccsDevDataRecordDTOList.map(m => {
                return {
                  name: m.createTime,
                  value: [m.createTime, m.devActval, m.insertTime]
                };
              }) || [];
              data.length && (this.isHasData = true);
              option.series.push(getData(data, i, index));
            });
            this.$nextTick(() => {
              let chartDom = document.getElementById('chartLine');
              if (!chartDom) return;
              let chartLine = Echarts.init(chartDom, 'light');
              if (!chartLine) return;
              let {isRecord, detail} = this;
              if (isRecord && option.series.length) {
                // 时间标线， 起始时间，终止时间
                option.series.forEach(i => {
                  const data = i.markLine.data;
                  if (data.length > 1) return;
                  data.push(getAlarmLine(detail.createTime));
                  detail.restoreTime && data.push(getAlarmLine(detail.restoreTime));
                });
                chartLine.setOption(option);
              } else {
                chartLine.setOption(option);
              }
            });
          })).catch(e => {
          this.loadingData = false;
          this.isHasData = false;
          this.$notify.error({
            title: '查询错误',
            message: e.response && e.response.data && e.response.data.msg || ''
          });
        });
      }
    }
  };
</script>
