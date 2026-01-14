import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveIcon } from '@/lib/icons';
import { NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const checkIsActive = (href: string) => {
        try {
            const itemUrl = new URL(href, window.location.origin);
            const itemPath = itemUrl.pathname;

            const currentPath = window.location.pathname;

            if (currentPath === itemPath) return true;
            if (currentPath.startsWith(itemPath + '/')) return true;

            return false;
        } catch (e) {
            return false;
        }
    };

    const isChildActive = (item: NavItem) => {
        return item.items?.some((subItem) =>
            checkIsActive(subItem.href as string),
        );
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const Icon = resolveIcon(item.icon as string);
                    const hasChildren = item.items && item.items.length > 0;

                    const isParentActive = isChildActive(item);

                    if (hasChildren) {
                        return (
                            <Collapsible
                                key={item.title}
                                asChild
                                defaultOpen={isParentActive}
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isParentActive}
                                        >
                                            {Icon && <Icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => {
                                                const isSubActive =
                                                    checkIsActive(
                                                        subItem.href as string,
                                                    );

                                                return (
                                                    <SidebarMenuSubItem
                                                        key={subItem.title}
                                                    >
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={
                                                                isSubActive
                                                            }
                                                        >
                                                            <Link
                                                                href={
                                                                    subItem.href
                                                                }
                                                                prefetch
                                                            >
                                                                <span>
                                                                    {
                                                                        subItem.title
                                                                    }
                                                                </span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        );
                    }

                    const isSingleActive = checkIsActive(item.href as string);

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isSingleActive}
                                tooltip={item.title}
                            >
                                <Link href={item.href} prefetch>
                                    {Icon && <Icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
