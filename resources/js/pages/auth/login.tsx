import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const form = useForm({
        email: '',
        password: '',
        remember: false,
        recaptcha_token: '',
    });

    const { data, setData, processing, errors, reset } = form;

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const handleSubmit: FormEventHandler = async (e) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            console.warn('reCAPTCHA not ready');
            return;
        }

        const token = await executeRecaptcha('login');

        form.transform((data) => ({
            ...data,
            recaptcha_token: token,
        }));

        form.post('/login', {
            preserveScroll: true,
            onFinish: () => {
                reset('password');
                form.transform((data) => data);
            },
        });
    };

    return (
        <>
            <Head title="Log in" />

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                            required
                            autoFocus
                            autoComplete="email"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="ml-auto text-sm"
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required
                            autoComplete="current-password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            checked={data.remember}
                            onCheckedChange={(checked) =>
                                setData('remember', !!checked)
                            }
                        />
                        <Label>Remember me</Label>
                    </div>

                    {errors.recaptcha_token && (
                        <div className="text-center text-sm text-red-500">
                            {errors.recaptcha_token}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        disabled={processing}
                    >
                        {processing && <Spinner className="mr-2" />}
                        Log in
                    </Button>
                </div>

                {canRegister && (
                    <div className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <TextLink href={register()}>
                            Sign up
                        </TextLink>
                    </div>
                )}

                {status && (
                    <div className="text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </form>
        </>
    );
}

Login.layout = (page: React.ReactNode) => (
    <AuthLayout
        title="Log in to your account"
        description="Enter your email and password below to log in"
    >
        {page}
    </AuthLayout>
);

export default Login;
