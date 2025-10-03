import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    EN: { translation: { welcome: "Welcome" } },
    ZH: { translation: { welcome: "欢迎" } },
    KO: { translation: { welcome: "환영합니다" } },
    HI: { translation: { welcome: "स्वागत है" } },
    IT: { translation: { welcome: "Benvenuto" } },
    JA: { translation: { welcome: "ようこそ" } },
  },
  lng: "EN",
  fallbackLng: "EN",
  interpolation: { escapeValue: false },
})

export default i18n