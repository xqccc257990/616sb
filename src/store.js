import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)

//缓存数据
function set(key, value) {
  sessionStorage.setItem(key, value);
  return value;
}

//读取缓存数据，如果有默认值则缓存并返回默认值
function get(key, defaultValue) {
  var _value = sessionStorage.getItem(key);
  if (_value) {
    var data = JSON.parse(_value);
    return data;
  } else if (typeof defaultValue != 'undefined') {
    set(key, defaultValue);
    return defaultValue;
  } else {
    return null;
  }
}

export default new Vuex.Store({
  state: {
    loginFalg: get('loginFalg', 0) //登录状态0未登录 1登录成功 2登录过期
  },
  mutations: {
    setLoginFalg(state, falg) {
      state.loginFalg = set('loginFalg', falg);
    }
  }
})
