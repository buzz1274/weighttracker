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

const app = createApp(App)

library.add(faPenToSquare, faTrash, faPlus, faSignOut)

app.use(createPinia())
app.use(bootstrap)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')
