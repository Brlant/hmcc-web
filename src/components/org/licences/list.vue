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
        <div class="opera-icon opera-btn">
          <!--<span style="font-size: 16px">-->
          <!--<i class="el-icon-t-search"></i> 筛选查询-->
          <!--</span>-->
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
              <i class="el-icon-arrow-up"></i>
              <span v-show="showSearch">收起筛选</span>
              <span v-show="!showSearch">展开筛选</span>
          </span>
          <span class="pull-right opera-btn" style="margin-left: 10px">
            <des-btn v-has="'org-licences-manage-add'" icon="plus" @click="add" class="mr-10">添加</des-btn>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form" onsubmit="return false">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="3" label="证照">
                <el-select v-model="searchCondition.name" placeholder="请选择证照">
                  <el-option v-for="item in businessUnitCertificateList" :key="item.label" :label="item.label"
                             :value="item.label">
                  </el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="3" label="厂商">
                <el-select v-model="searchCondition.orgId" :clearable="true" :remote-method="filterOrg" filterable
                           placeholder="请输入名称/拼音首字母缩写/系统代码搜索厂商"
                           popperClass="good-selects" remote @click.native="filterOrg('')">
                  <el-option v-for="org in orgList" :key="org.id" :label="org.name" :value="org.id">
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
            <el-col :span="8">
              <oms-form-row :span="2" label="">
                <el-button native-type="submit" type="primary" @click="searchInOrder">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
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
          <el-col :span="6">厂商代码/名称</el-col>
          <el-col :span="6">证照名称</el-col>
          <el-col :span="3">证照编号</el-col>
          <el-col :span="6">证照有效期</el-col>
          <el-col :span="3">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="showTypeList.length == 0">
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
              <el-col :span="6">
                <div class="f-grey">
                  {{ item.orgNo }}
                </div>
                <div>
                  {{ item.orgName }}
                </div>
              </el-col>
              <el-col :span="6">
                <div class="vertical-center">
                  {{ item.name }}
                  <el-tag v-show="item.expireStatus==='0'" type="primary">正常</el-tag>
                  <el-tag v-show="item.expireStatus==='1'" type="warning">即将到期</el-tag>
                  <el-tag v-show="item.expireStatus==='2'" type="danger">已过期</el-tag>
                </div>
              </el-col>
              <el-col :span="3">
                <div class="vertical-center">
                  {{ item.licenceNumber }}
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  {{ item.validStartTime | date }} - {{ item.validEndTime | date }}
                </div>
              </el-col>
              <el-col :span="3">
                <des-btn v-has="'org-licences-manage-edit'" icon="edit" @click="edit(item)" class="mr-10">编辑</des-btn>
                <des-btn v-has="'org-licences-manage-delete'" icon="remove" @click="deleteItem(item)" class="mr-10">删除</des-btn>
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
    <page-right :show="showPhotoRight" @right-close="resetRightBox">
      <photo-edit :formItem="photoForm" @change="change" @close="showPhotoRight=false"></photo-edit>
    </page-right>
  </div>
</template>
<script>
import {BaseInfo, orgLicence} from '@/resources';
import attachmentLists from '../../common/attachmentList.vue';
import photoEdit from './form/photo.vue';

