export default {
  data() {
    return {
      checkList: [
        {label: '温度值', key: '1', unit: '℃', show: true},
        {label: '湿度值', key: '2', unit: '%', show: true},
        {label: '电压值', key: '3', unit: 'V', show: true},
        {label: '离线时间', key: '4', unit: 'min', show: true}
      ],
      conditions: [
        {label: '小于', key: '0'},
        {label: '大于', key: '1'},
        {label: '等于', key: '2'}
      ],
      levels: [
        {label: '低', key: '0'},
        {label: '高', key: '1'}
      ],
      logicList: [
        {label: '满足一个条件', key: '0'},
        {label: '满足所有条件', key: '1'}
      ],
      offLine: {
        0: '不延时',
        1: '1分钟',
        2: '2分钟',
        3: '3分钟',
        5: '5分钟',
        10: '10分钟',
        15: '15分钟',
        30: '30分钟'
      },
      alarmTypeList: ['低温', '高温', '低湿度', '高湿度', '低电压', '高电压', '离线'],
      alarmLevelList: ['', '一级', '二级', '三级']
    };
  }
};
