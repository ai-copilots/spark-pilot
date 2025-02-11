"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

/**
 * 认证错误页面
 * 
 * 错误类型：
 * - Configuration: 服务器配置问题
 * - AccessDenied: 访问被拒绝
 * - Verification: 验证令牌问题
 * - Default: 其他错误
 * 
 * URL 参数：
 * - error: 错误类型
 */
export default function AuthErrorPage() {
  const t = useTranslations('Auth.error')
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            {t(`types.${error || "default"}.description`)}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <code className="rounded bg-muted px-2 py-1 text-sm">
              {t(`types.${error}.code`)}
            </code>
          )}
          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/">{t("returnHome")}</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/login">{t("tryAgain")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 