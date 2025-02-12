import { getTranslations } from 'next-intl/server'
import { SiGithub, SiGoogle, SiWechat } from '@icons-pack/react-simple-icons'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoginButtons } from './login-buttons'

/**
 * OAuth 按钮配置
 */
const OAUTH_BUTTONS = [
  {
    id: 'github',
    translationKey: 'Buttons.githubLogin',
    icon: <SiGithub className="mr-2 h-4 w-4" />
  },
  {
    id: 'google',
    translationKey: 'Buttons.googleLogin',
    icon: <SiGoogle className="mr-2 h-4 w-4" />
  },
  {
    id: 'wechat',
    translationKey: 'Buttons.wechatLogin',
    icon: <SiWechat className="mr-2 h-4 w-4" />
  }
]

type PageProps = {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

/**
 * 登录页面组件
 */
export default async function Login({
  searchParams,
}: PageProps) {
  const t = await getTranslations('Auth.login')
  
  const params = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-8">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="scroll-m-20 text-3xl font-bold tracking-tight text-foreground">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {t('description')}
              {params.error && (
                <p className="mt-4 text-sm font-medium text-destructive">
                  {t(`error.${params.error}`)}
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LoginButtons 
              buttons={OAUTH_BUTTONS}
              callbackUrl={params.callbackUrl}
            />
          </CardContent>
        </Card>
        <footer className="text-balance text-center text-sm text-muted-foreground">
          <p className="leading-relaxed">
            {t('terms.agreement')}{' '}
            <a 
              href="/legal/terms"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              {t('terms.service')}
            </a>{' '}
            {t('terms.and')}{' '}
            <a 
              href="/legal/privacy"
              className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
            >
              {t('terms.privacy')}
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
