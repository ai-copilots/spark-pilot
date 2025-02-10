"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * 主题提供者组件
 * 为应用程序提供主题上下文，支持主题切换功能
 * 
 * 功能：
 * 1. 提供主题状态管理
 * 2. 支持明暗主题切换
 * 3. 自动检测系统主题
 * 4. 持久化主题选择
 * 
 * 注意事项：
 * 1. 必须是客户端组件 ('use client')
 * 2. 通常在应用根级别使用
 * 3. 与 next-themes 集成
 * 
 * @example
 * ```tsx
 * <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
 *   <App />
 * </ThemeProvider>
 * ```
 * 
 * @see https://github.com/pacocoursey/next-themes
 * 
 * @param props - 从 next-themes 继承的属性
 * @param props.children - 子组件
 * @param props.attribute - 主题属性名称 ('class' | 'data-theme' | etc.)
 * @param props.defaultTheme - 默认主题
 * @param props.enableSystem - 是否启用系统主题
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 