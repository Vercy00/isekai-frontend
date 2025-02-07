const fallbackLng = "pl"
const languages = [fallbackLng]
const defaultNS = "translation"
const cookieName = "i18next"

function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  }
}

export { fallbackLng, languages, defaultNS, cookieName, getOptions }
