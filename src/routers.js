import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    component: () => import('./components/layout/index.vue'),
    children: [
      // 首页
      {
        path: '/dashboard',
        component: () => import('./components/dashboard/index.vue'),
        meta: {moduleId: 'home', title: '首页', icon: 'home', perm: 'hmcc-index-scan'},
        children: []
      },
      // 业务单位管理
      {
        path: '/org',
        redirect: '/org/info',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'org', title: '业务单位管理', icon: 'base', perm: 'org-manager'},
        children: [
          {
            path: '/org/info',
            component: () => import('./components/org/info/list.vue'),
            meta: {moduleId: 'org', title: '基础信息管理', perm: 'org-base-manager-query'},
            children: []
          },
          // {
          //   path: '/org/licences',
          //   component: () => import('./components/org/licences/list.vue'),
          //   meta: {moduleId: 'org', title: '单位证照管理', perm: 'licences-manager-query'},
          //   children: []
          // },
          {
            path: '/org/relation',
            component: () => import('./components/org/relation/list.vue'),
            meta: {moduleId: 'sub', title: '单位关系管理', icon: 'org1', perm: 'org-relation-manager-query'},
            children: []
          },
        ]
      },
      // 设备管理
      {
        path: '/dev',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'dev', title: '设备管理', icon: 'dashboard', perm: 'dev-manager'},
        children: [
          {
            path: '/dev/hospital',
            component: () => import('./components/dev/hos-dev/index.vue'),
            meta: {
              moduleId: 'dev', title: '院内设备管理', perm: 'hospital-dev-manager',
              type: 1,
              permPage: {
                addMedical: 'medical-dev-add',
                editMedical: 'medical-dev-edit',
                delMedical: 'medical-dev-delete',
                positionMedical: 'device-position-query',
                addCool: 'freezer-dev-add',
                editCool: 'freezer-dev-edit',
              }
            }
          },
          {
            path: '/dev/iot',
            component: () => import('./components/dev/iot-tag/index.vue'),
            meta: {
              moduleId: 'dev', title: '物联网标签管理', perm: 'iot-tag-manager',
              type: 1,
              permPage: {
                add: 'sensor-add',
                edit: 'sensor-edit',
                start: 'sensor-active',
                stop: 'sensor-disable',
                locateAdd:'locate-add',
                locateEdit:'locate-edit',
                locateDel:'locate-del',
                locateView:'locate-view',
                energyAdd:'energy-consumption-add',
                energyEdit:'energy-consumption-edit',
                energyDel:'energy-consumption-del',
                energyView:'energy-consumption-scan',
                energyEnable:'energy-consumption-active',
                energyDisable:'energy-consumption-disable',
              }
            }
          },
          {
            path: '/dev/gateway-base',
            component: () => import('./components/dev/gateway-base/index.vue'),
            meta: {
              moduleId: 'dev', title: '网关基站管理', perm: 'gateway-basestation-manager',
              type: 1,
              permPage: {
                add: 'gateway-dev-add',
                edit: 'gateway-dev-edit',
                start: 'gateway-dev-active',
                stop: 'gateway-dev-disable',
                addBasestation: 'basestation-add',
                editBasestation: 'basestation-edit',
                viewBasestation: 'basestation-view',
                delBasestation: 'basestation-del'
              }
            }
          },
          {
            path: '/dev/check/plan',
            component: () => import('./components/check/plan/index.vue'),
            meta: {
              moduleId: 'alarm', title: '院内设备巡检', perm: 'patrol-project-scan',
              permPage: {
                add: 'patrol-project-add', edit: 'patrol-project-edit',
                delete: 'patrol-project-delete', devCheck: 'patrol-record-add'
              }
            }
          },
          {
            path: '/dev/equipment',
            component: () => import('./components/dev/equipment-maintenance/index.vue'),
            meta: {
              moduleId: 'dev', title: '设备维保单', perm: 'dev-equipment-manager-scan',
              permPage: {
                add: 'dev-equipment-manager-add',
                edit: 'dev-equipment-manager-edit',
                delete: 'dev-equipment-manager-delete',
                devCheck: 'dev-equipment-manager-check'
              }
            }
          }
        ]
      },
      // 基础信息管理
      {
        path: '/basicinformation',
        component: () => import('./components/hospital/index.vue'),
        meta: {moduleId: 'basicinformation', title: '基础信息管理', icon: 'didian', perm: 'basic-information'},
        children: [
          {
            path: '/basicinformation/devicetemp',
            component: () => import('./components/hospital/devicetemp/index'),
            meta: {moduleId: 'permission', title: '院内设备模板管理', perm: 'basic-information-devicetemp'}
          },
          {
            path: '/basicinformation/structure',
            component: () => import('./components/hospital/structure/index'),
            meta: {moduleId: 'permission', title: '楼宇结构管理', perm: 'basic-information-structure'}
          },
          {
            path: '/basicinformation/floormap',
            component: () => import('./components/hospital/floormap/index'),
            meta: {moduleId: 'permission', title: '楼层地图管理', perm: 'basic-information-floormap'}
          }
        ]
      },
      // 告警管理
      {
        path: '/configuration',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'configuration', title: '告警管理', icon: 'peizhi', perm: 'config-center-manager'},
        children: [
          {
            path: '/configuration/alarm',
            component: () => import('./components/configuration/alarm/index.vue'),
            meta: {
              moduleId: 'configuration', title: '告警规则设置', perm: 'alarm-rule-scan',
              permPage: {add: 'alarm-rule-add', edit: 'alarm-rule-edit', delete: 'alarm-rule-delete'}
            }
          },
          {
            path: '/configuration/alarm/template',
            component: () => import('./components/configuration/template/index.vue'),
            meta: {
              moduleId: 'configuration', title: '告警规则模板', perm: 'alarm-template-scan',
              permPage: {add: 'alarm-template-add', edit: 'alarm-template-edit',start: 'alarm-template-start', stop: 'alarm-template-stop'}
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
              moduleId: 'configuration', title: '告警通知测试', perm: 'alarm-test-log-scan',
              permPage: {add: 'alarm-test-log-add', confirm: 'alarm-test-log-confirm'}
            }
          }
        ]
      },
      // 告警中心
      {
        path: '/alarm',
        component: () => import('./components/common/parent-route'),
        meta: {moduleId: 'alarm', title: '告警中心', icon: 'alarm', perm: 'alarm-center-manager'},
        children: [
          {
            path: '/alarm/record',
            component: () => import('./components/monitoring/alarm/event/index.vue'),
            meta: {
              moduleId: 'alarm', title: '设备告警', perm: 'alarm-event-scan',
              permPage: {add: 'hmcc-system', handle: 'alarm-event-handle', export: 'alarm-event-export'}
            }
          },
          {
            path: '/alarm/send',
            component: () => import('./components/monitoring/alarm/notify/index.vue'),
            meta: {moduleId: 'alarm', title: '告警通知记录', perm: 'alarm-notice-record-scan'}
          },
          {
            path: '/alarm/waring/locate-tag',
            component: () => import('./components/monitoring/alarm/waring/label/index.vue'),
            meta: {moduleId: 'alarm', title: '定位标签告警', perm: 'alarm-tag-manager'}
          },
        ]
      },
      // 设备定位管理
      {
        path: '/device-position',
        component: () => import('./components/hospital/index.vue'),
        meta: {moduleId: 'device-position', title: '设备定位管理', icon: 'didian', perm: 'device-position'},
        children: [
          {
            name: 'DevicePosition',
            path: '/device-position/position',
            component: () => import('./components/hospital/equipment/position/index'),
            meta: {moduleId: 'permission', title: '设备定位', perm: 'device-position-query'}
          },
          {
            path: '/device-position/trajectory',
            component: () => import('./components/hospital/equipment/trajectory/index'),
            meta: {moduleId: 'permission', title: '轨迹查询', perm: 'device-position-trajectory'}
          }
        ]
      },
      // 无线冷链管理系统
      {
        path: '/monitoring',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'monitoring', title: '无线冷链管理系统', icon: 'xitongjiankong', perm: 'monitoring-center-manager'},
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
            path: '/monitoring/relevancy/equipment',
            component: () => import('./components/monitoring/equipment/index.vue'),
            meta: {
              moduleId: 'monitoring', title: '关联单位设备监控', perm: 'relevancy-dev-monitoring-scan', type: 2,
              permPage: {
                add: 'relevancy-dev-monitoring-add',
                edit: 'relevancy-dev-monitoring-edit',
                delete: 'relevancy-dev-monitoring-delete',
                start: 'relevancy-dev-monitoring-active',
                stop: 'relevancy-own-dev-monitoring-disable',
                record: 'relevancy-dev-monitoring-record',
                query: 'history-data-manager-scan'
              }
            }
          },
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
      // 设备能效管理系统
      {
        path: '/energy-efficiency',
        component: () => import('./components/common/parent-route.vue'),
        meta: {moduleId: 'energy-efficiency', title: '设备能效管理系统', icon: 'home', perm: 'energy-efficiency-manager'},
        children: [
          {
            path: '/energy-efficiency/monitor',
            component: () => import('./components/energy-efficiency/index.vue'),
            meta: {
              moduleId: 'energy-efficiency', title: '实时能耗监控', perm: 'energy-efficiency-monitor',
            },
          },
          {
            path: '/energy-efficiency/analysis',
            component: () => import('./components/energy-efficiency/analysis.vue'),
            meta: {
              moduleId: 'energy-efficiency', title: '汇总能耗分析', perm: 'energy-efficiency-manager',
            }
          },
        ]
      },
      // 系统设置
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
            path: '/permission/depart',
            component: () => import('./components/system/depart/index.vue'),
            meta: {moduleId: 'permission', title: '科室管理', perm: 'system-depart-manager-query'} // ccs-platform-user-watch
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
          //维保
          {
            path: '/maintenance/maintenance',
            component: () => import('./components/system/maintenance/maintenance.vue'),
            meta: {moduleId: 'permission', title: '维保类型设置', perm: 'system-setting-maintenance-type-query'}
          },

        ]
      },
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
