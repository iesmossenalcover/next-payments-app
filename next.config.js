/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    CLIENT_ID_GOOGLE: process.env.CLIENT_ID_GOOGLE,
    SCHOOL_NAME: process.env.SCHOOL_NAME,
  }
}

module.exports = nextConfig
