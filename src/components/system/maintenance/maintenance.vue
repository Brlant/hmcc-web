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
          <des-btn class="add-right" v-has="'system-setting-maintenance-type-add'" icon="plus" @click="add"></des-btn>
          <!--          表格范围-->
          <table class="table table-hover">
            <thead>
            <tr>
              <th>模板名称</th>
              <th>设备类型</th>
              <th>创建时间</th>
              <th></th>
            </tr>
            </thead>
            <!--            列表内容-->
            <tbody>
            <tr v-if="loadingData">
              <td colspan="4">
                <oms-loading :loading="loadingData"></oms-loading>
              </td>
            </tr>
            <tr v-else-if="dataRows.length === 0">
              <td colspan="4">
                <div class="empty-info">
                  暂无信息
                </div>
              </td>
            </tr>
            <tr v-else v-for="row in dataRows" :keys="row.id">
              <td>
                {{row.templateName || '暂无信息'}}
              </td>
              <td>
                {{ equipmentHospitalDeviceType[row.hospitalDeviceType] || '暂无信息'}}
              </td>
              <td>
                {{ row.createTime | time}}
              </td>
              <td class="list-op">
                <a v-has="'system-setting-account-manager-edit'" href="#" @click.stop.prevent="edit(row)"><i
                  class="el-icon-t-edit"></i>编辑</a>
                <oms-forbid v-has="'system-setting-account-manager-stop'"
                            :item="row" @forbided="forbid" :tips='"确认停用模板\""+row.templateName+"\"?"'
                            v-show="row.status === 1 ">
                  <i class="el-icon-t-forbidden"></i>停用
                </oms-forbid>
                <oms-forbid v-has="'system-setting-account-manager-start'"
                            :item="row" @forbided="useNormal" :tips='"确认启用模板\""+row.templateName+"\"?"'
                            v-show="row.status === 0 "><i class="el-icon-t-start" ></i>启用
                </oms-forbid>
              </td>
            </tr>

            </tbody>
          </table>

          <!--          <div class="text-center" v-show="pager.count>pager.pageSize">-->
          <!--            <el-pagination-->
          <!--              layout="prev, pager, next"-->
          <!--              :total="pager.count" :pageSize="pager.pageSize" @current-change="getPageList"-->
          <!--              :current-page="pager.currentPage">-->
          <!--            </el-pagination>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <add-edit :title="formTitle" :action="action"
                :actionType="showRight" @close="showRight=false"
                :formData="formData" @handlerRefresh="handlerRefresh"></add-edit>
    </page-right>
  </div>
</template>

<script>
import addEdit from './form/form.vue'
import {getMaintenanceApi,getMaintenanceDetailApi,updateStatusApi} from "@/api/maintenance/maintenance";
import {User} from "@/resources";
import {sinopharmDictDataType} from "@/api/system/dict/data";

export default {
  name: "maintenance",
  components: {
    addEdit
  },
  data() {
    return {
      showRight: false,
      formTitle: '新增',
      loadingData: false,
      dataRows: [],
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      action: 'add',
      equipmentHospitalDeviceType:{},
      formData:{},
    }
  },
  mounted() {
    this.getPageList();
    this.getDeviceTemplateType();
  },
  methods: {
    handlerRefresh(){
      this.getPageList();
      this.showRight = false;
    },
    getDeviceTemplateType() {
      sinopharmDictDataType('hospitalDeviceType').then(res => {
        res.data.forEach(item => {
          this.$set(this.equipmentHospitalDeviceType, item.key, item.label);
        });
      });
    },
    //关闭弹框
    resetRightBox: function () {
      this.showRight = false;
    },
    //新增
    add() {
      this.action = 'add';
      this.formTitle = '新增';
      this.formData = {};
      this.showRight = true;
    },
    getPageList() {
      getMaintenanceApi().then(res => {
        this.dataRows = res.data;
      }).catch(err => {})
    },
    //编辑
    edit(row) {
      getMaintenanceDetailApi(row.id).then(res=>{
        this.formData = {
          id:res.data.id,
          templateName:res.data.templateName,
          hospitalDeviceType:res.data.hospitalDeviceType,
          maintenanceInterposeDetailList:res.data.maintenanceInterposeDetailList,
        }
        // console.log(this.formData,'详情信息');
      }).catch(err=>{})
      this.action = 'edit';
      this.formTitle = '编辑';
      this.showRight = true;
    },
    //停用
    forbid(item) {
      updateStatusApi({id:item.id,status:0}).then(res=>{
        this.$notify.success({
          title: '成功',
          message: '已经停用模板"' + item.templateName + '"'
        });
        this.getPageList();
      }).catch(error=>{})
    },
    //启用
    useNormal(item) {
      updateStatusApi({id:item.id,status:1}).then(res=>{
        this.$notify.success({
          title: '成功',
          message: '已经启用模板"' + item.templateName + '"'
        });
        this.getPageList();
      }).catch(error=>{})
    },
  }
}
</script>

<style scoped>

</style>
