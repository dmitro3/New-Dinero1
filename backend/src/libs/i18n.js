import i18n from 'i18n'
import path from 'path'

i18n.configure({
  locales: ['EN', 'FO', 'NI', 'FR', 'DE'],
  defaultLocale: 'EN',
  syncFiles: true,
  autoReload: true,
  directory: path.join(__dirname, '../locals')
})

export default i18n
