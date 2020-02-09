import request from '@/utils/request'

export const getGraphsData = (params: any) =>
  request({
    url: '/api/v1/query_range',
    method: 'get',
    baseURL: 'http://iiiii.imdo.co/',
    params
  })

export const getLabelList = () =>
  request({
    url: '/api/v1/label/__name__/values',
    method: 'get',
    baseURL: 'http://iiiii.imdo.co/'
  })
