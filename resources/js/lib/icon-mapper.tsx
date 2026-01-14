import {
    LayoutGrid,
    Settings,
    Users,
    Home,
} from 'lucide-react';

const iconMap: Record<string, any> = {
    LayoutGrid,
    Settings,
    Users,
    Home,
    Default: LayoutGrid
};

export const getIcon = (iconName: string | null) => {
    if (!iconName) return null;
    return iconMap[iconName] || iconMap.Default;
};
