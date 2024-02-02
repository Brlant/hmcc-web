<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="冷链标签" name="first">
      <cool-tag/>
    </el-tab-pane>
    <el-tab-pane label="定位标签" name="second">
      <locate-tag/>
    </el-tab-pane>
    <el-tab-pane label="能耗标签" name="three">
      <energy-tag/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import LocateTag from './locate-tag';
import CoolTag from './cool-tag';
import EnergyTag from './energy-tag';

export default {
  // 物联网标签管理
  name: 'IotTagManagement',
  components: {
    LocateTag,
    CoolTag,
    EnergyTag
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
