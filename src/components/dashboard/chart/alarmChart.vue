<style lang="scss">
  .point-title {
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, .3);
    margin-bottom: 7px;
  }
</style>
<template>

  <e-charts
    :options="options" theme="light"
    :autoResize="true" ref="chart"></e-charts>

</template>

<script>
  import TimeMixins from '@/mixins/timeMixin';
  export default {
    name: 'alarmChart',
    mixins: [TimeMixins],
    data() {
      return {
        cycle: 0,
        options: {
          grid: {
            left: '1%',
            right: '3%',
            bottom: '1%',
            containLabel: true
          },
          title: {
            text: '告警事件分布'
          },
          legend: {
            right: 30,
            data: ['当天', '当月']
          },
          tooltip: {
            padding: 4,
            backgroundColor: '#222',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
              return '<div class="point-title">' + (obj.seriesIndex === 1 ? '当天' : '当月') + '</div>' + `告警数量：${obj.data[1]}`;
            }
          },
          xAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            name: '点',
            nameGap: 5,
            axisLabel: {
              formatter: (value, index) => {
                if (value < 10) {
                  return '0' + value;
                }
                return value;
              }
            },
            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
          },
          yAxis: {
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            name: '告警数量',
            minInterval: 1,
            scale: true
          },
          series: [
            {
              name: '当月',
              data: [],
              type: 'scatter',
              symbolSize: function (data) {
                return data[1] * 8 < 30 ? data[1] * 8 : 30;
              },
              itemStyle: {
                normal: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(25, 100, 150, 0.5)',
                  shadowOffsetY: 5,
                  color: 'rgb(129, 227, 238)'
                }
              }
            },
            {
              name: '当天',
              data: [],
              type: 'scatter',
              symbolSize: function (data) {
                return data[1] * 8 < 30 ? data[1] * 8 : 30;
              },
              itemStyle: {
                normal: {
                  shadowBlur: 10,
                  shadowColor: 'rgba(120, 36, 50, 0.5)',
                  shadowOffsetY: 5,
                  color: 'rgb(251, 118, 123)'
                }
              }
            }
          ]
        }
      };
    },
    mounted() {
      this.queryData();
    },
    methods: {
      queryData() {
        this.$http('/index/gainWarnEventStatus').then(res => {
          if(res.data.code === 200) {
            let {series} = this.options;
            series[1].data = res.data.data.dayList.map(m => [m.statTime, m.statVal]);
            series[0].data = res.data.data.monthList.map(m => [m.statTime, m.statVal]);
            if (!this.cycle) return;
            this.setTimes(setTimeout(this.queryData, this.cycle));
          }
        });
      }
    }
  };
</script>

