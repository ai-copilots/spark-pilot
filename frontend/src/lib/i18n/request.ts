/**
 * 国际化请求配置
 * 位于 /src/lib/i18n 目录下，用于配置 next-intl 的请求行为
 */

import React from 'react';
import type { ReactNode, JSX } from 'react';
import { getRequestConfig } from 'next-intl/server';
import { IntlErrorCode } from 'next-intl';
import type { Formats } from 'next-intl';
import { cookies } from 'next/headers';
import { defaultLocale, getTimeZone } from '@/config/i18n';
import type { Locale } from '@/config/i18n';

/**
 * 全局格式化配置
 * 提供统一的日期、数字和列表格式化选项
 */
export const formats: Formats = {
    dateTime: {
      short: {
        day: 'numeric',      // 数字格式的日期
        month: 'short',      // 月份缩写 (如: Jan)
        year: 'numeric',     // 数字格式的年份
        hour: 'numeric',     // 数字格式的小时
        minute: 'numeric'    // 数字格式的分钟
      },
      long: {
        day: 'numeric',          // 数字格式的日期
        month: 'long',          // 月份全称 (如: January)
        year: 'numeric',        // 数字格式的年份
        weekday: 'long',        // 星期全称 (如: Monday)
        hour: 'numeric',        // 数字格式的小时
        minute: 'numeric',      // 数字格式的分钟
        timeZoneName: 'short'   // 时区缩写 (如: GMT)
      }
    },
    number: {
      precise: {
        maximumFractionDigits: 5  // 最多显示 5 位小数
      }
    },
    list: {
      enumeration: {
        style: 'long',           // 使用完整格式
        type: 'conjunction'      // 使用连接词 (如: "和"、"and")
      }
    }
};

// 为不同语言定义格式化配置
const localeFormats: Record<Locale, Formats> = {
  zh: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false // 使用24小时制
      },
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
        timeZoneName: 'short'
      }
    },
    number: {
      precise: {
        maximumFractionDigits: 5
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 2
      },
      currency: {
        style: 'currency',
        currency: 'CNY'
      }
    },
    list: {
      enumeration: {
        style: 'long',
        type: 'conjunction'
      }
    }
  },
  en: {
    dateTime: {
      short: {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true // 使用12小时制
      },
      long: {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZoneName: 'short'
      }
    },
    number: {
      precise: {
        maximumFractionDigits: 5
      },
      percent: {
        style: 'percent',
        minimumFractionDigits: 2
      },
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    },
    list: {
      enumeration: {
        style: 'long',
        type: 'conjunction'
      }
    }
  }
};

// 添加错误处理函数
const handleError = (error: { code: IntlErrorCode; message: string }) => {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    console.error('Missing translation:', error);
  } else {
    console.error('Translation error:', error);
  }
};

// 添加消息回退处理
const getMessageFallback = ({ namespace, key, error }: {
  namespace?: string;
  key: string;
  error: { code: string };
}) => {
  const path = [namespace, key].filter((part) => part != null).join('.');

  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    return `${path} 尚未翻译`; // 缺失翻译的友好提示
  }
  return `开发者请注意: ${path} 需要修复`; // 其他错误的提示
};

export default getRequestConfig(async () => {
  const cookieStore = await cookies();  // 等待cookies()
  const locale = (cookieStore.get('NEXT_LOCALE')?.value || defaultLocale) as Locale;
 
  return {
    locale,
    timeZone: getTimeZone(locale),
    messages: (await import(`../../../messages/${locale}.json`)).default,
    now: new Date(),
    formats: localeFormats[locale],
    onError: handleError,
    getMessageFallback,
    defaultTranslationValues: {
      strong: (chunks: ReactNode): JSX.Element => React.createElement('strong', null, chunks),
      em: (chunks: ReactNode): JSX.Element => React.createElement('em', null, chunks),
      code: (chunks: ReactNode): JSX.Element => React.createElement('code', null, chunks),
    }
  };
});