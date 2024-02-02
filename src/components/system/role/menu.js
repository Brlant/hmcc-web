export default [
  {
    id: 'hmcc-index-scan',
    label: '首页',
    parentId: 'hmcc-system',
    sort: 0
  },
  {
    id: 'org-manage',
    label: '业务单位管理',
    sort: 1,
    children: [
      {
        id: 'org-base-manage',
        label: '基础信息管理',
        sort: 0,
        children: [
          {
            id: 'org-base-manage-query',
            label: '查看单位'
          },
          {
            id: 'org-base-manage-add',
            label: '添加单位'
          },
          {
            id: 'org-base-manage-edit',
            label: '编辑单位'
          },
          {
            id: 'org-base-manage-audit',
            label: '审核单位'
          },
          {
            id: 'org-base-manage-export',
            label: '导出单位'
          }
        ]
      },
      {
        id: 'org-licences-manage',
        label: '单位证照管理',
        sort: 1,
        children: [
          {
            id: 'org-licences-manage-query',
            label: '查看单位证照'
          },
          {
            id: 'org-licences-manage-add',
            label: '添加单位证照'
          },
          {
            id: 'org-licences-manage-edit',
            label: '编辑单位证照'
          },
          {
            id: 'org-licences-manage-delete',
            label: '删除单位证照'
          }
        ]
      },
      // {
      //   id: 'address-manage',
      //   label: '仓库地址管理',
      //   children: [
      //     {
      //       id: 'address-manage-query',
      //       label: '查看单位仓库地址'
      //     },
      //     {
      //       id: 'address-manage-add',
      //       label: '添加单位仓库地址'
      //     },
      //     {
      //       id: 'address-manage-edit',
      //       label: '编辑单位仓库地址'
      //     },
      //     {
      //       id: 'address-manage-stop',
      //       label: '停用单位仓库地址'
      //     },
      //     {
      //       id: 'address-manage-start',
      //       label: '启用单位仓库地址'
      //     },
      //     {
      //       id: 'address-manage-audit',
      //       label: '审核单位仓库地址'
      //     },
      //     {
      //       id: 'address-manage-export',
      //       label: '导出单位仓库地址',
      //     }
      //   ]
      // }
      {
        id: 'org-relation-manage',
        label: '单位关系管理',
        children: [
          {
            id: 'org-relation-manage-query',
            label: '查看单位关系'
          },
          {
            id: 'org-relation-manage-add',
            label: '添加单位关系'
          },
          {
            id: 'org-relation-manage-delete',
            label: '删除单位关系'
          }
        ]
      }
    ]
  },
  {
    id: 'dev-manage',
    label: '设备管理',
    parentId: 'hmcc-system',
    sort: 2,
    children: [
      {
        id: 'in-hospital-dev-manage',
        label: '院内设备管理',
        parentId: 'dev-manage',
        sort: '1',
        children: [
          {
            id: 'freezer-dev-manage',
            label: '冷链设备管理',
            parentId: 'in-hospital-dev-manage',
            sort: '1',
            children: [
              {
                id: 'freezer-dev-scan',
                label: '查看冷链设备管理',
                parentId: 'freezer-dev-manage'
              },
              {
                id: 'freezer-dev-add',
                label: '新增冷链设备',
                parentId: 'freezer-dev-manage'
              },
              {
                id: 'freezer-dev-edit',
                label: '编辑冷链设备',
                parentId: 'freezer-dev-manage'
              }
            ]
          },
          {
            id: 'healths-dev-manage',
            label: '医疗设备管理',
            parentId: 'in-hospital-dev-manage',
            sort: '2',
          },
        ]
      },
      {
        id: 'iot-tag-manage',
        label: '物联网标签管理',
        parentId: 'dev-manage',
        sort: '2',
        children: [
          {
            id: 'sensor-manage',
            label: '冷链标签',
            parentId: 'iot-tag-manage',
            sort: '1',
            children: [
              {
                id: 'sensor-scan',
                label: '查看冷链标签',
                parentId: 'sensor-manage'
              },
              {
                id: 'sensor-add',
                label: '新增冷链标签',
                parentId: 'sensor-manage'
              },
              {
                id: 'sensor-edit',
                label: '编辑冷链标签',
                parentId: 'sensor-manage'
              },
              {
                id: 'sensor-active',
                label: '启用冷链标签',
                parentId: 'sensor-manage'
              },
              {
                id: 'sensor-disable',
                label: '停用冷链标签',
                parentId: 'sensor-manage'
              }
            ]
          },
          {
            id: 'locate-label',
            label: '定位标签',
            parentId: 'iot-tag-manage',
            sort: '2',
          },
          {
            id: 'energy-consumption-label',
            label: '能耗标签',
            parentId: 'iot-tag-manage',
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
        id: 'gateway-basestation-manage',
        label: '网关基站管理',
        parentId: 'dev-manage',
        sort: '3',
        children: [
          {
            id: 'gateway-dev-manage',
            label: '网关管理',
            parentId: 'gateway-basestation-manage',
            sort: '2',
            children: [
              {
                id: 'gateway-dev-scan',
                label: '查看网关管理',
                parentId: 'gateway-dev-manage'
              },
              {
                id: 'gateway-dev-add',
                label: '新增网关',
                parentId: 'gateway-dev-manage'
              },
              {
                id: 'gateway-dev-edit',
                label: '编辑网关',
                parentId: 'gateway-dev-manage'
              },
              {
                id: 'gateway-dev-active',
                label: '启用网关',
                parentId: 'gateway-dev-manage'
              },
              {
                id: 'gateway-dev-disable',
                label: '停用网关',
                parentId: 'gateway-dev-manage'
              }
            ]
          },
          {
            id: 'basestation-manage',
            label: '基站管理',
            parentId: 'gateway-basestation-manage',
            sort: '2'
          },
        ]
      },
      {
        id: 'patrol-project-manage',
        label: '院内设备巡检',
        parentId: 'dev-manage',
        sort: '4',
        children: [
          {
            id: 'patrol-project-scan',
            label: '查看巡检计划',
            parentId: 'dev-patrol-manage'
          },
          {
            id: 'patrol-project-add',
            label: '新增巡检计划',
            parentId: 'dev-patrol-manage'
          },
          {
            id: 'patrol-project-edit',
            label: '编辑巡检计划',
            parentId: 'dev-patrol-manage'
          },
          {
            id: 'patrol-project-delete',
            label: '删除巡检计划',
            parentId: 'dev-patrol-manage'
          },
          {
            id: 'patrol-record-add',
            label: '新增设备巡检记录',
            parentId: 'dev-patrol-manage'
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
    id: 'config-center-manage',
    label: '告警管理',
    parentId: 'hmcc-system',
    sort: 4,
    children: [
      {
        id: 'alarm-rule-manage',
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
        id: 'alarm-notice-group-manage',
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
        id: 'alarm-test-log-manage',
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
    id: 'alarm-center-manage',
    label: '告警中心',
    parentId: 'hmcc-system',
    sort: 5,
    children: [
      {
        id: 'alarm-event-manage',
        label: '设备告警',
        parentId: 'alarm-center-manage',
        sort: '1',
        children: [
          {
            id: 'alarm-event-scan',
            label: '查看设备告警',
            parentId: 'alarm-center-manage'
          },
          {
            id: 'alarm-event-handle',
            label: '处理设备告警',
            parentId: 'alarm-center-manage'
          },
          {
            id: 'alarm-event-export',
            label: '导出设备告警',
            parentId: 'alarm-center-manage'
          }
        ]
      },
      {
        id: 'alarm-notice-record-manage',
        label: '告警通知记录',
        parentId: 'alarm-center-manage',
        sort: '2',
        children: [{
          id: 'alarm-notice-record-scan',
          label: '查看告警通知记录',
          parentId: 'alarm-notice-record-manage'
        }]
      }, {
        id: 'alarm-tag-manage',
        label: '标签告警',
        parentId: 'alarm-center-manage',
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
    id: 'monitoring-center-manage',
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
        id: 'pov-dev-monitoring',
        label: '关联单位设备监控',
        parentId: 'hmcc-system',
        sort: '2',
        children: [
          {
            id: 'pov-dev-monitoring-scan',
            label: '查看关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'pov-dev-monitoring-add',
            label: '添加关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'pov-dev-monitoring-edit',
            label: '修改关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'pov-dev-monitoring-delete',
            label: '删除关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'pov-dev-monitoring-active',
            label: '激活关联单位设备监控',
            parentId: 'hmcc-system'
          },
          {
            id: 'pov-own-dev-monitoring-disable',
            label: '停止关联单位设备监控',
            parentId: 'hmcc-system'
          }
        ]
      },
      {
        id: 'history-data-manage',
        label: '历史数据查询',
        parentId: 'hmcc-system',
        sort: '4',
        children: [{
          id: 'history-data-manage-scan',
          label: '查看历史数据',
          parentId: 'hmcc-system'
        }]
      },
      {
        id: 'freezer-dev-temperature-record-manage',
        label: '冷链设备温度记录',
        parentId: 'hmcc-system',
        sort: '5',
        children: [{
          id: 'freezer-dev-temperature-record-manage-scan',
          label: '查看冷链设备温度记录',
          parentId: 'hmcc-system'
        }]
      },
      {
        id: 'freezer-manage-evaluation',
        label: '冷链管理评估表',
        parentId: 'hmcc-system',
        sort: '5',
        children: [{
          id: 'freezer-manage-evaluation-scan',
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
    id: 'energy-efficiency-manage',
    label: '设备能效管理系统',
    parentId: 'hmcc-system',
    sort: 8,
    children: [
      {
        id: 'energy-efficiency-monitor',
        label: '实时能耗监控',
        parentId: 'energy-efficiency-manage',
        sort: 0,
      },
      {
        id: 'energy-efficiency-analysis',
        label: '汇总能耗分析',
        parentId: 'energy-efficiency-manage',
        sort: 1,
      },
    ]
  },
  {
    id: 'system-config',
    label: '系统设置',
    children: [
      {
        id: 'system-setting-account-manage',
        label: '账号管理',
        children: [
          {
            id: 'system-setting-account-manage-query',
            label: '查看账号'
          },
          {
            id: 'system-setting-account-manage-add',
            label: '添加账号'
          },
          {
            id: 'system-setting-account-manage-edit',
            label: '编辑账号'
          },
          {
            id: 'system-setting-account-manage-start',
            label: '启用账号'
          },
          {
            id: 'system-setting-account-manage-stop',
            label: '停用账号'
          }
        ]
      },
      {
        id: 'access-role-manage',
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
            id: 'system-setting-role-manage-export',
            label: '导出角色Excel'
          }
        ]
      },
      {
        id: 'system-setting-org-account-manage',
        label: '各单位账号管理',
        children: [
          {
            id: 'system-setting-org-account-manage-query',
            label: '查看单位账号'
          },
          {
            id: 'system-setting-org-account-manage-add',
            label: '添加单位账号'
          },
          {
            id: 'system-setting-org-account-manage-edit',
            label: '编辑单位账号'
          },
          {
            id: 'system-setting-org-account-manage-start',
            label: '启用单位账号'
          },
          {
            id: 'system-setting-org-account-manage-stop',
            label: '停用单位账号'
          }
        ]
      },
      {
        id: 'dict-manage',
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
      }
    ]
  },


];
