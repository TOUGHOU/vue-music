import Vue from 'vue'
import Vuex from 'vuex'
import * as getter from './getter'
import * as actions from './actions'
import state from './state'
import mutations from './mutations'
import creatLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getter,
  state,
  mutations,
  strict: debug,
  plugins: debug ? [creatLogger()] : []
})
