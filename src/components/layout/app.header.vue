<style lang="scss" scoped=''>
  @import "../../assets/scss/mixins";

  $menuHoverColor: $activeColor;
  $menuHoverBg: #f1f1f1;
  .main-header {
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    z-index: 800;
    box-shadow: 0 5px 5px rgba(221, 221, 221, 0.22);

    ul, li {
      padding: 0;
      margin: 0;
      list-style: none
    }

    a {
      text-decoration: none
    }

    .container {
      position: relative;
    }

    .top-logo {
      display: flex;
      align-items: center;
      line-height: 60px;
      font-size: 22px;
      font-weight: bold;
      text-align: center;

      > div:first-child {
        height: 60px;
      }

      .logo-img {
        display: flex;
        align-items: center;
      }

      .logo_pic {
        display: block;
        height: 30px;
        margin-right: 10px;
      }

      .sub-title {
        display: none
      }

      &.mix-logo {
        img {
          margin-top: 17px;
          height: 36px;
        }

        .main-title {
          line-height: 26px;
          font-size: 18px;
        }

        .sub-title {
          display: block;
          font-size: 12px;
          font-weight: normal;
          line-height: 12px;
        }

      }
    }

    .top-menu {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 200px;
      z-index: 1;
      right: 0;

      > ul {
        height: 100%;
        display: flex;

        > li {
          margin: 0 5px;
          position: relative;

          > span {
            border-top: 4px solid #fff;
            position: relative;
            padding: 0 18px;
            display: block;
            z-index: 2;
            background: #fff;

            a {
              display: block;
              line-height: 54px;
              font-size: 14px;
              color: #333;

              &:hover {
                color: $menuHoverColor
              }
            }
          }

          &.active, &:hover {
            > span {
              border-color: $menuHoverColor;
            }

            a {
              color: $menuHoverColor
            }
          }

          &.hover {
            > span {
              background: $menuHoverBg;
            }

            .top-sub-menu {
              transform: translateY(0);
              box-shadow: 0 3px 3px hsla(0, 0%, 0%, 0.22)
            }

            background: $menuHoverBg;

          }

          .top-sub-menu {
            padding-top: 55px;
            z-index: 1;
            overflow: hidden;
            transition: 0.2s all ease-in-out;
            position: absolute;
            text-align: center;
            left: 0;
            right: 0;
            top: 0;
            transform: translateY(-100%);
            background: $menuHoverBg;
            white-space: nowrap;

            .top-sub-item {
              line-height: 35px;
              cursor: pointer;

              &:hover {
                background: $activeColor;
                color: #fff;
              }
            }
          }

        }
      }
    }

    .top-right {
      position: absolute;
      right: 0;
      width: auto;
      z-index: 3;
      top: 50%;
      transform: translateY(-50%);

      .top-right-item {
        border-radius: 18px;
        background: #ebebeb;
        line-height: 26px;
        display: inline-block;
        padding: 3px 10px;
        cursor: pointer;

        img {
          vertical-align: middle;
          height: 23px;
          width: 23px;
          border: 1px solid #eee;
          border-radius: 50%;
        }
      }

    }
  }

  .top-right-user-dropdown {
    margin-top: 1px;
    padding: 10px;
    box-shadow: 1px 1px 1px #eee;
    border-color: #eee
  }

  .menu-user-part {
    display: flex;
    align-items: center;

    > div > img {
      margin-right: 10px;
      border-radius: 50%;
      height: 40px;
      width: 40px;
      border: 1px solid #eee
    }

    .menu-usr-part-phone {
      color: #666;
      font-size: 12px;
    }
  }

  .menu-user {
    padding: 8px 10px;

    .last-login {
      color: #999;
      font-size: 12px;
      margin: 10px 0;
    }

    a {
      color: $activeColor;
      font-size: 12px;
    }
  }


</style>

