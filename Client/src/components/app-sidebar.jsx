"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  FileText,
  GalleryVerticalEnd,
  Home,
  LayoutGrid,
  MessageSquare,
  Users,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

import logoLight from "@/assets/images/logo-white.png"
import logoLetter from "@/assets/images/favicon.png"
import { RouteBlog, RouteCategories, RouteIndex } from "@/helpers/Route"
import { useCategoryStore } from "@/store/useCategoryStore"


// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  projects: [
    {
      name: "Home",
      url: RouteIndex,
      icon: Home,
    },
    {
      name: "Categories",
      url: RouteCategories,
      icon: LayoutGrid,
    },
    {
      name: "Blogs",
      url: RouteBlog,
      icon: FileText,
    },
    {
      name: "Comments",
      url: "#",
      icon: MessageSquare,
    },
    {
      name: "Users",
      url: "#",
      icon: Users,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { state } = useSidebar()
  const { categories, fetchCategories } = useCategoryStore()

  React.useEffect(() => {
    fetchCategories()
  }, [])

  const dynamicCategories = categories?.map(cat => ({
    name: cat.name,
    url: `/category/${cat.slug}`,
  })) || []

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-14 border-b flex items-center justify-center">
        {state === "collapsed" ? (
          <div className="flex aspect-square size-7 items-center justify-center rounded-lg">
            <img src={logoLetter} width={100} alt="logo" />
          </div>
        ) : (
          <div className="flex w-full items-center">
            <img src={logoLight} width={100} alt="logo" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} categories={dynamicCategories} />
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
