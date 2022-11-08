const nextTranslate = require('next-translate');
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        APP_DOMAIN: process.env.APP_DOMAIN,
        GRAPHQL_URL: process.env.GRAPHQL_URL,
        GRAPHQL_WS_URL: process.env.GRAPHQL_WS_URL,
        HTTPS_PROVIDER: process.env.HTTPS_PROVIDER,
        WSS_PROVIDER: process.env.WSS_PROVIDER,
        TRONLINK_NETWORK_EVENT: process.env.TRONLINK_NETWORK_EVENT,
        TRONLINK_NETWORK_NAME: process.env.TRONLINK_NETWORK_NAME,
        CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS: process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS,
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
