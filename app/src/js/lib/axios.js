import axios from 'axios'

import { getApiheaders } from '@js/api/utilities'
import { logout } from '@js/api/User'

const headers = getApiheaders()

axios.defaults.headers.common = headers.headers
// Add a response interceptor
axios.interceptors.response.use(null, error => {
  // Do something with response error
  if (error.response.status === 401) {
    logout()
    // console.log('ERROR', error.response, getUserToken())
  }
  return Promise.reject(error.response)
})

export default axios
