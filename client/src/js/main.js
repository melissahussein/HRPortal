// NPM Packages
import Vue from 'vue'
import lodash from 'lodash'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueHead from 'vue-head'
import Vuelidate from 'vuelidate'
import VueCookie from 'vue-cookie'
import VueAnalytics from 'vue-ua'
import VueFlatpickr from 'vue-flatpickr'
import router from './router.js'
import store from './store'
import VeeValidate from 'vee-validate'
import Vuex from 'vuex'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faHome,
    faUser,
    faUserPlus,
    faSignInAlt,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Vuex);

// ChuckCSS Framework, FontAwesome, Ionicons, fonts
import less from '../less/front.less'


// Use Plugins
Vue.use(VueHead,{
  separator: '-'
})
Vue.use(VueAxios, axios)
Vue.use(Vuelidate)
Vue.use(VueCookie)
Vue.use(VueFlatpickr)
Vue.use(VueAnalytics, {
    appName: 'Vue-ChuckAdmin',
    appVersion: '1.0.0',
    trackingId: 'UA-9271946-13',
    debug: false,
    vueRouter: router

    // If router, you can exclude some routes name (case insensitive) (optional)
    // ignoredViews: ['homepage'], 
})


// Make the world better
const app = new Vue({
    store,
    router,
    render: h => h(require('./App.vue'))
}).$mount('#app');
