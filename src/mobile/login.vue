<style lang="scss">
  .tn-login {
    padding-top: 50px;

    .el-form-item__label {
      line-height: 24px;
    }
  }

  .logo-part {
    text-align: center;
    color: #409EFF;
    font-weight: bold;
    font-size: 24px;
  }
</style>
<template>
  <div class="tn-login">
    <div class="logo-part">MCC冷链监控</div>
    <el-form :model="user" :rules="rules" @submit.prevent="done" label-position="top" label-width="80px"
             onsubmit="return false" ref="loginForm">
      <el-form-item label="系统代码" prop="orgCode" v-if="needCode">
        <oms-input :showFocus="isFocus === 1" v-model="user.orgCode"></oms-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <oms-input :showFocus="isFocus === 2" @blur="check()" placeholder="手机号/邮箱/用户名"
                   v-model="user.username"></oms-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" style="position:relative">
        <oms-input :showFocus="isFocus === 3" placeholder="请输入密码" type="password"
                   v-model="user.password"></oms-input>
      </el-form-item>
      <el-form-item label="验证码" v-show="showCode">
        <div style="display:flex">
          <div style="width:300px;margin-right:50px">
            <oms-input v-model="user.validateCode"></oms-input>
          </div>
          <div><img :src="codeUrl" @click="getCode" style="cursor:pointer;height: 36px"></div>
        </div>

      </el-form-item>

      <el-form-item label-width="80px">
        <el-button @click="done" native-type="submit" style="display:block;width:100%;" type="primary">
          {{btnString}} <i class="el-icon-loading" v-show="loading"></i></el-button>

      </el-form-item>
    </el-form>
  </div>

</template>

<script>
  import {Auth} from '@/resources';
  import {base64} from '@dtop/dtop-web-common';

  export default {
    name: 'login',
    data: () => {
      return ({
        user: {
          username: window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userAccount : '',
          password: '',
          validateCode: '',
          type: 1,
          orgCode: window.localStorage.getItem('orgCode') ? JSON.parse(window.localStorage.getItem('orgCode')) : ''
        },
        loading: false,
        codeUrl: '',
        showCode: false,
        btnString: '登录',
        isFocus: -1,
        rules: {
          orgCode: [
            {required: true, message: '请输入系统代码', trigger: 'blur'}
          ],
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        },
        needCode: false
      });
    },
    methods: {
      done() {
        this.$refs['loginForm'].validate((valid) => {
          if (valid) {
            this.btnString = '登录中..';
            this.loading = true;
            let userCopy = JSON.parse(JSON.stringify(this.user));
            userCopy.orgCode = this.needCode ? this.trim(this.user.orgCode) : '';
            userCopy.username = this.trim(this.user.username);
            userCopy.encryptionPsw = base64(userCopy.password);
            delete userCopy.password;
            Auth.login(userCopy).then(response => {
              if (!response.data) return;
              let userId = window.localStorage.getItem('userId');
              this.$store.commit('initUser', response.data);
              this.$store.commit('initCode', this.user.orgCode);
              let id = window.localStorage.getItem('id') || 'id';
              this.$router.push(`/alarm/${id}`);
            }, error => {
              let data = error.response.data;
              this.$notify.error({
                message: data.msg
              });
              if (data.code === 101 || data.code === 100) {
                this.getCode();
              }
              if (data.code === 405) {
                this.needCode = true;
              }
              this.btnString = '登录';
              this.loading = false;
            });
          }
        });
      },
      check() {
        console.log(1);
        // 为空时, 不用做判断
        if (!this.user.username) return;
        this.$http.post('/login/check', {username: this.trim(this.user.username)}).catch(error => {
          let data = error.response.data;
          if (data.code === 405) {
            this.needCode = true;
          }
        });
      },
      getCode: function () {
        this.showCode = true;
        this.codeUrl = process.env.VUE_APP_API + '/foundation/CAPTCHA?' + Math.random();
      },
      isFocusIndex() {
        this.isFocus = 2;
      },
      trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
      }
    },
    mounted: function () {
      // 清空权限列表
      this.$store.commit('initPermissions', []);
      this.isFocusIndex();
    }
  };
</script>
