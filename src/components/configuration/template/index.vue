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
    <div class="text-center" v-show="(dataRows.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex"  :is="currentPart" @change="change"  @right-close="resetRightBox"/>
    </page-right>
  </div>
</template>

<script>
import CommonMixin from '@/mixins/commonMixin';
import addEdit from "@/components/configuration/template/form/addEdit";
import {getMaintenanceApi} from "@/api/maintenance/maintenance";
import { queryAlarmRuleTemplate } from "@/api/alarm/template";

export default {
  mixins: [CommonMixin],
  data() {
    return {
      showRight: false,
      loadingData: false,
      dataRows: [],
      defaultPageRight: {'width': '700px', 'padding': 0},
      dialogComponents: {
        0: addEdit,
      },
    }
  },
  watch:{

  },
  created() {

  },
  mounted() {
    this.getPageList();
  },
  methods:{
    //查询列表
    getPageList() {

    },
   //新增
    add(){
      this.form = {};
      this.showPart(0);
    },
    showPart(index) {
      this.currentPart = this.dialogComponents[index];
      this.$nextTick(() => {
        this.showIndex = index;
      });
    },
    //关闭弹框
    resetRightBox() {
      this.defaultPageRight.width = '700px';
      this.showIndex = -1;
    },
    //
    change() {
      this.resetRightBox();
      this.getPageList();
    }
  }
}
</script>

<style scoped>

</style>
