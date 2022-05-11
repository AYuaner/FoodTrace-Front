import request from '@/utils/request'

export function getCount() {
  return request({
    url: '/echarts',
    method: 'get'
  })
}

export function getFabricCounts() {
  return request({
    url: 'http://localhost:8081/echarts',
    method: 'get'
  })
}
