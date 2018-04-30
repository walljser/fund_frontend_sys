import {
  API
} from '@/config'
import axios from 'axios'

const get = async ({ clientId, token }) => {
  return await axios.get(`${API}/client/loadClientInfo.action`, {
    params: {
      clientId,
      "clientUser.ClientId": clientId,
      token
    }
  })
}
/**
 * [修改个人信息]
 * @param  {[type]} options.clientId   [description]
 * @param  {[type]} options.clientName [description]
 * @param  {[type]} options.sex        [description]
 * @param  {[type]} options.phone      [description]
 * @param  {[type]} options.email      [description]
 * @param  {[type]} options.address    [description]
 * @param  {[type]} options.email      [description]
 * @param  {[type]} token              [description]
 * @return {[type]}                    [description]
 */
const update = async ({clientId, clientName, sex, phone, email, address}, token) => {
  return await axios.get(`${API}/client/updateClientUser.action`, {
    params: {
      clientId,
      'clientUser.ClientId': clientId,
      'clientUser.ClientName': clientName,
      'clientUser.Sex': sex,
      'clientUser.Phone': phone,
      'clientUser.Address': address,
      'clientUser.Email': email,
      token
    }
  })
}

export {
  get,
  update
}
