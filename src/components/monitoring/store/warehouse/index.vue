<style lang="scss" scoped>

  .content-sp {
    overflow: hidden;
    font-size: 14px;
  }

  .d-table > div.d-table-right {
    padding: 0;
  }

  .d-table > div.d-table-left {
    padding-left: 10px;
    padding-right: 0;
    /*.d-table-left_scroll_content {*/
    /*padding-right: 20px;*/
    /*}*/
  }

  .part-bg {
    background: #eee;
    padding-bottom: 10px;
  }

  .p-r-20 {
    padding-left: 20px;
    padding-right: 20px;
  }

  .container.d-table.f-w {
    width: 100%;
  }
</style>
<template>
  <div>
    <div class="container d-table f-w">
      <div class="d-table-left">
        <el-scrollbar tag="div" class="d-table-left_scroll" :style="'height:'+bodyHeight">
          <div class="d-table-left_scroll_content">
            <div v-if="loadingDataWare">
              <oms-loading :loading="loadingDataWare"></oms-loading>
            </div>
            <div v-else-if="warehouseList.length===0" class="empty-info mini">
              暂无信息
            </div>
            <div v-else>
              <el-collapse v-model="accordionId" accordion @change="changeCollapse(item)"
                           v-for="(item, index) in warehouseList" :key="index" class="warehouse-tree">
                <el-collapse-item :name="item.id">
                  <template slot="title">
                  <span class="pull-right list-opera-icon" v-show="activeId === item.id">
                     <des-btn icon="export" v-has="'ccs-warehouse-export'"
                              @click="exportWarehouseTempData(item)"></des-btn>
                     <des-btn icon="edit" v-has="'ccs-warehouse-edit'" @click="editWarehouse(item)"></des-btn>
                    <!--<des-btn icon="delete" v-has="'show'" @click="deleteStore(item, '1')"></des-btn>-->
                     <des-btn icon="plus" v-has="'ccs-warehouse-add'" @click="addArea"></des-btn>
                  </span>
                    {{item.warehouseCode}}
                    <!--<el-tag type="success" v-show="item.warnStatus === '0'">正常</el-tag>-->
                    <!--<el-tag type="danger" v-show="item.warnStatus === '1'">告警</el-tag>-->
                    <el-tag type="success" v-show="item.activeFlag === '1'">启用</el-tag>
                    <el-tag type="danger" v-show="item.activeFlag === '0'">停用</el-tag>
                  </template>
                  <div v-if="loadingDataLocaList">
                    <oms-loading :loading="loadingDataLocaList"></oms-loading>
                  </div>
                  <div v-else-if="!areaList.length" class="empty-info mini">
                    暂无库区信息
                  </div>
                  <ul class="show-list" v-else="">
                    <li v-for="(item,index) in areaList" class="list-item" :key="index"
                        @click="showAreaDetail(item)" :class="{'active':item.id===currentArea.id}">
                      {{item.warehouseCode}}
                      <!--<el-tag type="success" v-show="item.warnStatus === '0'">正常</el-tag>-->
                      <!--<el-tag type="danger" v-show="item.warnStatus === '1'">告警</el-tag>-->
                      <el-tag type="success" v-show="item.activeFlag === '1'">启用</el-tag>
                      <el-tag type="danger" v-show="item.activeFlag === '0'">停用</el-tag>
                    </li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="d-table-right">
        <div v-if="loadingDataLoca">
          <oms-loading :loading="loadingDataLoca"></oms-loading>
        </div>
        <div v-if="!currentArea.id" class="empty-info">
          暂无信息
        </div>
        <div v-else="" class="content-right">
          <div class="form-header-part part-bg p-r-20">
            <div class="header">
              <div class="sign f-dib"></div>
              <h3 class="tit f-dib index-tit">库区信息</h3>
            </div>
            <div class="content content-sp">
              <el-col :span="6">
                <oms-row label="库区编码" :span="10">{{ currentArea.warehouseCode }}</oms-row>
              </el-col>
              <el-col :span="4">
                <oms-row label="状态" :span="10">
                  <el-tag type="success" v-show="currentArea.activeFlag === '1'">启用</el-tag>
                  <el-tag type="danger" v-show="currentArea.activeFlag === '0'">停用</el-tag>
                </oms-row>
              </el-col>
            </div>
          </div>
          <div class="form-header-part mt-10 p-r-20">
            <el-row>
              <el-col :span="6">
                <div class="header">
                  <div class="sign f-dib"></div>
                  <h3 class="tit f-dib index-tit">设备信息</h3>
                </div>
              </el-col>
              <el-col :span="18" class="text-right ">
                  <span class="btn-search-toggle open" style="margin-right: 10px">
                    <single-input v-model='keyWord' style="width: 180px" placeholder="请输入名称搜索设备"
                                  @click.stop=""></single-input>
                    <i class="el-icon-t-search"></i>
                  </span>
                <el-button-group>
                  <el-button v-has="'ccs-warehouse-edit'" :plain="true" @click="editArea">
                    编辑
                  </el-button>
                  <el-button v-has="'ccs-warehouse-dev-bind'" :plain="true" @click="addTemp">
                    绑定设备
                  </el-button>
                  <el-button v-has="'ccs-warehouse-dev-rulecfg'" :plain="true" @click="ruleConfig(currentArea.id)">
                    配置规则
                  </el-button>
                </el-button-group>
              </el-col>
            </el-row>
            <div class="content">
              <div class=" mt-10">
                <el-table :data="tempList" style="width: 100%;" header-row-class-name="table-header-color"
                          :max-height="tableHeight" v-loading="loadingDataTemp">
                  <el-table-column prop="ccsDevName" label="设备名称" min-width="120"></el-table-column>
                  <el-table-column prop="devCode" label="设备编码" min-width="120"></el-table-column>
                  <el-table-column prop="reportDateMap" label="最新数据">
                    <template slot-scope="scope">
                      <el-tooltip effect="dark" :content="showRecordDate(scope.row.recordDate)" placement="top">
                        <span>{{$formatDevData(scope.row, $formatDevType(scope.row))}}</span>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                  <el-table-column prop="monitorStatus" label="监控状态" min-width="80">
                    <template slot-scope="scope">{{scope.row.monitorStatus | formatMonitoringStatus}}</template>
                  </el-table-column>
                  <!--<el-table-column prop="monitorStatus" label="位置" min-width="80">-->
                  <!--<template slot-scope="scope">-->
                  <!--<div v-show="scope.row.positionX">X：{{scope.row.positionX}}</div>-->
                  <!--<div v-show="scope.row.positionY">Y：{{scope.row.positionY}}</div>-->
                  <!--</template>-->
                  <!--</el-table-column>-->
                  <el-table-column prop="" label="操作" min-width="300">
                    <template slot-scope="scope">
                      <div class="opera-btn-bidder">
                        <des-btn v-has="'ccs-warehouse-dev-switch'"
                                 icon="start" v-show="!scope.row.monitorStatus || scope.row.monitorStatus==='0'"
                                 @click="monitorTemp(scope.row)">开启监控
                        </des-btn>
                        <des-btn v-has="'ccs-warehouse-dev-switch'" icon="forbidden"
                                 v-show="scope.row.monitorStatus==='1'"
                                 @click="cancelMonitorTemp(scope.row)">取消监控
                        </des-btn>
                        <des-btn v-has="'ccs-warehouse-dev-rulecfg'"
                                 icon="edit" @click="ruleConfig('s,' + scope.row.ccsMonitorRelationId)">配置规则
                        </des-btn>
                        <des-btn v-has="'ccs-warehouse-dev-unbind'" icon="delete" @click="deleteTemp(scope.row)">删除
                        </des-btn>
                        <des-btn v-has="'ccs-devmap-scan'" icon="detail"
                                 @click="$turnDevDate(scope.row, $formatDevType(scope.row))">历史数据
                        </des-btn>
                        <!--<des-btn v-has="'ccs-warehouse-dev-edit'" icon="edit" @click="editTempLocation(scope.row)">编辑位置</des-btn>-->
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="text-center" v-show="tempList.length">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pager.currentPage"
                               :page-sizes="[10,20,50,100]" :page-size="pager.pageSize"
                               layout="total, sizes, prev, pager, next, jumper"
                               :total="pager.count">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-right :show="showIndex !== -1" @right-close="resetRightBox" :css="{'width':'900px','padding':0}">
      <temp-part :index="showIndex" :area="currentArea" @refresh="refresh" v-show="showIndex=== 0"/>
      <temp-distribution :index="showIndex" :tempItem="tempItem" @refresh="refresh" v-show="showIndex=== 1"
                         @right-close="resetRightBox"/>
      <temp-export :index="showIndex" :activeId="activeId" v-show="showIndex=== 2"/>
    </page-right>
  </div>
