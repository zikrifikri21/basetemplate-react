import { PageProps } from '@inertiajs/core';

declare module '@inertiajs/core' {
  interface PageProps {
    name: string;
    quote: {
      message: string;
      author: string;
    };
    auth: {
      user: any | null;
    };
    sidebarOpen: boolean;
    config: {
      recaptcha_site_key: string;
    };
  }
}
