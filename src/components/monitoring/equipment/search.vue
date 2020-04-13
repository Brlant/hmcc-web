<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">{{$route.meta.title}}</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="设备名称">
              <oms-input @keyup.native.enter="search" placeholder="请输入名称"
                         v-model.trim="searchCondition.monitorTargetName"></oms-input>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="8" label="设备类型">
              <el-select @change="search" v-model="searchCondition.monitorTargetType" clearable>
                <el-option :key="item.key" :value="item.key" :label="item.label"
                           v-for="item in coolDevType"></el-option>
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="8" label="监控状态">
              <el-radio-group @change="search" size="small" v-model="searchCondition.monitorStatus">
                <el-radio-button label="1">正常</el-radio-button>
                <el-radio-button label="2">告警</el-radio-button>
                <el-radio-button label="0">未监控</el-radio-button>
              </el-radio-group>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row v-show="type === 2">
          <el-col :span="8">
            <oms-form-row :span="5" label="单位">
              <org-select :list="povList"
                          :remoteMethod="filterPOV"
                          placeholder="请输入名称搜索单位" v-model="searchCondition.orgId"></org-select>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import {BaseInfo} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data: function () {
      return {
        searchCondition: {
          monitorTargetName: '',
          monitorTargetType: '',
          monitorStatus: '',
          orgId: ''
        },
        showSearch: false,
        typeList: this.$parent.typeList,
        metaType: '',
        list: [],
        times: [],
        orgList: []
      };
    },
    mounted() {

    },
    computed: {
      coolDevType() {
        return this.$getDict('coolDevType');
      },
      type() {
        // 如果type变更说明页面切换，则清空子组件的值
        if (this.metaType !== this.$route.meta.type) {
          this.reset();
        }
        // 存储type值
        this.metaType = this.$route.meta.type;
        return this.metaType;
      }
    },
    methods: {
      search() {

        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          monitorTargetName: '',
          monitorTargetType: '',
          monitorStatus: '',
          orgId: ''
        };
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      }
    }
  };
</script>
