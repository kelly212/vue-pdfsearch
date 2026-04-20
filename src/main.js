import { createApp } from 'vue'
import { createPinia } from "pinia"
import App from './App.vue'
import router from './router/router'
import './assets/main.scss'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { mdiClose, mdiEyeOffOutline, mdiCog,mdiLogout,mdiEmailOutline,
   mdiFormatListBulleted,mdiPencil,mdiDelete,mdiLockOutline,mdiFormatListChecks,
   mdiEyeOutline,mdiViewDashboard,mdiMagnify, mdiArrowLeft, mdiAccount, mdiUnfoldMoreHorizontal} from '@mdi/js'
import PForm2 from "./views/PForm2.vue";

const vuetify = createVuetify({
   components,
   directives,
   icons: {
      defaultSet: 'mdi',
      aliases: {
         ...aliases,
         mdiClose,
         mdiEmailOutline,
         mdiEyeOffOutline,
         mdiCog,
         mdiLogout,
         mdiFormatListBulleted,
         mdiPencil,
         mdiDelete,
         mdiLockOutline,
         mdiEyeOutline,
         mdiViewDashboard,
         mdiMagnify,
         mdiFormatListChecks,
         mdiArrowLeft,
         mdiAccount,
         mdiUnfoldMoreHorizontal

      },
      sets: {
         mdi,
      },
   },
});


createApp(App)
 .use(router)
 .use(createPinia())
 .use(vuetify)
 .component('PForm2', PForm2)
 .mount('#app')
