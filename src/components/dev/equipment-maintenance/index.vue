<template>
  <div class="order-page">
    <search-part @search="searchResult" >
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="permPage.add">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
      </template>
    </search-part>
  </div>
</template>

<script>
import SearchPart from './search';
export default {
  name: "index",
  components: {
    SearchPart
  },
  computed: {
    perms() {
      return this.$route.meta.perms;
    },
    permPage() {
      return this.$route.meta.permPage;
    }
  },
  methods:{
    searchResult(){

    },
    add(){

    },
  }
}
</script>

<style scoped>

</style>
