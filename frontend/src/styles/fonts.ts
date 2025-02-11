import localFont from 'next/font/local';
import type { Locale } from '@/config/i18n';

// 定义字体配置类型
type FontConfig = {
  variable: string;
  className: string;
};

// 定义每种语言的字体配置
type LocaleFonts = {
  [key in Locale]: FontConfig;
};

// 基础拉丁字体 (英文等)
export const notoSans = localFont({
  src: [
    {
      path: '../../public/fonts/NotoSans-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Black.ttf',
      weight: '900',
      style: 'normal',
    }
  ],
  variable: '--font-noto-sans',
  display: 'swap',
});

// 简体中文
export const notoSansSC = localFont({
  src: [
    /* {
      path: '../../public/fonts/NotoSansSC-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansSC-Light.ttf',
      weight: '300',
      style: 'normal',
    }, */
    {
      path: '../../public/fonts/NotoSansSC-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansSC-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    /* {
      path: '../../public/fonts/NotoSansSC-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    }, */
    {
      path: '../../public/fonts/NotoSansSC-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    /* {
      path: '../../public/fonts/NotoSansSC-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansSC-Black.ttf',
      weight: '900',
      style: 'normal',
    } */
  ],
  variable: '--font-noto-sans-sc',
  display: 'swap',
});

/**
 * 未来可能支持的其他语言字体配置
 * 
 * 日文支持:
 * export const notoSansJP = localFont({
 *   src: [
 *     {
 *       path: '../../public/fonts/NotoSansJP-Thin.ttf',
 *       weight: '100',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Light.ttf',
 *       weight: '300',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Regular.ttf',
 *       weight: '400',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Medium.ttf',
 *       weight: '500',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-SemiBold.ttf',
 *       weight: '600',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Bold.ttf',
 *       weight: '700',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-ExtraBold.ttf',
 *       weight: '800',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Black.ttf',
 *       weight: '900',
 *       style: 'normal',
 *     }
 *   ],
 *   variable: '--font-noto-sans-jp',
 *   display: 'swap',
 * });
 * 
 * 韩文支持:
 * export const notoSansKR = localFont({
 *   src: [
 *     {
 *       path: '../../public/fonts/NotoSansKR-Regular.ttf',
 *       weight: '400',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansKR-Bold.ttf',
 *       weight: '700',
 *       style: 'normal',
 *     }
 *   ],
 *   variable: '--font-noto-sans-kr',
 *   display: 'swap',
 * });
 */

// 语言到字体的映射
export const localeFonts: LocaleFonts = {
  en: notoSans,
  zh: notoSansSC,
  // 未来支持的语言:
  // ja: notoSansJP,
  // ko: notoSansKR,
} as const;

// 获取特定语言的字体配置
export const getFontByLocale = (locale: string): FontConfig => {
  return (locale in localeFonts) ? localeFonts[locale as keyof LocaleFonts] : notoSans;
};

// 获取所有字体变量
export const getAllFontVariables = () => {
  return Object.values(localeFonts).map(font => font.variable);
}; 