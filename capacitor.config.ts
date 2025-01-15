import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'milla.dev.app',
  appName: 'milla-app',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "SplashScreen": {
      "launchShowDuration": 3000,
      "launchAutoHide": true,
      "androidScaleType": "CENTER_CROP",
      "splashImmersive": true,
      "backgroundColor": "#ffffff"
    }
  }
};

export default config;
