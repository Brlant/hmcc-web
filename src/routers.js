import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('./components/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import('./components/dashboard/index.vue'),
        meta: {moduleId: 'home', title: '首页', icon: 'home', perm: 'show'},
        children: []
      },
      {
        path: '/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '监控中心', icon: 'xitongjiankong', perm: 'ccs-monitor-center'},
        children: [
          {
            path: '/monitoring/equipment',
            component: () => import('./components/monitoring/equipment/index.vue'),
            meta: {moduleId: 'monitoring', title: '本单位设备监控', perm: 'ccs-monitordev-scan', type: 1}
          },
          {
            path: '/monitoring/pov/equipment',
            component: () => import('./components/monitoring/equipment/index.vue'),
            meta: {moduleId: 'monitoring', title: '接种单位设备监控', perm: 'ccs-hotmonitor-scan', type: 2}
          },
          {
            path: '/monitoring/store/:id',
            component: () => import('./components/monitoring/store/index.vue'),
            meta: {moduleId: 'monitoring', title: '委托仓库监控', perm: 'ccs-warehouse-scan', subMenuId: 'store',
            perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']}
          },
          {
            path: '/monitoring/temp',
            component: () => import('./components/monitoring/temp-new/index.vue'),
            meta: {moduleId: 'monitoring', title: '历史数据查询', perm: 'ccs-devdata-scan', subMenuId: 'temp', showDev: true}
          }
        ]
      },
      {
        path: '/dev',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'dev', title: '设备管理', icon: 'dashboard', perm: 'ccs-index-scan'},
        children: [
          {
            path: '/dev/probe',
            component: () => import('./components/dev/probe/index.vue'),
            meta: {
              moduleId: 'dev', title: '探头管理', perm: 'ccs-wired-dev-scan',
              type: 1, perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']
            }
          },
          {
            path: '/dev/cool',
            component: () => import('./components/dev/cool/index.vue'),
            meta: {
              moduleId: 'dev', title: '冷链设备管理', perm: 'ccs-wired-dev-scan',
              type: 1, perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']
            }
          },
          {
            path: '/dev/gateway',
            component: () => import('./components/dev/gateway/index.vue'),
            meta: {
              moduleId: 'dev', title: '网关管理', perm: 'ccs-wired-dev-scan',
              type: 1, perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']
            }
          }
        ]
      },
      {
        path: '/configuration',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'configuration', title: '配置中心', icon: 'peizhi', perm: 'ccs-config-center'},
        children: [
          {
            path: '/configuration/alarm',
            component: () => import('./components/configuration/alarm/index.vue'),
            meta: {moduleId: 'configuration', title: '告警规则', perm: 'ccs-warn-rule-scan',
              perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']}
          },
          {
            path: '/configuration/notification',
            component: () => import('./components/configuration/notification/index.vue'),
            meta: {moduleId: 'configuration', title: '告警通知组', perm: 'ccs-notify-scan',
              perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']}
          },
          {
            path: '/configuration/test',
            component: () => import('./components/configuration/alarm-test/index.vue'),
            meta: {moduleId: 'configuration', title: '告警测试', perm: 'ccs-notify-scan',
              perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']}
          }
        ]
      },
      {
        path: '/alarm',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'alarm', title: '告警中心', icon: 'alarm', perm: 'ccs-warn-center'},
        children: [
          {
            path: '/alarm/record',
            component: () => import('./components/monitoring/alarm/event/index.vue'),
            meta: {moduleId: 'alarm', title: '告警事件', perm: 'ccs-warn-record-scan'}
          },
          {
            path: '/alarm/send',
            component: () => import('./components/monitoring/alarm/notify/index.vue'),
            meta: {moduleId: 'alarm', title: '告警通知', perm: 'ccs-warn-notify-scan'}
          }
        ]
      },
      {
        path: '/dev/check',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'alarm', title: '设备巡检', icon: 'alarm', perm: 'ccs-warn-center'},
        children: [
          {
            path: '/dev/check/plan',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'alarm', title: '巡检计划', perm: 'ccs-warn-record-scan'}
          },
          {
            path: '/dev/check/record',
            component: () => import('./components/test.vue'),
            meta: {moduleId: 'alarm', title: '巡检记录', perm: 'ccs-warn-notify-scan'}
          }
        ]
      },
      {
        path: '/permission',
        component: () => import('./components/system/index.vue'),
        meta: {moduleId: 'permission', title: '系统设置', icon: 'setting', perm: 'ccs-system-config'}, // ccs-system-config
        children: [
          {
            path: '/permission/user',
            component: () => import('./components/system/user/user.vue'),
            meta: {moduleId: 'permission', title: '用户管理', perm: 'ccs-platform-user-watch'} // ccs-platform-user-watch
          },
          {
            path: '/permission/role',
            component: () => import('./components/system/role/role.vue'),
            meta: {moduleId: 'permission', title: '角色管理', perm: 'ccs-access-role-watch'} // ccs-access-role-watch
          },
          {
            path: '/permission/log',
            component: () => import('./components/common/log/list.vue'),
            meta: {moduleId: 'permission', title: '系统日志', perm: 'ccs-system-log'}
          }
        ]
      }
    ]
  }
];

export const basicRoutes = [
  {path: '/resetpsw', component: () => import('./components/login/resetpsw.vue')},
  {path: '/404', component: () => import('./components/error/error_404.vue')},
  {path: '/500', component: () => import('./components/error/error_500.vue')},
  {path: '/login', component: () => import('./components/login/login.vue')},
  {path: '/forget', component: () => import('./components/login/forget.vue')},
  {path: '/code/:id', component: () => import('./components/login/resetpwd.vue')}
];

export const ErrorPage = [
  {path: '*', component: () => import('./components/error/error_404.vue')}
];
//  不需要鉴权的路径
// const permissive = ['/login', '/404', '/500'];

const router = new VueRouter({
  //  mode: 'history',
  routes: basicRoutes,
  base: '/'
});

export default router;
