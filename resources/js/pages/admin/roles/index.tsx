import { RoleForm } from '@/components/app/admin/role-form';
import {
    getColumns,
    Permission,
    Role,
} from '@/components/app/admin/roles/columns';
import { DataTable } from '@/components/app/table/data-table';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function RoleIndex({
    roles,
    permissions,
}: {
    roles: Role[];
    permissions: Permission[];
}) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);

    const handleCreate = () => {
        setSelectedRole(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (role: Role) => {
        setSelectedRole(role);
        setIsSheetOpen(true);
    };

    const handleDelete = (id: number) => {
        toast('Are you sure?', {
            description: 'This action cannot be undone',
            action: {
                label: 'Delete',
                onClick: () => {
                    router.delete(admin.roles.destroy(id).url, {
                        onSuccess: () =>
                            toast.success('Role deleted successfully.'),
                        onError: () => toast.error('Could not delete role.'),
                    });
                },
            },
            cancel: {
                label: 'Cancel',
                onClick() {},
            },
        });
    };

    const columns = useMemo(
        () => getColumns(handleEdit, handleDelete),
        [handleEdit, handleDelete],
    );

    return (
        <AppLayout
            breadcrumbs={[{ title: 'Roles', href: admin.roles.index().url }]}
        >
            <Head title="Role Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1.5">
                                <CardTitle>Role Management</CardTitle>
                                <CardDescription>
                                    Define roles and assign permissions to
                                    control access.
                                </CardDescription>
                            </div>
                            <Button onClick={handleCreate}>
                                <Plus className="mr-2 h-4 w-4" /> Create Role
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={roles} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full p-3 sm:max-w-md">
                    <div className="flex h-full flex-col">
                        <SheetHeader className="px-1">
                            <SheetTitle>
                                {selectedRole ? 'Edit Role' : 'Create Role'}
                            </SheetTitle>
                            <SheetDescription>
                                {selectedRole
                                    ? 'Modify role details and permissions.'
                                    : 'Add a new role and setup access rights.'}
                            </SheetDescription>
                        </SheetHeader>

                        <ScrollArea className="mx-2 h-full pb-20">
                            <div className="p-1">
                                <RoleForm
                                    role={selectedRole}
                                    allPermissions={permissions}
                                    onSuccess={() => setIsSheetOpen(false)}
                                    onCancel={() => setIsSheetOpen(false)}
                                />
                            </div>
                        </ScrollArea>
                    </div>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
