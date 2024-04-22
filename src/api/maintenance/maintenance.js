import {http} from '@/resources'


let params_api = {
  getMaintenanceList:`/maintenanceInterpose`,
  updateStatus:`/maintenanceInterpose/updateStatus`
}

export const getMaintenanceApi =()=>{
  return http({
    url: params_api.getMaintenanceList,
    method: 'get',
  })
}

export const postMaintenanceApi =(data)=>{
  return http({
    url: params_api.getMaintenanceList,
    method: 'post',
    data:data,
  })
}

export const getMaintenanceDetailApi =(id)=>{
  return http({
    url: '/maintenanceInterpose/'+id,
    method: 'get',
  })
}

export const putMaintenanceApi =(data)=>{
  return http({
    url: params_api.getMaintenanceList,
    method: 'put',
    data:data
  })
}

export const updateStatusApi =(data)=>{
  return http({
    url: params_api.updateStatus,
    method: 'post',
    data:data
  })
}


