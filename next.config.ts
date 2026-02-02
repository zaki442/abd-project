import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'qdzvshchaoxjpnsrrjib.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
