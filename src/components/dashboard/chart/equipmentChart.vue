<template>

  <e-charts
    :autoResize="true" :options="options"
    ref="chart" theme="light"></e-charts>

</template>

<script>
  export default {
    name: 'equipmentChart',
    data() {
      return {
        cycle: 0,
        options: {
          title: {
            text: '设备类型组成'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          // legend: {
          //   orient: 'vertical',
          //   x: 'left',
          //   data: ['有线温度', '无线温度', '冷柜温度', '车载温度']
          // },
          series: [
            {
              name: '设备类型组成',
              type: 'pie',
              radius: ['40%', '80%'],
              center: ['50%', '60%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: true,
                  position: 'inner'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '30',
                    fontWeight: 'bold'
                  }
                }
              },
              data: []
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
        this.$http('/ccsIndex/gainDevComposition').then(res => {
          this.options.series[0].data = [
            {value: res.data[0], name: '有线温度计'},
            {value: res.data[1], name: '无线温度计'},
            {value: res.data[2], name: '冷柜温度计'},
            {value: res.data[3], name: '车载温度计'},
            {value: res.data[4] ? res.data[4] : 0, name: '温度计'}
          ];
          if (!this.cycle) return;
          this.$parent.setTimes(setTimeout(this.queryData, this.cycle));
        });
      }
    }
  };
</script>

