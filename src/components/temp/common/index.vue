<template>
  <div class="order-page">
    <search-part :tempTypeList="tempTypeList" :type="type" @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="perms[0]" v-if="type">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
        <el-button @click="exportDevInfo" plain size="small" v-has="'ccs-wired-dev-export'">
          <f-a class="icon-small" name="export"></f-a>
          导出设备信息
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType" v-show="!!type"/>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header" v-if="type">
        <el-col :span="3">设备编码devCode</el-col>
        <el-col :span="5">设备编号devNo</el-col>
        <el-col :span="5">名称</el-col>
        <el-col :span="type !== 2 ? 3 : 2">状态</el-col>
        <el-col :span="type !== 2 ? 3 : 2">最新数据</el-col>
        <el-col :span="3" v-show="type === 2">校准期</el-col>
        <el-col :span="4">操作</el-col>
      </el-row>
      <el-row class="order-list-header" v-else>
        <el-col :span="3">设备编码devCode</el-col>
        <el-col :span="3">设备编号devNo</el-col>
        <el-col :span="4">名称</el-col>
        <el-col :span="4">类型</el-col>
        <el-col :span="3">状态</el-col>
        <el-col :span="3">最新数据</el-col>
        <el-col :span="4">操作</el-col>
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
      <div class="order-list-body flex-list-dom" v-else="">
        <div v-if="type">
          <div :class="[formatRowClass(item.devStatus, statusType) ,{'active':currentItemId===item.id}]" @click="showItemDetail(item)" class="order-list-item"
               v-for="item in dataList">
            <el-row>
              <el-col :span="3" class="R">{{item.devCode}}</el-col>
              <el-col :span="5" class="R">{{item.devNo}}</el-col>
              <el-col :span="5" class="R">{{item.devName}}</el-col>
              <el-col :span="type !== 2 ? 3 : 2">
                {{formatStatus(item.devStatus, statusType)}}
              </el-col>
              <el-col :span="type !== 2 ? 3 : 2">
                <el-tooltip :content="showRecordDate(item.recordDate)" effect="dark" placement="top">
                  <span>{{$formatDevData(item, type !== 5 ? '1' : '2')}}</span>
                </el-tooltip>
              </el-col>
              <el-col :span="3" v-show="type === 2">{{item.createTime | date}}</el-col>
              <el-col :span="4" class="opera-btn">
                <des-btn @click="edit(item)" icon="edit" v-has="perms[1]">编辑</des-btn>
                <des-btn @click="$turnDevDate(item, type !== 5 ? '1' : '2')" icon="detail" v-has="'ccs-devmap-scan'">
                  历史数据
                </des-btn>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
        <div v-else>
          <div :class="['status-no' ,{'active':currentItemId===item.id}]" @click="showItemDetail(item)" class="order-list-item"
               v-for="item in dataList">
            <el-row>
              <el-col :span="3" class="R">{{item.devCode}}</el-col>
              <el-col :span="3" class="R">{{item.devNo}}</el-col>
              <el-col :span="4" class="R">{{item.devName}}</el-col>
              <el-col :span="4">{{tempTypeList[item.devType]}}</el-col>
              <el-col :span="3">
                {{formatStatus(item.devStatus, item.devType !== '1' ? orderType : wifiType)}}
              </el-col>
              <el-col :span="3">
                <el-tooltip :content="showRecordDate(item.recordDate)" effect="dark" placement="top">
                  <span>{{$formatDevIndexData(item, item.devType)}}</span>
                </el-tooltip>
              </el-col>
              <el-col :span="4" class="opera-btn">
                <des-btn @click="edit(item)" icon="edit" v-has="perms[1]">编辑</des-btn>
                <des-btn @click="$turnDevDate(item, type !== 5 ? '1' : '2')" icon="detail" v-has="'ccs-devmap-scan'">
                  历史数据
                </des-btn>
              </el-col>
            </el-row>
          </div>
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
      <component :formItem="form" :index="showIndex" :is="currentPart" :statusType="statusType" :type="currentType"
                 @change="change"
                 @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form';
  import CommonMixin from '@/mixins/commonMixin';
  import {TempDev} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        wifiType: utils.wifiType,
        orderType: utils.orderType,
        filters: {
          status: '1',
          devCode: '',
          devName: ''
        },
        dialogComponents: {
          0: addForm,
          1: showForm
        },
        tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车载温度计', '湿度计'],
        defaultPageRight: {'width': '700px', 'padding': 0}
      };
    },
    computed: {
      type() {
        const type = this.$route.meta.type;
        this.init(type);
        return type;
      },
      perms() {
        return this.$route.meta.perms;
      },
      currentType() {
        return this.form.id ? this.form.devType * 1 + 1 : this.type;
      }
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
      this.filters.status = this.type === 2 ? '4' : '1';
      this.queryList(1);
    },
    methods: {
      showRecordDate: function (data) {
        if (!data) return '';
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      init(val) {
        this.activeStatus = 0;
        this.statusType = utils[val === 2 ? 'wifiType' : 'orderType'];
        this.filters = {
          status: '1',
          devCode: '',
          devName: ''
        };
        this.$nextTick(() => {
          this.filters.status = val === 2 ? null : '1';
        });
      },
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      checkStatus(item, key) {
        this.filters.status = item.status;
        this.activeStatus = key;
      },
      resetRightBox() {
        this.defaultPageRight.width = '700px';
        this.showIndex = -1;
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      queryList(pageNo) {
        const http = TempDev.query;
        let isAll = typeof this.filters.devType === 'number';
        this.filters.devType = isAll ? this.filters.devType : this.type ? this.type - 1 : null;
        this.filters.devStatus = isAll ? this.filters.status : this.type ? this.filters.status : null;
        const params = this.queryUtil(http, pageNo);
        this.type && this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {devStatus: null});
        // 若是无线温度计,单独拼数量
        if (this.type === 2) {
          TempDev.queryStateNum(params).then(res => {
            this.statusType[0].num = res.data[4] + res.data[3] + res.data[2] + res.data[1] + res.data[0];
            this.statusType[1].num = res.data[4];
            this.statusType[2].num = res.data[3];
            this.statusType[3].num = res.data[2];
            this.statusType[4].num = res.data[1];
            this.statusType[5].num = res.data[0];
          });
          return;
        }
        const http = TempDev.queryStateNum;
        const res = {};
        this.queryStatusNumUtil(http, pm, this.statusType, res);
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item) {
        this.statusType = item.devType !== '1' ? this.orderType : this.wifiType;
        this.currentItem = item;
        this.currentItemId = item.id;
        this.form = item;
        this.showPart(0);
      },
      showItemDetail(item) {
        this.statusType = item.devType !== '1' ? this.orderType : this.wifiType;
        this.currentItem = item;
        this.currentItemId = item.id;
        this.showPart(1);
        this.defaultPageRight.width = '900px';
        this.$nextTick(() => {
          this.form = item;
        });
      },
      deleteItem(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否删除温度计"${item.devName}"`, () => {
          this.$httpRequestOpera(TempDev.delete(item.id), {
            successTitle: '删除成功',
            errorTitle: '删除失败',
            success: () => {
              this.queryList(1);
            }
          });
        });
      },
      exportDevInfo() {
        let isAll = typeof this.filters.devType === 'number';
        this.filters.devType = isAll ? this.filters.devType : this.type ? this.type - 1 : null;
        this.$store.commit('initPrint', {isPrinting: true, text: '正在导出'});
        this.$httpRequestOpera(TempDev.exportDevInfo(this.filters), {
          successTitle: '导出成功',
          errorTitle: '导出失败',
          success: res => {
            utils.download(res.data.path);
            this.$store.commit('initPrint', {isPrinting: false});
          },
          error() {
            this.$store.commit('initPrint', {isPrinting: false});
          }
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