</template>
<script>
  import TempPart from './form/temp';
  import {CcsWarehouse, MonitoringObjGroup, WarehouseDevRelation} from '@/resources';
  import TempDistribution from './form/temp-distribution';
  import TempExport from './form/temp-export';

  export default {
    components: {TempPart, TempDistribution, TempExport},
    data: function () {
      return {
        loadingDataWare: false,
        loadingDataLocaList: false,
        loadingDataLoca: false,
        loadingDataTemp: false,
        warehouseList: [],
        areaList: [],
        tempList: [],
        showIndex: -1,
        currentArea: {},
        keyWord: '',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        activeId: '',
        accordionId: '',
        deleteStore: this.$parent.deleteStore,
        tempItem: {}
      };
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 20) + 'px';
      },
      tableHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height - 207);
      }
    },
    mounted() {

    },
    watch: {
      keyWord() {
        this.queryTemp();
      }
    },
    methods: {
      showRecordDate: function (data) {
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      editWarehouse(item) {
        this.$emit('open', item, '1');
      },
      addArea() {
        this.$emit('open', {
          parentId: this.activeId
        }, '2');
      },
      editArea() {
        this.$emit('open', this.currentArea, '2');
      },
      addTemp() {
        this.showIndex = 0;
      },
      deleteTemp(item) {
        this.$confirmOpera(`是否删除温度计"${item.ccsDevName}"`, () => {
          let ids = {
            ccsMonitorRelationIds: [item.ccsMonitorRelationId],
            ccsWarehouseDevRelationIds: [item.id]
          };
          this.$httpRequestOpera(
            this.$http.delete('/ccsWarehouseDevRelation', {
              data: ids
            }), {
              successTitle: '删除成功',
              errorTitle: '删除失败',
              success: () => {
                this.refresh();
              }
            });
        });
      },
      refresh() {
        this.queryTemp(1);
        this.resetRightBox();
      },
      resetRightBox() {
        this.showIndex = -1;
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        this.queryTemp(1);
      },
      handleCurrentChange(val) {
        this.queryTemp(val);
      },
      changeCollapse(item) {
        this.activeId = item.id;
        this.queryArea();
      },
      showAreaDetail(item) {
        this.currentArea = item;
        this.queryTemp(1);
      },
      ruleConfig(id) {
        this.$store.commit('initUnitId', id);
      },
      monitorTemp(item) {
        this.$confirmOpera(`是否监控设备"${item.ccsDevName}"`, () => {
          let obj = {
            activeFlag: '1',
            ids: [item.ccsMonitorRelationId]
          };
          this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatusSingle(obj), {
            successTitle: '监控成功',
            errorTitle: '监控失败',
            success: () => {
              item.monitorStatus = '1';
            }
          });
        });
      },
      cancelMonitorTemp(item) {
        this.$confirmOpera(`是否取消对设备"${item.ccsDevName}"的监控`, () => {
          let obj = {
            activeFlag: '0',
            ids: [item.ccsMonitorRelationId]
          };
          this.$httpRequestOpera(MonitoringObjGroup.modifyMonitorStatusSingle(obj), {
            successTitle: '取消成功',
            errorTitle: '取消失败',
            success: () => {
              item.monitorStatus = '0';
            }
          });
        });
      },
      queryWarehouse: function () {
        let param = {
          parentId: this.$route.params.id,
          warehouseType: '1',
          activeFlag: '1'
        };
        this.loadingDataWare = true;
        CcsWarehouse.queryAllList(param).then(res => {
          this.currentArea = {};
          this.warehouseList = res.data.currentList;
          this.activeId = this.warehouseList.length ? this.warehouseList[0].id : '';
          this.accordionId = this.activeId;
          this.loadingDataWare = false;
          this.queryArea();
        });
      },
      queryArea: function () {
        let param = {
          parentId: this.activeId,
          warehouseType: '2',
          activeFlag: '1'
        };
        this.loadingDataLocaList = true;
        CcsWarehouse.queryAllList(param).then(res => {
          this.areaList = res.data.currentList;
          this.loadingDataLocaList = false;
        });
      },
      queryTemp(pageNo) {
        this.tempItem = {};
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          ccsWarehouseId: this.currentArea.id,
          ccsDevName: this.keyWord
        });
        this.loadingDataTemp = true;
        WarehouseDevRelation.query(params).then(res => {
          this.tempList = res.data.currentList || [];
          this.pager.count = res.data.count;
          this.loadingDataTemp = false;
        });
      },
      editTempLocation(row) {
        this.tempItem = row;
        this.showIndex = 1;
      },
      exportWarehouseTempData(row) {
        this.showIndex = 2;
      }
    }
  };
</script>
