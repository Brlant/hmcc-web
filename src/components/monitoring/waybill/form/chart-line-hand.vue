<style scoped="">
  .chart-Line {
    height: 400px;
    width: 770px;
  }
</style>
<template>
  <div>
    <e-charts ref="elCharts" :options="option" theme="light" class="chart-Line"></e-charts>
  </div>
</template>
<script>
  export default {
    props: ['dataList', 'type', 'devInfo'],
    data() {
      return {
        option: {
          progressive: 200,
          progressiveThreshold: 600,
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
      dataList(val) {
        if (!val || !val.length) return;
        const option = JSON.parse(JSON.stringify(this.option));
        option.legend.data = [];
        option.series = [];
        val.forEach(i => {
          option.legend.data.push(`${i.devNo}`);
          let data = {
            name: `${i.devNo}`,
            type: 'line',
            showSymbol: true,
            symbolSize: 6,
            data: i.dataDtoList && i.dataDtoList.map(m => {
              return {
                name: m.collectionTime,
                value: [m.collectionTime, m.value]
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
          if (this.devInfo) {
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
      }
    }
  };
</script>
