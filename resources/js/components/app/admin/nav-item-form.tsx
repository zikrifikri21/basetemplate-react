import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import admin from '@/routes/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface NavItemFormProps {
    navItem?: any;
    parents: any[];
    permissions: string[];
    onSuccess: () => void;
    onCancel: () => void;
}

export function NavItemForm({
    navItem,
    parents,
    permissions,
    onSuccess,
    onCancel,
}: NavItemFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: navItem?.title || '',
        route_name: navItem?.route_name || '',
        url: navItem?.url || '',
        icon: navItem?.icon || '',
        permission_name: navItem?.permission_name || '',
        parent_id: navItem?.parent_id ? String(navItem.parent_id) : '',
        order: navItem?.order || 0,
        is_active: navItem ? Boolean(navItem.is_active) : true,
    });

    useEffect(() => {
        reset();
        setData({
            title: navItem?.title || '',
            route_name: navItem?.route_name || '',
            url: navItem?.url || '',
            icon: navItem?.icon || '',
            permission_name: navItem?.permission_name || '',
            parent_id: navItem?.parent_id ? String(navItem.parent_id) : '',
            order: navItem?.order || 0,
            is_active: navItem ? Boolean(navItem.is_active) : true,
        });
    }, [navItem]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                reset();
                onSuccess();
            },
        };

        if (navItem) {
            put(admin.navItems.update(navItem.id).url, options);
        } else {
            post(admin.navItems.store().url, options);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Menu Title"
                />
                {errors.title && <span className="text-xs text-red-500">{errors.title}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Route Name */}
                <div className="grid gap-2">
                    <Label htmlFor="route_name">Route Name <span className="text-xs text-muted-foreground">(Rec)</span></Label>
                    <Input
                        id="route_name"
                        value={data.route_name}
                        onChange={(e) => setData('route_name', e.target.value)}
                        placeholder="dashboard"
                    />
                    {errors.route_name && <span className="text-xs text-red-500">{errors.route_name}</span>}
                </div>

                {/* URL */}
                <div className="grid gap-2">
                    <Label htmlFor="url">Or Raw URL</Label>
                    <Input
                        id="url"
                        value={data.url}
                        onChange={(e) => setData('url', e.target.value)}
                        placeholder="https://..."
                    />
                </div>
            </div>

            {/* Icon */}
            <div className="grid gap-2">
                <Label htmlFor="icon">Icon (Lucide Name)</Label>
                <Input
                    id="icon"
                    value={data.icon}
                    onChange={(e) => setData('icon', e.target.value)}
                    placeholder="e.g. Home, Settings, Users"
                />
                <p className="text-[10px] text-muted-foreground">
                    Lihat referensi icon di <a href="https://lucide.dev/icons" target="_blank" className="underline hover:text-primary">lucide.dev</a>
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label>Parent Menu</Label>
                    <Select
                        value={data.parent_id}
                        onValueChange={(val) => setData('parent_id', val === "root" ? "" : val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Parent" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="root">No Parent (Root)</SelectItem>
                            {parents.map((p) => (
                                <SelectItem key={p.id} value={String(p.id)}>
                                    {p.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Order */}
                <div className="grid gap-2">
                    <Label htmlFor="order">Order</Label>
                    <Input
                        id="order"
                        type="number"
                        value={data.order}
                        onChange={(e) => setData('order', parseInt(e.target.value))}
                    />
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Required Permission</Label>
                <Select
                    value={data.permission_name}
                    onValueChange={(val) => setData('permission_name', val === "public" ? "" : val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Permission" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public">Public (All Users)</SelectItem>
                        {permissions.map((perm) => (
                            <SelectItem key={perm} value={perm}>
                                {perm}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center space-x-2 rounded-md border p-3">
                <Checkbox
                    id="is_active"
                    checked={data.is_active}
                    onCheckedChange={(checked) => setData('is_active', checked === true)}
                />
                <Label htmlFor="is_active" className="cursor-pointer">
                    Active / Visible
                </Label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {navItem ? 'Update Menu' : 'Create Menu'}
                </Button>
            </div>
        </form>
    );
}
