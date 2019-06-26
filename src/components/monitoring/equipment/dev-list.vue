<style lang="scss" scoped>
  .dev-list {
    margin: 10px 0;
  }
  .dev-list {
    display: flex;
    justify-content: space-between;
    .item {
      width: 40%;
      background: #f2f6fc;
      border-radius: 4px;
      padding: 5px;
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
    <el-col class="item" :span="12" v-for="item in devItem.details" gut>
      <oms-row label="设备">{{item.name}} {{item.no}} {{item.type}}</oms-row>
      <div v-show="devItem.status === '1'">
        <oms-row label="温度">
          <span class="fl" :class="{'text-danger': item.alarm.includes('0')}">{{item.temp}} ℃</span>
          <span class="fr">[{{item.tempScope.join('~')}} ℃]</span>
        </oms-row>
        <oms-row label="湿度">
          <span class="fl" :class="{'text-danger': item.alarm.includes('1')}">{{item.humidity}} %</span>
          <span class="fr">[{{item.humidityScope.join('~')}} %]</span>
        </oms-row>
        <oms-row label="电压" :class="{'text-danger': item.alarm.includes('2')}">
          <span class="fl">{{item.voltage}} V</span>
          <span class="fr">[{{item.voltageScope.join('~')}} V]</span>
        </oms-row>
        <oms-row label="最后更新时间">{{item.time | time}}</oms-row>
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
