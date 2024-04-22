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
