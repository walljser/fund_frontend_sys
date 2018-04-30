import storage from '@/utils/storage'
const clientId = storage.getSession('clientId')

export default {
  clientId: '',
  token: '',
  signinVisible: false,
  signupVisible: false,
  logined: clientId ? true : false
}
