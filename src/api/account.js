import request from '@/utils/request'

export function getList() {
  return request({
    url: '/account/list',
    method: 'get',
  })
}