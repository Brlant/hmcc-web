<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="网关管理" name="first" v-if="hasPerm('gateway-dev-scan')">
      <gateway/>
    </el-tab-pane>
    <el-tab-pane label="基站管理" name="second" v-if="hasPerm('basestation-view')">
      <base-station/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import Gateway from './gateway';
import BaseStation from './basestation';
import CommonMixin from '@/mixins/commonMixin'

export default {
  name: 'GatewayBase',
  components: {
    Gateway,
    BaseStation
  },
  mixins: [CommonMixin],
  data() {
    return {
      activeName: this.hasPerm('gateway-dev-scan') ? '0' : '1'
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
