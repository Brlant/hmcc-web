<style lang="scss" scoped>
  .dev-list {
    margin-top: 10px;
  }

  .dev-list {
    display: flex;
    justify-content: space-between;

    .item {
      padding: 0 10px;

      .content {
        background: #f2f6fc;
        border-radius: 4px;
        padding: 5px;
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
  <el-row class="dev-list">
    <el-col class="item" :span="12" :key="item.id" v-for="item in devItem.sensorDataList">
      <div class="content">
        <el-row>
          <el-col :span="16">
            <oms-row label="探头" :span="5">
              <el-tooltip effect="dark" placement="top">
                <div slot="content">
                  <div>名称：{{item.name}} </div>
                  <div>编号：{{item.no}} </div>
                  <div>型号：{{item.type}}</div>
                </div>
                <div class="text-overflow">
                  <el-tag type="danger" v-if="item.alarmTypeSet.includes('6')">离线</el-tag>
                  {{item.name}}（{{item.no}}）
                </div>
              </el-tooltip>
            </oms-row>
          </el-col>
          <el-col :span="8">
            <oms-row label="温度类型" :span="16">
              {{item.temperatureType === '0' ? '冷藏' : '冷冻'}}
            </oms-row>
          </el-col>
        </el-row>
        <el-row style="padding-left: 2px">
          <el-col :span="8">
            <oms-row label="温度" :span="10">
              <template v-if="item.temperature !== null">
                <i class="el-icon-bottom low-color" v-if="item.alarmTypeSet.includes('0')"/>
                <i class="el-icon-top high-color" v-if="item.alarmTypeSet.includes('1')"/>
                <span>{{item.temperature}} ℃</span>
                <el-tooltip v-if="item.temperatureMin !== null && item.temperatureMax !== null"
                            effect="dark" placement="top" :content="`温度范围：${item.temperatureMin}~${item.temperatureMax}℃`">
                  <i class="el-icon-t-question ml-10"/>
                </el-tooltip>
              </template>
              <template v-else>
                暂无数据
              </template>
            </oms-row>
          </el-col>
          <el-col :span="8">
            <oms-row label="湿度" :span="10">
              <template v-if="item.humidity !== null">
                <i class="el-icon-bottom low-color" v-if="item.alarmTypeSet.includes('2')"/>
                <i class="el-icon-top high-color" v-if="item.alarmTypeSet.includes('3')"/>
                <span>{{item.humidity}} %</span>
                <el-tooltip v-if="item.humidityMin !== null && item.humidityMax !== null"
                            effect="dark" placement="top" :content="`湿度范围：${item.humidityMin}~${item.humidityMax}%`">
                  <i class="el-icon-t-question ml-10"/>
                </el-tooltip>
              </template>
              <template v-else>暂无数据</template>
            </oms-row>
          </el-col>
          <el-col :span="8">
            <oms-row label="电压" :span="10">
              <template v-if="item.voltage !== null">
                <i class="el-icon-bottom low-color" v-if="item.alarmTypeSet.includes('4')"/>
                <i class="el-icon-top high-color" v-if="item.alarmTypeSet.includes('5')"/>
                <span>{{item.voltage}} %</span>
                <el-tooltip v-if="item.voltageMin !== null && item.voltageMax !== null"
                            effect="dark" placement="top" :content="`电压范围：${item.voltageMin}~${item.voltageMax}%`">
                  <i class="el-icon-t-question ml-10"/>
                </el-tooltip>
              </template>
              <template v-else>暂无数据</template>
            </oms-row>
          </el-col>
        </el-row>
        <el-row v-show="item.lastUpdateTime">
          <el-col :span="16">
            <oms-row label="更新" :span="5">{{item.lastUpdateTime | time}}</oms-row>
          </el-col>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    props: {
      devItem: Object
    }
  };
</script>
