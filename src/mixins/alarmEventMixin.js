const type = {
  0: {title: '[仓库监控]', path: '/monitoring/temp'},
  1: {title: '[运单监控]', path: '/monitoring/waybill/id'},
  2: {title: '[设备监控]', path: '/monitoring/equipment'},
  3: {title: '[货主热点监控]', path: '/monitoring/org/hot/spot'}
};
const devPath = {
  0: {title: '有线温度计', path: '/temp/wire'},
  1: {title: '无线温度计', path: '/temp/wifi'},
  2: {title: '冷柜温度计', path: '/temp/freezer'},
  3: {title: '车载温度计', path: '/temp/vehicle'},
  4: {title: '湿度计', path: '/temp/hygrometer'}
};
export default {
  data() {
    return {
      iconClass: {
        1: {icon: 'temp-limit', title: '温度'},
        2: {icon: 'humidity-limit', title: '湿度'},
        3: {icon: 'voltage-limit', title: '电压'},
        4: {icon: 'time-limit', title: '离线时间'}
      },
      tempTypeList: ['有线温度计', '无线温度计', '冷柜温度计', '车载温度计', '湿度计']
    };
  },
  methods: {
    formatTitle(item) {
      let o = type[item.monitorRelationType];
      return o && o.title + item.monitorTargetCode;
    },
    goToDev(item) {
      let params = {
        path: devPath[item.devType].path,
        query: {
          devCode: item.devCode,
          devNo: item.devNo
        }
      };
      this.$router.push(params);
    },
    goToTemp(item) {
      let params = {
        path: '/monitoring/temp',
        query: {
          id: item.ccsDevId,
          devCode: item.devCode,
          type: item.warnType,
          devName: item.devName
        }
      };
      this.$router.push(params);
    },
    goToRouter(item) {
      let o = type[item.monitorRelationType];
      let params = {
        path: o.path,
        query: {
          code: item.monitorTargetCode
        }
      };
      switch (item.monitorRelationType) {
        case '0': {
          params.query = {
            id: item.ccsDevId,
            type: '1'
          };
          break;
        }
        case '1': {
          // 使用默认参数
          break;
        }
        case '2' : {
          // 使用默认参数
          break;
        }
        case '3' : {
          params.query = {
            manufacturerCode: item.monitorTargetCode,
            code: item.devCode,
            orgId: item.monitorTargetId
          };
          break;
        }
      }
      this.$router.push(params);
    }
  }
};
