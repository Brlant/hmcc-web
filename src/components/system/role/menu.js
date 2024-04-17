export default [
  {
    id: 'hmcc-index-scan',
    label: '首页',
    parentId: 'hmcc-system',
    sort: 0
  },
  {
    id: 'org-manager',
    label: '业务单位管理',
    sort: 1,
    children: [
      {
        id: 'org-base-manager',
        label: '基础信息管理',
        sort: 0,
        children: [
          {
            id: 'org-base-manager-query',
            label: '查看单位'
          },
          {
            id: 'org-base-manager-add',
            label: '添加单位'
          },
          {
            id: 'org-base-manager-edit',
            label: '编辑单位'
          },
          {
            id: 'org-base-manager-audit',
            label: '审核单位'
          },
          {
            id: 'org-base-manager-export',
            label: '导出单位'
          }
        ]
      },
      // {
      //   id: 'licences-manager',
      //   label: '单位证照管理',
      //   sort: 1,
      //   children: [
      //     {
      //       id: 'licences-manager-query',
      //       label: '查看单位证照'
      //     },
      //     {
      //       id: 'licences-manager-add',
      //       label: '添加单位证照'
      //     },
      //     {
      //       id: 'licences-manager-edit',
      //       label: '编辑单位证照'
      //     },
      //     {
      //       id: 'licences-manager-delete',
      //       label: '删除单位证照'
      //     }
      //   ]
      // },
      // {
      //   id: 'address-manager',
      //   locate-tag: '仓库地址管理',
      //   children: [
      //     {
      //       id: 'address-manager-query',
      //       locate-tag: '查看单位仓库地址'
      //     },
      //     {
      //       id: 'address-manager-add',
      //       locate-tag: '添加单位仓库地址'
      //     },
      //     {
      //       id: 'address-manager-edit',
      //       locate-tag: '编辑单位仓库地址'
      //     },
      //     {
      //       id: 'address-manager-stop',
      //       locate-tag: '停用单位仓库地址'
      //     },
      //     {
      //       id: 'address-manager-start',
      //       locate-tag: '启用单位仓库地址'
      //     },
      //     {
      //       id: 'address-manager-audit',
      //       locate-tag: '审核单位仓库地址'
      //     },
      //     {
      //       id: 'address-manager-export',
      //       locate-tag: '导出单位仓库地址',
      //     }
      //   ]
      // }
      {
        id: 'org-relation-manager',
        label: '单位关系管理',
        children: [
          {
            id: 'org-relation-manager-query',
            label: '查看单位关系'
          },
          {
            id: 'org-relation-manager-add',
            label: '添加单位关系'
          },
          {
            id: 'org-relation-manager-delete',
            label: '删除单位关系'
          }
        ]
      }
    ]
  },
  {
    id: 'dev-manager',
    label: '设备管理',
    parentId: 'hmcc-system',
    sort: 2,
    children: [
      {
        id: 'hospital-dev-manager',
        label: '院内设备管理',
        parentId: 'dev-manager',
        sort: '1',
        children: [
          {
            id: 'freezer-dev-manager',
            label: '冷链设备管理',
            parentId: 'in-hospital-dev-manager',
            sort: '1',
            children: [
              {
                id: 'freezer-dev-scan',
                label: '查看冷链设备管理',
                parentId: 'freezer-dev-manager'
              },
              {
                id: 'freezer-dev-add',
                label: '新增冷链设备',
                parentId: 'freezer-dev-manager'
              },
              {
                id: 'freezer-dev-edit',
                label: '编辑冷链设备',
                parentId: 'freezer-dev-manager'
              }
            ]
          },
          {
            id: 'medical-dev-manager',
            label: '医疗设备管理',
            parentId: 'hospital-dev-manager',
            sort: '2',
            children: [
              {
                id: 'medical-dev-scan',
                label: '查看医疗设备管理',
                parentId: 'medical-dev-manager'
              },
              {
                id: 'medical-dev-add',
                label: '新增医疗设备',
                parentId: 'medical-dev-manager'
              },
              {
                id: 'medical-dev-edit',
                label: '编辑医疗设备',
                parentId: 'medical-dev-manager'
              },
              {
                id: 'medical-dev-delete',
                label: '删除医疗设备',
                parentId: 'medical-dev-manager'
              }
            ]
          },
          {
            id: 'app-dev-manager',
            label: 'APP设备管理',
            parentId: 'hospital-dev-manager',
            sort: '3',
            children: [
              {
                id: 'app-freezer-monitoring-scan',
                label: '查看冷链监控',
                parentId: 'app-dev-manager'
              },
              {
                id: 'app-alarm-event-scan',
                label: '查看告警事件',
                parentId: 'app-dev-manager'
              },
              {
                id: 'app-dev-patrol-scan',
                label: '查看设备巡检',
                parentId: 'app-dev-manager'
              },
              {
                id: 'app-dev-position-scan',
                label: '查看设备定位',
                parentId: 'app-dev-manager'
              },
              {
                id: 'app-dev-energy-scan',
                label: '查看设备能耗',
                parentId: 'app-dev-manager'
              },
              {
                id: 'app-dev-add',
                label: '添加设备',
                parentId: 'app-dev-manager'
              },
              {
                id: 'app-dev-code-scan',
                label: '设备扫码',
                parentId: 'app-dev-manager'
              }
            ]
          },
        ]
      },
      {
        id: 'iot-tag-manager',
        label: '物联网标签管理',
        parentId: 'dev-manager',
        sort: '2',
        children: [
          {
            id: 'sensor-manager',
            label: '冷链标签',
            parentId: 'iot-tag-manager',
            sort: '1',
            children: [
              {
                id: 'sensor-scan',
                label: '查看冷链标签',
                parentId: 'sensor-manager'
              },
              {
                id: 'sensor-add',
                label: '新增冷链标签',
                parentId: 'sensor-manager'
              },
              {
                id: 'sensor-edit',
                label: '编辑冷链标签',
                parentId: 'sensor-manager'
              },
              {
                id: 'sensor-active',
                label: '启用冷链标签',
                parentId: 'sensor-manager'
              },
              {
                id: 'sensor-disable',
                label: '停用冷链标签',
                parentId: 'sensor-manager'
              }
            ]
          },
          {
            id: 'locate-label',
            label: '定位标签',
            parentId: 'iot-tag-manager',
            sort: '2',
            children: [
              {
                id: 'locate-view',
                label: '查看定位标签',
                parentId: 'locate-label'
              },
              {
                id: 'locate-add',
                label: '新增定位标签',
                parentId: 'sensor-label'
              },
              {
                id: 'locate-edit',
                label: '编辑定位标签',
                parentId: 'sensor-label'
              },  {
                id: 'locate-del',
                label: '删除定位标签',
                parentId: 'sensor-label'
              },
            ]
          },
          {
            id: 'energy-consumption-label',
            label: '能耗标签',
            parentId: 'iot-tag-manager',
            sort: '3',
            children: [
              {
                id: 'energy-consumption-scan',
                label: '查看能耗标签',
                parentId: 'energy-consumption-label'
              },
              {
                id: 'energy-consumption-add',
                label: '新增能耗标签',
                parentId: 'energy-consumption-label'
              },
              {
                id: 'energy-consumption-edit',
                label: '编辑能耗标签',
                parentId: 'energy-consumption-label'
              },
              {
                id: 'energy-consumption-active',
                label: '启用能耗标签',
                parentId: 'energy-consumption-label'
              },
              {
                id: 'energy-consumption-disable',
                label: '停用能耗标签',
                parentId: 'energy-consumption-label'
              }
            ]
          },
        ]
      },
      {
        id: 'gateway-basestation-manager',
        label: '网关基站管理',
        parentId: 'dev-manager',
        sort: '3',
        children: [
          {
            id: 'gateway-dev-manager',
            label: '网关管理',
            parentId: 'gateway-basestation-manager',
            sort: '2',
            children: [
              {
                id: 'gateway-dev-scan',
                label: '查看网关管理',
                parentId: 'gateway-dev-manager'
              },
              {
                id: 'gateway-dev-add',
                label: '新增网关',
                parentId: 'gateway-dev-manager'
              },
              {
                id: 'gateway-dev-edit',
                label: '编辑网关',
                parentId: 'gateway-dev-manager'
              },
              {
                id: 'gateway-dev-active',
                label: '启用网关',
                parentId: 'gateway-dev-manager'
              },
              {
                id: 'gateway-dev-disable',
                label: '停用网关',
                parentId: 'gateway-dev-manager'
              }
            ]
          },
          {
            id: 'basestation-manager',
            label: '基站管理',
            parentId: 'gateway-basestation-manager',
            sort: '2',
            children: [
              {
                id: 'basestation-view',
                label: '查看基站详情',
                parentId: 'basestation-manager'
              },
              {
                id: 'basestation-add',
                label: '新增基站',
                parentId: 'basestation-manager'
              },
              {
                id: 'basestation-edit',
                label: '编辑基站',
                parentId: 'basestation-manager'
              },
              {
                id: 'basestation-del',
                label: '删除基站',
                parentId: 'basestation-manager'
              },
            ]
          },
        ]
      },
      {
        id: 'patrol-project-manager',
        label: '院内设备巡检',
        parentId: 'dev-manager',
        sort: '4',
        children: [
          {
            id: 'patrol-project-scan',
            label: '查看巡检计划',
            parentId: 'dev-patrol-manager'
          },
          {
            id: 'patrol-project-add',
            label: '新增巡检计划',
            parentId: 'dev-patrol-manager'
          },
          {
            id: 'patrol-project-edit',
            label: '编辑巡检计划',
            parentId: 'dev-patrol-manager'
          },
          {
            id: 'patrol-project-delete',
            label: '删除巡检计划',
            parentId: 'dev-patrol-manager'
          },
          {
            id: 'patrol-record-add',
            label: '新增设备巡检记录',
            parentId: 'dev-patrol-manager'
          },
        ]
      }
    ]
  },
  {
    id: 'basic-information',
    label: '基础信息管理',
    sort: 3,
    children: [
      {
        id: 'basic-information-devicetemp',
        label: '院内设备模板管理',
      },
      {
        id: 'basic-information-structure',
        label: '楼宇结构管理',
      },
      {
        id: 'basic-information-floormap',
        label: '楼层地图管理',
      }
    ]
  },
  {
    id: 'config-center-manager',
    label: '告警管理',
    parentId: 'hmcc-system',
    sort: 4,
    children: [
      {
        id: 'alarm-rule-manager',
        label: '告警规则设置',
        parentId: 'hmcc-system',
        sort: '1',
        children: [
          {
            id: 'alarm-rule-scan',
            label: '查看告警规则',
            parentId: 'hmcc-system'
          },
          {
            id: 'alarm-rule-add',
            label: '新增告警规则',
            parentId: 'hmcc-system'
          },
          {
            id: 'alarm-rule-edit',
            label: '编辑告警规则',
            parentId: 'hmcc-system'
          },
          {
            id: 'alarm-rule-delete',
            label: '删除告警规则',
            parentId: 'hmcc-system'
          }
        ]
      },
      {
        id: 'alarm-notice-group-manager',
        label: '告警通知组',
        parentId: 'hmcc-system',
        sort: '2',
        children: [
          {
            id: 'alarm-notice-group-scan',
            label: '查看告警通知组',
            parentId: 'hmcc-system'
          },
          {
            id: 'alarm-notice-group-add',
            label: '新增告警通知组',
            parentId: 'hmcc-system'
          },
          {
            id: 'alarm-notice-group-edit',
            label: '编辑告警通知组',
            parentId: 'hmcc-system'
          },
          {
            id: 'alarm-notice-group-delete',
            label: '删除告警通知组',
            parentId: 'hmcc-system'
          }
        ]
      },
      {
        id: 'alarm-test-log-manager',
        label: '告警通知测试',
        parentId: 'hmcc-system',
        sort: '3',
        children: [
          {
            id: 'alarm-test-log-scan',
            label: '查看告警测试',
            parentId: 'hmcc-system'
          },
          {
            id: 'alarm-test-log-add',
            label: '新增告警测试',
            parentId: 'hmcc-system'
          },
          {
            id: 'alarm-test-log-confirm',
            label: '确认告警测试',
            parentId: 'hmcc-system'
          },
        ]
      }
    ]
  },
  {
    id: 'alarm-center-manager',
    label: '告警中心',
    parentId: 'hmcc-system',
    sort: 5,
    children: [
      {
        id: 'alarm-event-manager',
        label: '设备告警',
        parentId: 'alarm-center-manager',
        sort: '1',
        children: [
          {
            id: 'alarm-event-scan',
            label: '查看设备告警',
            parentId: 'alarm-center-manager'
          },
          {
            id: 'alarm-event-handle',
            label: '处理设备告警',
            parentId: 'alarm-center-manager'
          },
          {
            id: 'alarm-event-export',
            label: '导出设备告警',
            parentId: 'alarm-center-manager'
          }
        ]
      },
      {
        id: 'alarm-notice-record-manager',
        label: '告警通知记录',
        parentId: 'alarm-center-manager',
        sort: '2',
        children: [{
          id: 'alarm-notice-record-scan',
          label: '查看告警通知记录',
          parentId: 'alarm-notice-record-manager'
        }]
      }, {
        id: 'alarm-tag-manager',
        label: '定位标签告警',
        parentId: 'alarm-center-manager',
        sort: '3',
      }
    ]
  },
  {
    id: 'device-position',
    label: '设备定位管理',
    sort: 6,
    children: [
      {
        id: 'device-position-query',
        label: '设备定位',
      },
      {
        id: 'device-position-trajectory',
        label: '轨迹查询',
      }
    ]
  },
  {
    id: 'monitoring-center-manager',
    label: '无线冷链管理系统',
    parentId: 'hmcc-system',
    sort: 7,
    children: [
      {
        id: 'own-dev-monitoring',
        label: '本单位设备监控',
        parentId: 'hmcc-system',
        sort: '1',
        children: [
          {
            id: 'own-dev-monitoring-scan',
            label: '查看本单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'own-dev-monitoring-add',
            label: '添加本单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'own-dev-monitoring-edit',
            label: '修改本单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'own-dev-monitoring-delete',
            label: '删除本单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'own-dev-monitoring-active',
            label: '激活本单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'own-dev-monitoring-disable',
            label: '停止本单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'own-dev-monitoring-record',
            label: '记录温度',
            parentId: 'hmcc-system'
          }
        ]
      },
      {
        id: 'relevancy-dev-monitoring',
        label: '关联单位设备监控',
        parentId: 'hmcc-system',
        sort: '2',
        children: [
          {
            id: 'relevancy-dev-monitoring-scan',
            label: '查看关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'relevancy-dev-monitoring-add',
            label: '添加关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'relevancy-dev-monitoring-edit',
            label: '修改关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'relevancy-dev-monitoring-delete',
            label: '删除关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'relevancy-dev-monitoring-active',
            label: '激活关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'relevancy-own-dev-monitoring-disable',
            label: '停止关联单位设备监控',
            parentId: 'hmcc-system'
          }
        ]
      },
      {
        id: 'history-data-manager',
        label: '历史数据查询',
        parentId: 'hmcc-system',
        sort: '4',
        children: [{
          id: 'history-data-manager-scan',
          label: '查看历史数据',
          parentId: 'hmcc-system'
        }]
      },
      {
        id: 'freezer-dev-temperature-record-manager',
        label: '冷链设备温度记录',
        parentId: 'hmcc-system',
        sort: '5',
        children: [{
          id: 'freezer-dev-temperature-record-manager-scan',
          label: '查看冷链设备温度记录',
          parentId: 'hmcc-system'
        }]
      },
      {
        id: 'freezer-manager-evaluation',
        label: '冷链管理评估表',
        parentId: 'hmcc-system',
        sort: '5',
        children: [{
          id: 'freezer-manager-evaluation-scan',
          label: '查看冷链管理评估表',
          parentId: 'hmcc-system'
        }]
      },
      {
        id: 'freezer-dev-evaluation',
        label: '冷链设备评估表',
        parentId: 'hmcc-system',
        sort: '5',
        children: [{
          id: 'freezer-dev-evaluation-scan',
          label: '查看冷链设备评估表',
          parentId: 'hmcc-system'
        }]
      }
    ]
  },
  {
    id: 'energy-efficiency-manager',
    label: '设备能效管理系统',
    parentId: 'hmcc-system',
    sort: 8,
    children: [
      {
        id: 'energy-efficiency-monitor',
        label: '实时能耗监控',
        parentId: 'energy-efficiency-manager',
        sort: 0,
      },
      {
        id: 'energy-efficiency-analysis',
        label: '汇总能耗分析',
        parentId: 'energy-efficiency-manager',
        sort: 1,
      },
    ]
  },
  {
    id: 'system-config',
    label: '系统设置',
    children: [
      //科室管理
      {
        id: 'system-depart-manager',
        label: '科室管理',
        children: [
          {
            id: 'system-depart-manager-query',
            label: '查看科室'
          },
          {
            id: 'system-depart-manager-add',
            label: '添加科室'
          },
          {
            id: 'system-depart-manager-edit',
            label: '编辑科室'
          },
          {
            id: 'system-depart-manager-enabled',
            label: '启用科室'
          },
          {
            id: 'system-depart-manager-disabled',
            label: '停用科室'
          },
        ]
      },
      {
        id: 'system-setting-account-manager',
        label: '账号管理',
        children: [
          {
            id: 'system-setting-account-manager-query',
            label: '查看账号'
          },
          {
            id: 'system-setting-account-manager-add',
            label: '添加账号'
          },
          {
            id: 'system-setting-account-manager-edit',
            label: '编辑账号'
          },
          {
            id: 'system-setting-account-manager-start',
            label: '启用账号'
          },
          {
            id: 'system-setting-account-manager-stop',
            label: '停用账号'
          }
        ]
      },
      {
        id: 'access-role-manager',
        label: '角色管理',
        children: [
          {
            id: 'access-role-watch',
            label: '查看角色'
          },
          {
            id: 'access-role-add',
            label: '添加角色'
          },
          {
            id: 'access-role-edit',
            label: '编辑角色'
          },
          {
            id: 'system-setting-role-manager-export',
            label: '导出角色Excel'
          }
        ]
      },
      {
        id: 'system-setting-org-account-manager',
        label: '各单位账号管理',
        children: [
          {
            id: 'system-setting-org-account-manager-query',
            label: '查看单位账号'
          },
          {
            id: 'system-setting-org-account-manager-add',
            label: '添加单位账号'
          },
          {
            id: 'system-setting-org-account-manager-edit',
            label: '编辑单位账号'
          },
          {
            id: 'system-setting-org-account-manager-start',
            label: '启用单位账号'
          },
          {
            id: 'system-setting-org-account-manager-stop',
            label: '停用单位账号'
          }
        ]
      },
      {
        id: 'dict-manager',
        label: '数据字典',
        children: [
          {
            id: 'dict-group-query',
            label: '查询数据字典组',
          },
          {
            id: 'dict-group-add',
            label: '新增数据字典组',
          },
          {
            id: 'dict-group-export',
            label: '导出数据字典组',
          },
          {
            id: 'dict-group-update',
            label: '编辑数据字典组',
          },
          {
            id: 'dict-group-softDelete',
            label: '删除数据字典组',
          },
          {
            id: 'dict-item-query',
            label: '查询数据字典项',
          },
          {
            id: 'dict-item-add',
            label: '新增数据字典项',
          },
          {
            id: 'dict-item-update',
            label: '编辑数据字典项',
          },
          {
            id: 'dict-item-softDelete',
            label: '删除数据字典项',
          }
        ]
      },
      {
        id: 'system-setting-log',
        label: '系统日志'
      },
      {
        id: 'query-all-org-regulation',
        label: '查看所有单位'
      },
      //维保类型设置
      {
        id: 'system-setting-maintenance-type-manager',
        label: '维保类型设置',
        children: [
          {
            id: 'system-setting-maintenance-type-query',
            label: '查看维保类型'
          },
          {
            id: 'system-setting-maintenance-type-add',
            label: '添加维保类型'
          },
          {
            id: 'system-setting-maintenance-type-edit',
            label: '编辑维保类型'
          },
          {
            id: 'system-setting-maintenance-type-start',
            label: '启用维保类型'
          },
          {
            id: 'system-setting-maintenance-type-stop',
            label: '停用维保类型'
          }
        ]
      },
    ]
  },


];
