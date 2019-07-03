<template>

  <e-charts
    :autoResize="true" :options="options"
    ref="chart" theme="light"></e-charts>

</template>

<script>
  import TimeMixins from '@/mixins/timeMixin';
  export default {
    mixins: [TimeMixins],
    name: 'equipmentChart',
    data() {
      return {
        cycle: 0,
        options: {
          title: {
            text: '冷链设备组成'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          series: [
            {
              name: '冷链设备组成',
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
    computed: {
      coolDevType() {
        return this.$getDict('coolDevType');
      }
    },
    mounted() {
      this.queryData();
    },
    methods: {
      getLabel(key) {
        let item = this.coolDevType.find(f => f.key === key) || {};
        return item.label;
      },
      queryData() {
        this.$http('/index/gainFreezerDevComposition').then(res => {
          if(res.data.code === 200) {
            let data = res.data.data;
            this.options.series[0].data = Object.keys(data).map(m => ({
              value: data[m],
              name: this.getLabel(m)
            }));
            console.log(this.options.series[0].data);
            if (!this.cycle) return;
            this.setTimes(setTimeout(this.queryData, this.cycle));
          }
        });
      }
    }
  };
</script>

