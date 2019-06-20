<style lang="scss" scoped="">


  .el-form .el-select {
    display: block;
  }

  .d-table-col-wrap {
    overflow: hidden;
  }
</style>
<template>
  <div>
    <div class="d-table">
      <div class="d-table-left">
        <div class="d-table-col-wrap" :style="'height:'+bodyHeight">
          <h2 class="header">
            <span class="pull-right">
                <a v-has="'ccs-department-add'" href="#" class="btn-circle" @click.stop.prevent="addDepartment">
                  <i class="el-icon-t-plus"></i>
                </a>
                <a href="#" class="btn-circle" @click.prevent="searchType">
                  <i class="el-icon-t-search"></i>
                </a>
            </span>
            部门信息
          </h2>
          <el-scrollbar tag="div" class="d-table-left_scroll" @scroll="scrollLoadingData">
            <div class="search-left-box mr-10" v-show="showTypeSearch">
              <oms-input v-model='typeTxt' placeholder="请输入关键字搜索" :showFocus="showTypeSearch"></oms-input>
            </div>
            <div>
              <ul class="show-list">
                <li class="list-item" @click="showAllType(1)" :class="{'active':showAll}">
                  全部
                </li>
                <li v-for="item in showTypeList" class="list-item" @click="showType(item,1)"
                    :class="{'active':item.id==currentItem.id}">
                  <span class="hover-show">
                      <a href="#" v-has="'ccs-department-edit'" @click.stop.prevent="editDepartment(item)"
                         class="pull-right">
                        <i class="el-icon-t-edit"></i>
                      </a>
                      <a href="#" v-has="'ccs-department-delete'" @click.stop.prevent="deleteDepartment(item)"
                         class="pull-right">
                        <i class="el-icon-t-delete"></i>
                      </a>
                  </span>
                  {{item.name}}
                </li>
              </ul>
              <div class="btn-left-list-more">
                <bottom-loading></bottom-loading>
                <div @click.stop="getMore" v-show="!$store.state.bottomLoading">
                  <el-button v-show="pager.currentPage<pager.totalPage">加载更多</el-button>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div class="d-table-right">
        <div class="d-table-col-wrap">
          <div>
            <div class="order-list-status">
              <div class="status-item" :class="{'active':item.status==filters.status}"
                   v-for="(item,key) in orgType"
                   @click="filters.status=item.status">
                <div class="status-bg" :class="['b_color_'+key]"></div>
                <div><i class="el-icon-caret-right" v-if="item.status==filters.status"></i>{{item.title}}<span
                  class="status-num">{{item.num}}</span></div>
              </div>
              <span class="btn-group-right opera-btn">
                <span class="btn-search-toggle open" v-show="true">
                  <single-input v-model="filters.keyWord" style="width: 180px" placeholder="请输入名称搜索"
                                :showFocus="showSearch"></single-input>
                  <i class="el-icon-t-search"></i>
                </span>
                  <a href="#" v-has="'ccs-platform-user-add'" class="btn-circle" @click.stop.prevent="add">
                    <i class="el-icon-t-plus"></i>
                  </a>添加
              </span>
            </div>
          </div>
          <div v-if="dataRows.length == 0" class="empty-info">
            暂无信息
          </div>
          <div v-else class="w-part mt-20 ">
            <el-table style="width: 100%" header-row-class-name="table-header-color"
                      :data="dataRows" :max-height="tableHeight">
              <el-table-column prop="name" label="姓名"></el-table-column>
              <el-table-column prop="name" label="角色">
                <template slot-scope="scope">{{ scope.row.list | formatRole }}</template>
              </el-table-column>
              <el-table-column prop="phone" label="手机号码" min-width="100"></el-table-column>
              <el-table-column prop="email" label="邮箱" min-width="130"></el-table-column>
              <el-table-column prop="status" label="状态" width="70">
                <template slot-scope="scope">
                  <dict :dict-group="'orgUserStatus'" :dict-key="formatStatus(scope.row.status)"></dict>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="操作">
                <template slot-scope="scope">
                  <span v-has="'ccs-platform-user-edit'">
                    <a href="#" @click.stop.prevent="edit(scope.row)"><i class="el-icon-t-edit"></i>编辑</a>
                    <oms-forbid :item="scope.row" @forbided="forbid" :tips='"确认停用平台用户\""+scope.row.name +"\"?"'
                                v-show="scope.row.status!== '2'"><i
                      class="el-icon-t-forbidden"></i>停用
                    </oms-forbid>
                    <oms-forbid :item="scope.row" @forbided="useNormal" :tips='"确认启用平台用户\""+scope.row.name +"\"?"'
                                v-show="scope.row.status=== '2'"><i
                      class="el-icon-t-start"></i>启用
                    </oms-forbid>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <div class="text-center" v-show="dataRows.length">
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
    <page-right :show="showRight" @right-close="resetRightBox">
      <edit-form :formItem="form" :title="formTitle" :action="action" :actionType="showRight" @close="showRight=false"
                 @change="itemChange" @right-close="resetRightBox"></edit-form>
    </page-right>
    <page-right :show="showDepartmentRight" @right-close="resetRightBox">
      <department-form :formItem="departmentForm" :title="formTitle" :action="action" :actionType="showRight"
                       @close="showDepartmentRight=false"
                       @change="departmentChange" @right-close="resetRightBox"></department-form>
    </page-right>
  </div>

