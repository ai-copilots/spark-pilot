/**
 * ESLint 配置文件 for Next.js
 * 该配置基于 Next.js 推荐的 ESLint 设置，包含了最优的开箱即用的 linting 体验
 */

// 导入必要的 Node.js 模块用于处理文件路径
import { dirname } from "path";
import { fileURLToPath } from "url";
// 导入 FlatCompat 用于支持传统的 ESLint 配置格式
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
 * next/core-web-vitals: 包含针对 Core Web Vitals 优化的严格规则集
 * next/typescript: 包含 TypeScript 特定的 lint 规则
 * 
 * 这些配置继承自:
 * - eslint-plugin-react
 * - eslint-plugin-react-hooks
 * - eslint-plugin-next
 * - @typescript-eslint
 */
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
