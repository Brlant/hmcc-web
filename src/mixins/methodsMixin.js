import {Address, BaseInfo, TempDev} from '@/resources';

// 得到嵌套参数
const getProps = (vm, prop) => {
  let isLot = prop.includes('.');
  if (!isLot) return vm[prop];
  return prop.split('.').reduce((pre, next) => {
    return pre[next];
  }, vm);
};

export default {
  data() {
    return {
      allTempList: [],
      orgList: [],
      customerList: [],
      relationCustomerList: [],
      relationCustomerWarehouseList: [],
      tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车载温度计', '湿度计']
    };
  },
  methods: {
    queryCustomer: function (query) {// 查询客户
      let params = {};
      if (typeof query === 'string') {
        Object.assign(params, {keyWord: query});
      } else if (typeof query === 'object') {
        Object.assign(params, query);
      }
      BaseInfo.query(params).then(res => {
        this.customerList = res.data.list;
      });
    },
    queryOrg: function (query) {// 查询货主
      let params = {type: '0'};
      if (typeof query === 'string') {
        Object.assign(params, {keyWord: query});
      } else if (typeof query === 'object') {
        Object.assign(params, query);
      }
      BaseInfo.query(params).then(res => {
        this.orgList = res.data.list;
      });
    },
    queryRelationCustomer: function (props) {// 查询业务关系
      return query => {
        let orgId = getProps(this, props);
        if (!orgId) return;
        let params = {keyWord: query};
        BaseInfo.queryOrgByValidReation(orgId, params).then(res => {
          this.relationCustomerList = res.data;
        });
      };
    },
    queryRelationCustomerWarehouse: function (customerId) {// 查询业务关系
      if (!customerId) return;
      Address.queryAddress(customerId, {
        deleteFlag: false,
        orgId: customerId
      }).then(res => {
        this.relationCustomerWarehouseList = res.data;
      });
    },
    queryAllTemp(query) {
      TempDev.queryALLTempByLike({searchVal: query}).then(res => {
        res.data.currentList.forEach(i => (i.disabled = false));
        this.allTempList = res.data.currentList;
        this.setTempListWhenEdit && this.setTempListWhenEdit();
      });
    }
  }
};
