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
        meta: {moduleId: 'home', title: '首页', icon: 'home', perm: 'hmcc-index-scan'},
        children: []
      },
      {
        path: '/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '监控中心', icon: 'xitongjiankong', perm: 'monitoring-center-manager'},
        children: [
          {
            path: '/monitoring/equipment',
            component: () => import('./components/monitoring/equipment/index.vue'),
            meta: {
              moduleId: 'monitoring', title: '本单位设备监控', perm: 'own-dev-monitoring-scan', type: 1,
              permPage: {
                add: 'own-dev-monitoring-add',
                edit: 'own-dev-monitoring-edit',
                delete: 'own-dev-monitoring-delete',
                start: 'own-dev-monitoring-active',
                stop: 'own-dev-monitoring-disable',
                record: 'own-dev-monitoring-record',
                query: 'history-data-manager-scan'
              }
            }
          },
          {
            path: '/monitoring/pov/equipment',
            component: () => import('./components/monitoring/equipment/index.vue'),
            meta: {
              moduleId: 'monitoring', title: '接种单位设备监控', perm: 'pov-dev-monitoring-scan', type: 2,
              permPage: {
                add: 'pov-dev-monitoring-add',
                edit: 'pov-dev-monitoring-edit',
                delete: 'pov-dev-monitoring-delete',
                start: 'pov-dev-monitoring-active',
                stop: 'pov-own-dev-monitoring-disable',
                record: 'pov-dev-monitoring-record',
                query: 'history-data-manager-scan'
              }
            }
          },
          // {
          //   path: '/monitoring/store',
          //   component: () => import('./components/common/parent-route'),
          //   meta: {moduleId: 'monitoring', title: '委托仓库监控', perm: 'query-monitor-relations', subMenuId: 'store'},
          //   children: [
          //     {
          //       path: '',
          //       component: () => import('./components/monitoring/store/index.vue'),
          //       meta: {
          //         moduleId: 'monitoring', subMenuId: 'store',
          //         permPage: {add: 'hmcc-system', edit: '', delete: '', start: '', stop: ''}
          //       }
          //     },
          //     {
          //       path: '/monitoring/store/temp',
          //       component: () => import('./components/monitoring/store/dev-temp/index.vue'),
          //       meta: {
          //         moduleId: 'monitoring', subMenuId: 'store',
          //         permPage: {add: 'hmcc-system', edit: '', delete: '', start: '', stop: ''}
          //       }
          //     },
          //   ]
          // },
          {
            path: '/monitoring/temp',
            component: () => import('./components/monitoring/temp-new/index.vue'),
            meta: {
              moduleId: 'monitoring', title: '历史数据查询', perm: 'history-data-manager-scan',
              subMenuId: 'temp', showDev: true
            }
          },
          {
            path: '/monitoring/temp/records',
            component: () => import('./components/monitoring/temp-record/index.vue'),
            meta: {
              moduleId: 'monitoring', title: '冷链设备温度记录', perm: 'freezer-dev-temperature-record-manager-scan',
              subMenuId: 'temp', showDev: true
            }
          },
          {
            path: '/monitoring/manager/assess',
            component: () => import('./components/monitoring/manager-assess/index.vue'),
            meta: {
              moduleId: 'monitoring', title: '冷链管理评估表', perm: 'freezer-manager-evaluation-scan',
              subMenuId: 'temp', showDev: true
            }
          },
          {
            path: '/monitoring/dev/assess',
            component: () => import('./components/monitoring/dev-assess/index.vue'),
            meta: {
              moduleId: 'monitoring', title: '冷链设备评估表', perm: 'freezer-dev-evaluation-scan',
              subMenuId: 'temp', showDev: true
            }
          }
        ]
      },
      {
        path: '/dev',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'dev', title: '设备管理', icon: 'dashboard', perm: 'dev-manager'},
        children: [
          {
            path: '/dev/probe',
            component: () => import('./components/dev/probe/index.vue'),
            meta: {
              moduleId: 'dev', title: '探头管理', perm: 'sensor-scan',
              type: 1,
              permPage: {add: 'sensor-add', edit: 'sensor-edit', start: 'sensor-active', stop: 'sensor-disable'}
            }
          },
          {
            path: '/dev/hos',
            component: () => import('./components/dev/hos/index.vue'),
            meta: {
              moduleId: 'dev', title: '院内设备管理', perm: 'hos-dev-manager',
              type: 1,
              permPage: {
                add: 'freezer-dev-add',
                edit: 'freezer-dev-edit'
              }
            }
          },
          {
            path: '/dev/gateway',
            component: () => import('./components/dev/gateway/index.vue'),
            meta: {
              moduleId: 'dev', title: '网关管理', perm: 'gateway-dev-scan',
              type: 1,
              permPage: {
                add: 'gateway-dev-add',
                edit: 'gateway-dev-edit',
                start: 'gateway-dev-active',
                stop: 'gateway-dev-disable'
              }
            }
          }
        ]
      },
      {
        path: '/configuration',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'configuration', title: '配置中心', icon: 'peizhi', perm: 'config-center-manager'},
        children: [
          {
            path: '/configuration/alarm',
            component: () => import('./components/configuration/alarm/index.vue'),
            meta: {
              moduleId: 'configuration', title: '告警规则', perm: 'alarm-rule-scan',
              permPage: {add: 'alarm-rule-add', edit: 'alarm-rule-edit', delete: 'alarm-rule-delete'}
            }
          },
          {
            path: '/configuration/notification',
            component: () => import('./components/configuration/notification/index.vue'),
            meta: {
              moduleId: 'configuration', title: '告警通知组', perm: 'alarm-notice-group-scan',
              permPage: {
                add: 'alarm-notice-group-add', edit: 'alarm-notice-group-edit',
                delete: 'alarm-notice-group-delete'
              }
            }
          },
          {
            path: '/configuration/test',
            component: () => import('./components/configuration/alarm-test/index.vue'),
            meta: {
              moduleId: 'configuration', title: '告警测试', perm: 'alarm-test-log-scan',
              permPage: {add: 'alarm-test-log-add', confirm: 'alarm-test-log-confirm'}
            }
          }
        ]
      },
      {
        path: '/alarm',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'alarm', title: '告警中心', icon: 'alarm', perm: 'alarm-center-manager'},
        children: [
          {
            path: '/alarm/record',
            component: () => import('./components/monitoring/alarm/event/index.vue'),
            meta: {
              moduleId: 'alarm', title: '告警事件', perm: 'alarm-event-scan',
              permPage: {add: 'hmcc-system', handle: 'alarm-event-handle', export: 'alarm-event-export'}
            }
          },
          {
            path: '/alarm/send',
            component: () => import('./components/monitoring/alarm/notify/index.vue'),
            meta: {moduleId: 'alarm', title: '告警通知', perm: 'alarm-notice-record-scan'}
          },
          {
            path: '/alarm/waring/label',
            component: () => import('./components/monitoring/alarm/waring/label/index.vue'),
            meta: {moduleId: 'alarm', title: '标签异常', perm: 'alarm-tag-manager'}
          },
        ]
      },
      {
        path: '/dev/check',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'alarm', title: '设备巡检', icon: 'verify', perm: 'patrol-project-manager'},
        children: [
          {
            path: '/dev/check/plan',
            component: () => import('./components/check/plan/index.vue'),
            meta: {
              moduleId: 'alarm', title: '巡检计划', perm: 'patrol-project-scan',
              permPage: {
                add: 'patrol-project-add', edit: 'patrol-project-edit',
                delete: 'patrol-project-delete', devCheck: 'patrol-record-add'
              }
            }
          }
        ]
      },
      {
        path: '/org',
        redirect: '/org/info',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'org', title: '单位管理', icon: 'base', perm: 'org-manager'},
        children: [
          {
            path: '/org/info',
            component: () => import('./components/org/info/list.vue'),
            meta: {moduleId: 'org', title: '基础信息管理', perm: 'org-base-manager-query'},
            children: []
          },
          {
            path: '/org/licences',
            component: () => import('./components/org/licences/list.vue'),
            meta: {moduleId: 'org', title: '单位证照管理', perm: 'org-licences-manager-query'},
            children: []
          },
          {
            path: '/org/relation',
            component: () => import('./components/org/relation/list.vue'),
            meta: {moduleId: 'sub', title: '单位关系管理', icon: 'org1', perm: 'org-relation-manager-query'},
            children: []
          },
          // {
          //   path: '/org/address',
          //   component: () => import('./components/org/address/index.vue'),
          //   meta: {moduleId: 'org', title: '仓库地址管理', perm: 'address-manager-query'},
          //   children: []
          // }
        ]
      },
      {
        path: '/permission',
        component: () => import('./components/system/index.vue'),
        meta: {moduleId: 'permission', title: '系统设置', icon: 'setting', perm: 'system-config'}, // hmcc-system-config
        children: [
          {
            path: '/permission/user',
            component: () => import('./components/system/user/list.vue'),
            meta: {moduleId: 'permission', title: '账号管理', perm: 'system-setting-account-manager-query'} // ccs-platform-user-watch
          },
          {
            path: '/permission/role',
            component: () => import('./components/system/role/role.vue'),
            meta: {moduleId: 'permission', title: '角色管理', perm: 'access-role-watch'} // ccs-access-role-watch
          },
          {
            path: '/setting/org/account',
            component: () => import('./components/system/org-account/list.vue'),
            meta: {moduleId: 'public', title: '各单位账号管理', perm: 'system-setting-org-account-manager-query'},
            children: []
          },
          {
            path: '/setting/dict',
            component: () => import('./components/system/dict/dict.vue'),
            meta: {moduleId: 'public', title: '数据字典', perm: 'dict-manager'},
            children: []
          },
          {
            path: '/permission/log',
            component: () => import('./components/common/log/list.vue'),
            meta: {moduleId: 'permission', title: '系统日志', perm: 'system-setting-log'}
          },

        ]
      },
      {
        path: '/deviceposition',
        component: () => import('./components/hospital/index.vue'),
        meta: {moduleId: 'deviceposition', title: '设备定位管理', icon: 'didian', perm: 'device-position'},
        children: [
          {
            path: '/deviceposition/position',
            component: () => import('./components/hospital/equipment/position/index'),
            meta: {moduleId: 'permission', title: '设备定位', perm: 'device-position-query'}
          },
          {
            path: '/deviceposition/trajectory',
            component: () => import('./components/hospital/equipment/trajectory/index'),
            meta: {moduleId: 'permission', title: '轨迹查询', perm: 'device-position-trajectory'}
          }
        ]
      },
      {
        path: '/basicinformation',
        component: () => import('./components/hospital/index.vue'),
        meta: {moduleId: 'basicinformation', title: '基础信息管理', icon: 'didian', perm: 'basic-information'},
        children: [
          {
            path: '/basicinformation/structure',
            component: () => import('./components/hospital/structure/index'),
            meta: {moduleId: 'permission', title: '院内区域结构管理', perm: 'basic-information-structure'}
          },
          {
            path: '/basicinformation/floormap',
            component: () => import('./components/hospital/floormap/index'),
            meta: {moduleId: 'permission', title: '地图管理', perm: 'basic-information-floormap'}
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
