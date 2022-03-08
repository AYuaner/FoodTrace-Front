import request from '@/utils/request'

export function getList() {
  return request({
    url: '/account/list',
    method: 'get'
  })
}

export function updateEnable(data) {
  return request({
    url: '/account/' + data.id,
    method: 'delete',
    data: this.datadata
  })
}

export function newAccount(data) {
  return request({
    url: '/account',
    method: 'post',
    data: data
  })
}

export function updateAccount(data) {
  console.log(data)
}
