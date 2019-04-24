import Vue from 'vue'
import App from './App'
import store from './store'
import AudioManager from "@/utils/audioManager";

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$backgroundAudioData = {
    playing: false,
    playTime: 0,
    formatedPlayTime: '00:00:00'
}
Vue.prototype.$audio = new AudioManager(Vue);

App.mpType = 'app'

const app = new Vue({
    store,
    ...App
})
app.$mount()
