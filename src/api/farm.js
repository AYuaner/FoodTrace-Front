import request from '@/utils/request'

export function getList() {
  return request({
    url: '/farm/all',
    method: 'get'
  })
}

export function newOne(data) {
  return request({
    url: '/farm',
    method: 'post',
    data: data
  })
}

export function updateOne(data) {
  return request({
    url: '/farm/' + data.id,
    method: 'put',
    data: data
  })
}

export function deleteOne(data) {
  return request({
    url: '/farm/' + data.id,
    method: 'delete',
    data: data
  })
}
