import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/aura-light-green/theme.css'
import ProgressBar from 'primevue/progressbar'
import Slider from 'primevue/slider'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'

import App from './App.vue'

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);
app.component('Slider', Slider)
app.component('ProgressBar', ProgressBar)
app.component('Button', Button)
app.component('ProgressSpinner', ProgressSpinner)

app.mount('#app');
