<style lang="scss" scoped>
@import "../../../../assets/scss/mixins";

$leftWidth: 180px;
.min-gutter {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.content-part {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: auto;

  .content-left {
    width: $leftWidth;
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    left: $leftWidth;
    padding: 65px 20px 0 20px;

    .show-content {
      padding: 0 20px;
      display: block;
    }
  }

  .min-gutter {
    .el-form-item {
      margin-bottom: 20px;
    }

    .el-form-item__label {
      font-size: 12px
    }
  }
}

.el-form .el-select {
  display: block;
}

.el-form .el-cascader {
  display: block;
}
</style>

<template>
  <div>
    <div class="content-part">
      <div class="content-left">
        <h2 class="clearfix">添加</h2>
        <ul>
          <li v-for="item in productListSet" :class="{ 'active' : activeIndex===item.key}" class="list-style"
              @click="activeIndex = item.key">
            <span>{{ item.name }}            <span
              v-show="form.orgIdList.length && item.key === 1">({{ form.orgIdList.length }})</span></span>
          </li>
          <li class="text-center" style="margin-top:30px;position:absolute;bottom:50px;left:0;right:0;">
            <el-button :disabled="doing" native-type="submit" type="primary" @click="onSubmit('form')">保存</el-button>
          </li>
        </ul>
      </div>
      <div class="content-right min-gutter">
        <h3 class="clearfix">添加被监管单位</h3>
        <el-form ref="form" v-loading="loading" :model="form"
                 label-width="100px" onsubmit="return false" @submit.prevent="onSubmit()">
          <el-form-item v-show="activeIndex === 0" v-has="'query-all-org-regulation'" :rules="[
            {required: true, message: '请选择监管单位', trigger: 'change'}
          ]" label="监管单位" prop="orgId">
            <el-select v-model="form.orgId" :clearable="true" :remote-method="querySubOrgNew" filterable
                       placeholder="请输入名称搜监管单位" popperClass="good-selects"
                       remote>
              <el-option v-for="org in subOrgNewList" :key="org.id" :label="org.name" :value="org.id">
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
          </el-form-item>
          <div v-show="activeIndex === 0">
            <el-row>
              <el-col :span="12">
                <oms-form-row :span="8" label="单位分类">
                  <el-select v-model="filters.orgRelationType" :clearable="true" class="no-error-input" filterable
                             multiple popperClass="custom-select" remote>
                    <el-option v-for="item in orgRelationType" :key="item.key" :label="item.label" :value="item.key">
                    </el-option>
                  </el-select>
                </oms-form-row>
              </el-col>
              <el-col :span="12">
                <oms-form-row :span="8" label="所在地区">
                  <el-cascader v-model="filters.selectOptions" :checkStrictly="true" :options="options"
                               class="no-error-input" clearable placeholder="请选择省市区"
                               style="display: block" @change="filterObjectOrgList"></el-cascader>
                </oms-form-row>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <oms-form-row :span="8" label="单位名称">
                  <el-input v-model="filters.keyWord" class="no-error-input" placeholder="请输入单位名称"></el-input>
                </oms-form-row>
              </el-col>
              <el-col :span="8">
                <oms-form-row :span="2" label="">
                  <el-button native-type="submit" plain type="primary" @click="searchInOrder">查询</el-button>
                  <el-button @click="resetSearchForm">重置</el-button>
                </oms-form-row>
              </el-col>
            </el-row>
          </div>
          <el-form-item :rules="[{required: true, type: 'array', message: '请选择被监管单位', trigger: 'change'}]" label=""
                        label-position="top" label-width="0"
                        prop="orgIdList">
            <table-paging-select ref="pagingSelect" :column-list="columnList"
                                 :filters="filters" :http-request="httpRequest"
                                 :showNoSelect="activeIndex === 0"
                                 :showSelect="activeIndex === 1" maxHeight="100000" no-select-title="未选被监管单位"
                                 primaryKey="id"
                                 select-title="已选被监管单位" @change="pagingSelectChange"/>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script type="text/jsx">
