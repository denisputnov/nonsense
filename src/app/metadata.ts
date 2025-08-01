import {Metadata} from 'next';

export const formatMetadata = (meta: Pick<Metadata, 'title' | 'description'>): Metadata => ({
  keywords:
    'чепуха, игра чепуха, игра слов, онлайн чепуха, весёлая игра, игра на компанию, генератор историй, придумывание историй, party game, словесная игра, онлайн игра',
  authors: [{name: 'Денис Путнов'}],

  openGraph: {
    title: 'Чепуха — придумывай безумные истории с друзьями',
    description: 'Играй в Чепуху онлайн! Весёлый генератор абсурдных историй для компании. Просто, быстро и бесплатно.',
    url: 'https://nonsense.putnov.ru',
    siteName: 'Чепуха Онлайн',
    type: 'website',
  },

  twitter: {
    title: 'Онлайн-Чепуха — генератор весёлых историй',
    description:
      'Игра Чепуха — безумные истории, которые вы придумываете вместе с друзьями онлайн. Смеяться будете все!',
  },

  icons: {
    icon: './favicon.ico',
  },

  verification: {
    yandex: '9b573221f0c4cd2c',
  },

  ...meta,
});
