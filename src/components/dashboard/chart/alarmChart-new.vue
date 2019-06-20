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

  export default {
    name: 'alarmChart',
    data() {
      return {
        cycle: 0,
        options: {
          grid: {
            left: '1%',
            right: '4%',
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
            trigger: 'axis'
            // padding: 4,
            // backgroundColor: '#222',
            // borderColor: '#777',
            // borderWidth: 1,
            // formatter: function (obj) {
            //   return '<div class="point-title">' + (obj.seriesIndex === 0 ? '当天' : '当月') + '</div>' +
            //     `发生时间：${obj.dataIndex}点` + '<br/>' +
            //     `告警数量：${obj.data}`;
            // }
          },
          xAxis: {
            type: 'category',
            data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
            name: '点'
          },
          yAxis: {
            name: '告警数量'
          },
          series: [
            {
              name: '当天',
              data: [],
              type: 'bar',
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
              }
            },
            {
              name: '当月',
              data: [],
              type: 'bar',
              markPoint: {
                data: [
                  {type: 'max', name: '最大值'},
                  {type: 'min', name: '最小值'}
                ]
              },
              markLine: {
                data: [
                  {type: 'average', name: '平均值'}
                ]
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
        this.$http('/ccsIndex/gainWarnRecordStat').then(res => {
          let {series} = this.options;
          let ary1 = new Array(25);
          let ary2 = new Array(25);
          res.data.dayList.forEach(i => {
            ary1[Number(i.statTime)] = i.statVal;
          });
          res.data.monthList.forEach(i => {
            ary2[Number(i.statTime)] = i.statVal;
          });
          series[0].data = ary1;
          series[1].data = ary2;
          if (!this.cycle) return;
          this.$parent.setTimes(setTimeout(this.queryData, this.cycle));
        });
      }
    }
  };
</script>

