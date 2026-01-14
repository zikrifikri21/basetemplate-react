import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from 'lucide-react';

export type NavItem = {
    id: number;
    parent_id: number | null;
    title: string;
    route_name: string | null;
    url: string | null;
    icon: string | null;
    permission_name: string | null;
    is_active: boolean | number;
    order: number;
};

const SortableHeader = ({ column, title }: { column: any; title: string }) => {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-4"
        >
            {title}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    );
};

export const getColumns = (
    onEdit: (item: NavItem) => void,
    onDelete: (id: number) => void,
): ColumnDef<NavItem>[] => [
    {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => {
            const item = row.original;
            return (
                <div className="flex flex-col">
                    <span
                        className={
                            item.parent_id
                                ? 'pl-6 text-muted-foreground'
                                : 'font-semibold'
                        }
                    >
                        {item.parent_id && '↳ '}
                        {item.title}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'route_name',
        header: 'Link (Route/url)',
        cell: ({ row }) => {
            const routeName = row.getValue('route_name') as string;
            const url = row.original.url;
            return routeName ? (
                <Badge variant="secondary" className="font-mono text-xs">
                    Route: {routeName}
                </Badge>
            ) : (
                <span className="font-mono text-xs text-muted-foreground">
                    {url || '-'}
                </span>
            );
        },
    },
    {
        accessorKey: 'icon',
        header: ({ column }) => <SortableHeader column={column} title="Icon" />,
        cell: ({ row }) => {
            const icon = row.getValue('icon') as string;
            return icon ? (
                <span className="text-sm text-muted-foreground">{icon}</span>
            ) : (
                '-'
            );
        },
    },
    {
        accessorKey: 'permission_name',
        header: ({ column }) => (
            <SortableHeader column={column} title="Permission" />
        ),
        cell: ({ row }) => (
            <span className="text-xs">
                {row.getValue('permission_name') || '-'}
            </span>
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => {
            const isActive = row.getValue('is_active');
            return isActive ? (
                <Badge className="bg-green-600 hover:bg-green-700">
                    Active
                </Badge>
            ) : (
                <Badge variant="destructive">Inactive</Badge>
            );
        },
    },
    {
        accessorKey: 'order',
        header: ({ column }) => (
            <SortableHeader column={column} title="Order" />
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue('order')}</div>
        ),
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const nav = row.original;

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
                        <DropdownMenuItem onClick={() => onEdit(nav)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(nav.id)}
                            className="text-red-600 focus:text-red-600"
                        >
                            <Trash className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
