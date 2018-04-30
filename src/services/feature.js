import {
  API
} from '@/config'
import axios from 'axios'

const get = async () => {
  return await axios.get(`${API}/admin/adminLoadFeature.action`)
}

export {
  get
}
