// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import type { TableListItem } from './data';

interface RequestData<T> {
  data: T,
  message: string,
  status: number
}

// 获取采购项目列表
export async function getContractBasePage(data: any) {
  return request<RequestData<any>>('/api/poc/contract/base/page',  {
    data,
    method: 'POST',
  });
}

// 获取采购类型树
export async function getCategoryTree() {
  return request<RequestData<any>>('/api/poc/templent/list',  {
    method: 'get',
  });
}

// 保存采购项目
export async function saveContractBase(data: any) {
  return request<RequestData<any>>('/api/poc/contract/base/saveOrUpdate',  {
    data,
    method: 'POST',
  });
}

// 获取采购项目详情
export async function getContractBaseInfo(data: any) {
  return request<RequestData<any>>('/api/poc/contract/base/info',  {
    method: 'get',
    params: data
  });
}


// 初始化采购项目内容
export async function initContractContent(data: any) {
  console.log('data', data);
  return request<RequestData<any>>('/api/poc/contract/content/init',  {
    method: 'get',
    params: data
  });
}

// 删除采购项目
export async function deleteContractBase(data: any) {
  return request<RequestData<any>>('/api/poc/contract/base/delete',  {
    method: 'get',
    params: data
  });
}