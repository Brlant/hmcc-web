<style>
  body {
    overflow: auto;
    height: auto;
  }
</style>
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import {Auth} from './resources';

  export default {
    data() {
      return {
        prop: {}
      };
    },
    mounted: function () {
      this.getProp();
      this.login();
    },
    methods: {
      getProp() {
        let search = window.location.search;
        if (search) {
          let ary = search.substr(1).split('&');
          let params = ary.map(m => m.split('='));
          params.forEach(i => {
            this.prop[i[0]] = i[1];
          });
        }
      },
      query() {
        if (!this.prop.code) {
          // 包含cdcerp.net为测试库, 其余为正式库;、
          let appId = location.hostname.includes('cnvss.net') ? 'wxcc4a98c4b703e11a' : 'wx7ee970ae639c3d2c';
          window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${location.protocol}//${location.hostname}/mobile.html?id=${this.prop.id}&response_type=code&scope=snsapi_base`;
          return;
        }
        let loading = this.$loading({fullscreen: true});
        this.$http.post('/ccsWeChat/wechat/codeLogin', null, {
          params: {
            code: this.prop.code
          }
        }).then(res => {
          this.$router.push(`/alarm/${this.prop.id}`);
          loading.close();
        }).catch(() => {
          loading.close();
        });
      },
      login() {
        let loading = this.$loading({fullscreen: true});
        Auth.checkLogin().then(res => {
          this.$router.push(`/alarm/${this.prop.id}`);
          loading.close();
        }).catch(() => {
          this.query();
        });
      }
    }
  };
</script>
