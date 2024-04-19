<style lang="scss" scoped>
.el-form::after {
  content: '';
  clear: both;
  display: table;
}
</style>
<template>
  <search-template :isShow="showSearch" :isShowAdvance="false" @search="search" @reset="reset" @isShow="isShow">
    <template slot="title">维保单查询</template>
    <template slot="btn">
      <slot name="btn"></slot>
    </template>
  </search-template>
</template>

<script>
export default {
  name: "search",
  data(){
    return{
      showSearch: false,
      searchCondition:{

      }
    }
  },
  methods:{
    search() {
      this.$emit('search', this.searchCondition);
    },
    reset() {
      this.searchCondition = {

      };
      this.$emit('search', this.searchCondition);
    },
    isShow(val) {
      this.showSearch = val;
    }
  }
}
</script>

<style scoped>

</style>
