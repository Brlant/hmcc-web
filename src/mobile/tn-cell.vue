<style lang="scss" scoped>
  .tn-cell {
    background: #fff;
    padding: 5px 8px;
    border-bottom: 1px solid #f8f8f8;
  }

  .content {
    text-align: center;
  }
</style>
<template>
  <el-row class="tn-cell">
    <el-col :span="span" class="left">
      {{label}}
    </el-col>
    <el-col :span="24-span" class="content">
      <slot></slot>
    </el-col>
  </el-row>
</template>
<script>
  export default {
    props: {
      span: {
        type: Number,
        default: 8
      },
      label: String
    }
  };
</script>
