<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @reset="reset" @search="search">
    <template slot="title">{{$route.meta.title}}</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
    <template slot="content">
      <el-form class="advanced-query-form" onsubmit="return false">
        <el-row>
          <el-col :span="8">
            <oms-form-row :span="5" label="单位">
              <org-select :list="povList"
                          :remoteMethod="filterPOV"
                          placeholder="请输入名称搜索单位" v-model="searchCondition.orgId"></org-select>
            </oms-form-row>
          </el-col>
          <el-col :span="8">
            <oms-form-row :span="5" label="日期">
              <el-date-picker class="el-date-picker--mini" placeholder="请选择" type="month"
                              v-model="searchCondition.monthDate" :clearable="false" :pickerOptions="pickerOptions"/>
            </oms-form-row>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </search-template>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data: function () {
      let self = this;
      return {
        searchCondition: {
          orgId: '',
          monthDate: ''
        },
        showSearch: false,
        typeList: this.$parent.typeList,
        list: [],
        times: [],
        orgList: [],
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > self.$moment().subtract(1, 'month').toDate().getTime();
          }
        }
      };
    },
    mounted() {
      this.searchCondition.monthDate = this.$moment().subtract(1, 'month').toDate();
    },
    computed: {
      coolDevType() {
        return this.$getDict('coolDevType');
      },
      type() {
        return this.$route.meta.type;
      }
    },
    methods: {
      search() {
        this.$emit('search', this.searchCondition);
      },
      reset() {
        this.searchCondition = {
          orgId: '',
          monthDate: this.$moment().subtract(1, 'month').toDate()
        };
        this.$emit('search', this.searchCondition);
      }
    }
  };
</script>
