import Mock from 'mockjs';
import FlagData from './data/FlagList'

// 设置拦截ajax请求的相应时间
Mock.setup({
  timeout: '200-600',
  baseURL: '/api'
});

// 定义mock请求的方法
const mockApi = {
  /**
   * 发送get请求
   *
   * @param {RegExp|string} apiPath
   * @param {*} mockData
   */
  get(apiPath, mockData) {
    Mock.mock(apiPath, "GET", mockData)
  },
  /**
   * 发送post请求
   *
   * @param {string} apiPath
   * @param {Object} mockData
   */
  post(apiPath, mockData) {
    Mock.mock(apiPath, "POST", mockData)
  },

  /**
   * 发送put请求
   *
   * @param {string} apiPath
   * @param {Object} mockData
   */
  put(apiPath, mockData) {
    Mock.mock(apiPath, "PUT", mockData)
  },

  /**
   * 发送delete请求
   *
   * @param {RegExp|string} apiPath
   * @param {Object} mockData
   */
  del(apiPath, mockData) {
    Mock.mock(apiPath, "DELETE", mockData)
  }
}

// 仓库列表
// mockApi.get('tms-store/api/queryTmsStore?pageNo=1&pageSize=10', store.list);

// 器械标识查询mock
// 查询列表
mockApi.get(RegExp('/order-statement/mechanical/device/page.*'), options => FlagData.getMockList(options));
// 查询详情
mockApi.get(RegExp(`/order-statement/mechanical/device/details/\\?`), options => FlagData.getMockDetails(options));
// 查询历史列表
mockApi.get(RegExp(`/order-statement/mechanical/device/history`), options => FlagData.getMockHistoryList(options));
// 查询历史详情
mockApi.get(RegExp(`/order-statement/mechanical/device/history/details/\\?`), options => FlagData.getMockHistoryDetails(options));
