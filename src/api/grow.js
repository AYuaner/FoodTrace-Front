import request from '@/utils/request'

export function getList() {
  return request({
    url: 'http://localhost:8081/growinfo/all',
    method: 'get'
  })
}

export function newOne(data) {
  return request({
    url: 'http://localhost:8081/growinfo',
    method: 'post',
    data: data
  })
}
