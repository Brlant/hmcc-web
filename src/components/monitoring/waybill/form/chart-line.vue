<style scoped="">
  .chart-Line {
    height: 400px;
    width: 100%;
  }
</style>
<template>
  <div>
    <e-charts ref="elCharts" :options="option" theme="light" class="chart-Line"></e-charts>
  </div>
</template>
<script>
  import StorageMixin from '@/mixins/StorageMixin';

  export default {
    props: ['isLoaded', 'devInfo', 'dataKey'],
    mixins: [StorageMixin],
    data() {
      return {
        option: {
          progressive: 200,
          progressiveThreshold: 600,
          title: {
            text: '温度计数据',
            textStyle: {
              fontSize: 16
            }
          },
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
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            },
            min: function (value) {
              return value.min;
            },
            max: function (value) {
              return value.max;
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
          },
          series: [
            {
              name: '温度',
              type: 'line',
              showSymbol: true,
              data: [],
              smooth: true,
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {
                    type: 'average',
                    name: '平均值'
                  }
                ]
              }
            }
          ]
        }
      };
    },
    watch: {
      isLoaded: {
        handler(val) {
          if (val) return;
          let list = this.getStorageItem(this.dataKey) || [];
          if (!list.length) return;
          let option = this.getOption();
          option.legend.data = [];
          option.series = [];
          list.forEach((i, index) => {
            option.legend.data.push(`${i.name}`);
            let data = {
              name: `${i.name}`,
              type: 'line',
              showSymbol: true,
              symbolSize: 6,
              data: i.tempData && i.tempData.map(m => {
                return {
                  name: m.createTime,
                  value: [m.createTime, m.devActval]
                };
              }) || [],
              smooth: true,
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {
                    type: 'average',
                    name: '平均值'
                  }
                ]
              }
            };
            if (this.devInfo && index === 0) {
              if (this.devInfo.departTime) {
                data.markLine.data.push({
                  xAxis: this.$moment(this.devInfo.departTime).format('YYYY-MM-DD HH:mm'),
                  label: {
                    formatter: obj => {
                      return this.$moment(obj.value).format('HH:mm');
                    }
                  },
                  lineStyle: {
                    color: 'red'
                  }
                });
              }
              if (this.devInfo.arriveTime) {
                data.markLine.data.push({
                  xAxis: this.$moment(this.devInfo.arriveTime).format('YYYY-MM-DD HH:mm'),
                  label: {
                    formatter: obj => {
                      return this.$moment(obj.value).format('HH:mm');
                    }
                  },
                  lineStyle: {
                    color: 'red'
                  }
                });
              }
            }
            option.series.push(data);
          });
          this.$refs.elCharts.mergeOptions(option);
        },
        deep: true
      }
    },
    methods: {
      getOption() {
        return {
          progressive: 200,
          progressiveThreshold: 600,
          title: {
            text: '温度计数据',
            textStyle: {
              fontSize: 16
            }
          },
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
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            },
            min: function (value) {
              return value.min;
            },
            max: function (value) {
              return value.max;
            }
          },
          dataZoom: [
            {
              id: 'dataZoomX',
              type: 'inside',
              xAxisIndex: [0],
              filterMode: 'filter'
            }
          ],
          series: [
            {
              name: '温度',
              type: 'line',
              showSymbol: true,
              data: [],
              smooth: true,
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {
                    type: 'average',
                    name: '平均值'
                  }
                ]
              }
            }
          ]
        };
      }
    }
  };
</script>
