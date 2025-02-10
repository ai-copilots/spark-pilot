import localFont from 'next/font/local'

// 英文（无衬线）
export const fontNotoSans = localFont({
  src: [
    { path: 'fonts/NotoSans-Regular.ttf', weight: '400', style: 'normal' },
    { path: 'fonts/NotoSans-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-sans',
  display: 'swap',
})

// 中文（无衬线 - UI 设计）
export const fontNotoSansSC = localFont({
  src: [
    { path: 'fonts/NotoSansSC-Regular.ttf', weight: '400', style: 'normal' },
    { path: 'fonts/NotoSansSC-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-sans-sc',
  display: 'swap',
})

// 中文（有衬线 - 正式内容）
export const fontNotoSerifSC = localFont({
  src: [
    { path: 'fonts/NotoSerifSC-Regular.ttf', weight: '400', style: 'normal' },
    { path: 'fonts/NotoSerifSC-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-noto-serif-sc',
  display: 'swap',
})
