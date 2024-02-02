import {http} from '@/resources'

const tagList = {
  //增加
  addTagApi: `/tag/addTag`,
  //查询
  listTagApi: `/tag/queryList`,
  //验证标签SN号或MAC地址是否
  verifyTagApi: `/tag/checkTagByCondition`,
  //删除接口
  deleteTagApi: `/tag/deleteById`,
  //详情
  detailTagApi: `/tag/queryById`,
  //修改
  editTagApi: `/tag/editTag`,
  //产品类型
  productTypeApi: `/baseStation/queryProductByName`,
  //查询产品类型
  productTypeByKey: `/baseStation/queryProductByKey`,
}

const labelTagList = {
  //增加接口
  addTagLabel(data){
    return http({
      url: tagList.addTagApi,
      method: 'post',
      data
    })
  },
  //查询接口
  listTagLabel(data){
    return http({
      url: tagList.listTagApi,
      method: 'post',
      data
    })
  },
  //验证
  verifyTagLabel(data){
    return http({
      url: tagList.verifyTagApi,
      method: 'get',
      params: data
    })
  },
  //删除
  deleteTagLabel(data){
    return http({
      url: tagList.deleteTagApi,
      method: 'get',
      params: data
    })
  },
  //详情
  detailTagLabel(data){
    return http({
      url: tagList.detailTagApi,
      method: 'get',
      params: data
    })
  },
  //修改
  editTagLabel(data){
    return http({
      url: tagList.editTagApi,
      method: 'post',
      data
    })
  },
  //产品类型
  productTypeList(params){
    return http({
      url: tagList.productTypeApi,
      method: 'get',
      params
    })
  },
  //查询产品类型
  productTypeByKey(params){
    return http({
      url: tagList.productTypeByKey,
      method: 'get',
      params
    })
  },

}

export default labelTagList;
