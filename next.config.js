/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 在构建时忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  // 移除自定义 webpack 配置，使用 Next.js 内置的 CSS 支持
}

module.exports = nextConfig 