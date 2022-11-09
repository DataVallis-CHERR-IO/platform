const nextTranslate = require('next-translate');
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    env: {
        GRAPHQL_URL: process.env.GRAPHQL_URL,
        GRAPHQL_WS_URL: process.env.GRAPHQL_WS_URL,
        TRONLINK_NETWORK_EVENT: process.env.TRONLINK_NETWORK_EVENT,
        TRONLINK_NETWORK_PROVIDER: process.env.TRONLINK_NETWORK_PROVIDER,
        TRONLINK_NETWORK_NAME: process.env.TRONLINK_NETWORK_NAME,
        CONTRACT_OWNER: process.env.CONTRACT_OWNER,
        CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS: process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS,
    },
    ...nextTranslate()
};

module.exports = nextConfig;
