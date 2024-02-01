<style lang="scss" scoped>
@import '../../../assets/scss/mixins';

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

.order-list-item {
  cursor: default !important;
}

.pt10 {
  padding-top: 10px;
}

.cursor-span {
  cursor: pointer;
}

.opera-btn-bidder {
  a:hover {
    color: $activeColor;
  }
}
</style>
<template>
  <div class="order-page">
    <div class="container">
      <div :class="{up:!showSearch}" class="opera-btn-group">
        <div class="opera-icon">
          <des-btn v-has="'org-relation-manage-add'" class="pull-right mr-10" icon="plus" @click="add">添加</des-btn>
          <span class="pull-left switching-icon" @click="showSearch = !showSearch">
            <i class="el-icon-arrow-up"></i>
            <span v-show="showSearch">收起筛选</span>
            <span v-show="!showSearch">展开筛选</span>
          </span>
        </div>
        <el-form v-show="showSearch" class="advanced-query-form clearfix"
                 onsubmit="return false" style="padding-top: 10px">
          <el-row>
            <el-col :span="8">
              <oms-form-row :span="6" label="监管单位">
                <el-select v-model="searchCondition.orgId" :clearable="true" :remote-method="querySubOrg" filterable
                           placeholder="请输入名称搜监管单位" popperClass="good-selects"
                           remote>
                  <el-option v-for="org in subOrgList" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="6" label="被监管单位">
                <el-select v-model="searchCondition.subordinateId" :clearable="true" :remote-method="queryALLObjectOrg"
                           filterable
                           placeholder="请输入名称搜被监管单位" popperClass="good-selects"
                           remote>
                  <el-option v-for="org in objectOrgList" :key="org.id" :label="org.name" :value="org.id">
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
              <oms-form-row :span="6" label="被监管单位单位类型">
                <el-select v-model="searchCondition.orgTypeList" multiple placeholder="请选择单位类型">
                  <el-option v-for="item in orgRelationType" :key="item.key" :label="item.label"
                             :value="item.key"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <oms-form-row :span="6" label="被监管单位所在地区">
                <el-cascader ref="elCascader" v-model="searchCondition.selectOptions" :checkStrictly="true"
                             :options="options"
                             clearable
                             placeholder="请选择省市区" style="display: block"></el-cascader>
              </oms-form-row>
            </el-col>
            <el-col :span="8">
              <oms-form-row :span="6" label="单位关系类型">
                <el-select v-model="searchCondition.type" placeholder="请选择单位关系类型">
                  <el-option v-for="item in orgRelation" :key="item.key" :label="item.label"
                             :value="item.key"></el-option>
                </el-select>
              </oms-form-row>
            </el-col>
            <el-col :span="5">
              <oms-form-row :span="3" label="">
                <el-button native-type="submit" type="primary" @click="searchPage">查询</el-button>
                <el-button native-type="reset" @click="resetSearchForm">重置</el-button>
              </oms-form-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="order-list clearfix">
        <el-row class="order-list-header">
          <el-col :span="8">监管单位</el-col>
          <el-col :span="8">被监管单位</el-col>
          <el-col :span="4">单位关系类型</el-col>
          <el-col :span="4">操作</el-col>
        </el-row>
        <el-row v-if="loadingData">
          <el-col :span="24">
            <oms-loading :loading="loadingData"></oms-loading>
          </el-col>
        </el-row>
        <el-row v-else-if="dataRows.length === 0">
          <el-col :span="24">
            <div class="empty-info">
              暂无信息
            </div>
          </el-col>
        </el-row>
        <div v-else class="order-list-body flex-list-dom">
          <div v-for="item in dataRows" :class="[{'active':currentItem.id === item.id}]"
               class="order-list-item order-list-item-bg">
            <el-row>
              <el-col :span="8">{{ item.orgName }}</el-col>
              <el-col :span="8">{{ item.subordinateName }}</el-col>
              <el-col :span="4">
                <dict :dict-group="'orgRelation'" :dict-key="item.type"></dict>
              </el-col>
              <el-col :span="4" class="opera-btn-bidder">
                <des-btn v-has="'org-relation-manage-delete'" icon="remove" @click="remove(item)" class="mr-10">删除
                </des-btn>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
    <div v-show="dataRows.length && !loadingData" class="text-center">
      <el-pagination
        :current-page="pager.currentPage"
        :page-sizes="[10,20,50,100]" :pageSize="pager.pageSize"
        :total="pager.count"
        layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
        @size-change="handleSizeChange">
      </el-pagination>
    </div>
    <page-right :css="{'width':'900px','padding':'30px'}" :show="showRight" @right-close="resetRightBox">
      <edit-form :showRight="showRight" @change="itemChange" @close="showRight=false"></edit-form>
    </page-right>
  </div>
</template>
<script>
import editForm from './form/form.vue';
import {orgRelation} from '@/resources';
import MethodMixin from '@/mixins/methodsMixin';
import utils from '@/tools/utils';

export default {
  components: {
    editForm
  },
  mixins: [MethodMixin],
  data: function () {
    return {
      showRight: false,
      showSearch: true,
      loadingData: false,
      formItem: {},
      dataRows: [],
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      },
      currentItem: {},
      searchCondition: {
        subordinateId: '',
        orgId: '',
        orgTypeList: [],
        selectOptions: [],
        type: ''
      },
      options: utils.address
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    orgRelationType() {
      return this.$getDict('orgRelationType');
    },
    orgRelation() {
      return this.$getDict('orgRelation');
    }
  },
  mounted() {
    this.getPageList(1);
  },
  methods: {
    resetRightBox: function () {
      this.showRight = false;
    },
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.getPageList(1);
    },
    handleCurrentChange(val) {
      this.getPageList(val);
    },
    getPageList: function (pageNo) {
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
      }, JSON.parse(JSON.stringify(this.searchCondition)));

      if (params.selectOptions.length) {
        let selectOptions = this.$refs.elCascader.getCheckedNodes(true);
        let labels = selectOptions[0].pathLabels || [];
        labels[0] && (params.provinceCode = labels[0]);
        labels[1] && (params.cityCode = labels[1]);
        labels[2] && (params.areaCode = labels[2]);
      }

      delete params.selectOptions;
      this.loadingData = true;
      orgRelation.query(params).then(res => {
        this.dataRows = res.data.list;
        this.pager.count = res.data.count;
        this.loadingData = false;
      });
    },
    add: function () {
      this.formItem = {};
      this.showRight = true;
    },
    remove: function (item) {
      this.$confirm('是否删除被监管单位 "' + item.subordinateName + '"?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        orgRelation.delete(item.id).then(() => {
          this.$notify.success({
            message: '删除成功'
          });
          this.getPageList();
        }).catch(error => {
          this.$notify.error({
            message: error.response && error.response.data && error.response.data.msg || '删除失败'
          });
        });
      });
    },
    itemChange: function (item) {
      this.getPageList(this.pager.currentPage);
      this.showRight = false;
    },
    formatDate(param) {
      this.searchCondition.year = param ? this.$moment(param).format('YYYY') : '';
    },
    resetSearchForm: function () {// 重置表单
      let temp = {
        subordinateId: '',
        orgId: '',
        orgTypeList: [],
        selectOptions: [],
        type: ''
      };
      Object.assign(this.searchCondition, temp);
      this.getPageList(1);
    },
    searchPage() {
      this.getPageList();
    }
  }
};
</script>
