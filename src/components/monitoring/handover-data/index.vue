<template>
  <div class="order-page">
    <search-part @search="searchResult"/>
    <chart-line :filters="filters" chartWidth="1200px"/>
  </div>
</template>
<script>
  import SearchPart from './search';
  import ChartLine from './chart-line-new';

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
    methods: {
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      }
    }
  };
</script>
