<style lang="scss">
  .probe-chart {

    .chart-Line {
      height: 400px;
      width: 100%;
      background: #fff;
    }

    .tabs {
      padding-top: 20px;
      text-align: center;
      background: #fff;

      .el-tabs__nav-wrap {
        height: 40px;
      }

      .el-tabs__nav-scroll {
        display: inline-block;
      }
    }
  }
</style>
<template>
  <div class="probe-chart">
    <!--<div v-if="!dataList || !dataList.length" class="empty-info">暂无信息</div>-->
    <oms-loading v-if="loadingData" :loading="loadingData"/>
    <div v-else-if="!isHasData" class="empty-info">暂无信息</div>
    <!--<e-charts ref="echart" v-else :options="option" theme="light" class="chart-Line"></e-charts>-->
    <div v-else>
      <div id="newChartLine" class="chart-Line" :style="{width: chartWidth}"></div>
    </div>
    <el-tabs class="tabs" v-model="activeIndex" v-if="dataDetail.freezerDevId">
      <el-tab-pane :label="item.areaName" :name="index + ''" :key="item.areaId"
                   v-for="(item, index) in probeList"></el-tab-pane>
      <el-table :data="dataList" v-loading="loadingListData" class="header-list" border
                header-row-class-name="headerClass">
        <el-table-column prop="value" :label="title" :sortable="true">
          <template slot-scope="scope">
            <span>{{scope.row.value}} {{unitTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="insertTime" label="采集时间" :sortable="true">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | time}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="数据库存储时间" :sortable="true">
          <template slot-scope="scope">
            <span>{{scope.row.insertTime | time}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="text-center" v-show="dataList.length">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="pager.count" :page-sizes="[10,20,50,100]" :pageSize="pager.pageSize"
          :current-page="pager.currentPage">
        </el-pagination>
      </div>
    </el-tabs>
  </div>
</template>
<script>
  const unitAry = ['', '°C', '%', '%'];
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
        isHasData: false,
        probeList: [],
        activeIndex: '0',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: 10
        },
        dataList: [],
        loadingListData: false,
        oldFilter: {},
        dataDetail: {}
      };
    },
    computed: {
      title() {
        return titleAry[this.filter.type] || '';
      },
      unitTitle() {
        return unitAry[this.filter.type] || '';
      }
    },
    watch: {
      filter: {
        handler: function (val) {
          this.dataDetail = {};
          this.dataList = [];
          this.oldFilter = {};
          if (!val.freezerDevId) {
            this.isHasData = false;
            return;
          }
          if (this.isSame(val, this.oldFilter)) {
            this.setChart();
          } else {
            if (val.startTime === this.oldFilter.startTime && val.endTime === this.oldFilter.endTime
              && val.freezerDevId === this.oldFilter.freezerDevId && val.type !== this.oldFilter.type) {
              this.setChart();
            } else {
              this.queryList();
            }
            this.oldFilter = JSON.parse(JSON.stringify(val));
          }
        },
        deep: true,
        immediate: true
      },
      activeIndex() {
        this.getCurrentList(1);
      }
    },
    methods: {
      isSame(cur, old) {
        if (!old && !cur) return true;
        let cl = Object.keys(cur);
        let ol = Object.keys(old);
        if (cl.length !== ol.length) return false;
        let i = 0;
        while (i <= cl.length) {
          if (cur[cl[i]] !== old[ol[i]]) return false;
          i++;
        }
        return true;
      },
      getLegend(typeList) {
        return {
          data: typeList.map(m => m.areaName)
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
          name: i.areaName,
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
          let str = `采集时间: ${collectTime}<br/>数据库存储时间: ${insertTime}<br/>`;
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
        this.loadingData = true;
        this.isHasData = false;
        this.$http.post('/historical-data', this.filter).then(res => {
          this.loadingData = false;
          this.isHasData = true;
          this.dataDetail = res.data;
          this.setChart();
          this.getCurrentList(1);
        }).catch((e) => {
          this.loadingData = false;
          // this.$notify.error(e.response && e.response.data && e.response.data.msg || '查询失败');
          this.$notify.error(e.response && e.response.data && e.response.data.msg);
        });
      },
      setChart() {
        let {getLegend, getYAxis, getData, getOption, getAlarmLine} = this;
        const option = getOption();
        // 设置图例
        // 设置Y轴
        option.yAxis = getYAxis(this.filter.type);
        option.series = [];
        option.legend = getLegend(this.dataDetail.devAreaDataList);
        this.dataDetail.devAreaDataList.forEach(i => {
          const data = i.dataList.map(m => {
            m.value = this.filter.type === '1' ? m.temperature : this.filter.type === '2' ? m.humidity : m.voltage;
            return {
              name: m.createTime,
              value: [m.createTime, m.value, m.insertTime]
            };
          }) || [];
          option.series.push(getData(data, i));
        });
        this.probeList = this.dataDetail.devAreaDataList;
        this.$nextTick(() => {
          let chartDom = document.getElementById('newChartLine');
          if (!chartDom) return;
          let chartLine = Echarts.init(chartDom, 'light');
          if (!chartLine) return;
          chartLine.setOption(option);
        });
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        this.getCurrentList(1);
      },
      handleCurrentChange(val) {
        this.getCurrentList(val);
      },
      getCurrentList(pageNo) {
        this.loadingListData = true;
        this.pager.currentPage = pageNo;
        const {pager} = this;
        let start = (pageNo - 1) * pager.pageSize;
        let end = pageNo * pager.pageSize;
        let item = this.probeList[this.activeIndex];
        pager.count = item.dataList.length;
        this.dataList = item.dataList.slice(start, end > pager.count ? pager.count : end);
        setTimeout(() => {
          this.loadingListData = false;
        }, 300);
      },
    }
  };
</script>
