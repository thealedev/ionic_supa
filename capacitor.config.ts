import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'auth-test',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
