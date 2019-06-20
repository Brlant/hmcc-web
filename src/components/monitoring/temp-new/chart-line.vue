<style scoped="">
  .chart-Line {
    height: 400px;
    width: 100%;
    background: #fff;
  }
</style>
<template>
  <div>
    <!--<div v-if="!dataList || !dataList.length" class="empty-info">暂无信息</div>-->
    <oms-loading v-if="loadingData" :loading="loadingData"/>
    <div v-else-if="!dataList.length" class="empty-info">暂无信息</div>
    <e-charts ref="echart" v-else :options="option" theme="light" class="chart-Line"></e-charts>
  </div>
</template>
<script>
  const unitAry = ['', '°C', '%', 'V'];
  const titleAry = ['', '温度', '湿度', '电压'];
  import {TempDev} from '@/resources';

  export default {
    props: ['filters', 'isRecord', 'detail'],
    data() {
      return {
        loadingData: false,
        dataList: [],
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
          yAxis: [
            {
              name: '温度',
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
            }
          ],
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
        }
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.queryList();
        },
        deep: true
      },
      dataList: {
        handler: function (val) {
          let {option} = this;
          if (!val.length) return;
          option.series = val;
        },
        deep: true
      }
    },
    methods: {
      setLegend(typeList) {
        let {option} = this;
        option.legend.data = typeList.map(m => titleAry[m]);
      },
      setYAxis(typeList) {
        let {option, setMaxAndMin} = this;
        option.yAxis = typeList.map((m, index) => {
          let obj = {
            name: titleAry[m] + `(${unitAry[m]})`,
            offset: index === 2 ? 50 : 0,
            type: 'value'
          };
          setMaxAndMin(obj, m);
          return obj;
        });
      },
      setMaxAndMin(obj, type) {
        if (type === '1') {
          obj.min = value => value.min;
          obj.max = value => value.max;
        } else if (type === '2') {
          obj.min = value => value.min;
          obj.max = value => value.max;
        } else {
          obj.max = function (value) {
            return value.max !== Infinity
              ? value.max + value.max > 10 ? 10 : 5
              : '';
          };
          obj.min = function (value) {
            let v = value.min - value.min > 10 ? 10 : 5;
            return value.min !== Infinity
              ? v > 0 ? v : 0
              : value.min;
          };
        }
      },
      getData(data, type, index) {
        let {option} = this;
        return {
          name: titleAry[type],
          type: 'line',
          showSymbol: true,
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
      queryList() {
        const {startTime, endTime, devId, devCode, valType} = this.filters;
        let {setLegend, setYAxis, getData} = this;
        this.dataList = [];
        if (!devCode) return;
        const typeList = valType.filter(f => f !== '4');
        // 设置图例
        setLegend(typeList);
        // 设置Y轴
        setYAxis(typeList);
        typeList.forEach((i, index) => {
          const params = {startTime, endTime, devId, devCode, valType: i};
          this.loadingData = true;
          TempDev.queryTempData(params).then(res => {
            const data = res.data.ccsDevDataRecordDTOList.map(m => {
              return {
                name: m.createTime,
                value: [m.createTime, m.devActval]
              };
            });
            // 设置数据
            this.dataList.push(getData(data, i, index));
            let {isRecord, detail} = this;
            if (isRecord && this.dataList.length) {
              const data = this.dataList[0].markLine.data;
              if (data.length > 1) return;
              data.push(
                {
                  xAxis: detail.createTime,
                  label: {
                    formatter: obj => {
                      return this.$moment(obj.value).format('HH:mm:ss');
                    }
                  },
                  lineStyle: {
                    color: 'red'
                  }
                }
              );
              detail.restoreTime && data.push(
                {
                  xAxis: detail.restoreTime,
                  label: {
                    formatter: obj => {
                      return this.$moment(obj.value).format('HH:mm:ss');
                    }
                  },
                  lineStyle: {
                    color: 'red'
                  }
                }
              );
            }
            this.loadingData = false;
          });
        });
      }
    }
  };
</script>
