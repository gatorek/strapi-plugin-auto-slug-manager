'use strict';

// Helper function to prefix translation keys
function prefixPluginTranslations(data, prefix) {
  if (!data || typeof data !== 'object') {
    return {};
  }
  
  const prefixed = {};
  for (const [key, value] of Object.entries(data)) {
    prefixed[`${prefix}.${key}`] = value;
  }
  return prefixed;
}

export default {
  register(app) {
    // Регистрация ссылки в главном меню
    app.addMenuLink({
      to: '/plugins/auto-slug-manager',
      icon: () => '🔗',
      intlLabel: {
        id: 'auto-slug-manager.plugin.name',
        defaultMessage: 'Auto Slug Manager',
      },
      permissions: [],
      async Component() {
        const { default: SettingsPage } = await import('./admin-page');
        return SettingsPage;
      },
    });
  },
  
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "auto-slug-manager-translation-[request]" */ `./admin/src/translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, 'auto-slug-manager'),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );
    return Promise.resolve(importedTrads);
  },
  
  bootstrap(app) {
    console.log('🚀 [Auto Slug Manager] Admin panel bootstrap');
  },
}; 