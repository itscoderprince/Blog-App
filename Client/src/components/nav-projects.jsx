"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CircleSmall } from "lucide-react";
import { Link } from "react-router-dom";

export function NavProjects({
  projects,
  categories
}) {
  const { isMobile, setOpenMobile } = useSidebar()

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarGroup>
      <SidebarMenu className="gap-1">
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name} className="h-10 text-[15px]">
              <Link to={item.url} onClick={handleLinkClick}>
                <item.icon className="!size-5" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarGroupLabel className="mt-4 text-xs font-semibold uppercase tracking-wider group-data-[collapsible=icon]:hidden">Categories</SidebarGroupLabel>
      <SidebarMenu className="pl-1.5 gap-1 group-data-[collapsible=icon]:hidden">
        {categories?.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name} className="h-9 text-[14px]">
              <Link to={item.url} className="flex items-center gap-2" onClick={handleLinkClick}>
                <CircleSmall className="!size-4" />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
