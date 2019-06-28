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
      <div id="newChartLine" class="chart-Line" :style="{width: chartWidth}"></div>
    </div>
  </div>
</template>
<script>
  const unitAry = ['', '°C', '%', 'V'];
  const titleAry = ['', '温度', '湿度', '电压'];
  import moment from 'moment';
  import Echarts from 'echarts/lib/echarts';

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
        handler: function (val) {
          if (!val.freezerDevId) return;
          this.queryList();
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      getLegend(typeList) {
        return {
          data: typeList.map(m => m.name)
        };
      },
      getYAxis(m) {
        let {setMaxAndMin} = this;
        let obj = {
          name: titleAry[m] + `(${unitAry[m]})`,
          type: 'value'
        };
        setMaxAndMin(obj);
        return obj;
      },
      setMaxAndMin(obj, type) {
        obj.min = value => value.min;
        obj.max = value => value.max;
      },
      getData(data, i, index) {
        return {
          name: i.name,
          type: 'line',
          showSymbol: true,
          symbolSize: 6,
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
          let str = `采集时间: ${collectTime}<br/>插入时间: ${insertTime}<br/>`;
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
        let {getLegend, getYAxis, getData, getOption, getAlarmLine} = this;
        const option = getOption();
        // 设置图例
        // 设置Y轴
        option.yAxis = getYAxis(this.filter.type);
        option.series = [];

        this.loadingData = true;
        this.isHasData = false;
        this.$http.post('/historical-data', this.filter).then(res => {
          this.loadingData = false;
          if (res.data.code === 200) {
            this.isHasData = true;
            option.legend = getLegend(res.data.data.devDataList);
            res.data.data.devDataList.forEach(i => {
              const data = i.dataList.map(m => {
                return {
                  name: m.createTime,
                  value: [m.createTime, m.value, m.insertTime]
                };
              }) || [];
              option.series.push(getData(data, i));
            });
            this.$nextTick(() => {
              let chartDom = document.getElementById('newChartLine');
              if (!chartDom) return;
              let chartLine = Echarts.init(chartDom, 'light');
              if (!chartLine) return;
              chartLine.setOption(option);
            });
          }
        });
      }
    }
  };
</script>
