import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { usePage } from '@inertiajs/react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function AuthLayout({
    children,
    title,
    description,
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    const { config } = usePage().props as {
        config?: {
            recaptcha_site_key?: string;
        };
    };

    if (!config?.recaptcha_site_key) {
        return null;
    }

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={config.recaptcha_site_key}
            scriptProps={{ async: true, defer: true }}
        >
            <AuthLayoutTemplate
                title={title}
                description={description}
            >
                {children}
            </AuthLayoutTemplate>
        </GoogleReCaptchaProvider>
    );
}
