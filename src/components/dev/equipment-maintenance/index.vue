<style lang="scss" scoped>
.order-list-status-right {
  justify-content: flex-end;
}
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="permPage.add">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <el-row>
      <el-col :span="13">
        <div class="order-list-status" style="margin-bottom:20px">
          <div v-for="(item,key) in statusType"
               v-show="key < 2"
               :class="{'active':key==activeStatus}" class="status-item"
               @click="changeStatus(item,key)">
            <div :class="['b_color_'+key]" class="status-bg"></div>
            <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{ item.title }}<span
              class="status-num">{{ item.num }}</span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="11">
        <div class="order-list-status  order-list-status-right" style="margin-bottom:20px">
          <div v-for="(item,key) in statusType"
               v-show="key > 1"
               :class="{'active':key==activeStatus}"
               class="status-item" @click="changeStatus(item,key)">
            <div :class="['b_color_'+key]" class="status-bg"></div>
            <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{ item.title }}<span
              class="status-num">{{ item.num }}</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--    列表查询-->
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="1">序号</el-col>
        <el-col :span="3">设备类型</el-col>
        <el-col :span="3">设备名称</el-col>
        <el-col :span="2">维保时间</el-col>
        <el-col :span="3">维保人员</el-col>
        <el-col :span="2">复核人员</el-col>
        <el-col :span="2">单位名称</el-col>
        <el-col :span="3">维保公司</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="!dataList.length">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <!--      渲染列-->
      <div class="order-list-body flex-list-dom" v-else>
        <div :class="[{'active':currentItemId===item.id}]" class="order-list-item order-list-item-bg"
             v-for="item in dataList" @click="showItemDetail(item)">
          <el-row>
            <el-col :span="1" class="R">{{ item.id }}</el-col>
            <el-col :span="3" class="R">{{ item.hospitalDeviceType }}</el-col>
            <el-col :span="3" class="R">{{ item.deviceName }}</el-col>
            <el-col :span="2" class="R">{{ item.maintenanceDate }}</el-col>
            <el-col :span="3" class="R">{{ item.maintenanceUserName }}</el-col>
            <el-col :span="2" class="R">{{ item.reviewUserName }}</el-col>
            <el-col :span="2" class="R">{{ item.orgName }}</el-col>
            <el-col :span="3" class="R">{{ item.companyName }}</el-col>
            <el-col :span="2" class="R">{{ item.status }}</el-col>
            <el-col :span="3" class="R">
<!--              编辑-->
              <el-button type="primary" icon="el-icon-edit" circle size="mini" v-show="item.status === 1"></el-button>
<!--              查看-->
              <el-button type="primary" circle size="mini" >
                <span class="iconfont" style="font-size: 14px">&#xe544;</span>
              </el-button>
<!--              导出-->
              <el-button type="primary" circle size="mini" v-show="item.status === 2">
                <span class="iconfont" style="font-size: 14px">&#xe643;</span>
              </el-button>
<!--              取消-->
              <el-button type="primary" v-has="'dev-equipment-manager-delete'" circle size="mini" v-show="item.status === 1" @click="handleCancel(item)" >
                <span class="iconfont" style="font-size: 14px">&#xe609;</span>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :index="showIndex" :is="currentPart" @right-close="resetRightBox"/>
    </page-right>
  </div>
</template>

<script>
import SearchPart from './search';
import utils from '@/tools/utils';
import addEdit from "@/components/dev/equipment-maintenance/form/addEdit";
import CommonMixin from '@/mixins/commonMixin';
import {
  getDeviceMaintenanceList,
  getDeviceMaintenanceStatus,
  getQueryMaintenanceStatus,
  getCancelMaintenance,
} from "@/api/maintenance/device";
import {deleteBaseStation} from "@/api/hospital/equipment";

export default {
  name: "index",
  components: {
    SearchPart
  },
  mixins: [CommonMixin],
  watch: {
    filters: {
      handler: function () {
        this.getEquipmentList(1);
      },
      deep: true
    },
  },
  data() {
    return {
      filters: {
        deviceName: '',
        startDate: '',
        endDate: '',
        status: 1,
      },
      loadingData: false,
      statusType: utils.equipmentStatus,
      activeStatus: 0,
      dataList: [],
      formData: {},
      defaultPageRight: {'width': '700px', 'padding': 0},

      dialogComponents: {
        0: addEdit,
      },

    }
  },
  computed: {
    perms() {
      return this.$route.meta.perms;
    },
    permPage() {
      return this.$route.meta.permPage;
    }
  },
  mounted() {
    this.getEquipmentList(1);
  },
  methods: {
    //取消
    handleCancel(row){
      this.$confirm('确定取消该行维保单？', '删除', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        getCancelMaintenance(row.id).then(res=>{
          this.$notify.success({
            duration: 2000,
            message: '已取消'
          });
          this.getEquipmentList(1);
        }).catch(error=>{})
      }).catch(error=>{

      });
    },
    showItemDetail(item) {
      this.currentItem = item;
      this.currentItemId = item.id;
    },
    resetRightBox() {
      this.defaultPageRight.width = '700px';
      this.showIndex = -1;
      this.currentItem = {};
      this.currentItemId = '';
    },
    //查询列表
    getEquipmentList(pageNo) {
      let params = {}
      let queryParams = {}
      queryParams = Object.assign({}, this.filters)
      params = Object.assign({}, this.filters, {
        page: this.pager.currentPage,
        size: this.pager.pageSize
      })

      getDeviceMaintenanceList(params).then(res => {
        this.pager.count = res.data.total;
        this.dataList = res.data.list;
      }).catch(error => {
      })

      this.queryStatus(queryParams);
    },
    queryStatus(data) {
      getQueryMaintenanceStatus(data).then(res => {
        let data = res.data;
        this.statusType[0].num = this.optionStatusNum(data['unAuditingCount']);
        this.statusType[1].num = this.optionStatusNum(data['finishAuditingCount']);
        this.statusType[2].num = this.optionStatusNum(data['cancelAuditing']);
      })
    },
    optionStatusNum: function (num) {
      if (typeof num !== 'number') {
        return 0;
      }
      return num;
    },
    searchResult(item) {
      this.filters = Object.assign({}, this.filters, item);
    },
    add() {
      this.formData = {};
      this.showPart(0);
    },
    showPart(index) {
      this.currentPart = this.dialogComponents[index];
      this.$nextTick(() => {
        this.showIndex = index;
      });
    },
    changeStatus: function (item, key) {// 订单分类改变
      this.activeStatus = key;
      this.filters.status = parseInt(item.state);
    },
  }
}
</script>

<style scoped>

</style>
