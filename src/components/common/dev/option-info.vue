<template>
  <div>
    <div>
      <span class="pull-left">{{item.devName}}</span>
    </div>
    <div class="select-other-info clearfix">
      <span class="pull-left mr-15">编码:{{item.devCode}}</span>
      <span :class="{'pull-right': item.devCode, 'pull-left': !item.devCode}">类型:{{tempTypeList[item.devType]}}</span>
      <span class="pull-left mr-15" v-show="item.devNo">编号:{{item.devNo}}</span>
    </div>
  </div>
</template>
<script>
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    name: 'devOptionInfo',
    mixins: [methodsMixin],
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  };
</script>
