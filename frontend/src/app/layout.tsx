import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { formats } from "@/lib/i18n/request";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { getAllFontVariables } from "@/styles/fonts";
import "@/styles/globals.css";

/**
 * 生成动态元数据
 * 使用 next-intl 的服务器端翻译函数获取元数据
 * 
 * @see https://next-intl.dev/docs/getting-started/app-router#metadata
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */
export async function generateMetadata(): Promise<Metadata> {
  // 从 'Metadata' 命名空间获取翻译函数
  const t = await getTranslations('Metadata');
 
  return {
    title: t('title'),
    description: t('description')
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html 
      lang={locale} 
      suppressHydrationWarning
      className={cn(
        ...getAllFontVariables() // 加载所有字体变量
      )}
    >
      <body
        className={cn(
          "antialiased",
          {
            'font-sans': locale === 'en',
            'font-sc': locale === 'zh',
            // 未来支持的语言:
            // 'font-jp': locale === 'ja',
            // 'font-kr': locale === 'ko',
          }
        )}
      >
        <NextIntlClientProvider messages={messages} locale={locale} formats={formats}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
