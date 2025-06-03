declare module 'next-pwa' {
  import type { NextConfig } from 'next';
  
  export interface PWAConfig {
    dest: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    scope?: string;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: Array<string | RegExp>;
    fallbacks?: {
      [key: string]: string;
    };
    [key: string]: any;
  }
  
  export default function withPWA(pwaConfig: PWAConfig): (nextConfig: NextConfig) => NextConfig;
} 