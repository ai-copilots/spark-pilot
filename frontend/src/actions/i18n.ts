"use server"

/**
 * 服务端国际化操作
 * 位于 /src/actions/ 目录下，用于处理服务端的语言切换操作
 */

// 1. Framework-Specific Imports
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

// 2. Type-Only Imports
import type { Locale } from '@/config/i18n'

/**
 * 设置用户语言偏好
 * 通过 Cookie 存储用户的语言选择
 * 
 * @param locale - 目标语言代码
 * 
 * 使用 'use server' 指令标记为服务端操作
 * 设置完成后会重新验证根路径，确保语言切换生效
 */
export async function setLocale(locale: Locale) {
  const cookieStore = await cookies()
  cookieStore.set('NEXT_LOCALE', locale, {
    path: '/',
    maxAge: 31536000, // 1年
    sameSite: 'strict'
  })

  revalidatePath('/')
} 