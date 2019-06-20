import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    component: () => import('./components/layout/index.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import('./components/dashboard/index.vue'),
        meta: {moduleId: 'dashboard', title: '首页', icon: 'dashboard', perm: 'ccs-index-scan'},
        children: []
      },
      {
        path: '/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '监控中心', icon: 'xitongjiankong', perm: 'ccs-monitor-center'},
        children: [
          {
            path: '/monitoring/store/:id',
            component: () => import('./components/monitoring/store/index.vue'),
            meta: {moduleId: 'monitoring', title: '仓库监控', perm: 'ccs-warehouse-scan', subMenuId: 'store'}
          },
          {
            path: '/monitoring/waybill/:id',
            component: () => import('./components/monitoring/waybill/index.vue'),
            meta: {moduleId: 'monitoring', title: '运单监控', perm: 'ccs-transorder-scan', subMenuId: 'waybill'}
          },
          {
            path: '/monitoring/equipment',
            component: () => import('./components/monitoring/equipment/index.vue'),
            meta: {moduleId: 'monitoring', title: '设备监控', perm: 'ccs-monitordev-scan', pageType: 1}
          },
          {
            path: '/monitoring/org/hot/spot',
            component: () => import('./components/monitoring/org/route-view.vue'),
            meta: {moduleId: 'monitoring', title: '货主热点监控', perm: 'ccs-hotmonitor-scan', pageType: 2, subMenuId: 'org'},
            children: [
              {
                path: '',
                component: () => import('./components/monitoring/org/index.vue'),
                meta: {moduleId: 'monitoring'}
              },
              {
                path: '/monitoring/org/hot/spot/temp',
                component: () => import('./components/monitoring/temp-new/index.vue'),
                meta: {moduleId: 'monitoring', showDev: false}
              }
            ]
          },
          {
            path: '/monitoring/temp',
            component: () => import('./components/monitoring/temp-new/index.vue'),
            meta: {moduleId: 'monitoring', title: '查询历史数据', perm: 'ccs-devdata-scan', subMenuId: 'temp', showDev: true}
          },
          {
            path: '/monitoring/handover-data',
            component: () => import('./components/monitoring/handover-data/index.vue'),
            meta: {moduleId: 'monitoring', title: '查询交接数据', perm: 'ccs-dev-handover-data-scan', subMenuId: 'handover-data'}
          },
          {
            path: '/monitoring/export/temp',
            component: () => import('./components/monitoring/export/index.vue'),
            meta: {moduleId: 'monitoring', title: '导出历史数据', perm: 'ccs-dataexport-export'}
          },
          {
            path: '/monitoring/distribution/:id',
            component: () => import('./components/monitoring/distribution/store/index.vue'),
            meta: {moduleId: 'monitoring', title: '设备分布', perm: 'ccs-devmap-scan', subMenuId: 'distribution'}
          },
          {
            path: '/monitoring/org-distribution/:id',
            component: () => import('./components/monitoring/distribution/org-store/index.vue'),
            meta: {moduleId: 'monitoring', title: '仓库设备分布', perm: 'ccs-org-devmap-scan', subMenuId: 'org-distribution'}
          },
          {
            path: '/monitoring/vehicle/distribution',
            component: () => import('./components/monitoring/distribution/vehicle/index.vue'),
            meta: {moduleId: 'monitoring', title: '车辆分布', perm: 'ccs-carmap-scan'}
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
        path: '/temp',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'temp', title: '设备资产', icon: 'temp', perm: 'ccs-dev-center'},
        children: [
          {
            path: '/temp/all',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp', title: '所有设备', perm: 'ccs-wired-watch-all-dev',
              type: 0, perms: ['show', 'ccs-wired-edit-all-dev']
            }
          },
          {
            path: '/temp/wire',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp', title: '有线温度计', perm: 'ccs-wired-dev-scan',
              type: 1, perms: ['ccs-wired-dev-add', 'ccs-wired-dev-edit']
            }
          },
          {
            path: '/temp/wifi',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp',
              title: '无线温度计',
              perm: 'ccs-wifi-dev-scan',
              type: 2,
              perms: ['ccs-wifi-dev-add', 'ccs-wifi-dev-edit']
            }
          },
          {
            path: '/temp/freezer',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp',
              title: '冷柜温度计',
              perm: 'ccs-cool-dev-scan',
              type: 3,
              perms: ['ccs-cool-dev-add', 'ccs-cool-dev-edit']
            }
          },
          {
            path: '/temp/vehicle',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp',
              title: '车载温度计',
              perm: 'ccs-car-dev-scan',
              type: 4,
              perms: ['ccs-car-dev-add', 'ccs-car-dev-edit']
            }
          },
          {
            path: '/temp/hygrometer',
            component: () => import('./components/temp/common/index.vue'),
            meta: {
              moduleId: 'temp', title: '湿度计', perm: 'ccs-humidity-dev-scan', type: 5,
              perms: ['ccs-humidity-dev-add', 'ccs-humidity-dev-edit']
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
            path: '/configuration/alarm/group',
            component: () => import('./components/configuration/alarm-group/index.vue'),
            meta: {moduleId: 'configuration', title: '告警规则组', perm: 'ccs-warn-rule-group-scan'}
          },
          {
            path: '/configuration/alarm',
            component: () => import('./components/configuration/alarm/index.vue'),
            meta: {moduleId: 'configuration', title: '告警规则', perm: 'ccs-warn-rule-scan'}
          },
          {
            path: '/configuration/notification',
            component: () => import('./components/configuration/notification/index.vue'),
            meta: {moduleId: 'configuration', title: '通知列表', perm: 'ccs-notify-scan'}
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
            path: '/permission/account',
            component: () => import('./components/system/account/account.vue'),
            meta: {moduleId: 'permission', title: '单位用户管理', perm: 'ccs-org-user-watch'} // ccs-platform-user-watch
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
