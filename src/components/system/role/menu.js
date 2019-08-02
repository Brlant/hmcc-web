export default [
  {
    id: 'org-info-manager',
    label: '业务单位主档管理',
    children: [
      {
        id: 'base-info-manager',
        label: '基础信息管理',
        children: [
          {
            id: 'base-info-manager-query',
            label: '查看单位'
          },
          {
            id: 'base-info-manager-add',
            label: '添加单位'
          },
          {
            id: 'base-info-manager-edit',
            label: '编辑单位'
          },
          {
            id: 'base-info-manager-audit',
            label: '审核单位'
          }
        ]
      },
      {
        id: 'licences-manager',
        label: '单位证照管理',
        children: [
          {
            id: 'licences-manager-query',
            label: '查看单位证照'
          },
          {
            id: 'licences-manager-add',
            label: '添加单位证照'
          },
          {
            id: 'licences-manager-edit',
            label: '编辑单位证照'
          },
          {
            id: 'licences-manager-delete',
            label: '删除单位证照'
          }
        ]
      },
      {
        id: 'address-manager',
        label: '仓库地址管理',
        children: [
          {
            id: 'address-manager-query',
            label: '查看单位仓库地址'
          },
          {
            id: 'address-manager-add',
            label: '添加单位仓库地址'
          },
          {
            id: 'address-manager-edit',
            label: '编辑单位仓库地址'
          },
          {
            id: 'address-manager-stop',
            label: '停用单位仓库地址'
          },
          {
            id: 'address-manager-start',
            label: '启用单位仓库地址'
          },
          {
            id: 'address-manager-audit',
            label: '审核单位仓库地址'
          }
        ]
      }
    ]
  },
  {
    id: 'vaccine-info-manager',
    label: '疫苗主档管理',
    children: [
      {
        id: 'vaccine-info-manager-query',
        label: '查看疫苗主档'
      },
      {
        id: 'vaccine-info-manager-add',
        label: '添加疫苗主档'
      },
      {
        id: 'vaccine-info-manager-excel-template',
        label: '货品Excel模板'
      },
      {
        id: 'vaccine-info-manager-excel-package-export',
        label: '导出货品包装Excel'
      },
      {
        id: 'vaccine-info-manager-excel-goods-export',
        label: '导出货品Excel'
      },
      {
        id: 'vaccine-info-manager-excel-goods-import',
        label: '导入Excel新增货品'
      },
      {
        id: 'vaccine-info-manager-edit',
        label: '编辑疫苗主档'
      },
      {
        id: 'vaccine-info-manager-audit',
        label: '审核疫苗主档'
      }
    ]
  },
  {
    id: 'query-all-org-regulation',
    label: '监管所有单位'
  },
  {
    id: 'vaccine-group-manager',
    label: '授权模板管理',
    children: [
      {
        id: 'vaccine-group-purchase-manager',
        label: '采购授权模板',
        children: [
          {
            id: 'vaccine-group-purchase-manager-query',
            label: '查看采购授权模板'
          },
          {
            id: 'vaccine-group-purchase-manager-add',
            label: '添加采购授权模板'
          },
          {
            id: 'vaccine-group-purchase-manager-edit',
            label: '编辑采购授权模板'
          }
        ]
      },
      {
        id: 'vaccine-group-sale-manager',
        label: '销售授权模板',
        children: [
          {
            id: 'vaccine-group-sale-manager-query',
            label: '查看销售授权模板'
          },
          {
            id: 'vaccine-group-sale-manager-add',
            label: '添加销售授权模板'
          },
          {
            id: 'vaccine-group-sale-manager-edit',
            label: '编辑销售授权模板'
          }
        ]
      }
    ]
  },
  {
    id: 'vaccine-auth-manager',
    label: '疫苗授权',
    children: [
      {
        id: 'vaccine-auth-purchase-manager',
        label: '采购授权',
        children: [
          {
            id: 'vaccine-auth-purchase-manager-query',
            label: '查看采购授权'
          },
          {
            id: 'vaccine-auth-purchase-manager-add',
            label: '添加采购授权'
          },
          {
            id: 'vaccine-auth-purchase-manager-cancel',
            label: '取消采购授权'
          }
        ]
      },
      {
        id: 'vaccine-auth-sale-manager',
        label: '销售授权',
        children: [
          {
            id: 'vaccine-auth-sale-manager-query',
            label: '查看销售授权'
          },
          {
            id: 'vaccine-auth-sale-manager-add',
            label: '添加销售授权'
          },
          {
            id: 'vaccine-auth-sale-manager-cancel',
            label: '取消销售授权'
          }
        ]
      }
    ]
  },
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
  },
  {
    id: 'biz-regulation',
    label: '业务监管',
    children: [
      {
        id: 'biz-regulation-out-order-manager',
        label: '出库订单监管',
        children: [
          {
            id: 'biz-regulation-out-order-manager-query',
            label: '查看出库订单'
          },
          {
            id: 'biz-regulation-out-order-manager-push-data',
            label: '推送数据'
          }
        ]
      },
      {
        id: 'biz-regulation-in-order-manager',
        label: '入库订单监管',
        children: [
          {
            id: 'biz-regulation-in-order-manager-query',
            label: '查看入库订单'
          }
        ]
      },
      {
        id: 'erp-order-document-watch',
        label: '查看订单附件'
      },
      {
        id: 'biz-regulation-address-manager',
        label: '即时库存监管',
        children: [
          {
            id: 'biz-regulation-address-manager-query',
            label: '查看即时库存'
          },
          {
            id: 'biz-regulation-address-manager-export-excel',
            label: '导出excel'
          }
        ]
      }
    ]
  },
  {
    id: 'info-public-manager',
    label: '信息发布管理',
    children: [
      {
        id: 'info-public-manager-query',
        label: '查看信息发布'
      },
      {
        id: 'info-public-manager-add',
        label: '添加信息发布'
      },
      {
        id: 'info-public-manager-edit',
        label: '编辑信息发布'
      },
      {
        id: 'info-public-manager-stop',
        label: '撤回信息发布'
      },
      {
        id: 'info-public-manager-assign',
        label: '授权单位'
      },
      {
        id: 'info-public-manager-issue',
        label: '授权发布'
      },
      {
        id: 'info-public-manager-stick',
        label: '置顶'
      },
      {
        id: 'info-public-manager-cancel-stick',
        label: '取消置顶'
      },
      {
        id: 'info-public-manager-delete',
        label: '删除'
      }
    ]
  },
  {
    id: 'role-manager',
    label: '角色管理',
    children: [
      {
        id: 'role-all-manager',
        label: '全系统角色管理',
        children: [
          {
            id: 'role-all-manager-query',
            label: '查看系统角色'
          },
          {
            id: 'role-all-manager-add',
            label: '添加系统角色'
          },
          {
            id: 'role-all-manager-edit',
            label: '编辑系统角色'
          },
          {
            id: 'role-all-manager-delete',
            label: '删除系统角色'
          },
          {
            id: 'role-all-manager-export',
            label: '导出系统角色Excel'
          }
        ]
      },
      {
        id: 'role-org-manager',
        label: '各单位角色管理',
        children: [
          {
            id: 'role-org-manager-query',
            label: '查看单位角色'
          },
          {
            id: 'role-org-manager-add',
            label: '添加单位角色'
          },
          {
            id: 'role-org-manager-edit',
            label: '编辑单位角色'
          },
          {
            id: 'role-org-manager-delete',
            label: '删除单位角色'
          },
          {
            id: 'role-org-manager-export',
            label: '导出单位角色Excel'
          }
        ]
      }
    ]
  },
  {
    id: 'account-manager',
    label: '账号管理',
    children: [
      {
        id: 'account-all-manager',
        label: '全系统账号管理',
        children: [
          {
            id: 'account-all-manager-query',
            label: '查看系统账号'
          },
          {
            id: 'account-all-manager-add',
            label: '添加系统账号'
          },
          {
            id: 'account-all-manager-edit',
            label: '编辑系统账号'
          },
          {
            id: 'account-all-manager-start',
            label: '启用系统账号'
          },
          {
            id: 'account-all-manager-stop',
            label: '停用系统账号'
          }
        ]
      },
      {
        id: 'account-org-manager',
        label: '各单位系统账号管理',
        children: [
          {
            id: 'account-org-manager-query',
            label: '查看单位系统账号'
          },
          {
            id: 'account-org-manager-add',
            label: '添加单位系统账号'
          },
          {
            id: 'account-org-manager-edit',
            label: '编辑单位系统账号'
          },
          {
            id: 'account-org-manager-start',
            label: '启用单位系统账号'
          },
          {
            id: 'account-org-manager-stop',
            label: '停用单位系统账号'
          }
        ]
      }
    ]
  },
  {
    id: 'system-setting',
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
        id: 'system-setting-role-manager',
        label: '角色管理',
        children: [
          {
            id: 'system-setting-role-manager-query',
            label: '查看角色'
          },
          {
            id: 'system-setting-role-manager-add',
            label: '添加角色'
          },
          {
            id: 'system-setting-role-manager-edit',
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
        'id': 'dict-manager',
        'label': '数据字典',
        'children': [
          {
            'id': 'voss-dict-group-query',
            'label': '查询数据字典组',
          },
          {
            'id': 'voss-dict-group-add',
            'label': '新增数据字典组',
          },
          {
            'id': 'voss-dict-group-update',
            'label': '编辑数据字典组',
          },
          {
            'id': 'voss-dict-group-softDelete',
            'label': '删除数据字典组',
          },
          {
            'id': 'voss-dict-item-query',
            'label': '查询数据字典项',
          },
          {
            'id': 'voss-dict-item-add',
            'label': '新增数据字典项',
          },
          {
            'id': 'voss-dict-item-update',
            'label': '编辑数据字典项',
          },
          {
            'id': 'voss-dict-item-softDelete',
            'label': '删除数据字典项',
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
      }
    ]
  }
];
