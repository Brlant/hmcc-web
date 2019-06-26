<style lang="scss" scoped>
  .table {
    table-layout: fixed;
    margin-top: 10px;
    font-size: 12px;
    .order-list-item {
      color: #999;
      line-height: 20px;
    }
    border-collapse: separate;
    border-spacing: 0;
    > tbody > tr > td, > thead > tr > th {
      border: 0;
    }
    > thead {
      background: #eff4fb;
    }
    > tbody {
      background: #f6faff;
    }
  }

  .table-product-list {
    > thead > tr > th {
      padding: 5px 5px 5px 0;
    }
    > tbody > tr > td {
      padding: 2px 5px 2px 0;
    }
  }

  .table-product-list {
    margin-bottom: 0;
  }

  .product-title {
    text-align: center;
    border: 1px solid #eee;
    background: #eee;
  }
</style>
<template>
  <div class="order-goods-info">
    <table class="table no-border table-product-list order-list-detail" v-show="devItem.details">
      <thead>
      <tr>
        <th>名称</th>
        <th>编号</th>
        <th>类型</th>
        <th>温度</th>
        <th>湿度</th>
        <th>电压</th>
        <th>数据最后更新时间</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in devItem.details">
        <td>{{item.name}}</td>
        <td>{{item.no}}</td>
        <td>{{item.type}}</td>
        <td>{{item.temp}} ℃</td>
        <td>{{item.humidity}} %</td>
        <td>{{item.voltage}} V</td>
        <td>{{item.time | time}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
  export default {
    props: {
      devItem: Object
    },
  };
</script>
