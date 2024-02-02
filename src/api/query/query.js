import {http} from '@/resources'

//接口合集
const queryList = {
  //查询列表
  list:`/device/queryAllByCondition`,
  //科室
  department:`/department/queryList`,
  //楼层
  floor:`/tFloor/queryTreeSelect`,
  //设备地址
  addressPos:`/devicePosition/queryLastPoint`
}

//设备查询接口合集
const queryApi = {
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

export default queryApi;
