<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" onsubmit="return false" :inline="true" v-show="showSearch"
             label-width="68px">
      <el-row>
        <el-col :span="22">
          <el-form-item prop="text">
            <el-input
              v-model.trim="queryParams.text"
              placeholder="设备编号/名称"
              clearable>
            </el-input>
          </el-form-item>
          <el-form-item prop="tagSnNumber">
            <el-input
              v-model.trim="queryParams.tagSnNumber"
              placeholder="标签编码"
              clearable>
            </el-input>
          </el-form-item>
          <!--      设备类别-->
          <el-form-item prop="devType">
            <el-select v-model="queryParams.devType" placeholder="设备分类" clearable>
              <el-option
                v-for="(item,index) in deviceTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!--      所属科室-->
          <el-form-item prop="departmentId">
            <el-select v-model="queryParams.departmentId" placeholder="所属科室" clearable>
              <el-option
                v-for="(item,index) in deviceDeptList"
                :key="index"
                :value="item.id"
                :label="item.departmentName"
              />
            </el-select>
          </el-form-item>
          <!--        设备状态-->
          <el-form-item prop="status">
            <el-select placeholder="设备状态" v-model="queryParams.status" clearable>
              <el-option
                v-for="(item,index) in deviceStatusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addEditFiles"
          >设备档案
          </el-button>
        </el-col>
      </el-row>
    </el-form>
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
    </div>
    <!--    表格-->
    <el-table v-loading="loading" :data="dataList">
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
      <el-table-column label="标签编码" prop="tagSnNumber" align="center"></el-table-column>
      <el-table-column label="设备状态" prop="deviceStatus" align="center">
        <template v-slot="{row}">
          <span v-if="row.deviceStatus === 'ONLINE'" style="color: green">开机</span>
          <span v-if="row.deviceStatus === 'OFFLINE'" style="color: grey">关机</span>
          <span v-if="row.deviceStatus === 'ALARM'" style="color: red">异常</span>
        </template>
      </el-table-column>
      <el-table-column label="最后位置" prop="lastPositionStr" align="center"></el-table-column>
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

    <!--    新增编辑弹框-->
    <form-msg :addEditVisible="addEditVisible" :titleDetail="titleDetail" @closeDetail="closeDetail"
              :detailForm="detailForm" :edit="edit"></form-msg>
  </div>
</template>

<script>
import filesApi from '@/api/files/files'
import {sinopharmDictDataType} from '@/api/system/dict/data'
import queryApi from '@/api/query/query'
import formMsg from './formMsg'
import CommonMixin from '@/mixins/commonMixin';

export default {
  name: 'index',
  components: {
    formMsg,
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
      //楼层
      floorList: [],
      //设备类型
      deviceTypeList: [],
      //所属科室
      deviceDeptList: [],
      //设备状态
      deviceStatusList: [
        // {label:'开机',value:'ONLINE'},
        // {label:'关机',value:'OFFLINE'},
        // {label:'异常',value:'ALARM'},
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
    }
  },
  created() {
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
  mounted() {

  },
  methods: {
    /* 定位 */
    devicesPosition(row){
      this.$router.push({
        name:'position',
        params: { ...row }
      });
      // queryApi.queryAddressPos({deviceId:row.id}).then(res=>{
      //   if(res.data.length>0){
      //     this.$router.push({
      //       path:'/equipmap/position',
      //       query:{
      //         deviceId:Number(res.data[0].deviceId),
      //         devName:res.data[0].devName,
      //         devNo:res.data[0].devNo,
      //         }
      //     })
      //   }else{
      //     return this.$notify.info('不存在设备位置信息')
      //   }
      //
      // }).catch(err=>{})
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
    //设备状态：故障：FAILURE
    getDeviceStatusList() {
      sinopharmDictDataType('device_status').then(res => {
        this.deviceStatusList = res.data.map(item => {
          return {
            label: item.label,
            value: item.key
          }
        })
      }).catch(err => {

      })
    },
    //设备类别
    getDeviceTypeList() {
      sinopharmDictDataType('device_type').then(res => {
        this.deviceTypeList = res.data.map(item => {
          return {
            label: item.label,
            value: item.key
          }
        })
      }).catch(err => {

      })
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
    /* 搜索 */
    search() {
      this.queryParams.pageNo = 1;
      this.queryList(1);
    },
    /* 重置 */
    reset() {
      this.queryParams.pageNo = 1;
      this.$refs.queryForm.resetFields();
      this.queryParams.dev = '';
      this.queryParams.devNo = '';
      this.queryParams.devName = ''
      this.queryParams.status = ''
      this.queryParams.devType = ''
      this.queryParams.floorId = ''
      this.queryParams.departmentId = ''
      if (this.$route.query) {
        this.$router.push({
          path: this.$route.path,
          query: {}
        });
      }
      this.queryList(1);
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
