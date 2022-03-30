import request from '@/utils/request'

export function getList() {
    return request({
        url: 'http://localhost:8081/seedinfo/all',
        method: 'get'
    })
}