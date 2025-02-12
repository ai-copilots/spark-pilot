/**
 * 获取启用的 OAuth providers
 * @returns 启用的 provider ID 数组
 */
export const getEnabledOAuthProviders = () => {
  return (process.env.ENABLED_OAUTH_PROVIDERS || '').split(',')
    .map(p => p.trim())
    .filter(Boolean) // 过滤掉空字符串
} 