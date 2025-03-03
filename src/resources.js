import {Loading, Message, Notification} from 'element-ui';
import axios from 'axios';
import Vue from 'vue';
import WholeErrorSignHandle from '@/tools/whole-error-sign-handle';
import qs from 'qs';
import {saveAs} from 'file-saver'

export const http = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 30000,
  withCredentials: true
});


function isNewReturnType(data) {
  let keys = Object.keys(data);
  if (keys.length !== 3) return false;
  return ['code', 'data', 'msg'].every(e => keys.includes(e));
}

// 添加请求拦截器
http.interceptors.request.use(function (config) {
  config.headers["X-DOMAIN"] = 'hmcc-system'
  if (config.method === 'get') {
    config.paramsSerializer = params => {
      return qs.stringify(params, {indices: false});
    };
  }
  return config;
});

http.interceptors.response.use(response => {
  if (isNewReturnType(response.data)) {
    switch (response.data.code) {
      case 200 :
        return response.data;
      case 401:
        window.location.href = '#/login';
        break;
      case 403:
        Notification.error({
          message: '您没有权限请求信息，请联系管理员。',
          onClose: function () {
            window.localStorage.removeItem('noticeError');
          }
        });
        break;
      default:
        Notification.error(response.data.msg || '接口请求异常，请稍后再试');
    }
    return Promise.reject({response});
  } else {
    return response;
  }
}, error => {
  // 清空标志
  WholeErrorSignHandle.clear();

  let noticeTipKey = 'noticeError';
  let notice = window.localStorage.getItem(noticeTipKey);
  let response = error.response;

  // console.log(`接口【${error.url}】异常`, JSON.stringify(error))
  if (!response || response.status === 500) {
    Notification.warning({
      message: '服务器太久没有响应, 请重试',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });

    // 添加标志
    WholeErrorSignHandle.add();
    return Promise.reject(error);
  }

  if (notice === '1' && response.status !== 401) {
    return Promise.reject(error);
  } else {
    window.localStorage.setItem(noticeTipKey, '1');
  }

  if (response.status === 401) { //  Unauthorized, redirect to login
    let lastUrl = window.localStorage.getItem('lastUrl');
    if (!lastUrl || lastUrl.indexOf('/base/dict') === -1) {
    }
    window.location.href = '#/login';
    return Promise.reject(error);
  }
  if (response.status === 403) {
    Notification.error({
      message: '您没有权限请求信息，请联系管理员。',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    // 添加标志
    WholeErrorSignHandle.add();
  }

  if (response.status === 502) {
    Notification.error({
      message: '系统请求失败',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    // 添加标志
    WholeErrorSignHandle.add();
  }

  if (response.status === 400 || response.status === 428) {
    Notification.error({
      message: response.data.msg || '接口异常，请联系管理员',
      onClose: function () {
        window.localStorage.removeItem(noticeTipKey);
      }
    });
    // 添加标志
    WholeErrorSignHandle.add();
  }

  return Promise.reject(error);
});

Vue.prototype.$http = http;


//巡检记录
export const checkRecord = resource('/patrol-record', http, {
  query(id) {
    return http.post(`/patrol-record/${id}/page`);
  },
  update(obj) {
    return http.post('/patrol-record', obj);
  }
});

//巡检计划
export const checkPlan = resource('/patrol-project', http, {
  query(params) {
    return http.post('/patrol-project/page', params);
  },
  update(obj) {
    return http.put('/patrol-project', obj);
  }
});

// 管理评估
export const managerAssess = {
  query(params) {
    return http.post('/freezer-management-evaluation/page', params);
  },
  export(params) {
    return http.post('/freezer-management-evaluation/export', params);
  }
};


// 设备评估
export const devAssess = {
  query(params) {
    return http.post('/freezer-dev-evaluation/page', params);
  },
  export(params) {
    return http.post('/freezer-dev-evaluation/export', params);
  },
  refreshItem(id, obj) {
    return http.put(`/freezer-dev-evaluation/${id}`, obj)
  }
};

// 温度记录
export const temperatureRecord = {
  add(obj) {
    return http.post('/temperature-measurement-record', obj);
  },
  query(params) {
    return http.post('/temperature-measurement-record/list', params);
  }
};

// 告警设备
export const monitorRelation = resource('/monitor-relation', http, {
  query(params) {
    return http.post('/monitor-relation/page', params);
  },
  stop(id) {
    return http.put(`/monitor-relation/disable/${id}`);
  },
  start(id) {
    return http.put(`/monitor-relation/active/${id}`);
  }
});


// 告警通知
export const NotifyRecord = resource('/alarm-notice-record', http, {
  query(params) {
    return http.post('/alarm-notice-record/page', params);
  }
});


// 告警事件
export const alarmEvent = resource('/alarm-event', http, {
  queryList(params) {
    return http.post('/alarm-event/list', params);
  },
  queryPage(params) {
    return http.post('/alarm-event/page', params);
  },
  batchConfirmItem(obj) {
    return http.put('/alarm-event/handle', obj);
  },
  queryLotsAlarm(id) {
    return http.post(`/alarm-event/${id}/alarm-type-count`)
  }
});


// 告警测试
export const AlarmTest = resource('/alarm-test-log', http, {
  query(params) {
    return http.post('/alarm-test-log/page', params);
  },
  update(obj) {
    return http.put('/alarm-test-log', obj);
  },
  confirm(obj) {
    return http.put('/alarm-test-log/confirm', obj);
  }
});

// 告警通知组
export const AlarmNotifyGroup = resource('/alarm-notice-group', http, {
  query(params) {
    return http.post('/alarm-notice-group/page', params);
  },
  update(obj) {
    return http.put('/alarm-notice-group', obj);
  }
});


// 告警规则
export const AlarmRule = resource('/alarm-rule', http, {
  query(params) {
    return http.post('/alarm-rule/page', params);
  },
  update(obj) {
    return http.put('/alarm-rule', obj);
  }
});


//冷链设备管理
export const gateway = resource('/gateway', http, {
  query(params) {
    return http.post('/gateway/page', params);
  },
  update(obj) {
    return http.put('/gateway', obj);
  },
  queryStateNum(params) {
    return http.post('/gateway/count', params);
  },
  stop(id) {
    return http.put(`/gateway/disable/${id}`);
  },
  start(id) {
    return http.put(`/gateway/active/${id}`);
  }
});


//冷链设备管理
export const coolApi = resource('/freezer-dev', http, {
  query(params) {
    return http.post('/freezer-dev/page', params);
  },
  update(obj) {
    return http.put('/freezer-dev', obj);
  },
  queryStateNum(params) {
    return http.post('/freezer-dev/count', params);
  },
  unbindDeviceTagRelation(tagId, deviceId, type) {
    let params = {
      tagId,
      deviceId,
      type
    };
    return http.get('/freezer-dev/unbindDeviceTagRelation', {params});
  },
  deleteById(id) {
    let params = {
      id
    };

    return http.get(`/device/deleteById`, {params});
  },
});

//医疗设备管理
export const medicalApi = {
  queryAllByCondition(params) {
    return http.post('/device/queryAllByCondition', params);
  },
  addDevice(data) {
    return http.post('/device/addDevice', data)
  },
  editDevice(data) {
    return http.post('/device/editDevice', data);
  },
  queryById(id) {
    let params = {id};

    return http.get(`/device/queryById`, {params});
  },
  deleteById(id) {
    let params = {
      id
    };

    return http.get(`/device/deleteById`, {params});
  },
  unbindDeviceTagRelation(tagId, deviceId, type) {
    let params = {
      tagId,
      deviceId,
      type
    };
    return http.get('/device/unbindDeviceTagRelation', {params});
  },
};

// 冷链标签api
export const ColdChainLabelApi = resource('/sensor', http, {
  queryNoAlarm(data) {
    return http.post('/sensor/page_no_alarm', data);
  },
  query(params) {
    return http.post('/sensor/page', params);
  },
  update(obj) {
    return http.put('/sensor', obj);
  },
  queryStateNum(params) {
    return http.post('/sensor/count', params);
  },
  stop(id) {
    return http.put(`/sensor/disable/${id}`);
  },
  start(id) {
    return http.put(`/sensor/active/${id}`);
  },
  batchImport(formData) {
    return http.post(`/sensor/import`, formData);
  }
});

// 能耗标签接口
export const EnergyTagApi = resource('/energyTag', http, {
  query(params) {
    return http.post('/energyTag/queryListByPage', params);
  },
  update(obj) {
    return http.post('/energyTag/editEnergyTag', obj);
  },
  queryStateNum(params) {
    return http.post('/energyTag/count', params);
  },
  stop(id) {
    return http.put(`/energyTag/disable/${id}`);
  },
  start(id) {
    return http.put(`/energyTag/active/${id}`);
  },
  batchImport(formData) {
    return http.post(`/energyTag/import`, formData);
  }
});


// warehouseDevImage
export const warehouseDevImage = resource('/warehouseDevImage', http, {});

export const DevBackUp = resource('/ccsDevBackup', http, {});


// 绑定规则信息
export const BindRule = resource('/ccsNotifyPlan', http, {
  bindCcsNotifyPlan(obj) {
    return http.post('/ccsNotifyPlan/bindCcsNotifyPlan', obj);
  },
  bindCcsNotifyPlans(obj) {
    return http.post('/ccsNotifyPlan/bindCcsNotifyPlans', obj);
  }
});

// 设备监控对象组
export const MonitoringObjGroup = resource('/ccsMonitorRelation', http, {
  queryStateNum: (params) => {
    return http.get('/ccsMonitorRelation/countMonitorRelationGroup', {params});
  },
  modifyMonitorStatus(obj) {
    return http.put('/ccsMonitorRelation/activeRelation', obj);
  },
  modifyMonitorStatusSingle(obj) {
    return http.put('/ccsMonitorRelation/activeRelations', obj);
  },
  addCcsOrderDevMonitorRelation: (params) => {
    return http.post('/ccsMonitorRelation/ccs-order-thermometer', params);
  },
  deleteCcsMonitorRelationByMonitorTargetIdAndDevCode: (ccsOrderId, obj) => {
    return http.post('/ccsMonitorRelation/ccs-order-thermometer/' + ccsOrderId, obj);
  }
});

// 设备运单监控对象
export const waybillMonitoring = resource('/ccsOrder', http, {});

// 设备监控对象
export const DevMonitoring = resource('/ccsMonitordev', http, {
  queryStateNum: (params) => {
    return http.get('/ccsMonitordev/countMonitordevGroup', {params});
  }
});

// 仓位设备关系对象
export const WarehouseDevRelation = resource('/ccsWarehouseDevRelation', http, {
  queryWareHouseAllDevs(id) {
    return http.get(`/ccsWarehouseDevRelation/gainWarehouseAllDevRelationList/${id}`);
  }
});

// 仓位
export const CcsWarehouse = resource('/ccsWarehouse', http, {
  queryAllList(params) {
    return http.get('/ccsWarehouse/gainAllWarehouseList', {params});
  }
});

// dev设备对象
export const TempDev = resource('/ccsDevice', http, {
  queryStateNum: (params) => {
    return http.get('/ccsDevice/countDeviceGroup', {params});
  },
  queryTempData(params) {
    return http.post('/ccsDevice/gainDeviceReportDatas', params);
  },
  queryALLTempByLike(params) {
    return http.get('/ccsDevice/queryDevListFuzzy', {params});
  },
  exportDevInfo(params) {
    return http.get('/ccsDevice/export-dev', {params});
  }
});

export const HandoverData = resource('/handover-data', http, {
  queryHandoverDataByDevNo: (devNo, params) => {
    return http.get(`/handover-data/${devNo}/info`, {params});
  }
});

// tmsOrder 对象
export const TmsOrder = resource('/stock-in', http, {
  queryStateNum: (params) => {
    return http.get('//stock-in/count', {params});
  }
});

// 车辆档案对象
export const CarArchives = resource('/car-archives', http, {
  checkPlateNumber: (params) => {
    return http.get('/car-archives/check/plate-number', {params});
  }
});

// 库存移库记录对象
export const StockMoveLog = resource('/stock-move-log', http, {});

// logisticsCenter物流中心对象
export const LogisticsCenter = resource('/logisticsCenter', http, {});

// store存储位对象
export const Store = resource('/store', http, {
  // 查询库位下的批次信息
  queryStockBatches: (id) => {
    return http.get('/store/' + id + '/batches', {});
  },
  // 过滤移出库位
  filterOutStore: (params) => {
    return http.get('/store/filter/outStore', {params});
  },
  // 过滤移出库区
  filterOutArea: (params) => {
    return http.get('/store/filter/outArea', {params});
  },
  batchStopStore: (params) => {
    return http.put('/store/batch/stop', params);
  },
  batchStartStore: (params) => {
    return http.put('/store/batch/start', params);
  },
  checkCode: (params) => {
    return http.get('/store/code', {params});
  }
});

// 部门对象
export const Department = resource('oms/department', http, {
  getPage: (params) => {
    return http.get('oms/department/page', {params});
  },
  getOnesMember: (id, params) => {
    return http.get('oms/department/' + id + '/member', {params});
  },
  getMembers: (params) => {
    return http.get('oms/department/members', {params});
  },
  queryStateNum: (params) => {
    return http.get('/oms/department/member/count', {params});
  }
});

// dev设备对象
export const Dev = resource('/dev', http, {});

// devDetail设备详情对象
export const DevDetail = resource('/dev-detail', http, {
  checkDevNo: (devNo, id, devId) => {
    return http.get('/dev-detail/devNo', {
      params: {devNo: devNo, id: id, devId: devId}
    });
  },
  getLogPageByDevDetailId: (devDetailId, params) => {
    return http.get(`/dev-detail/${devDetailId}/page`, {params});
  }
});

// devStore设备存储对象
export const DevStore = resource('/dev-store', http, {
  queryDevPager: (id, params) => {
    return http.get('/dev-store/dev/' + id, {params});
  }
});

// oms附件对象
export const OmsAttachment = resource('/omsAttachment', http, {
  queryOneAttachmentList: (objectId, objectType) => {
    return http.get('/omsAttachment/' + objectType + '/' + objectId, {});
  }
});
// 单位用户权限对象
export const OrgUser = resource('/oms/user/org', http, {
  queryOrgInfo: (id, params) => {
    return http.get('/oms/user/org/' + id, {params});
  },
  queryUsers: (id, params) => {
    return http.get(`/erp-org/${id}/users`, {params});
  }
});

// 角色管理对象
export const Access = resource('/oms/access', http, {
  getRoleMenus: (orgId) => {
    return http.get(`/erp-access/org/${orgId}/admin/menus/tree`);
  },
  getOmsRoleMenus: () => {
    return http.get('oms/access/menus/tree');
  },
  getOrgRoleMenus: (orgId) => {
    return http.get('/oms/access/org/' + orgId + '/admin/menus/tree');
  },
  getOrgRole: (orgId, params) => {
    params.objectId = 'cerp-system';
    return http.get('/oms/access/orgs/' + orgId, {params});
  },
  getRoleDetail: (roleId) => {
    return http.get('/oms/access/' + roleId);
  },
  queryERPAccess: (params) => {
    return http.get('/erp-access/orgs/self/', {params});
  },
  save: (obj) => {
    return http.post('/erp-access', obj);
  },
  saveSystem: (obj) => {
    return http.post(`/erp-access/system?systemObjectId=${obj.systemObjectId}`, obj);
  },
  queryStateNum: (params) => {
    return http.get('/erp-access/system/platform/count', {params});
  },
  queryErpStateNum: (params) => {
    return http.get('/erp-access/platform/count', {params});
  },
  querySystemAccess: (params) => {
    return http.get('/erp-access/', {params});
  }
});


// 角色管理对象
export const omsAccess = resource('/oms/access', http, {
  getRoleMenus: () => {
    return http.get('/oms/access/menus/tree', {params: {objectId: 'oms-system'}});
  },
  getOrgRoleMenus: (orgId) => {
    return http.get('/oms/access/org/' + orgId + '/admin/menus/tree');
  },
  getOrgRole: (orgId, params) => {
    return http.get('/oms/access/orgs/' + orgId, {params});
  },
  getRoleDetail: (roleId) => {
    return http.get('/oms/access/' + roleId);
  },
  queryStateNum: (params) => {
    return http.get('/oms/access/platform/count', {params});
  }
});

// 平台用户权限对象
export const User = resource('/oms/user', http, {
  queryAllUser: (params) => {
    return http.get('/oms/user/all', {params}
    );
  },
  checkEmail: (email, userId, orgId) => {
    return http.get('/oms/user/email', {
      params: {email: email, userId: userId, orgId: orgId}
    });
  },
  checkPhone: (phone, userId, orgId) => {
    return http.get('/oms/user/phone', {
      params: {phone: phone, userId: userId, orgId: orgId}
    });
  },
  resetPsw: (Obj) => {
    return http.put('/oms/user/password', Obj);
  },
  forget: (obj) => {
    return http.post('/oms/user/password/verifyMail', obj);
  },
  stopUser: (userId) => {
    return http.put(`/oms/user/${userId}/stop`);
  },
  enableUser: (userId) => {
    return http.put(`/oms/user/${userId}/enablement`);
  }
});

export const Auth = {
  checkLogin: () => {
    return http.get('/userinfo');
  },
  login: (data) => {
    return http.post('/login', data);
  },
  logout: () => {
    return http.get('/logout');
  },
  isLogin() {
    try {
      return User.current();
    } catch (e) {
      Notification.error('用户信息出错，请重新登录!');
    }
  },
  permission: () => {
    return http.get('/oms/access/permissions', {params: {objectId: 'hmcc-system'}}); //
  },
  queryWeChatInfo() {
    return http.get('/wechat/user/wechat');
  },
  unBindWeChat() {
    return http.put('/wechat/unbind/wechat');
  }
};

// 数据字典组对象
export const DictGroup = resource('/dictGroup', http, {
  checkGroupName: (groupName, groupId) => {
    return http.get('/dictGroup/name', {
      params: {groupName: groupName, groupId: groupId}
    });
  },
  checkItemKey: (key, itemId, groupId) => {
    return http.get('/dictItem/key', {
      params: {key: key, itemId: itemId, groupId: groupId}
    });
  },
  getAll: () => {
    return new Promise((resolve) => {
      http.get('/dictGroups').then(res => {
        let data = {};
        let groupItem;
        let item;
        for (let i = 0, len = res.data.length; i < len; i++) {
          groupItem = res.data[i];
          data[groupItem.group.name] = [];
          for (let j = 0, len1 = groupItem.items.length; j < len1; j++) {
            item = groupItem.items[j];
            data[groupItem.group.name].push({key: item.key, label: item.label});
          }
        }
        resolve(data);
      });
    });
  }
});

// 数据字典项对象
export const DictItem = resource('/dictItem', http, {});

// 货品管理
export const Goods = resource('/goods', http, {
  getGoodsDetail: (id) => {
    return http.get('/goods/' + id);
  }
});

// 仓库地址
export const Address = resource('/orgAddressInfo', http, {
  queryAddress: (id, params) => {
    return http.get('/orgAddressInfo/' + id, {params});
  },
  updateAddress: function (obj) {
    return http.put('/orgAddressInfo', obj);
  },
  check: (id, obj) => {
    return http.put('/orgAddressInfo/' + id + '/check', obj);
  },
  forbid: function (id) {
    return http.put('/orgAddressInfo/' + id + '/forbid', {});
  },
  bizForbid: function (id) {
    return http.put('/orgAddressInfo/' + id + '/bizForbid', {});
  },
  start: function (id) {
    return http.put('/orgAddressInfo/' + id + '/start', {});
  },
  auditInfo: (id, obj) => {
    return http.put('/orgAddressInfo/orgs/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/orgAddressInfo/count', {params});
  }
});

// 货主货品
export const OrgGoods = resource('/org/goods', http, {
  queryOneGoods: (id) => {
    return http.get('/orgs/goods/' + id, {});
  },
  check: (id, obj) => {
    return http.put('/org/goods/' + id + '/check', obj);
  },
  queryStateNum: (params) => {
    return http.get('/org/goods/count', {params});
  }
});

// 货主-基本信息
export const BaseInfo = resource('/orgs', http, {
  queryPager(params) {
    return http.get('/orgs/pager', {params});
  },
  // 查询数量
  queryStateNum: (params) => {
    return http.get('/orgs/count', {params});
  },
  // 转成货主
  turnToOwner: (orgId) => {
    return http.put('/orgs/transform/consignor/' + orgId, {});
  },
  // 一键审核组织基础信息(同时审核单v位基本信息、经营范围、执照信息,并审核基础信息模块)
  auditBaseInfo: (orgId, obj) => {
    return http.put('/orgs/' + orgId + '/check', obj);
  },
  // 根据业务关系查询相关的单位
  queryOrgByReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/relation/', {params: obj});
  },
  // 根据业务关系查询相关的单位
  queryOrgByValidReation: (orgId, obj) => {
    return http.get('/orgs/' + orgId + '/valid-relation/', {params: obj});
  },
  // 校验邮箱
  checkEmail: (email, userId) => {
    return http.get('/oms/user/email', {
      params: {email: email, userId: userId}
    });
  },
  // 校验名字
  checkName: (name, orgId) => {
    return http.post('/orgs/name', {name, orgId});
  },
  // 校验身份证
  checkCreditCode: (creditCode, orgId) => {
    return http.get('/orgs/creditCode', {
      params: {creditCode, orgId}
    });
  },
  // 校验oms代码唯一性
  checkManufacturerCode: (code, orgId) => {
    return http.get('/orgs/manufacturerCode', {
      params: {code, orgId}
    });
  },
  // 校验管理员账户唯一性
  checkAdminAccount: (account, orgId) => {
    return http.get('/orgs/account', {
      params: {account, orgId}
    });
  },

  // 货主基本信息
  queryBaseInfo: (orgid) => {
    return http.get('/orgs/' + orgid);
  },
  // 删除客服人员
  deleteCus: (id) => {
    return http.delete('/cusService/' + id, {});
  },
  // 添加客服人员
  addCus: (obj) => {
    return http.post('/cusService', obj);
  },
  // 添加货主经营范围
  addOrgScope: (obj) => {
    return http.post('/orgScope', obj);
  },
  // 删除货主经营范围
  deleteOrgScope: (id) => {
    return http.delete('/orgScope/' + id);
  },
  // 查询其他客服人员
  queryOtherCus: (obj) => {
    return http.get('/cusService/orgs/' + obj.orgId + '/users', {obj});
  },
  // 新增受控法规
  addFg: (obj) => {
    return http.post('/bizLegislation', obj);
  },
  // 删除受控法规
  deleteFg: (id) => {
    return http.delete('/bizLegislation/' + id);
  }
});

//被监管单位关系管理
export const orgRelation = resource('/subordinate-org', http, {
  query(data) {
    return http.post('/subordinate-org/pager', data);
  },
  queryAll(data) {
    return http.post('/subordinate-org/list', data);
  },
  querySubOrg(params) {
    return http.get('/subordinate-org/info', {params});
  },
  queryAllOrgByPermission(params) {
    return http.get('/subordinate-org/info/permission', {params});
  },
  queryAllOrgByPermissionSelf(params) {
    return http.get('/subordinate-org/info/permission/self', {params});
  },
  save(orgId, obj) {
    return http.post(`/subordinate-org?orgId=${orgId}`, obj);
  }
});

// 货主车牌信息
export const plateNumber = resource('/org-plate', http, {
  batchAddPlateNumber(obj) {
    return http.post('/org-plate/batch', obj);
  }
});

// 证照对象
export const orgLicence = resource('/order-licence', http, {
  queryPager: (params) => {
    return http.get('/order-licence/page', {params});
  },
  queryStateNum: (params) => {
    return http.get('/order-licence/count', {params});
  }
});

/**
 * create vue-resource's resource like object
 *
 * Default Actions
 *   get: {method: 'GET'}
 *   save: {method: 'POST'}
 *   query: {method: 'GET'}
 *   update: {method: 'PUT'}
 *   delete: {method: 'DELETE'}
 *
 * @param path the resource path
 * @param http axios instance
 * @param actions custom actions
 * @returns the resource object
 */
function resource(path, http, actions) {
  let obj = {
    get: id => http.get(path + '/' + id),
    save: obj => http.post(path, obj),
    query: params => http.get(path, {params}),
    update: (id, obj) => {
      let url = path + '/' + id;
      if (typeof (id) === 'object') {
        url = path;
        obj = id;
      }
      return http.put(url, obj);
    },
    delete: id => http.delete(path + '/' + id)
  };
  return Object.assign(obj, actions);
}

//接口合集
const queryList = {
  //查询列表
  list: `/device/queryAllByCondition`,
  //科室
  department: `/department/queryList`,
  //楼层
  floor: `/tFloor/queryTreeSelect`,
  //设备地址
  addressPos: `/devicePosition/queryLastPoint`
}

//设备查询接口合集
export const hosDevApi = {
  //设备查询接口
  queryDevice(data) {
    return http({
      url: queryList.list,
      method: 'POST',
      data
    })
  },
  //科室
  queryDepartment(data) {
    return http({
      url: queryList.department,
      method: 'POST',
      data
    })
  },
  //楼层级联
  queryFloor() {
    return http({
      url: queryList.floor,
      method: 'POST',
    })
  },
  //设备地址
  queryAddressPos(params) {
    return http({
      url: queryList.addressPos,
      method: 'get',
      params
    })
  }
}

//告警管理接口合集
export const waringApi = {
  //获取科室列表接口查询
  getDeptQueryList(data) {
    return http.post('/department/queryList', data)
  },
  //列表
  getWarningList(data) {
    return http.post('/tagAlarm/queryTagAlarmList', data)
  },
}

// 查询字典数据列表
export function hmccDictDataList(query) {
  return http({
    url: '/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function hmccDictDataDetail(id) {
  return http.get(`/dict/data/${id}`)
}

// 根据字典类型查询字典数据信息
export function hmccDictDataType(dictType) {
  return http.get(`/dict/data/type/${dictType}`)
}

// 新增字典数据
export function hmccDictDataAdd(data) {
  return http.post(`/dict/data`)
}

// 修改字典数据
export function hmccDictDataEdit(data) {
  return http.put(`/dict/data`)
}

// 删除字典数据
export function hmccDictDataDel(dictCodes) {
  return http.delete('/dict/data/${dictCodes}')
}

// 获取字典选择框列表
export function hmccDictTypeOptionselect() {
  return http({
    url: `/dict/type/optionselect`,
    method: 'get',
  })
}

//首页接口合集
export const indexApi = {
  //获取科室列表接口查询
  getDeptQueryList(params) {
    return http({
      url: `/department/queryList`,
      method: 'POST',
      data: params
    })
  },
  //设备总数
  getEquipmentTotal(params) {
    return http({
      url: `/device/queryCount`,
      method: 'get',
      params: params
    })
  },
  //列表
  getList(params) {
    return http({
      url: `/tagAlarm/queryDeviceByAlarm`,
      method: 'POST',
      data: params
    })
  },
}

//科室管理
export const departmentApi = {
  //获取科室列表接口查询
  getDeptQueryList(data) {
    return http({
      url: `/department/queryListByPage`,
      method: 'POST',
      data: data
    })
  },
  //删除
  deleteDept(params) {
    return http({
      url: `/department/deleteById`,
      method: 'get',
      params: params
    })
  },
  //详情
  getDeptDetail(params) {
    return http({
      url: `/department/queryById`,
      method: 'get',
      params: params
    })
  },
  //楼栋
  getFloorList(data) {
    return http({
      url: `/tFloor/getFloorByTypeAndFloorId`,
      method: 'post',
      data: data
    })
  },
  //新增
  addDept(data) {
    return http({
      url: `/department/addDepartment`,
      method: 'post',
      data: data
    })
  },
  //更新
  updateDept(data) {
    return http({
      url: `/department/editDepartment`,
      method: 'post',
      data: data
    })
  },
  //启停
  enableDepartment(data) {
    return http({
      url: `/department/enableDepartment`,
      method: 'post',
      data: data
    })
  },
}

// 能耗监控接口
export const EnergyEffciencyApi = {
  //获取科室列表接口查询
  getDetpList(data) {
    return http.post(`/department/queryList`, data)
  },
  //设备总数和电量
  getStatisticInfo(params) {
    // console.log(params)
    return http.get(`/deviceEnergy/queryCount`, {params})
  },
  // 设备监控列表
  getDevMonitorList(data) {
    return http.post(`/deviceEnergy/queryList`, data)
  },
}

let downloadLoadingInstance;

// 通用下载方法
export function download(url, params, filename) {
  downloadLoadingInstance = Loading.service({
    text: "正在下载数据，请稍候",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.7)",
  })
  return http.post(url, params, {
    transformRequest: [(params) => {
      return tansParams(params)
    }],
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    responseType: 'blob'
  }).then(async (res) => {
    const data = res.data;
    const isLogin = await blobValidate(data);
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text();
      const rspObj = JSON.parse(resText);
      const errMsg = rspObj.msg || '下载文件出现错误，请联系管理员！'
      Message.error(errMsg);
    }
    downloadLoadingInstance.close();
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close();
  })
}

export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    var part = encodeURIComponent(propName) + "=";
    if (value !== null && value !== "" && typeof (value) !== "undefined") {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
            let params = propName + '[' + key + ']';
            var subPart = encodeURIComponent(params) + "=";
            result += subPart + encodeURIComponent(value[key]) + "&";
          }
        }
      } else {
        result += part + encodeURIComponent(value) + "&";
      }
    }
  }
  return result
}

// 验证是否为blob格式
export async function blobValidate(data) {
  try {
    const text = await data.text();
    JSON.parse(text);
    return false;
  } catch (error) {
    return true;
  }
}
