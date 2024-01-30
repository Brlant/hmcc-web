<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <!--<el-button @click="add" plain size="small" v-has="permPage.add">-->
        <!--  <f-a class="icon-small" name="plus"></f-a>-->
        <!--  添加-->
        <!--</el-button>-->
        <el-button @click="batchAdd" plain size="small" v-has="permPage.add">
          <f-a class="icon-small" name="plus"></f-a>
          批量导入
        </el-button>
      </template>
    </search-part>
    <!--<status-list :activeStatus="activeStatus" :checkStatus="checkStatus" :statusList="statusType"/>-->
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="3">名称</el-col>
        <el-col :span="4">编号</el-col>
        <el-col :span="5">所属单位</el-col>
        <el-col :span="3">型号</el-col>
        <el-col :span="2">状态</el-col>
        <el-col :span="4">校准期</el-col>
        <el-col :span="3">操作</el-col>
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
      <div class="order-list-body flex-list-dom" v-else>
        <div :class="[{'active':currentItemId===item.id}]"
             @click="showItemDetail(item)" class="order-list-item order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="3" class="R">{{item.name}}</el-col>
            <el-col :span="4" class="R">{{item.no}}</el-col>
            <el-col :span="5" class="R">{{item.orgName}}</el-col>
            <el-col :span="3" class="R">{{item.type}}</el-col>
            <el-col :span="2">
              {{formatStatus(item.status, statusType)}}
            </el-col>
            <el-col :span="4">{{item.calibrationTime | date}}</el-col>
            <el-col :span="3" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="permPage.edit">编辑</des-btn>
              <des-btn icon="forbidden" v-show="item.status === '1'" v-has="permPage.stop" @click="stop(item)">停用</des-btn>
              <des-btn icon="start" v-has="permPage.start" v-show="item.status === '0'" @click="start(item)">启用</des-btn>
            </el-col>
          </el-row>
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
      <component :formItem="form" :index="showIndex" :statusType="statusType" :is="currentPart" @change="change" @right-close="resetRightBox"/>
    </page-right>

    <!-- 导入对话框-->
    <el-dialog :visible.sync="importOrderDialogShowFlag" title="导入" width="410px" center>
      <div style="margin-bottom: 22px;">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="downloadTemplate"
        >
          下载模板
        </el-button>
      </div>

      <div>
        <el-upload drag action="#"
                   :auto-upload="false"
                   :on-change="fileChangeHandler"
                   :on-error="importErrorHandler"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传excel文件，且必须符合模板要求</div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form';
  import CommonMixin from '@/mixins/commonMixin';
  import {probe,download} from '@/resources';

  export default {
    name:'ProbeLabel',
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {
          status: '1',
          devCode: '',
          devName: ''
        },
        dialogComponents: {
          0: addForm,
          1: showForm
        },
        defaultPageRight: {'width': '700px', 'padding': 0},
        importOrderDialogShowFlag: false,
      };
    },
    computed: {
      perms() {
        return this.$route.meta.perms;
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
      this.queryList(1);
    },
    methods: {
      showRecordDate: function (data) {
        if (!data) return '';
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
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
        const http = probe.query;
        const params = this.queryUtil(http, pageNo);
        // this.queryStatusNum(params);
      },
      queryStatusNum(params) {
        const pm = Object.assign({}, params, {status: null});
        const http = probe.queryStateNum;
        const res = {};
        this.queryStatusNumUtil(http, pm, this.statusType, res);
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      batchAdd() {
        this.importOrderDialogShowFlag = true;
      },
      edit(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.form = item;
        this.showPart(0);
      },
      showItemDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.showPart(1);
        this.defaultPageRight.width = '900px';
        this.$nextTick(() => {
          this.form = item;
        });
      },
      start(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否启用探头"${item.name}"`, () => {
          this.$httpRequestOpera(probe.start(item.id), {
            successTitle: '启用成功',
            errorTitle: '启用失败',
            success: (res) => {
              if(res.code === 200) {
                item.status = '1';
              } else {
                this.$notify.error({message: res.data.msg})
              }
            }
          });
        });
      },
      stop(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否停用探头"${item.name}"`, () => {
          this.$httpRequestOpera(probe.stop(item.id), {
            successTitle: '停用完成',
            errorTitle: '停用失败',
            success: (res) => {
              if(res.code === 200) {
                item.status = '0';
              } else {
                this.$notify.error({message: res.data.msg})
              }
            }
          });
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      },
      downloadTemplate() {
        download(`/tag/downloadTemplate?type=1`, {}, `探头导入模板_${new Date().getTime()}.xlsx`)
      },
      fileChangeHandler(file) {
        let formData = new FormData()
        formData.append('file', file.raw)
        probe.batchImport(formData).then((res) => {
          this.$message({
            type: 'success',
            message: '导入成功'
          })

          this.getList()
        }).catch((err) => {
          console.log(err,'导入失败')
          this.$message.error(err.message || err.response.data.msg || "导入失败")
        })
      },
      importErrorHandler(err, file) {
        console.log('导入订单失败：', ...err)
      }
    }
  };
</script>
