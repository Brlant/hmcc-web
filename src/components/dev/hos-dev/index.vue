<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="冷链设备" name="0" v-if="hasPerm('freezer-dev-scan')">
      <cool-dev></cool-dev>
    </el-tab-pane>
    <el-tab-pane label="医疗设备" name="1" v-if="hasPerm('medical-dev-scan')">
      <healths></healths>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import CoolDev from './cool';
import Healths from './medical';
import Perm from '@/components/common/perm'
import CommonMixin from '@/mixins/commonMixin'

export default {
  // 院内设备管理
  name: "HosDev",
  components: {
    Perm,
    CoolDev,
    Healths
  },
  mixins: [CommonMixin],
  data() {
    return {
      activeName: this.hasPerm('freezer-dev-scan') ? '0' : '1'
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
