import type { MDXComponents } from 'mdx/types'
 
// ref: 
// - https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components
// - https://nextjs.org/docs/app/building-your-application/configuring/mdx
/**
 * MDX 组件配置
 * 这个文件定义了项目中所有 .mdx 文件使用的默认组件样式
 * 基于 shadcn/ui 的排版系统设计
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 保留传入的自定义组件,允许在特定页面覆盖默认样式
    ...components,
    
    // 标题系统
    // h1: 用于页面主标题
    h1: ({ children }) => (
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {children}
      </h1>
    ),
    // h2: 用于主要分节标题,带下划线
    h2: ({ children }) => (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {children}
      </h2>
    ),
    // h3: 用于次级分节标题
    h3: ({ children }) => (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {children}
      </h3>
    ),
    // h4: 用于小节标题
    h4: ({ children }) => (
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {children}
      </h4>
    ),
    
    // 基础文本组件
    // p: 标准段落,非首段落带上边距
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        {children}
      </p>
    ),
    // blockquote: 引用块,带左边框和斜体样式
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {children}
      </blockquote>
    ),
    
    // 列表组件
    // ul: 无序列表,带圆点
    ul: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        {children}
      </ul>
    ),
    // ol: 有序列表,带数字
    ol: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
        {children}
      </ol>
    ),
    
    // 链接组件
    // a: 带下划线的链接,hover 时颜色变淡
    a: ({ href, children }) => (
      <a 
        href={href}
        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      >
        {children}
      </a>
    ),
    
    // 代码组件
    // code: 行内代码,带背景色和圆角
    code: ({ children }) => (
      <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
        {children}
      </code>
    ),
    // pre: 代码块,带边框和内边距
    pre: ({ children }) => (
      <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border bg-black p-4">
        {children}
      </pre>
    ),

    // 特殊文本样式组件
    // lead: 用于引导段落,较大字号
    lead: ({ children }) => (
      <p className="text-xl text-muted-foreground">
        {children}
      </p>
    ),
    // large: 大号文本
    large: ({ children }) => (
      <div className="text-lg font-semibold">
        {children}
      </div>
    ),
    // small: 小号文本
    small: ({ children }) => (
      <small className="text-sm font-medium leading-none">
        {children}
      </small>
    ),
    // muted: 次要文本,颜色较浅
    muted: ({ children }) => (
      <p className="text-sm text-muted-foreground">
        {children}
      </p>
    ),
  }
} 