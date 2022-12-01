const nextTranslate = require('next-translate');
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    env: {
        HTTPS_PROVIDER: process.env.HTTPS_PROVIDER,
        WSS_PROVIDER: process.env.WSS_PROVIDER
    },
    ...nextTranslate()
};

module.exports = nextConfig;
