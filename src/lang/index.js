import Vue from 'vue'
import VueI18n from 'vue-i18n' // internationalized plug-in packages
import locale from 'element-ui/lib/locale'
import elementEN from 'element-ui/lib/locale/lang/en'
import elementES from 'element-ui/lib/locale/lang/es'
import elementJA from 'element-ui/lib/locale/lang/ja'
import elementZH from 'element-ui/lib/locale/lang/zh-CN'
import en from './en'
import zh from './zh'
import ja from './ja'
import es from './es'

Vue.use(VueI18n) // registration of internationalization packages globally

const i18n = new VueI18n({
  // The language type zh indicates Chinese and en indicates English
  locale: 'zh',
  messages: {
    en: {
      ...elementEN,
      ...en
    },
    zh: {
      ...elementZH,
      ...zh
    },
    es: {
      ...elementES,
      ...es
    },
    ja: {
      ...elementJA,
      ...ja
    }
  }
})

// Configure ElementUI language transformation relationships
locale.i18n((key, value) => i18n.t(key, value))

export default i18n