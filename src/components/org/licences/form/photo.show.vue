<style lang="scss" scoped>
.c-photo-list {
  display: flex;
  flex-wrap: wrap;

  img {
    display: block;
    margin: 5px;
    width: 150px;
    height: 150px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
}

.el-row {
  margin-bottom: 15px;
}
</style>
<template>
  <div>
    <h2 class="clearfix">单位证照</h2>
    <oms-row :span="6" label="名称">
      {{ formItem.name }}
    </oms-row>
    <oms-row :span="6" label="开始日期">
      {{ formItem.validStartTime | date }}
    </oms-row>
    <oms-row :span="6" label="截止日期">
      {{ formItem.validEndTime | date }}
    </oms-row>
    <div class="c-photo-list">
      <img v-for="(photo,key) in formItem.photos" :src="photo.attachmentStoragePath"
           @click.stop="showImg(photo)">

    </div>
  </div>
</template>
<script>
export default {
  props: {
    formItem: {}
  },
  methods: {
    showImg: function (file) {
      this.$store.commit('changeAttachment', file.attachmentId);
    }
  }
};
</script>
