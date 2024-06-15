import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPenToSquare, faTrash, faPlus, faSignOut } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.js'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.config.globalProperties.server_url = window.location.protocol + '//' + window.location.hostname

library.add(faPenToSquare, faTrash, faPlus, faSignOut)

app.use(createPinia())
app.use(bootstrap)
app.use(vue3GoogleLogin, {
  clientId: '805742976196-kl4thfduqpgso0v52rp31djh95kgmenu.apps.googleusercontent.com'
})
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
