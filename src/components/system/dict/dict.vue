<style lang="scss" scoped>

.el-form .el-select {
  display: block;
}

.d-table-right {
  .org-name-h2 {
    font-size: 16px;
    font-weight: bold;
  }
}

</style>
<template>
  <div>
    <div class="container d-table">
      <div class="d-table-left">
        <h2 class="header">
          <span class="pull-right">
              <perm label="dict-group-export">
               <el-tooltip content="导出excel" placement="bottom">
                   <a class="btn-circle" href="#" @click.stop.prevent="exportDict">
                  <i class="el-icon-t-export"></i>
                </a>
               </el-tooltip>
              </perm>
              <perm label="dict-group-add">
                <a class="btn-circle" href="#" @click.stop.prevent="addType">
                  <i class="el-icon-t-plus"></i>
                </a>
              </perm>
              <perm label="dict-group-query">
                <a class="btn-circle" href="#" @click.prevent="searchType">
                  <i class="el-icon-t-search"></i>
                </a>
              </perm>
          </span>
          字典组
        </h2>
        <div v-show="showTypeSearch" class="search-left-box">
          <oms-input v-model='typeTxt' :showFocus="showTypeSearch" placeholder="请输入关键字搜索"></oms-input>
        </div>
        <div v-if="loadingLeftData">
          <oms-loading :loading="loadingLeftData"></oms-loading>
        </div>
        <div v-else>
          <div v-if="showTypeList.length===0" class="empty-type-info">
            暂无信息
          </div>
          <el-scrollbar v-if="showTypeList.length!==0" :style="'height:'+bodyHeight" class="d-table-left_scroll"
                        tag="div" @scroll="scrollLoadingData">
            <div class="scrollbar-content">
              <ul class="show-list">
                <li v-for="item in showTypeList" :class="{'active':item.id==currentItem.id}" class="list-item"
                    @click="showType(item)">
                  <span class="hover-show">
                      <perm label="dict-group-softDelete">
                        <a class="pull-right " href="#" @click.prevent="removeType(item)">
                        <i class="el-icon-t-delete"></i>
                        </a>
                      </perm>
                      <perm label="dict-group-update">
                        <a class="pull-right " href="#" @click.prevent="editType(item)">
                          <i class="el-icon-t-edit"></i> </a>
                      </perm>
                  </span>
                  <div class="id-part">
                    字典组值 {{ item.name }}
                  </div>
                  {{ item.label }}
                </li>
              </ul>
            </div>
          </el-scrollbar>
          <div v-if="showTypeList.length!==0" class="btn-left-list-more">
            <bottom-loading></bottom-loading>
            <div v-show="!$store.state.bottomLoading" @click.stop="getMore">
              <el-button v-show="pager.currentPage<pager.totalPage">加载更多</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="d-table-right">
        <el-scrollbar :style="'height:'+bodyHeight" class="d-table-left_scroll" tag="div">
          <div class="scrollbar-content">
            <span class="pull-right" style="padding-top: 10px;padding-right: 10px">
                <perm label="dict-item-query">
                  <span v-show="showSearch" :class="{'open':showSearch}" class="btn-search-toggle">
                    <single-input v-model='keyTxt' :showFocus="showSearch" placeholder="请输入关键字搜索"
                                  @click.stop=""></single-input>
                    <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
                  </span>
                  <a v-show="!showSearch" class="btn-circle" href="#" @click.stop.prevent="showSearch=(!showSearch)">
                    <i class="el-icon-t-search"></i>
                  </a>
                </perm>
                <perm label="dict-item-add">
                  <a class="btn-circle" href="#" @click.stop.prevent='add'>
                    <i class="el-icon-t-plus"></i>
                  </a>
                </perm>
            </span>
            <table class="table table-hover">
              <thead>
              <tr>
                <th>字典项标题</th>
                <th>字典项</th>
                <th>备注</th>
                <th>排序</th>
                <th></th>
              </tr>
              </thead>
              <tbody v-if="loadingRightData">
              <tr>
                <td colspan="5">
                  <oms-loading :loading="loadingRightData"></oms-loading>
                </td>
              </tr>
              </tbody>
              <tbody v-else="!loadingRightData">
              <tr v-if="dataRows.length===0">
                <td colspan="5">
                  <div class="empty-info clearfix">
                    暂无信息
                  </div>
                </td>
              </tr>
              <tr v-for="row in dataRows" :class="{'active':row.id==currentRowItem.id}" @click="showRowItem(row)">
                <td>
                  {{ row.label }}
                </td>
                <td>
                  {{ row.key }}
                </td>
                <td>
                  {{ row.remarks }}
                </td>
                <td>
                  {{ row.sort }}
                </td>
                <td>
                  <perm class="btn-line-block" label="dict-item-update">
                    <a href="#" @click.stop.prevent="edit(row)">
                      <i class="el-icon-t-edit"></i> 编辑
                    </a>
                  </perm>
                  <perm class="btn-line-block" label="dict-item-softDelete">
                    <a href="#" @click.prevent="remove(row)">
                      <i class="el-icon-t-delete"></i>删除
                    </a>
                  </perm>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </el-scrollbar>
      </div>

    </div>
    <page-right :show="showRight" @right-close="resetRightBox">
      <dict-item-form :action="action" :actionType="showRight" :formItem="form" @change="onTypeSubmit"
                      @right-close="resetRightBox"></dict-item-form>
    </page-right>
    <page-right :show="showTypeRight" @right-close="resetRightBox">
      <dict-group-form :action="action" :actionType="showTypeRight" :formItem="dictForm" @change="onSubmit"
                       @right-close="resetRightBox"></dict-group-form>
    </page-right>

  </div>

