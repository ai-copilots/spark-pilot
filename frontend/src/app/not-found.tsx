/**
 * Next.js Not Found Page
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 * 
 * This file is used to render UI when:
 * 1. The notFound function is thrown within a route segment
 * 2. Handling any unmatched URLs for the whole application
 * 
 * Note: Returns HTTP status codes:
 * - 200 for streamed responses
 * - 404 for non-streamed responses
 */

// 1. React 和 Next.js 内置模块
import Link from 'next/link'

// 2. 外部依赖
import { getTranslations } from 'next-intl/server'

// 3. 项目内部模块

// 4. 当前目录模块

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-4xl font-bold mb-4">{t('title')}</h2>
      <p className="text-gray-600 mb-4">{t('description')}</p>
      <Link 
        href="/" 
        className="text-blue-500 hover:text-blue-700 underline"
      >
        {t('returnHome')}
      </Link>
    </div>
  )
}