<template>
  <div class="order-page">
    <search-part @search="searchResult"></search-part>
    <oms-loading :loading="loadingData" v-if="loadingData"></oms-loading>
    <chart-line :dataList="tempInfo.ccsDevDataRecordDTOList" :type="filters.valType" v-show="!loadingData"></chart-line>
  </div>
</template>
<script>
  import SearchPart from './search';
  import {TempDev} from '@/resources';
  import ChartLine from './chart-line';

  export default {
    components: {
      SearchPart, ChartLine
    },
    data() {
      return {
        loadingData: false,
        filters: {},
        tempInfo: {}
      };
    },
    watch: {
      filters: {
        handler: function () {
          this.queryList(1);
        },
        deep: true
      }
    },
    methods: {
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      queryList() {
        this.tempInfo.ccsDevDataRecordDTOList = [];
        if (!this.filters.devCode) return;
        this.loadingData = true;
        TempDev.queryTempData(this.filters).then(res => {
          this.tempInfo = res.data;
          this.loadingData = false;
        });
      }
    }
  };
</script>
