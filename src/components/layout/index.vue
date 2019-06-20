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

</style>
<template>
  <div class="app-body full-width">
    <app-header/>
    <el-scrollbar tag="div" class="body_scroll" :class="{dashboard: $route.path === '/dashboard'}">
      <div class="main-body container">
        <transition name="scale" mode="out-in" appear>
          <div class="app-content-view">
            <router-view></router-view>
          </div>
        </transition>
      </div>
    </el-scrollbar>
    <attachmentDialog/>
    <print-dialog/>
    <rule-notify ref="ruleNotify"/>
  </div>
</template>

<script>
  import AppHeader from './app.header.vue';
  import AppFooter from './app.footer.vue';
  import attachmentDialog from '../common/attachment/attachment.dialog.vue';
  import printDialog from '../common/print.loading.vue';
  import ruleNotify from '@/components/common/rule-notify';
  import TimeMixins from '@/mixins/timeMixin';

  export default {
    components: {
      AppHeader,
      AppFooter,
      attachmentDialog,
      printDialog,
      ruleNotify
    },
    mixins: [TimeMixins],
    beforeRouteUpdate(to, from, next) {
      this.$refs.ruleNotify.resetRightBox();
      if (to.path.includes('distribution') || to.path.includes('dashboard')) {
        return next();
      }
      this.clearAllTimes();
      next();
    },
    methods: {
      setBodyHeight: function () {
        this.$store.commit('setBodyHeight', window.innerHeight - 200 + 'px');
      }
    },
    mounted: function () {
      window.addEventListener('resize', (e) => {
        this.setBodyHeight();
      });
      this.setBodyHeight();
    }
  };
</script>