</template>
<script>
  import {Department, User} from '../../../resources';
  import utils from '@/tools/utils';
  import editForm from './form/form.vue';
  import departmentForm from './form/department.vue';
  import bgBox from '../../common/bgbox.vue';

  export default {
    components: {
      editForm, bgBox, departmentForm
    },
    data: function () {
      return {
        showTypeRight: false,
        showRight: false,
        showDepartmentRight: false,
        showTypeSearch: false,
        showAll: true,
        showSearch: false,
        dataRows: [],
        filters: {
          keyWord: '',
          status: 1
        },
        orgType: {
//          0: {'title': '所有', 'num': '', 'status': null},
          0: {'title': '正常', 'num': '', 'status': 1},
          1: {'title': '未激活', 'num': '', 'status': 0},
          2: {'title': '停用', 'num': '', 'status': 2}
        },
        activeStatus: 0,
        changeStatus: 4,
        form: {},
        departmentForm: {},
        formTitle: '',
        oldItem: {},
        action: 'add',
        pager: {
          currentPage: 1,
          count: 0,
          pageSize: parseInt(window.localStorage.getItem('currentPageSize'), 10) || 10
        },
        showTypeList: [],
        departmentPager: {
          currentPage: 1,
          count: 0,
          pageSize: 20
        },
        typeTxt: '',
        currentItem: {}
      };
    },
    mounted() {
      this.getDepartmentPage();
      this.showAllType(1);
      // this.getPageList();
    },
    computed: {
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return (height) + 'px';
      },
      tableHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        return height - 140;
      }
    },
    filters: {
      formatRole: function (list) {
        return list.map(m => m.title).join('，');
      }
    },
    watch: {
      'typeTxt': function () {
        this.getDepartmentPage(1);
      },
      filters: {
        handler: function () {
          if (this.showAll) {
            this.showAllType(1);
          } else if (!this.showAll && this.currentItem.id) {
            this.showType(this.currentItem, 1);
          } else {
            this.getPageList(1);
          }
        },
        deep: true
      }
    },
    methods: {
      showAllType: function (pageNo) {
        this.currentItem = {};
        let data = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          objectId: 'ccs-system'
        });
        Department.getMembers(data).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
        });
        this.showAll = true;
        this.queryStatusNum(data);
      },
      showType: function (type, pageNo) {
        let data = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          companyDepartment: type.id,
          objectId: 'ccs-system'
        });
        Department.getOnesMember(type.id, data).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
        });
        this.currentItem = type;
        this.showAll = false;
        this.queryStatusNum(data);
      },
      scrollLoadingData(event) {
        this.$scrollLoadingData(event);
      },
      handleSizeChange(val) {
        this.pager.pageSize = val;
        window.localStorage.setItem('currentPageSize', val);
        if (this.showAll) {
          this.showAllType(1);
        } else if (!this.showAll && this.currentItem.id) {
          this.showType(this.currentItem, 1);
        } else {
          this.getPageList(1);
        }
      },
      handleCurrentChange(val) {
        if (this.showAll) {
          this.showAllType(val);
        } else if (!this.showAll && this.currentItem.id) {
          this.showType(this.currentItem, val);
        } else {
          this.getPageList(val);
        }
      },
      resetRightBox: function () {
        this.showRight = false;
        this.showDepartmentRight = false;
      },
      addType: function () {
        this.showTypeRight = true;
      },
      searchType: function () {
        this.showTypeSearch = !this.showTypeSearch;
      },
      getDepartmentPage: function (pageNo, isContinue = false) {
        this.departmentPager.currentPage = pageNo;
        let param = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          keyword: this.typeTxt,
          objectId: 'ccs-system'
        });
        Department.getPage(param).then(res => {
          if (param.keyword !== this.typeTxt) return;
          this.$store.commit('initBottomLoading', false);
          if (isContinue) {
            this.showTypeList = this.showTypeList.concat(res.data.list);
          } else {
            this.showTypeList = res.data.list;
            this.data = Object.assign({}, {'id': ''}, res.data.list[0]);
          }
          this.departmentPager.totalPage = res.data.totalPage;
        });
        this.queryStatusNum(param);
      },
      queryStatusNum: function (params) {
        Department.queryStateNum(params).then(res => {
          let data = res.data;
          this.orgType[0].num = data['normal'];
          this.orgType[1].num = data['not-active'];
          this.orgType[2].num = data['disable'];
        });
      },
      getPageList: function (pageNo) {
        this.pager.currentPage = pageNo;
        let data = Object.assign({}, this.filters, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
          objectId: 'ccs-system'
        });
        User.query(data).then(res => {
          this.dataRows = res.data.list;
          this.pager.count = res.data.count;
        });
      },
      add: function () {
        this.action = 'add';
        this.form = {};
        this.formTitle = '新增';
        this.showRight = true;
      },
      addDepartment: function () {
        this.action = 'add';
        this.departmentForm = {};
        this.formTitle = '新增';
        this.showDepartmentRight = true;
      },
      edit: function (item) {
        this.action = 'edit';
        this.oldItem = item;
        this.formTitle = '编辑';
        this.form = JSON.parse(JSON.stringify(item));
        this.showRight = true;
      },
      editDepartment: function (item) {
        this.action = 'edit';
        this.formTitle = '编辑';
        this.departmentForm = JSON.parse(JSON.stringify(item));
        this.showDepartmentRight = true;
      },
      deleteDepartment: function (item) {
        this.$confirmOpera(`删除部门"${item.name}"会一并清空部门下的成员，确认删除？`, () => {
          this.$httpRequestOpera(
            this.$http.delete('/oms/department/' + item.id, {}), {
              successTitle: '删除成功',
              errorTitle: '删除失败',
              success: () => {
                this.getDepartmentPage();
                this.showAllType(1);
              }
            });
        });
      },
      forbid: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = '2';
        User.stopUser(itemTemp.id).then(() => {
          item.status = '2';
          this.$notify.success({
            title: '成功',
            message: '已成功停用平台用户"' + item.name + '"'
          });
        });
      },
      useNormal: function (item) {
        let itemTemp = JSON.parse(JSON.stringify(item));
        itemTemp.status = '0';
        User.enableUser(itemTemp.id).then(() => {
          item.status = '0';
          this.$notify.success({
            title: '成功',
            message: '已成功启用平台用户"' + item.name + '"'
          });
        });
      },
      departmentChange: function () {
        this.getDepartmentPage(1);
        this.showDepartmentRight = false;
      },
      itemChange: function (formData) {
        if (!formData.id) {
          this.getPageList(1);
        } else {
          let index = -1;
          this.dataRows.forEach((f, key) => {
            if (f.id === formData.id) {
              index = key;
            }
          });
          if (index !== -1) {
            this.dataRows.splice(index, 1, formData);
          } else {
            this.getPageList(this.pager.currentPage);
          }
        }
        this.showRight = false;
      },
      formatStatus: function (value) {
        if (!value) return '';
        return value.toString();
      },
      exportUserRoles() {
        this.$store.commit('initPrint', {
          isPrinting: true,
          moduleId: this.$route.path,
          text: '拼命导出中'
        });
        let params = {
          objectId: 'ccs-system', type: 0
        };
        this.$http.get('/access/statement/role/export', {params}).then(res => {
          utils.download(res.data.path);
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: this.$route.path,
            text: '拼命导出中'
          });
        }).catch(error => {
          this.$store.commit('initPrint', {
            isPrinting: false,
            moduleId: this.$route.path,
            text: '拼命导出中'
          });
          this.$notify({
            duration: 2000,
            title: '导出失败',
            message: error.response.data.msg,
            type: 'error'
          });
        });
      }
    }
  };
</script>
