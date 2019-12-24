<template>
  <div class="order-page">
    <search-part ref="search" @search="searchResult">
      <template slot="btn">
        <el-button plain size="small" @click="exportExcel">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>
        <el-button plain size="small" @click="exportDefaultExcel">
          <f-a class="icon-small" name="export"></f-a>
          导出30分钟间隔Excel
        </el-button>
      </template>
    </search-part>
    <chart-line-multiple :filter="filter"/>
  </div>
</template>
<script>
  import SearchPart from './search';
  import ChartLineMultiple from './chart-line-new-multiple-dev';
  import utils from '@/tools/utils';
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
      },
      exportExcel() {
        this.$refs.search.setSearchCondition();
        let filter = this.$refs.search.searchCondition;
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '拼命导出中'});
        this.$http.post('historical-data/export',filter).then(res => {
          utils.download(res.data.data.path);
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path, text: '拼命导出中'});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path, text: '拼命导出中'});
          this.$notify({
            duration: 2000,
            title: '导出失败',
            message: error.response.data.msg,
            type: 'error'
          });
        });
      },
      exportDefaultExcel() {
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path, text: '拼命导出中'});
        this.$refs.search.setSearchCondition();
        let filter = JSON.parse(JSON.stringify(this.$refs.search.searchCondition));
        filter.statPiece = 30;
        this.$http.post('historical-data/export',filter).then(res => {
          utils.download(res.data.data.path);
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path, text: '拼命导出中'});
        }).catch(error => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path, text: '拼命导出中'});
          this.$notify({
            duration: 2000,
            title: '导出失败',
            message: error.response.data.msg,
            type: 'error'
          });
        });
      }
    }
  };
</script>
