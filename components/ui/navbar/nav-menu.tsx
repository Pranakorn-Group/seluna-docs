import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import Link from 'next/link'

const links = [
    { href: "/guide", label: "แนะนำการใช้งาน" },
    { href: "/changelog", label: "การอัพเดตระบบ" },
    { href: "/blog", label: "บทความ" }
];

export const NavMenu = (props: NavigationMenuProps) => (
    <NavigationMenu {...props}>
        <NavigationMenuList className="gap-3 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
            {links.map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                    <NavigationMenuLink asChild>
                        <Link
                            prefetch={false}
                            href={href}
                            className="text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-foreground after:transition-all hover:after:w-full hover:bg-transparent"
                        >
                            {label}
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            ))}
        </NavigationMenuList>
    </NavigationMenu>
);