</template>
<script>
import {DictGroup, DictItem} from '../../../resources';
import dictGroupForm from './form/dictGroup.vue';
import dictItemForm from './form/dictItem.vue';
import ElScrollbar from '@dtop/dtop-web-common/packages/scrollbar';
import utils from '@/tools/utils';

export default {
  components: {dictItemForm, dictGroupForm, ElScrollbar},
  data: function () {
    return {
      currentItem: 0,
      currentRowItem: 0,
      showRight: false,
      showTypeRight: false,
      showTypeSearch: false,
      showSearch: false,
      dataRows: [],
      typeList: [],
      showTypeList: [],
      typeTxt: '',
      keyTxt: '',
      action: '',
      form: {
        id: '',
        groupId: '',
        isShow: 1,
        title: '新增',
        key: '',
        label: '',
        remarks: '',
        sort: ''
      },
      //        oldForm: {},
      dictForm: {
        id: '',
        label: '',
        name: '',
        title: '新增'
      },
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20,
        totalPage: 1
      },
      doing: false,
      loadingLeftData: true,
      loadingRightData: true
    };
  },
  computed: {
    bodyHeight: function () {
      return this.$store.state.bodyHeight;
    }
  },
  filters: {
    formatIsUse: function (value) {
      return value === 1 ? '是' : '否';
    }
  },
  mounted() {
    this.getPageList(1);
    this.pickTypeList();
  },
  watch: {
    'typeTxt': function () {
      this.getPageList(1);
    },
    'keyTxt': function () {
      this.getItemList(this.currentItem.id);
    }
    //       dictForm: {
    //         handler: function (val, oldVal) {
    //           this.autoSaveForm();
    //         },
    //         deep: true
    //       },
    //       "form": {
    //         handler: function (val, oldVal) {
    //           this.autoSaveForm();
    //         },
    //         deep: true
    //       }
  },
  methods: {
    //       autoSaveForm: function () {
    //         if (!this.dictForm.id) {
    //           window.localStorage.setItem("dictTypeForm", JSON.stringify(this.dictForm));
    //         }
    //         if (!this.form.id) {
    //           window.localStorage.setItem("dictForm", JSON.stringify(this.form));
    //         }
    //       },
    scrollLoadingData(event) {
      this.$scrollLoadingData(event);
    },
    getPageList: function (pageNo, isContinue = false) {
      this.pager.currentPage = pageNo;
      let param = Object.assign({}, this.filters, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
        deleteFlag: false,
        keyword: this.typeTxt
      });
      this.loadingLeftData = true;
      //清空右侧数据
      if (!isContinue) {
        //清空右侧数据
        this.dataRows = [];
      }
      DictGroup.query(param).then(res => {
        if (param.keyword !== this.typeTxt) return;
        this.$store.commit('initBottomLoading', false);
        if (res.data.list.length === 0) {
          // 如果字典组数据为空,右侧加载动画关闭
          this.loadingRightData = false;
        }
        if (isContinue) {
          this.showTypeList = this.showTypeList.concat(res.data.list);
        } else {
          this.showTypeList = res.data.list;
          this.currentItem = Object.assign({}, {'id': ''}, res.data.list[0]);
          if (res.data.list.length !== 0) {
            this.getItemList(this.currentItem.id);
          } else {
            this.dataRows = [];
          }
        }
        this.loadingLeftData = false;
        this.pager.totalPage = res.data.totalPage;
      });
    },
    getItemList: function (id) {
      if (id !== '') {
        let param = {
          groupId: id,
          keyword: this.keyTxt,
          deleteFlag: false
        };
        this.loadingRightData = true;
        DictItem.query(param).then(res => {
          this.dataRows = res.data;
          this.loadingRightData = false;
        });
      } else {
        this.currentRowItem = Object.assign({}, {'id': ''});
        this.dataRows = [];
      }
    },
    getMore: function () {
      this.getPageList(this.pager.currentPage + 1, true);
    },
    resetRightBox: function () {
      this.showTypeRight = false;
      this.showRight = false;
    },
    addType: function () {
      this.action = 'add';
      this.dictForm = {
        id: '',
        label: '',
        name: '',
        title: '新增'
      };
      //         let oldForm = window.localStorage.getItem("dictTypeForm");
      //         if (oldForm) {
      //           this.dictForm = Object.assign(this.dictForm, JSON.parse(oldForm));
      //         }
      this.showTypeRight = true;
    },
    editType: function (item) {
      this.action = 'edit';
      this.dictForm = JSON.parse(JSON.stringify(item));
      //        this.oldForm = this.dictForm;
      this.showTypeRight = true;
    },
    searchType: function () {
      this.showTypeSearch = !this.showTypeSearch;
    },
    pickTypeList: function () {
      let arr = [];
      let self = this;
      this.typeList.forEach(function (value) {
        if (value.name.indexOf(self.typeTxt) !== -1) {
          arr.push(value);
        }
      });
      this.showTypeList = arr;
    },
    add: function () {
      this.action = 'add';
      this.form = {
        groupId: this.currentItem.id,
        isShow: 1,
        id: '',
        key: '',
        label: '',
        remarks: '',
        sort: ''
      };
      //         let oldForm = window.localStorage.getItem("dictForm");
      //         if (oldForm) {
      //           this.form = Object.assign(this.form, JSON.parse(oldForm));
      //         }
      this.showRight = true;
    },
    edit: function (item) {
      this.action = 'edit';
      this.form = JSON.parse(JSON.stringify(item));
      //        this.oldForm = this.form;
      this.showRight = true;
      this.currentRowItem = item;
    },
    remove: function (item) {
      this.$confirm('确认删除字典项"' + item.label + '"', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DictItem.delete(item.id).then(() => {
          let index = this.dataRows.indexOf(item);
          this.dataRows.splice(index, 1);
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除字典项"' + item.label + '"'
          });
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '删除字典项"' + item.label + '"失败'
          });
        });
      }).catch(() => {
      });
    },
    removeType: function (item) {
      this.$confirm('删除字典组"' + item.label + '"会一并删除该字典组下的字典项内容,确认删除字典组"' + item.label + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        DictGroup.delete(item.id).then(() => {
          let index = this.showTypeList.indexOf(item);
          this.showTypeList.splice(index, 1);
          this.dataRows = [];
          this.$notify.success({
            duration: 2000,
            title: '成功',
            message: '已成功删除字典组"' + item.label + '"'
          });
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '删除字典组"' + item.label + '"失败'
          });
        });
      }).catch(() => {
      });
    },
    showType: function (type) {
      this.currentItem = type;
      this.getItemList(type.id);
    },
    showRowItem: function (row) {
      this.currentRowItem = row;
    },
    changeDate: function () {
      DictGroup.getAll().then(data => {
        this.$store.commit('initDict', data);
      });
    },
    onSubmit: function (item) {
      if (this.action === 'add') {
        this.showTypeList.splice(0, 0, item);
      } else {
        let idList = [];
        this.showTypeList.forEach(val => {
          idList.push(val.id);
        });
        this.showTypeList.splice(idList.indexOf(this.currentItem.id), 1, item);
      }
      this.showType(item);
      this.changeDate();
    },
    onTypeSubmit: function (item) {
      if (this.action === 'add') {
        this.dataRows.splice(0, 0, item);
      } else {
        let idList = [];
        this.dataRows.forEach(val => {
          idList.push(val.id);
        });
        this.dataRows.splice(idList.indexOf(this.currentRowItem.id), 1, item);
      }
      this.showRowItem(item);
      this.changeDate();
    },
    exportDict() {
      this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '正在导出'});
      this.$http.get('/dictGroup/export').then(res => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        utils.download(res.data.path);
      }).catch(() => {
        this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
      });
    }
  }
};
</script>
