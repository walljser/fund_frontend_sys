import {
  API
} from '@/config'
import axios from 'axios'

/**
 * [基金申购]
 * applyFund(){
    //fundTrans.amount  fundTrans.clientUser.ClientId    fundTrans.fund.FundNo
 * @param  {[type]} clientId [description]
 * @param  {[type]} price    [description]
 * @param  {[type]} fundId   [description]
 * @param  {[type]} token    [description]
 * @return {[type]}          [description]
 */
const create = async ({ clientId, price, fundId, token }) => {
  return await axios.get(`${API}/fundtrans/applyFund.action`, {
    params: {
      clientId,
      'fundTrans.clientUser.ClientId': clientId,
      'fundTrans.fund.FundNo': fundId,
      'fundTrans.amount': price,
      token
    }
  })
}

/**
 * [赎回基金]
 * @param  {[type]} clientId [description]
 * @param  {[type]} fundId   [description]
 * @param  {[type]} price    [description]
 * @param  {[type]} token    [description]
 * @return {[type]}          [description]
 */
const remove = async ({ clientId, fundId, price, token }) => {
  const res = await axios.get(`${API}/fundtrans/ransomFund.action`, {
    params: {
      clientId,
      'fundTrans.clientUser.ClientId': clientId,
      'fundTrans.fund.FundNo': fundId,
      'fundTrans.amount': price,
      token
    }
  })
  return res
}

/**
 * [模拟过一天]
 * @return {[type]} [description]
 */
const simulation = async () => {
  return await axios.get(`${API}/fundtrans/yestodayEarn.action`)
}

/**
 * [根据客户ID获取持仓表]
 * @param  {[type]} clientId [description]
 * @param  {[type]} token    [description]
 * @return {[type]}          [description]
 */
const one = async ({ clientId, token }) => {
  return await axios.get(`${API}/fundtrans/loadClientHold.action`, {
    params: {
      clientId,
      clientNo: clientId,
      token
    }
  })
}

/**
 * [根据客户持仓ID，获取客户持仓详细信息]
 * @param  {[type]} id    [description]
 * @param  {[type]} token [description]
 * @return {[type]}       [description]
 */
const detail = async ({ clientId, hid, token }) => {
  return await axios.get(`${API}/fundtrans/loadDetailMsg.action`, {
    params: {
      clientId,
      hid,
      token
    }
  })
}

/**
 * [组合查询交易记录]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const get = async (params) => {
  const DEFAULT = {
    trasId: '',
    transType: '',
    clientId: '',
    fundId: '',
    pageNo: 1,
    token: ''
  }
  params = Object.assign(DEFAULT, params)
  const {
    transId,
    transType,
    clientId,
    fundId,
    pageNo,
    token
  } = params
  return await axios.get(`${API}/fundtrans/allFundRecord.action`, {
    params: {
      clientId,
      transId,
      transType,
      'clientUser.ClientId': clientId,
      fundId,
      pageNo,
      token
    }
  })
}

export {
  get,
  create,
  simulation,
  one,
  detail,
  remove
}
