<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="冷链标签" name="0" v-if="hasPerm('sensor-manager')">
      <cool-tag/>
    </el-tab-pane>
    <el-tab-pane label="定位标签" name="1" v-if="hasPerm('locate-label')">
      <locate-tag/>
    </el-tab-pane>
    <el-tab-pane label="能耗标签" name="2" v-if="hasPerm('energy-consumption-label')">
      <energy-tag/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import LocateTag from './locate-tag';
import CoolTag from './cool-tag';
import EnergyTag from './energy-tag';
import CommonMixin from '@/mixins/commonMixin'


export default {
  // 物联网标签管理
  name: 'IotTag',
  components: {
    LocateTag,
    CoolTag,
    EnergyTag
  },
  mixins: [CommonMixin],
  data() {
    return {
      activeName: this.hasPerm('sensor-manager') ? '0' : (this.hasPerm('locate-label') ? '1' : '2')
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    }
  }
}
</script>

<style scoped>

</style>
