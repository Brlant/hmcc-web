<style lang="scss" scoped>
.d-table-right {
  padding: 10px 20px;

  .org-name-h2 {
    font-size: 16px;
    font-weight: bold;
  }
}

.org-list {
  cursor: pointer
}
</style>
<template>
  <div>
    <div>
      <div class="order-list-status container">
        <div v-for="(item,key) in orgStatus" :class="{'active':key===activeStatus,'item-right':item.type===0} "
             class="status-item" @click="changeType(key,item)">
          <div :class="['b_color_'+key]" class="status-bg"></div>
          <div><i v-if="key===activeStatus" class="el-icon-caret-right"></i>{{ item.title }}<span
            class="status-num">{{ item.num }}</span></div>
        </div>
      </div>
      <div class="container d-table">
        <div class="d-table-right">
          <h2>
            <span class="pull-right">
              <span v-show="showSearch" class="btn-search-toggle open">
                  <single-input v-model="filters.keyWord" :showFocus="showSearch" placeholder="请输入关键字搜索"></single-input>
                  <i class="el-icon-t-search" @click.stop="showSearch=(!showSearch)"></i>
              </span>
              <des-btn v-show="!showSearch" icon="search" @click="showSearch=(!showSearch)"/>
              <des-btn v-has="'org-base-manager-add'" icon="plus" @click="add" class="mr-10"/>
              <des-btn v-has="'org-base-manager-export'" icon="export" @click="exportFile"/>
            </span>
            <h2 class="org-name-h2">
              {{ menuTitle }}
              <el-dropdown trigger="click" @command="changeFinds">
                <span class="el-dropdown-link">
                  {{ kindsTitle }}<i class="el-icon-caret-bottom el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="item in kindsMenu" :key="item.key" :command="item.key">{{ item.title }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </h2>
          </h2>

          <div v-show="loadingData">
            <el-row>
              <el-col :span="24">
                <oms-loading :loading="loadingData"></oms-loading>
              </el-col>
            </el-row>
          </div>
          <div v-show="!loadingData&&dataRows.length !== 0">
            <table class="table table-hover">
              <thead>
              <tr>
                <th>系统代码</th>
                <th>{{ orgTitle }}名称</th>
                <!--<th>{{ orgTitle }}级别</th>-->
                <th>{{ orgTitle }}分类</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="row in dataRows" :key="row.id" class="org-list" @click="showItem(row)">
                <td>
                  <el-tooltip :content="`单位ID:${row.id}`" placement="right">
                    <span>{{ row.manufacturerCode }}</span>
                  </el-tooltip>
                  <!--<el-tag type="success" v-show="row.type === '0' && filters.type===1 ">货主</el-tag>-->
                </td>
                <td>
                  {{ row.name }}
                </td>
                <!--<td>-->
                <!--<dict :dict-group="'orgLevel'" :dict-key="row.level"></dict>-->
                <!--</td>-->
                <td>
                  <span v-for="(relationType,index) in row.orgRelationTypeList">
                    <dict :dict-group="'orgRelationType'" :dict-key="relationType"></dict><span
                    v-if="(row.orgRelationTypeList.length-1)!==index">/</span>
                  </span>
                </td>
                <td>
                  <span v-show="row.deleteFlag">停用</span>
                  <span v-show="!row.deleteFlag">
                    <span v-if="row.auditDto.baseInfoStatus === '0'"
                          v-show="row.auditDto.baseInfoStatus === '0'">
                     <li>基础信息待审核</li>
                    </span>
                    <span v-if="row.auditDto.warehouseStatus === '0'"
                          v-show="row.auditDto.warehouseStatus === '0'">
                      <li>仓库地址待审核</li>
                    </span>
                    <span v-if="row.auditDto.baseInfoStatus === '2'"
                          v-show="row.auditDto.baseInfoStatus === '2'">
                      <li>基础信息审核未通过</li>
                    </span>
                    <span
                      v-if="row.auditDto.warehouseStatus === '2'"
                      v-show="row.auditDto.warehouseStatus === '2'">
                      <li>仓库地址审核未通过</li>
                    </span>
                    <span v-if="row.type==='0'&&row.auditDto.baseInfoStatus === '1'
                    && row.auditDto.financeStatus === '1' && row.auditDto.warehouseStatus === '1'">
                      正常
                    </span>
                    <span
                      v-if="row.type==='1'&&row.auditDto.baseInfoStatus === '1' && row.auditDto.warehouseStatus === '1'">
                      正常
                    </span>
                    </span>
                </td>
                <td>
                  <des-btn v-has="'org-base-manager-edit'"
                           icon="edit"
                           @click="edit(row)"
                           class="mr-10">
                    编辑
                  </des-btn>
                  <des-btn v-show="!row.deleteFlag"
                           v-has="'org-base-manager-edit'"
                           icon="forbidden"
                           @click="forbid(row)"
                           class="mr-10">
                    停用
                  </des-btn>
                  <des-btn v-show="row.deleteFlag"
                           v-has="'org-base-manager-edit'"
                           icon="start"
                           @click="enableGoods(row)"
                           class="mr-10">
                    启用
                  </des-btn>
                </td>
              </tr>
              </tbody>
            </table>

            <div v-show="dataRows.length" class="text-center">
              <el-pagination :current-page="pager.currentPage" :page-size="20"
                             :page-sizes="[20,50,100]"
                             :total="pager.count" layout="sizes, prev, pager, next, jumper"
                             @size-change="handleSizeChange"
                             @current-change="handleCurrentChange">
              </el-pagination>
            </div>
          </div>
          <div v-show="!loadingData&&dataRows.length === 0" class="empty-info">
            暂无信息
          </div>
        </div>
      </div>
    </div>
    <page-right :css="{'width':'800px','padding':0}" :show="showRight" @right-close="closeBaseForm">
      <base-form :action="action" :formItem="form" :orgTitle="orgTitle" @change="onSubmit" @close="resetRightBox">
      </base-form>
    </page-right>
    <page-right :css="{'width':'800px','padding':0}" :show="showDetailRight" @right-close="resetRightBox">
      <detail :data="form" :show="showDetailRight" @change="onSubmit"/>
    </page-right>
  </div>

