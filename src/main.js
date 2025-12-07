import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import '@fortawesome/fontawesome-free/css/all.css';


const app = createApp(App)

app.use(router)
app.use(VueSweetalert2)


app.provide('baseUrl', 'http://127.0.0.1:8000/api');

app.mount('#app')
