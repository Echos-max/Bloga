/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [

      // 修复 www.zaocn.top 配置
      {
        protocol: 'http',       // 注意：强烈建议改用 https
        hostname: 'www.zaocn.top',
        port: '',               // 显式设置为空字符串（HTTP 默认端口 80）
        pathname: '/uploads/**', // 确保路径匹配
      },
      // 额外建议：添加不带 www 的域名（如果可能被使用）
      {
        protocol: 'http',
        hostname: 'zaocn.top',   // 无 www 的域名
        port: '',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: true,
  },
};

module.exports = nextConfig;