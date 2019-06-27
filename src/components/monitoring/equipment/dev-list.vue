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
  .text-overflow {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
<template>
  <el-row class="dev-list">
    <el-col class="item" :span="12" v-for="item in devItem.details" gut>
      <div class="content">
        <el-row class="mb-10">
          <el-col :span="12">
            <oms-row label="设备" :span="8" class="text-overflow">
              <el-tooltip effect="dark" placement="top" :content="item.name + ' ' + item.no + ' ' + item.type ">
                <i class="el-icon-warning-outline ml-10"/>
                <span>{{item.name}} {{item.no}} {{item.type}}</span>
              </el-tooltip>
            </oms-row>
          </el-col>
          <el-col :span="12" v-show="devItem.status === '1'">
            <oms-row label="更新" :span="6">{{item.time | time}}</oms-row>
          </el-col>
        </el-row>
        <div v-show="devItem.status === '1'">
          <el-row>
            <el-col :span="8">
              <oms-row label="温度" :span="12">
                <span class="fl" :class="{'text-danger': item.alarm.includes('0')}">{{item.temp}} ℃</span>
                <el-tooltip effect="dark" placement="top" :content="'温度范围：' + item.tempScope.join('~') + '℃'">
                  <i class="el-icon-warning-outline ml-10"/>
                </el-tooltip>
              </oms-row>
            </el-col>
            <el-col :span="8">
              <oms-row label="湿度" :span="12">
                <span class="fl" :class="{'text-danger': item.alarm.includes('1')}">{{item.humidity}} %</span>
                <el-tooltip effect="dark" placement="top" :content="'湿度范围：' + item.humidityScope.join('~') + '%'">
                  <i class="el-icon-warning-outline ml-10"/>
                </el-tooltip>
              </oms-row>
            </el-col>
            <el-col :span="8">
              <oms-row label="电压" :span="12" :class="{'text-danger': item.alarm.includes('2')}">
                <span class="fl">{{item.voltage}} V</span>
                <el-tooltip effect="dark" placement="top" :content="'电压范围：' + item.voltageScope.join('~') + 'V'">
                  <i class="el-icon-warning-outline ml-10"/>
                </el-tooltip>
                <!--<span class="fr">[{{item.voltageScope.join('~')}} V]</span>-->
              </oms-row>
            </el-col>
          </el-row>
        </div>
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
