<template>
  <div class="order-page">
    <search-part @search="searchResult"/>
    <chart-line-multiple :filter="filter" chartWidth="1200px"/>
  </div>
</template>
<script>
  import SearchPart from './search';
  import ChartLineMultiple from './chart-line-new-multiple-dev';

  export default {
    components: {
      SearchPart, ChartLineMultiple
    },
    data() {
      return {
        filter: [],
      };
    },
    methods: {
      searchResult: function (search) {
        this.filter = JSON.parse(JSON.stringify(search));
      }
    }
  };
</script>
