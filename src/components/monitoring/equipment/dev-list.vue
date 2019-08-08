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
</style>
<template>
  <el-row class="dev-list">
    <el-col class="item" :span="12" :key="item.id" v-for="item in devItem.sensorDataList">
      <div class="content">
        <el-row >
          <el-col :span="12">
            <oms-row label="设备" :span="8">
              <el-tooltip effect="dark" placement="top" :content="item.name + ' ' + item.no + ' ' + item.type ">
                <div class="text-overflow">{{item.name}} {{item.no}} {{item.type}}</div>
              </el-tooltip>
            </oms-row>
          </el-col>
          <el-col :span="12">
            <oms-row label="温度类型" :span="12">
              {{item.temperatureType === '0' ? '冷藏' : '冷冻'}}
            </oms-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <oms-row label="温度" :span="12">
              <template v-if="item.temperature !== null">
                <span class="fl" :class="{'text-danger': item.alarm}">{{item.temperature}} ℃</span>
                <el-tooltip effect="dark" placement="top" :content="`温度范围：${item.temperatureMin}~${item.temperatureMax}℃`">
                  <i class="el-icon-warning-outline ml-10"/>
                </el-tooltip>
              </template>
              <template v-else>
                暂无数据
              </template>
            </oms-row>
          </el-col>
          <el-col :span="8">
            <oms-row label="湿度" :span="12">
              <template v-if="item.humidity !== null">
                <span class="fl" :class="{'text-danger': item.alarm}">{{item.humidity}} %</span>
                <el-tooltip effect="dark" placement="top" :content="`湿度范围：${item.humidityMin}~${item.humidityMax}%`">
                  <i class="el-icon-warning-outline ml-10"/>
                </el-tooltip>
              </template>
              <template v-else>暂无数据</template>
            </oms-row>
          </el-col>
          <el-col :span="8">
            <oms-row label="电压" :span="12" :class="{'text-danger': item.alarm}">
              <template v-if="item.voltage !== null">
                <span class="fl">{{item.voltage}} V</span>
                <el-tooltip effect="dark" placement="top" :content="`电压范围：${item.voltageMin}~${item.voltageMax}V`">
                  <i class="el-icon-warning-outline ml-10"/>
                </el-tooltip>
              </template>
              <template v-else>暂无数据</template>
            </oms-row>
          </el-col>
        </el-row>
        <el-row v-show="item.lastUpdateTime">
          <el-col :span="12" >
            <oms-row label="更新" :span="8">{{item.lastUpdateTime | time}}</oms-row>
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
    },
  };
</script>
