import type { NextConfig } from "next";

import createNextIntlPlugin from 'next-intl/plugin'

import type { Options } from '@mdx-js/loader'
import createMDX from '@next/mdx'

/**
 * 国际化插件配置
 * 用于处理多语言路由和翻译
 */
const withNextIntl = createNextIntlPlugin(
  './src/lib/i18n/request.ts'  // 国际化配置文件路径
)

/**
 * MDX 配置
 * 用于处理 .mdx 文件的编译和转换
 */
const withMDX = createMDX({
  options: {
  } satisfies Partial<Options>,
})

/**
 * Next.js 主配置
 */
const nextConfig: NextConfig = {
  // 支持的页面文件扩展名
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  
  // 实验性功能配置
  experimental: {
    // 包导入优化
    optimizePackageImports: [
      '@icons-pack/react-simple-icons'  // 优化图标包的导入
    ],
    // ESM 支持
    esmExternals: true,  // 启用 ES 模块支持
  }
}

// 导出最终配置
export default withNextIntl(withMDX(nextConfig));
