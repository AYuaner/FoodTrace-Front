import request from '@/utils/request'

export function getTraceInfo(traceCode) {
    return request({
        url: 'http://localhost:8081/trace?traceCode='+traceCode,
        method: 'get'
    })
}
