const nextTranslate = require('next-translate');
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        APP_DOMAIN: process.env.APP_DOMAIN,
        MORALIS_API_KEY: process.env.MORALIS_API_KEY,
        GRAPHQL_URL: process.env.GRAPHQL_URL,
        HTTPS_PROVIDER: process.env.HTTPS_PROVIDER,
        WSS_PROVIDER: process.env.WSS_PROVIDER,
        CHAIN_ID: process.env.CHAIN_ID,
        CHAIN: process.env.CHAIN,
        WAGMI_CHAIN: process.env.WAGMI_CHAIN,
        EVM_CHAIN: process.env.EVM_CHAIN,
        TOKEN_NAME: process.env.TOKEN_NAME,
        TOKEN_DECIMALS: process.env.TOKEN_DECIMALS,
        TOKEN_RPC_URL: process.env.TOKEN_RPC_URL,
        TOKEN_BLOCK_EXPLORER_URL: process.env.TOKEN_BLOCK_EXPLORER_URL
    },
    ...nextTranslate()
};

module.exports = nextConfig;
