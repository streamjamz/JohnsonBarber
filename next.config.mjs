/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage public bucket (barber + gallery photos)
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default nextConfig;
