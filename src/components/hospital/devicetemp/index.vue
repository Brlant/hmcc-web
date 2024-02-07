<template>
  <div class="order-page">
    <search-template :isShowAdvance="false" @search="query" @reset="reset">
      <template slot="title">设备类型模板查询</template>
      <template slot="btn">
        <el-button @click="create" plain size="small">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
      <template slot="content">
        <el-form class="advanced-query-form">
          <el-row>
            <oms-form-row :span="0" label="模板名称">
              <el-input v-model="search.templateName" clearable placeholder="模板名称搜索"/>
            </oms-form-row>
            <oms-form-row :span="0" label="设备类型">
              <el-select v-model="deviceWithTemplate" clearable placeholder="设备类型搜索">
                <el-option v-for="(label, value) in coolDevs" :key="`1-${value}`" :value="`1-${value}`" :label="label"/>
                <el-option v-for="(label, value) in medicals" :key="`2-${value}`" :value="`2-${value}`" :label="label"/>
              </el-select>
            </oms-form-row>
          </el-row>
        </el-form>
      </template>
    </search-template>

    <div class="order-list">
      <el-row class="order-list-header">
        <el-col :span="2">序号</el-col>
        <el-col :span="9">模板名称</el-col>
        <el-col :span="5">模版类型</el-col>
        <el-col :span="5">设备类型</el-col>
        <el-col :span="3">操作</el-col>
      </el-row>
      <el-row v-if="loadingData">
        <el-col :span="24">
          <oms-loading :loading="loadingData"></oms-loading>
        </el-col>
      </el-row>
      <el-row v-else-if="dataList.length === 0">
        <el-col :span="24">
          <div class="empty-info">
            暂无信息
          </div>
        </el-col>
      </el-row>
      <div class="order-list-body flex-list-dom" v-else>
        <div :class="[{'active':currentItemId===item.id}]"
             @click.stop.prevent="detail(item)"
             class="order-list-item order-list-item-bg" v-for="(item, index) in dataList">
          <el-row>
            <el-col :span="2">{{ index + 1 }}</el-col>
            <el-col :span="9">{{ item.templateName }}</el-col>
            <el-col :span="5">{{ templateTypes[item.templateType] }}</el-col>
            <el-col :span="5">{{ item.templateType === '1' ? coolDevs[item.devType] : medicals[item.devType] }}</el-col>
            <el-col :span="3">
              <!--<el-button icon="el-icon-search" size="mini" circle @click.stop="detail(item)"></el-button>-->
              <el-button type="primary" icon="el-icon-edit" size="mini" circle @click.stop="modify(item)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" circle @click.stop="remove(item)"></el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="text-center" v-show="dataList.length">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>
    <page-right :css="{'width':'700px','padding':0}" :show="showIndex !== -1" @right-close="rightClose">
      <form-part :formData="formData" :editable="editable" @formBack="formBack"/>
    </page-right>
  </div>
</template>
<script>
import FormPart from './form';
import {sinopharmDictDataType} from '@/api/system/dict/data';
import CommonMixin from '@/mixins/commonMixin';

export default {
  mixins: [CommonMixin],
  components: {FormPart},
  data() {
    return {
      dataList: [],
      total: 0,
      search: {
        templateName: null,
        templateType: null,
        devType: null,
      },
      editable: true,
      // formData: null,
      formData: {},
      showIndex: -1,
      coolDevs: {},
      medicals: {},
      templateTypes: {},
    };
  },
  computed: {
    deviceWithTemplate: {
      get() {
        if (this.search.templateType && this.search.devType) {
          return `${this.search.templateType}-${this.search.devType}`;
        }
        return null;
      },
      set(val) {
        if (val) {
          let arr = val.split('-');
          this.search.templateType = arr[0];
          this.search.devType = arr[1];
        } else {
          this.search.templateType = null;
          this.search.devType = null;
        }
      }
    }
  },
  created() {
    this.queryList();
    this.getDeviceType();
    this.getCoolDevType();
    this.getDeviceTemplateType();
  },
  methods: {
    getDeviceTemplateType() {
      sinopharmDictDataType('deviceTemplateType').then(res => {
        res.data.forEach(item => {
          this.$set(this.templateTypes, item.key, item.label);
        });
      });
    },
    getCoolDevType() {
      sinopharmDictDataType('coolDevType').then(res => {
        res.data.forEach(item => {
          this.$set(this.coolDevs, item.key, item.label);
        });
      });
    },
    getDeviceType() {
      sinopharmDictDataType('device_type').then(res => {
        res.data.forEach(item => {
          this.$set(this.medicals, item.key, item.label);
        });
      });
    },
    queryList(pageNo = 1) {
      let params = {
        ...this.search,
        pageNo: pageNo,
        pageSize: this.pager.pageSize
      }

      this.$http.post('/template/queryListByPage', params).then(res => {
        if (res.code === 200) {
          this.pager.count = res.data.total;
          this.dataList = res.data.list;
        }
      })
    },
    query() {
      this.queryList((this.search.pageNo = 1));
    },
    reset() {
      this.search = {
        templateName: null,
        templateType: null,
        devType: null,
        pageNo: 1,
        pageSize: 10
      };
      this.queryList();
    },
    create() {
      this.editable = true;
      this.showIndex = 0;
    },
    detail(item) {
      this.editable = false;
      this.formData = item;
      this.showIndex = 0;
    },
    modify(item) {
      this.editable = true;
      this.formData = item;
      this.showIndex = 0;
    },
    remove(item) {
      this.$confirm('确定删除该条记录？', '删除', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确定'
      }).then(() => {
        this.$http.get(`/template/deleteById?templateId=${item.templateId}`).then(res => {
          if (res.code === 200) {
            this.queryList((this.search.pageNo = 1));
            return this.$message.success(res.msg || '设备类型模板删除成功');
          }
          this.$message.error(res.msg || '设备类型模板删除失败');
        });
      });
    },
    formBack(refresh) {
      this.showIndex = -1;
      if (refresh) {
        this.query();
      }

      this.formData = {};
    },
    rightClose() {
      this.showIndex = -1;
      this.formData = {};
    },
  }
};
</script>
<style lang="scss" scoped>
.oms-form-row:not(:first-child) {
  margin-left: 10px;
}
</style>
