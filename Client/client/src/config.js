const isProduction = window.location.hostname !== 'localhost'
const API = isProduction ?
    'https://paycollect-api.onrender.com' :
    'http://localhost:10000'
export default API