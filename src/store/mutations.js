import {
  RECORD_CLIENT,
  RECORD_TOKEN,
  OPEN_SIGNIN,
  CLOSE_SIGNIN,
  OPEN_SIGNUP,
  CLOSE_SIGNUP,
  SIGN_OUT
} from '@/store/constants'

import storage from '@/utils/storage'

export default {
  [RECORD_CLIENT](state, id) {
    state.clientId = id
    state.logined = true
    storage.setSession('clientId', id)
  },
  [RECORD_TOKEN](state, token) {
    state.token = token
    storage.setSession('token', token)
  },
  [SIGN_OUT](state) {
    state.clientId = ''
    state.token = ''
    storage.removeSession('clientId')
    storage.removeSession('token')
    state.logined = false
  },
  [OPEN_SIGNIN](state) {
    state.signinVisible = true
  },
  [CLOSE_SIGNIN](state) {
    state.signinVisible = false
  },
  [OPEN_SIGNUP](state) {
    state.signupVisible = true
  },
  [CLOSE_SIGNUP](state) {
    state.signupVisible = false
  }
}
