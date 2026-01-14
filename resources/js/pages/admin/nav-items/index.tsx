import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

import { NavItemForm } from '@/components/app/admin/nav-item-form';
import { getColumns, NavItem } from '@/components/app/admin/nav-items/columns';
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
import admin from '@/routes/admin';
import { toast } from 'sonner';

export default function NavItemIndex({
    navItems,
    parents,
    permissions,
}: {
    navItems: any[];
    parents: any[];
    permissions: any[];
}) {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<NavItem | null>(null);

    const handleCreate = () => {
        setSelectedItem(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (item: NavItem) => {
        setSelectedItem(item);
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
                            toast.success('Menu deleted successfully.'),
                        onError: () => toast.error('Could not delete menu.'),
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
        <AppLayout breadcrumbs={[]}>
            <Head title="Menu Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                            <div className="space-y-1.5">
                                <CardTitle>Menu Management</CardTitle>
                                <CardDescription>
                                    Manage your application navigation
                                    structure.
                                </CardDescription>
                            </div>
                            <Button onClick={handleCreate}>
                                <Plus className="mr-2 h-4 w-4" /> Add Menu
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <DataTable columns={columns} data={navItems} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-full p-3 sm:max-w-md">
                    <SheetHeader className="px-1">
                        <SheetTitle>
                            {selectedItem ? 'Edit Menu' : 'Create Menu'}
                        </SheetTitle>
                        <SheetDescription>
                            {selectedItem
                                ? 'Update the navigation menu details below.'
                                : 'Add a new navigation menu to your application.'}
                        </SheetDescription>
                    </SheetHeader>

                    <ScrollArea className="mx-2 h-full pb-20">
                        <div className="p-1">
                            <NavItemForm
                                navItem={selectedItem}
                                parents={parents}
                                permissions={permissions}
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
