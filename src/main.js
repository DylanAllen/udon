// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import vSelect from 'vue-select'
import VTooltip from 'v-tooltip'
import Vueditor from 'vueditor'
import Vuex from 'vuex'
import 'vueditor/dist/style/vueditor.min.css'
import firebaseConfig from './firebaseConfig'

// your config here
let config = {
  toolbar: [
    'removeFormat', 'undo', '|', 'elements', 'fontName', 'fontSize', 'foreColor', 'backColor', 'divider',
    'bold', 'italic', 'underline', 'strikeThrough', 'links', 'divider', 'subscript', 'superscript',
    'divider', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', '|', 'indent', 'outdent',
    'insertOrderedList', 'insertUnorderedList', '|', 'tables', '|', 'switchView'
  ],
  fontName: [
    {val: 'arial black'},
    {val: 'times new roman'},
    {val: 'Courier New'}
  ],
  fontSize: ['12px', '14px', '16px', '18px', '22px'],
  uploadUrl: ''
}

Vue.use(Vuex)
Vue.use(Vueditor, config)
Vue.use(VueFire)
Vue.component('v-select', vSelect)
var tipoptions = {
  defaultDelay: 300
}
Vue.use(VTooltip, tipoptions)

var firebaseRef = firebase.initializeApp(firebaseConfig)
export const db = firebaseRef.firestore()
const settings = {timestampsInSnapshots: true}
db.settings(settings)
firebase.firestore().enablePersistence()
  .then(function () {
  })
  .catch(function (err) {
    if (err.code === 'failed-precondition') {
      console.log('Failed precondition (maybe tabs open?)')
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support all of the features required to enable persistence')
    }
  })
export const storage = firebaseRef.storage()
Vue.config.productionTip = false
let app

firebaseRef.auth().onAuthStateChanged(function (user) {
  if (!app) {
    /* eslint-disable no-new */
    new Vue({
      el: '#app',
      router,
      components: { App },
      template: '<App/>'
    })
  }
})
/* eslint-disable no-new */
