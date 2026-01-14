import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import admin from '@/routes/admin';
import { Permission, Role } from './roles/columns';

interface RoleFormProps {
    role: Role | null;
    allPermissions: Permission[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function RoleForm({ role, allPermissions, onSuccess, onCancel }: RoleFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: role?.name || '',
        permissions: role?.permissions.map((p) => p.name) || [],
    });

    useEffect(() => {
        if (role) {
            setData({
                name: role.name,
                permissions: role.permissions.map((p) => p.name),
            });
        } else {
            reset();
        }
    }, [role]);

    const handlePermissionChange = (permName: string, checked: boolean) => {
        const currentPerms = [...data.permissions];
        if (checked) {
            setData('permissions', [...currentPerms, permName]);
        } else {
            setData('permissions', currentPerms.filter((p) => p !== permName));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (role) {
            put(admin.roles.update(role.id).url, {
                onSuccess: () => {
                    toast.success(`Role "${data.name}" updated successfully.`);
                    reset();
                    onSuccess();
                },
                onError: () => toast.error('Failed to update role.'),
            });
        } else {
            // CREATE
            post(admin.roles.store().url, {
                onSuccess: () => {
                    toast.success(`Role "${data.name}" created successfully.`);
                    reset();
                    onSuccess();
                },
                onError: () => toast.error('Failed to create role.'),
            });
        }
    };

    const isSuperAdmin = role?.name === 'super-admin';

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="space-y-1">
                <Label htmlFor="name">Role Name</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="e.g. Editor"
                    disabled={isSuperAdmin} // Super Admin name gaboleh diganti
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                {isSuperAdmin && <p className="text-xs text-yellow-600">Super Admin name cannot be changed.</p>}
            </div>

            <div className="space-y-3">
                <Label>Permissions</Label>
                <div className="border rounded-md p-4 h-60 overflow-y-auto bg-gray-50/50">
                    <div className="grid grid-cols-1 gap-3">
                        {allPermissions.map((perm) => (
                            <div key={perm.id} className="flex items-start space-x-2">
                                <Checkbox
                                    id={`perm-${perm.id}`}
                                    checked={data.permissions.includes(perm.name)}
                                    onCheckedChange={(checked) =>
                                        handlePermissionChange(perm.name, checked as boolean)
                                    }
                                    disabled={isSuperAdmin} // Super admin auto all, disable checkbox
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor={`perm-${perm.id}`}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        {perm.name}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Select the access rights for this role.
                </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {role ? 'Save Changes' : 'Create Role'}
                </Button>
            </div>
        </form>
    );
}
