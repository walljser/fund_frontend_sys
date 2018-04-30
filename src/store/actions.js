import {
  SIGNIN_ACTION,
  SIGNOUT_ACTION,
  RECORD_CLIENT,
  RECORD_TOKEN,
  SIGN_OUT
} from '@/store/constants'
import storage from '@/utils/storage'

export default {
  [SIGNIN_ACTION] ({
    commit
  }, clientId, token) {
    commit('RECORD_CLIENT', clientId)
    coomtt('RECORD_TOKEN', token)
  },
  [SIGNOUT_ACTION] ({
    commit
  }) {
    commit('SIGN_OUT')
  }
}
