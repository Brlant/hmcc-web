<style lang="scss" scoped>
.page-right-part {
  box-sizing: content-box;
  width: 800px;
  padding: 30px 0;
  overflow: auto;

  .title {
    margin-left: 30px;
  }

  .order-info-part {
    padding: 0 50px;
  }

  .goods-info-left {
    width: 330px;
    margin-left: 30px;
    padding: 20px;
    float: left;
    border: 1px solid rgb(238, 238, 238);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .goods-info-right {
    width: 210px;
    padding: 32px 20px 33px 20px;
    background-color: rgb(238, 238, 238);
    border: 1px solid rgb(238, 238, 238);
    float: left;

    .el-row {
      margin-bottom: 5px;
    }

    margin-bottom: 20px;
  }

  .min-gutter {
    .el-form-item {
      margin-bottom: 4px;
    }
  }

  .border-show {
    height: 15px;
    width: 100%;
    border-bottom: 1px solid #777777;
    opacity: 0.2;
    margin-bottom: 10px;
  }

}

.exceptionPosition {
  /*margin-left: 40px;*/
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

.table {
  .order-list-item {
    color: #999;
    line-height: 20px;
  }

  border-collapse: separate;
  border-spacing: 0;

  > tbody > tr > td {
    border-top: 1px solid #eee;
  }

}

.empty-position {
  width: 150px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.w90 {
  width: 90px;
}

.page-right-part {
  width: 750px;
  padding: 0 0 30px 0;
}

.base-pic-item {
  border: 1px solid #eee;
  position: relative;
  cursor: pointer;
  width: 180px;
  margin: 5px;
  padding: 10px;
  font-size: 12px;

  img {
    width: 180px;
    height: 180px;
    display: block;
    background: #ccc;

  }

}

.margin-left {
  margin-left: 15px;
}

.margin-left-right {
  margin-left: 38px;
  margin-right: 38px;
}

.power-style-part {
  margin: 12px 0;
  background-color: rgb(238, 238, 238);
  padding: 12px 10px 10px 10px;
}

.el-form .el-checkbox__label {
  font-size: 12px;
  padding-left: 5px;
}

.el-form .el-checkbox__inner {
  width: 14px;
  height: 14px;
}

.margin-bottom {
  margin-bottom: 2px !important;
}

.border-show {
  height: 20px;
  border-bottom: 1px solid #777777;
  opacity: 0.2;
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 20px;
}

.right-title {
  background-color: #b1b1b1;
  height: 30px;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 20px;
  padding-top: 10px;

}

.content-part {
  position: absolute;
  top: 40px;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;

  .content-left {
    width: 120px;
    height: 100%;
    float: left;
    background-color: rgb(238, 238, 238);

    .list-style {
      cursor: pointer;
      padding: 8px 5px 8px 5px;

      &:hover {
        background-color: #ffffff;
      }
    }

    .click-it {
      background-color: #ffffff;
    }
  }

  .content-right {
    width: 510px;
    height: 100%;
    float: left;
    padding-top: 10px;

    .hide-content {
      display: none;
    }

    .show-content {
      display: block;
    }
  }

  .min-gutter {
    .el-form-item {
      margin-bottom: 4px;
    }

    .el-form-item__label {
      font-size: 12px
    }
  }
}

.locked {
  border-left: 5px solid #fa0;
  text-indent: -5px;
}

.list-item {
  padding-right: 10px;
}
</style>
<template>
  <div class="order-page">
    <div class="container">

      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <span class="pull-right opera-btn" style="margin-left: 10px">
            <des-btn v-has="'address-manager-add'" icon="plus" @click="addType">添加</des-btn>
          </span>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
              <i class="el-icon-arrow-up"></i>
              <span v-show="showSearch">收起筛选</span>
              <span v-show="!showSearch">展开筛选</span>
            </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="6">
              <oms-form-row :span="4" label="单位">
                <el-select v-model="searchCondition.orgId" :clearable="true" :remote-method="filterCustomer" filterable
                           placeholder="名称/拼音/系统代码搜索单位" popperClass="good-selects"
                           remote @change="orgChange" @click.native.once="filterCustomer('')">
                  <el-option v-for="org in customerList" :key="org.id" :label="org.name" :value="org.id">
                    <div style="overflow: hidden">
                      <span class="pull-left" style="clear: right">{{ org.name }}</span>
                    </div>
                    <div style="overflow: hidden">
                      <span class="select-other-info pull-left">
                        <span>系统代码:</span>{{ org.manufacturerCode }}
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="5">
              <oms-form-row :span="6" label="类型">
                <el-select v-model="searchCondition.warehouseType" clearable placeholder="请选择仓库类型">
                  <el-option v-for="item in warehouseTypeList" :key="item.key" :label="item.label" :value="item.key">
                    {{ item.label }}
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="7">
              <oms-form-row :span="6" label="地址类型">
                <el-select v-model="searchCondition.type" clearable placeholder="请选择仓库地址类型">
                  <el-option v-for="item in dictAddress" :key="item.key" :label="item.label" :value="item.key"/>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="6">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button type="reset" @click="resetSearchForm">重置</el-button>
                <el-button :plain="true" type="success" @click="exportExcel">导出</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list-status container" style="margin-bottom:20px">
        <div v-for="(item,key) in orgType" :class="{'active':key==activeStatus,'item-right':item.type===0} "
             class="status-item"
             @click="changeType(key,item)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key==activeStatus" class="el-icon-caret-right"></i>{{ item.title }}<span
            class="status-num">{{ item.num }}</span></div>
        </div>
      </div>
      <div class="order-list">
        <el-row class="order-list-header">
          <el-col :span="2">仓库类型</el-col>
          <el-col :span="2">仓库地址类型</el-col>
          <el-col :span="2">名称</el-col>
          <el-col :span="6">所属单位</el-col>
          <el-col :span="6">所在地区/详细地址</el-col>
          <el-col :span="3">联系人/电话</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="showTypeList.length === 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in showTypeList" :class="['status-'+filterListColor(item),{'active':activeId==item.id}]"
               class="order-list-item pointer"
               @click="showInfo(item)">
            <el-row>
              <el-col :span="2">
                <div>
                  {{ warehouseType(item) }}
                </div>
              </el-col>
              <el-col :span="2">
                <div>
                  <dict :dict-group="'orgAddress'" :dict-key="formatAddress(item)"></dict>
                </div>
              </el-col>
              <el-col :span="2">
                <div>
                  {{ item.name }}
                  <el-tag v-show="item.default" type="primary">默认</el-tag>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="vertical-center">
                  {{ item.orgName }}
                </div>
              </el-col>
              <el-col :span="6">
                <div class="f-grey">
                  {{ storeAddress(item) }}
                </div>
                <div>
                  {{ item.detail }}<span v-show="item.accuracy"><i class="el-icon-t-didian"></i></span>
                </div>
                <!--<div v-if="item.warehouseType==='0'&&item.warehouseSourceFirmName">-->
                <!--(物流公司:{{ item.warehouseSourceFirmName}})-->
                <!--</div>-->
              </el-col>
              <el-col :span="3">
                <div>
                  {{ item.contact }}
                </div>
                <div>
                  {{ item.telephone }}
                </div>
              </el-col>
              <el-col :span="3" class="opera-btn">
                <div>
                  <des-btn v-if="item.status==='0'" v-has="'address-manager-edit'" icon="edit" @click="edit(item)">编辑
                  </des-btn>
                  <des-btn icon="search" @click="showInfo(item)">查看</des-btn>
                </div>
              </el-col>
            </el-row>
            <div class="order-list-item-bg"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="showTypeList.length && !loadingData" class="text-center">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" layout="total, sizes, prev, pager, next, jumper"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <page-right :css="{'width':'550px'}" :show="showRight" @right-close="resetRightBox">
      <store-part :action="action" :actionType="showRight" :formItem="form" @change="onSubmit"
                  @right-close="resetRightBox"></store-part>
    </page-right>
    <page-right :css="{'width':'750px'}" :show="showTypeRight" @right-close="resetRightBox">
      <show-form :action="action" :formItem="showForm" @change="onSubmit" @right-close="resetRightBox"></show-form>
    </page-right>
  </div>
</template>
<script>
import {Address, BaseInfo} from '@/resources';
import storePart from './form/form.vue';
import showForm from './form/showForm.vue';
import utils from '@/tools/utils';
import orderMixin from '@/mixins/orderMixin';

export default {
  components: {
    showForm, storePart
  },
  mixins: [orderMixin],
  data: function () {
    return {
      loadingData: true,
      showRight: false,
      showTypeRight: false,
      showTypeSearch: false,
      showSearch: true,
      data: {},
      goodsInfo: {
        orgGoodsDto: {},
        list: []
      },
      combinationList: [],
      showTypeList: [],
      typeTxt: '',
      keyTxt: '',
      form: {},
      showForm: {},
      action: '',
      currentItem: {},
      orgType: {
        0: {'title': '正常', 'num': '0', 'status': '0', 'auditedStatus': '1'},
        1: {'title': '待审核', 'num': '0', 'status': '0', 'auditedStatus': '0'},
        2: {'title': '审核未通过', 'num': '0', 'status': '0', 'auditedStatus': '2'},
        3: {'title': '业务停用', 'num': '0', 'status': '2'},
        4: {'title': '停用', 'num': '0', 'status': '3'}
      },
      activeStatus: 0,
      filters: {
        status: '0',
        auditedStatus: '1',
        warehouseType: '',
        type: '',
        orgId: ''
      },
      isInit: false,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
        totalPage: 1
      },
      searchCondition: {
        warehouseType: '',
        type: '',
        orgId: ''
      },
      activeId: '',
      orgList: [],
      customerList: []
    };
  },
  computed: {
    typeIdList() {
      return this.$getDict('typeId');
    },
    dictAddress: function () {
      return this.$getDict('orgAddress');
    },
    warehouseTypeList() {
      return this.$store.state.warehouseType;
    }
  },
  filters: {
    formatIsUse: function (value) {
      return value ? '是' : '否';
    }
  },
  mounted() {
    this.$emit('loaded');
    this.getAddressList();
  },
  watch: {
    'typeTxt': function () {
      this.getAddressList();
    },
    filters: {
      handler() {
        this.getAddressList();
      },
      deep: true
    }
  },
  methods: {
    exportExcel() {
      let params = Object.assign({}, this.searchCondition);
      this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
      this.$http.post('/orgAddressInfo/export', params).then(res => {
        utils.download(res.data.path, '仓库地址');
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
      }).catch(error => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    formatAddress: function (item) {
      if (item.type === null) return '';
      return item.type + '';
    },
    storeAddress(item) {
      let province = item.province;
      let city = item.city;
      let region = item.region;
      return utils.formatAddress(province, city, region);
    },
    warehouseType(item) {
      let w = this.$store.state.warehouseType.find(f => f.key === item.warehouseType);
      return w && w.label || w;
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getAddressList(1);
    },
    handleCurrentChange(val) {
      this.getAddressList(val);
    },
    filterCustomer: function (query) {// 过滤客户
      BaseInfo.query({keyWord: query}).then(res => {
        this.customerList = res.data.list;
      });
    },
    orgChange: function () {
      this.searchCondition.keyWord = '';
    },
    searchInOrder: function () {// 搜索
      Object.assign(this.filters, this.searchCondition);
      this.getAddressList(1);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        warehouseType: '',
        type: '',
        orgId: ''
      };
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
      this.getAddressList(1);
    },
    resetRightBox: function () {
      this.showRight = false;
      this.showTypeRight = false;
    },
    filterListColor: function (item) {// 过滤左边列表边角颜色
      let index = 0;
      if (item.status === '0' && item.auditedStatus === '1') {
        index = 0;
      } else if (item.status === '0' && item.auditedStatus === '0') {
        index = 1;
      } else if (item.status === '0' && item.auditedStatus === '2') {
        index = 2;
      } else if (item.status === '2') {
        index = 3;
      } else if (item.status === '3') {
        index = 4;
      }
      return index;
    },
    addType: function () {
      this.action = 'add';
      this.form = {};
      this.showRight = true;
    },
    searchType: function () {
      this.showTypeSearch = !this.showTypeSearch;
    },
    getAddressList: function (pageNo) {
      this.pager.currentPage = pageNo;
      let param = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        deleteFlag: false,
        keyword: this.typeTxt
      }, this.filters);
      this.loadingData = true;
      Address.query(param).then(res => {
        this.showTypeList = res.data.list
        if (res.data.list.length > 0) {
          this.currentItem = Object.assign({}, this.showTypeList[0]);
        } else {
          this.currentItem = Object.assign({'id': ''});
        }
        this.loadingData = false;
        this.pager.count = res.data.count;
      });
      this.queryStatusNum(param);
    },
    queryStatusNum: function (params) {
      Address.queryStateNum(params).then(res => {
        let data = res.data;
        this.orgType[0].num = data['normal'];
        this.orgType[1].num = data['audit'];
        this.orgType[2].num = data['notAudit'];
        this.orgType[3].num = data['bizDisable'];
        this.orgType[4].num = data['disable'];
      });
    },
    edit: function (item) {
      // console.log('列表值',item)
      this.action = 'edit';
      this.activeId = item.id;
      this.form = JSON.parse(JSON.stringify(item));
      this.showRight = true;
    },
    showInfo: function (item) {
      this.action = 'watch';
      this.activeId = item.id;
      this.showForm = JSON.parse(JSON.stringify(item));
      this.showForm.type = item.type.toString();
      this.showTypeRight = true;
    },
    changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
      this.activeStatus = key;
      this.filters.status = item.status;
      this.filters.auditedStatus = item.auditedStatus;
    },
    onSubmit: function () {
      this.getAddressList();
    }
  }
};
</script>
