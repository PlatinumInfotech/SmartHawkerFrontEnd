import axios from 'axios'

const api = axios.create({
  baseURL: 'http://shprod.platinum-infotech.com:3000/api',
  // baseURL: 'http://shcanary.platinum-infotech.com:3000',
  // baseURL: 'http://localhost:3000',
})
// ✅ MUST HAVE THIS INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    //console.log('Sending request with token:', token) // Debug log
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

export default api
