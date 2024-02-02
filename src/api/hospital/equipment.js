import { http as request } from '@/resources'

// 楼层结构添加
export function createFloorStructure(data) {
  return request({
    url: '/tFloor',
    method: 'post',
    data
  })
}

// 楼层结构修改
export function modifyFloorStructure(data) {
  return request({
    url: '/tFloor',
    method: 'put',
    data
  })
}

// 楼层结构查询
export function queryFloorStructure(params) {
  return request({
    url: '/tFloor',
    method: 'get',
    params
  })
}


// 基站添加
export function createBaseStation(data) {
  return request({
    url: '/baseStation',
    method: 'post',
    data
  })
}

// 基站修改
export function modifyBaseStation(data) {
  return request({
    url: '/baseStation',
    method: 'put',
    data
  })
}

// 基站删除
export function deleteBaseStation(params) {
  return request({
    url: '/baseStation',
    method: 'delete',
    params
  })
}

// 基站查询
export function queryBaseStation(params) {
  return request({
    url: '/baseStation',
    method: 'get',
    params
  })
}

// 产品查询
export function queryProduct(params) {
  return request({
    url: '/baseStation/queryProduct',
    method: 'get',
    params
  })
}

// 楼层地图添加
export function createFloorPlat(data) {
  return request({
    url: '/floorPlat',
    method: 'post',
    data
  })
}

// 楼层地图查询
export function findFloorPlat(id) {
  return request({
    url: `/floorPlat/${id}`,
    method: 'get',
  })
}

// 楼层地图查询（包含关联点）
export function queryFloorPlat(params) {
  return request({
    url: `/floorPlat`,
    method: 'get',
    params
  })
}

// 楼层地图查询
export function queryPointByFloorId(params) {
  return request({
    url: `/floorPlat/queryPointByFloorId`,
    method: 'get',
    params
  })
}

// 地图标点添加
export function createFloorPlatPoint(data) {
  return request({
    url: '/floorPlatPoint',
    method: 'post',
    data
  })
}

// 地图标点修改
export function modifyFloorPlatPoint(data) {
  return request({
    url: '/floorPlatPoint',
    method: 'put',
    data
  })
}

// 地图标点删除
export function deleteFloorPlatPoint(params) {
  return request({
    url: '/floorPlatPoint',
    method: 'delete',
    params
  })
}

// 编号/名称模糊查询所有设备
export function queryDeviceByKeyWord(params) {
  return request({
    url: '/devicePosition/queryDeviceKeyword',
    method: 'get',
    params
  })
}

// 设备ID、楼层ID查询设备位置
export function queryDevicePosition(params) {
  return request({
    url: '/devicePosition/queryLastPoint',
    method: 'get',
    params
  })
}

// 根据楼层ID 统计楼层设备数
export function queryDeviceCountByFloor(params) {
  return request({
    url: '/device/queryCountByFloor',
    method: 'get',
    params
  })
}

// 根据设备类型查询设备信息
export function queryDeviceByType(params) {
  return request({
    url: '/device/queryDeviceByType',
    method: 'get',
    params
  })
}

// 设备轨迹查询
export function queryDeviceTrack(params) {
  return request({
    url: '/devicePosition/queryDeviceTrack',
    method: 'get',
    params
  })
}
