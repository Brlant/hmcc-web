import {probe, AlarmNotifyGroup} from '@/resources';

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
      probeList: [],
      orgList: [],
      notifyList
    };
  },
  methods: {
    queryProbeList(query) {
      let params = {keyWord: query};
      probe.query(params).then(res => {
        this.probeList = res.data.data.list;
      });
    },
    queryAllOrg: function (query) {// 查询货主
      let params = {keyWord: query};
      this.$http.get('/orgs/pager', {params: params}).then(res => {
        this.orgList = res.data.list;
      });
    },
    queryNotifyList(query) {
      let params = {keyWord: query};
      AlarmNotifyGroup.query(params).then(res => {
        this.notifyList = res.data.data.list;
      });
    },
  }
};
