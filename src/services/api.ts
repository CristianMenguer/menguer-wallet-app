import axios from 'axios'

// This file is responsible for creating the object api to be used everywhere in the application

const api = axios.create({
    //baseURL: 'http://192.168.0.157:3000/'
    baseURL: 'http://api.menguerwallet.com/'
})

export default api
