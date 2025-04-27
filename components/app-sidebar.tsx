import { ChevronDown, ChevronsUpDown, Home, LineChart, LogOut, Printer, Wallet } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignOutButton } from "@clerk/nextjs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

export const navItems = [
    {
        title: "Inicio",
        url: "/",
        icon: Home,
        subItems: null
    }, 
    {
        title: "Usuarios",
        url: "/usuarios",
        icon: Home,
        subItems: [
            {
                title: "Agregar",
                icon: LineChart,
                url: "/agregar",
            },
            {
                title: "Administrar",
                icon: Wallet,
                url: "/administrar",
            }
        ],
    },
]

interface AppSidebarProps {
    user: {
        name: string
        email: string
        avatarUrl: string
    }
}

export function AppSidebar(props: AppSidebarProps) {
  return (
    <Sidebar>
        <SidebarHeader>
            <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Printer className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Reparacion de Equipos</span>
                    <span className="text-xs">Espacio de trabajo</span>
                </div>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
            <SidebarGroupLabel>Gestion</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.subItems ? (
                      <Collapsible defaultOpen className="w-full">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton isActive={'isActive' in item && typeof item.isActive === 'boolean' ? item.isActive : false}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                  <a href={item.url + subItem.url}>
                                    <subItem.icon className="h-4 w-4 mr-2" />
                                    {subItem.title}
                                  </a>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton asChild isActive={'isActive' in item && typeof item.isActive === 'boolean' ? item.isActive : false}>
                        <a href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
                </SidebarMenu>
            </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="w-full flex flex-row justify-between data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <UserCard {...props.user} />
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[240px] w-full" align="end" side="right">
                <DropdownMenuLabel>
                    <UserCard {...props.user} />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <SignOutButton>
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesion</span>
                    </DropdownMenuItem>
                </SignOutButton>
                </DropdownMenuContent>
            </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  )
}

const UserCard = (props: AppSidebarProps['user']) => {
    return (
        <div className="grid grid-cols-[min-content_1fr] gap-3 min-w-0">
            <Avatar className="h-8 w-8">
                <AvatarImage src={props.avatarUrl} alt={props.name} />
                <AvatarFallback>{(props.name).charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid grid-rows-2 items-start text-left min-w-0">
                <p className="text-sm font-medium leading-none">{props.name}</p>
                <p className="text-xs text-muted-foreground leading-none mt-1 truncate">{props.email}</p>
            </div>
        </div>
    )
}
