const nextTranslate = require('next-translate');
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    env: {
        HTTPS_PROVIDER: process.env.HTTPS_PROVIDER,
        WSS_PROVIDER: process.env.WSS_PROVIDER,
        WALLET_CONNECT_PROJECT_ID: process.env.WALLET_CONNECT_PROJECT_ID
    },
    ...nextTranslate()
};

module.exports = nextConfig;
