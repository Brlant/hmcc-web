import {http} from '@/resources'

//新增告警规则模板
export const addAlarmRuleTemplate = (data) => {
  return http({
    url: '/alarm-rule-template/add',
    method: 'post',
    data: data
  })
}

//查询告警规则模板
export const queryAlarmRuleTemplate = (data) => {
  return http({
    url: '/alarm-rule-template/page',
    method: 'post',
    data: data
  })
}

//编辑告警规则模板
export const editAlarmRuleTemplate = (data) => {
  return http({
    url: '/alarm-rule-template/edit',
    method: 'post',
    data: data
  })
}

//停用启用接口
export const stopOrStartAlarmRuleTemplate = (data) => {
  return http({
    url: '/alarm-rule-template/enable',
    method: 'post',
    data: data
  })
}
