'use client'

import { useTranslations } from 'next-intl'
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

type OAuthButton = {
  id: string
  translationKey: string
  icon: React.ReactNode
}

export function LoginButtons({ 
  buttons,
  callbackUrl 
}: { 
  buttons: OAuthButton[]
  callbackUrl?: string 
}) {
  const t = useTranslations('Auth.login')
  
  return (
    <>
      {buttons.map(button => (
        <Button
          key={button.id}
          variant="outline"
          className="w-full"
          onClick={() => signIn(button.id, { callbackUrl })}
        >
          {button.icon}
          {t(`buttons.${button.id}`)}
        </Button>
      ))}
    </>
  )
} 