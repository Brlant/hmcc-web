<style lang="scss" scoped>
@import "../../assets/scss/mixins";

body {
  background: #f5f5f5
}

.main-card-box {
  //height: 469px;
  width: 550px;
  z-index: 1;
  left: 75%;
  top: 48%;
  padding: 30px;
}

.logo-part {
  text-align: center;
  line-height: 80px;
  font-size: 40px;

  img {
    margin-right: 10px;
    vertical-align: middle;
    margin-top: -20px;
  }

  color: $activeColor
}

</style>
<template>
  <!--<el-container style="background: #fff;height: 100%">-->
  <!--  <el-aside>-->
  <!--    <div class="login-bg"></div>-->
  <!--  </el-aside>-->
  <!--  <el-main>-->
  <!--    <el-card class="box-card main-card-box">-->
  <!--      <div class="logo-part clearfix">智慧医院管理系统</div>-->
  <!--      <div style="padding:20px">-->
  <!--        <el-form locate-tag-position="top" ref="loginForm" locate-tag-width="80px" :model="user" :rules="rules"-->
  <!--                 @submit.prevent="done" onsubmit="return false">-->
  <!--          <el-form-item locate-tag="账号" prop="username">-->
  <!--            <oms-input v-model="user.username" :showFocus="isFocus === 2" placeholder="手机号/邮箱/用户名"-->
  <!--                       @blur="check()"></oms-input>-->
  <!--          </el-form-item>-->
  <!--          <el-form-item locate-tag="密码" style="position:relative" prop="password">-->
  <!--            <oms-input v-model="user.password" :showFocus="isFocus === 3" type="password"-->
  <!--                       placeholder="请输入密码"></oms-input>-->
  <!--            <router-link style="position: absolute;top:-35px;right:0;" to="/forget">激活账号/忘记密码?</router-link>-->
  <!--          </el-form-item>-->
  <!--          <el-form-item locate-tag="验证码" v-show="showCode">-->
  <!--            <div style="display:flex">-->
  <!--              <div style="width:300px;margin-right:50px">-->
  <!--                <oms-input v-model="user.validateCode"></oms-input>-->
  <!--              </div>-->
  <!--              <div><img :src="codeUrl" @click="getCode" style="cursor:pointer;height: 36px"></div>-->
  <!--            </div>-->

  <!--          </el-form-item>-->

  <!--          <el-form-item locate-tag-width="80px">-->
  <!--            <el-button type="primary" @click="done" style="display:block;width:100%;" native-type="submit">-->
  <!--              {{ btnString }} <i class="el-icon-loading" v-show="loading"></i>-->
  <!--            </el-button>-->
  <!--          </el-form-item>-->
  <!--        </el-form>-->
  <!--      </div>-->
  <!--    </el-card>-->
  <!--    <div class="login-bg"></div>-->
  <!--  </el-main>-->
  <!--</el-container>-->
  <div>
    <el-card class="box-card main-card-box">
      <div class="logo-part clearfix">智慧医院管理系统</div>
      <div style="padding:20px">
        <el-form label-position="top" ref="loginForm" label-width="80px" :model="user" :rules="rules"
                 @submit.prevent="done" onsubmit="return false">
          <el-form-item label="账号" prop="username">
            <oms-input v-model="user.username" :showFocus="isFocus === 2" placeholder="手机号/邮箱/用户名"
                       @blur="check()"></oms-input>
          </el-form-item>
          <el-form-item label="密码" style="position:relative" prop="password">
            <oms-input v-model="user.password" :showFocus="isFocus === 3" type="password"
                       placeholder="请输入密码"></oms-input>
            <router-link style="position: absolute;top:-35px;right:0;" to="/forget">激活账号/忘记密码?</router-link>
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
            <el-button type="primary" @click="done" style="display:block;width:100%;" native-type="submit">
              {{ btnString }} <i class="el-icon-loading" v-show="loading"></i>
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="login-bg"></div>
  </div>
</template>

<script>
import {Auth} from '@/resources';
import AppFooter from '../layout/app.footer.vue';
import {base64} from '@dtop/dtop-web-common';

export default {
  name: 'login',
  components: {AppFooter},
  data: () => {
    return {
      user: {
        username: window.localStorage.getItem('user') ? JSON.parse(window.localStorage.getItem('user')).userAccount : '',
        password: '',
        validateCode: '',
        type: 1,
        // orgCode: window.localStorage.getItem('orgCode') ? JSON.parse(window.localStorage.getItem('orgCode')) : ''
      },
      loading: false,
      codeUrl: '',
      showCode: false,
      btnString: '登录',
      isFocus: -1,
      rules: {
        orgCode: [
          {required: true, message: '请输入系统代码', trigger: ['blur', 'change']}
        ],
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ]
      }
    };
  },
  computed: {
    orgCodeList() {
      return JSON.parse(window.localStorage.getItem('orgCodeList')) || [];
    },
  },
  methods: {
    done() {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.btnString = '登录中..';
          this.loading = true;
          let userCopy = JSON.parse(JSON.stringify(this.user));
          userCopy.username = this.trim(this.user.username);
          userCopy.encryptionPsw = base64(userCopy.password);
          delete userCopy.password;
          Auth.login(userCopy).then(response => {
            this.loading = false;
            if (!response.data) {
              this.$message.error("登录失败")
              return;
            }

            let userId = window.localStorage.getItem('userId');
            this.$store.commit('initUser', response.data);
            this.$store.commit('initCode', this.user.orgCode);
            // this.$nextTick(function () {
            //   if (userId === response.data.userId) {
            //     let lastUrl = window.localStorage.getItem('lastUrl');
            //     if (lastUrl && lastUrl.indexOf('/login') === -1 && lastUrl.indexOf('/logout') === -1) {
            //       window.localStorage.removeItem('lastUrl');
            //       window.location.href = lastUrl;
            //       return lastUrl;
            //     }
            //   } else {
            //     this.$router.replace('/');
            //   }
            //   this.$router.replace('/');
            // });
            this.$emit('login');
            this.queryWeChat();
          }, error => {
            let data = error.response.data;
            this.$notify.error({
              message: data.msg || '无法登录'
            });
            if (data.code === 101 || data.code === 100) {
              this.getCode();
            }

            this.btnString = '登录';
            this.loading = false;
          });
        }
      });
    },
    check() {
      // 为空时, 不用做判断
      if (!this.user.username) return;
      this.$http.post('/login/check', {username: this.trim(this.user.username)}).catch(error => {
        if (error.response.status === 405) {
          let list = error.response.data && error.response.data.map(m => ({value: m}));
          window.localStorage.setItem('orgCodeList', JSON.stringify(list || ''));
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
    },
    queryWeChat() {
      Auth.queryWeChatInfo().then(res => {
        this.$store.commit('initWeChatInfo', res.data);
      }).catch(() => {
        this.$store.commit('initWeChatInfo', {});
      });
    }
  },
  mounted: function () {
    // 清空权限列表
    this.$store.commit('initPermissions', []);
    this.isFocusIndex();
  }
}
</script>
