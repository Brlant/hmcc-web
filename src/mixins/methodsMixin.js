import {AlarmNotifyGroup, ColdChainLabelApi, cool, gateway, orgRelation} from '@/resources';


export default {
  data() {
    return {
      probeList: [],
      orgList: [],
      notifyList: [],
      objectOrgList: [],
      groupList: [],
      coolList: [],
      povList: [],
      gatewayList: [],
      subOrgList: [],
      batchNumberList: [],
      goodsNameList: [],
    };
  },
  methods: {
    queryProbeList(query) {
      let params = typeof query === 'object' ? query : {keyWord: query};
      return ColdChainLabelApi.query(params).then(res => {
        this.probeList = res.data.list;
      });
    },
    queryGateway(query) {
      let params = typeof query === 'object' ? query : {keyWord: query};
      return gateway.query(params).then(res => {
        this.gatewayList = res.data.list;
      });
    },
    queryAllOrg: function (query) {// 查询货主
      let params = {keyWord: query};
      this.$http.get('/subordinate-org/info/permission/self', {params: params}).then(res => {
        this.orgList = res.data;
      });
    },
    queryNotifyList(query) {
      let params = {
        keyWord: query,
      };
      if (typeof query === 'object') {
        params = query;
      }
      AlarmNotifyGroup.query(params).then(res => {
        this.notifyList = res.data.list;
      });
    },
    queryCoolList(query) {
      let params = {
        keyWord: query,
      };
      if (typeof query === 'object') {
        params = query;
      }
      cool.query(params).then(res => {
        this.coolList = res.data.list;
      });
    },
    filterPOV: function (query) {// 过滤POV
      let params = {
        keyWord: query
      };
      this.$http.get('/subordinate-org/info/permission/self', {params: params}).then(res => {
        this.povList = res.data;
      });
    },
    querySubOrg(query) { // 被监管单位 //授权主体单位 // 上级单位
      let params = {keyWord: query};
      return orgRelation.querySubOrg(params).then(res => {
        this.subOrgList = res.data;
      });
    },
    queryALLObjectOrg(query) { // 被监管单位 //授权主体单位 // 上级单位
      let params = {keyWord: query};
      return orgRelation.querySubOrg(params).then(res => {
        this.objectOrgList = res.data;
      });
    },
  }
};
