<style lang="scss">

  /*.d-table {*/
  /*min-height: 500px;*/
  /*}*/

  .btn-left-list-more {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 5;
    background: rgba(255, 255, 255, 0.9);
    text-align: center;

    .el-button {
      border: none;
      color: #666;
      background: 0 0;
      padding-left: 0;
      padding-right: 0;

      &:hover {
        color: #333
      }
    }
  }

  .min-div {
    height: 0;
    width: 0;
    display: inline;
    overflow: hidden;
    line-height: 0;
  }

  .app-body-org {
    padding-top: 0;

    .layer-loading {
      top: 0
    }
  }

  .main-body__el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .app-content-view {
      padding: 0 10px;
    }
  }

</style>
<template>
  <div class="app-body full-width" :style="'padding-left:'+bodyLeft">
    <app-header/>
    <div class="main-body">
      <el-scrollbar :style="{height: '100%'}" class="main-body__el-scrollbar">
        <transition name="scale" mode="out-in" appear>
          <router-view class="app-content-view"></router-view>
        </transition>
      </el-scrollbar>
    </div>
    <attachmentDialog/>
    <print-dialog/>
  </div>
</template>

<script>
  import AppHeader from './app.header.vue';
  import AppFooter from './app.footer.vue';
  import attachmentDialog from '../common/attachment/attachment.dialog.vue';
  import printDialog from '../common/print.loading.vue';
  import TimeMixins from '@/mixins/timeMixin';

  export default {
    data: () => ({
      needCheck: false,
    }),
    components: {
      AppHeader,
      AppFooter,
      attachmentDialog,
      printDialog
    },
    mixins: [TimeMixins],
    beforeRouteUpdate(to, from, next) {
      this.clearAllTimes();
      next();
    },
    methods: {
      // 显示安全提示
      showTip() {
        // 如果需要修改密码，给出提示：您当前登录密码使用已超过xx天，为保证您的账号安全，请立即修改。
        this.$alert('您当前登录密码使用已超过' + this.days + '天，为保证您的账号安全，请立即修改。', '安全提示', {
          confirmButtonText: '去修改', center: true, showClose: false
        }).then(() => {
          this.$router.replace("/resetpsw")
        }).catch(err => {
          console.log("加载alert异常", err)
        });

        this.needCheck = false;
      },
      setBodyHeight: function () {
        this.$store.commit('setBodyHeight', window.innerHeight - 200 + 'px');
      }
    },

    computed: {
      bodyLeft: function () {
        return this.$store.state.bodySize['left'];
      },
      updatePassFlag() {
        return this.$store.state.user['updatePassFlag'];
      },
      days() {
        return this.$store.state.user['passwordRule'];
      },
      checkPwd: function () {
        return this.needCheck && this.updatePassFlag;
      }
    },
    watch: {
      checkPwd(val) {
        if (val) {
          setTimeout(this.showTip, 200);
        }
      }
    },
    mounted: function () {
      window.addEventListener('resize', (e) => {
        this.setBodyHeight();
      });
      this.setBodyHeight();

      this.needCheck = true;
      // 监听后退和地址栏变化
      window.addEventListener('popstate', (e) => {
        // 当用户手动后退或者修改地址栏的时候，重新触法一次密码校验
        let hash = e.currentTarget.location.hash;
        // 定义那些页面不需要安全提示
        let ext = hash.indexOf('login') !== -1 || hash.indexOf('resetpsw') !== -1 || hash.indexOf('forget') !== -1;
        if (ext) {
          console.log("popstate.location.hash", hash);
          return;
        }

        this.needCheck = true;
      });
    }
  };
</script>
