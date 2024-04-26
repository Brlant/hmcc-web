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
              <td>
                {{ row.alarmTemplateName  }}
              </td>
              <td>
                <span v-if="row.temperatureAlarmFlag === '1'">
                  高：{{ row.temperatureMax }}℃ 低：{{ row.temperatureMin }}℃
                </span>
                <el-tag type="primary" :type="row.temperatureAlarmFlag === '1' ? 'success' : 'warning'">
                  {{ row.temperatureAlarmFlag === '1' ? '开启' : '关闭' }}
                </el-tag>
              </td>
              <td>
                <span v-if="row.humidityAlarmFlag === '1'">
                  高：{{ row.humidityMax }}% 低：{{ row.humidityMin }}%
                </span>
                <el-tag type="primary" :type="row.humidityAlarmFlag ==='1' ? 'success' : 'warning'">
                  {{ row.humidityAlarmFlag === '1' ? '开启' : '关闭' }}
                </el-tag>
              </td>
              <td>
                <span v-if="row.voltageAlarmFlag === '1'"> 高：{{ row.voltageMax }}% 低：{{ row.voltageMin }}%</span>
                <el-tag type="primary" :type="row.voltageAlarmFlag === '1' ? 'success' : 'warning'">
                  {{ row.voltageAlarmFlag === '1' ? '开启' : '关闭' }}
                </el-tag>
              </td>
              <td>
                <el-tag type="primary" :type="row.offLineFlag === '1' ? 'success' : 'warning'">
                  {{ row.offLineFlag === '1' ? '开启' : '关闭' }}
                </el-tag>
              </td>
              <td class="list-op">
                <a v-has="'alarm-template-edit'" href="#" @click.stop.prevent="edit(row)"><i
                  class="el-icon-t-edit"></i>编辑</a>
                <oms-forbid v-has="'alarm-template-stop'"
                            :item="row" @forbided="forbid" :tips='"确认停用模板\""+row.alarmTemplateName+"\"?"'
                            v-show="row.isEnable === 1 ">
                  <i class="el-icon-t-forbidden"></i>停用
                </oms-forbid>
                <oms-forbid v-has="'alarm-template-start'"
                            :item="row" @forbided="useNormal" :tips='"确认启用模板\""+row.alarmTemplateName+"\"?"'
                            v-show="row.isEnable === 0 "><i class="el-icon-t-start" ></i>启用
                </oms-forbid>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="text-center"> <!--v-show="(dataRows.length || pager.currentPage !== 1) && !loadingData"-->
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex" :is="currentPart" @change="change" @right-close="resetRightBox"/>
    </page-right>
  </div>
</template>

<script>
import CommonMixin from '@/mixins/commonMixin';
import addEdit from "@/components/configuration/template/form/addEdit";
import {getMaintenanceApi, updateStatusApi} from "@/api/maintenance/maintenance";
import {queryAlarmRuleTemplate,stopOrStartAlarmRuleTemplate} from "@/api/alarm/template";

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
  watch: {},
  created() {

  },
  mounted() {
    this.getPageList(1);
  },
  methods: {
    //查询列表
    getPageList() {
      let params = Object.assign({}, {
        pageNo: this.pager.currentPage,
        pageSize: this.pager.pageSize,
      });
      queryAlarmRuleTemplate(params).then(response => {
        this.dataRows = response.data.list;
        this.pager.count = response.data.count;
      }).catch(error => {

      })
    },
    //新增
    add() {
      this.form = {};
      this.showPart(0);
    },
    edit(row){
      this.currentItem = row;
      this.currentItemId = row.id;
      this.form = row;
      this.showPart(0);
    },
    //停用
    forbid(item) {
      // stopOrStartAlarmRuleTemplate
      stopOrStartAlarmRuleTemplate({alarmTemplateId:item.alarmTemplateId,isEnable:0}).then(res=>{
        this.$notify.success({
          title: '成功',
          message: '已经停用模板"' + item.alarmTemplateName + '"'
        });
        this.getPageList();
      }).catch(error=>{})
    },
    //启用
    useNormal(item) {
      stopOrStartAlarmRuleTemplate({alarmTemplateId:item.alarmTemplateId,isEnable:1}).then(res=>{
        this.$notify.success({
          title: '成功',
          message: '已经停用模板"' + item.alarmTemplateName + '"'
        });
        this.getPageList();
      }).catch(error=>{})
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
