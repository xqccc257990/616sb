import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//资源库
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import {
    Message
} from 'element-ui';
// import moment from 'moment'

Vue.use(ElementUI)
Vue.config.devtools = true;

Vue.config.interceptors = {
    response: res => {
        if (res.status === 200 && (res.data.code == 0 || !res.data.code)) {
            return true
        } else if (res.status === 200 && res.data.code == 1001) {
            Message({
                message: '登录已超时',
                type: "warning"
            });
            router.push('/login')
            return false
        } else if (res.status === 200 && res.headers['content-type'] == 'application/vnd.ms-excel') {
            return true
        }
        else {
            return false
        }
    }
}


//脚本库
import ajax from './base_modules/plugin/ajax'
import cache from './base_modules/plugin/cache'
import common from './base_modules/plugin/common'

// Vue.prototype.moment = moment;
moment.locale('zh-cn');
Vue.config.productionTip = false
Vue.config.TOKEN_NAME = 'accessToken' //全局自定义token名 



// 陈讯
// Vue.config.BASE_URL = 'http://10.0.191.151:9999' //全局请求url
// Vue.prototype.BASE_URL = 'http://10.0.191.151:9999' //全局下载请求url
// Vue.prototype.SOCKET_URL = '10.0.191.151:9999' //全局下载请求url
// Vue.prototype.UPLOAD_URL = 'http://test-image.wavewisdom.com/' //上传url
// http://10.0.14.42:6700/



// // 吴勇
Vue.config.BASE_URL = 'http://10.0.14.42:6700' //全局请求url
Vue.prototype.BASE_URL = 'http://10.0.14.42:6700' //全局下载请求url
Vue.prototype.SOCKET_URL = '10.0.14.42:6700' //全局下载请求url
Vue.prototype.UPLOAD_URL = 'http://test-image.wavewisdom.com/' //上传url
// // 吴勇
// Vue.config.BASE_URL = 'http://10.0.191.128:8898' //全局请求url
// Vue.prototype.BASE_URL = 'http://10.0.191.128:8898' //全局下载请求url
// Vue.prototype.SOCKET_URL = '10.0.191.128:8898' //全局下载请求url
// Vue.prototype.UPLOAD_URL = 'http://test-image.wavewisdom.com/' //上传url

// 吴勇
// Vue.config.BASE_URL = 'http://10.0.191.128:8899' //全局请求url
// Vue.prototype.BASE_URL = 'http://10.0.191.128:8899' //全局下载请求url
// Vue.prototype.SOCKET_URL = '10.0.191.128:8899' //全局下载请求url
// Vue.prototype.UPLOAD_URL = 'http://test-image.wavewisdom.com/' //上传url


// test
// Vue.config.BASE_URL = 'http://10.0.14.42:8899' //全局请求url
// Vue.prototype.BASE_URL = 'http://10.0.14.42:8899' //全局下载请求url
// Vue.prototype.SOCKET_URL = '10.0.14.42:8899' //全局下载请求url
// Vue.prototype.UPLOAD_URL = 'http://test-image.wavewisdom.com/' //上传url

// let locations = window.location;
// Vue.config.BASE_URL = locations.origin //全局请求url
// Vue.prototype.BASE_URL = locations.origin //全局下载请求url
// Vue.prototype.SOCKET_URL = locations.host //全局下载请求url
// Vue.prototype.UPLOAD_URL = 'http://test-image.wavewisdom.com/' //上传url



// 生产环境Git branch
// Vue.config.BASE_URL = 'https://ulock-api.wavewisdom.com' //全局请求url
// Vue.prototype.BASE_URL = 'https://ulock-api.wavewisdom.com' //全局下载请求url
// Vue.prototype.SOCKET_URL = window.location.host //全局下载请求url
// Vue.prototype.UPLOAD_URL = 'http://img.wavewisdom.com/' //上传url

Vue.use(ajax, router)
Vue.use(cache)
Vue.use(common, router)
// Vue.use(moment)

//组件库
import appList from './base_modules/components/app-list'
import appHeader from './base_modules/components/app-header'
import appDetail from './base_modules/components/app-detail'
import appBatch from './base_modules/components/app-batch'
import appForm from './base_modules/components/app-form'
import appOverview from './base_modules/components/app-overview'
import appTree from './base_modules/components/app-tree'

Vue.component('app-list', appList)
Vue.component('app-header', appHeader)
Vue.component('app-detail', appDetail)
Vue.component('app-batch', appBatch)
Vue.component('app-form', appForm)
Vue.component('app-overview', appOverview)
Vue.component('app-tree', appTree)

// 配置路由权限
router.beforeEach((to, from, next) => {
    if (sessionStorage.getItem('userInfo') || to.path == '/login') { // 判断本地是否存在access_token
        next()
    } else {
        // 未登录,跳转到登陆页面，并且带上 将要去的地址，方便登陆后跳转。
        Message({
            message: '登录已过期',
            type: 'warning'
        });
        next('/login')
    }
})

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')