</template>
<script>
import {BaseInfo} from '@/resources';
import baseForm from './form.vue';
import utils from '@/tools/utils';
import Detail from './detail';

export default {
  components: {
    baseForm,
    Detail
  },
  data: function () {
    return {
      loadingData: true,
      showRight: false,
      showDetailRight: false,
      showSearch: false,
      showtext: false,
      data: {},
      dataRows: [],
      typeList: [],
      showTypeList: [],
      typeTxt: '',
      form: {
        address: '',
        adminAccount: '',
        adminEmail: '',
        adminId: '',
        adminName: '',
        adminTelephone: '',
        auditedBy: '',
        auditedStatus: '',
        auditedTime: '',
        contact: '',
        createTime: '',
        createdBy: '',
        creditCode: '',
        defaultCenter: '',
        defaultCentreId: '',
        deleteFlag: false,
        id: '',
        legalRepresentative: '',
        level: '',
        manufacturerCode: '',
        name: '',
        nameJc: '',
        namePhonetic: '',
        orgAuditStatus: '',
        phone: '',
        postcode: '',
        province: '',
        city: '',
        region: '',
        relationList: [],
        remarks: '',
        type: '',
        updateTime: '',
        selectOptions: []
      },
      action: '',
      filters: {
        orgAuditStatus: 1,
        keyWord: this.typeTxt,
        type: '',
        deleteFlag: false,
        orgRelationType: ''
      },
      typePage: 'org',
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      orgStatus: [
        {'title': '待审核', 'num': '', 'type': 1, deleteFlag: false, 'orgAuditStatus': 0},
        {'title': '正常', 'num': '', 'type': 1, deleteFlag: false, 'orgAuditStatus': 1},
        {'title': '停用', 'num': '', 'type': 1, deleteFlag: true}
      ],
      kindsTitle: '全部',
      activeStatus: 1,
      menuTitle: '业务单位管理',
      orgTitle: '单位'
    };
  },
  mounted() {
    this.getOrgPage(1);
    this.setMenuTitle(this.$route.meta.type);
  },
  watch: {
    typeTxt: function () {
      this.getOrgPage(1);
    },
    filters: {
      handler: function () {
        this.getOrgPage(1);
      },
      deep: true
    },
    '$route': function (val) {// 监听路由变化，改变查询参数
      this.filters.type = val.meta.type;
      this.typePage = val.path.substring(1);
      this.setMenuTitle(this.$route.meta.type);
    }
  },
  computed: {
    kindsMenu() {
      let typeList = this.$getDict('orgRelationType');
      let kindsMenu = [{title: '全部', key: ''}];
      if (typeList) {
        typeList.forEach(val => {
          kindsMenu.push({title: val.label, key: val.key});
        });
      }
      return kindsMenu;
    }
  },
  methods: {
    closeBaseForm(item) {
      this.$confirm('信息未保存，是否关闭?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showRight = false
      }).catch(error => {

      });
    },
    exportFile: function () {
      let params = Object.assign({}, this.filters);
      let fileName = '业务单位表';
      this.$store.commit('initPrint', {
        isPrinting: true,
        moduleId: '/org/info'
      });
      // 如果是业务单位将类型字段置空
      if (this.$route.meta.type === 1) {
        params.type = '';
      }
      this.$http.get('/orgs/export', {params}).then(res => {
        utils.download(res.data.path, fileName);
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/org/info'
        });
      }).catch(error => {
        this.$store.commit('initPrint', {
          isPrinting: false,
          moduleId: '/org/info'
        });
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '导出失败'
        });
      });
    },
    itemChange: function (item) {//  处理表单发出的change事件
      this.getPageList(this.pager.currentPage);
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.getOrgPage(1);
    },
    handleCurrentChange(val) {
      this.getOrgPage(val);
    },
    changeFinds: function (val) {
      this.filters.orgRelationType = val;
      this.kindsMenu.forEach(item => {
        if (val === item.key) {
          this.kindsTitle = item.title;
        }
      });
    },
    queryStatusNum: function (params, nowTime) {
      BaseInfo.queryStateNum(params).then(res => {
        if (this.nowTime > nowTime) return;
        let data = res.data;
        this.orgStatus[0].num = data['auditing'];
        this.orgStatus[1].num = data['valid'];
        this.orgStatus[2].num = data['stop'];
      });
    },
    getOrgPage: function (pageNo) {
      // 根据参数，获取单位信息
      this.pager.currentPage = pageNo;
      let param = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }, this.filters);
      if (param.type === 1) {
        param.type = '';
      }
      this.loadingData = true;
      this.nowTime = Date.now();
      let nowTime = this.nowTime;
      this.$http.get('/orgs/pager', {params: param}).then(res => {
        if (this.nowTime > nowTime) return;
        this.dataRows = res.data.list;
        this.pager.count = res.data.count;
      }).catch(error => {
        this.$notify.error({
          message: error.response && error.response.data && error.response.data.msg || '获取数据失败'
        });
      }).finally(() => {
        this.loadingData = false;
      });
      this.queryStatusNum(param, nowTime);
    },
    resetRightBox: function () {
      this.showRight = false;
      this.showDetailRight = false;
    },
    add: function () {
      this.action = 'add';
      this.form = {
        address: '',
        adminAccount: '',
        adminEmail: '',
        adminId: '',
        adminName: '',
        adminTelephone: '',
        auditedBy: '',
        auditedStatus: '',
        auditedTime: '',
        contact: '',
        createTime: '',
        createdBy: '',
        creditCode: '',
        defaultCenter: '',
        defaultCentreId: '',
        deleteFlag: false,
        id: '',
        legalRepresentative: '',
        level: '',
        manufacturerCode: '',
        name: '',
        nameJc: '',
        namePhonetic: '',
        orgAuditStatus: '',
        phone: '',
        postcode: '',
        province: '',
        city: '',
        region: '',
        relationList: [],
        remarks: '',
        type: '',
        updateTime: '',
        selectOptions: []
      };
      this.showRight = true;
    },
    edit: function (item) {
      BaseInfo.queryBaseInfo(item.id).then(res => {
        res.data.orgDto.auditDto = item.auditDto;
        this.form = res.data.orgDto;
        this.action = 'edit';
        this.showRight = true;
      });
    },
    showItem(item) {
      BaseInfo.queryBaseInfo(item.id).then(res => {
        res.data.orgDto.auditDto = item.auditDto;
        this.form = res.data.orgDto;
        this.showDetailRight = true;
      });
    },
    setMenuTitle(type) {// 设置表格的标题
      if (type === 0) {
        this.menuTitle = '货主/厂商管理';
        this.orgTitle = '货主';
      } else {
        this.menuTitle = '业务单位管理';
        this.orgTitle = '单位';
      }
    },
    remove: function (item) {
      this.$confirm('确认删除' + item.name + '?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        BaseInfo.delete(item.id).then(() => {
          // TODO:更新页面，删除该条数据
          this.$notify.success({
            title: '成功',
            message: '已成功删除单位' + item.name
          });
        });
      });
    },
    forbid: function (item) {// 禁用
      this.$confirm('确认停用 ' + item.name + ' ?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.deleteFlag = true;
        BaseInfo.update(item.id, item).then(() => {
          this.getOrgPage();
          this.$notify.success({
            title: '成功',
            message: '已经停用' + item.name
          });
        });
      });
    },
    enableGoods: function (item) {
      this.$confirm('确认启用 ' + item.name + ' ?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.deleteFlag = false;
        BaseInfo.update(item.id, item).then(() => {
          this.getOrgPage();
          this.$notify.success({
            title: '成功',
            message: '已成功启用' + item.name
          });
        });
      });
    },
    changeType: function (key, item) {// 根据当前选中的标签，重置状态等相关参数。
      this.activeStatus = key;
      this.filters.orgAuditStatus = item.orgAuditStatus !== null ? item.orgAuditStatus : null;
      this.filters.deleteFlag = item.deleteFlag;
      this.filters.otherAuditStatus = item.otherAuditStatus;
    },
    onSubmit() {
      this.getOrgPage(1);
      this.resetRightBox();
    }
  }
};
</script>
