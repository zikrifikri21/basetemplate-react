import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { User } from './users/columns';
import admin from '@/routes/admin';

interface UserFormProps {
    user: User | null;
    roles: string[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function UserForm({ user, roles, onSuccess, onCancel }: UserFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        role: user?.roles?.[0]?.name || '',
    });

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                password: '',
                password_confirmation: '',
                role: user.roles?.[0]?.name || '',
            });
        } else {
            reset();
        }
    }, [user]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (user) {
            // Edit Mode
            put(admin.users.update(user.id).url, {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        } else {
            // Create Mode
            post(admin.users.store().url, {
                onSuccess: () => {
                    reset();
                    onSuccess();
                },
            });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="John Doe"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="name@example.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <Select
                    value={data.role}
                    onValueChange={(val) => setData('role', val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role} value={role} className="capitalize">
                                {role}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                    <Label htmlFor="password">
                        Password {user && <span className="text-xs text-gray-400">(Optional)</span>}
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-1">
                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {user ? 'Save Changes' : 'Create User'}
                </Button>
            </div>
        </form>
    );
}
