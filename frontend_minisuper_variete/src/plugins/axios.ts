import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default http
