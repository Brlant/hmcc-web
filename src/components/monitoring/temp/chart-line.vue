<style scoped="">
  .chart-Line {
    height: 400px;
    width: 100%;
  }
</style>
<template>
  <div>
    <div v-if="!dataList || !dataList.length" class="empty-info">暂无信息</div>
    <e-charts v-else :options="option" theme="light" class="chart-Line"></e-charts>
  </div>
</template>
<script>
  export default {
    props: ['dataList', 'type'],
    data() {
      return {
        option: {
          // title: {
          //   text: '设备温度变化'
          // },
          progressive: 200,
          progressiveThreshold: 600,
          tooltip: {
            trigger: 'axis'
          },
          // legend: {},
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
        },
        averageTempLine: [
          {
            type: 'average',
            name: '平均值',
            label: {
              formatter: '平均{c} °C'
            }
          }
        ],
        tempLine: [
          {
            name: '合格温度上限',
            yAxis: 8,
            label: {
              formatter: '合格温度上限{c} °C'
            }
          },
          {
            name: '合格温度下限',
            yAxis: 2,
            label: {
              formatter: '合格温度下限{c} °C'
            }
          }
        ]
      };
    },
    watch: {
      dataList: {
        handler(val) {
          if (!val || !val.length) return;
          this.setMarkLine();
          this.option.series[0].data = val.map(m => {
            return {
              name: m.createTime,
              value: [m.createTime, m.devActval]
            };
          });
        },
        deep: true
      },
      type(val) {
        if (!val) return;
        let ary = ['', '°C', '%', 'V'];
        let ary_title = ['', '温度', '湿度', '电压'];
        this.option.yAxis.axisLabel.formatter = `{value} ${ary[val]}`;
        this.averageTempLine[0].label.formatter = `平均${ary_title[val]} {c}${ary[val]}`;
        this.setMarkLine();
      }
    },
    methods: {
      setMarkLine() {
        this.option.series[0].markLine.data = this.averageTempLine;
        // if (this.type === '1') {
        //   this.option.series[0].markLine.data = [...this.averageTempLine, ...this.tempLine];
        // }
      }
    }
  };
</script>
