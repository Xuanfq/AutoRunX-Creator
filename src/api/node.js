import axios from 'axios'
import { api } from '@/config'
import store from '@/store'

var inited = false
var defaultLang = 'zh'
var config = null
var baseNodeConfigUrl = api['defaultapi']['basenode']['nodeconfig']
var baseNodeDocumentUrl = api['defaultapi']['basenode']['nodedocument']
var marketNodeConfigUrl = api['defaultapi']['marketnode']['nodeconfig']
var marketNodeDocumentUrl = api['defaultapi']['marketnode']['nodedocument']
var baseNodeNodeDataUrl = api['defaultapi']['basenode']['nodeallconfigbytype']

const refresh = () => {
    axios.get(api['index'])
        .then((res) => {
            // console.log(res)
            config = res.data
            baseNodeConfigUrl = config['api']['basenode']['nodeconfig']
            baseNodeDocumentUrl = config['api']['basenode']['nodedocument']
            marketNodeConfigUrl = config['api']['marketnode']['nodeconfig']
            marketNodeDocumentUrl = config['api']['marketnode']['nodedocument']
            baseNodeNodeDataUrl = config['api']['basenode']['nodeallconfigbytype']
            inited = true
        })
        .catch((err) => {
            console.log(err)
        })
}

const refreshLang = () => {
    if (store && store.getters.lang) {
        defaultLang = store.getters.lang
    }
    return defaultLang
}



refresh()



export const getNodeDoc = (callback, self, node, lang) => {
    if (!lang) lang = refreshLang()
    axios.get(baseNodeDocumentUrl.replace("${lang}", lang).replace("${nodeId}", node.node_name))
        // search from base node
        .then((res) => {
            // console.log(res)
            let data = { flag: true, data: res.data }
            callback.call(self, data)
        })
        .catch((err) => {
            // console.err(err)
            axios.get(marketNodeDocumentUrl.replace("${lang}", lang).replace("${nodeId}", node.node_name))
                // search from market node
                .then((res) => {
                    // console.log(res)
                    let data = { flag: true, data: res.data }
                    callback.call(self, data)
                })
                .catch((err) => {
                    // console.err(err)
                    let data = { flag: true, data: err }
                    callback.call(self, data)
                })
        })
}

export const getBaseNodeData = (callback, self, lang) => {
    if (!lang) lang = refreshLang()
    axios.get(baseNodeNodeDataUrl.replace("${lang}", lang))
        .then((res) => {
            // console.log(res)
            let data = { flag: true, data: res.data }
            callback.call(self, data)
        })
        .catch((err) => {
            // console.err(err)
            let data = { flag: false, data: err }
            callback.call(self, data)
        })
}








