<style lang="scss" scoped>
  .order-list-body {
    .cool-content {
      border-bottom: 1px solid #eee;
    }

    .order-list-item {
      cursor: auto;
    }
  }
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'ccs-monitordev-add'">
          <f-a class="icon-small" name="plus"></f-a>
          打印
        </el-button>
      </template>
    </search-part>
    <div class="record-content">
      <div class="record-title">
        <div></div>
        <span></span>
        <div>{{}}</div>
        <span>月冷链设备温度记录表</span>
      </div>
      <div class="record-label">

      </div>
      <div class="record-table">

      </div>
    </div>
  </div>
</template>
<script>
  import SearchPart from './search';


  export default {
    components: {
      SearchPart
    },
    data() {
      return {
        filters: {}
      };
    },
    methods: {
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      resetRightBox() {
        this.showIndex = -1;
      },
      queryList(pageNo) {
        const http = monitorRelation.query;
        this.filters.subordinateFlag = this.type === 2;
        this.queryUtil(http, pageNo);
      }
    }
  };
</script>