export default {
  components: {
    attachmentLists, photoEdit
  },
  data: function () {
    return {
      activeId: '',
      orgList: [],
      searchCondition: {
        orgId: '',
        name: ''
      },
      photoForm: {},
      goodsInfo: {},
      loadingData: true,
      attachmentIdList: [],
      showRight: false,
      showTypeRight: false,
      showTypeSearch: false,
      showSearch: true,
      filters: {
        isOverdue: '0'
      },
      typeList: [],
      showTypeList: [],
      typeTxt: '',
      keyTxt: '',
      orgType: {
        0: {'title': '正常', 'num': '', 'isOverdue': '0'},
        1: {'title': '已过期', 'num': '', 'isOverdue': '1'}
      },
      activeStatus: 0,
      action: '',
      formTitle: '新增',
      currentItem: {
        state: '',
        id: ''
      },
      baseQueryGoods: [],
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10,
        totalPage: 1
      },
      isInit: false,
      showPhotoRight: false
    };
  },
  filters: {
    formExpiryUnit: function (value) {
      let array = {
        0: '年',
        1: '月',
        2: '日'
      };
      return array[value];
    }
  },
  mounted() {
    this.getPageList(1);
  },
  watch: {
    'typeTxt': {// 列表搜索过滤
      handler: function () {
        this.getPageList(1);
      },
      deep: true
    },
    filters: {// 监控货品分类（所有/正常...）
      handler() {
        this.getPageList(1);
      },
      deep: true
    }
  },
  computed: {
    bodyHeight: function () {
      return this.$store.state.bodyHeight;
    },
    businessUnitCertificateList() {
      return this.$getDict('businessUnitCertificate');
    }
  },
  methods: {
    add() {
      this.action = 'add';
      this.photoForm = {
        orgId: '',
        licenceType: '',
        licenceNumber: '',
        validStartTime: '',
        validEndTime: '',
        photos: []
      };
      this.showPhotoRight = true;
    },
    edit: function (item) {
      this.action = 'edit';
      this.photoForm = JSON.parse(JSON.stringify(item));
      this.showPhotoRight = true;
    },
    deleteItem(item) {
      this.$confirm(`是否删除货品"${item.orgName}"的证照"${item.name}"`, '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orgLicence.delete(item.id).then(() => {
          this.doing = false;
          this.$notify.success({
            duration: 2000,
            message: '取消成功'
          });
          this.getPageList(1);
        }).catch(() => {
          this.doing = false;
        });
      });
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      window.localStorage.setItem('currentPageSize', val);
      this.getPageList(1);
    },
    handleCurrentChange(val) {
      this.getPageList(val);
    },
    filterOrg: function (query) {
      let param = {
        keyWord: query
      };
      BaseInfo.query(param).then(res => {
        this.orgList = res.data.list;
      });
    },
    searchInOrder: function () {// 搜索
      Object.assign(this.filters, this.searchCondition);
      this.getPageList(1);
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        orgId: '',
        name: ''
      };
      Object.assign(this.searchCondition, temp);
      Object.assign(this.filters, temp);
      this.getPageList(1);
    },
    handlePreview: function (id) {
      this.$store.commit('changeAttachment', id);
    },
    changeFinds: function (val) {
      this.filters.typeId = val;
      this.kindsMenu.forEach(item => {
        if (val === item.key) {
          this.kindsTitle = item.title;
        }
      });
    },
    getPageList: function (pageNo) {
      this.pager.currentPage = pageNo;
      let param = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      this.loadingData = true;
      orgLicence.queryPager(param).then(res => {
        this.showTypeList = res.data.list;
        this.typeList = res.data.list;
        if (res.data.list.length > 0) {
          this.currentItem = res.data.list[0].id;
        } else {
          this.currentItem = Object.assign({'id': ''});
        }
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
      this.queryStatusNum(param);
    },
    queryStatusNum: function (params) {
      orgLicence.queryStateNum(params).then(res => {
        let data = res.data;
        this.orgType[0].num = data['notOverDue'];
        this.orgType[1].num = data['overDue'];
      });
    },
    filterListColor: function (item) {// 过滤左边列表边角颜色
      let index = 0;
      if (item.isOverdue === '0') {
        index = 0;
      } else if (item.isOverdue === '1') {
        index = 1;
      }
      return index;
    },
    resetRightBox: function () {
      this.showRight = false;
      this.showTypeRight = false;
      this.showPhotoRight = false;
    },
    change: function () {
      this.getPageList(this.pager.currentPage);
    },
    searchType: function () {
      this.showTypeSearch = !this.showTypeSearch;
      this.showSearch = !this.showSearch;
      this.filterOrg();
    },
    showInfo: function (item) {
      this.activeId = item.id;
      this.photoForm = item;
      if (item.photos.length > 0) {
        this.$store.commit('changeAttachment', {
          currentId: item.photos[0].attachmentId,
          attachmentList: item.photos
        });
      }
    },
    changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
      this.activeStatus = key;
      this.filters.isOverdue = item.isOverdue;
    }
  }
};
</script>
