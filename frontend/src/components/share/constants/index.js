import {
  email,
  facebook,
  linkedin,
  odnoklassniki,
  pinterest,
  reddit,
  telegram,
  twitter,
  vkontakte,
} from '@/assets/png';

export const PLATFORMS = [
  {
    name: 'Twitter',
    icon: twitter,
    url: (embededLink) =>
      `https://twitter.com/intent/tweet?url=${embededLink}&text=Check+this+out!`,
  },
  {
    name: 'Telegram',
    icon: telegram,
    url: (embededLink) =>
      `https://t.me/share/url?url=${embededLink}&text=Check+this+out!`,
  },
  {
    name: 'Facebook',
    icon: facebook,
    url: (embededLink) =>
      `https://www.facebook.com/sharer/sharer.php?u=${embededLink}`,
  },
  {
    name: 'VKontakte',
    icon: vkontakte,
    url: (embededLink) => `https://vk.com/share.php?url=${embededLink}`,
  },
  {
    name: 'Odnoklassniki',
    icon: odnoklassniki,
    url: (embededLink) =>
      `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${embededLink}`,
  },
  {
    name: 'Reddit',
    icon: reddit,
    url: (embededLink) =>
      `https://www.reddit.com/submit?url=${embededLink}&title=Check+this+out!`,
  },
  {
    name: 'Email',
    icon: email,
    url: (embededLink) =>
      `mailto:?subject=Check+this+out!&body=I+found+something+interesting+to+share+with+you:+${embededLink}`,
  },
  {
    name: 'Pinterest',
    icon: pinterest,
    url: (embededLink) =>
      `https://pinterest.com/pin/create/button/?url=${embededLink}`,
  },
  {
    name: 'LinkedIn',
    icon: linkedin,
    url: (embededLink) =>
      `https://www.linkedin.com/shareArticle?mini=true&url=${embededLink}&title=Check+this+out!&summary=&source=`,
  },
];

export const REF_LINK = `${process.env.NEXT_PUBLIC_APP_URL}/?ref=r_`;

export const POP_UP_WINDOW = {
  width: 650,
  height: 400,
};
