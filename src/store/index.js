import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        //global params
        lang: 'zh'
    },
    mutations: {
        //global setter function
        //usage: this.$store.commit('param_1','param_1_value')
        lang: (state, lang) => {
            state.lang = lang
        }
    },
    getters: {
        //global getter function   
        //usage: this.$store.getters.function_1
        lang: state => state.lang
    },
    actions: {
        //global async function
        //usage: this.$store.dispatch('actions_function_1','actions_function_1_param_1')
    },
    modules: {
        //import modules
    }
})

export default store