import {BaseInfo, orgRelation} from '@/resources';
import MethodMixin from '@/mixins/methodsMixin';
import tablePagingSelect from '@/components/common/table-paging-select.vue';
import utils from '@/tools/utils';

export default {
  name: 'editForm',
  mixins: [MethodMixin],
  components: {tablePagingSelect},
  props: {
    showRight: Boolean
  },
  data: function () {
    let orgRelationType = this.$getDict('orgRelationType');
    return {
      form: {
        orgId: '',
        orgIdList: [],
      },
      options: utils.address,
      columnList: [
        {
          label: '单位名称',
          prop: 'name',
          width: 240
        },
        {
          label: '单位分类',
          prop: 'orgRelationTypeList',
          width: 150,
          format(val) {
            if (!val) return '';
            return val.map(m => {
              let item = orgRelationType.find(f => f.key === m);
              return item && item.label || m;
            }).join(',');
          }
        },
        {
          label: '系统代码',
          prop: 'manufacturerCode',
          width: 200
        }
      ],
      filters: {
        orgRelationType: [],
        selectOptions: [],
        keyWord: '',
        province: '',
        city: '',
        region: '',
        auditedStatus: 1,
        state: 0
      },
      productListSet: [
        {key: 0, name: '未选单位'},
        {key: 1, name: '已选单位'}
      ],
      subOrgNewList: [],
      activeIndex: 0,
      doing: false,
      loading: false
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    orgRelationType() {
      return this.$getDict('orgRelationType') || [];
    }
  },
  watch: {
    showRight: function () {
      this.activeIndex = 0;
      if (!this.subOrgNewList.length) {
        this.querySubOrgNew().then(res => {
          this.form = {
            orgId: this.$store.state.user.userCompanyAddress,
            orgIdList: []
          };
        });
      }
      this.resetForm();
      this.$refs.pagingSelect.selectList = [];
      this.$refs.pagingSelect.data = [];
      this.querySubOrgNew();
      this.form = {
        orgId: '',
        orgIdList: []
      };
      if (this.subOrgNewList.length) {
        this.form.orgId = this.$store.state.user.userCompanyAddress;
      }
      this.$nextTick(() => {
        this.$refs['form'] && this.$refs['form'].clearValidate();
      });
    }
  },
  methods: {
    httpRequest(params){
      return BaseInfo.queryPager(params)
    },
    querySubOrgNew(query) { // 被监管单位 //授权主体单位 // 上级单位
      let params = {keyWord: query};
      return orgRelation.querySubOrg(params).then(res => {
        this.subOrgNewList = res.data;
      });
    },
    pagingSelectChange(val) {
      if (val) {
        this.form.orgIdList = val.map(m => m.id);
      } else {
        this.form.orgIdList = [];
      }
      this.$refs.form.validateField('orgIdList');
    },
    filterObjectOrgList(val) {
      let ary = utils.formatAddressByType(val[0], val[1], val[2], 'label');
      this.filters.province = ary[0];
      this.filters.city = ary[1];
      this.filters.region = ary[2];
    },
    searchInOrder() {
      this.$refs.pagingSelect.queryList(1);
    },
    resetForm() {
      this.filters = {
        orgRelationType: [],
        selectOptions: [],
        keyWord: '',
        province: '',
        city: '',
        region: '',
        orgAuditStatus: 1,
        deleteFlag: false
      };
    },
    resetSearchForm() {
      this.resetForm();
      this.$nextTick(() => {
        this.$refs.pagingSelect.queryList(1);
      });
    },
    onSubmit: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid || this.doing) {
          return false;
        }
        this.doing = true;
        orgRelation.save(this.form.orgId, this.form.orgIdList).then(() => {
          this.doing = false;
          this.$notify.success({
            duration: 2000,
            name: '成功',
            message: '添加成功'
          });
          this.$emit('change');
        }).catch(() => {
          this.$notify.error({
            duration: 2000,
            message: '添加失败'
          });
          this.doing = false;
        });
      });
    },
    doClose: function () {
      this.$emit('close');
      this.$refs['form'].resetFields();
    }
  }
};
</script>
