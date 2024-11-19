// import axios from "axios"
// import { ServerAddress } from "./utils/serverURL"

// axios.defaults.baseURL = ServerAddress
// axios.defaults.headers['Content-Type'] = 'application/json'

// axios.interceptors.request.use(config => {
//     const token = localStorage.getItem("token")
    
//     // 仅在 config.url 定义时才进行判断
//     if (token && config.url && !config.url.includes("/auth/register")) {
//         config.headers['Authorization'] = `Bearer ${token}`
//     }
    
//     return config
// }, error => {
//     return Promise.reject(error)
// })


// export default axios