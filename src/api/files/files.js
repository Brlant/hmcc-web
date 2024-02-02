import {http} from '@/resources'

//接口合集
const  filesList = {
  //查询列表
  list:`/device/queryAllByCondition`,
  //标签类型
  labelType:`/tag/queryByType`,
  //校验标签sn
  filesLabelSn:`/tag/checkTagStatus`,
  //验证编号设备
  verifyDevNo:`/device/checkDevNo`,
  //新增
  addList:`/device/addDevice`,
  //删除设备
  deleteList:`/device/deleteById`,
  //详情
  filesDetail:`/device/queryById`,
  //编辑
  filesEditList:`/device/editDevice`,
}

const filesApi = {
  //查询列表
  filesQueryList: (params) => http({ url: filesList.list, method: 'post', data:params }),
  //标签sn码
  filesLabelType(params){
    return http({
      url: `/tag/queryByType/`,
      method: 'get',
      params:params
    })
  },
  //校验标签sn
  filesLabelSn(params){
    return http({
      url: filesList.filesLabelSn,
      method: 'get',
      params:params
    })
  },
  //验证编号
  verifyDevNo(params){
    return http({
      url: filesList.verifyDevNo,
      method: 'get',
      params:params
    })
  },
  //新增列表
  filesAddList(params){
    return http({
      url: filesList.addList,
      method: 'post',
      data:params
    })
  },
  //删除设备
  filesDeleteList(params){
    return http({
      url: filesList.deleteList,
      method: 'get',
      params:params
    })
  },
  //回显
  filesDetailList(params){
    return http({
      url: filesList.filesDetail,
      method: 'get',
      params:params
    })
  },
  //编辑
  filesEditList(params){
    return http({
      url: filesList.filesEditList,
      method: 'post',
      data:params
    })
  },
}

export default filesApi;
