<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="perms[0]">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
    <div class="order-list" style="margin-top: 20px">
      <el-row class="order-list-header">
        <el-col :span="4">探头</el-col>
        <el-col :span="4">温度告警</el-col>
        <el-col :span="4">湿度告警</el-col>
        <el-col :span="4">电压告警</el-col>
        <el-col :span="4">离线告警</el-col>
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
        <div :class="[{'active':currentItemId===item.id}]"
             @click="showItemDetail(item)" class="order-list-item order-list-item-bg"
             v-for="item in dataList">
          <el-row>
            <el-col :span="4" class="R">{{item.sensorName}}</el-col>
            <el-col :span="4" class="R">
                <span v-if="item.temperatureAlarmFlag === '1'">
                  高：{{item.temperatureMax}}℃ 低：{{item.temperatureMin}}℃
                </span>
                <el-tag type="primary" :type="item.temperatureAlarmFlag === '1' ? 'success' : 'warning'">
                  {{item.temperatureAlarmFlag === '1' ? '开启' : '关闭'}}</el-tag>
            </el-col>
            <el-col :span="4" class="R">
              <span v-if="item.humidityAlarmFlag === '1'">
                高：{{item.humidityMax}}% 低：{{item.humidityMin	}}%
              </span>
              <el-tag type="primary" :type="item.humidityAlarmFlag ==='1' ? 'success' : 'warning'">
                {{item.humidityAlarmFlag === '1' ? '开启' : '关闭'}}</el-tag>
            </el-col>
            <el-col :span="4" class="R">
              <span v-if="item.voltageAlarmFlag === '1'"> 高：{{item.voltageMax}}V 低：{{item.voltageMin}}V</span>
              <el-tag type="primary" :type="item.voltageAlarmFlag === '1' ? 'success' : 'warning'">
                {{item.voltageAlarmFlag === '1' ? '开启' : '关闭'}}</el-tag>
            </el-col>
            <el-col :span="4">
              <el-tag type="primary" :type="item.offLineFlag === '1' ? 'success' : 'warning'">
                {{item.offLineFlag === '1' ? '开启' : '关闭'}}</el-tag>
            </el-col>
            <el-col :span="4" class="opera-btn">
              <des-btn @click="edit(item)" icon="edit" v-has="perms[1]">编辑</des-btn>
              <des-btn @click="removeItem(item)" icon="edit" v-has="perms[2]">删除</des-btn>
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
      <component :formItem="form" :index="showIndex"  :is="currentPart" @change="change" @right-close="resetRightBox"/>
    </page-right>

  </div>
</template>
<script>
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import showForm from './form/show-form';
  import CommonMixin from '@/mixins/commonMixin';
  import {AlarmRule} from '@/resources';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        filters: {},
        dialogComponents: {
          0: addForm,
          1: showForm
        },
        defaultPageRight: {'width': '700px', 'padding': 0}
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
        const http = AlarmRule.query;
        this.queryUtil(http, pageNo);
      },
      add() {
        this.form = {};
        this.showPart(0);
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
      removeItem(item) {
        this.currentItem = item;
        this.currentItemId = item.id;
        this.$confirmOpera(`是否删除探头"${item.sensorName}"的告警规则`, () => {
          this.$httpRequestOpera(AlarmRule.delete(item.id), {
            errorTitle: '删除失败',
            success: (res) => {
              if(res.data.code === 200) {
                this.queryList(1);
              }
            }
          });
        });
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
