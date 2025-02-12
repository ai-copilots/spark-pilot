````
frontend % tree -I "node_modules|.git"
.
├── README.md
├── bun.lockb
├── components.json
├── docs
│   └── project-directory-layout.md
├── eslint.config.mjs
├── messages
│   ├── en.json
│   └── zh.json
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── fonts
│   │   ├── NotoSans-Black.ttf
│   │   ├── NotoSans-BlackItalic.ttf
│   │   ├── NotoSans-Bold.ttf
│   │   ├── NotoSans-BoldItalic.ttf
│   │   ├── NotoSans-ExtraBold.ttf
│   │   ├── NotoSans-ExtraBoldItalic.ttf
│   │   ├── NotoSans-ExtraLight.ttf
│   │   ├── NotoSans-ExtraLightItalic.ttf
│   │   ├── NotoSans-Italic.ttf
│   │   ├── NotoSans-Light.ttf
│   │   ├── NotoSans-LightItalic.ttf
│   │   ├── NotoSans-Medium.ttf
│   │   ├── NotoSans-MediumItalic.ttf
│   │   ├── NotoSans-Regular.ttf
│   │   ├── NotoSans-SemiBold.ttf
│   │   ├── NotoSans-SemiBoldItalic.ttf
│   │   ├── NotoSans-Thin.ttf
│   │   ├── NotoSans-ThinItalic.ttf
│   │   ├── NotoSansSC-Bold.ttf
│   │   ├── NotoSansSC-ExtraBold.ttf
│   │   ├── NotoSansSC-ExtraLight.ttf
│   │   ├── NotoSansSC-Light.ttf
│   │   ├── NotoSansSC-Medium.ttf
│   │   ├── NotoSansSC-Regular.ttf
│   │   ├── NotoSansSC-SemiBold.ttf
│   │   ├── NotoSansSC-Thin.ttf
│   │   ├── NotoSerifSC-Black.ttf
│   │   ├── NotoSerifSC-Bold.ttf
│   │   ├── NotoSerifSC-ExtraBold.ttf
│   │   ├── NotoSerifSC-ExtraLight.ttf
│   │   ├── NotoSerifSC-Light.ttf
│   │   ├── NotoSerifSC-Medium.ttf
│   │   ├── NotoSerifSC-Regular.ttf
│   │   └── NotoSerifSC-SemiBold.ttf
│   ├── globe.svg
│   ├── icons
│   ├── images
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── actions
│   │   └── i18n.ts
│   ├── app
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth]
│   │   │   │       └── route.ts
│   │   │   └── showcase
│   │   │       └── weather
│   │   │           └── route.ts
│   │   ├── auth
│   │   │   ├── error
│   │   │   │   └── page.tsx
│   │   │   └── login
│   │   │       ├── login-buttons.tsx
│   │   │       └── page.tsx
│   │   ├── favicon.ico
│   │   ├── layout.tsx
│   │   ├── legal
│   │   │   ├── layout.tsx
│   │   │   ├── privacy
│   │   │   │   └── page.tsx
│   │   │   └── terms
│   │   │       └── page.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── showcase
│   │   │   └── weather
│   │   │       └── page.tsx
│   │   └── showcases
│   │       ├── neo4j
│   │       │   └── page.tsx
│   │       └── typography
│   │           └── page.tsx
│   ├── components
│   │   ├── auth
│   │   ├── common
│   │   └── ui
│   │       ├── accordion.tsx
│   │       ├── alert-dialog.tsx
│   │       ├── alert.tsx
│   │       ├── aspect-ratio.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── carousel.tsx
│   │       ├── chart.tsx
│   │       ├── checkbox.tsx
│   │       ├── collapsible.tsx
│   │       ├── command.tsx
│   │       ├── context-menu.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form.tsx
│   │       ├── hover-card.tsx
│   │       ├── input-otp.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── progress.tsx
│   │       ├── radio-group.tsx
│   │       ├── resizable.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── slider.tsx
│   │       ├── sonner.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toast.tsx
│   │       ├── toaster.tsx
│   │       ├── toggle-group.tsx
│   │       ├── toggle.tsx
│   │       └── tooltip.tsx
│   ├── config
│   │   └── i18n.ts
│   ├── content
│   │   └── legal
│   │       ├── en
│   │       │   ├── privacy.mdx
│   │       │   └── terms.mdx
│   │       └── zh
│   │           ├── privacy.mdx
│   │           └── terms.mdx
│   ├── features
│   │   └── showcase
│   │       └── utils
│   │           ├── anthropic.ts
│   │           ├── graph.ts
│   │           ├── openai.ts
│   │           └── tools.ts
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── instrumentation.ts
│   ├── lib
│   │   ├── auth
│   │   │   ├── index.ts
│   │   │   ├── neo4j-adapter.ts
│   │   │   └── next-auth.ts
│   │   ├── i18n
│   │   │   └── request.ts
│   │   ├── neo4j.ts
│   │   ├── proxy.ts
│   │   └── utils.ts
│   ├── mdx-components.tsx
│   ├── middleware.ts
│   ├── providers
│   │   └── theme-provider.tsx
│   ├── styles
│   │   ├── fonts.ts
│   │   └── globals.css
│   ├── types
│   └── utils
├── tailwind.config.ts
└── tsconfig.json

46 directories, 140 files
````
