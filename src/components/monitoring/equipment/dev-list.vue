<style lang="scss" scoped>
.dev-list {
  margin-top: 10px;
}

.dev-list {
  display: flex;
  //justify-content: space-between;

  .item {
    //display: flex;
    padding: 0 10px;

    .content {
      display: flex;
      background: #f2f6fc;
      border-radius: 4px;
      padding: 5px;
      align-items: center; /* 垂直居中 */
      justify-content: center; /* 水平居中 */
      place-content: center;
      .left {

        width:60px; /* 左边固定宽度 */
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: #F2A3A5;
        color: #ffffff;
        border-radius: 50%;
      }

      .right {
        flex: 1; /* 右边区域自适应 */
      }
    }
  }

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }
}

.high-color {
  color: red;
}

.low-color {
  color: blue;
}
</style>
<template>
  <div style="padding: 0 10px">
    <el-row class="dev-list" v-for="(row,index) in rowList" :key="index" :gutter="10">
      <el-col class="item" :span="12" :key="i+'_'+item.id" v-for="(item,i) in row">
        <div class="content">
          <div class="left" v-show="item.offline">
            离线
          </div>
          <div class="right">
            <el-row>
              <el-col :span="16">
                <oms-row label="冷链标签" :span="5">
                  <el-tooltip effect="dark" placement="top">
                    <div slot="content">
                      <div>名称：{{ item.name }}</div>
                      <div>编号：{{ item.no }}</div>
                      <div>型号：{{ item.type }}</div>
                    </div>
                    <div class="text-overflow">
                      <el-tag type="danger" v-if="item.alarmTypeSet.includes('6')">离线</el-tag>
                      {{ item.name }}（{{ item.no }}）
                    </div>
                  </el-tooltip>
                </oms-row>
              </el-col>
              <el-col :span="8">
                <oms-row label="温度类型" :span="10">
                  {{ item.temperatureType === '0' ? '冷藏' : '冷冻' }}
                </oms-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <oms-row label="更新" :span="10">
                  <template v-if="item.lastUpdateTime">
                    {{ item.lastUpdateTime | time }}
                  </template>
                  <template v-else>暂未更新</template>
                </oms-row>
              </el-col>
              <el-col :span="8">
                <oms-row label="湿度" :span="10">
                  <template v-if="item.humidity !== null">
                    <span>{{ item.humidity }} %</span>
                    <i class="el-icon-bottom low-color" v-if="item.alarmTypeSet.includes('2')"/>
                    <i class="el-icon-top high-color" v-if="item.alarmTypeSet.includes('3')"/>
                    <el-tooltip v-if="item.humidityMin !== null && item.humidityMax !== null"
                                effect="dark" placement="top"
                                :content="`湿度范围：${item.humidityMin}~${item.humidityMax}%`">
                      <i class="el-icon-t-question ml-10"/>
                    </el-tooltip>
                  </template>
                  <template v-else>暂无数据</template>
                </oms-row>
              </el-col>
              <el-col :span="8">
                <oms-row label="电压" :span="10">
                  <template v-if="item.voltage !== null">
                    <span>{{ item.voltage }} %</span>
                    <i class="el-icon-bottom low-color" v-if="item.alarmTypeSet.includes('4')"/>
                    <i class="el-icon-top high-color" v-if="item.alarmTypeSet.includes('5')"/>
                    <el-tooltip v-if="item.voltageMin !== null && item.voltageMax !== null"
                                effect="dark" placement="top"
                                :content="`电压范围：${item.voltageMin}~${item.voltageMax}%`">
                      <i class="el-icon-t-question ml-10"/>
                    </el-tooltip>
                  </template>
                  <template v-else>暂无数据</template>
                </oms-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <oms-row label="温度" :span="10">
                  <template v-if="item.temperature !== null">
                    <strong :style="temperatureStyle(item)">{{ item.temperature }} ℃</strong>
                    <i class="el-icon-bottom low-color" v-if="item.alarmTypeSet.includes('0')"/>
                    <i class="el-icon-top high-color" v-if="item.alarmTypeSet.includes('1')"/>
                    <el-tooltip v-if="item.temperatureMin !== null && item.temperatureMax !== null"
                                effect="dark" placement="top"
                                :content="`温度范围：${item.temperatureMin}~${item.temperatureMax}℃`">
                      <i class="el-icon-t-question ml-10"/>
                    </el-tooltip>
                  </template>
                  <template v-else>
                    暂无数据
                  </template>
                </oms-row>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    devItem: Object
  },
  computed: {
    rowList() {
      if (!this.devItem) {
        return [];
      }

      let sensorDataList = this.devItem.sensorDataList || [];
      // 数据过滤，没有标签的不显示
      return this.rowListHandler(sensorDataList);
    }
  },
  methods: {
    /**
     * 行数据处理：把数据转换一下，每两条放一行
     *
     * @param sensorDataList
     * @returns {*[]}
     */
    rowListHandler(sensorDataList) {
      let rows = [];

      sensorDataList = sensorDataList.filter(item => item.id && item.isOpen);
      if (!sensorDataList) {
        return rows;
      }

      let len = sensorDataList.length;
      let cols = [];
      for (let i = 0; i < len; i++) {
        let item = sensorDataList[i];

        cols.push(item);
        let rowFlag = len === 1 || i % 2 === 1 || i == len - 1;
        if (rowFlag) {
          rows.push(cols)
          cols = [];
        }
      }
      // console.log(rows,'这一行数据');
      return rows;

    },
    temperatureStyle(item) {
      let style = {
        'font-size': '16px'
      }

      let temperature = item.temperature;
      let templateMin = item.temperatureMin;
      let templateMax = item.temperatureMax;
      let alarmType = templateMin != null && templateMax != null;
      if (alarmType) {
        if (temperature < templateMin || temperature > templateMax) {
          style['color'] = 'red';
        } else {
          style['color'] = 'green';
        }
      }

      return style;
    }
  }
};
</script>
