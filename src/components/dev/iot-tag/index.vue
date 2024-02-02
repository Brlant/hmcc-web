<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="冷链标签" name="first">
      <probe-label/>
    </el-tab-pane>
    <el-tab-pane label="定位标签" name="second">
      <locate-label/>
    </el-tab-pane>
    <el-tab-pane label="能耗标签" name="three">
      <energy-consumption-label/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import LocateLabel from './label';
import ProbeLabel from './probe';
import EnergyConsumptionLabel from './EnergyConsumptionLabel';

export default {
  // 物联网标签管理
  name: 'IotTagManagement',
  components: {
    LocateLabel,
    ProbeLabel,
    EnergyConsumptionLabel
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  }
}
</script>

<style scoped>

</style>
