import request from '@/utils/request'

// 查询员工绩效列表
export function listPerf(query) {
  return request({
    url: '/system/perf/list',
    method: 'get',
    params: query
  })
}

// 查询员工绩效详细
export function getPerf(empId) {
  return request({
    url: '/system/perf/' + empId,
    method: 'get'
  })
}

// 新增员工绩效
export function addPerf(data) {
  return request({
    url: '/system/perf',
    method: 'post',
    data: data
  })
}

// 修改员工绩效
export function updatePerf(data) {
  return request({
    url: '/system/perf',
    method: 'put',
    data: data
  })
}

// 删除员工绩效
export function delPerf(empId) {
  return request({
    url: '/system/perf/' + empId,
    method: 'delete'
  })
}
// 查询部门下拉树结构
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}