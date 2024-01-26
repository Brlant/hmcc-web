<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="冷链设备" name="first">
        <cool-dev></cool-dev>
      </el-tab-pane>
      <el-tab-pane label="医疗设备" name="second">
        <healths></healths>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CoolDev from '../cool';
import Healths from '../healths';

export default {
  name: "devHos",
  components: {
    CoolDev,
    Healths
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
