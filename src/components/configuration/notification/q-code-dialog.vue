<template>
  <el-dialog :close-on-click-modal="false" :title="dialogTitle" :visible.sync="dialogVisible" center width="350px">
    <div class="text-center" v-loading="!imgUrl">
      <img :src="imgUrl" class="code-img"/>
    </div>
  </el-dialog>
</template>
<script>
  export default {
    data() {
      return {
        imgUrl: '',
        dialogVisible: false,
        dialogTitle: '',
        ticket: ''
      };
    },
    watch: {
      dialogVisible(val) {
        if (!val) {
          this.imgUrl = '';
          this.dialogTitle = '';
        }
      }
    },
    methods: {
      open(imgUrl, item) {
        this.imgUrl = imgUrl ? imgUrl : '/static/img/userpic.png';
        if (item.name) {
          this.dialogTitle = `请"${item.name}"扫描二维码`;
        } else {
          this.dialogTitle = '请扫描二维码';
        }
        this.ticket = item.ticket;
      },
      show() {
        this.dialogVisible = true;
      },
      close() {
        this.dialogVisible = false;
      }
    }
  };
</script>
