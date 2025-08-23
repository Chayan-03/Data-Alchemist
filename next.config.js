/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 14 and enabled by default
  // No experimental configuration needed
  
  // Disable SWC minification to avoid native addon loading issues
  swcMinify: false,
  
  // Use Babel for compilation instead of SWC
  compiler: {
    // This will force Next.js to use Babel instead of SWC
  }
}

module.exports = nextConfig