import {
    LayoutGrid,
    Settings,
    Users,
    Circle,
    List
} from 'lucide-react';

export const IconMap: Record<string, any> = {
    LayoutGrid: LayoutGrid,
    Settings: Settings,
    Users: Users,
    List: List,
    Default: Circle
};

export const resolveIcon = (name?: string) => {
    if (!name) return IconMap.Default;
    return IconMap[name] || IconMap.Default;
};
