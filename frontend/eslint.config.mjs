/**
 * ESLint 配置文件 for Next.js
 * 该配置基于 Next.js 推荐的 ESLint 设置，提供最优的开箱即用的 linting 体验
 * 
 * Next.js 默认包含以下 ESLint 插件的推荐规则集:
 * - eslint-plugin-react: React 特定的 linting 规则
 * - eslint-plugin-react-hooks: React Hooks 的规则
 * - eslint-plugin-next: Next.js 特定的最佳实践规则
 * - @typescript-eslint: TypeScript 的 linting 规则
 */

// 导入必要的 Node.js 模块用于处理文件路径
import { dirname } from "path";
import { fileURLToPath } from "url";
// 导入 FlatCompat 用于支持传统的 ESLint 配置格式
// 这是因为 ESLint 新的扁平配置系统与传统配置有所不同
import { FlatCompat } from "@eslint/eslintrc";

// 将 ES 模块的 import.meta.url 转换为 __filename 和 __dirname
// 这是因为 ES 模块默认没有这些 CommonJS 变量
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * 创建 FlatCompat 实例
 * 这允许我们在新的 ESLint 扁平配置系统中使用传统的配置格式
 * baseDirectory: 用于解析配置文件的基础目录
 */
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/**
 * ESLint 配置数组
 * 
 * next/core-web-vitals: 
 * - 包含 Next.js 的基础 ESLint 配置
 * - 添加了更严格的 Core Web Vitals 规则集
 * - 推荐给首次设置 ESLint 的开发者
 * 
 * next/typescript:
 * - 提供 TypeScript 优先的开发体验
 * - 包含 TypeScript 特定的 lint 规则
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  /**
   * UI 组件和 Hooks 的特殊规则配置
   * 针对 src/components/ui 和 src/hooks 目录下的文件
   */
  {
    files: ['src/components/ui/**/*.ts', 'src/components/ui/**/*.tsx', 'src/hooks/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off', // 允许未使用的变量(用于接口定义)
      'react-hooks/exhaustive-deps': 'off',       // 关闭 hooks 依赖检查
      '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
      '@typescript-eslint/ban-ts-comment': 'off'   // 允许使用 @ts-ignore 等注释
    }
  },

  /**
   * TypeScript/TSX 文件的通用规则
   * 适用于项目中所有的 .ts 和 .tsx 文件
   */
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // 允许在组件中使用字符串字面量
      'react/jsx-no-literals': 'off',
      
      // 强制使用 Next.js 的 Link 组件进行页面导航
      // 这有助于确保正确的客户端导航和预加载
      '@next/next/no-html-link-for-pages': 'error'
    }
  }
];

export default eslintConfig;
