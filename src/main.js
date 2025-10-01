// Import tailwind.css for Tailwind CSS v3
import './assets/tailwind.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FontAwesome from './plugins/fontawesome'

// Initialize store to load data from API
store.initStore().catch(error => {
  console.error('Failed to initialize store:', error)
})

const app = createApp(App)

app.use(router)
app.use(FontAwesome)

// Make store available globally
app.config.globalProperties.$store = store

app.mount('#app')
