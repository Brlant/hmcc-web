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
    <div class="totalNumberDevices">
      <div class="deviceStyle">
        <span>设备总数</span>
        <span class="deviceStyleNumber">{{ totalNumberDevices.totalCount }}</span>
      </div>
      <div class="vertical-line"></div>
      <div class="deviceStyle">
        <span>开机数</span>
        <span class="deviceStyleNumber">{{ totalNumberDevices.onlineCount }}</span>
      </div>
      <div class="vertical-line"></div>
      <div class="deviceStyle">
        <span>关机数</span>
        <span class="deviceStyleNumber">{{ totalNumberDevices.offlineCount }}</span>
      </div>
      <div class="vertical-line"></div>
      <div class="deviceStyle">
        <span>异常数</span>
        <span class="deviceStyleNumber">{{ totalNumberDevices.alarmCount }}</span>
      </div>
      <div class="vertical-line"></div>
      <div class="deviceStyle">
        <span>故障数</span>
        <span class="failureNumber">{{ totalNumberDevices.ailure }}</span>
      </div>
    </div>
    <!--    表格-->
    <el-table v-loading="loading" :data="dataList" style="width: 100%">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="设备名称" prop="devName" align="center"></el-table-column>
      <el-table-column label="设备编号" prop="devNo" align="center"></el-table-column>
      <el-table-column label="设备分类" prop="devType" align="center">
        <template v-slot="{row}">
          <div v-for="(item,index) in deviceTypeList" :key="index">
            <span v-if="row.devType===item.value">{{ item.label }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属科室" prop="departmentName" align="center"></el-table-column>
      <el-table-column label="定位标签" prop="tagSnNumber" align="center"></el-table-column>
      <el-table-column label="能耗标签" prop="energyTagSnNumber" align="center"></el-table-column>
      <el-table-column label="运行状态" prop="deviceStatus" align="center">
        <template v-slot="{row}">
          <span v-if="row.deviceStatus === 'ONLINE'" style="color: green">开机</span>
          <span v-if="row.deviceStatus === 'OFFLINE'" style="color: grey">关机</span>
          <span v-if="row.deviceStatus === 'ALARM'" style="color: red">异常</span>
          <span v-if="row.deviceStatus === 'FAILURE'" style="color: yellow">故障</span>
        </template>
      </el-table-column>
      <el-table-column label="最后位置" prop="lastPositionStr" align="center">
        <template v-slot="{row}">
          <span v-if="row.lastPositionStr">{{ row.lastPositionStr }}</span>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" prop="" align="center">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" icon="el-icon-location-outline" circle
                     @click="devicesPosition(row)"></el-button>
          <el-button icon="el-icon-search" size="mini" circle @click="detailInfo(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="detailEdit(row)" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="remove(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <!--<component :formItem="form" :statusType="statusType" :index="showIndex" :is="currentPart" @change="change"-->
      <!--           @right-close="resetRightBox"/>-->
      <form-msg :addEditVisible="addEditVisible" :titleDetail="titleDetail" @closeDetail="closeDetail"
                :detailForm="detailForm" :edit="edit"></form-msg>
    </page-right>
  </div>
</template>

<script>
import filesApi from '@/api/files/files'
import queryApi from '@/api/query/query'
import formMsg from './formMsg'
import SearchPart from './search'
import CommonMixin from '@/mixins/commonMixin';

export default {
  // 医疗设备管理
  name: 'HealthManagement',
  components: {
    formMsg, SearchPart
  },
  mixins: [CommonMixin],
  data() {
    return {
      edit: false,
      addEditVisible: false, //新增编辑弹框
      msgVisible: false,
      titleDetail: '', //弹框名字
      msgDetail: '设备详情',
      //详情信息
      detailForm: {},
      total: 0,
      showSearch: true,
      loading: false,
      queryParams: {
        text: '',              //设备编号和名称
        tagSnNumber: '',       //标签编号
        devType: "",          //设备分类
        departmentId: '',     //所属科室id
        status: "",           //设备状态   在线:ONLINE  不在线:OFFLINE  异常:ALARM
      },
      filters: {
        text: '',              //设备编号和名称
        tagSnNumber: '',       //标签编号
        devType: "",          //设备分类
        departmentId: '',     //所属科室id
        status: "",           //设备状态   在线:ONLINE  不在线:OFFLINE  异常:ALARM
      },
      //楼层
      floorList: [],
      //设备类型
      deviceTypeList: [],
      //所属科室
      deviceDeptList: [],
      //设备状态
      deviceStatusList: [
        // {locate-tag:'开机',value:'ONLINE'},
        // {locate-tag:'关机',value:'OFFLINE'},
        // {locate-tag:'异常',value:'ALARM'},
      ],
      //设备总数
      totalNumberDevices: {
        totalCount: '',     //设备总数
        onlineCount: '',    //开机数
        offlineCount: '',   //关机数
        alarmCount: ''      //异常数
      },
      //页面传参
      deviceQueryStatus: '',
      deviceQueryDepartment: '',
      defaultPageRight: {'width': '700px', 'padding': 0}
    }
  },
  computed: {
    coolDevType() {
      return this.$getDict('coolDevType')
    },
    deviceStatus() {
      return this.$getDict('device_status')
    },
  },
  watch: {
    filters: {
      handler: function (val) {
        this.queryList(1);
      },
      deep: true
    }
  },
  mounted() {
    //接受页面传参数
    this.pageParameters();
    //设备类别
    this.getDeviceTypeList();
    //科室
    this.queryDepartmentList();
    //设备状态
    this.getDeviceStatusList();
    //查询列表
    this.queryList(1);
  },
  methods: {
    searchResult: function (search) {
      this.filters = Object.assign({}, this.filters, search);
    },
    /* 定位 */
    devicesPosition(row) {
      this.$router.push({
        name: 'position',
        params: {...row}
      });
    },
    /* 删除设备 */
    remove(row) {
      this.$confirm('确定删除该设备吗？删除后设备将无法回复，标签将释放', '删除确认', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认删除'
      }).then(() => {
        filesApi.filesDeleteList({id: row.id}).then(() => {
          this.$notify.success('删除成功')
          this.queryList(1)();
        })
      }).catch(err => {
      });
    },
    /* 查看详情 */
    detailInfo(row) {
      filesApi.filesDetailList({id: row.id}).then(res => {
        if (res.code === 200) {
          this.addEditVisible = true;
          this.detailForm = res.data
          this.edit = false;
        }
      }).catch(err => {

      })
    },
    detailEdit(row) {
      filesApi.filesDetailList({id: row.id}).then(res => {
        if (res.code === 200) {
          this.addEditVisible = true;
          this.detailForm = res.data
          this.edit = true;
        }
      }).catch(err => {

      })
    },
    //设备档案
    addEditFiles() {
      this.addEditVisible = true;
      this.titleDetail = '添加设备'
      this.edit = true;
    },
    //关闭弹框
    closeDetail() {
      this.addEditVisible = false;
      this.titleDetail = '';
      this.queryParams.pageSize = 10;
      this.queryParams.pageNo = 1;
      this.queryList(1);
    },
    closeMsgDetail() {
      this.msgVisible = false;
      this.queryList(1);
    },
    //所属科室
    queryDepartmentList() {
      queryApi.queryDepartment({}).then(res => {
        this.departmentId = []
        this.deviceDeptList = res.data.map(item => {
          return {
            departmentName: item.departmentName,
            departmentPosition: item.departmentPosition,
            id: item.id,
            departmentId: item.id
          }
        })
      })
    },
    //页面传参
    pageParameters() {
      if (this.$route.query.status || this.$route.query.departmentId) {
        this.deviceQueryStatus = this.$route.query.status;
        if (this.$route.query.departmentId) {
          this.deviceQueryDepartment = Number(this.$route.query.departmentId);
        }

        this.queryParams.departmentId = this.deviceQueryDepartment;
        this.queryParams.status = this.deviceQueryStatus;

        this.queryList(1);
      }
    },
    //区分设备编号和名称
    handDevMsg(row) {
      let reg = /^[0-9]+.?[0-9]*/;
      if (reg.test(row)) {
        this.queryParams.devNo = row;
        this.queryParams.devName = '';
      } else {
        this.queryParams.devName = row;
        this.queryParams.devNo = '';
      }
    },
    queryList(pageNo) {
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.queryParams);

      this.loading = true;
      queryApi.queryDevice(params).then(res => {
        this.loading = false;
        this.dataList = res.data.pageInfo.list
        this.pager.count = res.data.pageInfo.total;

        this.totalNumberDevices.totalCount = res.data.totalCount
        this.totalNumberDevices.onlineCount = res.data.onlineCount;
        this.totalNumberDevices.offlineCount = res.data.offlineCount;
        this.totalNumberDevices.alarmCount = res.data.alarmCount;

        this.loading = false;
      }).catch(err => {
        this.loading = false;
      })
    },
    add() {
      this.form = {};
      this.showPart(0);
    },
    edit(item) {
      this.currentItem = item;
      this.currentItemId = item.id;
      this.form = item;
      this.showPart(0);
    },
    showItemDetail(item) {
      this.currentItem = item;
      this.currentItemId = item.id;
      this.showPart(1);
      this.defaultPageRight.width = '900px';
      this.$nextTick(() => {
        this.form = item;
      });
    },
    change() {
      this.resetRightBox();
      this.queryList(this.pager.currentPage);
    }
  }
}
</script>

<style scoped>
.totalNumberDevices {
  display: flex;
  margin: 10px 0;
}

.deviceStyle {
  margin-right: 30px;
}

.deviceStyleNumber {
  margin-left: 20px;
}

.vertical-line {
  margin: 4px 40px 0 0;
  width: 1px;
  height: 15px;
  background-color: grey;
}

</style>