<template>
  <div>
    <header class="main-header">
      <div class="container">
        <router-link to='/' class="a-link">
          <div class="top-logo" :class="{'mix-logo':logisticsCentreName}">
            <div class="logo-img">
              <img :src="logo_pic" class="logo_pic" @click="activeId=''">
            </div>
            <div>
              <div class="main-title">MCC冷链监控</div>
              <el-tooltip effect="dark" :content="logisticsCentreName" placement="bottom">
                <div class="sub-title">
                  {{ logisticsCentreName.length > 10 ? logisticsCentreName.slice(0, 10) : logisticsCentreName }}
                </div>
              </el-tooltip>
            </div>

          </div>
        </router-link>
        <nav class="top-menu">
          <ul>
            <li v-for="item in menu" :key="menu.path"
                :class="{'active':activeId === item.meta.moduleId,'hover':hoverItem===item}"
                @mouseenter="hoverItem=item"
                @mouseleave="hoverItem={}" @click.stop.prevent="goTo(item.children.length ? item.children[0]:item)">
                <span v-has="item.meta.perm">
                   <a href="#">
                    <i :class="'el-icon-t-'+item.meta.icon" style="font-size: 18px"></i> {{item.meta.title}}</a>
                </span>
              <ul class="top-sub-menu" v-if="item.children.length">
                <li class="top-sub-item" v-for="child in item.children" :key="child.path"
                    @click.stop.prevent="checkSubMenu(child)">{{ child.meta.title}}
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <div class="top-right">
          <div class="top-user">
            <el-dropdown trigger="click">
              <div class="el-dropdown-link top-right-item">
                <compressed-img v-if="user.userIcon" :src="user.userIcon+'?image&action=resize:w_50,h_50,m_2'"/>
                <img v-else src="/static/img/userpic.png"> {{user.userName}}
                <i class="el-icon-caret-bottom"></i>
              </div>
              <el-dropdown-menu class="top-right-user-dropdown" slot="dropdown">
                <div class="menu-user">
                  <div class="menu-user-part">
                    <div>
                      <oms-upload-picture :photoUrl="user.userIcon ? user.userIcon : ''"
                                          class="user-img"></oms-upload-picture>
                    </div>
                    <div>
                      <div class="menu-usr-part-user">{{user.userName}}</div>
                      <div class="menu-usr-part-phone">{{user.userAccount}}</div>
                    </div>
                  </div>
                  <div class="last-login">上次登录时间:{{user.userLastLoginTime | time}}</div>
                  <div class="text-right">
                    <router-link style="float: left; margin-top: 2px;" to="/resetpsw">重置密码</router-link>
                    <a href="#" @click.stop.pre="logout">退出</a>
                  </div>
                </div>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>
    <div class="sub-menu" v-if="subMenu.length>0">
      <div class="container">
        <a v-for="(item,key) in subMenu" :href="item.path"
           @click.stop.prevent="goTo(item)"
           class="btn btn-sub-menu"
           :class="{'active':selectSubmenu(item)}">{{item.meta.title}}</a>
      </div>
    </div>
  </div>
</template>

<script>
  import logo_pic from '@/assets/img/logo_pic.png';
  import omsUploadPicture from '@/components/common/upload/upload.user.picture.vue';
  import {Auth} from '@/resources';

  export default {
    components: {omsUploadPicture},
    props: ['toRoute'],
    data() {
      return {
        activeId: this.$route.meta.moduleId,
        logo_pic: logo_pic,
        hoverItem: {},
        logisticsCentreName: window.localStorage.getItem('logisticsCentreName') || ''
      };
    },
    computed: {
      user: function () {
        return Object.assign({}, this.$store.state.user);
      },
      menu: function () {
        return this.$parent.$parent.menuData;
      },
      subMenu: function () {
        let subMenu = [];
        this.menu.forEach(menu => {
          if (menu.meta.moduleId === this.activeId) {
            subMenu = menu.children;
          }
        });
        return subMenu;
      }
    },
    watch: {
      toRoute: function () {
        this.activeId = this.getGroupId();
      },
      menu() {
        this.setFirstMenu();
      },
      $route(val) {
        this.setFirstMenu();
        if (val.path !== '/') {
          this.activeId = val.meta.moduleId;
        }
      }
    },
    methods: {
      goTo: function (item) {
        this.activeId = item.meta.moduleId;
        this.$router.push({path: item.path});
      },
      checkSubMenu(item) {
        this.hoverItem = {};
        this.goTo(item);
      },
      logout: function () {
        window.localStorage.setItem('lastUrl', window.location.href);
        Auth.logout().then(() => {
          window.localStorage.setItem('userId', this.$store.state.user.userId);
          return this.$router.replace('/login');
        });
      },
      setFirstMenu() {
        let {menu, $router, $route} = this;
        if ($route.path === '/') {
          if (menu[0]) {
            if (!menu[0].children.length) {
              $router.push(menu[0].path);
              this.activeId = menu[0].meta.moduleId;
            } else {
              $router.push(menu[0].children[0].path);
              this.activeId = menu[0].children[0].meta.moduleId;
            }
          }
        }
      },
      selectSubmenu(item) {
        return item.path === this.$route.path ||
          item.meta.subModulePath === this.$route.path ||
          (item.meta.subMenuId && item.meta.subMenuId === this.$route.path.split('/')[2]);
      }
    },
    mounted: function () {
      let {$route, menu, goTo} = this;
      if ($route.path !== '/' || !menu.length) return;
      goTo(menu[0].children.length ? menu[0].children[0] : menu[0]);
    }
  }
  ;
</script>
