import {
  API
} from '@/config'
import axios from 'axios'

/**
 * 登录，签发token
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
const get = async (username, password) => {
  return await axios.get(`${API}/client/clientLogin.action`, {
    params: {
      ClientId: username,
      ClientPwd: password
    }
  })
}

/**
 * 获取邮箱验证码
 * @param  {[name 用户名]}
 * @param  {[email 邮箱号码]}
 * @return {[type]}
 */
const check = async (name, email) => {
  return await axios.get(`${API}/client/checkEmail.action`, {
    params: {
      'clientUser.ClientName': name,
      'clientUser.Email': email
    }
  })
}

/**
 * 用户注册
 * @param  {[account 账号]}
 * @param  {[name    用户名]}
 * @param  {[pass    密码]}
 * @param  {[sex     性别]}
 * @param  {[phone   手机号码]}
 * @param  {[address 地址]}
 * @param  {[email   邮箱号]}
 * @param  {[token   token]}
 * @return {[type]}
 */
const create = async ({ account, name, pass, sex, phone, address, email }, code) => {
  return await axios.get(`${API}/client/registCilentUser.action`, {
    params: {
      'clientUser.ClientId': account,
      'clientUser.ClientName': name,
      'clientUser.ClientPwd': pass,
      'clientUser.Sex': sex,
      'clientUser.Phone': phone,
      'clientUser.Address': address,
      'clientUser.Email': email,
      'clientCheckCode': code
    }
  })
}
// lientUser.ClientId=19950816
// clientUser.ClientName=任显聪
// clientUser.ClientPwd=123
// clientUser.Sex=男
// clientUser.Phone =13067415626
// clientUser.Address=福建工程学院
// clientUser.Email=1101907353@qq.com
// clientCheckCode=3f10471a-5d77-4914-8ea3-7affa4dcd6b0
export {
  get,
  check,
  create
}
