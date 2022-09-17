import { createI18n } from 'vue-i18n';
import itIT from './locales/it-IT.json';

type MessageSchema = typeof itIT;

const i18n = createI18n<[MessageSchema], 'it-IT'>({
  legacy: false,
  locale: 'it-IT',
  messages: {
    'it-IT': itIT,
  },
  missingWarn: false,
  fallbackWarn: false,
});

export default i18n;
