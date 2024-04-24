import {http} from '@/resources'


let params_api = {
  getDeviceMaintenance:`/deviceMaintenance`,
}

export const getDeviceMaintenanceList =(data)=>{
  return http({
    url: '/deviceMaintenance/queryByPage',
    method:'post',
    data: data
  })
}

export const getDeviceMaintenanceStatus =()=>{
  return http({
    url:'/deviceMaintenance/queryMaintenanceStatus',
    method:'get,'
  })
}

export const getQueryMaintenanceStatus =(data)=>{
  return http({
    url:'/deviceMaintenance/queryMaintenanceStatus',
    method:'post',
    data:data
  })
}

export const getCancelMaintenance =(id)=>{
  return http({
    url:'/deviceMaintenance/cancel/'+id,
    method:'get',
  })
}

//冷链设备
export const getColdList =(data)=>{
  return http({
    url: '/freezer-dev/freezer-dev/page',
    method:'post',
    data: data
  })
}

//医疗设备
export const getMedicalList =(data)=>{
  return http({
    url: '/device/queryAllByCondition',
    method:'post',
    data: data
  })
}

//维保设置
export const getQueryByTypeList =(id)=>{
  return http({
    url: '/maintenanceInterpose/queryByType/'+id,
    method:'get',
  })
}

//新增维保
export const postDeviceMaintenanceApi =(data)=>{
  return http({
    url: '/deviceMaintenance',
    method:'post',
    data:data,
  })
}
