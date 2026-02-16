import React from "react"
import { Outlet, useLocation, Link } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Bell,
  LogOut,
  LogInIcon,
  Plus,
  User,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Footer from "@/components/Footer"
import SearchInput from "@/components/SearchInput"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/useAuthStore"
import { RouteAddBlog, RouteProfile } from "@/helpers/Route"

/** simple mobile check */
const useIsMobile = () => {
  return window.matchMedia("(max-width: 768px)").matches
}

export default function Layout() {
  const location = useLocation()
  const pathSegments = location.pathname.split("/").filter(Boolean)
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const isMobile = useIsMobile()

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* HEADER */}
        <header className="sticky top-0 z-10 h-16 border-b bg-background/95 backdrop-blur flex items-center">
          <div className="flex flex-1 items-center justify-between gap-2 px-2 sm:px-4">
            <SidebarTrigger />

            <div className="flex-1 max-w-md mx-auto">
              <SearchInput />
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3">
              {!user && (
                <Button asChild className="rounded-full gap-2">
                  <Link to="/login">
                    <LogInIcon className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 rounded-full p-0 flex items-center justify-center ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <Avatar className="h-10 w-10 rounded-full border border-border/50 shadow-sm">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-52 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="px-3 p font-normal">
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">{user?.name}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to={RouteProfile} className="flex w-full items-center">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={RouteAddBlog} className="flex w-full items-center">
                          <Plus className="mr-2 h-4 w-4" />
                          Create blog
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="mr-2 h-4 w-4" />
                        Notifications
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 bg-red-100 cursor-pointer"
                      onClick={() => logout()}
                    >
                      <LogOut className="mr-2 h-4 w-4 hover:text-red-600 hover:bg-red-200" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col gap-4 p-2 sm:p-4 relative min-h-[calc(100vh-3.5rem)]">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {pathSegments.map((segment, index) => {
                const url = `/${pathSegments.slice(0, index + 1).join("/")}`
                const isLast = index === pathSegments.length - 1
                const label =
                  segment.charAt(0).toUpperCase() +
                  segment.slice(1).replace(/-/g, " ")

                return (
                  <React.Fragment key={url}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage>{label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link to={url}>{label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <Outlet />
        </div>

        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}
