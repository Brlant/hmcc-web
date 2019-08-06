export default [
  {
    'id': 'hmcc-index-scan',
    'label': '首页',
    'parentId': 'hmcc-system',
    'sort': '1',
    'children': []
  },
  {
    'id': 'monitoring-center-manager',
    'label': '监控中心',
    'parentId': 'hmcc-system',
    'sort': '2',
    'children': [
      {
        'id': 'own-dev-monitoring',
        'label': '本单位设备监控',
        'parentId': 'hmcc-system',
        'sort': '1',
        'children': [
          {
            'id': 'own-dev-monitoring-scan',
            'label': '查看本单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'own-dev-monitoring-add',
            'label': '添加本单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'own-dev-monitoring-edit',
            'label': '修改本单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'own-dev-monitoring-delete',
            'label': '删除本单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'own-dev-monitoring-active',
            'label': '激活本单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'own-dev-monitoring-dev-switch',
            'label': '停止本单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'own-dev-monitoring-record',
            'label': '记录温度',
            'parentId': 'hmcc-system'
          }
        ]
      },
      {
        'id': 'pov-dev-monitoring',
        'label': '接种单位设备监控',
        'parentId': 'hmcc-system',
        'sort': '2',
        'children': [
          {
            'id': 'pov-dev-monitoring-scan',
            'label': '查看接种单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'pov-dev-monitoring-add',
            'label': '添加接种单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'pov-dev-monitoring-edit',
            'label': '修改接种单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'pov-dev-monitoring-delete',
            'label': '删除接种单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'pov-dev-monitoring-active',
            'label': '激活接种单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'pov-dev-monitoring-dev-switch',
            'label': '停止接种单位设备监控',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'pov-dev-monitoring-record',
            'label': '记录温度',
            'parentId': 'hmcc-system'
          }
        ]
      },
      {
        'id': 'entrust-store-monitoring',
        'label': '委托仓库监控',
        'parentId': 'hmcc-system',
        'sort': '3',
        'children': [{
          'id': 'pov-dev-monitoring-scan',
          'label': '查看委托仓库监控',
          'parentId': 'hmcc-system'
        }]
      },
      {
        'id': 'history-data-manager',
        'label': '历史数据查询',
        'parentId': 'hmcc-system',
        'sort': '4',
        'children': [{
          'id': 'history-data-manager-scan',
          'label': '查看历史数据',
          'parentId': 'hmcc-system'
        }]
      },
      {
        'id': 'freezer-dev-temperature-record-manager',
        'label': '冷链设备温度记录',
        'parentId': 'hmcc-system',
        'sort': '5',
        'children': [{
          'id': 'freezer-dev-temperature-record-manager-scan',
          'label': '查看冷链设备温度记录',
          'parentId': 'hmcc-system'
        }]
      }
    ]
  },
  {
    'id': 'dev-manager',
    'label': '设备管理',
    'parentId': 'dev-manager',
    'sort': '3',
    'children': [
      {
        'id': 'sensor-manager',
        'label': '探头管理',
        'parentId': 'hmcc-system',
        'sort': '1',
        'children': [
          {
            'id': 'sensor-scan',
            'label': '查看探头管理',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'sensor-add',
            'label': '新增探头',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'sensor-edit',
            'label': '编辑探头',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'sensor-active',
            'label': '启用探头',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'sensor-disable',
            'label': '停用探头',
            'parentId': 'hmcc-system'
          }
        ]
      },
      {
        'id': 'freezer-dev-manager',
        'label': '冷链设备管理',
        'parentId': 'hmcc-system',
        'sort': '2',
        'children': [
          {
            'id': 'freezer-dev-scan',
            'label': '查看冷链设备管理',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'freezer-dev-add',
            'label': '新增冷链设备',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'freezer-dev-edit',
            'label': '编辑冷链设备',
            'parentId': 'hmcc-system'
          }
        ]
      },
      {
        'id': 'gateway-dev-manager',
        'label': '网关管理',
        'parentId': 'hmcc-system',
        'sort': '2',
        'children': [
          {
            'id': 'gateway-dev-scan',
            'label': '查看网关管理',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'gateway-dev-add',
            'label': '新增网关',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'gateway-dev-edit',
            'label': '编辑网关',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'gateway-dev-active',
            'label': '启用网关',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'gateway-dev-disable',
            'label': '停用网关',
            'parentId': 'hmcc-system'
          }
        ]
      }
    ]
  },
  {
    'id': 'config-center-manager',
    'label': '配置中心',
    'parentId': 'hmcc-system',
    'sort': '4',
    'children': [
      {
        'id': 'alarm-rule-manager',
        'label': '告警规则',
        'parentId': 'hmcc-system',
        'sort': '1',
        'children': [
          {
            'id': 'alarm-rule-scan',
            'label': '查看告警规则',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-rule-add',
            'label': '新增告警规则',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-rule-edit',
            'label': '编辑告警规则',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-rule-delete',
            'label': '删除告警规则',
            'parentId': 'hmcc-system'
          }
        ]
      },
      {
        'id': 'alarm-notice-group-manager',
        'label': '告警通知组',
        'parentId': 'hmcc-system',
        'sort': '2',
        'children': [
          {
            'id': 'alarm-notice-group-scan',
            'label': '查看告警通知组',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-notice-group-add',
            'label': '新增告警通知组',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-notice-group-edit',
            'label': '编辑告警通知组',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-notice-group-delete',
            'label': '删除告警通知组',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'ccs-wachart-qr-code',
            'label': '绑定微信',
            'parentId': 'hmcc-system'
          },
        ]
      },
      {
        'id': 'alarm-test-log-manager',
        'label': '告警测试',
        'parentId': 'hmcc-system',
        'sort': '3',
        'children': [
          {
            'id': 'alarm-test-log-scan',
            'label': '查看告警测试',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-test-log-add',
            'label': '新增告警测试',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-test-log-confirm',
            'label': '确认告警测试',
            'parentId': 'hmcc-system'
          },
        ]
      }
    ]
  },
  {
    'id': 'alarm-center-manager',
    'label': '告警中心',
    'parentId': 'hmcc-system',
    'sort': '5',
    'children': [
      {
        'id': 'alarm-event-manager',
        'label': '告警事件',
        'parentId': 'hmcc-system',
        'sort': '1',
        'children': [
          {
            'id': 'alarm-event-scan',
            'label': '查看告警事件',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-event-handle',
            'label': '处理告警事件',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'alarm-event-export',
            'label': '导出告警事件',
            'parentId': 'hmcc-system'
          }
        ]
      },
      {
        'id': 'alarm-notice-record-manager',
        'label': '告警通知',
        'parentId': 'hmcc-system',
        'sort': '1',
        'children': {
          'id': 'alarm-notice-record-scan',
          'label': '查看告警通知',
          'parentId': 'hmcc-system'
        }
      }
    ]
  },
  {
    'id': 'dev-patrol-manager',
    'label': '设备巡检',
    'parentId': 'hmcc-system',
    'sort': '6',
    'children': [
      {
        'id': 'patrol-project-manager',
        'label': '巡检计划',
        'parentId': 'hmcc-system',
        'sort': '1',
        'children': [
          {
            'id': 'patrol-project-scan',
            'label': '查看巡检计划',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'patrol-project-add',
            'label': '新增巡检计划',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'patrol-project-edit',
            'label': '编辑巡检计划',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'patrol-project-delete',
            'label': '删除巡检计划',
            'parentId': 'hmcc-system'
          },
          {
            'id': 'patrol-record-add',
            'label': '新增设备巡检记录',
            'parentId': 'hmcc-system'
          },
        ]
      }
    ]
  },
  {
    id: 'system-config',
    label: '系统设置',
    children: [
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
            id: 'system-setting-role-manager-delete',
            label: '删除角色'
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
        id: 'system-setting-log',
        label: '系统日志'
      },
      {
        id: 'query-all-org-regulation',
        label: '查看所有单位',
        children: []
      }
    ]
  }
];
