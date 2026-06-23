import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Exchange Rates',
    description: 'Convert selected currencies via CurrencyFreaks.',
    version: '0.1.0',
    permissions: [],
    host_permissions: ['https://api.currencyfreaks.com/*'],
    content_security_policy: {
      extension_pages: "default-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://flagcdn.com; connect-src https://api.currencyfreaks.com",
    },
    icons: {
      16: '/icons/16.png',
      32: '/icons/32.png',
      48: '/icons/48.png',
      96: '/icons/96.png',
      128: '/icons/128.png',
    },
  },
});
