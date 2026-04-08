import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.yourapp',
  appName: 'InsightLoop',

  // ❌ REMOVE webDir completely
  // webDir: 'out',

  server: {
    url: 'https://vibe-hack26.vercel.app',
    cleartext: false
  }
};

export default config;