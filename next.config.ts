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
    allowedDevOrigins: ['192.168.1.26:3000','localhost:3000'],
};

export default withNextIntl(nextConfig);
