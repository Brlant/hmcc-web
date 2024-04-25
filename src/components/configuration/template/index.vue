<style lang="scss" scoped>

.el-form .el-select {
  display: block;
}

.tr-bg {
  :hover {
    background: #fff;
  }
}

.add-right {
  float: right;
}
</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-right">
        <div class="d-table-col-wrap">
          <des-btn class="add-right" v-has="'alarm-template-add'" icon="plus" @click="add"></des-btn>
          <table class="table table-hover">
            <thead>
            <tr>
              <th>模板名称</th>
              <th>温度告警</th>
              <th>湿度告警</th>
              <th>电压告警</th>
              <th>离线告警</th>
              <th></th>
            </tr>
            </thead>
            <!--            列表内容-->
            <tbody>
            <tr v-if="loadingData">
              <td colspan="6">
                <oms-loading :loading="loadingData"></oms-loading>
              </td>
            </tr>
            <tr v-else-if="dataRows.length === 0">
              <td colspan="6">
                <div class="empty-info">
                  暂无信息
                </div>
              </td>
            </tr>
            <tr v-else v-for="row in dataRows" :keys="row.id">

            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingData: false,
      dataRows: [],
    }
  },
  watch:{

  },
  created() {

  },
  mounted() {

  },
  methods:{
  //  新增
    add(){

    },
  }
}
</script>

<style scoped>

</style>
