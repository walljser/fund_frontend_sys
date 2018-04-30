import {
  API
} from '@/config'
import axios from 'axios'

const rateChanges = async () => {
  return await axios.get(`${API}/admin/rateChange.action`)
}

/**
 * [组合查询获取基金列表]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const get = async (params) => {
  // const res = await rateChanges()
  const DEAFULT = {
    fundId: '',
    fundName: '',
    status: '',
    typeId: '',
    currentPage: 1
  }
  params = Object.assign(DEAFULT, params)
  const {
    fundId,
    fundName,
    status,
    typeId,
    currentPage
  } = params
  return await axios.get(`${API}/admin/lookFundByHelper.action`, {
    params: {
      qryFundNo: fundId,
      qryFundName: fundName,
      qryfundTypeId: typeId,
      qryFundStatus: status,
      fundPageNo: currentPage
    }
  })
}

const one = async (fundId) => {
  return await axios.get(`${API}/admin/toGetoneFund.action`, {
    params: {
      'fund.FundNo': fundId
    }
  })
}

/**
 * [获取基金类型信息]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
const getType = async () => {
  return await axios.get(`${API}/admin/adminGetFundType.action`)
}


/**
 * [传入type对象，把type对象和基金list组合起来]
 * @param  {[type]} typeId [description]
 * @return {[type]}        [description]
 */
const typeMapper = async (typeObj, pageNo = 1) => {
  let data = []
  if (typeObj)
    data.push(typeObj)
  const res = await get({
    typeId: typeObj.fundTypeId,
    currentPage: pageNo
  })
}

export {
  get,
  one,
  getType,
  typeMapper,
  rateChanges
}
