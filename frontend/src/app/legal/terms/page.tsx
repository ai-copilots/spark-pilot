import { getTranslations, getNow, getLocale } from 'next-intl/server'
import Terms_EN from '@/content/legal/en/terms.mdx'
import Terms_ZH from '@/content/legal/zh/terms.mdx'

/**
 * 服务条款页面
 * 根据当前语言动态加载对应的 MDX 内容
 */
export default async function TermsPage() {
  // 获取当前语言、翻译函数和时间
  const locale = await getLocale()
  const t = await getTranslations('Legal')
  const now = await getNow()

  // 根据语言选择对应的 MDX 组件
  const Content = locale === 'zh' ? Terms_ZH : Terms_EN

  return (
    <>
      <h1>{t('terms.title')}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {t('terms.lastUpdated', { date: now })}
      </p>
      <Content />
    </>
  )
} 