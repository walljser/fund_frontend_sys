import {
  API
} from '@/config'
import axios from 'axios'

const recharge = async ({ clientId, price, token }) => {
  return await axios.get(`${API}/clientTrans/saveBalanceClientUser.action`, {
    params: {
      clientId,
      'clientUserTrans.clientUser.ClientId': clientId,
      balance: price,
      token
    }
  })
}


/*
 * clientUserTrans.clientUser.ClientId
 * balance//存钱金额
 * anotherClientUserId//对方账户
 * anotherClientUserName//对方姓名
 */
/**
 * [转账]
 * @param  {[type]} clientId       [description]
 * @param  {[type]} balance        [description]
 * @param  {[type]} targetClientId [description]
 * @param  {[type]} targetName     [description]
 * @param  {[type]} token          [description]
 * @return {[type]}                [description]
 */
const transfer = async ({ clientId, price, account, name, token }) => {
  return await axios.get(`${API}/clientTrans/transBalanceClientUser.action`, {
    params: {
      clientId,
      'clientUserTrans.clientUser.ClientId': clientId,
      balance: price,
      anotherClientUserId: account,
      anotherClientUserName: name,
      token
    }
  })
}

/*
 * clientUserTrans.clientUser.ClientId
 * balance//存钱金额
 */
/**
 * [取款]
 * @param  {[type]} clientId [description]
 * @param  {[type]} balance  [description]
 * @param  {[type]} token    [description]
 * @return {[type]}          [description]
 */
const withdraw = async ({ clientId, price, token }) => {
  return await axios.get(`${API}/clientTrans/gotBalanceClientUser.action`, {
    params: {
      clientId,
      'clientUserTrans.clientUser.ClientId': clientId,
      balance: price,
      token
    }
  })
}

/**
 * [组合查询用户账单]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const get = async (params) => {
  const DEFAULT = {
    trasId: '',
    transType: '',
    clientId: '',
    targetId: '',
    pageNo: 1,
    token: ''
  }
  params = Object.assign(DEFAULT, params)
  const {
    transId,
    transType,
    clientId,
    targetId,
    pageNo,
    token
  } = params
  return await axios.get(`${API}/clientTrans/loadBalanceListByHelper.action`, {
    params: {
      clientId,
      transId,
      transType,
      'clientUser.ClientId': clientId,
      targetId,
      pageNo,
      token
    }
  })
}

export {
  get,
  recharge,
  transfer,
  withdraw
}
