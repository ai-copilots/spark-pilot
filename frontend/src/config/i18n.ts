/**
 * 国际化（i18n）基础配置文件
 * 位于 /src/config/ 目录下，用于存储应用级静态配置
 * 该文件仅包含纯静态数据和简单的工具函数，不包含复杂逻辑
 */

/**
 * 支持的语言区域列表
 * 使用 as const 确保类型严格性
 * - zh: 中文
 * - en: 英文
 */
export const locales = ['zh', 'en'] as const;

/**
 * 从 locales 数组中提取语言代码类型
 * 类型将被推断为 'zh' | 'en'
 * 这样可以在 TypeScript 中获得更好的类型检查
 */
export type Locale = typeof locales[number];

/**
 * 默认语言设置
 * 当未指定语言时，将使用该语言作为回退选项
 */
export const defaultLocale: Locale = 'en';

/**
 * 语言区域对应的时区映射
 * 用于在不同语言环境下显示正确的时间
 * 
 * Record<Locale, string> 表示一个对象，其键为 Locale 类型，值为字符串
 * as const 确保对象的值是只读的字面量类型
 */
export const timeZones: Record<Locale, string> = {
    zh: 'Asia/Shanghai', // 中国标准时间
    en: 'UTC'           // 协调世界时
} as const;

/**
 * 获取指定语言区域的时区
 * @param locale - 语言区域代码，默认使用 defaultLocale
 * @returns 对应的时区字符串
 * 
 * 这是一个纯函数，不包含副作用
 * 可以在客户端和服务器端安全使用
 */
export const getTimeZone = (locale: Locale = defaultLocale): string => {
    return timeZones[locale];
}; 
