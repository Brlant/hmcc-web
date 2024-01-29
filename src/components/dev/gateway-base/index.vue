<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="网关管理" name="first">
      <gateway/>
    </el-tab-pane>
    <el-tab-pane label="基站管理" name="second">
      <base-station/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Gateway from '../gateway';
import BaseStation from '../basestation';

export default {
  name: 'GatewayBase',
  components: {
    Gateway,
    BaseStation
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
