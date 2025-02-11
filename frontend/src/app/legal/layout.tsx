import { type ReactNode } from 'react'

/**
 * 法律文档的布局
 * 提供统一的样式和布局结构
 */
export default function LegalLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl prose prose-slate dark:prose-invert
      prose-headings:scroll-m-20 
      prose-headings:font-semibold 
      prose-h1:text-4xl 
      prose-h2:text-3xl 
      prose-h2:border-b 
      prose-h2:pb-2
      prose-h3:text-2xl 
      prose-h4:text-xl
      prose-p:leading-7 
      prose-p:[&:not(:first-child)]:mt-6
      prose-blockquote:border-l-2 
      prose-blockquote:pl-6 
      prose-blockquote:italic
      prose-ul:my-6 
      prose-ul:ml-6 
      prose-ul:list-disc 
      prose-ul:[&>li]:mt-2
      prose-ol:my-6 
      prose-ol:ml-6 
      prose-ol:list-decimal 
      prose-ol:[&>li]:mt-2">
      {children}
    </div>
  )
} 