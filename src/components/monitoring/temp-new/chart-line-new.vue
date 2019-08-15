<style scoped="">
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
  import Echarts from 'echarts/lib/echarts';
  import moment from 'moment';

  function formatTime(time) {
    return moment(time).format('YYYY-MM-DD: HH:mm:ss');
  }

  export default {
    props: ['filter', 'isRecord', 'detail', 'chartWidth'],
    data() {
      return {
        loadingData: false,
        isHasData: false
      };
    },
    watch: {
      filter: {
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
          let ot = 40;
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
          let insertTime = '';
          insertTime = moment(params[0].value[2]).format('MM-DD: HH:mm:ss');
          let str = `插入时间: ${insertTime}`;
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
        const {id} = this.filter;
        let {getLegend, getYAxis, getData, getOption, getAlarmLine} = this;
        const option = getOption();
        if (!id) return;
        let typeList = ['1', '2', '3'];
        // 设置图例
        option.legend = getLegend(typeList);
        // 设置Y轴
        option.yAxis = getYAxis(typeList);
        option.series = [];
        this.loadingData = true;
        this.isHasData = false;
        this.$http.post('/sensor/data', this.filter).then(res => {
          this.loadingData = false;
          if (res.data.code === 200) {
            typeList.forEach((i, index) => {
              const data = res.data.data && res.data.data.map(m => {
                m.value = i === '1' ? m.temperature : i === '2' ? m.humidity : m.voltage;
                return {
                  name: m.createTime,
                  value: [m.createTime, m.value, m.insertTime]
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
              let {detail} = this;
              // 时间标线， 起始时间，终止时间
              option.series.forEach(i => {
                const data = i.markLine.data;
                if (data.length > 1) return;
                data.push(getAlarmLine(detail.occurrenceTime));
                detail.recoveryTime && data.push(getAlarmLine(detail.recoveryTime));
              });
              chartLine.setOption(option);
            });
          }
        });
      }
    }
  };
</script>
