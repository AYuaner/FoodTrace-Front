import request from '@/utils/request'

export function getList() {
  return request({
    url: 'http://localhost:8081/transportation/all',
    method: 'get'
  })
}

export function newOne(data) {
  return request({
    url: 'http://localhost:8081/transportation',
    method: 'post',
    data: data
  })
}
