import { getTranslations, getNow, getLocale } from 'next-intl/server'
import Privacy_EN from '@/content/legal/en/privacy.mdx'
import Privacy_ZH from '@/content/legal/zh/privacy.mdx'

/**
 * 隐私政策页面
 * 根据当前语言动态加载对应的 MDX 内容
 */
export default async function PrivacyPage() {
  // 获取当前语言、翻译函数和时间
  const locale = await getLocale()
  const t = await getTranslations('Legal')
  const now = await getNow()

  // 根据语言选择对应的 MDX 组件
  const Content = locale === 'zh' ? Privacy_ZH : Privacy_EN

  return (
    <>
      <h1>{t('privacy.title')}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {t('privacy.lastUpdated', { date: now })}
      </p>
      <Content />
    </>
  )
} 