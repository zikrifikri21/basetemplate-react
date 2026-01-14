import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { getColumns, User } from '@/components/app/admin/users/columns';
import { DataTable } from '@/components/app/table/data-table';

import { UserForm } from '@/components/app/admin/user-form';
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
import admin from '@/routes/admin';
import { toast } from 'sonner';

export default function UserIndex({
    users,
    roles,
}: {
    users: User[];
    roles: string[];
}) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleCreate = () => {
        setSelectedUser(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsSheetOpen(true);
    };

    const handleDelete = (id: number) => {
        toast('Are you sure?', {
            description: 'This action cannot be undone',
            action: {
                label: 'Delete',
                onClick: () => {
                    router.delete(admin.users.destroy(id).url, {
                        onSuccess: () =>
                            toast.success('User deleted successfully.'),
                        onError: () => toast.error('Could not delete user.'),
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
            breadcrumbs={[{ title: 'Users', href: admin.users.index().url }]}
        >
            <Head title="User Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1.5">
                                <CardTitle>User Management</CardTitle>
                                <CardDescription>
                                    Manage users, assign roles, and handle
                                    access control.
                                </CardDescription>
                            </div>
                            <Button onClick={handleCreate}>
                                <Plus className="mr-2 h-4 w-4" /> Add User
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={users} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full p-3 sm:max-w-md">
                    <SheetHeader className="px-1">
                        <SheetTitle>
                            {selectedUser ? 'Edit User' : 'Create User'}
                        </SheetTitle>
                        <SheetDescription>
                            {selectedUser
                                ? 'Update user details and role assignment.'
                                : 'Add a new user to the system.'}
                        </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="mx-2 h-full pb-20">
                        <div className="p-1">
                            <UserForm
                                user={selectedUser}
                                roles={roles}
                                onSuccess={() => setIsSheetOpen(false)}
                                onCancel={() => setIsSheetOpen(false)}
                            />
                        </div>
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </AppLayout>
    );
}
