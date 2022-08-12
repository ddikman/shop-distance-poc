import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import VueGoogleMaps from '@fawmi/vue-google-maps'

const app = createApp(App)

app.use(VueGoogleMaps, {
  load: {
      key: 'AIzaSyDOzgb0w-GZVg_Enz5YyAvKI6TbrssmJlI',
  },
}).mount('#app')
