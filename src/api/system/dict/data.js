import { http as request } from '@/resources'

// 根据字典类型查询字典数据信息
export function sinopharmDictDataType(name) {
  return request({
    url: `/dictGroup/${name}/items`,
    method: 'get'
  })
}
