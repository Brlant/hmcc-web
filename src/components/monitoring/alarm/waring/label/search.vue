<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @isShow="isShow" @reset="reset" @search="search">
    <template slot="title">标签告警查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="7">
            <oms-form-row :span="6" label="设备编号/名称/标签sn码">
              <el-input
                v-model="searchCondition.selectText"
                placeholder="设备编号/名称/标签sn码"
                clearable>
              </el-input>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="6" label="楼层">
              <el-cascader
                v-model="searchCondition.floorId"
                style="width: 100%"
                placeholder="楼层"
                :options="floorList"
                :props="{ value: 'id', label: 'floorName', children: 'children',emitPath:false,  }"
                @change="handleChange"
                clearable filterable>
              </el-cascader>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="6" label="设备类型">
              <el-select v-model="searchCondition.devType"  placeholder="设备类型" clearable>
                <el-option
                  v-for="(item,index) in deviceTypeList"
                  :key="index"
                  :label="item.label"
                  :value="item.key"
                />
              </el-select>
            </oms-form-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="7">
            <oms-form-row :span="6" label="所属科室">
              <el-select  placeholder="所属科室" v-model="searchCondition.departmentId" clearable>
                <el-option
                  v-for="(item,index) in deviceDeptList"
                  :key="index"
                  :label="item.departmentName"
                  :value="item.id"
                />
              </el-select>
            </oms-form-row>
          </el-col>
          <el-col :span="7">
            <oms-form-row :span="6" label="异常类型">
              <el-select  placeholder="异常类型" clearable v-model="searchCondition.status">
                <el-option
                  v-for="(item,index) in deviceExceptionList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';
  import {hosDevApi, waringApi} from '@/resources'
  export default {
    mixins: [methodsMixin],
    props: {
      deviceExceptionList:{
        type: Array,
        default: () => {
          return []
        }
      },
      deviceTypeList:{
        type: Array,
        default: () => {
          return []
        }
      },
    },
    data: function () {
      return {
        searchCondition: {
          notifyBegin: '',
          notifyEnd: '',
          type: '',
          way: '',
          status: ''
        },
        showSearch: false,
        list: [],
        times: [],
        // 所属科室
        deviceDeptList: [],
        // 楼层
        floorList: [],
      };
    },
    methods: {
      search() {
        const parent = this.$parent;
        this.searchCondition.notifyBegin = parent.formatTimeAry(this.times, 0);
        this.searchCondition.notifyEnd = parent.formatTimeAry(this.times, 1);
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          notifyBegin: '',
          notifyEnd: '',
          devName: '',
          type: '',
          way: '',
          status: ''
        };
        this.times = [];
        this.$emit('search', this.searchCondition);
      },
      isShow(val) {
        this.showSearch = val;
      },
      /* 获取科室列表 */
      getDeptQueryList() {
        waringApi.getDeptQueryList({}).then(res => {
          this.deviceDeptList = res.data.map(item => {
            return {
              departmentName: item.departmentName,
              departmentPosition: item.departmentPosition,
              id: item.id
            }
          })
        })
      },
      handleChange(query) {
        this.queryParams.floorId = query;
      },
      //楼层
      getQueryFloor() {
        hosDevApi.queryFloor().then(res => {
          this.floorList = res.data.map(item => {
            return {
              floorName: item.floorName,
              floorPosition: item.floorPosition,
              id: item.id,
              children: item.children.length > 0 ? item.children.map(item => {
                return {
                  floorName: item.floorName,
                  floorPosition: item.floorPosition,
                  id: item.id,
                  children: item.children.length > 0 ? item.children : '',
                }
              }) : '',
            }
          })
        }).catch(err => {

        })
      },
    },
    created() {
      //获取科室列表
      this.getDeptQueryList();
      //楼层
      this.getQueryFloor();
    }
  };
</script>
