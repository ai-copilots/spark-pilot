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
      path: '../../public/fonts/NotoSans-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSans-Black.woff2',
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
      path: '../../public/fonts/NotoSansSC-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansSC-Light.woff2',
      weight: '300',
      style: 'normal',
    }, */
    {
      path: '../../public/fonts/NotoSansSC-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansSC-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    /* {
      path: '../../public/fonts/NotoSansSC-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    }, */
    {
      path: '../../public/fonts/NotoSansSC-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    /* {
      path: '../../public/fonts/NotoSansSC-ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../../public/fonts/NotoSansSC-Black.woff2',
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
 *       path: '../../public/fonts/NotoSansJP-Thin.woff2',
 *       weight: '100',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Light.woff2',
 *       weight: '300',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Regular.woff2',
 *       weight: '400',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Medium.woff2',
 *       weight: '500',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-SemiBold.woff2',
 *       weight: '600',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Bold.woff2',
 *       weight: '700',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-ExtraBold.woff2',
 *       weight: '800',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansJP-Black.woff2',
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
 *       path: '../../public/fonts/NotoSansKR-Regular.woff2',
 *       weight: '400',
 *       style: 'normal',
 *     },
 *     {
 *       path: '../../public/fonts/NotoSansKR-Bold.woff2',
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