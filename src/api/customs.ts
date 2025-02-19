// PTT审核通过
approvePTT(data: { ids: number[] }) {
  return request({
    url: '/api/customs/e214/ptt/approve',
    method: 'post',
    data
  })
},

// PTT审核拒绝
rejectPTT(data: { ids: number[] }) {
  return request({
    url: '/api/customs/e214/ptt/reject',
    method: 'post',
    data
  })
}, 