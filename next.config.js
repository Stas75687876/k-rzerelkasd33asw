/** @type {import('next').NextConfig} */ 
const nextConfig = { 
  reactStrictMode: true, 
  swcMinify: false, 
  images: { 
    domains: ['images.unsplash.com', 'via.placeholder.com'], 
  }, 
  compiler: { 
    reactRemoveProperties: true, 
  } 
}; 
 
module.exports = nextConfig; 
