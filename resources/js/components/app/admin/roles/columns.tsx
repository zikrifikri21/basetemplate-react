import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

export type Permission = {
    id: number;
    name: string;
};

export type Role = {
    id: number;
    name: string;
    permissions: Permission[];
    created_at: string;
};

export const getColumns = (
    onEdit: (role: Role) => void,
    onDelete: (id: number) => void,
): ColumnDef<Role>[] => [
    {
        accessorKey: 'name',
        header: 'Role Name',
        cell: ({ row }) => <div className="font-bold capitalize">{row.getValue('name')}</div>,
    },
    {
        id: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
            const perms = row.original.permissions;
            if (row.original.name === 'super-admin') {
                 return <Badge variant="default" className="bg-emerald-600">All Permissions</Badge>;
            }
            return (
                <div className="flex flex-wrap gap-1">
                    {perms.length > 0 ? (
                        <Badge variant="secondary">{perms.length} Access</Badge>
                    ) : (
                        <span className="text-muted-foreground text-xs">No Access</span>
                    )}
                </div>
            );
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const role = row.original;
            const isSuperAdmin = role.name === 'super-admin';

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(role)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {!isSuperAdmin && (
                            <DropdownMenuItem
                                onClick={() => onDelete(role.id)}
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
